"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));
var _userRoutes = _interopRequireDefault(require("./userRoutes.js"));
var _vehicleRoutes = _interopRequireDefault(require("./vehicleRoutes.js"));
var _trackingDeviceRoutes = _interopRequireDefault(require("./trackingDeviceRoutes.js"));
var _emissionRoutes = _interopRequireDefault(require("./emissionRoutes.js"));
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
var _process$env$ALLOWED_;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var allRoutes = (0, _express.Router)();

// CORS configuration
var corsOptions = {
  origin: ((_process$env$ALLOWED_ = process.env.ALLOWED_ORIGINS) === null || _process$env$ALLOWED_ === void 0 ? void 0 : _process$env$ALLOWED_.split(',')) || ['http://localhost:3000', 'https://greenalytic-vehicle-monitoring.vercel.app/'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Security middleware
allRoutes.use((0, _helmet["default"])({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS middleware
allRoutes.use((0, _cors["default"])(corsOptions));

// Rate limiting
var limiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100,
  // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all routes
allRoutes.use(limiter);

// Stricter rate limiting for auth routes
var authLimiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 5,
  // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true
});

// API Information and Health Routes
// Main API health check

allRoutes.get('/test', function (req, res) {
  res.json({
    message: "Routes are working!"
  });
});
allRoutes.get('/health', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Green Analytics API is healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      // You can add actual DB health check here
      redis: 'connected',
      // If you use Redis
      external_apis: 'connected'
    }
  });
});

// API Information
allRoutes.get('/info', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Green Analytics API Information',
    data: {
      name: 'Green Analytics API',
      version: process.env.API_VERSION || '1.0.0',
      description: 'Vehicle emission monitoring and analytics platform',
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        users: '/api/v1/users',
        vehicles: '/api/v1/vehicles',
        trackingDevices: '/api/v1/trackingDevices',
        emissions: '/api/v1/emissions'
      },
      documentation: '/api/v1/docs',
      support: {
        email: process.env.SUPPORT_EMAIL || 'support@greenanalytics.com',
        documentation: 'https://docs.greenanalytics.com'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// API Status with detailed service health
allRoutes.get('/status', function (req, res) {
  var uptime = process.uptime();
  var uptimeHours = Math.floor(uptime / 3600);
  var uptimeMinutes = Math.floor(uptime % 3600 / 60);
  var uptimeSeconds = Math.floor(uptime % 60);
  res.status(200).json({
    success: true,
    message: 'API Status Report',
    data: {
      status: 'operational',
      uptime: {
        seconds: uptime,
        formatted: "".concat(uptimeHours, "h ").concat(uptimeMinutes, "m ").concat(uptimeSeconds, "s")
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || '1.0.0'
    }
  });
});

// API v1 Routes with versioning
var v1Router = (0, _express.Router)();

// Apply auth rate limiting to specific routes
v1Router.use('/users/login', authLimiter);
v1Router.use('/users/signup', authLimiter);
v1Router.use('/users/forgot-password', authLimiter);
v1Router.use('/users/reset-password', authLimiter);

// Define API v1 routes
v1Router.use('/users', _userRoutes["default"]);
v1Router.use('/vehicles', _vehicleRoutes["default"]);
v1Router.use('/trackingDevices', _trackingDeviceRoutes["default"]);
v1Router.use('/emissions', _emissionRoutes["default"]);

// Mount v1 routes
allRoutes.use('/v1', v1Router);

// Default route redirect to v1 (for backward compatibility)
allRoutes.use('/users', _userRoutes["default"]);
allRoutes.use('/vehicles', _vehicleRoutes["default"]);
allRoutes.use('/trackingDevices', _trackingDeviceRoutes["default"]);
allRoutes.use('/emissions', _emissionRoutes["default"]);

// API Documentation placeholder
allRoutes.get('/docs', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    data: {
      message: 'API documentation is coming soon',
      swagger: '/api/v1/swagger',
      // Future Swagger endpoint
      postman: '/api/v1/postman',
      // Future Postman collection
      examples: {
        authentication: 'POST /api/v1/users/login',
        vehicles: 'GET /api/v1/vehicles',
        emissions: 'GET /api/v1/emissions'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for unmatched API routes
allRoutes.use('*', _globaleerorshandling.handleApiNotFound);

// Global error handling middleware (must be last)
allRoutes.use(_globaleerorshandling.globalErrorHandler);
var _default = exports["default"] = allRoutes;