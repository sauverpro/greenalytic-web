"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vehicleDataController = void 0;
var _client = require("@prisma/client");
var _errorHandler = require("../utils/errorHandler.js");
var _vehicleService = require("../services/vehiclesService/vehicleService.js");
var _vehicleDataController;
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var prisma = new _client.PrismaClient();

// Emission thresholds - to be confirmed with Emmanuel
var EMISSION_THRESHOLDS = {
  co2: {
    warning: 0.5,
    critical: 1.0
  },
  co: {
    warning: 0.3,
    critical: 0.5
  },
  hc: {
    warning: 200,
    critical: 400
  },
  nox: {
    warning: 100,
    critical: 200
  },
  pm25: {
    warning: 25,
    critical: 50
  }
};
var vehicleDataController = exports.vehicleDataController = /*#__PURE__*/_createClass(function vehicleDataController() {
  _classCallCheck(this, vehicleDataController);
});
_vehicleDataController = vehicleDataController;
_defineProperty(vehicleDataController, "getVehiclesByLoggedUser", /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var userId, _req$query, status, vehicleType, fuelType, emissionStatus, pagination, filters, validStatuses, validVehicleTypes, validFuelTypes, validEmissionStatuses, result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.userId;
          _req$query = req.query, status = _req$query.status, vehicleType = _req$query.vehicleType, fuelType = _req$query.fuelType, emissionStatus = _req$query.emissionStatus;
          pagination = req.pagination; // Build filters
          filters = {}; // Validate and add status filter
          if (!status) {
            _context.next = 10;
            break;
          }
          validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
          if (validStatuses.includes(status)) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(', '))
          }));
        case 9:
          filters.status = status;
        case 10:
          if (!vehicleType) {
            _context.next = 15;
            break;
          }
          validVehicleTypes = ['CAR', 'TRUCK', 'BUS', 'MOTORCYCLE', 'OTHER'];
          if (validVehicleTypes.includes(vehicleType)) {
            _context.next = 14;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle type. Must be one of: ".concat(validVehicleTypes.join(', '))
          }));
        case 14:
          filters.vehicleType = vehicleType;
        case 15:
          if (!fuelType) {
            _context.next = 20;
            break;
          }
          validFuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
          if (validFuelTypes.includes(fuelType)) {
            _context.next = 19;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid fuel type. Must be one of: ".concat(validFuelTypes.join(', '))
          }));
        case 19:
          filters.fuelType = fuelType;
        case 20:
          if (!emissionStatus) {
            _context.next = 25;
            break;
          }
          validEmissionStatuses = ['LOW', 'NORMAL', 'HIGH'];
          if (validEmissionStatuses.includes(emissionStatus)) {
            _context.next = 24;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid emission status. Must be one of: ".concat(validEmissionStatuses.join(', '))
          }));
        case 24:
          filters.emissionStatus = emissionStatus;
        case 25:
          _context.next = 27;
          return _vehicleService.VehicleService.getVehiclesByUserId(userId, pagination, filters);
        case 27:
          result = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            success: true,
            message: "User vehicles retrieved successfully",
            data: result.data,
            meta: result.meta
          }));
        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", (0, _errorHandler.errorHandler)(res, _context.t0));
        case 34:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 31]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "getEmissionsDataByTimeRange", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var vehicleId, _req$query2, startDate, endDate, emissionLevel, userId, pagination, parsedVehicleId, parsedStartDate, parsedEndDate, vehicleExistsAndBelongs, whereClause, _yield$Promise$all, _yield$Promise$all2, totalItems, result, enhancedData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$query2 = req.query, startDate = _req$query2.startDate, endDate = _req$query2.endDate, emissionLevel = _req$query2.emissionLevel;
          userId = req.userId;
          pagination = req.pagination;
          if (!(!vehicleId || !startDate || !endDate)) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Vehicle ID, start date, and end date are required"
          }));
        case 7:
          parsedVehicleId = parseInt(vehicleId);
          if (!isNaN(parsedVehicleId)) {
            _context2.next = 10;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
          }));
        case 10:
          parsedStartDate = new Date(startDate);
          parsedEndDate = new Date(endDate); // Validate dates
          if (!(isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime()))) {
            _context2.next = 14;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid date format. Use ISO 8601 format"
          }));
        case 14:
          // Maximize the end date to include the full day
          parsedEndDate.setHours(23, 59, 59, 999);
          _context2.next = 17;
          return _vehicleService.VehicleService.vehicleExistsAndBelongsToUser(parsedVehicleId, userId);
        case 17:
          vehicleExistsAndBelongs = _context2.sent;
          if (vehicleExistsAndBelongs) {
            _context2.next = 20;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "Vehicle not found or does not belong to the user"
          }));
        case 20:
          whereClause = {
            vehicleId: parsedVehicleId,
            timestamp: {
              gte: parsedStartDate,
              lte: parsedEndDate
            }
          }; // Add emission level filtering
          if (emissionLevel) {
            if (emissionLevel === 'HIGH') {
              whereClause.OR = [{
                co2Percentage: {
                  gte: EMISSION_THRESHOLDS.co2.warning
                }
              }, {
                coPercentage: {
                  gte: EMISSION_THRESHOLDS.co.warning
                }
              }, {
                hcPPM: {
                  gte: EMISSION_THRESHOLDS.hc.warning
                }
              }, {
                noxPPM: {
                  gte: EMISSION_THRESHOLDS.nox.warning
                }
              }, {
                pm25Level: {
                  gte: EMISSION_THRESHOLDS.pm25.warning
                }
              }];
            } else if (emissionLevel === 'CRITICAL') {
              whereClause.OR = [{
                co2Percentage: {
                  gte: EMISSION_THRESHOLDS.co2.critical
                }
              }, {
                coPercentage: {
                  gte: EMISSION_THRESHOLDS.co.critical
                }
              }, {
                hcPPM: {
                  gte: EMISSION_THRESHOLDS.hc.critical
                }
              }, {
                noxPPM: {
                  gte: EMISSION_THRESHOLDS.nox.critical
                }
              }, {
                pm25Level: {
                  gte: EMISSION_THRESHOLDS.pm25.critical
                }
              }];
            }
          }
          _context2.next = 24;
          return Promise.all([prisma.emissionData.count({
            where: whereClause
          }), prisma.emissionData.findMany({
            where: whereClause,
            orderBy: {
              timestamp: "asc"
            },
            skip: pagination.skip,
            take: pagination.take,
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  status: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true,
                  deviceCategory: true
                }
              }
            }
          })]);
        case 24:
          _yield$Promise$all = _context2.sent;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          totalItems = _yield$Promise$all2[0];
          result = _yield$Promise$all2[1];
          // Enhance data with emission level classification
          enhancedData = result.map(function (data) {
            var isCritical = data.co2Percentage >= EMISSION_THRESHOLDS.co2.critical || data.coPercentage >= EMISSION_THRESHOLDS.co.critical || data.hcPPM >= EMISSION_THRESHOLDS.hc.critical || data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.critical || data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.critical;
            var isHigh = data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning || data.coPercentage >= EMISSION_THRESHOLDS.co.warning || data.hcPPM >= EMISSION_THRESHOLDS.hc.warning || data.noxPPM && data.noxPPM >= EMISSION_THRESHOLDS.nox.warning || data.pm25Level && data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning;
            var emissionLevel = 'NORMAL';
            if (isCritical) emissionLevel = 'CRITICAL';else if (isHigh) emissionLevel = 'HIGH';
            return _objectSpread(_objectSpread({}, data), {}, {
              emissionLevel: emissionLevel,
              exceedsThresholds: {
                co2: data.co2Percentage >= EMISSION_THRESHOLDS.co2.warning,
                co: data.coPercentage >= EMISSION_THRESHOLDS.co.warning,
                hc: data.hcPPM >= EMISSION_THRESHOLDS.hc.warning,
                nox: data.noxPPM ? data.noxPPM >= EMISSION_THRESHOLDS.nox.warning : false,
                pm25: data.pm25Level ? data.pm25Level >= EMISSION_THRESHOLDS.pm25.warning : false
              }
            });
          });
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: "Emission data retrieved successfully",
            timeRange: {
              start: parsedStartDate,
              end: parsedEndDate
            },
            data: enhancedData,
            meta: {
              page: pagination.page,
              limit: pagination.limit,
              totalCount: totalItems,
              totalPages: Math.ceil(totalItems / pagination.limit),
              filters: {
                applied: {
                  emissionLevel: emissionLevel
                },
                thresholds: EMISSION_THRESHOLDS
              }
            }
          }));
        case 32:
          _context2.prev = 32;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", (0, _errorHandler.errorHandler)(res, _context2.t0));
        case 35:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 32]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "getFuelsDataByTimeRange", /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var vehicleId, _req$query3, startDate, endDate, fuelLevel, consumptionLevel, userId, pagination, parsedVehicleId, parsedStartDate, parsedEndDate, vehicleExistsAndBelongs, whereClause, _yield$Promise$all3, _yield$Promise$all4, totalItems, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$query3 = req.query, startDate = _req$query3.startDate, endDate = _req$query3.endDate, fuelLevel = _req$query3.fuelLevel, consumptionLevel = _req$query3.consumptionLevel;
          userId = req.userId;
          pagination = req.pagination;
          if (!(!vehicleId || !startDate || !endDate)) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Vehicle ID, start date, and end date are required"
          }));
        case 7:
          parsedVehicleId = parseInt(vehicleId);
          if (!isNaN(parsedVehicleId)) {
            _context3.next = 10;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
          }));
        case 10:
          parsedStartDate = new Date(startDate);
          parsedEndDate = new Date(endDate); // Validate dates
          if (!(isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime()))) {
            _context3.next = 14;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid date format. Use ISO 8601 format"
          }));
        case 14:
          // Maximize the end date to include the full day
          parsedEndDate.setHours(23, 59, 59, 999);
          _context3.next = 17;
          return _vehicleService.VehicleService.vehicleExistsAndBelongsToUser(parsedVehicleId, userId);
        case 17:
          vehicleExistsAndBelongs = _context3.sent;
          if (vehicleExistsAndBelongs) {
            _context3.next = 20;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            success: false,
            message: "Vehicle not found or does not belong to the user"
          }));
        case 20:
          whereClause = {
            vehicleId: parsedVehicleId,
            timestamp: {
              gte: parsedStartDate,
              lte: parsedEndDate
            }
          }; // Add fuel level filtering
          if (fuelLevel === 'LOW') {
            whereClause.fuelLevel = {
              lt: 20
            };
          } else if (fuelLevel === 'HIGH') {
            whereClause.fuelLevel = {
              gte: 80
            };
          }

          // Add consumption level filtering
          if (consumptionLevel === 'HIGH') {
            whereClause.fuelConsumption = {
              gte: 15
            };
          } else if (consumptionLevel === 'LOW') {
            whereClause.fuelConsumption = {
              lt: 5
            };
          }
          _context3.next = 25;
          return Promise.all([prisma.fuelData.count({
            where: whereClause
          }), prisma.fuelData.findMany({
            where: whereClause,
            orderBy: {
              timestamp: "asc"
            },
            skip: pagination.skip,
            take: pagination.take,
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  fuelType: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true
                }
              }
            }
          })]);
        case 25:
          _yield$Promise$all3 = _context3.sent;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 2);
          totalItems = _yield$Promise$all4[0];
          result = _yield$Promise$all4[1];
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: "Fuel data retrieved successfully",
            timeRange: {
              start: parsedStartDate,
              end: parsedEndDate
            },
            data: result,
            meta: {
              page: pagination.page,
              limit: pagination.limit,
              totalCount: totalItems,
              totalPages: Math.ceil(totalItems / pagination.limit),
              filters: {
                applied: {
                  fuelLevel: fuelLevel,
                  consumptionLevel: consumptionLevel
                }
              }
            }
          }));
        case 32:
          _context3.prev = 32;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", (0, _errorHandler.errorHandler)(res, _context3.t0));
        case 35:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 32]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "getGPSDataByTimeRange", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var vehicleId, _req$query4, startDate, endDate, speedRange, trackingStatus, userId, pagination, parsedVehicleId, parsedStartDate, parsedEndDate, vehicleExistsAndBelongs, whereClause, validStatuses, _yield$Promise$all5, _yield$Promise$all6, totalItems, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$query4 = req.query, startDate = _req$query4.startDate, endDate = _req$query4.endDate, speedRange = _req$query4.speedRange, trackingStatus = _req$query4.trackingStatus;
          userId = req.userId;
          pagination = req.pagination;
          if (!(!vehicleId || !startDate || !endDate)) {
            _context4.next = 7;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Vehicle ID, start date, and end date are required"
          }));
        case 7:
          parsedVehicleId = parseInt(vehicleId);
          if (!isNaN(parsedVehicleId)) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
          }));
        case 10:
          parsedStartDate = new Date(startDate);
          parsedEndDate = new Date(endDate); // Validate dates
          if (!(isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime()))) {
            _context4.next = 14;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid date format. Use ISO 8601 format"
          }));
        case 14:
          // Maximize the end date to include the full day
          parsedEndDate.setHours(23, 59, 59, 999);
          _context4.next = 17;
          return _vehicleService.VehicleService.vehicleExistsAndBelongsToUser(parsedVehicleId, userId);
        case 17:
          vehicleExistsAndBelongs = _context4.sent;
          if (vehicleExistsAndBelongs) {
            _context4.next = 20;
            break;
          }
          return _context4.abrupt("return", res.status(404).json({
            success: false,
            message: "Vehicle not found or does not belong to the user"
          }));
        case 20:
          whereClause = {
            vehicleId: parsedVehicleId,
            timestamp: {
              gte: parsedStartDate,
              lte: parsedEndDate
            }
          }; // Add speed range filtering
          if (speedRange === 'STATIONARY') {
            whereClause.speed = {
              lte: 3
            };
          } else if (speedRange === 'MOVING') {
            whereClause.speed = {
              gt: 3
            };
          } else if (speedRange === 'HIGH_SPEED') {
            whereClause.speed = {
              gte: 100
            };
          }

          // Add tracking status filtering
          if (!trackingStatus) {
            _context4.next = 27;
            break;
          }
          validStatuses = ['ACTIVE', 'INACTIVE', 'LOST_SIGNAL'];
          if (validStatuses.includes(trackingStatus)) {
            _context4.next = 26;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid tracking status. Must be one of: ".concat(validStatuses.join(', '))
          }));
        case 26:
          whereClause.trackingStatus = trackingStatus;
        case 27:
          _context4.next = 29;
          return Promise.all([prisma.gpsData.count({
            where: whereClause
          }), prisma.gpsData.findMany({
            where: whereClause,
            orderBy: {
              timestamp: "asc"
            },
            skip: pagination.skip,
            take: pagination.take,
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true
                }
              }
            }
          })]);
        case 29:
          _yield$Promise$all5 = _context4.sent;
          _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 2);
          totalItems = _yield$Promise$all6[0];
          result = _yield$Promise$all6[1];
          return _context4.abrupt("return", res.status(200).json({
            success: true,
            message: "GPS data retrieved successfully",
            timeRange: {
              start: parsedStartDate,
              end: parsedEndDate
            },
            data: result,
            meta: {
              page: pagination.page,
              limit: pagination.limit,
              totalCount: totalItems,
              totalPages: Math.ceil(totalItems / pagination.limit),
              filters: {
                applied: {
                  speedRange: speedRange,
                  trackingStatus: trackingStatus
                }
              }
            }
          }));
        case 36:
          _context4.prev = 36;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", (0, _errorHandler.errorHandler)(res, _context4.t0));
        case 39:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 36]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "getMapData", /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var _req$query5, startDate, endDate, vehicleStatus, emissionStatus, vehicleWhereClause, validStatuses, totalVehicles, latestGpsData, filteredGpsData;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _req$query5 = req.query, startDate = _req$query5.startDate, endDate = _req$query5.endDate, vehicleStatus = _req$query5.vehicleStatus, emissionStatus = _req$query5.emissionStatus; // Build vehicle filter
          vehicleWhereClause = {
            deletedAt: null
          };
          if (!vehicleStatus) {
            _context5.next = 8;
            break;
          }
          validStatuses = ['NORMAL_EMISSION', 'TOP_POLLUTING', 'INACTIVE_DISCONNECTED', 'UNDER_MAINTENANCE'];
          if (validStatuses.includes(vehicleStatus)) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle status. Must be one of: ".concat(validStatuses.join(', '))
          }));
        case 7:
          vehicleWhereClause.status = vehicleStatus;
        case 8:
          _context5.next = 10;
          return prisma.vehicle.count({
            where: vehicleWhereClause
          });
        case 10:
          totalVehicles = _context5.sent;
          _context5.next = 13;
          return prisma.gpsData.findMany({
            distinct: ['vehicleId'],
            orderBy: {
              timestamp: 'desc'
            },
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  status: true,
                  vehicleType: true,
                  fuelType: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  deviceCategory: true,
                  status: true
                }
              }
            }
          });
        case 13:
          latestGpsData = _context5.sent;
          // Filter by emission status if provided
          filteredGpsData = latestGpsData;
          if (emissionStatus) {
            filteredGpsData = latestGpsData.filter(function (gps) {
              return gps.vehicle && gps.vehicle.status === emissionStatus;
            });
          }
          return _context5.abrupt("return", res.status(200).json({
            success: true,
            message: "Map data retrieved successfully",
            totalVehicles: totalVehicles,
            vehiclesWithGpsData: filteredGpsData.length,
            mapData: filteredGpsData.map(function (data) {
              return {
                id: data.id,
                latitude: data.latitude,
                longitude: data.longitude,
                plateNumber: data.plateNumber,
                speed: data.speed,
                accuracy: data.accuracy,
                timestamp: data.timestamp,
                vehicleId: data.vehicleId,
                trackingStatus: data.trackingStatus,
                trackingDeviceId: data.trackingDeviceId,
                vehicle: data.vehicle,
                trackingDevice: data.trackingDevice
              };
            }),
            filters: {
              applied: {
                vehicleStatus: vehicleStatus,
                emissionStatus: emissionStatus
              }
            }
          }));
        case 19:
          _context5.prev = 19;
          _context5.t0 = _context5["catch"](0);
          console.error("Error fetching vehicle map data:", _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            success: false,
            message: "Failed to fetch vehicle map data",
            error: _context5.t0.message
          }));
        case 23:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 19]]);
  }));
  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "getDashboardCounts", /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var timeFilter, validTimeFilters, dateFilter, now, startDate, quarterMonth, _yield$Promise$all7, _yield$Promise$all8, usersCount, vehiclesCount, devicesCount, gpsDataCount, fuelDataCount, emissionDataCount, vehiclesByStatus, alertsCount, gpsAnalytics, fuelAnalytics, emissionAnalytics;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          timeFilter = req.query.timeFilter; // Validate time filter
          validTimeFilters = ['today', 'week', 'month', 'quarter', 'year', 'all'];
          if (!(timeFilter && !validTimeFilters.includes(timeFilter))) {
            _context6.next = 5;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid time filter. Must be one of: ".concat(validTimeFilters.join(', '))
          }));
        case 5:
          dateFilter = {};
          if (!(timeFilter && timeFilter !== 'all')) {
            _context6.next = 28;
            break;
          }
          now = new Date();
          startDate = new Date();
          _context6.t0 = timeFilter;
          _context6.next = _context6.t0 === 'today' ? 12 : _context6.t0 === 'week' ? 14 : _context6.t0 === 'month' ? 17 : _context6.t0 === 'quarter' ? 20 : _context6.t0 === 'year' ? 24 : 27;
          break;
        case 12:
          startDate.setHours(0, 0, 0, 0);
          return _context6.abrupt("break", 27);
        case 14:
          startDate.setDate(now.getDate() - now.getDay());
          startDate.setHours(0, 0, 0, 0);
          return _context6.abrupt("break", 27);
        case 17:
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          return _context6.abrupt("break", 27);
        case 20:
          quarterMonth = Math.floor(now.getMonth() / 3) * 3;
          startDate.setMonth(quarterMonth, 1);
          startDate.setHours(0, 0, 0, 0);
          return _context6.abrupt("break", 27);
        case 24:
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
          return _context6.abrupt("break", 27);
        case 27:
          dateFilter.timestamp = {
            gte: startDate,
            lte: now
          };
        case 28:
          _context6.next = 30;
          return Promise.all([prisma.user.count({
            where: {
              deletedAt: null
            }
          }), prisma.vehicle.count({
            where: {
              deletedAt: null
            }
          }), prisma.trackingDevice.count({
            where: {
              deletedAt: null
            }
          }), prisma.gpsData.count({
            where: dateFilter
          }), prisma.fuelData.count({
            where: dateFilter
          }), prisma.emissionData.count({
            where: dateFilter
          }),
          // Enhanced vehicle status breakdown
          prisma.vehicle.groupBy({
            by: ['status'],
            _count: {
              status: true
            },
            where: {
              deletedAt: null
            }
          }),
          // Count recent alerts
          prisma.alert.count({
            where: _objectSpread(_objectSpread({}, dateFilter), {}, {
              isRead: false
            })
          })]);
        case 30:
          _yield$Promise$all7 = _context6.sent;
          _yield$Promise$all8 = _slicedToArray(_yield$Promise$all7, 8);
          usersCount = _yield$Promise$all8[0];
          vehiclesCount = _yield$Promise$all8[1];
          devicesCount = _yield$Promise$all8[2];
          gpsDataCount = _yield$Promise$all8[3];
          fuelDataCount = _yield$Promise$all8[4];
          emissionDataCount = _yield$Promise$all8[5];
          vehiclesByStatus = _yield$Promise$all8[6];
          alertsCount = _yield$Promise$all8[7];
          _context6.next = 42;
          return _vehicleDataController.calculateGPSAnalytics(dateFilter);
        case 42:
          gpsAnalytics = _context6.sent;
          _context6.next = 45;
          return _vehicleDataController.calculateFuelAnalytics(dateFilter);
        case 45:
          fuelAnalytics = _context6.sent;
          _context6.next = 48;
          return _vehicleDataController.calculateEmissionAnalytics(dateFilter);
        case 48:
          emissionAnalytics = _context6.sent;
          res.status(200).json({
            success: true,
            message: "Dashboard data retrieved successfully",
            timestamp: new Date(),
            timeFilter: timeFilter || 'all',
            counts: {
              users: usersCount,
              vehicles: vehiclesCount,
              devices: devicesCount,
              gpsData: gpsDataCount,
              fuelData: fuelDataCount,
              emissionData: emissionDataCount,
              unacknowledgedAlerts: alertsCount
            },
            vehicleBreakdown: vehiclesByStatus.reduce(function (acc, item) {
              acc[item.status] = item._count.status;
              return acc;
            }, {}),
            analytics: {
              gps: gpsAnalytics,
              fuel: fuelAnalytics,
              emissions: emissionAnalytics
            }
          });
          _context6.next = 56;
          break;
        case 52:
          _context6.prev = 52;
          _context6.t1 = _context6["catch"](0);
          console.error("Error fetching dashboard counts:", _context6.t1);
          res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard counts",
            error: _context6.t1.message
          });
        case 56:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 52]]);
  }));
  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "calculateGPSAnalytics", /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(dateFilter) {
    var gpsData, uniqueVehicles, movingVehicles, stoppedVehicles, totalSpeed, minSpeed, maxSpeed, highSpeedCount;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return prisma.gpsData.findMany({
            where: dateFilter,
            orderBy: {
              timestamp: "desc"
            },
            take: 1000,
            include: {
              vehicle: {
                select: {
                  plateNumber: true
                }
              }
            }
          });
        case 2:
          gpsData = _context7.sent;
          if (gpsData.length) {
            _context7.next = 5;
            break;
          }
          return _context7.abrupt("return", null);
        case 5:
          uniqueVehicles = new Set();
          movingVehicles = new Set();
          stoppedVehicles = new Set();
          totalSpeed = 0;
          minSpeed = Infinity;
          maxSpeed = 0;
          highSpeedCount = 0;
          gpsData.forEach(function (gps) {
            totalSpeed += gps.speed;
            minSpeed = Math.min(minSpeed, gps.speed);
            maxSpeed = Math.max(maxSpeed, gps.speed);
            uniqueVehicles.add(gps.plateNumber);
            if (gps.speed > 3) {
              movingVehicles.add(gps.plateNumber);
            } else {
              stoppedVehicles.add(gps.plateNumber);
            }
            if (gps.speed > 100) {
              highSpeedCount++;
            }
          });
          return _context7.abrupt("return", {
            speed: {
              average: parseFloat((totalSpeed / gpsData.length).toFixed(2)),
              min: minSpeed === Infinity ? 0 : minSpeed,
              max: maxSpeed
            },
            activeVehicles: uniqueVehicles.size,
            movingVehicles: movingVehicles.size,
            stoppedVehicles: stoppedVehicles.size,
            highSpeedCount: highSpeedCount,
            totalDataPoints: gpsData.length
          });
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x13) {
    return _ref7.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "calculateFuelAnalytics", /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(dateFilter) {
    var fuels, totalConsumption, minConsumption, maxConsumption, totalLevel, minLevel, maxLevel, lowFuelCount, highConsumptionCount;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return prisma.fuelData.findMany({
            where: dateFilter,
            orderBy: {
              timestamp: "desc"
            },
            take: 1000
          });
        case 2:
          fuels = _context8.sent;
          if (fuels.length) {
            _context8.next = 5;
            break;
          }
          return _context8.abrupt("return", null);
        case 5:
          totalConsumption = 0;
          minConsumption = Infinity;
          maxConsumption = 0;
          totalLevel = 0;
          minLevel = Infinity;
          maxLevel = 0;
          lowFuelCount = 0;
          highConsumptionCount = 0;
          fuels.forEach(function (fuel) {
            totalConsumption += fuel.fuelConsumption;
            minConsumption = Math.min(minConsumption, fuel.fuelConsumption);
            maxConsumption = Math.max(maxConsumption, fuel.fuelConsumption);
            totalLevel += fuel.fuelLevel;
            minLevel = Math.min(minLevel, fuel.fuelLevel);
            maxLevel = Math.max(maxLevel, fuel.fuelLevel);
            if (fuel.fuelLevel < 20) {
              lowFuelCount++;
            }
            if (fuel.fuelConsumption > 15) {
              highConsumptionCount++;
            }
          });
          return _context8.abrupt("return", {
            consumption: {
              average: parseFloat((totalConsumption / fuels.length).toFixed(2)),
              min: minConsumption === Infinity ? 0 : minConsumption,
              max: maxConsumption
            },
            level: {
              average: parseFloat((totalLevel / fuels.length).toFixed(2)),
              min: minLevel === Infinity ? 0 : minLevel,
              max: maxLevel
            },
            lowFuelCount: lowFuelCount,
            highConsumptionCount: highConsumptionCount,
            totalDataPoints: fuels.length
          });
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x14) {
    return _ref8.apply(this, arguments);
  };
}());
_defineProperty(vehicleDataController, "calculateEmissionAnalytics", /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(dateFilter) {
    var emissions, totalCO2, minCO2, maxCO2, totalCO, minCO, maxCO, totalO2, minO2, maxO2, totalHC, minHC, maxHC, totalNOx, minNOx, maxNOx, noxCount, totalPM25, minPM25, maxPM25, pm25Count, warningLevelCount, criticalLevelCount;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return prisma.emissionData.findMany({
            where: dateFilter,
            orderBy: {
              timestamp: "desc"
            },
            take: 1000
          });
        case 2:
          emissions = _context9.sent;
          if (emissions.length) {
            _context9.next = 5;
            break;
          }
          return _context9.abrupt("return", null);
        case 5:
          totalCO2 = 0, minCO2 = Infinity, maxCO2 = 0;
          totalCO = 0, minCO = Infinity, maxCO = 0;
          totalO2 = 0, minO2 = Infinity, maxO2 = 0;
          totalHC = 0, minHC = Infinity, maxHC = 0;
          totalNOx = 0, minNOx = Infinity, maxNOx = 0, noxCount = 0;
          totalPM25 = 0, minPM25 = Infinity, maxPM25 = 0, pm25Count = 0;
          warningLevelCount = 0;
          criticalLevelCount = 0;
          emissions.forEach(function (emission) {
            // CO2 analytics
            totalCO2 += emission.co2Percentage;
            minCO2 = Math.min(minCO2, emission.co2Percentage);
            maxCO2 = Math.max(maxCO2, emission.co2Percentage);

            // CO analytics
            totalCO += emission.coPercentage;
            minCO = Math.min(minCO, emission.coPercentage);
            maxCO = Math.max(maxCO, emission.coPercentage);

            // O2 analytics
            totalO2 += emission.o2Percentage;
            minO2 = Math.min(minO2, emission.o2Percentage);
            maxO2 = Math.max(maxO2, emission.o2Percentage);

            // HC analytics
            totalHC += emission.hcPPM;
            minHC = Math.min(minHC, emission.hcPPM);
            maxHC = Math.max(maxHC, emission.hcPPM);

            // NOx analytics (enhanced field)
            if (emission.noxPPM !== null && emission.noxPPM !== undefined) {
              totalNOx += emission.noxPPM;
              minNOx = Math.min(minNOx, emission.noxPPM);
              maxNOx = Math.max(maxNOx, emission.noxPPM);
              noxCount++;
            }

            // PM2.5 analytics (enhanced field)
            if (emission.pm25Level !== null && emission.pm25Level !== undefined) {
              totalPM25 += emission.pm25Level;
              minPM25 = Math.min(minPM25, emission.pm25Level);
              maxPM25 = Math.max(maxPM25, emission.pm25Level);
              pm25Count++;
            }

            // Enhanced threshold checking using document thresholds
            var isWarningLevel = emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning || emission.coPercentage >= EMISSION_THRESHOLDS.co.warning || emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning || emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning || emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning;
            var isCriticalLevel = emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical || emission.coPercentage >= EMISSION_THRESHOLDS.co.critical || emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical || emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical || emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical;
            if (isCriticalLevel) {
              criticalLevelCount++;
            } else if (isWarningLevel) {
              warningLevelCount++;
            }
          });
          return _context9.abrupt("return", {
            co2: {
              average: parseFloat((totalCO2 / emissions.length).toFixed(2)),
              min: minCO2 === Infinity ? 0 : minCO2,
              max: maxCO2
            },
            co: {
              average: parseFloat((totalCO / emissions.length).toFixed(2)),
              min: minCO === Infinity ? 0 : minCO,
              max: maxCO
            },
            o2: {
              average: parseFloat((totalO2 / emissions.length).toFixed(2)),
              min: minO2 === Infinity ? 0 : minO2,
              max: maxO2
            },
            hc: {
              average: parseFloat((totalHC / emissions.length).toFixed(2)),
              min: minHC === Infinity ? 0 : minHC,
              max: maxHC
            },
            nox: noxCount > 0 ? {
              average: parseFloat((totalNOx / noxCount).toFixed(2)),
              min: minNOx === Infinity ? 0 : minNOx,
              max: maxNOx,
              dataPoints: noxCount
            } : null,
            pm25: pm25Count > 0 ? {
              average: parseFloat((totalPM25 / pm25Count).toFixed(2)),
              min: minPM25 === Infinity ? 0 : minPM25,
              max: maxPM25,
              dataPoints: pm25Count
            } : null,
            thresholdAnalysis: {
              warningLevel: warningLevelCount,
              criticalLevel: criticalLevelCount,
              normalLevel: emissions.length - warningLevelCount - criticalLevelCount,
              thresholds: EMISSION_THRESHOLDS
            },
            totalDataPoints: emissions.length
          });
        case 15:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x15) {
    return _ref9.apply(this, arguments);
  };
}());