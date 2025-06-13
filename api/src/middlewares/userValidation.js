import { AppError } from './globaleerorshandling.js';

// Enhanced user signup validation middleware
export const validateUserSignup = (req, res, next) => {
  try {
    const { 
      email, 
      password, 
      username, 
      phoneNumber, 
      fullName,
      role,
      companyName,
      businessSector,
      fleetSize,
      language,
      notificationPreference,
      nationalId,
      gender
    } = req.body;

    console.log("Request body received:", req.body);

    // Validate required fields
    const requiredFields = ['email', 'password', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(new AppError(
        `Missing required fields: ${missingFields.join(', ')}`, 
        400
      ));
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return next(new AppError(
        'Please provide a valid email address',
        400
      ));
    }

    // Enhanced password validation
    if (password.length < 8) {
      return next(new AppError(
        'Password must be at least 8 characters long',
        400
      ));
    }

    // Password complexity validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      return next(new AppError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        400
      ));
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return next(new AppError(
        'Please provide a valid phone number (10-15 digits)',
        400
      ));
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
      if (!validRoles.includes(role)) {
        return next(new AppError(
          `Invalid role. Must be one of: ${validRoles.join(', ')}`,
          400
        ));
      }
    }

    // Validate language if provided
    if (language) {
      const validLanguages = ['English', 'French', 'Kinyarwanda'];
      if (!validLanguages.includes(language)) {
        return next(new AppError(
          `Invalid language. Must be one of: ${validLanguages.join(', ')}`,
          400
        ));
      }
    }

    // Validate notification preference if provided
    if (notificationPreference) {
      const validPreferences = ['Email', 'SMS', 'WhatsApp'];
      if (!validPreferences.includes(notificationPreference)) {
        return next(new AppError(
          `Invalid notification preference. Must be one of: ${validPreferences.join(', ')}`,
          400
        ));
      }
    }

    // Validate fleet size if provided
    if (fleetSize !== undefined) {
      const parsedFleetSize = parseInt(fleetSize);
      if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
        return next(new AppError(
          'Fleet size must be a non-negative number',
          400
        ));
      }
    }

    // Validate gender if provided
    if (gender) {
      const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
      if (!validGenders.includes(gender)) {
        return next(new AppError(
          `Invalid gender. Must be one of: ${validGenders.join(', ')}`,
          400
        ));
      }
    }

    // Validate national ID format if provided (basic validation)
    if (nationalId && nationalId.length < 5) {
      return next(new AppError(
        'National ID must be at least 5 characters long',
        400
      ));
    }

    // Validate full name if provided
    if (fullName && fullName.length < 2) {
      return next(new AppError(
        'Full name must be at least 2 characters long',
        400
      ));
    }

    // Validate company name length if provided
    if (companyName && companyName.length < 2) {
      return next(new AppError(
        'Company name must be at least 2 characters long',
        400
      ));
    }

    // Validate business sector if provided
    if (businessSector && businessSector.length < 2) {
      return next(new AppError(
        'Business sector must be at least 2 characters long',
        400
      ));
    }

    next();
  } catch (error) {
    next(new AppError('Validation processing failed', 500));
  }
};

// Enhanced user update validation middleware
export const validateUserUpdate = (req, res, next) => {
  try {
    const { 
      email, 
      password, 
      username, 
      phoneNumber, 
      fullName,
      role,
      companyName,
      businessSector,
      fleetSize,
      language,
      notificationPreference,
      nationalId,
      gender,
      status
    } = req.body;

    // For updates, no fields are strictly required, but validate if provided

    // Email validation if provided
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return next(new AppError(
          'Please provide a valid email address',
          400
        ));
      }
    }

    // Password validation if provided
    if (password) {
      if (password.length < 8) {
        return next(new AppError(
          'Password must be at least 8 characters long',
          400
        ));
      }

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        return next(new AppError(
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          400
        ));
      }
    }

    // Phone number validation if provided
    if (phoneNumber) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return next(new AppError(
          'Please provide a valid phone number (10-15 digits)',
          400
        ));
      }
    }

    // Role validation if provided
    if (role) {
      const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
      if (!validRoles.includes(role)) {
        return next(new AppError(
          `Invalid role. Must be one of: ${validRoles.join(', ')}`,
          400
        ));
      }
    }

    // Status validation if provided
    if (status) {
      const validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
      if (!validStatuses.includes(status)) {
        return next(new AppError(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          400
        ));
      }
    }

    // Language validation if provided
    if (language) {
      const validLanguages = ['English', 'French', 'Kinyarwanda'];
      if (!validLanguages.includes(language)) {
        return next(new AppError(
          `Invalid language. Must be one of: ${validLanguages.join(', ')}`,
          400
        ));
      }
    }

    // Notification preference validation if provided
    if (notificationPreference) {
      const validPreferences = ['Email', 'SMS', 'WhatsApp'];
      if (!validPreferences.includes(notificationPreference)) {
        return next(new AppError(
          `Invalid notification preference. Must be one of: ${validPreferences.join(', ')}`,
          400
        ));
      }
    }

    // Fleet size validation if provided
    if (fleetSize !== undefined) {
      const parsedFleetSize = parseInt(fleetSize);
      if (isNaN(parsedFleetSize) || parsedFleetSize < 0) {
        return next(new AppError(
          'Fleet size must be a non-negative number',
          400
        ));
      }
    }

    // Gender validation if provided
    if (gender) {
      const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
      if (!validGenders.includes(gender)) {
        return next(new AppError(
          `Invalid gender. Must be one of: ${validGenders.join(', ')}`,
          400
        ));
      }
    }

    // Validate other fields if provided
    if (nationalId && nationalId.length < 5) {
      return next(new AppError(
        'National ID must be at least 5 characters long',
        400
      ));
    }

    if (fullName && fullName.length < 2) {
      return next(new AppError(
        'Full name must be at least 2 characters long',
        400
      ));
    }

    if (companyName && companyName.length < 2) {
      return next(new AppError(
        'Company name must be at least 2 characters long',
        400
      ));
    }

    if (businessSector && businessSector.length < 2) {
      return next(new AppError(
        'Business sector must be at least 2 characters long',
        400
      ));
    }

    next();
  } catch (error) {
    next(new AppError('Update validation processing failed', 500));
  }
};

// Utility validation functions for reuse
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

export const validateUserRole = (role) => {
  const validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
  return validRoles.includes(role);
};

export const validateUserStatus = (status) => {
  const validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
  return validStatuses.includes(status);
};

export const validateLanguage = (language) => {
  const validLanguages = ['English', 'French', 'Kinyarwanda'];
  return validLanguages.includes(language);
};

export const validateNotificationPreference = (preference) => {
  const validPreferences = ['Email', 'SMS', 'WhatsApp'];
  return validPreferences.includes(preference);
};