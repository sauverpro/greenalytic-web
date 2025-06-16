import express from 'express';
import { verifyingtoken } from "../utils/jwtfunctions.js";
import { isAdmin } from '../middlewares/isadmin.js';
import paginationMiddleware from '../middlewares/paginationMiddleware.js';
import { catchAsync, AppError } from '../middlewares/globaleerorshandling.js';
import { addVehicleToUser, deleteVehicle, updateVehicleById } from '../controllers/vehicleControllers/addVehicleToUserController.js';
import {
  getVehicleByIdController,
  getAllVehiclesController,
  getVehiclesByUserIdController,
} from "../controllers/vehicleControllers/gettingvehiclesControllers.js";
import { getVehicleHistoryController } from '../controllers/vehicleControllers/vehicleHistory.js';
import { vehicleDataController } from '../controllers/VehicleDataController.js';

const VehicleRouter = express.Router();

// Vehicle validation middleware
const validateVehicleData = (req, res, next) => {
  const { 
    plateNumber, 
    vehicleModel, 
    vehicleType,
    fuelType,
    status,
    emissionStatus,
    yearOfManufacture,
    engineCapacity
  } = req.body;

  // Validate required fields for creation
  if (req.method === 'POST') {
    const requiredFields = ['plateNumber', 'vehicleModel', 'vehicleType', 'fuelType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(new AppError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      ));
    }
  }

  // Validate plate number format
  if (plateNumber) {
    if (typeof plateNumber !== 'string' || plateNumber.length < 3) {
      return next(new AppError(
        'Plate number must be at least 3 characters long',
        400
      ));
    }
  }

  // Validate vehicle model
  if (vehicleModel) {
    if (typeof vehicleModel !== 'string' || vehicleModel.length < 2) {
      return next(new AppError(
        'Vehicle model must be at least 2 characters long',
        400
      ));
    }
  }

  // Validate vehicle type
  if (vehicleType) {
    const validVehicleTypes = ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'];
    if (!validVehicleTypes.includes(vehicleType)) {
      return next(new AppError(
        `Invalid vehicle type. Must be one of: ${validVehicleTypes.join(', ')}`,
        400
      ));
    }
  }

  // Validate fuel type
  if (fuelType) {
    const validFuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
    if (!validFuelTypes.includes(fuelType)) {
      return next(new AppError(
        `Invalid fuel type. Must be one of: ${validFuelTypes.join(', ')}`,
        400
      ));
    }
  }

  // Validate status
  if (status) {
    const validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      ));
    }
  }

  // Validate emission status
  if (emissionStatus) {
    const validEmissionStatuses = ['LOW', 'NORMAL', 'HIGH'];
    if (!validEmissionStatuses.includes(emissionStatus)) {
      return next(new AppError(
        `Invalid emission status. Must be one of: ${validEmissionStatuses.join(', ')}`,
        400
      ));
    }
  }

  // Validate year of manufacture
  if (yearOfManufacture) {
    const currentYear = new Date().getFullYear();
    const year = parseInt(yearOfManufacture);
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      return next(new AppError(
        `Year of manufacture must be between 1900 and ${currentYear + 1}`,
        400
      ));
    }
  }

  // Validate engine capacity
  if (engineCapacity) {
    const capacity = parseFloat(engineCapacity);
    if (isNaN(capacity) || capacity <= 0 || capacity > 20) {
      return next(new AppError(
        'Engine capacity must be a positive number less than or equal to 20 liters',
        400
      ));
    }
  }

  next();
};

// ID validation middleware
const validateIds = (req, res, next) => {
  const { vehicleId, userId, id } = req.params;

  if (vehicleId && (isNaN(parseInt(vehicleId)) || parseInt(vehicleId) <= 0)) {
    return next(new AppError('Invalid vehicle ID. Must be a positive integer.', 400));
  }

  if (userId && (isNaN(parseInt(userId)) || parseInt(userId) <= 0)) {
    return next(new AppError('Invalid user ID. Must be a positive integer.', 400));
  }

  if (id && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
    return next(new AppError('Invalid ID. Must be a positive integer.', 400));
  }

  next();
};

// User access validation middleware
const validateUserAccess = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const requestingUserId = req.userId; // From verifying token middleware
  

  // Allow access if user is accessing their own data or if they're admin
  if (parseInt(userId) === parseInt(requestingUserId) || req.adminUser) {
    return next();
  }

  return next(new AppError('Access denied. You can only access your own vehicles.', 403));
});

// Vehicle ownership validation
const validateVehicleOwnership = catchAsync(async (req, res, next) => {
  const { vehicleId } = req.params;
  const requestingUserId = req.userId;

  // Admin can access any vehicle
  if (req.adminUser) {
    return next();
  }

  // For regular users, validate ownership through your vehicle service
  // This would need to be implemented in your vehicle controller
  // For now, we'll allow the controller to handle this validation
  next();
});

// PUBLIC ROUTES (No authentication required)
// Health check
VehicleRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle service is healthy',
    timestamp: new Date().toISOString(),
    service: 'vehicle-api'
  });
});

