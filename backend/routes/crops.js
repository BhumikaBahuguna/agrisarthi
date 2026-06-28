import { Router } from 'express';

const router = Router();

// In-memory data store for Crops
let crops = [
  {
    id: 'crop-1',
    name: 'Rice',
    variety: 'Basmati 370',
    type: 'Grain',
    status: 'Growing',
    plantedDate: '2026-06-01',
    expectedHarvestDate: '2026-10-15',
    fieldArea: 5.5
  },
  {
    id: 'crop-2',
    name: 'Wheat',
    variety: 'Kalyan Sona',
    type: 'Grain',
    status: 'Planned',
    plantedDate: '2026-11-05',
    expectedHarvestDate: '2027-04-10',
    fieldArea: 8.0
  },
  {
    id: 'crop-3',
    name: 'Tomato',
    variety: 'Roma',
    type: 'Vegetable',
    status: 'Planted',
    plantedDate: '2026-06-20',
    expectedHarvestDate: '2026-09-25',
    fieldArea: 2.5
  },
  {
    id: 'crop-4',
    name: 'Cotton',
    variety: 'Bt Cotton II',
    type: 'Cash Crop',
    status: 'Growing',
    plantedDate: '2026-05-15',
    expectedHarvestDate: '2026-11-20',
    fieldArea: 6.2
  },
  {
    id: 'crop-5',
    name: 'Sugarcane',
    variety: 'Co 86032',
    type: 'Cash Crop',
    status: 'Harvested',
    plantedDate: '2025-06-10',
    expectedHarvestDate: '2026-05-30',
    fieldArea: 12.0
  },
  {
    id: 'crop-6',
    name: 'Maize',
    variety: 'Ganga 5',
    type: 'Grain',
    status: 'Growing',
    plantedDate: '2026-05-28',
    expectedHarvestDate: '2026-09-10',
    fieldArea: 4.8
  }
];

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

// 1. GET /api/crops/stats - Calculate dashboard statistics
router.get('/stats', (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to calculate stats.' });
  }
});

// 2. GET /api/crops/search - Search crops
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json(crops);
    }

    const query = q.toLowerCase().trim();
    const results = crops.filter(crop => 
      crop.name.toLowerCase().includes(query) ||
      crop.variety.toLowerCase().includes(query) ||
      crop.type.toLowerCase().includes(query) ||
      crop.status.toLowerCase().includes(query)
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search crops.' });
  }
});

// 3. GET /api/crops - List all crops
router.get('/', (req, res) => {
  try {
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crops list.' });
  }
});

// 4. GET /api/crops/:id - Get details of a single crop
router.get('/:id', (req, res) => {
  try {
    const crop = crops.find(c => c.id === req.params.id);
    if (!crop) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }
    res.status(200).json(crop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crop details.' });
  }
});

// 5. POST /api/crops - Create a new crop entry
router.post('/', (req, res) => {
  try {
    const validationErrors = validateCrop(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: `Validation error: ${validationErrors.join(' | ')}` });
    }

    const newCrop = {
      id: `crop-${Date.now()}`,
      name: req.body.name.trim(),
      variety: req.body.variety.trim(),
      type: req.body.type.trim(),
      status: req.body.status,
      plantedDate: req.body.status === 'Planned' ? '' : req.body.plantedDate,
      expectedHarvestDate: req.body.expectedHarvestDate,
      fieldArea: parseFloat(req.body.fieldArea)
    };

    crops.push(newCrop);
    res.status(201).json(newCrop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create crop entry.' });
  }
});

// 6. PUT /api/crops/:id - Update an existing crop entry
router.put('/:id', (req, res) => {
  try {
    const cropIndex = crops.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    const validationErrors = validateCrop(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: `Validation error: ${validationErrors.join(' | ')}` });
    }

    const updatedCrop = {
      id: req.params.id,
      name: req.body.name.trim(),
      variety: req.body.variety.trim(),
      type: req.body.type.trim(),
      status: req.body.status,
      plantedDate: req.body.status === 'Planned' ? '' : req.body.plantedDate,
      expectedHarvestDate: req.body.expectedHarvestDate,
      fieldArea: parseFloat(req.body.fieldArea)
    };

    crops[cropIndex] = updatedCrop;
    res.status(200).json(updatedCrop);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update crop entry.' });
  }
});

// 7. DELETE /api/crops/:id - Delete a crop entry
router.delete('/:id', (req, res) => {
  try {
    const cropIndex = crops.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) {
      return res.status(404).json({ error: `Crop with ID '${req.params.id}' not found.` });
    }

    crops.splice(cropIndex, 1);
    res.status(204).send(); // 204 No Content returns no body
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete crop entry.' });
  }
});

export default router;
