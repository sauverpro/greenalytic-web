import { AppError } from './globaleerorshandling.js';

// Configuration constants
const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_PAGE: 1
};

export const paginationMiddleware = (req, res, next) => {
  try {
    let { page, limit, startTime, endTime } = req.query;

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
      return next(new AppError(
        `Limit cannot exceed ${PAGINATION_CONFIG.MAX_LIMIT} items per page. Please use a smaller limit.`,
        400
      ));
    }

    // Parse and validate dates
    let parsedStartTime = null;
    let parsedEndTime = null;

    if (startTime) {
      parsedStartTime = new Date(startTime);
      if (isNaN(parsedStartTime.getTime())) {
        return next(new AppError(
          'Invalid startTime format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          400
        ));
      }
    }

    if (endTime) {
      parsedEndTime = new Date(endTime);
      if (isNaN(parsedEndTime.getTime())) {
        return next(new AppError(
          'Invalid endTime format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          400
        ));
      }
    }

    // Validate date range
    if (parsedStartTime && parsedEndTime) {
      if (parsedStartTime >= parsedEndTime) {
        return next(new AppError(
          'startTime must be before endTime',
          400
        ));
      }

      // Check if date range is too large (optional - prevent huge queries)
      const maxRangeDays = 365; // 1 year max
      const rangeDays = (parsedEndTime - parsedStartTime) / (1000 * 60 * 60 * 24);
      if (rangeDays > maxRangeDays) {
        return next(new AppError(
          `Date range cannot exceed ${maxRangeDays} days. Please use a smaller range.`,
          400
        ));
      }
    }

    // Calculate skip value for database queries
    const skip = (page - 1) * limit;

    // Attach pagination details to req.pagination
    req.pagination = {
      page,
      limit,
      skip,
      take: limit, // Prisma uses 'take' instead of 'limit'
      startTime: parsedStartTime,
      endTime: parsedEndTime,
      // Helper methods for building responses
      buildMeta: (totalCount) => buildPaginationMeta(page, limit, totalCount),
      buildDateFilter: () => buildDateFilter(parsedStartTime, parsedEndTime)
    };

    next();
  } catch (error) {
    next(new AppError('Pagination processing failed', 500));
  }
};

// Helper function to build pagination metadata
export const buildPaginationMeta = (page, limit, totalCount) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  };
};

// Helper function to build date filter for Prisma queries
export const buildDateFilter = (startTime, endTime) => {
  if (!startTime && !endTime) return {};

  const dateFilter = {};
  if (startTime) dateFilter.gte = startTime;
  if (endTime) dateFilter.lte = endTime;

  return { timestamp: dateFilter };
};

// Enhanced pagination middleware with custom limits for specific routes
export const createPaginationMiddleware = (options = {}) => {
  const config = {
    defaultLimit: options.defaultLimit || PAGINATION_CONFIG.DEFAULT_LIMIT,
    maxLimit: options.maxLimit || PAGINATION_CONFIG.MAX_LIMIT,
    allowDateFilter: options.allowDateFilter !== false, // Default true
    maxRangeDays: options.maxRangeDays || 365
  };

  return (req, res, next) => {
    try {
      let { page, limit, startTime, endTime } = req.query;

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
        return next(new AppError(
          `Limit cannot exceed ${config.maxLimit} items per page`,
          400
        ));
      }

      // Handle date filtering if allowed
      let parsedStartTime = null;
      let parsedEndTime = null;

      if (config.allowDateFilter) {
        if (startTime) {
          parsedStartTime = new Date(startTime);
          if (isNaN(parsedStartTime.getTime())) {
            return next(new AppError('Invalid startTime format', 400));
          }
        }

        if (endTime) {
          parsedEndTime = new Date(endTime);
          if (isNaN(parsedEndTime.getTime())) {
            return next(new AppError('Invalid endTime format', 400));
          }
        }

        // Validate date range
        if (parsedStartTime && parsedEndTime) {
          if (parsedStartTime >= parsedEndTime) {
            return next(new AppError('startTime must be before endTime', 400));
          }

          const rangeDays = (parsedEndTime - parsedStartTime) / (1000 * 60 * 60 * 24);
          if (rangeDays > config.maxRangeDays) {
            return next(new AppError(
              `Date range cannot exceed ${config.maxRangeDays} days`,
              400
            ));
          }
        }
      }

      const skip = (page - 1) * limit;

      req.pagination = {
        page,
        limit,
        skip,
        take: limit,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        buildMeta: (totalCount) => buildPaginationMeta(page, limit, totalCount),
        buildDateFilter: () => buildDateFilter(parsedStartTime, parsedEndTime)
      };

      next();
    } catch (error) {
      next(new AppError('Pagination processing failed', 500));
    }
  };
};

// Utility function for paginated responses
export const createPaginatedResponse = (data, meta, message = 'Data retrieved successfully') => {
  return {
    success: true,
    message,
    data,
    meta
  };
};

// Default export
export default paginationMiddleware;