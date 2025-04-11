// paginationService.js
export class PaginationService {
  /**
   * Create a standard pagination object
   * @param {number} totalItems - Total number of items
   * @param {number} currentPage - Current page number (default: 1)
   * @param {number} pageSize - Number of items per page (default: 10)
   * @returns {Object} - Pagination details object
   */
  static getPaginationDetails(totalItems, currentPage = 1, pageSize = 10) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (currentPage - 1) * pageSize;

    return {
      total: totalItems,
      page: currentPage,
      limit: pageSize,
      pages: totalPages,
      skip: skip,
    };
  }

  /**
   * Parse pagination parameters from request query
   * @param {Object} query - Request query object
   * @param {number} defaultLimit - Default limit if not provided (default: 10)
   * @returns {Object} - Parsed pagination parameters
   */
  static parsePaginationParams(query, defaultLimit = 1) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Apply pagination to a Prisma query
   * @param {Object} query - Prisma query object
   * @param {number} skip - Number of items to skip
   * @param {number} take - Number of items to take
   * @returns {Object} - Prisma query with pagination applied
   */
  static applyPagination(query, skip, take) {
    return {
      ...query,
      skip,
      take,
    };
  }

  /**
   * Generate pagination response object
   * @param {Array} data - The paginated data
   * @param {Object} paginationDetails - Pagination details object
   * @returns {Object} - Response object with data and pagination information
   */
  static paginatedResponse(data, paginationDetails) {
    return {
      data,
      pagination: {
        total: paginationDetails.total,
        page: paginationDetails.page,
        limit: paginationDetails.limit,
        pages: paginationDetails.pages,
      },
    };
  }

  /**
   * Process pagination for multiple data sets
   * @param {Object} counts - Object containing count for each data type
   * @param {Object} paginationParams - Pagination parameters (page, limit)
   * @returns {Object} - Pagination details for all data types
   */
  static processMultipleDatasets(counts, paginationParams) {
    const pagination = {};

    for (const [key, count] of Object.entries(counts)) {
      pagination[key] = this.getPaginationDetails(
        count,
        paginationParams.page,
        paginationParams.limit
      );
    }

    return pagination;
  }
}
