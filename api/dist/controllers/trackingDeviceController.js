"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTrackingDeviceById = exports.removeTrackingDevice = exports.getTrackingDevicesByVehicleId = exports.getTrackingDevicesByUser = exports.getTrackingDeviceStatus = exports.getTrackingDeviceById = exports.getDeviceStatistics = exports.getDeviceDetails = exports.getAllTrackingDevices = exports.deleteVehicleAndTrackingDevice = exports.addTrackingDeviceToVehicle = void 0;
var _paginationService = require("../services/paginationService.js");
var _trackingDeviceService = _interopRequireDefault(require("../services/trackingDeviceService.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var addTrackingDeviceToVehicle = exports.addTrackingDeviceToVehicle = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var vehicleId, _req$body, deviceCategory, enableEmissionMonitoring, parsedVehicleId, requiredFields, missingFields, validDeviceCategories, validStatuses, normalizedBody, trackingDevice;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$body = req.body, deviceCategory = _req$body.deviceCategory, enableEmissionMonitoring = _req$body.enableEmissionMonitoring;
          parsedVehicleId = parseInt(vehicleId, 10);
          if (!isNaN(parsedVehicleId)) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
          }));
        case 6:
          if (!(!req.body || Object.keys(req.body).length === 0)) {
            _context.next = 8;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Request body cannot be empty"
          }));
        case 8:
          // Validate required fields
          requiredFields = ['serialNumber', 'model', 'deviceCategory'];
          missingFields = requiredFields.filter(function (field) {
            return !req.body[field];
          });
          if (!(missingFields.length > 0)) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Missing required fields: ".concat(missingFields.join(', '))
          }));
        case 12:
          // Validate device category enum
          validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"];
          if (!(!deviceCategory || !validDeviceCategories.includes(deviceCategory))) {
            _context.next = 15;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device category. Must be one of: ".concat(validDeviceCategories.join(", "))
          }));
        case 15:
          if (!(enableEmissionMonitoring !== undefined && typeof enableEmissionMonitoring !== 'boolean')) {
            _context.next = 17;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "enableEmissionMonitoring must be a boolean value"
          }));
        case 17:
          if (!req.body.status) {
            _context.next = 21;
            break;
          }
          validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
          if (validStatuses.includes(req.body.status)) {
            _context.next = 21;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(", "))
          }));
        case 21:
          normalizedBody = _objectSpread(_objectSpread({}, req.body), {}, {
            deviceCategory: deviceCategory,
            vehicleId: parsedVehicleId,
            status: req.body.status || 'ACTIVE',
            // Default status
            enableEmissionMonitoring: enableEmissionMonitoring || false,
            // Default to false
            isActive: true,
            // Set as active when created
            lastPing: new Date() // Set initial ping time
          });
          _context.next = 24;
          return _trackingDeviceService["default"].addTrackingDeviceToVehicle(normalizedBody);
        case 24:
          trackingDevice = _context.sent;
          return _context.abrupt("return", res.status(201).json({
            success: true,
            message: "Tracking device added successfully",
            data: trackingDevice
          }));
        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: _context.t0.message
          }));
        case 31:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 28]]);
  }));
  return function addTrackingDeviceToVehicle(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var getTrackingDevicesByVehicleId = exports.getTrackingDevicesByVehicleId = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var vehicleId, _req$query, deviceCategory, status, enableEmissionMonitoring, pagination, parsedVehicleId, filters, validDeviceCategories, validStatuses, result;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$query = req.query, deviceCategory = _req$query.deviceCategory, status = _req$query.status, enableEmissionMonitoring = _req$query.enableEmissionMonitoring;
          pagination = req.pagination;
          parsedVehicleId = parseInt(vehicleId, 10);
          if (!isNaN(parsedVehicleId)) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid vehicle ID"
          }));
        case 7:
          // Build filters
          filters = {}; // Validate and add device category filter
          if (!deviceCategory) {
            _context2.next = 13;
            break;
          }
          validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"];
          if (validDeviceCategories.includes(deviceCategory)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device category. Must be one of: ".concat(validDeviceCategories.join(", "))
          }));
        case 12:
          filters.deviceCategory = deviceCategory;
        case 13:
          if (!status) {
            _context2.next = 18;
            break;
          }
          validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
          if (validStatuses.includes(status)) {
            _context2.next = 17;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(", "))
          }));
        case 17:
          filters.status = status;
        case 18:
          if (!(enableEmissionMonitoring !== undefined)) {
            _context2.next = 22;
            break;
          }
          if (!(enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false')) {
            _context2.next = 21;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "enableEmissionMonitoring must be 'true' or 'false'"
          }));
        case 21:
          filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
        case 22:
          _context2.next = 24;
          return _trackingDeviceService["default"].getTrackingDevicesByVehicleId(parsedVehicleId, pagination, filters);
        case 24:
          result = _context2.sent;
          if (!(!result || result.length === 0)) {
            _context2.next = 27;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: "No tracking devices found for this vehicle"
          }));
        case 27:
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: "Tracking devices retrieved successfully",
            data: result,
            meta: {
              totalCount: result.length,
              page: pagination.page || 1,
              pageSize: pagination.pageSize || 10,
              totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
            }
          }));
        case 30:
          _context2.prev = 30;
          _context2.t0 = _context2["catch"](0);
          console.error("Error retrieving tracking devices:", _context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: _context2.t0.message || "Internal server error"
          }));
        case 34:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 30]]);
  }));
  return function getTrackingDevicesByVehicleId(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
var removeTrackingDevice = exports.removeTrackingDevice = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$params, deviceId, vehicleId, parsedDeviceId, parsedVehicleId, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$params = req.params, deviceId = _req$params.deviceId, vehicleId = _req$params.vehicleId;
          parsedDeviceId = parseInt(deviceId, 10);
          parsedVehicleId = parseInt(vehicleId, 10);
          if (!(isNaN(parsedDeviceId) || isNaN(parsedVehicleId))) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid device ID or vehicle ID'
          }));
        case 6:
          _context3.next = 8;
          return _trackingDeviceService["default"].removeTrackingDeviceFromVehicle(parsedDeviceId, parsedVehicleId);
        case 8:
          result = _context3.sent;
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: result.message
          }));
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: _context3.t0.message
          }));
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 12]]);
  }));
  return function removeTrackingDevice(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
var deleteVehicleAndTrackingDevice = exports.deleteVehicleAndTrackingDevice = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var vehicleId, parsedVehicleId, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          vehicleId = req.params.vehicleId;
          parsedVehicleId = parseInt(vehicleId, 10);
          if (!isNaN(parsedVehicleId)) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid vehicle ID'
          }));
        case 5:
          _context4.next = 7;
          return _trackingDeviceService["default"].deleteVehicleAndTrackingDevice(parsedVehicleId);
        case 7:
          result = _context4.sent;
          return _context4.abrupt("return", res.status(200).json({
            success: true,
            message: result.message
          }));
        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: _context4.t0.message
          }));
        case 14:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 11]]);
  }));
  return function deleteVehicleAndTrackingDevice(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
var getTrackingDeviceStatus = exports.getTrackingDeviceStatus = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var deviceId, parsedDeviceId, trackingStatus;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          deviceId = req.params.deviceId;
          parsedDeviceId = parseInt(deviceId, 10);
          if (!isNaN(parsedDeviceId)) {
            _context5.next = 5;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid device ID'
          }));
        case 5:
          _context5.next = 7;
          return _trackingDeviceService["default"].getTrackingDeviceStatus(parsedDeviceId);
        case 7:
          trackingStatus = _context5.sent;
          return _context5.abrupt("return", res.status(200).json({
            success: true,
            message: 'Tracking device status fetched successfully',
            data: trackingStatus
          }));
        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: _context5.t0.message
          }));
        case 14:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 11]]);
  }));
  return function getTrackingDeviceStatus(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
var getAllTrackingDevices = exports.getAllTrackingDevices = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var pagination, page, limit, _req$query2, deviceCategory, status, enableEmissionMonitoring, isActive, filters, validDeviceCategories, validStatuses, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          pagination = req.pagination;
          page = pagination.page || 1;
          limit = pagination.limit || 10;
          _req$query2 = req.query, deviceCategory = _req$query2.deviceCategory, status = _req$query2.status, enableEmissionMonitoring = _req$query2.enableEmissionMonitoring, isActive = _req$query2.isActive; // Build filters
          filters = {}; // Validate and add device category filter
          if (!deviceCategory) {
            _context6.next = 11;
            break;
          }
          validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"];
          if (validDeviceCategories.includes(deviceCategory)) {
            _context6.next = 10;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device category. Must be one of: ".concat(validDeviceCategories.join(", "))
          }));
        case 10:
          filters.deviceCategory = deviceCategory;
        case 11:
          if (!status) {
            _context6.next = 16;
            break;
          }
          validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
          if (validStatuses.includes(status)) {
            _context6.next = 15;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(", "))
          }));
        case 15:
          filters.status = status;
        case 16:
          if (!(enableEmissionMonitoring !== undefined)) {
            _context6.next = 20;
            break;
          }
          if (!(enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false')) {
            _context6.next = 19;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "enableEmissionMonitoring must be 'true' or 'false'"
          }));
        case 19:
          filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
        case 20:
          if (!(isActive !== undefined)) {
            _context6.next = 24;
            break;
          }
          if (!(isActive !== 'true' && isActive !== 'false')) {
            _context6.next = 23;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: "isActive must be 'true' or 'false'"
          }));
        case 23:
          filters.isActive = isActive === 'true';
        case 24:
          _context6.next = 26;
          return _trackingDeviceService["default"].getAllTrackingDevices(page, limit, filters);
        case 26:
          result = _context6.sent;
          console.log("Fetched tracking devices:", result.length);
          return _context6.abrupt("return", res.status(200).json({
            success: true,
            message: 'All tracking devices fetched successfully',
            data: result,
            meta: {
              totalCount: result.length,
              page: pagination.page || 1,
              pageSize: pagination.pageSize || 10,
              totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
            }
          }));
        case 31:
          _context6.prev = 31;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: _context6.t0.message
          }));
        case 34:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 31]]);
  }));
  return function getAllTrackingDevices(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
var getTrackingDeviceById = exports.getTrackingDeviceById = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var deviceId, parsedDeviceId, trackingDevice;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          deviceId = req.params.deviceId;
          parsedDeviceId = parseInt(deviceId, 10);
          if (!isNaN(parsedDeviceId)) {
            _context7.next = 5;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid device ID'
          }));
        case 5:
          _context7.next = 7;
          return _trackingDeviceService["default"].getTrackingDeviceById(parsedDeviceId);
        case 7:
          trackingDevice = _context7.sent;
          return _context7.abrupt("return", res.status(200).json({
            success: true,
            message: 'Tracking device fetched successfully',
            data: trackingDevice
          }));
        case 11:
          _context7.prev = 11;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: _context7.t0.message
          }));
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 11]]);
  }));
  return function getTrackingDeviceById(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
var getTrackingDevicesByUser = exports.getTrackingDevicesByUser = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var userId, _req$query3, deviceCategory, status, enableEmissionMonitoring, pagination, parsedUserId, filters, validDeviceCategories, validStatuses, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          userId = req.params.userId;
          _req$query3 = req.query, deviceCategory = _req$query3.deviceCategory, status = _req$query3.status, enableEmissionMonitoring = _req$query3.enableEmissionMonitoring;
          pagination = req.pagination;
          parsedUserId = parseInt(userId, 10);
          if (!isNaN(parsedUserId)) {
            _context8.next = 7;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid user ID"
          }));
        case 7:
          // Build filters
          filters = {}; // Validate and add device category filter
          if (!deviceCategory) {
            _context8.next = 13;
            break;
          }
          validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"];
          if (validDeviceCategories.includes(deviceCategory)) {
            _context8.next = 12;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device category. Must be one of: ".concat(validDeviceCategories.join(", "))
          }));
        case 12:
          filters.deviceCategory = deviceCategory;
        case 13:
          if (!status) {
            _context8.next = 18;
            break;
          }
          validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
          if (validStatuses.includes(status)) {
            _context8.next = 17;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(", "))
          }));
        case 17:
          filters.status = status;
        case 18:
          if (!(enableEmissionMonitoring !== undefined)) {
            _context8.next = 22;
            break;
          }
          if (!(enableEmissionMonitoring !== 'true' && enableEmissionMonitoring !== 'false')) {
            _context8.next = 21;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: "enableEmissionMonitoring must be 'true' or 'false'"
          }));
        case 21:
          filters.enableEmissionMonitoring = enableEmissionMonitoring === 'true';
        case 22:
          _context8.next = 24;
          return _trackingDeviceService["default"].getTrackingDevicesByUser(parsedUserId, pagination, filters);
        case 24:
          result = _context8.sent;
          if (!(!result || result.length === 0)) {
            _context8.next = 27;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            success: false,
            message: "No tracking devices found for this user"
          }));
        case 27:
          return _context8.abrupt("return", res.status(200).json({
            success: true,
            message: "User tracking devices retrieved successfully",
            data: result,
            meta: {
              totalCount: result.length,
              page: pagination.page || 1,
              pageSize: pagination.pageSize || 10,
              totalPages: Math.ceil(result.length / (pagination.pageSize || 10))
            }
          }));
        case 30:
          _context8.prev = 30;
          _context8.t0 = _context8["catch"](0);
          console.error("Error retrieving tracking devices for user:", _context8.t0);
          return _context8.abrupt("return", res.status(500).json({
            success: false,
            message: _context8.t0.message || "Internal server error"
          }));
        case 34:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 30]]);
  }));
  return function getTrackingDevicesByUser(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
var getDeviceDetails = exports.getDeviceDetails = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var deviceId, _req$query4, startDate, endDate, pagination, parsedDeviceId, validatedStartDate, validatedEndDate, dateRange, deviceDetails;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          deviceId = req.params.deviceId;
          _req$query4 = req.query, startDate = _req$query4.startDate, endDate = _req$query4.endDate;
          pagination = req.pagination;
          parsedDeviceId = parseInt(deviceId, 10);
          if (!isNaN(parsedDeviceId)) {
            _context9.next = 7;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid device ID'
          }));
        case 7:
          // Validate dates if provided
          validatedStartDate = null;
          validatedEndDate = null;
          if (!startDate) {
            _context9.next = 13;
            break;
          }
          validatedStartDate = new Date(startDate);
          if (!isNaN(validatedStartDate.getTime())) {
            _context9.next = 13;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid startDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
          }));
        case 13:
          if (!endDate) {
            _context9.next = 17;
            break;
          }
          validatedEndDate = new Date(endDate);
          if (!isNaN(validatedEndDate.getTime())) {
            _context9.next = 17;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid endDate format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
          }));
        case 17:
          if (!(validatedStartDate && validatedEndDate && validatedStartDate >= validatedEndDate)) {
            _context9.next = 19;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "startDate must be before endDate"
          }));
        case 19:
          dateRange = {};
          if (validatedStartDate && validatedEndDate) {
            dateRange.startDate = validatedStartDate;
            dateRange.endDate = validatedEndDate;
          }
          _context9.next = 23;
          return _trackingDeviceService["default"].getDeviceDetails(parsedDeviceId, dateRange, pagination);
        case 23:
          deviceDetails = _context9.sent;
          return _context9.abrupt("return", res.status(200).json({
            success: true,
            message: "Device details fetched successfully",
            data: {
              device: deviceDetails.device,
              deviceData: deviceDetails.data
            },
            meta: deviceDetails.meta
          }));
        case 27:
          _context9.prev = 27;
          _context9.t0 = _context9["catch"](0);
          console.error("Error retrieving device details:", _context9.t0);
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: _context9.t0.message || "Error retrieving device details"
          }));
        case 31:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 27]]);
  }));
  return function getDeviceDetails(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();
var updateTrackingDeviceById = exports.updateTrackingDeviceById = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var deviceId, deviceData, parsedDeviceId, validDeviceCategories, validStatuses, updatedDevice;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          deviceId = req.params.deviceId;
          deviceData = req.body;
          parsedDeviceId = parseInt(deviceId, 10);
          if (!isNaN(parsedDeviceId)) {
            _context10.next = 6;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device ID"
          }));
        case 6:
          if (!(!deviceData || Object.keys(deviceData).length === 0)) {
            _context10.next = 8;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "No update data provided"
          }));
        case 8:
          if (!deviceData.deviceCategory) {
            _context10.next = 12;
            break;
          }
          validDeviceCategories = ["MOTORCYCLE", "CAR", "TRUCK", "TRICYCLE", "OTHER"];
          if (validDeviceCategories.includes(deviceData.deviceCategory)) {
            _context10.next = 12;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid device category. Must be one of: ".concat(validDeviceCategories.join(", "))
          }));
        case 12:
          if (!deviceData.status) {
            _context10.next = 16;
            break;
          }
          validStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "DISCONNECTED"];
          if (validStatuses.includes(deviceData.status)) {
            _context10.next = 16;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(", "))
          }));
        case 16:
          if (!(deviceData.enableEmissionMonitoring !== undefined && typeof deviceData.enableEmissionMonitoring !== 'boolean')) {
            _context10.next = 18;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "enableEmissionMonitoring must be a boolean value"
          }));
        case 18:
          if (!(deviceData.isActive !== undefined && typeof deviceData.isActive !== 'boolean')) {
            _context10.next = 20;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: "isActive must be a boolean value"
          }));
        case 20:
          _context10.next = 22;
          return _trackingDeviceService["default"].updateDeviceService(parsedDeviceId, deviceData);
        case 22:
          updatedDevice = _context10.sent;
          return _context10.abrupt("return", res.status(200).json({
            success: true,
            message: "Tracking device updated successfully",
            data: updatedDevice
          }));
        case 26:
          _context10.prev = 26;
          _context10.t0 = _context10["catch"](0);
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: _context10.t0.message
          }));
        case 29:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 26]]);
  }));
  return function updateTrackingDeviceById(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();
var getDeviceStatistics = exports.getDeviceStatistics = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _deviceData$, _req$query5, deviceId, interval, _req$pagination, startTime, endTime, parsedDeviceId, whereClause, intervalStartTime, now, deviceData, stats, normalCount;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _req$query5 = req.query, deviceId = _req$query5.deviceId, interval = _req$query5.interval;
          _req$pagination = req.pagination, startTime = _req$pagination.startTime, endTime = _req$pagination.endTime;
          if (deviceId) {
            _context11.next = 5;
            break;
          }
          return _context11.abrupt("return", res.status(400).json({
            success: false,
            message: 'deviceId is required'
          }));
        case 5:
          parsedDeviceId = parseInt(deviceId, 10);
          if (!isNaN(parsedDeviceId)) {
            _context11.next = 8;
            break;
          }
          return _context11.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid deviceId'
          }));
        case 8:
          whereClause = {
            deviceId: parsedDeviceId
          }; // Handle date filtering
          if (!interval) {
            _context11.next = 27;
            break;
          }
          now = new Date();
          _context11.t0 = interval;
          _context11.next = _context11.t0 === 'day' ? 14 : _context11.t0 === 'week' ? 17 : _context11.t0 === 'month' ? 20 : 23;
          break;
        case 14:
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 1);
          return _context11.abrupt("break", 24);
        case 17:
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 7);
          return _context11.abrupt("break", 24);
        case 20:
          intervalStartTime = new Date(now);
          intervalStartTime.setMonth(now.getMonth() - 1);
          return _context11.abrupt("break", 24);
        case 23:
          return _context11.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid interval. Use day, week, or month'
          }));
        case 24:
          whereClause.timestamp = {
            gte: intervalStartTime
          };
          _context11.next = 28;
          break;
        case 27:
          if (startTime && endTime) {
            whereClause.timestamp = {
              gte: startTime,
              lte: endTime
            };
          } else if (startTime) {
            whereClause.timestamp = {
              gte: startTime
            };
          } else if (endTime) {
            whereClause.timestamp = {
              lte: endTime
            };
          }
        case 28:
          _context11.next = 30;
          return prisma.emissionData.findMany({
            where: whereClause,
            orderBy: {
              timestamp: 'asc'
            },
            include: {
              device: {
                select: {
                  serialNumber: true,
                  model: true,
                  status: true,
                  deviceCategory: true,
                  vehicleId: true
                }
              }
            }
          });
        case 30:
          deviceData = _context11.sent;
          if (!(!deviceData || deviceData.length === 0)) {
            _context11.next = 33;
            break;
          }
          return _context11.abrupt("return", res.status(200).json({
            success: true,
            message: 'No device data found for the specified criteria',
            data: {
              averages: {
                co2: 0,
                co: 0,
                o2: 0,
                hc: 0,
                nox: 0,
                pm25: 0
              },
              totals: {
                records: 0,
                exceedsThresholds: 0
              },
              thresholdAnalysis: {
                normal: 0,
                high: 0,
                critical: 0
              }
            }
          }));
        case 33:
          // Calculate statistics
          stats = deviceData.reduce(function (acc, curr) {
            var exceedsThreshold = curr.co2Percentage >= EMISSION_THRESHOLDS.co2.warning || curr.coPercentage >= EMISSION_THRESHOLDS.co.warning || curr.hcPPM >= EMISSION_THRESHOLDS.hc.warning || curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.warning || curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.warning;
            var isCritical = curr.co2Percentage >= EMISSION_THRESHOLDS.co2.critical || curr.coPercentage >= EMISSION_THRESHOLDS.co.critical || curr.hcPPM >= EMISSION_THRESHOLDS.hc.critical || curr.noxPPM && curr.noxPPM >= EMISSION_THRESHOLDS.nox.critical || curr.pm25Level && curr.pm25Level >= EMISSION_THRESHOLDS.pm25.critical;
            return {
              co2Sum: acc.co2Sum + curr.co2Percentage,
              coSum: acc.coSum + curr.coPercentage,
              o2Sum: acc.o2Sum + curr.o2Percentage,
              hcSum: acc.hcSum + curr.hcPPM,
              noxSum: acc.noxSum + (curr.noxPPM || 0),
              noxCount: acc.noxCount + (curr.noxPPM ? 1 : 0),
              pm25Sum: acc.pm25Sum + (curr.pm25Level || 0),
              pm25Count: acc.pm25Count + (curr.pm25Level ? 1 : 0),
              count: acc.count + 1,
              exceedsThresholdCount: acc.exceedsThresholdCount + (exceedsThreshold ? 1 : 0),
              criticalCount: acc.criticalCount + (isCritical ? 1 : 0),
              highCount: acc.highCount + (exceedsThreshold && !isCritical ? 1 : 0)
            };
          }, {
            co2Sum: 0,
            coSum: 0,
            o2Sum: 0,
            hcSum: 0,
            noxSum: 0,
            noxCount: 0,
            pm25Sum: 0,
            pm25Count: 0,
            count: 0,
            exceedsThresholdCount: 0,
            criticalCount: 0,
            highCount: 0
          });
          normalCount = stats.count - stats.exceedsThresholdCount;
          return _context11.abrupt("return", res.status(200).json({
            success: true,
            data: {
              averages: {
                co2: (stats.co2Sum / stats.count).toFixed(3),
                co: (stats.coSum / stats.count).toFixed(3),
                o2: (stats.o2Sum / stats.count).toFixed(3),
                hc: (stats.hcSum / stats.count).toFixed(1),
                nox: stats.noxCount > 0 ? (stats.noxSum / stats.noxCount).toFixed(3) : null,
                pm25: stats.pm25Count > 0 ? (stats.pm25Sum / stats.pm25Count).toFixed(3) : null
              },
              totals: {
                records: stats.count,
                exceedsThresholds: stats.exceedsThresholdCount,
                exceedsPercentage: (stats.exceedsThresholdCount / stats.count * 100).toFixed(1)
              },
              thresholdAnalysis: {
                normal: normalCount,
                high: stats.highCount,
                critical: stats.criticalCount,
                normalPercentage: (normalCount / stats.count * 100).toFixed(1),
                highPercentage: (stats.highCount / stats.count * 100).toFixed(1),
                criticalPercentage: (stats.criticalCount / stats.count * 100).toFixed(1)
              },
              thresholds: EMISSION_THRESHOLDS,
              timeRange: interval ? {
                interval: interval
              } : {
                from: startTime || 'beginning',
                to: endTime || 'now'
              },
              device: ((_deviceData$ = deviceData[0]) === null || _deviceData$ === void 0 ? void 0 : _deviceData$.device) || null
            }
          }));
        case 38:
          _context11.prev = 38;
          _context11.t1 = _context11["catch"](0);
          console.error('Error calculating device statistics:', _context11.t1);
          return _context11.abrupt("return", res.status(500).json({
            success: false,
            message: 'Failed to calculate device statistics'
          }));
        case 42:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 38]]);
  }));
  return function getDeviceStatistics(_x21, _x22) {
    return _ref11.apply(this, arguments);
  };
}();