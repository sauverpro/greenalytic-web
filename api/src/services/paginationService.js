import { AppError } from '../middlewares/globaleerorshandling.js';

export class PaginationService {
  // Configuration constants
  static DEFAULT_LIMIT = 10;
  static MAX_LIMIT = 100;
  static MIN_LIMIT = 1;
  static DEFAULT_PAGE = 1;
  static MIN_PAGE = 1;

  /**
   * Get detailed pagination metadata
   * @param {number} totalItems - Total number of items
   * @param {number} currentPage - Current page number
   * @param {number} pageSize - Number of items per page
   * @returns {Object} - Detailed pagination information
   */
  static getPaginationDetails(totalItems, currentPage = this.DEFAULT_PAGE, pageSize = this.DEFAULT_LIMIT) {
    try {
      // Validate inputs
      if (totalItems < 0) {
        throw new AppError('Total items cannot be negative', 400);
      }

      if (currentPage < this.MIN_PAGE) {
        throw new AppError(`Page number must be at least ${this.MIN_PAGE}`, 400);
      }

      if (pageSize < this.MIN_LIMIT || pageSize > this.MAX_LIMIT) {
        throw new AppError(`Page size must be between ${this.MIN_LIMIT} and ${this.MAX_LIMIT}`, 400);
      }

      const totalPages = Math.ceil(totalItems / pageSize);
      const skip = (currentPage - 1) * pageSize;
      const hasNextPage = currentPage < totalPages;
      const hasPrevPage = currentPage > 1;

      return {
        total: totalItems,
        page: currentPage,
        limit: pageSize,
        pages: totalPages,
        skip: skip,
        take: pageSize,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? currentPage + 1 : null,
        prevPage: hasPrevPage ? currentPage - 1 : null,
        startIndex: totalItems > 0 ? skip + 1 : 0,
        endIndex: Math.min(skip + pageSize, totalItems),
        isFirstPage: currentPage === 1,
        isLastPage: currentPage === totalPages || totalPages === 0
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error in getPaginationDetails:', error);
      throw new AppError('Failed to calculate pagination details', 500);
    }
  }

  /**
   * Parse and validate pagination parameters from query
   * @param {Object} query - Request query parameters
   * @param {number} defaultLimit - Default items per page
   * @returns {Object} - Parsed and validated pagination parameters
   */
  static parsePaginationParams(query, defaultLimit = this.DEFAULT_LIMIT) {
    try {
      let page = parseInt(query.page, 10) || this.DEFAULT_PAGE;
      let limit = parseInt(query.limit, 10) || defaultLimit;

      // Validate and constrain values
      if (page < this.MIN_PAGE) {
        page = this.DEFAULT_PAGE;
      }

      if (limit < this.MIN_LIMIT) {
        limit = this.MIN_LIMIT;
      }

      if (limit > this.MAX_LIMIT) {
        limit = this.MAX_LIMIT;
      }

      const skip = (page - 1) * limit;

      return { 
        page, 
        limit, 
        skip,
        take: limit,
        // Helper function to build metadata
        buildMeta: (totalCount) => this.buildResponseMeta(totalCount, page, limit, query)
      };
    } catch (error) {
      console.error('Error parsing pagination parameters:', error);
      throw new AppError('Invalid pagination parameters', 400);
    }
  }

  /**
   * Apply pagination to Prisma query object
   * @param {Object} query - Prisma query object
   * @param {number} skip - Number of records to skip
   * @param {number} take - Number of records to take
   * @returns {Object} - Query with pagination applied
   */
  static applyPagination(query, skip, take) {
    try {
      return {
        ...query,
        skip: Math.max(0, skip), // Ensure skip is not negative
        take: Math.min(take, this.MAX_LIMIT), // Ensure take doesn't exceed max limit
      };
    } catch (error) {
      console.error('Error applying pagination:', error);
      throw new AppError('Failed to apply pagination to query', 500);
    }
  }

  /**
   * Create a standardized paginated response
   * @param {Array} data - Array of data items
   * @param {Object} paginationDetails - Pagination metadata
   * @param {string} message - Response message
   * @param {Object} additionalMeta - Additional metadata
   * @returns {Object} - Standardized paginated response
   */
  static paginatedResponse(data, paginationDetails, message = 'Data retrieved successfully', additionalMeta = {}) {
    try {
      return {
        success: true,
        message,
        data,
        meta: {
          pagination: {
            currentPage: paginationDetails.page,
            totalPages: paginationDetails.pages,
            totalCount: paginationDetails.total,
            limit: paginationDetails.limit,
            hasNextPage: paginationDetails.hasNextPage,
            hasPrevPage: paginationDetails.hasPrevPage,
            nextPage: paginationDetails.nextPage,
            prevPage: paginationDetails.prevPage,
            startIndex: paginationDetails.startIndex,
            endIndex: paginationDetails.endIndex,
            isFirstPage: paginationDetails.isFirstPage,
            isLastPage: paginationDetails.isLastPage
          },
          ...additionalMeta
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating paginated response:', error);
      throw new AppError('Failed to create paginated response', 500);
    }
  }

  /**
   * Build response metadata including pagination and filters
   * @param {number} totalCount - Total number of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {Object} query - Original query parameters
   * @returns {Object} - Complete metadata object
   */
  static buildResponseMeta(totalCount, page, limit, query = {}) {
    try {
      const paginationDetails = this.getPaginationDetails(totalCount, page, limit);
      
      // Extract filter information from query
      const filters = {};
      const filterKeys = ['status', 'vehicleType', 'fuelType', 'emissionStatus', 'search', 'userId', 'sortBy', 'sortOrder'];
      
      filterKeys.forEach(key => {
        if (query[key]) {
          filters[key] = query[key];
        }
      });

      return {
        pagination: {
          currentPage: paginationDetails.page,
          totalPages: paginationDetails.pages,
          totalCount: paginationDetails.total,
          limit: paginationDetails.limit,
          hasNextPage: paginationDetails.hasNextPage,
          hasPrevPage: paginationDetails.hasPrevPage,
          nextPage: paginationDetails.nextPage,
          prevPage: paginationDetails.prevPage,
          startIndex: paginationDetails.startIndex,
          endIndex: paginationDetails.endIndex
        },
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sorting: query.sortBy ? {
          field: query.sortBy,
          order: query.sortOrder || 'desc'
        } : undefined
      };
    } catch (error) {
      console.error('Error building response metadata:', error);
      throw new AppError('Failed to build response metadata', 500);
    }
  }

  /**
   * Process pagination for multiple datasets
   * @param {Object} counts - Object with dataset names as keys and counts as values
   * @param {Object} paginationParams - Pagination parameters
   * @returns {Object} - Pagination details for each dataset
   */
  static processMultipleDatasets(counts, paginationParams) {
    try {
      const pagination = {};

      for (const [key, count] of Object.entries(counts)) {
        if (typeof count !== 'number' || count < 0) {
          throw new AppError(`Invalid count for dataset '${key}': must be a non-negative number`, 400);
        }

        pagination[key] = this.getPaginationDetails(
          count,
          paginationParams.page,
          paginationParams.limit
        );
      }

      return pagination;
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error processing multiple datasets:', error);
      throw new AppError('Failed to process pagination for multiple datasets', 500);
    }
  }

  /**
   * Create pagination links for API navigation
   * @param {string} baseUrl - Base URL for the API endpoint
   * @param {Object} paginationDetails - Pagination metadata
   * @param {Object} queryParams - Additional query parameters
   * @returns {Object} - Navigation links
   */
  static createPaginationLinks(baseUrl, paginationDetails, queryParams = {}) {
    try {
      const buildUrl = (page) => {
        const params = new URLSearchParams({
          ...queryParams,
          page: page.toString(),
          limit: paginationDetails.limit.toString()
        });
        return `${baseUrl}?${params.toString()}`;
      };

      const links = {
        self: buildUrl(paginationDetails.page),
        first: buildUrl(1),
        last: buildUrl(paginationDetails.pages)
      };

      if (paginationDetails.hasPrevPage) {
        links.prev = buildUrl(paginationDetails.prevPage);
      }

      if (paginationDetails.hasNextPage) {
        links.next = buildUrl(paginationDetails.nextPage);
      }

      return links;
    } catch (error) {
      console.error('Error creating pagination links:', error);
      throw new AppError('Failed to create pagination links', 500);
    }
  }

  /**
   * Validate pagination parameters for security
   * @param {Object} params - Pagination parameters to validate
   * @returns {Object} - Validated and sanitized parameters
   */
  static validateAndSanitize(params) {
    try {
      const { page, limit, skip } = params;

      // Validate page
      if (page && (isNaN(page) || page < this.MIN_PAGE)) {
        throw new AppError(`Invalid page number. Must be at least ${this.MIN_PAGE}`, 400);
      }

      // Validate limit
      if (limit && (isNaN(limit) || limit < this.MIN_LIMIT || limit > this.MAX_LIMIT)) {
        throw new AppError(`Invalid limit. Must be between ${this.MIN_LIMIT} and ${this.MAX_LIMIT}`, 400);
      }

      // Validate skip
      if (skip && (isNaN(skip) || skip < 0)) {
        throw new AppError('Invalid skip value. Must be non-negative', 400);
      }

      return {
        page: Math.max(page || this.DEFAULT_PAGE, this.MIN_PAGE),
        limit: Math.min(Math.max(limit || this.DEFAULT_LIMIT, this.MIN_LIMIT), this.MAX_LIMIT),
        skip: Math.max(skip || 0, 0)
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error validating pagination parameters:', error);
      throw new AppError('Invalid pagination parameters', 400);
    }
  }

  /**
   * Calculate offset-based pagination for different database systems
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} - Offset and limit for database queries
   */
  static calculateOffset(page, limit) {
    try {
      const validatedParams = this.validateAndSanitize({ page, limit });
      
      return {
        offset: (validatedParams.page - 1) * validatedParams.limit,
        limit: validatedParams.limit
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Error calculating offset:', error);
      throw new AppError('Failed to calculate pagination offset', 500);
    }
  }
}