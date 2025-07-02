"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _jwtfunctions = require("../utils/jwtfunctions.js");
var _isadmin = require("../middlewares/isadmin.js");
var _isAuthenticated = require("../middlewares/isAuthenticated.js");
var _paginationMiddleware = _interopRequireDefault(require("../middlewares/paginationMiddleware.js"));
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
var _validateVehicleAccess = require("../middlewares/validateVehicleAccess.js");
var _addVehicleToUserController = require("../controllers/vehicleControllers/addVehicleToUserController.js");
var _gettingvehiclesControllers = require("../controllers/vehicleControllers/gettingvehiclesControllers.js");
var _vehicleHistory = require("../controllers/vehicleControllers/vehicleHistory.js");
var _VehicleDataController = require("../controllers/VehicleDataController.js");
var _validateuserAccess = require("../middlewares/validateuserAccess.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var VehicleRouter = _express["default"].Router();

// Vehicle validation middleware
var validateVehicleData = function validateVehicleData(req, res, next) {
  var _req$body = req.body,
    plateNumber = _req$body.plateNumber,
    vehicleModel = _req$body.vehicleModel,
    vehicleType = _req$body.vehicleType,
    fuelType = _req$body.fuelType,
    status = _req$body.status,
    emissionStatus = _req$body.emissionStatus,
    yearOfManufacture = _req$body.yearOfManufacture,
    engineCapacity = _req$body.engineCapacity;

  // Validate required fields for creation
  if (req.method === 'POST') {
    var requiredFields = ['plateNumber', 'vehicleModel', 'vehicleType', 'fuelType'];
    var missingFields = requiredFields.filter(function (field) {
      return !req.body[field];
    });
    if (missingFields.length > 0) {
      return next(new _globaleerorshandling.AppError("Missing required fields: ".concat(missingFields.join(', ')), 400));
    }
  }

  // Validate plate number format
  if (plateNumber) {
    if (typeof plateNumber !== 'string' || plateNumber.length < 3) {
      return next(new _globaleerorshandling.AppError('Plate number must be at least 3 characters long', 400));
    }
  }

  // Validate vehicle model
  if (vehicleModel) {
    if (typeof vehicleModel !== 'string' || vehicleModel.length < 2) {
      return next(new _globaleerorshandling.AppError('Vehicle model must be at least 2 characters long', 400));
    }
  }

  // Validate vehicle type
  if (vehicleType) {
    var validVehicleTypes = ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'];
    if (!validVehicleTypes.includes(vehicleType)) {
      return next(new _globaleerorshandling.AppError("Invalid vehicle type. Must be one of: ".concat(validVehicleTypes.join(', ')), 400));
    }
  }

  // Validate fuel type
  if (fuelType) {
    var validFuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
    if (!validFuelTypes.includes(fuelType)) {
      return next(new _globaleerorshandling.AppError("Invalid fuel type. Must be one of: ".concat(validFuelTypes.join(', ')), 400));
    }
  }

  // Validate status
  if (status) {
    var validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
    if (!validStatuses.includes(status)) {
      return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
    }
  }

  // Validate emission status
  if (emissionStatus) {
    var validEmissionStatuses = ['LOW', 'NORMAL', 'HIGH'];
    if (!validEmissionStatuses.includes(emissionStatus)) {
      return next(new _globaleerorshandling.AppError("Invalid emission status. Must be one of: ".concat(validEmissionStatuses.join(', ')), 400));
    }
  }

  // Validate year of manufacture
  if (yearOfManufacture) {
    var currentYear = new Date().getFullYear();
    var year = parseInt(yearOfManufacture);
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      return next(new _globaleerorshandling.AppError("Year of manufacture must be between 1900 and ".concat(currentYear + 1), 400));
    }
  }

  // Validate engine capacity
  if (engineCapacity) {
    var capacity = parseFloat(engineCapacity);
    if (isNaN(capacity) || capacity <= 0 || capacity > 20) {
      return next(new _globaleerorshandling.AppError('Engine capacity must be a positive number less than or equal to 20 liters', 400));
    }
  }
  next();
};

// ID validation middleware
var validateIds = function validateIds(req, res, next) {
  var _req$params = req.params,
    vehicleId = _req$params.vehicleId,
    userId = _req$params.userId,
    id = _req$params.id;
  if (vehicleId && (isNaN(parseInt(vehicleId)) || parseInt(vehicleId) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid vehicle ID. Must be a positive integer.', 400));
  }
  if (userId && (isNaN(parseInt(userId)) || parseInt(userId) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid user ID. Must be a positive integer.', 400));
  }
  if (id && (isNaN(parseInt(id)) || parseInt(id) <= 0)) {
    return next(new _globaleerorshandling.AppError('Invalid ID. Must be a positive integer.', 400));
  }
  next();
};

// PUBLIC ROUTES (No authentication required)
// Health check
VehicleRouter.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Vehicle service is healthy',
    timestamp: new Date().toISOString(),
    service: 'vehicle-api'
  });
});

