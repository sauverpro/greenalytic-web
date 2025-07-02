"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserUpdate = exports.validateUserStatus = exports.validateUserSignup = exports.validateUserRole = exports.validatePhoneNumber = exports.validatePassword = exports.validateNotificationPreference = exports.validateLanguage = exports.validateEmail = void 0;
var _globaleerorshandling = require("./globaleerorshandling.js");
// Enhanced user signup validation middleware
var validateUserSignup = exports.validateUserSignup = function validateUserSignup(req, res, next) {
  try {
    var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password,
      username = _req$body.username,
      phoneNumber = _req$body.phoneNumber,
      fullName = _req$body.fullName,
      role = _req$body.role,
      companyName = _req$body.companyName,
      businessSector = _req$body.businessSector,
      fleetSize = _req$body.fleetSize,
      language = _req$body.language,
      notificationPreference = _req$body.notificationPreference,
      nationalId = _req$body.nationalId,
      gender = _req$body.gender;
    console.log("Request body received:", req.body);

    // Validate required fields
    var requiredFields = ['email', 'password', 'phoneNumber'];
    var missingFields = requiredFields.filter(function (field) {
      return !req.body[field];
    });
    if (missingFields.length > 0) {
      return next(new _globaleerorshandling.AppError("Missing required fields: ".concat(missingFields.join(', ')), 400));
    }

    // Enhanced email validation
    var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return next(new _globaleerorshandling.AppError('Please provide a valid email address', 400));
    }

    // Enhanced password validation
    if (password.length < 8) {
      return next(new _globaleerorshandling.AppError('Password must be at least 8 characters long', 400));
    }

    // Password complexity validation
    var hasUpperCase = /[A-Z]/.test(password);
    var hasLowerCase = /[a-z]/.test(password);
    var hasNumbers = /\d/.test(password);
    var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return next(new _globaleerorshandling.AppError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 400));
    }

    // Phone number validation
    var phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return next(new _globaleerorshandling.AppError('Please provide a valid phone number (10-15 digits)', 400));
    }

    // Validate role if provided
    if (role) {
      var validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
      if (!validRoles.includes(role)) {
        return next(new _globaleerorshandling.AppError("Invalid role. Must be one of: ".concat(validRoles.join(', ')), 400));
      }
    }

    // Validate language if provided
    if (language) {
      var validLanguages = ['English', 'French', 'Kinyarwanda'];
      if (!validLanguages.includes(language)) {
        return next(new _globaleerorshandling.AppError("Invalid language. Must be one of: ".concat(validLanguages.join(', ')), 400));
      }
    }

    // Validate notification preference if provided
    if (notificationPreference) {
      var validPreferences = ['Email', 'SMS', 'WhatsApp'];
      if (!validPreferences.includes(notificationPreference)) {
        return next(new _globaleerorshandling.AppError("Invalid notification preference. Must be one of: ".concat(validPreferences.join(', ')), 400));
      }
    }

    // Validate fleet size if provided
    if (fleetSize !== undefined) {
      var parsedFleetSize = parseInt(fleetSize);
      if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
        return next(new _globaleerorshandling.AppError('Fleet size must be a non-negative number', 400));
      }
    }

    // Validate gender if provided
    if (gender) {
      var validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
      if (!validGenders.includes(gender)) {
        return next(new _globaleerorshandling.AppError("Invalid gender. Must be one of: ".concat(validGenders.join(', ')), 400));
      }
    }

    // Validate national ID format if provided (basic validation)
    if (nationalId && nationalId.length < 5) {
      return next(new _globaleerorshandling.AppError('National ID must be at least 5 characters long', 400));
    }

    // Validate full name if provided
    if (fullName && fullName.length < 2) {
      return next(new _globaleerorshandling.AppError('Full name must be at least 2 characters long', 400));
    }

    // Validate company name length if provided
    if (companyName && companyName.length < 2) {
      return next(new _globaleerorshandling.AppError('Company name must be at least 2 characters long', 400));
    }

    // Validate business sector if provided
    if (businessSector && businessSector.length < 2) {
      return next(new _globaleerorshandling.AppError('Business sector must be at least 2 characters long', 400));
    }
    next();
  } catch (error) {
    next(new _globaleerorshandling.AppError('Validation processing failed', 500));
  }
};

