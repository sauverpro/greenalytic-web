"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleNotFoundRoutes = exports.handleApiNotFound = exports.globalErrorHandler = exports.createValidationError = exports.createUnauthorizedError = exports.createNotFoundError = exports.createForbiddenError = exports.createErrorResponse = exports.catchAsync = exports.AppError = void 0;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
var AppError = exports.AppError = /*#__PURE__*/function (_Error) {
  function AppError(message, statusCode) {
    var _this;
    _classCallCheck(this, AppError);
    _this = _callSuper(this, AppError, [message]);
    _this.statusCode = statusCode;
    _this.status = "".concat(statusCode).startsWith("4") ? "fail" : "error";
    _this.isOperational = true;
    Error.captureStackTrace(_this, _this.constructor);
    return _this;
  }
  _inherits(AppError, _Error);
  return _createClass(AppError);
}(/*#__PURE__*/_wrapNativeSuper(Error)); //Proper catchAsync function that handles both Promise and non-Promise returns
var catchAsync = exports.catchAsync = function catchAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next))["catch"](next);
  };
};
var handleNotFoundRoutes = exports.handleNotFoundRoutes = function handleNotFoundRoutes(req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server!"), 404));
};

// Enhanced Prisma error handlers for new schema
var handlePrismaValidationError = function handlePrismaValidationError(err) {
  if (err.code === 'P2002') {
    var _err$meta;
    // Unique constraint violation
    var field = ((_err$meta = err.meta) === null || _err$meta === void 0 || (_err$meta = _err$meta.target) === null || _err$meta === void 0 ? void 0 : _err$meta[0]) || 'field';
    return new AppError("".concat(field, " already exists. Please use a different value."), 400);
  }
  if (err.code === 'P2025') {
    // Record not found
    return new AppError('The requested resource was not found.', 404);
  }
  if (err.code === 'P2003') {
    // Foreign key constraint violation
    return new AppError('Cannot perform this operation due to related data constraints.', 400);
  }
  if (err.code === 'P2014') {
    // Required relation violation
    return new AppError('Required relationship constraint violation.', 400);
  }
  if (err.code === 'P2021') {
    // Table does not exist
    return new AppError('Database configuration error. Please contact support.', 500);
  }
  if (err.code === 'P2022') {
    // Column does not exist
    return new AppError('Database schema error. Please contact support.', 500);
  }
  return new AppError('Database operation failed.', 500);
};

// Enhanced validation error handler for enum violations
var handleValidationError = function handleValidationError(err) {
  if (err.message.includes('Invalid enum value')) {
    // Extract field name and valid values from error message
    var enumMatch = err.message.match(/Invalid enum value.*?for field `(\w+)`/);
    var field = enumMatch ? enumMatch[1] : 'field';

    // Map field names to user-friendly names and valid values
    var fieldMappings = {
      role: {
        name: 'Role',
        values: ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT']
      },
      status: {
        name: 'Status',
        values: ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED']
      },
      vehicleType: {
        name: 'Vehicle Type',
        values: ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER']
      },
      fuelType: {
        name: 'Fuel Type',
        values: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']
      },
      deviceCategory: {
        name: 'Device Category',
        values: ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER']
      },
      language: {
        name: 'Language',
        values: ['English', 'French', 'Kinyarwanda']
      },
      notificationPreference: {
        name: 'Notification Preference',
        values: ['Email', 'SMS', 'WhatsApp']
      }
    };
    var mapping = fieldMappings[field];
    if (mapping) {
      return new AppError("Invalid ".concat(mapping.name, ". Must be one of: ").concat(mapping.values.join(', ')), 400);
    }
    return new AppError("Invalid value for ".concat(field, ". Please check the allowed values."), 400);
  }
  if (err.message.includes('Argument') && err.message.includes('is missing')) {
    return new AppError('Required field is missing. Please provide all required information.', 400);
  }
  return new AppError('Validation error. Please check your input data.', 400);
};

// Enhanced authentication error handler
var handleAuthenticationError = function handleAuthenticationError(err) {
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid authentication token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Your session has expired. Please log in again.', 401);
  }
  if (err.message.includes('Unauthorized')) {
    return new AppError('Authentication required. Please log in to access this resource.', 401);
  }
  return new AppError('Authentication failed.', 401);
};

// Enhanced authorization error handler
var handleAuthorizationError = function handleAuthorizationError(err) {
  if (err.message.includes('Forbidden') || err.message.includes('insufficient permissions')) {
    return new AppError('You do not have permission to perform this action.', 403);
  }
  return new AppError('Access denied.', 403);
};

