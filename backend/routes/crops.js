import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Helper to format crop dates for the frontend (YYYY-MM-DD)
const formatCrop = (crop) => {
  return {
    ...crop,
    plantedDate: crop.plantedDate ? crop.plantedDate.toISOString().split('T')[0] : '',
    expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.toISOString().split('T')[0] : '',
    createdAt: crop.createdAt ? crop.createdAt.toISOString() : undefined,
    updatedAt: crop.updatedAt ? crop.updatedAt.toISOString() : undefined,
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
// Includes crops owned by the user, OR legacy unassigned crops
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
    const crops = await prisma.crop.findMany({
      where: getOwnershipFilter(req.user.id)
    });
    
    const totalArea = crops.reduce((sum, crop) => sum + crop.fieldArea, 0);
    const activeGrowing = crops.filter(c => c.status === 'Growing' || c.status === 'Planted').length;
    
    // Dynamic Active Farms logic (e.g. 5 standard farms + 1 for each additional growing crops, or based on unique types)
    const uniqueTypesCount = new Set(crops.map(c => c.type)).size;
    const activeFarmsCount = Math.max(8, uniqueTypesCount + 5);

    // Weather alerts are triggered by active crops in specific conditions, or custom logic
    const weatherAlertsCount = crops.filter(c => c.status === 'Growing' && c.fieldArea > 5.0).length;

    res.status(200).json({
      activeFarms: activeFarmsCount,
      currentCrops: crops.length,
      weatherAlerts: weatherAlertsCount + 1, // base + dynamic alert
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
    if (!q) {
      const crops = await prisma.crop.findMany({
        where: getOwnershipFilter(req.user.id)
      });
      return res.status(200).json(crops.map(formatCrop));
    }

    const query = q.toLowerCase().trim();
    const results = await prisma.crop.findMany({
      where: {
        AND: [
          getOwnershipFilter(req.user.id),
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { variety: { contains: query, mode: 'insensitive' } },
              { type: { contains: query, mode: 'insensitive' } },
              { status: { contains: query, mode: 'insensitive' } },
            ]
          }
        ]
      }
    });

    res.status(200).json(results.map(formatCrop));
  } catch (error) {
    console.error('Search crops error:', error);
    res.status(500).json({ error: 'Failed to search crops.' });
  }
});

// 3. GET /api/crops - List all crops (authenticated)
router.get('/', requireAuth, async (req, res) => {
  try {
    const crops = await prisma.crop.findMany({
      where: getOwnershipFilter(req.user.id)
    });
    res.status(200).json(crops.map(formatCrop));
  } catch (error) {
    console.error('Fetch crops error:', error);
    res.status(500).json({ error: 'Failed to fetch crops list.' });
  }
});

// 4. GET /api/crops/:id - Get details of a single crop (authenticated)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const crop = await prisma.crop.findUnique({
      where: { id: req.params.id }
    });
    
    // Check existence and user authorization
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

    const newCrop = await prisma.crop.create({
      data: {
        name: req.body.name.trim(),
        variety: req.body.variety.trim(),
        type: req.body.type.trim(),
        status: req.body.status,
        plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
        expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
        fieldArea: parseFloat(req.body.fieldArea),
        userId: req.user.id // Associate crop with logged-in user
      }
    });

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

    const existingCrop = await prisma.crop.findUnique({ where: { id: req.params.id } });
    
    // Check ownership
    if (!existingCrop || (existingCrop.userId !== null && existingCrop.userId !== req.user.id)) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    const updatedCrop = await prisma.crop.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name.trim(),
        variety: req.body.variety.trim(),
        type: req.body.type.trim(),
        status: req.body.status,
        plantedDate: (req.body.status !== 'Planned' && req.body.plantedDate) ? new Date(req.body.plantedDate) : null,
        expectedHarvestDate: req.body.expectedHarvestDate ? new Date(req.body.expectedHarvestDate) : null,
        fieldArea: parseFloat(req.body.fieldArea),
        userId: req.user.id // Claim ownership if it was a legacy unassigned crop
      }
    });

    res.status(200).json(formatCrop(updatedCrop));
  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ error: 'Failed to update crop entry.' });
  }
});

// 7. DELETE /api/crops/:id - Delete a crop entry (authenticated)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const existingCrop = await prisma.crop.findUnique({ where: { id: req.params.id } });
    
    // Check ownership
    if (!existingCrop || (existingCrop.userId !== null && existingCrop.userId !== req.user.id)) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    await prisma.crop.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send(); // 204 No Content returns no body
  } catch (error) {
    console.error('Delete crop error:', error);
    res.status(500).json({ error: 'Failed to delete crop entry.' });
  }
});

export default router;
