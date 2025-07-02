"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaginationService = void 0;
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PaginationService = exports.PaginationService = /*#__PURE__*/function () {
  function PaginationService() {
    _classCallCheck(this, PaginationService);
  }
  return _createClass(PaginationService, null, [{
    key: "getPaginationDetails",
    value:
    /**
     * Get detailed pagination metadata
     * @param {number} totalItems - Total number of items
     * @param {number} currentPage - Current page number
     * @param {number} pageSize - Number of items per page
     * @returns {Object} - Detailed pagination information
     */
    function getPaginationDetails(totalItems) {
      var currentPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.DEFAULT_PAGE;
      var pageSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_LIMIT;
      try {
        // Validate inputs
        if (totalItems < 0) {
          throw new _globaleerorshandling.AppError('Total items cannot be negative', 400);
        }
        if (currentPage < this.MIN_PAGE) {
          throw new _globaleerorshandling.AppError("Page number must be at least ".concat(this.MIN_PAGE), 400);
        }
        if (pageSize < this.MIN_LIMIT || pageSize > this.MAX_LIMIT) {
          throw new _globaleerorshandling.AppError("Page size must be between ".concat(this.MIN_LIMIT, " and ").concat(this.MAX_LIMIT), 400);
        }
        var totalPages = Math.ceil(totalItems / pageSize);
        var skip = (currentPage - 1) * pageSize;
        var hasNextPage = currentPage < totalPages;
        var hasPrevPage = currentPage > 1;
        return {
          total: totalItems,
          page: currentPage,
          limit: pageSize,
          pages: totalPages,
          skip: skip,
          take: pageSize,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextPage: hasNextPage ? currentPage + 1 : null,
          prevPage: hasPrevPage ? currentPage - 1 : null,
          startIndex: totalItems > 0 ? skip + 1 : 0,
          endIndex: Math.min(skip + pageSize, totalItems),
          isFirstPage: currentPage === 1,
          isLastPage: currentPage === totalPages || totalPages === 0
        };
      } catch (error) {
        if (error instanceof _globaleerorshandling.AppError) throw error;
        console.error('Error in getPaginationDetails:', error);
        throw new _globaleerorshandling.AppError('Failed to calculate pagination details', 500);
      }
    }

    /**
     * Parse and validate pagination parameters from query
     * @param {Object} query - Request query parameters
     * @param {number} defaultLimit - Default items per page
     * @returns {Object} - Parsed and validated pagination parameters
     */
  }, {
    key: "parsePaginationParams",
    value: function parsePaginationParams(query) {
      var _this = this;
      var defaultLimit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.DEFAULT_LIMIT;
      try {
        var page = parseInt(query.page, 10) || this.DEFAULT_PAGE;
        var limit = parseInt(query.limit, 10) || defaultLimit;

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
        var skip = (page - 1) * limit;
        return {
          page: page,
          limit: limit,
          skip: skip,
          take: limit,
          // Helper function to build metadata
          buildMeta: function buildMeta(totalCount) {
            return _this.buildResponseMeta(totalCount, page, limit, query);
          }
        };
      } catch (error) {
        console.error('Error parsing pagination parameters:', error);
        throw new _globaleerorshandling.AppError('Invalid pagination parameters', 400);
      }
    }

    /**
     * Apply pagination to Prisma query object
     * @param {Object} query - Prisma query object
     * @param {number} skip - Number of records to skip
     * @param {number} take - Number of records to take
     * @returns {Object} - Query with pagination applied
     */
  }, {
    key: "applyPagination",
    value: function applyPagination(query, skip, take) {
      try {
        return _objectSpread(_objectSpread({}, query), {}, {
          skip: Math.max(0, skip),
          // Ensure skip is not negative
          take: Math.min(take, this.MAX_LIMIT) // Ensure take doesn't exceed max limit
        });
      } catch (error) {
        console.error('Error applying pagination:', error);
        throw new _globaleerorshandling.AppError('Failed to apply pagination to query', 500);
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
  }, {
    key: "paginatedResponse",
    value: function paginatedResponse(data, paginationDetails) {
      var message = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Data retrieved successfully';
      var additionalMeta = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      try {
        return {
          success: true,
          message: message,
          data: data,
          meta: _objectSpread({
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
            }
          }, additionalMeta),
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error creating paginated response:', error);
        throw new _globaleerorshandling.AppError('Failed to create paginated response', 500);
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
  }, {
    key: "buildResponseMeta",
    value: function buildResponseMeta(totalCount, page, limit) {
      var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      try {
        var paginationDetails = this.getPaginationDetails(totalCount, page, limit);

        // Extract filter information from query
        var filters = {};
        var filterKeys = ['status', 'vehicleType', 'fuelType', 'emissionStatus', 'search', 'userId', 'sortBy', 'sortOrder'];
        filterKeys.forEach(function (key) {
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
        throw new _globaleerorshandling.AppError('Failed to build response metadata', 500);
      }
    }

    /**
     * Process pagination for multiple datasets
     * @param {Object} counts - Object with dataset names as keys and counts as values
     * @param {Object} paginationParams - Pagination parameters
     * @returns {Object} - Pagination details for each dataset
     */
  }, {
    key: "processMultipleDatasets",
    value: function processMultipleDatasets(counts, paginationParams) {
      try {
        var pagination = {};
        for (var _i = 0, _Object$entries = Object.entries(counts); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            count = _Object$entries$_i[1];
          if (typeof count !== 'number' || count < 0) {
            throw new _globaleerorshandling.AppError("Invalid count for dataset '".concat(key, "': must be a non-negative number"), 400);
          }
          pagination[key] = this.getPaginationDetails(count, paginationParams.page, paginationParams.limit);
        }
        return pagination;
      } catch (error) {
        if (error instanceof _globaleerorshandling.AppError) throw error;
        console.error('Error processing multiple datasets:', error);
        throw new _globaleerorshandling.AppError('Failed to process pagination for multiple datasets', 500);
      }
    }

    /**
     * Create pagination links for API navigation
     * @param {string} baseUrl - Base URL for the API endpoint
     * @param {Object} paginationDetails - Pagination metadata
     * @param {Object} queryParams - Additional query parameters
     * @returns {Object} - Navigation links
     */
  }, {
    key: "createPaginationLinks",
    value: function createPaginationLinks(baseUrl, paginationDetails) {
      var queryParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      try {
        var buildUrl = function buildUrl(page) {
          var params = new URLSearchParams(_objectSpread(_objectSpread({}, queryParams), {}, {
            page: page.toString(),
            limit: paginationDetails.limit.toString()
          }));
          return "".concat(baseUrl, "?").concat(params.toString());
        };
        var links = {
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
        throw new _globaleerorshandling.AppError('Failed to create pagination links', 500);
      }
    }

    /**
     * Validate pagination parameters for security
     * @param {Object} params - Pagination parameters to validate
     * @returns {Object} - Validated and sanitized parameters
     */
  }, {
    key: "validateAndSanitize",
    value: function validateAndSanitize(params) {
      try {
        var page = params.page,
          limit = params.limit,
          skip = params.skip;

        // Validate page
        if (page && (isNaN(page) || page < this.MIN_PAGE)) {
          throw new _globaleerorshandling.AppError("Invalid page number. Must be at least ".concat(this.MIN_PAGE), 400);
        }

        // Validate limit
        if (limit && (isNaN(limit) || limit < this.MIN_LIMIT || limit > this.MAX_LIMIT)) {
          throw new _globaleerorshandling.AppError("Invalid limit. Must be between ".concat(this.MIN_LIMIT, " and ").concat(this.MAX_LIMIT), 400);
        }

        // Validate skip
        if (skip && (isNaN(skip) || skip < 0)) {
          throw new _globaleerorshandling.AppError('Invalid skip value. Must be non-negative', 400);
        }
        return {
          page: Math.max(page || this.DEFAULT_PAGE, this.MIN_PAGE),
          limit: Math.min(Math.max(limit || this.DEFAULT_LIMIT, this.MIN_LIMIT), this.MAX_LIMIT),
          skip: Math.max(skip || 0, 0)
        };
      } catch (error) {
        if (error instanceof _globaleerorshandling.AppError) throw error;
        console.error('Error validating pagination parameters:', error);
        throw new _globaleerorshandling.AppError('Invalid pagination parameters', 400);
      }
    }

    /**
     * Calculate offset-based pagination for different database systems
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Object} - Offset and limit for database queries
     */
  }, {
    key: "calculateOffset",
    value: function calculateOffset(page, limit) {
      try {
        var validatedParams = this.validateAndSanitize({
          page: page,
          limit: limit
        });
        return {
          offset: (validatedParams.page - 1) * validatedParams.limit,
          limit: validatedParams.limit
        };
      } catch (error) {
        if (error instanceof _globaleerorshandling.AppError) throw error;
        console.error('Error calculating offset:', error);
        throw new _globaleerorshandling.AppError('Failed to calculate pagination offset', 500);
      }
    }
  }]);
}();
// Configuration constants
_defineProperty(PaginationService, "DEFAULT_LIMIT", 10);
_defineProperty(PaginationService, "MAX_LIMIT", 100);
_defineProperty(PaginationService, "MIN_LIMIT", 1);
_defineProperty(PaginationService, "DEFAULT_PAGE", 1);
_defineProperty(PaginationService, "MIN_PAGE", 1);