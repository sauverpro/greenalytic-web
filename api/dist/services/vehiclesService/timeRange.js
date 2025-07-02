"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeRangeService = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Service for handling time range calculations
 */
var TimeRangeService = exports.TimeRangeService = /*#__PURE__*/function () {
  function TimeRangeService() {
    _classCallCheck(this, TimeRangeService);
  }
  return _createClass(TimeRangeService, null, [{
    key: "getTimeRange",
    value:
    /**
     * Get a time range based on period type and value
     * @param {string} periodType - Type of period ('day', 'week', 'month', 'year', 'custom')
     * @param {string} periodValue - Value for the period (date, week number, month, year)
     * @returns {Object} - Start and end dates for the period
     */
    function getTimeRange(periodType, periodValue) {
      var now = new Date();
      var startDate;
      var endDate;
      if (!periodType || periodType === "all") {
        // Default to all time if no period specified
        startDate = new Date(2000, 0, 1); // Beginning of 2000
        endDate = new Date(now.getFullYear() + 10, 11, 31); // End of future year
        return {
          startDate: startDate,
          endDate: endDate
        };
      }
      switch (periodType) {
        case "day":
          if (periodValue) {
            // Specific day (YYYY-MM-DD)
            startDate = new Date(periodValue);
            endDate = new Date(periodValue);
          } else {
            // Today
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          }
          endDate.setHours(23, 59, 59, 999);
          break;
        case "week":
          if (periodValue) {
            // Specific week (YYYY-WW)
            var _periodValue$split = periodValue.split("-W"),
              _periodValue$split2 = _slicedToArray(_periodValue$split, 2),
              year = _periodValue$split2[0],
              week = _periodValue$split2[1];
            startDate = TimeRangeService.getDateOfWeek(parseInt(week), parseInt(year));
          } else {
            // Current week
            var currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
            var diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust to get Monday
            startDate = new Date(now.setDate(diff));
            startDate.setHours(0, 0, 0, 0);
          }
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "month":
          if (periodValue) {
            // Specific month (YYYY-MM)
            var _periodValue$split3 = periodValue.split("-"),
              _periodValue$split4 = _slicedToArray(_periodValue$split3, 2),
              _year = _periodValue$split4[0],
              month = _periodValue$split4[1];
            startDate = new Date(parseInt(_year), parseInt(month) - 1, 1);
            endDate = new Date(parseInt(_year), parseInt(month), 0);
          } else {
            // Current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          }
          endDate.setHours(23, 59, 59, 999);
          break;
        case "year":
          if (periodValue) {
            // Specific year (YYYY)
            startDate = new Date(parseInt(periodValue), 0, 1);
            endDate = new Date(parseInt(periodValue), 11, 31);
          } else {
            // Current year
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
          }
          endDate.setHours(23, 59, 59, 999);
          break;
        case "custom":
        default:
          // Custom range or fallback to current month if nothing specified
          if (periodValue) {
            var _periodValue$split5 = periodValue.split(","),
              _periodValue$split6 = _slicedToArray(_periodValue$split5, 2),
              start = _periodValue$split6[0],
              end = _periodValue$split6[1];
            startDate = new Date(start);
            endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
          } else {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
          }
      }
      return {
        startDate: startDate,
        endDate: endDate
      };
    }

    /**
     * Get the date of a specific week in a year
     * @param {number} week - Week number (1-53)
     * @param {number} year - Year
     * @returns {Date} - Date object representing the first day of the week
     */
  }, {
    key: "getDateOfWeek",
    value: function getDateOfWeek(week, year) {
      var date = new Date(year, 0, 1);
      var dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      var firstMonday = 1 + (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek);

      // Set to the first day of the requested week
      date.setDate(firstMonday + (week - 1) * 7);
      return date;
    }

    /**
     * Format a date range for display
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {string} - Formatted date range
     */
  }, {
    key: "formatDateRange",
    value: function formatDateRange(startDate, endDate) {
      var formatDate = function formatDate(date) {
        return date.toISOString().split("T")[0];
      };
      return "".concat(formatDate(startDate), " to ").concat(formatDate(endDate));
    }
  }]);
}();