// Enhanced cast error handler for invalid IDs
var handleCastError = function handleCastError(err) {
  if (err.path === 'id' || err.path === '_id') {
    return new AppError('Invalid ID format.', 400);
  }
  return new AppError("Invalid ".concat(err.path, ": ").concat(err.value), 400);
};

// Rate limiting error handler
var handleRateLimitError = function handleRateLimitError(err) {
  return new AppError('Too many requests. Please try again later.', 429);
};

// File upload error handler
var handleFileUploadError = function handleFileUploadError(err) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File size too large. Maximum size allowed is 5MB.', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Maximum 5 files allowed.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field. Please check the upload requirements.', 400);
  }
  return new AppError('File upload failed.', 400);
};

// Enhanced development error response
var sendErrorDev = function sendErrorDev(err, res) {
  // Check if headers were already sent
  if (res.headersSent) {
    console.error('Cannot send error response - headers already sent:', err);
    return;
  }
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
};

// Enhanced production error response
var sendErrorProd = function sendErrorProd(err, res) {
  // Check if headers were already sent
  if (res.headersSent) {
    console.error('Cannot send error response - headers already sent:', err);
    return;
  }

  // Only send operational errors to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString()
    });
  } else {
    // Log error for debugging but don't expose details
    console.error('ERROR 💥:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      success: false,
      message: 'Something went wrong! Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
};

//Main global error handling middleware with headers check
var globalErrorHandler = exports.globalErrorHandler = function globalErrorHandler(err, req, res, next) {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Log the error for debugging
  console.error('ERROR 💥:', {
    name: err.name || 'Unknown Error',
    message: err.message || 'An unexpected error occurred',
    stack: err.stack,
    timestamp: new Date().toISOString()
  });

  // Check if response has already been sent
  if (res.headersSent) {
    console.log('Headers already sent, cannot send error response');
    return next(err);
  }
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    // Create a copy of error for manipulation
    var error = _objectSpread({}, err);
    error.message = err.message;

    // Handle specific error types
    if (err.code && err.code.startsWith('P')) {
      // Prisma errors
      error = handlePrismaValidationError(error);
    } else if (err.name === 'ValidationError' || err.message.includes('Invalid enum')) {
      // Validation errors
      error = handleValidationError(error);
    } else if (err.name === 'CastError') {
      // Cast errors (invalid IDs, etc.)
      error = handleCastError(error);
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      // Authentication errors
      error = handleAuthenticationError(error);
    } else if (err.statusCode === 403) {
      // Authorization errors
      error = handleAuthorizationError(error);
    } else if (err.statusCode === 429) {
      // Rate limiting errors
      error = handleRateLimitError(error);
    } else if (err.code && (err.code.startsWith('LIMIT_') || err.code === 'FILETYPE_NOT_ALLOWED')) {
      // File upload errors
      error = handleFileUploadError(error);
    } else if (err.name === 'MulterError') {
      // Multer specific errors
      error = handleFileUploadError(error);
    }
    sendErrorProd(error, res);
  }
};

// Enhanced 404 handler for API routes
var handleApiNotFound = exports.handleApiNotFound = function handleApiNotFound(req, res, next) {
  // Check if response has already been sent
  if (res.headersSent) {
    return;
  }
  res.status(404).json({
    success: false,
    message: "API endpoint ".concat(req.originalUrl, " not found"),
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      users: '/api/users',
      vehicles: '/api/vehicles',
      emissions: '/api/emissions',
      tracking: '/api/tracking-devices',
      dashboard: '/api/dashboard'
    }
  });
};

// Utility function for consistent error responses
var createErrorResponse = exports.createErrorResponse = function createErrorResponse(message) {
  var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
  var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var error = new AppError(message, statusCode);
  if (details) {
    error.details = details;
  }
  return error;
};

// Utility function for validation errors
var createValidationError = exports.createValidationError = function createValidationError(field, value) {
  var allowedValues = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var message = "Invalid ".concat(field);
  if (value) {
    message += ": ".concat(value);
  }
  if (allowedValues && Array.isArray(allowedValues)) {
    message += ". Must be one of: ".concat(allowedValues.join(', '));
  }
  return new AppError(message, 400);
};

// Utility function for not found errors
var createNotFoundError = exports.createNotFoundError = function createNotFoundError() {
  var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Resource';
  return new AppError("".concat(resource, " not found"), 404);
};

// Utility function for unauthorized errors
var createUnauthorizedError = exports.createUnauthorizedError = function createUnauthorizedError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Authentication required';
  return new AppError(message, 401);
};

// Utility function for forbidden errors
var createForbiddenError = exports.createForbiddenError = function createForbiddenError() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Insufficient permissions';
  return new AppError(message, 403);
};