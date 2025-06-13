import { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRouters from './userRoutes.js';
import VehicleRouter from './vehicleRoutes.js';
import deviceRouter from "./trackingDeviceRoutes.js";
import emissionRouter from './emissionRoutes.js';
import { globalErrorHandler, handleApiNotFound } from '../middlewares/globaleerorshandling.js';

const allRoutes = Router();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Security middleware
allRoutes.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS middleware
allRoutes.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
allRoutes.use(limiter);

// Stricter rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true
});

// API Information and Health Routes
// Main API health check

allRoutes.get('/test', (req, res) => {
  res.json({ message: "Routes are working!" });
});

allRoutes.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Green Analytics API is healthy',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected', // You can add actual DB health check here
      redis: 'connected', // If you use Redis
      external_apis: 'connected'
    }
  });
});

// API Information
allRoutes.get('/info', (req, res) => {
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
      documentation: '/api/v1/docs', // Future API docs endpoint
      support: {
        email: process.env.SUPPORT_EMAIL || 'support@greenanalytics.com',
        documentation: 'https://docs.greenanalytics.com'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// API Status with detailed service health
allRoutes.get('/status', (req, res) => {
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMinutes = Math.floor((uptime % 3600) / 60);
  const uptimeSeconds = Math.floor(uptime % 60);

  res.status(200).json({
    success: true,
    message: 'API Status Report',
    data: {
      status: 'operational',
      uptime: {
        seconds: uptime,
        formatted: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`
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
const v1Router = Router();

// Apply auth rate limiting to specific routes
v1Router.use('/users/login', authLimiter);
v1Router.use('/users/signup', authLimiter);
v1Router.use('/users/forgot-password', authLimiter);
v1Router.use('/users/reset-password', authLimiter);

// Define API v1 routes
v1Router.use('/users', userRouters);
v1Router.use('/vehicles', VehicleRouter);
v1Router.use('/trackingDevices', deviceRouter);
v1Router.use('/emissions', emissionRouter);

// Mount v1 routes
allRoutes.use('/v1', v1Router);

// Default route redirect to v1 (for backward compatibility)
allRoutes.use('/users', userRouters);
allRoutes.use('/vehicles', VehicleRouter);
allRoutes.use('/trackingDevices', deviceRouter);
allRoutes.use('/emissions', emissionRouter);

// API Documentation placeholder
allRoutes.get('/docs', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    data: {
      message: 'API documentation is coming soon',
      swagger: '/api/v1/swagger', // Future Swagger endpoint
      postman: '/api/v1/postman', // Future Postman collection
      examples: {
        authentication: 'POST /api/v1/users/login',
        vehicles: 'GET /api/v1/vehicles',
        emissions: 'GET /api/v1/emissions'
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint for monitoring (basic)
allRoutes.get('/metrics', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Metrics',
    data: {
      requests: {
        total: 'N/A', // Implement request counter
        successful: 'N/A',
        failed: 'N/A'
      },
      response_times: {
        average: 'N/A', // Implement response time tracking
        p95: 'N/A',
        p99: 'N/A'
      },
      active_connections: 'N/A',
      timestamp: new Date().toISOString()
    }
  });
});

// Handle 404 for unmatched API routes
allRoutes.use('*', handleApiNotFound);

// Global error handling middleware (must be last)
allRoutes.use(globalErrorHandler);

export default allRoutes;