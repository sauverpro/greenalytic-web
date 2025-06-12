// Enhanced sanitizeUser utility function
const sanitizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  // Create a copy to avoid mutating original object
  const sanitized = { ...user };

  // Remove sensitive fields that actually exist in your User model
  const sensitiveFields = [
    'password',
    'otp',
    'otpExpiresAt',
    'token'
  ];

  // Remove sensitive fields
  sensitiveFields.forEach(field => {
    delete sanitized[field];
  });

  // Sanitize nested user objects if they exist
  if (sanitized.createdBy && typeof sanitized.createdBy === 'object') {
    sanitized.createdBy = sanitizeUser(sanitized.createdBy);
  }

  if (sanitized.updatedBy && typeof sanitized.updatedBy === 'object') {
    sanitized.updatedBy = sanitizeUser(sanitized.updatedBy);
  }

  // Handle user relations in vehicle/tracking data
  if (sanitized.owner && typeof sanitized.owner === 'object') {
    sanitized.owner = sanitizeUser(sanitized.owner);
  }

  return sanitized;
};

// Enhanced function to recursively sanitize user data in any object
const sanitizeUserDataRecursive = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeUserDataRecursive(item));
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'user' || key === 'owner' || key === 'createdBy' || key === 'updatedBy') {
      // Sanitize user objects
      sanitized[key] = sanitizeUser(value);
    } else if (key === 'users' && Array.isArray(value)) {
      // Sanitize array of users
      sanitized[key] = value.map(user => sanitizeUser(user));
    } else if (key === 'data' && Array.isArray(value)) {
      // Recursively sanitize data arrays
      sanitized[key] = value.map(item => sanitizeUserDataRecursive(item));
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeUserDataRecursive(value);
    } else {
      // Keep primitive values as-is
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Enhanced sanitize user middleware
const sanitizeUserMiddleware = (req, res, next) => {
  try {
    // Store original json method
    const originalJson = res.json;
    const originalSend = res.send;

    // Override res.json method
    res.json = function(body) {
      try {
        if (body && typeof body === 'object') {
          // Sanitize the entire response body recursively
          const sanitizedBody = sanitizeUserDataRecursive(body);
          return originalJson.call(this, sanitizedBody);
        }
        return originalJson.call(this, body);
      } catch (error) {
        console.error('Error in sanitizeUserMiddleware (json):', error);
        // Fallback to original body if sanitization fails
        return originalJson.call(this, body);
      }
    };

    // Override res.send method for backward compatibility
    res.send = function(body) {
      try {
        // Check if body is JSON string
        if (typeof body === 'string') {
          try {
            const parsedBody = JSON.parse(body);
            const sanitizedBody = sanitizeUserDataRecursive(parsedBody);
            return originalSend.call(this, JSON.stringify(sanitizedBody));
          } catch (parseError) {
            // Not JSON, send as-is
            return originalSend.call(this, body);
          }
        } else if (body && typeof body === 'object') {
          // Object body, sanitize and send
          const sanitizedBody = sanitizeUserDataRecursive(body);
          return originalSend.call(this, sanitizedBody);
        }
        
        return originalSend.call(this, body);
      } catch (error) {
        console.error('Error in sanitizeUserMiddleware (send):', error);
        // Fallback to original body if sanitization fails
        return originalSend.call(this, body);
      }
    };

    next();
  } catch (error) {
    console.error('Error setting up sanitizeUserMiddleware:', error);
    next();
  }
};

// Utility function to manually sanitize user data (for direct use)
export const sanitizeUserData = sanitizeUserDataRecursive;

// Utility function to sanitize single user (for direct use)
export const sanitizeSingleUser = sanitizeUser;

// Enhanced middleware with configuration options
export const createSanitizeUserMiddleware = (options = {}) => {
  const config = {
    // Additional sensitive fields to remove
    additionalSensitiveFields: options.additionalSensitiveFields || [],
    // Whether to log sanitization errors
    logErrors: options.logErrors !== false, // Default true
    // Whether to sanitize nested objects
    deep: options.deep !== false, // Default true
  };

  return (req, res, next) => {
    try {
      const originalJson = res.json;
      const originalSend = res.send;

      // Enhanced sanitizeUser with additional fields
      const enhancedSanitizeUser = (user) => {
        if (!user || typeof user !== 'object') {
          return user;
        }

        const sanitized = { ...user };
        const allSensitiveFields = [
          'password',
          'otp',
          'otpExpiresAt',
          'token',
          ...config.additionalSensitiveFields
        ];

        allSensitiveFields.forEach(field => {
          delete sanitized[field];
        });

        if (config.deep) {
          // Sanitize nested user objects
          ['createdBy', 'updatedBy', 'owner'].forEach(field => {
            if (sanitized[field] && typeof sanitized[field] === 'object') {
              sanitized[field] = enhancedSanitizeUser(sanitized[field]);
            }
          });
        }

        return sanitized;
      };

      // Enhanced recursive sanitization
      const enhancedSanitizeRecursive = (obj) => {
        if (!obj || typeof obj !== 'object') {
          return obj;
        }

        if (Array.isArray(obj)) {
          return obj.map(item => enhancedSanitizeRecursive(item));
        }

        const sanitized = {};

        for (const [key, value] of Object.entries(obj)) {
          if (['user', 'owner', 'createdBy', 'updatedBy'].includes(key)) {
            sanitized[key] = enhancedSanitizeUser(value);
          } else if (key === 'users' && Array.isArray(value)) {
            sanitized[key] = value.map(user => enhancedSanitizeUser(user));
          } else if (config.deep && typeof value === 'object' && value !== null) {
            sanitized[key] = enhancedSanitizeRecursive(value);
          } else {
            sanitized[key] = value;
          }
        }

        return sanitized;
      };

      res.json = function(body) {
        try {
          if (body && typeof body === 'object') {
            const sanitizedBody = enhancedSanitizeRecursive(body);
            return originalJson.call(this, sanitizedBody);
          }
          return originalJson.call(this, body);
        } catch (error) {
          if (config.logErrors) {
            console.error('Error in enhanced sanitizeUserMiddleware (json):', error);
          }
          return originalJson.call(this, body);
        }
      };

      res.send = function(body) {
        try {
          if (typeof body === 'string') {
            try {
              const parsedBody = JSON.parse(body);
              const sanitizedBody = enhancedSanitizeRecursive(parsedBody);
              return originalSend.call(this, JSON.stringify(sanitizedBody));
            } catch (parseError) {
              return originalSend.call(this, body);
            }
          } else if (body && typeof body === 'object') {
            const sanitizedBody = enhancedSanitizeRecursive(body);
            return originalSend.call(this, sanitizedBody);
          }
          
          return originalSend.call(this, body);
        } catch (error) {
          if (config.logErrors) {
            console.error('Error in enhanced sanitizeUserMiddleware (send):', error);
          }
          return originalSend.call(this, body);
        }
      };

      next();
    } catch (error) {
      if (config.logErrors) {
        console.error('Error setting up enhanced sanitizeUserMiddleware:', error);
      }
      next();
    }
  };
};

export default sanitizeUserMiddleware;