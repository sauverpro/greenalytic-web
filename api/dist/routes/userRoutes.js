"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var userController = _interopRequireWildcard(require("../controllers/userController.js"));
var _userValidation = require("../middlewares/userValidation.js");
var _login = require("../authentication/login.js");
var _paginationMiddleware = _interopRequireDefault(require("../middlewares/paginationMiddleware.js"));
var _changepassword = require("../authentication/changepassword.js");
var _isadmin = require("../middlewares/isadmin.js");
var _sanitizeUserMiddleware = _interopRequireDefault(require("../middlewares/sanitizeUserMiddleware.js"));
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
var _validateuserAccess = require("../middlewares/validateuserAccess.js");
var _forgetpassword = require("../authentication/forgetpassword.js");
var _jwtfunctions = require("../utils/jwtfunctions.js");
var _isAuthenticated = require("../middlewares/isAuthenticated.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; } // Fixed import path
var userRouters = _express["default"].Router();

// Apply sanitization to all user routes since they deal with user data
userRouters.use(_sanitizeUserMiddleware["default"]);

// ID validation middleware
var validateUserId = function validateUserId(req, res, next) {
  var id = req.params.id;
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return next(new _globaleerorshandling.AppError('Invalid user ID. Must be a positive integer.', 400));
  }
  next();
};

// PUBLIC ROUTES (No authentication required)
// User login
userRouters.post.apply(userRouters, ["/login"].concat(_toConsumableArray(_login.validateLogin), [(0, _globaleerorshandling.catchAsync)(_login.login)]));

// User signup
userRouters.post("/signup", (0, _globaleerorshandling.catchAsync)(_userValidation.validateUserSignup), (0, _globaleerorshandling.catchAsync)(userController.signup));

// Generate OTP for password reset
userRouters.post("/forgot-password", (0, _globaleerorshandling.catchAsync)(_forgetpassword.generateAndSendOTP));

// Verify OTP and reset password
userRouters.post("/reset-password", (0, _globaleerorshandling.catchAsync)(_forgetpassword.verifyOTPAndUpdatePassword));

// PROTECTED ROUTES (Authentication required)
// Apply authentication middleware to all routes below
userRouters.use((0, _globaleerorshandling.catchAsync)(_jwtfunctions.verifyingtoken));

// ADMIN ONLY ROUTES
// Get all users - Admin only
userRouters.get("/", (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(userController.getAllUsers));

// Get user by ID - Admin or user themselves
userRouters.get("/:id", validateUserId, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), (0, _globaleerorshandling.catchAsync)(userController.getUserById));

// USER PROFILE ROUTES
// Change password - User can change their own password
userRouters.post("/change-password", (0, _globaleerorshandling.catchAsync)(_changepassword.changepassword));

// Update user profile - User can update their own profile or Admin can update any
userRouters.patch("/:id", validateUserId, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), (0, _globaleerorshandling.catchAsync)(_userValidation.validateUserUpdate), (0, _globaleerorshandling.catchAsync)(userController.updateUser));

// ADMIN MANAGEMENT ROUTES
// Update user role - Admin only
userRouters.patch("/:id/role", validateUserId, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  var role = req.body.role;
  if (!role) {
    return next(new _globaleerorshandling.AppError('Role is required', 400));
  }
  var validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
  if (!validRoles.includes(role)) {
    return next(new _globaleerorshandling.AppError("Invalid role. Must be one of: ".concat(validRoles.join(', ')), 400));
  }
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.updateUser));

// Update user status - Admin only
userRouters.patch("/:id/status", validateUserId, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  var status = req.body.status;
  if (!status) {
    return next(new _globaleerorshandling.AppError('Status is required', 400));
  }
  var validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
  if (!validStatuses.includes(status)) {
    return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
  }
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.updateUser));

// DELETE ROUTES
// Soft delete user - Admin only
userRouters["delete"]("/:id", validateUserId, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(userController.deleteUser));

// Hard delete user - Admin only (permanent deletion)
userRouters["delete"]("/:id/permanent", validateUserId, (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  // Add flag to indicate hard delete
  req.hardDelete = true;
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.deleteUserPermanent));

// USER RELATION ROUTES
// Get user's vehicles
userRouters.get("/:id/vehicles", validateUserId, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  // Redirect to vehicle controller with user filter
  req.query.userId = req.params.id;
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.getUserVehicles) // Assuming this method exists
);

// Get user's tracking devices
userRouters.get("/:id/devices", validateUserId, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(userController.getUserDevices) // Assuming this method exists
);

// Get user's alerts
userRouters.get("/:id/alerts", validateUserId, (0, _globaleerorshandling.catchAsync)(_validateuserAccess.validateUserAccess), _paginationMiddleware["default"], (0, _globaleerorshandling.catchAsync)(userController.getUserAlerts) // Assuming this method exists
);

// UTILITY ROUTES
// Health check for user service
userRouters.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'User service is healthy',
    timestamp: new Date().toISOString(),
    service: 'user-api'
  });
});

// Get user roles and statuses - Admin only
userRouters.get('/config/enums', (0, _globaleerorshandling.catchAsync)(_isadmin.isAdmin), function (req, res) {
  res.status(200).json({
    success: true,
    message: 'User configuration retrieved successfully',
    data: {
      roles: ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'],
      statuses: ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'],
      languages: ['English', 'French', 'Kinyarwanda'],
      notificationPreference: ['Email', 'SMS', 'WhatsApp']
    }
  });
});

// Get current user profile
userRouters.get('/profile/me', (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  // Set the ID to current user's ID
  req.params.id = req.userId.toString();
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.getUserById));

// Update current user profile
userRouters.patch('/profile/me', (0, _globaleerorshandling.catchAsync)(_userValidation.validateUserUpdate), (0, _globaleerorshandling.catchAsync)(function (req, res, next) {
  // Set the ID to current user's ID
  req.params.id = req.userId.toString();
  next();
}), (0, _globaleerorshandling.catchAsync)(userController.updateUser));
var _default = exports["default"] = userRouters;