// Get vehicle configuration
VehicleRouter.get('/config/enums', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Vehicle configuration retrieved successfully',
    data: {
      vehicleTypes: ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'],
      fuelTypes: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'],
      statuses: ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'],
      emissionStatuses: ['LOW', 'NORMAL', 'HIGH']
    }
  });
});

// PROTECTED ROUTES (Authentication required)
// Apply authentication middleware to all routes below
VehicleRouter.use((0, _globaleerorshandling.catchAsync)(_jwtfunctions.verifyingtoken));

// ADMIN ONLY ROUTES
// Get all vehicles - Admin only
VehicleRouter.get('/all', (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_gettingvehiclesControllers.getAllVehiclesController));

// Get dashboard data - Admin only
VehicleRouter.get("/data/dashboard", (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getDashboardCounts));

// Get map data - Admin only
VehicleRouter.get("/data/map", (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getMapData));

// USER ACCESS ROUTES
// Get logged user's vehicles
VehicleRouter.get("/", _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getVehiclesByLoggedUser));

// Get vehicles by user ID - User themselves or Admin
VehicleRouter.get("/user/:userId/vehicles", validateIds, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_gettingvehiclesControllers.getVehiclesByUserIdController));

// VEHICLE MANAGEMENT ROUTES
// Add vehicle to user - User can add to themselves or Admin can add to anyone
VehicleRouter.post('/add/:userId', validateIds, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), (0, _globaleerorshandling.catchAsync)(validateVehicleData), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.addVehicleToUser));

// Get vehicle by ID - Vehicle owner or Admin
VehicleRouter.get('/:id', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), (0, _globaleerorshandling.catchAsync)(_gettingvehiclesControllers.getVehicleByIdController));

// Update vehicle - Vehicle owner or Admin
VehicleRouter.patch("/:vehicleId", validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), (0, _globaleerorshandling.catchAsync)(validateVehicleData), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.updateVehicleById));

// Delete vehicle - Vehicle owner or Admin
VehicleRouter["delete"]('/:vehicleId', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.deleteVehicle));

// VEHICLE DATA ROUTES
// Get vehicle history - Vehicle owner or Admin
VehicleRouter.get('/:vehicleId/history', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_vehicleHistory.getVehicleHistoryController));

// Get emissions data by time range - Vehicle owner or Admin
VehicleRouter.get('/:vehicleId/emissions/range', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getEmissionsDataByTimeRange));

// Get fuel data by time range - Vehicle owner or Admin
VehicleRouter.get('/:vehicleId/fuels/range', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getFuelsDataByTimeRange));

// Get GPS data by time range - Vehicle owner or Admin
VehicleRouter.get('/:vehicleId/gps/range', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getGPSDataByTimeRange));

// VEHICLE STATUS MANAGEMENT
// Update vehicle status - Admin only
VehicleRouter.patch('/:vehicleId/status', validateIds, (0, _globaleerorshandling.catchAsync)(_validateVehicleAccess.validateVehicleAccess), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  var status = req.body.status;
  if (!status) {
    return next(new _globaleerorshandling.AppError('Status is required', 400));
  }
  var validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
  if (!validStatuses.includes(status)) {
    return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
  }
  next();
}), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.updateVehicleById));

// Update emission status - Admin only
VehicleRouter.patch('/:vehicleId/emission-status', validateIds, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  var emissionStatus = req.body.emissionStatus;
  if (!emissionStatus) {
    return next(new _globaleerorshandling.AppError('Emission status is required', 400));
  }
  var validEmissionStatuses = ['LOW', 'NORMAL', 'HIGH'];
  if (!validEmissionStatuses.includes(emissionStatus)) {
    return next(new _globaleerorshandling.AppError("Invalid emission status. Must be one of: ".concat(validEmissionStatuses.join(', ')), 400));
  }
  next();
}), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.updateVehicleById));

// Soft delete vehicle - Admin only
VehicleRouter.patch('/:vehicleId/deactivate', validateIds, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  req.body = {
    deletedAt: new Date(),
    status: 'INACTIVE_DISCONNECTED' //
  };
  next();
}), (0, _globaleerorshandling.catchAsync)(_addVehicleToUserController.updateVehicleById));
var _default = exports["default"] = VehicleRouter;