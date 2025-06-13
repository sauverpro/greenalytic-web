import express from 'express';
import { paginationMiddleware } from '../middlewares/paginationMiddleware.js';
import { isAdmin } from '../middlewares/isadmin.js';
import { catchAsync, AppError } from '../middlewares/globaleerorshandling.js';
import {
  removeTrackingDevice,
  deleteVehicleAndTrackingDevice,
  getTrackingDeviceStatus,
  getAllTrackingDevices,
  getTrackingDeviceById,
  getTrackingDevicesByVehicleId,
  addTrackingDeviceToVehicle,
  getTrackingDevicesByUser,
  getDeviceDetails,
  updateTrackingDeviceById
} from '../controllers/trackingDeviceController.js';

const deviceRouter = express.Router();

// Tracking device validation middleware
const validateTrackingDeviceData = (req, res, next) => {
  const { 
    serialNumber, 
    model, 
    deviceCategory,
    status,
    batteryLevel,
    signalStrength
  } = req.body;

  // Validate required fields for creation
  if (req.method === 'POST') {
    const requiredFields = ['serialNumber', 'model', 'deviceCategory'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(new AppError(
        `Missing required fields: ${missingFields.join(', ')}`,
        400
      ));
    }
  }

  // Validate serial number format
  if (serialNumber) {
    if (typeof serialNumber !== 'string' || serialNumber.length < 5) {
      return next(new AppError(
        'Serial number must be at least 5 characters long',
        400
      ));
    }
  }

  // Validate model
  if (model) {
    if (typeof model !== 'string' || model.length < 2) {
      return next(new AppError(
        'Model must be at least 2 characters long',
        400
      ));
    }
  }

  // Validate device category
  if (deviceCategory) {
    const validCategories = ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER'];
    if (!validCategories.includes(deviceCategory)) {
      return next(new AppError(
        `Invalid device category. Must be one of: ${validCategories.join(', ')}`,
        400
      ));
    }
  }

  // Validate status
  if (status) {
    const validStatuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'LOST'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      ));
    }
  }

  // Validate battery level
  if (batteryLevel !== undefined) {
    const parsedBatteryLevel = parseFloat(batteryLevel);
    if (isNaN(parsedBatteryLevel) || parsedBatteryLevel < 0 || parsedBatteryLevel > 100) {
      return next(new AppError(
        'Battery level must be a number between 0 and 100',
        400
      ));
    }
  }

  // Validate signal strength
  if (signalStrength !== undefined) {
    const parsedSignalStrength = parseFloat(signalStrength);
    if (isNaN(parsedSignalStrength) || parsedSignalStrength < 0 || parsedSignalStrength > 100) {
      return next(new AppError(
        'Signal strength must be a number between 0 and 100',
        400
      ));
    }
  }

  next();
};

// Validate vehicle and device IDs
const validateIds = (req, res, next) => {
  const { vehicleId, deviceId, userId } = req.params;

  if (vehicleId && (isNaN(parseInt(vehicleId)) || parseInt(vehicleId) <= 0)) {
    return next(new AppError('Invalid vehicle ID. Must be a positive integer.', 400));
  }

  if (deviceId && (isNaN(parseInt(deviceId)) || parseInt(deviceId) <= 0)) {
    return next(new AppError('Invalid device ID. Must be a positive integer.', 400));
  }

  if (userId && (isNaN(parseInt(userId)) || parseInt(userId) <= 0)) {
    return next(new AppError('Invalid user ID. Must be a positive integer.', 400));
  }

  next();
};

// User ownership validation middleware
const validateUserAccess = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const requestingUserId = req.userId; // From auth middleware

  // Allow access if user is accessing their own data or if they're admin
  if (parseInt(userId) === parseInt(requestingUserId) || req.adminUser) {
    return next();
  }

  return next(new AppError('Access denied. You can only access your own devices.', 403));
});

