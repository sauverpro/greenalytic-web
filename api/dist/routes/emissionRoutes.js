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
var _emissionController = require("../controllers/emissionController/emissionController.js");
var _VehicleDataController = require("../controllers/VehicleDataController.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var emissionRouter = _express["default"].Router();

// Emission data validation middleware
var validateEmissionData = function validateEmissionData(req, res, next) {
  var _req$body = req.body,
    vehicleId = _req$body.vehicleId,
    co2Percentage = _req$body.co2Percentage,
    coPercentage = _req$body.coPercentage,
    o2Percentage = _req$body.o2Percentage,
    hcPPM = _req$body.hcPPM,
    noxPPM = _req$body.noxPPM,
    pm25Level = _req$body.pm25Level;

  // Validate required fields for creation
  if (req.method === 'POST') {
    var requiredFields = ['vehicleId', 'co2Percentage', 'coPercentage', 'o2Percentage', 'hcPPM'];
    var missingFields = requiredFields.filter(function (field) {
      return req.body[field] === undefined || req.body[field] === null;
    });
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: ".concat(missingFields.join(', '))
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
  var validations = [{
    field: 'co2Percentage',
    value: co2Percentage,
    min: 0,
    max: 20
  }, {
    field: 'coPercentage',
    value: coPercentage,
    min: 0,
    max: 10
  }, {
    field: 'o2Percentage',
    value: o2Percentage,
    min: 0,
    max: 25
  }, {
    field: 'hcPPM',
    value: hcPPM,
    min: 0,
    max: 10000
  }, {
    field: 'noxPPM',
    value: noxPPM,
    min: 0,
    max: 5000
  }, {
    field: 'pm25Level',
    value: pm25Level,
    min: 0,
    max: 500
  }];
  for (var _i = 0, _validations = validations; _i < _validations.length; _i++) {
    var validation = _validations[_i];
    if (validation.value !== undefined && validation.value !== null) {
      if (isNaN(validation.value) || validation.value < validation.min || validation.value > validation.max) {
        return res.status(400).json({
          success: false,
          message: "".concat(validation.field, " must be a number between ").concat(validation.min, " and ").concat(validation.max)
        });
      }
    }
  }
  next();
};

// Apply pagination middleware to routes that need it
var paginatedRoutes = ['/', '/vehicle/:vehicleId', '/vehicle/:vehicleId/interval', '/plate/:plateNumber'];
emissionRouter.use(paginatedRoutes, _paginationMiddleware.paginationMiddleware);

// CREATE ROUTES
// Create emission data
emissionRouter.post('/', (0, _globaleerorshandling.catchAsync)(validateEmissionData), (0, _globaleerorshandling.catchAsync)(_emissionController.createEmissionData));

// READ ROUTES
// Get all emission data - Admin only
emissionRouter.get('/',
// catchAsync(isAuthenticated),
// catchAsync(isAdmin),

(0, _globaleerorshandling.catchAsync)(_emissionController.getAllEmissionData));

// Get emission statistics - Admin or Analyst
emissionRouter.get('/statistics', _paginationMiddleware.paginationMiddleware, (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_emissionController.getEmissionStatistics));

// Health check for emission service
emissionRouter.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Emission service is healthy',
    timestamp: new Date().toISOString(),
    service: 'emission-api'
  });
});

// Get emission data by ID - Authenticated users
emissionRouter.get('/:id', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_emissionController.getEmissionDataById));

// Get emission data by vehicle - Vehicle owner or Admin
emissionRouter.get('/vehicle/:vehicleId', (0, _globaleerorshandling.catchAsync)(_emissionController.getEmissionDataByVehicle));

// Get emission data by vehicle with time interval - Enhanced route using vehicleDataController
emissionRouter.get('/vehicle/:vehicleId/timerange', _paginationMiddleware.paginationMiddleware, (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getEmissionsDataByTimeRange));

// Get emission data by vehicle interval - Original route
emissionRouter.get('/vehicle/:vehicleId/interval', (0, _globaleerorshandling.catchAsync)(_emissionController.getEmissionDataByVehicleInterval));

// Get emission data by plate number - Admin only
emissionRouter.get('/plate/:plateNumber', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_emissionController.getEmissionDataByPlateNumber));

// UPDATE ROUTES
// Update emission data - Admin only
emissionRouter.put('/:id', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(validateEmissionData), (0, _globaleerorshandling.catchAsync)(_emissionController.updateEmissionData));

// Patch emission data - Admin only
emissionRouter.patch('/:id', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_emissionController.updateEmissionData));

// DELETE ROUTES
// Delete emission data - Admin only
emissionRouter["delete"]('/:id', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_emissionController.deleteEmissionData));

// Soft delete emission data - Admin only
emissionRouter.patch('/:id/deactivate', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  req.body = {
    deletedAt: new Date()
  };
  next();
}), (0, _globaleerorshandling.catchAsync)(_emissionController.updateEmissionData));

// ENHANCED ROUTES using vehicleDataController
// Get dashboard emission analytics - Admin only
emissionRouter.get('/analytics/dashboard', (0, _globaleerorshandling.catchAsync)(_isAuthenticated.isAuthenticated), (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(_VehicleDataController.vehicleDataController.getDashboardCounts));

// UTILITY ROUTES

// Get emission thresholds
emissionRouter.get('/config/thresholds', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Emission thresholds retrieved successfully',
    data: {
      co2: {
        warning: 0.5,
        critical: 1.0
      },
      co: {
        warning: 0.3,
        critical: 0.5
      },
      hc: {
        warning: 200,
        critical: 400
      },
      nox: {
        warning: 100,
        critical: 200
      },
      pm25: {
        warning: 25,
        critical: 50
      }
    }
  });
});
var _default = exports["default"] = emissionRouter;