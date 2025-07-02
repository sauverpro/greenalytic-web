
import express from 'express';
import { paginationMiddleware } from '../middlewares/paginationMiddleware.js';
import { isAdmin } from '../middlewares/isadmin.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { catchAsync } from '../middlewares/globaleerorshandling.js';
import {
  createEmissionData,
  getAllEmissionData,
  getEmissionDataById,
  getEmissionDataByVehicle,
  getEmissionDataByVehicleInterval,
  getEmissionDataByPlateNumber,
  updateEmissionData,
  deleteEmissionData,
  getEmissionStatistics
} from '../controllers/emissionController/emissionController.js';
import { vehicleDataController } from '../controllers/VehicleDataController.js';

const emissionRouter = express.Router();

// Emission data validation middleware
const validateEmissionData = (req, res, next) => {
  const { 
    vehicleId, 
    co2Percentage, 
    coPercentage, 
    o2Percentage, 
    hcPPM,
    noxPPM,
    pm25Level
  } = req.body;

  // Validate required fields for creation
  if (req.method === 'POST') {
    const requiredFields = ['vehicleId', 'co2Percentage', 'coPercentage', 'o2Percentage', 'hcPPM'];
    const missingFields = requiredFields.filter(field => req.body[field] === undefined || req.body[field] === null);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
  }

  // Validate vehicleId if provided
  if (vehicleId && (isNaN(parseInt(vehicleId)) || parseInt(vehicleId) <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid vehicle ID. Must be a positive integer.'
    });
  }

  // Validate emission values ranges
  const validations = [
    { field: 'co2Percentage', value: co2Percentage, min: 0, max: 20 },
    { field: 'coPercentage', value: coPercentage, min: 0, max: 10 },
    { field: 'o2Percentage', value: o2Percentage, min: 0, max: 25 },
    { field: 'hcPPM', value: hcPPM, min: 0, max: 10000 },
    { field: 'noxPPM', value: noxPPM, min: 0, max: 5000 },
    { field: 'pm25Level', value: pm25Level, min: 0, max: 500 }
  ];

  for (const validation of validations) {
    if (validation.value !== undefined && validation.value !== null) {
      if (isNaN(validation.value) || validation.value < validation.min || validation.value > validation.max) {
        return res.status(400).json({
          success: false,
          message: `${validation.field} must be a number between ${validation.min} and ${validation.max}`
        });
      }
    }
  }

  next();
};

// Apply pagination middleware to routes that need it
const paginatedRoutes = [
  '/',
  '/vehicle/:vehicleId',
  '/vehicle/:vehicleId/interval',
  '/plate/:plateNumber'
];

emissionRouter.use(paginatedRoutes, paginationMiddleware);

// CREATE ROUTES
// Create emission data
emissionRouter.post(
  '/',
  catchAsync(validateEmissionData),
  catchAsync(createEmissionData)
);

// READ ROUTES
// Get all emission data - Admin only
emissionRouter.get(
  '/',
  // catchAsync(isAuthenticated),
  // catchAsync(isAdmin),
  
  catchAsync(getAllEmissionData)
);

// Get emission statistics - Admin or Analyst
emissionRouter.get(
  '/statistics',
  paginationMiddleware,
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(getEmissionStatistics)
);

// Health check for emission service
emissionRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Emission service is healthy',
    timestamp: new Date().toISOString(),
    service: 'emission-api'
  });
});

// Get emission data by ID - Authenticated users
emissionRouter.get(
  '/:id',
  catchAsync(isAuthenticated),
  catchAsync(getEmissionDataById)
);

// Get emission data by vehicle - Vehicle owner or Admin
emissionRouter.get(
  '/vehicle/:vehicleId',
  catchAsync(getEmissionDataByVehicle)
);

// Get emission data by vehicle with time interval - Enhanced route using vehicleDataController
emissionRouter.get(
  '/vehicle/:vehicleId/timerange',
  paginationMiddleware,
  catchAsync(vehicleDataController.getEmissionsDataByTimeRange)
);

// Get emission data by vehicle interval - Original route
emissionRouter.get(
  '/vehicle/:vehicleId/interval',
  catchAsync(getEmissionDataByVehicleInterval)
);

// Get emission data by plate number - Admin only
emissionRouter.get(
  '/plate/:plateNumber',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(getEmissionDataByPlateNumber)
);



// UPDATE ROUTES
// Update emission data - Admin only
emissionRouter.put(
  '/:id',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(validateEmissionData),
  catchAsync(updateEmissionData)
);

// Patch emission data - Admin only
emissionRouter.patch(
  '/:id',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(updateEmissionData)
);

// DELETE ROUTES
// Delete emission data - Admin only
emissionRouter.delete(
  '/:id',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(deleteEmissionData)
);

// Soft delete emission data - Admin only
emissionRouter.patch(
  '/:id/deactivate',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    req.body = { deletedAt: new Date() };
    next();
  }),
  catchAsync(updateEmissionData)
);

// ENHANCED ROUTES using vehicleDataController
// Get dashboard emission analytics - Admin only
emissionRouter.get(
  '/analytics/dashboard',
  catchAsync(isAuthenticated),
  catchAsync(isAdmin),
  catchAsync(vehicleDataController.getDashboardCounts)
);

// UTILITY ROUTES


// Get emission thresholds
emissionRouter.get('/config/thresholds', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Emission thresholds retrieved successfully',
    data: {
      co2: { warning: 0.5, critical: 1.0 },
      co: { warning: 0.3, critical: 0.5 },
      hc: { warning: 200, critical: 400 },
      nox: { warning: 100, critical: 200 },
      pm25: { warning: 25, critical: 50 }
    }
  });
});

export default emissionRouter;