// Enhanced user update validation middleware
var validateUserUpdate = exports.validateUserUpdate = function validateUserUpdate(req, res, next) {
  try {
    var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password,
      username = _req$body2.username,
      phoneNumber = _req$body2.phoneNumber,
      fullName = _req$body2.fullName,
      role = _req$body2.role,
      companyName = _req$body2.companyName,
      businessSector = _req$body2.businessSector,
      fleetSize = _req$body2.fleetSize,
      language = _req$body2.language,
      notificationPreference = _req$body2.notificationPreference,
      nationalId = _req$body2.nationalId,
      gender = _req$body2.gender,
      status = _req$body2.status;

    // For updates, no fields are strictly required, but validate if provided

    // Email validation if provided
    if (email) {
      var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return next(new _globaleerorshandling.AppError('Please provide a valid email address', 400));
      }
    }

    // Password validation if provided
    if (password) {
      if (password.length < 8) {
        return next(new _globaleerorshandling.AppError('Password must be at least 8 characters long', 400));
      }
      var hasUpperCase = /[A-Z]/.test(password);
      var hasLowerCase = /[a-z]/.test(password);
      var hasNumbers = /\d/.test(password);
      var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        return next(new _globaleerorshandling.AppError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character', 400));
      }
    }

    // Phone number validation if provided
    if (phoneNumber) {
      var phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return next(new _globaleerorshandling.AppError('Please provide a valid phone number (10-15 digits)', 400));
      }
    }

    // Role validation if provided
    if (role) {
      var validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
      if (!validRoles.includes(role)) {
        return next(new _globaleerorshandling.AppError("Invalid role. Must be one of: ".concat(validRoles.join(', ')), 400));
      }
    }

    // Status validation if provided
    if (status) {
      var validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
      if (!validStatuses.includes(status)) {
        return next(new _globaleerorshandling.AppError("Invalid status. Must be one of: ".concat(validStatuses.join(', ')), 400));
      }
    }

    // Language validation if provided
    if (language) {
      var validLanguages = ['English', 'French', 'Kinyarwanda'];
      if (!validLanguages.includes(language)) {
        return next(new _globaleerorshandling.AppError("Invalid language. Must be one of: ".concat(validLanguages.join(', ')), 400));
      }
    }

    // Notification preference validation if provided
    if (notificationPreference) {
      var validPreferences = ['Email', 'SMS', 'WhatsApp'];
      if (!validPreferences.includes(notificationPreference)) {
        return next(new _globaleerorshandling.AppError("Invalid notification preference. Must be one of: ".concat(validPreferences.join(', ')), 400));
      }
    }

    // Fleet size validation if provided
    if (fleetSize !== undefined) {
      var parsedFleetSize = parseInt(fleetSize);
      if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
        return next(new _globaleerorshandling.AppError('Fleet size must be a non-negative number', 400));
      }
    }

    // Gender validation if provided
    if (gender) {
      var validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
      if (!validGenders.includes(gender)) {
        return next(new _globaleerorshandling.AppError("Invalid gender. Must be one of: ".concat(validGenders.join(', ')), 400));
      }
    }

    // Validate other fields if provided
    if (nationalId && nationalId.length < 5) {
      return next(new _globaleerorshandling.AppError('National ID must be at least 5 characters long', 400));
    }
    if (fullName && fullName.length < 2) {
      return next(new _globaleerorshandling.AppError('Full name must be at least 2 characters long', 400));
    }
    if (companyName && companyName.length < 2) {
      return next(new _globaleerorshandling.AppError('Company name must be at least 2 characters long', 400));
    }
    if (businessSector && businessSector.length < 2) {
      return next(new _globaleerorshandling.AppError('Business sector must be at least 2 characters long', 400));
    }
    next();
  } catch (error) {
    next(new _globaleerorshandling.AppError('Update validation processing failed', 500));
  }
};

// Utility validation functions for reuse
var validateEmail = exports.validateEmail = function validateEmail(email) {
  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
var validatePassword = exports.validatePassword = function validatePassword(password) {
  if (password.length < 8) return false;
  var hasUpperCase = /[A-Z]/.test(password);
  var hasLowerCase = /[a-z]/.test(password);
  var hasNumbers = /\d/.test(password);
  var hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};
var validatePhoneNumber = exports.validatePhoneNumber = function validatePhoneNumber(phoneNumber) {
  var phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};
var validateUserRole = exports.validateUserRole = function validateUserRole(role) {
  var validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
  return validRoles.includes(role);
};
var validateUserStatus = exports.validateUserStatus = function validateUserStatus(status) {
  var validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
  return validStatuses.includes(status);
};
var validateLanguage = exports.validateLanguage = function validateLanguage(language) {
  var validLanguages = ['English', 'French', 'Kinyarwanda'];
  return validLanguages.includes(language);
};
var validateNotificationPreference = exports.validateNotificationPreference = function validateNotificationPreference(preference) {
  var validPreferences = ['Email', 'SMS', 'WhatsApp'];
  return validPreferences.includes(preference);
};