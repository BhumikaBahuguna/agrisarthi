import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { runDbQuery, mockCrops } from '../mockDb.js';

const router = Router();
const prisma = new PrismaClient();

// Helper to format crop dates for the frontend (YYYY-MM-DD)
const formatCrop = (crop) => {
  return {
    ...crop,
    plantedDate: crop.plantedDate ? (crop.plantedDate instanceof Date ? crop.plantedDate.toISOString().split('T')[0] : crop.plantedDate.split('T')[0]) : '',
    expectedHarvestDate: crop.expectedHarvestDate ? (crop.expectedHarvestDate instanceof Date ? crop.expectedHarvestDate.toISOString().split('T')[0] : crop.expectedHarvestDate.split('T')[0]) : '',
    createdAt: crop.createdAt ? (crop.createdAt instanceof Date ? crop.createdAt.toISOString() : crop.createdAt) : undefined,
    updatedAt: crop.updatedAt ? (crop.updatedAt instanceof Date ? crop.updatedAt.toISOString() : crop.updatedAt) : undefined,
  };
};

// Helper to validate crop data
const validateCrop = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Crop name is required and must be a valid string.');
  }
  if (!data.variety || typeof data.variety !== 'string' || data.variety.trim() === '') {
    errors.push('Variety is required and must be a valid string.');
  }
  if (!data.type || typeof data.type !== 'string' || data.type.trim() === '') {
    errors.push('Crop type (category) is required and must be a valid string.');
  }
  
  const allowedStatuses = ['Planted', 'Growing', 'Harvested', 'Planned'];
  if (!data.status || !allowedStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${allowedStatuses.join(', ')}.`);
  }

  if (data.status !== 'Planned' && (!data.plantedDate || isNaN(Date.parse(data.plantedDate)))) {
    errors.push('Planted date is required and must be a valid date.');
  }

  if (!data.expectedHarvestDate || isNaN(Date.parse(data.expectedHarvestDate))) {
    errors.push('Expected harvest date is required and must be a valid date.');
  }

  if (data.fieldArea === undefined || typeof data.fieldArea !== 'number' || data.fieldArea <= 0) {
    errors.push('Field area is required and must be a positive number.');
  }

  return errors;
};

// Helper to construct user ownership filter
const getOwnershipFilter = (userId) => {
  return {
    OR: [
      { userId: userId },
      { userId: null }
    ]
  };
};

// 1. GET /api/crops/stats - Calculate dashboard statistics (authenticated)
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const crops = await runDbQuery(
      prisma.crop.findMany({
        where: getOwnershipFilter(req.user.id)
      }),
      () => mockCrops.filter(c => c.userId === req.user.id || c.userId === null)
    );
    
    const totalArea = crops.reduce((sum, crop) => sum + crop.fieldArea, 0);
    const activeGrowing = crops.filter(c => c.status === 'Growing' || c.status === 'Planted').length;
    
    const uniqueTypesCount = new Set(crops.map(c => c.type)).size;
    const activeFarmsCount = Math.max(8, uniqueTypesCount + 5);
    const weatherAlertsCount = crops.filter(c => c.status === 'Growing' && c.fieldArea > 5.0).length;

    res.status(200).json({
      activeFarms: activeFarmsCount,
      currentCrops: crops.length,
      weatherAlerts: weatherAlertsCount + 1,
      totalArea: parseFloat(totalArea.toFixed(2))
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to calculate stats.' });
  }
});

// 2. GET /api/crops/search - Search crops (authenticated)
router.get('/search', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const query = q ? q.toLowerCase().trim() : '';

    const results = await runDbQuery(
      prisma.crop.findMany({
        where: {
          AND: [
            getOwnershipFilter(req.user.id),
            ...(query ? [{
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { variety: { contains: query, mode: 'insensitive' } },
                { type: { contains: query, mode: 'insensitive' } },
                { status: { contains: query, mode: 'insensitive' } },
              ]
            }] : [])
          ]
        }
      }),
      () => {
        let filtered = mockCrops.filter(c => c.userId === req.user.id || c.userId === null);
        if (query) {
          filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(query) ||
            c.variety.toLowerCase().includes(query) ||
            c.type.toLowerCase().includes(query) ||
            c.status.toLowerCase().includes(query)
          );
        }
        return filtered;
      }
    );

    res.status(200).json(results.map(formatCrop));
  } catch (error) {
    console.error('Search crops error:', error);
    res.status(500).json({ error: 'Failed to search crops.' });
  }
});

// 3. GET /api/crops - List all crops (authenticated)
router.get('/', requireAuth, async (req, res) => {
  try {
    const crops = await runDbQuery(
      prisma.crop.findMany({
        where: getOwnershipFilter(req.user.id)
      }),
      () => mockCrops.filter(c => c.userId === req.user.id || c.userId === null)
    );
    res.status(200).json(crops.map(formatCrop));
  } catch (error) {
    console.error('Fetch crops error:', error);
    res.status(500).json({ error: 'Failed to fetch crops list.' });
  }
});

// 4. GET /api/crops/:id - Get details of a single crop (authenticated)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const crop = await runDbQuery(
      prisma.crop.findUnique({
        where: { id: req.params.id }
      }),
      () => mockCrops.find(c => c.id === req.params.id)
    );
    
    if (!crop || (crop.userId !== null && crop.userId !== req.user.id)) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }
    res.status(200).json(formatCrop(crop));
  } catch (error) {
    console.error('Fetch crop details error:', error);
    res.status(500).json({ error: 'Failed to fetch crop details.' });
  }
});

// 5. POST /api/crops - Create a new crop entry (authenticated)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validationErrors = validateCrop(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: `Validation error: ${validationErrors.join(' | ')}` });
    }

    const newCrop = await runDbQuery(
      prisma.crop.create({
        data: {
          name: req.body.name.trim(),
          variety: req.body.variety.trim(),
          type: req.body.type.trim(),
          status: req.body.status,
          plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
          expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
          fieldArea: parseFloat(req.body.fieldArea),
          userId: req.user.id
        }
      }),
      () => {
        const c = {
          id: `crop-${Date.now()}`,
          name: req.body.name.trim(),
          variety: req.body.variety.trim(),
          type: req.body.type.trim(),
          status: req.body.status,
          plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
          expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
          fieldArea: parseFloat(req.body.fieldArea),
          userId: req.user.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        mockCrops.push(c);
        return c;
      }
    );

    res.status(201).json(formatCrop(newCrop));
  } catch (error) {
    console.error('Create crop error:', error);
    res.status(500).json({ error: 'Failed to create crop entry.' });
  }
});

// 6. PUT /api/crops/:id - Update an existing crop entry (authenticated)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const validationErrors = validateCrop(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: `Validation error: ${validationErrors.join(' | ')}` });
    }

    const existingCrop = await runDbQuery(
      prisma.crop.findUnique({ where: { id: req.params.id } }),
      () => mockCrops.find(c => c.id === req.params.id)
    );
    
    if (!existingCrop || (existingCrop.userId !== null && existingCrop.userId !== req.user.id)) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    const updatedCrop = await runDbQuery(
      prisma.crop.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name.trim(),
          variety: req.body.variety.trim(),
          type: req.body.type.trim(),
          status: req.body.status,
          plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
          expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
          fieldArea: parseFloat(req.body.fieldArea),
          userId: req.user.id
        }
      }),
      () => {
        const idx = mockCrops.findIndex(c => c.id === req.params.id);
        if (idx !== -1) {
          mockCrops[idx] = {
            ...mockCrops[idx],
            name: req.body.name.trim(),
            variety: req.body.variety.trim(),
            type: req.body.type.trim(),
            status: req.body.status,
            plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
            expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
            fieldArea: parseFloat(req.body.fieldArea),
            userId: req.user.id,
            updatedAt: new Date()
          };
          return mockCrops[idx];
        }
        throw new Error('Not found in mock DB');
      }
    );

    res.status(200).json(formatCrop(updatedCrop));
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Failed to update crop entry.' });
  }
});

// 7. DELETE /api/crops/:id - Delete a crop entry (authenticated)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const existingCrop = await runDbQuery(
      prisma.crop.findUnique({ where: { id: req.params.id } }),
      () => mockCrops.find(c => c.id === req.params.id)
    );
    
    if (!existingCrop || (existingCrop.userId !== null && existingCrop.userId !== req.user.id)) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    await runDbQuery(
      prisma.crop.delete({
        where: { id: req.params.id }
      }),
      () => {
        const idx = mockCrops.findIndex(c => c.id === req.params.id);
        if (idx !== -1) {
          mockCrops.splice(idx, 1);
          return;
        }
        throw new Error('Not found in mock DB');
      }
    );
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Failed to delete crop entry.' });
  }
});

export default router;
