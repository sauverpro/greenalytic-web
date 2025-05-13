export class PaginationService {
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

  static parsePaginationParams(query, defaultLimit = 200) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || defaultLimit;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  static applyPagination(query, skip, take) {
    return {
      ...query,
      skip,
      take,
    };
  }

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