// Get vehicle configuration
VehicleRouter.get('/config/enums', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vehicle configuration retrieved successfully',
    data: {
      vehicleTypes: ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'],
      fuelTypes: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'],
      statuses: ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'],
      emissionStatuses: ['LOW', 'NORMAL', 'HIGH'],
    }
  });
});

// PROTECTED ROUTES (Authentication required)
// Apply authentication middleware to all routes below
VehicleRouter.use(catchAsync(verifyingtoken));

// ADMIN ONLY ROUTES
// Get all vehicles - Admin only
VehicleRouter.get(
  '/all',
  catchAsync(isAdmin),
  paginationMiddleware,
  catchAsync(getAllVehiclesController)
);

// Get dashboard data - Admin only
VehicleRouter.get(
  "/data/dashboard",
  catchAsync(isAdmin),
  catchAsync(vehicleDataController.getDashboardCounts)
);

// Get map data - Admin only
VehicleRouter.get(
  "/data/map",
  catchAsync(isAdmin),
  catchAsync(vehicleDataController.getMapData)
);

// USER ACCESS ROUTES
// Get logged user's vehicles
VehicleRouter.get(
  "/",
  paginationMiddleware,
  catchAsync(vehicleDataController.getVehiclesByLoggedUser)
);

// Get vehicles by user ID - User themselves or Admin
VehicleRouter.get(
  "/user/:userId/vehicles",
  validateIds,
  catchAsync(validateUserAccess),
  paginationMiddleware,
  catchAsync(getVehiclesByUserIdController)
);

// VEHICLE MANAGEMENT ROUTES
// Add vehicle to user - User can add to themselves or Admin can add to anyone
VehicleRouter.post(
  '/add/:userId',
  validateIds,
  catchAsync(validateUserAccess),
  catchAsync(validateVehicleData),
  catchAsync(addVehicleToUser)
);

// Get vehicle by ID - Vehicle owner or Admin
VehicleRouter.get(
  '/:id',
  validateIds,
  catchAsync(validateVehicleOwnership),
  catchAsync(getVehicleByIdController)
);

// Update vehicle - Vehicle owner or Admin
VehicleRouter.patch(
  "/:vehicleId",
  validateIds,
  catchAsync(validateVehicleOwnership),
  catchAsync(validateVehicleData),
  catchAsync(updateVehicleById)
);

// Delete vehicle - Vehicle owner or Admin
VehicleRouter.delete(
  '/:vehicleId',
  validateIds,
  catchAsync(validateVehicleOwnership),
  catchAsync(deleteVehicle)
);

// VEHICLE DATA ROUTES
// Get vehicle history - Vehicle owner or Admin
VehicleRouter.get(
  '/:vehicleId/history',
  validateIds,
  catchAsync(validateVehicleOwnership),
  paginationMiddleware,
  catchAsync(getVehicleHistoryController)
);

// Get emissions data by time range - Vehicle owner or Admin
VehicleRouter.get(
  '/:vehicleId/emissions/range',
  validateIds,
  catchAsync(validateVehicleOwnership),
  paginationMiddleware,
  catchAsync(vehicleDataController.getEmissionsDataByTimeRange)
);

// Get fuel data by time range - Vehicle owner or Admin
VehicleRouter.get(
  '/:vehicleId/fuels/range',
  validateIds,
  catchAsync(validateVehicleOwnership),
  paginationMiddleware,
  catchAsync(vehicleDataController.getFuelsDataByTimeRange)
);

// Get GPS data by time range - Vehicle owner or Admin
VehicleRouter.get(
  '/:vehicleId/gps/range',
  validateIds,
  catchAsync(validateVehicleOwnership),
  paginationMiddleware,
  catchAsync(vehicleDataController.getGPSDataByTimeRange)
);

// VEHICLE STATUS MANAGEMENT
// Update vehicle status - Admin or Fleet Manager only
VehicleRouter.patch(
  '/:vehicleId/status',
  validateIds,
  catchAsync(isAdmin), // Change to role-based when you have role middleware
  catchAsync((req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError('Status is required', 400));
    }
    
    const validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      ));
    }
    
    next();
  }),
  catchAsync(updateVehicleById)
);

// Update emission status - Admin only
VehicleRouter.patch(
  '/:vehicleId/emission-status',
  validateIds,
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    const { emissionStatus } = req.body;
    
    if (!emissionStatus) {
      return next(new AppError('Emission status is required', 400));
    }
    
    const validEmissionStatuses = ['LOW', 'NORMAL', 'HIGH'];
    if (!validEmissionStatuses.includes(emissionStatus)) {
      return next(new AppError(
        `Invalid emission status. Must be one of: ${validEmissionStatuses.join(', ')}`,
        400
      ));
    }
    
    next();
  }),
  catchAsync(updateVehicleById)
);

// Soft delete vehicle - Admin only
VehicleRouter.patch(
  '/:vehicleId/deactivate',
  validateIds,
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    req.body = { deletedAt: new Date(),
      status: 'INACTIVE_DISCONNECTED'  //
     };
    next();
  }),
  catchAsync(updateVehicleById)
);

export default VehicleRouter;