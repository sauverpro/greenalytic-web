"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginationMiddleware = exports["default"] = exports.createPaginationMiddleware = exports.createPaginatedResponse = exports.buildPaginationMeta = exports.buildDateFilter = void 0;
var _globaleerorshandling = require("./globaleerorshandling.js");
// Configuration constants
var PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_PAGE: 1
};
var paginationMiddleware = exports.paginationMiddleware = function paginationMiddleware(req, res, next) {
  try {
    var _req$query = req.query,
      page = _req$query.page,
      limit = _req$query.limit,
      startTime = _req$query.startTime,
      endTime = _req$query.endTime;

    // Parse and validate page
    page = parseInt(page);
    if (isNaN(page) || page < PAGINATION_CONFIG.MIN_PAGE) {
      page = PAGINATION_CONFIG.DEFAULT_PAGE;
    }

    // Parse and validate limit
    limit = parseInt(limit);
    if (isNaN(limit) || limit < PAGINATION_CONFIG.MIN_LIMIT) {
      limit = PAGINATION_CONFIG.DEFAULT_LIMIT;
    }

    // Enforce maximum limit to prevent performance issues
    if (limit > PAGINATION_CONFIG.MAX_LIMIT) {
      return next(new _globaleerorshandling.AppError("Limit cannot exceed ".concat(PAGINATION_CONFIG.MAX_LIMIT, " items per page. Please use a smaller limit."), 400));
    }

    // Parse and validate dates
    var parsedStartTime = null;
    var parsedEndTime = null;
    if (startTime) {
      parsedStartTime = new Date(startTime);
      if (isNaN(parsedStartTime.getTime())) {
        return next(new _globaleerorshandling.AppError('Invalid startTime format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)', 400));
      }
    }
    if (endTime) {
      parsedEndTime = new Date(endTime);
      if (isNaN(parsedEndTime.getTime())) {
        return next(new _globaleerorshandling.AppError('Invalid endTime format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)', 400));
      }
    }

    // Validate date range
    if (parsedStartTime && parsedEndTime) {
      if (parsedStartTime >= parsedEndTime) {
        return next(new _globaleerorshandling.AppError('startTime must be before endTime', 400));
      }

      // Check if date range is too large (optional - prevent huge queries)
      var maxRangeDays = 365; // 1 year max
      var rangeDays = (parsedEndTime - parsedStartTime) / (1000 * 60 * 60 * 24);
      if (rangeDays > maxRangeDays) {
        return next(new _globaleerorshandling.AppError("Date range cannot exceed ".concat(maxRangeDays, " days. Please use a smaller range."), 400));
      }
    }

    // Calculate skip value for database queries
    var skip = (page - 1) * limit;

    // Attach pagination details to req.pagination
    req.pagination = {
      page: page,
      limit: limit,
      skip: skip,
      take: limit,
      // Prisma uses 'take' instead of 'limit'
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      // Helper methods for building responses
      buildMeta: function buildMeta(totalCount) {
        return buildPaginationMeta(page, limit, totalCount);
      },
      buildDateFilter: function buildDateFilter() {
        return _buildDateFilter(parsedStartTime, parsedEndTime);
      }
    };
    next();
  } catch (error) {
    next(new _globaleerorshandling.AppError('Pagination processing failed', 500));
  }
};

// Helper function to build pagination metadata
var buildPaginationMeta = exports.buildPaginationMeta = function buildPaginationMeta(page, limit, totalCount) {
  var totalPages = Math.ceil(totalCount / limit);
  var hasNextPage = page < totalPages;
  var hasPrevPage = page > 1;
  return {
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      limit: limit,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

// Helper function to build date filter for Prisma queries
var _buildDateFilter = exports.buildDateFilter = function _buildDateFilter(startTime, endTime) {
  if (!startTime && !endTime) return {};
  var dateFilter = {};
  if (startTime) dateFilter.gte = startTime;
  if (endTime) dateFilter.lte = endTime;
  return {
    timestamp: dateFilter
  };
};

// Enhanced pagination middleware with custom limits for specific routes
var createPaginationMiddleware = exports.createPaginationMiddleware = function createPaginationMiddleware() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var config = {
    defaultLimit: options.defaultLimit || PAGINATION_CONFIG.DEFAULT_LIMIT,
    maxLimit: options.maxLimit || PAGINATION_CONFIG.MAX_LIMIT,
    allowDateFilter: options.allowDateFilter !== false,
    // Default true
    maxRangeDays: options.maxRangeDays || 365
  };
  return function (req, res, next) {
    try {
      var _req$query2 = req.query,
        page = _req$query2.page,
        limit = _req$query2.limit,
        startTime = _req$query2.startTime,
        endTime = _req$query2.endTime;

      // Parse and validate page
      page = parseInt(page);
      if (isNaN(page) || page < PAGINATION_CONFIG.MIN_PAGE) {
        page = PAGINATION_CONFIG.DEFAULT_PAGE;
      }

      // Parse and validate limit with custom config
      limit = parseInt(limit);
      if (isNaN(limit) || limit < PAGINATION_CONFIG.MIN_LIMIT) {
        limit = config.defaultLimit;
      }
      if (limit > config.maxLimit) {
        return next(new _globaleerorshandling.AppError("Limit cannot exceed ".concat(config.maxLimit, " items per page"), 400));
      }

      // Handle date filtering if allowed
      var parsedStartTime = null;
      var parsedEndTime = null;
      if (config.allowDateFilter) {
        if (startTime) {
          parsedStartTime = new Date(startTime);
          if (isNaN(parsedStartTime.getTime())) {
            return next(new _globaleerorshandling.AppError('Invalid startTime format', 400));
          }
        }
        if (endTime) {
          parsedEndTime = new Date(endTime);
          if (isNaN(parsedEndTime.getTime())) {
            return next(new _globaleerorshandling.AppError('Invalid endTime format', 400));
          }
        }

        // Validate date range
        if (parsedStartTime && parsedEndTime) {
          if (parsedStartTime >= parsedEndTime) {
            return next(new _globaleerorshandling.AppError('startTime must be before endTime', 400));
          }
          var rangeDays = (parsedEndTime - parsedStartTime) / (1000 * 60 * 60 * 24);
          if (rangeDays > config.maxRangeDays) {
            return next(new _globaleerorshandling.AppError("Date range cannot exceed ".concat(config.maxRangeDays, " days"), 400));
          }
        }
      }
      var skip = (page - 1) * limit;
      req.pagination = {
        page: page,
        limit: limit,
        skip: skip,
        take: limit,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        buildMeta: function buildMeta(totalCount) {
          return buildPaginationMeta(page, limit, totalCount);
        },
        buildDateFilter: function buildDateFilter() {
          return _buildDateFilter(parsedStartTime, parsedEndTime);
        }
      };
      next();
    } catch (error) {
      next(new _globaleerorshandling.AppError('Pagination processing failed', 500));
    }
  };
};

// Utility function for paginated responses
var createPaginatedResponse = exports.createPaginatedResponse = function createPaginatedResponse(data, meta) {
  var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Data retrieved successfully';
  return {
    success: true,
    message: message,
    data: data,
    meta: meta
  };
};

// Default export
var _default = exports["default"] = paginationMiddleware;