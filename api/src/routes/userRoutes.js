import express from "express";
import * as userController from "../controllers/userController.js";
import { validateUserSignup, validateUserUpdate } from "../middlewares/userValidation.js";
import { login, validateLogin } from "../authentication/login.js";
import paginationMiddleware from "../middlewares/paginationMiddleware.js";
import { changepassword } from "../authentication/changepassword.js";
import { isAdmin } from "../middlewares/isadmin.js"; // Fixed import path
import sanitizeUserMiddleware from "../middlewares/sanitizeUserMiddleware.js";
import { catchAsync, AppError } from "../middlewares/globaleerorshandling.js";
import {
  generateAndSendOTP,
  verifyOTPAndUpdatePassword,
} from "../authentication/forgetpassword.js";
import { verifyingtoken } from "../utils/jwtfunctions.js";

const userRouters = express.Router();

// Apply sanitization to all user routes since they deal with user data
userRouters.use(sanitizeUserMiddleware);

// User access validation middleware - ensures users can only access their own data
const validateUserAccess = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const requestingUserId = req.userId; // From verifyingtoken middleware

  // Allow access if user is accessing their own data or if they're admin
  if (parseInt(id) === parseInt(requestingUserId) || req.adminUser) {
    return next();
  }

  return next(new AppError('Access denied. You can only access your own profile.', 403));
});

// ID validation middleware
const validateUserId = (req, res, next) => {
  const { id } = req.params;
  
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return next(new AppError('Invalid user ID. Must be a positive integer.', 400));
  }
  
  next();
};

// PUBLIC ROUTES (No authentication required)
// User login
userRouters.post(
  "/login", 
  ...validateLogin, 
  catchAsync(login)
);

// User signup
userRouters.post(
  "/signup", 
  catchAsync(validateUserSignup), 
  catchAsync(userController.signup)
);

// Generate OTP for password reset
userRouters.post(
  "/forgot-password", 
  catchAsync(generateAndSendOTP)
);

// Verify OTP and reset password
userRouters.post(
  "/reset-password", 
  catchAsync(verifyOTPAndUpdatePassword)
);

// PROTECTED ROUTES (Authentication required)
// Apply authentication middleware to all routes below
userRouters.use(catchAsync(verifyingtoken));

// ADMIN ONLY ROUTES
// Get all users - Admin only
userRouters.get(
  "/",
  catchAsync(isAdmin),
  paginationMiddleware,
  catchAsync(userController.getAllUsers)
);

// Get user by ID - Admin or user themselves
userRouters.get(
  "/:id",
  validateUserId,
  catchAsync(validateUserAccess),
  catchAsync(userController.getUserById)
);

// USER PROFILE ROUTES
// Change password - User can change their own password
userRouters.post(
  "/change-password",
  catchAsync(changepassword)
);

// Update user profile - User can update their own profile or Admin can update any
userRouters.patch(
  "/:id",
  validateUserId,
  catchAsync(validateUserAccess),
  catchAsync(validateUserUpdate),
  catchAsync(userController.updateUser)
);

// ADMIN MANAGEMENT ROUTES
// Update user role - Admin only
userRouters.patch(
  "/:id/role",
  validateUserId,
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    const { role } = req.body;
    
    if (!role) {
      return next(new AppError('Role is required', 400));
    }
    
    const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
    if (!validRoles.includes(role)) {
      return next(new AppError(
        `Invalid role. Must be one of: ${validRoles.join(', ')}`,
        400
      ));
    }
    
    next();
  }),
  catchAsync(userController.updateUser)
);

// Update user status - Admin only
userRouters.patch(
  "/:id/status",
  validateUserId,
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError('Status is required', 400));
    }
    
    const validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
    if (!validStatuses.includes(status)) {
      return next(new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        400
      ));
    }
    
    next();
  }),
  catchAsync(userController.updateUser)
);

// DELETE ROUTES
// Soft delete user - Admin only
userRouters.delete(
  "/:id",
  validateUserId,
  catchAsync(isAdmin),
  catchAsync(userController.deleteUser)
);

// Hard delete user - Admin only (permanent deletion)
userRouters.delete(
  "/:id/permanent",
  validateUserId,
  catchAsync(isAdmin),
  catchAsync((req, res, next) => {
    // Add flag to indicate hard delete
    req.hardDelete = true;
    next();
  }),
  catchAsync(userController.deleteUser)
);

// USER RELATION ROUTES
// Get user's vehicles
userRouters.get(
  "/:id/vehicles",
  validateUserId,
  catchAsync(validateUserAccess),
  paginationMiddleware,
  catchAsync((req, res, next) => {
    // Redirect to vehicle controller with user filter
    req.query.userId = req.params.id;
    next();
  }),
  catchAsync(userController.getUserVehicles) // Assuming this method exists
);

// Get user's tracking devices
userRouters.get(
  "/:id/devices",
  validateUserId,
  catchAsync(validateUserAccess),
  paginationMiddleware,
  catchAsync(userController.getUserDevices) // Assuming this method exists
);

// Get user's alerts
userRouters.get(
  "/:id/alerts",
  validateUserId,
  catchAsync(validateUserAccess),
  paginationMiddleware,
  catchAsync(userController.getUserAlerts) // Assuming this method exists
);

// UTILITY ROUTES
// Health check for user service
userRouters.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User service is healthy',
    timestamp: new Date().toISOString(),
    service: 'user-api'
  });
});

// Get user roles and statuses - Admin only
userRouters.get(
  '/config/enums',
  catchAsync(isAdmin),
  (req, res) => {
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
  }
);

// Get current user profile
userRouters.get(
  '/profile/me',
  catchAsync((req, res, next) => {
    // Set the ID to current user's ID
    req.params.id = req.userId.toString();
    next();
  }),
  catchAsync(userController.getUserById)
);

// Update current user profile
userRouters.patch(
  '/profile/me',
  catchAsync(validateUserUpdate),
  catchAsync((req, res, next) => {
    // Set the ID to current user's ID
    req.params.id = req.userId.toString();
    next();
  }),
  catchAsync(userController.updateUser)
);

export default userRouters;