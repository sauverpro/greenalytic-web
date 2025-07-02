"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _paginationMiddleware = require("../middlewares/paginationMiddleware.js");
var _isadmin = require("../middlewares/isadmin.js");
var _isAuthenticated = require("../middlewares/isAuthenticated.js");
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
var _validateuserAccess = require("../middlewares/validateuserAccess.js");
var _trackingDeviceController = require("../controllers/trackingDeviceController.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var deviceRouter = _express["default"].Router();

// Tracking device validation middleware
var validateTrackingDeviceData = function validateTrackingDeviceData(req, res, next) {
  var _req$body = req.body,
    serialNumber = _req$body.serialNumber,
    model = _req$body.model,
    deviceCategory = _req$body.deviceCategory,
    status = _req$body.status,
    batteryLevel = _req$body.batteryLevel,
    signalStrength = _req$body.signalStrength;

  // Validate required fields for creation
  if (req.method === 'POST') {
    var requiredFields = ['serialNumber', 'model', 'deviceCategory'];
    var missingFields = requiredFields.filter(function (field) {
      return !req.body[field];
    });
    if (missingFields.length > 0) {
      return next(new _globaleerorshandling.AppError("Missing required fields: ".concat(missingFields.join(', ')), 400));
    }
  }

  // Validate serial number format
  if (serialNumber) {
    if (typeof serialNumber !== 'string' || serialNumber.length < 5) {
      return next(new _globaleerorshandling.AppError('Serial number must be at least 5 characters long', 400));
    }
  }

  // Validate model
  if (model) {
    if (typeof model !== 'string' || model.length < 2) {
      return next(new _globaleerorshandling.AppError('Model must be at least 2 characters long', 400));
    }
  }

  // Validate device category
  if (deviceCategory) {
    var validCategories = ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER'];
    if (!validCategories.includes(deviceCategory)) {
      return next(new _globaleerorshandling.AppError("Invalid device category. Must be one of: ".concat(validCategories.join(', ')), 400));
    }
  }

  // Validate status
  if (status) {
    var validStatuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'LOST'];
    if (!validStatuses.includes(status)) {
      return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
    }
  }

  // Validate battery level
  if (batteryLevel !== undefined) {
    var parsedBatteryLevel = parseFloat(batteryLevel);
    if (isNaN(parsedBatteryLevel) || parsedBatteryLevel < 0 || parsedBatteryLevel > 100) {
      return next(new _globaleerorshandling.AppError('Battery level must be a number between 0 and 100', 400));
    }
  }

  // Validate signal strength
  if (signalStrength !== undefined) {
    var parsedSignalStrength = parseFloat(signalStrength);
    if (isNaN(parsedSignalStrength) || parsedSignalStrength < 0 || parsedSignalStrength > 100) {
      return next(new _globaleerorshandling.AppError('Signal strength must be a number between 0 and 100', 400));
    }
  }
  next();
};

// Validate vehicle and device IDs
var validateIds = function validateIds(req, res, next) {
  var _req$params = req.params,
    vehicleId = _req$params.vehicleId,
    deviceId = _req$params.deviceId,
    userId = _req$params.userId;
  if (vehicleId && (isNaN(parseInt(vehicleId)) || parseInt(vehicleId) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid vehicle ID. Must be a positive integer.', 400));
  }
  if (deviceId && (isNaN(parseInt(deviceId)) || parseInt(deviceId) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid device ID. Must be a positive integer.', 400));
  }
  if (userId && (isNaN(parseInt(userId)) || parseInt(userId) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid user ID. Must be a positive integer.', 400));
  }
  next();
};

// Apply pagination to routes that return multiple items
var paginatedRoutes = ['/all', '/:userId/devices', '/vehicle/:vehicleId/devices', '/analytics/statistics'];
deviceRouter.use(paginatedRoutes, _paginationMiddleware.paginationMiddleware);

// CREATE ROUTES
// Add tracking device to vehicle - Admin or vehicle owner
deviceRouter.post('/add/:vehicleId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(validateTrackingDeviceData), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.addTrackingDeviceToVehicle));

// READ ROUTES
// Get all tracking devices - Admin only
deviceRouter.get('/all', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getAllTrackingDevices));

// Get tracking devices by vehicle ID - Vehicle owner or Admin
deviceRouter.get('/vehicle/:vehicleId/devices', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getTrackingDevicesByVehicleId));

// Get tracking devices by user ID - User themselves or Admin
deviceRouter.get('/:userId/devices', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getTrackingDevicesByUser));

// Get device details by ID - Device owner or Admin
deviceRouter.get('/devices/:deviceId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getDeviceDetails));

// Health check for tracking device service
deviceRouter.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Tracking device service is healthy',
    timestamp: new Date().toISOString(),
    service: 'tracking-device-api'
  });
});

// Get tracking device by ID - Device owner or Admin
deviceRouter.get('/:deviceId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getTrackingDeviceById));

// Get device status - Device owner or Admin
deviceRouter.get('/device/:deviceId/status', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.getTrackingDeviceStatus));

// UPDATE ROUTES
// Update tracking device - Admin or device owner
deviceRouter.patch('/:deviceId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(validateTrackingDeviceData), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.updateTrackingDeviceById));

// Update device status only - Admin or device owner
deviceRouter.patch('/:deviceId/status', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  var status = req.body.status;
  if (!status) {
    return next(new _globaleerorshandling.AppError('Status is required', 400));
  }
  var validStatuses = ['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'LOST'];
  if (!validStatuses.includes(status)) {
    return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
  }
  next();
}), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.updateTrackingDeviceById));

// DELETE ROUTES
// Remove tracking device from vehicle - Admin or vehicle owner
deviceRouter["delete"]('/device/:vehicleId/:deviceId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.removeTrackingDevice));

// Delete vehicle and its tracking devices - Admin only
deviceRouter["delete"]('/vehicle-with-devices/:vehicleId', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.deleteVehicleAndTrackingDevice));

// Soft delete tracking device - Admin only
deviceRouter.patch('/:deviceId/deactivate', (0, _globaleerorshandling.catchAsync)(validateIds), (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  req.body = {
    deletedAt: new Date()
  };
  next();
}), (0, _globaleerorshandling.catchAsync)(_trackingDeviceController.updateTrackingDeviceById));

// UTILITY ROUTES

// Get device categories
deviceRouter.get('/config/categories', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Device categories retrieved successfully',
    data: {
      categories: ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER'],
      statuses: ['ACTIVE', 'INACTIVE', 'PENDING', 'DISCONNECTED', 'MAINTENANCE']
    }
  });
});

// Get device statistics - Admin only
// deviceRouter.get(
//   '/analytics/statistics',
//   catchAsync(isAuthenticated),
//   catchAsync(isAdmin),
//   catchAsync(getDeviceStatistics)
// );
var _default = exports["default"] = deviceRouter;