"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeUserData = exports.sanitizeSingleUser = exports["default"] = exports.createSanitizeUserMiddleware = void 0;
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
// Enhanced sanitizeUser utility function
var _sanitizeUser = function sanitizeUser(user) {
  if (!user || _typeof(user) !== 'object') {
    return user;
  }

  // Create a copy to avoid mutating original object
  var sanitized = _objectSpread({}, user);

  // Remove sensitive fields that actually exist in your User model
  var sensitiveFields = ['password', 'otp', 'otpExpiresAt', 'token'];

  // Remove sensitive fields
  sensitiveFields.forEach(function (field) {
    delete sanitized[field];
  });

  // Sanitize nested user objects if they exist
  if (sanitized.createdBy && _typeof(sanitized.createdBy) === 'object') {
    sanitized.createdBy = _sanitizeUser(sanitized.createdBy);
  }
  if (sanitized.updatedBy && _typeof(sanitized.updatedBy) === 'object') {
    sanitized.updatedBy = _sanitizeUser(sanitized.updatedBy);
  }

  // Handle user relations in vehicle/tracking data
  if (sanitized.owner && _typeof(sanitized.owner) === 'object') {
    sanitized.owner = _sanitizeUser(sanitized.owner);
  }
  return sanitized;
};

// Enhanced function to recursively sanitize user data in any object
var _sanitizeUserDataRecursive = function sanitizeUserDataRecursive(obj) {
  if (!obj || _typeof(obj) !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(function (item) {
      return _sanitizeUserDataRecursive(item);
    });
  }
  var sanitized = {};
  for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    if (key === 'user' || key === 'owner' || key === 'createdBy' || key === 'updatedBy') {
      // Sanitize user objects
      sanitized[key] = _sanitizeUser(value);
    } else if (key === 'users' && Array.isArray(value)) {
      // Sanitize array of users
      sanitized[key] = value.map(function (user) {
        return _sanitizeUser(user);
      });
    } else if (key === 'data' && Array.isArray(value)) {
      // Recursively sanitize data arrays
      sanitized[key] = value.map(function (item) {
        return _sanitizeUserDataRecursive(item);
      });
    } else if (_typeof(value) === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = _sanitizeUserDataRecursive(value);
    } else {
      // Keep primitive values as-is
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Enhanced sanitize user middleware
var sanitizeUserMiddleware = function sanitizeUserMiddleware(req, res, next) {
  try {
    // Store original json method
    var originalJson = res.json;
    var originalSend = res.send;

    // Override res.json method
    res.json = function (body) {
      try {
        if (body && _typeof(body) === 'object') {
          // Sanitize the entire response body recursively
          var sanitizedBody = _sanitizeUserDataRecursive(body);
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
    res.send = function (body) {
      try {
        // Check if body is JSON string
        if (typeof body === 'string') {
          try {
            var parsedBody = JSON.parse(body);
            var sanitizedBody = _sanitizeUserDataRecursive(parsedBody);
            return originalSend.call(this, JSON.stringify(sanitizedBody));
          } catch (parseError) {
            // Not JSON, send as-is
            return originalSend.call(this, body);
          }
        } else if (body && _typeof(body) === 'object') {
          // Object body, sanitize and send
          var _sanitizedBody = _sanitizeUserDataRecursive(body);
          return originalSend.call(this, _sanitizedBody);
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
var sanitizeUserData = exports.sanitizeUserData = _sanitizeUserDataRecursive;

// Utility function to sanitize single user (for direct use)
var sanitizeSingleUser = exports.sanitizeSingleUser = _sanitizeUser;

// Enhanced middleware with configuration options
var createSanitizeUserMiddleware = exports.createSanitizeUserMiddleware = function createSanitizeUserMiddleware() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = {
    // Additional sensitive fields to remove
    additionalSensitiveFields: options.additionalSensitiveFields || [],
    // Whether to log sanitization errors
    logErrors: options.logErrors !== false,
    // Default true
    // Whether to sanitize nested objects
    deep: options.deep !== false // Default true
  };
  return function (req, res, next) {
    try {
      var originalJson = res.json;
      var originalSend = res.send;

      // Enhanced sanitizeUser with additional fields
      var _enhancedSanitizeUser = function enhancedSanitizeUser(user) {
        if (!user || _typeof(user) !== 'object') {
          return user;
        }
        var sanitized = _objectSpread({}, user);
        var allSensitiveFields = ['password', 'otp', 'otpExpiresAt', 'token'].concat(_toConsumableArray(config.additionalSensitiveFields));
        allSensitiveFields.forEach(function (field) {
          delete sanitized[field];
        });
        if (config.deep) {
          // Sanitize nested user objects
          ['createdBy', 'updatedBy', 'owner'].forEach(function (field) {
            if (sanitized[field] && _typeof(sanitized[field]) === 'object') {
              sanitized[field] = _enhancedSanitizeUser(sanitized[field]);
            }
          });
        }
        return sanitized;
      };

      // Enhanced recursive sanitization
      var _enhancedSanitizeRecursive = function enhancedSanitizeRecursive(obj) {
        if (!obj || _typeof(obj) !== 'object') {
          return obj;
        }
        if (Array.isArray(obj)) {
          return obj.map(function (item) {
            return _enhancedSanitizeRecursive(item);
          });
        }
        var sanitized = {};
        for (var _i2 = 0, _Object$entries2 = Object.entries(obj); _i2 < _Object$entries2.length; _i2++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];
          if (['user', 'owner', 'createdBy', 'updatedBy'].includes(key)) {
            sanitized[key] = _enhancedSanitizeUser(value);
          } else if (key === 'users' && Array.isArray(value)) {
            sanitized[key] = value.map(function (user) {
              return _enhancedSanitizeUser(user);
            });
          } else if (config.deep && _typeof(value) === 'object' && value !== null) {
            sanitized[key] = _enhancedSanitizeRecursive(value);
          } else {
            sanitized[key] = value;
          }
        }
        return sanitized;
      };
      res.json = function (body) {
        try {
          if (body && _typeof(body) === 'object') {
            var sanitizedBody = _enhancedSanitizeRecursive(body);
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
      res.send = function (body) {
        try {
          if (typeof body === 'string') {
            try {
              var parsedBody = JSON.parse(body);
              var sanitizedBody = _enhancedSanitizeRecursive(parsedBody);
              return originalSend.call(this, JSON.stringify(sanitizedBody));
            } catch (parseError) {
              return originalSend.call(this, body);
            }
          } else if (body && _typeof(body) === 'object') {
            var _sanitizedBody2 = _enhancedSanitizeRecursive(body);
            return originalSend.call(this, _sanitizedBody2);
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
var _default = exports["default"] = sanitizeUserMiddleware;