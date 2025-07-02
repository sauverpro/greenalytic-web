export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//Proper catchAsync function that handles both Promise and non-Promise returns
export const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


export const handleNotFoundRoutes = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

// Enhanced Prisma error handlers for new schema
const handlePrismaValidationError = (err) => {
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target?.[0] || 'field';
    return new AppError(`${field} already exists. Please use a different value.`, 400);
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
const handleValidationError = (err) => {
  if (err.message.includes('Invalid enum value')) {
    // Extract field name and valid values from error message
    const enumMatch = err.message.match(/Invalid enum value.*?for field `(\w+)`/);
    const field = enumMatch ? enumMatch[1] : 'field';
    
    // Map field names to user-friendly names and valid values
    const fieldMappings = {
      role: { name: 'Role', values: ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'] },
      status: { name: 'Status', values: ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'] },
      vehicleType: { name: 'Vehicle Type', values: ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'] },
      fuelType: { name: 'Fuel Type', values: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'] },
      deviceCategory: { name: 'Device Category', values: ['MOTORCYCLE', 'CAR', 'TRUCK', 'TRICYCLE', 'OTHER'] },
      language: { name: 'Language', values: ['English', 'French', 'Kinyarwanda'] },
      notificationPreference: { name: 'Notification Preference', values: ['Email', 'SMS', 'WhatsApp'] }
    };
    
    const mapping = fieldMappings[field];
    if (mapping) {
      return new AppError(
        `Invalid ${mapping.name}. Must be one of: ${mapping.values.join(', ')}`,
        400
      );
    }
    
    return new AppError(`Invalid value for ${field}. Please check the allowed values.`, 400);
  }
  
  if (err.message.includes('Argument') && err.message.includes('is missing')) {
    return new AppError('Required field is missing. Please provide all required information.', 400);
  }
  
  return new AppError('Validation error. Please check your input data.', 400);
};

// Enhanced authentication error handler
const handleAuthenticationError = (err) => {
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
const handleAuthorizationError = (err) => {
  if (err.message.includes('Forbidden') || err.message.includes('insufficient permissions')) {
    return new AppError('You do not have permission to perform this action.', 403);
  }
  
  return new AppError('Access denied.', 403);
};

// Enhanced cast error handler for invalid IDs
const handleCastError = (err) => {
  if (err.path === 'id' || err.path === '_id') {
    return new AppError('Invalid ID format.', 400);
  }
  
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};

// Rate limiting error handler
const handleRateLimitError = (err) => {
  return new AppError('Too many requests. Please try again later.', 429);
};

// File upload error handler
const handleFileUploadError = (err) => {
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
const sendErrorDev = (err, res) => {
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
const sendErrorProd = (err, res) => {
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
export const globalErrorHandler = (err, req, res, next) => {
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
    let error = { ...err };
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
export const handleApiNotFound = (req, res, next) => {
  // Check if response has already been sent
  if (res.headersSent) {
    return;
  }

  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      users: '/api/users',
      vehicles: '/api/vehicles',
      emissions: '/api/emissions',
      tracking: '/api/tracking-devices',
      dashboard: '/api/dashboard',
    }
  });
};

// Utility function for consistent error responses
export const createErrorResponse = (message, statusCode = 500, details = null) => {
  const error = new AppError(message, statusCode);
  if (details) {
    error.details = details;
  }
  return error;
};

// Utility function for validation errors
export const createValidationError = (field, value, allowedValues = null) => {
  let message = `Invalid ${field}`;
  if (value) {
    message += `: ${value}`;
  }
  if (allowedValues && Array.isArray(allowedValues)) {
    message += `. Must be one of: ${allowedValues.join(', ')}`;
  }
  return new AppError(message, 400);
};

// Utility function for not found errors
export const createNotFoundError = (resource = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

// Utility function for unauthorized errors
export const createUnauthorizedError = (message = 'Authentication required') => {
  return new AppError(message, 401);
};

// Utility function for forbidden errors
export const createForbiddenError = (message = 'Insufficient permissions') => {
  return new AppError(message, 403);
};