// Apply pagination to routes that return multiple items
const paginatedRoutes = [
  '/all',
  '/:userId/devices',
  '/vehicle/:vehicleId/devices'
];

deviceRouter.use(paginatedRoutes, paginationMiddleware);

// CREATE ROUTES
// Add tracking device to vehicle - Admin or vehicle owner
deviceRouter.post(
  '/add/:vehicleId',
  catchAsync(validateIds),
  catchAsync(validateTrackingDeviceData),
  catchAsync(addTrackingDeviceToVehicle)
);

// READ ROUTES
// Get all tracking devices - Admin only
deviceRouter.get(
  '/all',
  catchAsync(isAdmin),
  catchAsync(getAllTrackingDevices)
);

// Get tracking devices by vehicle ID - Vehicle owner or Admin
deviceRouter.get(
  '/vehicle/:vehicleId/devices',
  catchAsync(validateIds),
  catchAsync(getTrackingDevicesByVehicleId)
);

// Get tracking devices by user ID - User themselves or Admin
deviceRouter.get(
  '/:userId/devices',
  catchAsync(validateIds),
  catchAsync(validateUserAccess),
  catchAsync(getTrackingDevicesByUser)
);

// Get device details by ID - Device owner or Admin
deviceRouter.get(
  '/devices/:deviceId',
  catchAsync(validateIds),
  catchAsync(getDeviceDetails)
);

// Get tracking device by ID - Device owner or Admin
deviceRouter.get(
  '/:deviceId',
  catchAsync(validateIds),
  catchAsync(getTrackingDeviceById)
);

// Get device status - Device owner or Admin
deviceRouter.get(
  '/device/:deviceId/status',
  catchAsync(validateIds),
  catchAsync(getTrackingDeviceStatus)
);

// UPDATE ROUTES
// Update tracking device - Admin or device owner
deviceRouter.patch(
  '/:deviceId',
  catchAsync(validateIds),
  catchAsync(validateTrackingDeviceData),
  catchAsync(updateTrackingDeviceById)
);

// Update device status only - Admin or device owner
deviceRouter.patch(
  '/:deviceId/status',
  catchAsync(validateIds),
  catchAsync((req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError('Status is required', 400));
    }
    
    const validStatuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'LOST'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      ));
    }
    
    next();
  }),
  catchAsync(updateTrackingDeviceById)
);

// DELETE ROUTES
// Remove tracking device from vehicle - Admin or vehicle owner
deviceRouter.delete(
  '/device/:vehicleId/:deviceId',
  catchAsync(validateIds),
  catchAsync(removeTrackingDevice)
);

// Delete vehicle and its tracking devices - Admin only
deviceRouter.delete(
  '/vehicle-with-devices/:vehicleId',
  catchAsync(validateIds),
  catchAsync(isAdmin),
  catchAsync(deleteVehicleAndTrackingDevice)
);

// Soft delete tracking device - Admin only
deviceRouter.patch(
  '/:deviceId/deactivate',
  catchAsync(validateIds),
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    req.body = { deletedAt: new Date() };
    next();
  }),
  catchAsync(updateTrackingDeviceById)
);

// UTILITY ROUTES
// Health check for tracking device service
deviceRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tracking device service is healthy',
    timestamp: new Date().toISOString(),
    service: 'tracking-device-api'
  });
});

// Get device categories
deviceRouter.get('/config/categories', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Device categories retrieved successfully',
    data: {
      categories: ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER'],
      statuses: ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'LOST']
    }
  });
});

// Get device statistics - Admin only
deviceRouter.get(
  '/analytics/statistics',
  catchAsync(isAdmin),
  catchAsync((req, res) => {
    // This would integrate with your analytics controller
    res.status(200).json({
      success: true,
      message: 'Device statistics endpoint - integrate with analytics controller',
      timestamp: new Date().toISOString()
    });
  })
);

export default deviceRouter;