"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEmissionData = exports.getEmissionStatistics = exports.getEmissionDataByVehicleInterval = exports.getEmissionDataByVehicle = exports.getEmissionDataByPlateNumber = exports.getEmissionDataById = exports.getAllEmissionData = exports.deleteEmissionData = exports.createEmissionData = void 0;
var _client = require("@prisma/client");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // emission-controller.js
var prisma = new _client.PrismaClient();

// This needs to be confirmed with Emmanuel. I just came up with these thresholds. They are currently used as a placeholder.
var EMISSION_THRESHOLDS = {
  co2: {
    warning: 0.5,
    critical: 1.0
  },
  // CO2 percentage
  co: {
    warning: 0.3,
    critical: 0.5
  },
  // CO percentage  
  hc: {
    warning: 200,
    critical: 400
  },
  // HC in PPM
  nox: {
    warning: 100,
    critical: 200
  },
  // NOx in PPM
  pm25: {
    warning: 25,
    critical: 50
  } // PM2.5 in μg/m³
};

// Helper function to analyze emission levels and generate alerts
var analyzeEmissionLevels = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(emissionData, vehicleId, plateNumber) {
    var alerts;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          alerts = []; // Check CO2 levels
          if (emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'Critical CO2 Emission Level',
              message: "Vehicle ".concat(plateNumber, " has critically high CO2 emissions (").concat(emissionData.co2Percentage, "%)"),
              triggerValue: "".concat(emissionData.co2Percentage, "%"),
              triggerThreshold: "CO2 > ".concat(EMISSION_THRESHOLDS.co2.critical, "%"),
              vehicleId: vehicleId
            });
          } else if (emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'High CO2 Emission Level',
              message: "Vehicle ".concat(plateNumber, " has high CO2 emissions (").concat(emissionData.co2Percentage, "%)"),
              triggerValue: "".concat(emissionData.co2Percentage, "%"),
              triggerThreshold: "CO2 > ".concat(EMISSION_THRESHOLDS.co2.warning, "%"),
              vehicleId: vehicleId
            });
          }

          // Check CO levels
          if (emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'Critical CO Emission Level',
              message: "Vehicle ".concat(plateNumber, " has critically high CO emissions (").concat(emissionData.coPercentage, "%)"),
              triggerValue: "".concat(emissionData.coPercentage, "%"),
              triggerThreshold: "CO > ".concat(EMISSION_THRESHOLDS.co.critical, "%"),
              vehicleId: vehicleId
            });
          }

          // Check HC levels
          if (emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'Critical HC Emission Level',
              message: "Vehicle ".concat(plateNumber, " has critically high HC emissions (").concat(emissionData.hcPPM, " PPM)"),
              triggerValue: "".concat(emissionData.hcPPM, " PPM"),
              triggerThreshold: "HC > ".concat(EMISSION_THRESHOLDS.hc.critical, " PPM"),
              vehicleId: vehicleId
            });
          }

          // Check NOx levels (new field from updated schema)
          if (emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'Critical NOx Emission Level',
              message: "Vehicle ".concat(plateNumber, " has critically high NOx emissions (").concat(emissionData.noxPPM, " PPM)"),
              triggerValue: "".concat(emissionData.noxPPM, " PPM"),
              triggerThreshold: "NOx > ".concat(EMISSION_THRESHOLDS.nox.critical, " PPM"),
              vehicleId: vehicleId
            });
          }

          // Check PM2.5 levels (new field from updated schema)
          if (emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical) {
            alerts.push({
              type: 'HIGH_EMISSION_ALERT',
              title: 'Critical PM2.5 Level',
              message: "Vehicle ".concat(plateNumber, " has critically high PM2.5 levels (").concat(emissionData.pm25Level, " \u03BCg/m\xB3)"),
              triggerValue: "".concat(emissionData.pm25Level, " \u03BCg/m\xB3"),
              triggerThreshold: "PM2.5 > ".concat(EMISSION_THRESHOLDS.pm25.critical, " \u03BCg/m\xB3"),
              vehicleId: vehicleId
            });
          }
          return _context.abrupt("return", alerts);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function analyzeEmissionLevels(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Helper function to update vehicle emission status
var updateVehicleEmissionStatus = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(vehicleId, emissionData) {
    var exceedsThresholds, newStatus;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          exceedsThresholds = emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning || emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning || emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning || emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning || emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning;
          newStatus = exceedsThresholds ? 'TOP_POLLUTING' : 'NORMAL_EMISSION'; // Update vehicle status
          _context2.next = 4;
          return prisma.vehicle.update({
            where: {
              id: vehicleId
            },
            data: {
              status: newStatus
            }
          });
        case 4:
          return _context2.abrupt("return", newStatus);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function updateVehicleEmissionStatus(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

// CREATE - Enhanced emission data creation with alert generation
var createEmissionData = exports.createEmissionData = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var _req$body, co2Percentage, coPercentage, o2Percentage, hcPPM, noxPPM, pm25Level, vehicleId, plateNumber, trackingDeviceId, timestamp, _yield$Promise$all, _yield$Promise$all2, vehicle, device, emissionData, alerts, vehicleStatus;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, co2Percentage = _req$body.co2Percentage, coPercentage = _req$body.coPercentage, o2Percentage = _req$body.o2Percentage, hcPPM = _req$body.hcPPM, noxPPM = _req$body.noxPPM, pm25Level = _req$body.pm25Level, vehicleId = _req$body.vehicleId, plateNumber = _req$body.plateNumber, trackingDeviceId = _req$body.trackingDeviceId, timestamp = _req$body.timestamp; // Validate required fields
          if (!(!co2Percentage || !coPercentage || !o2Percentage || !hcPPM || !vehicleId || !plateNumber || !trackingDeviceId)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'Missing required fields'
          }));
        case 4:
          if (!(co2Percentage < 0 || co2Percentage > 100)) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'CO2 percentage must be between 0 and 100'
          }));
        case 6:
          if (!(coPercentage < 0 || coPercentage > 100)) {
            _context3.next = 8;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'CO percentage must be between 0 and 100'
          }));
        case 8:
          if (!(o2Percentage < 0 || o2Percentage > 100)) {
            _context3.next = 10;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'O2 percentage must be between 0 and 100'
          }));
        case 10:
          if (!(hcPPM < 0)) {
            _context3.next = 12;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            error: 'HC PPM must be non-negative'
          }));
        case 12:
          _context3.next = 14;
          return Promise.all([prisma.vehicle.findUnique({
            where: {
              id: parseInt(vehicleId)
            }
          }), prisma.trackingDevice.findUnique({
            where: {
              id: parseInt(trackingDeviceId)
            }
          })]);
        case 14:
          _yield$Promise$all = _context3.sent;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          vehicle = _yield$Promise$all2[0];
          device = _yield$Promise$all2[1];
          if (vehicle) {
            _context3.next = 20;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: 'Vehicle not found'
          }));
        case 20:
          if (device) {
            _context3.next = 22;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            error: 'Tracking device not found'
          }));
        case 22:
          _context3.next = 24;
          return prisma.emissionData.create({
            data: {
              co2Percentage: parseFloat(co2Percentage),
              coPercentage: parseFloat(coPercentage),
              o2Percentage: parseFloat(o2Percentage),
              hcPPM: parseInt(hcPPM),
              noxPPM: noxPPM ? parseFloat(noxPPM) : null,
              pm25Level: pm25Level ? parseFloat(pm25Level) : null,
              vehicleId: parseInt(vehicleId),
              plateNumber: plateNumber,
              trackingDeviceId: parseInt(trackingDeviceId),
              timestamp: timestamp ? new Date(timestamp) : new Date()
            },
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  userId: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true
                }
              }
            }
          });
        case 24:
          emissionData = _context3.sent;
          _context3.next = 27;
          return prisma.trackingDevice.update({
            where: {
              id: parseInt(trackingDeviceId)
            },
            data: {
              lastPing: new Date(),
              status: 'ACTIVE',
              isActive: true
            }
          });
        case 27:
          _context3.next = 29;
          return analyzeEmissionLevels(emissionData, parseInt(vehicleId), plateNumber);
        case 29:
          alerts = _context3.sent;
          if (!(alerts.length > 0)) {
            _context3.next = 33;
            break;
          }
          _context3.next = 33;
          return prisma.alert.createMany({
            data: alerts.map(function (alert) {
              return _objectSpread(_objectSpread({}, alert), {}, {
                userId: vehicle.userId // Assign to vehicle owner
              });
            })
          });
        case 33:
          _context3.next = 35;
          return updateVehicleEmissionStatus(parseInt(vehicleId), emissionData);
        case 35:
          vehicleStatus = _context3.sent;
          return _context3.abrupt("return", res.status(201).json({
            message: 'Emission data created successfully',
            data: emissionData,
            vehicleStatus: vehicleStatus,
            alertsGenerated: alerts.length,
            alerts: alerts.map(function (alert) {
              return {
                type: alert.type,
                title: alert.title,
                severity: alert.title.includes('Critical') ? 'CRITICAL' : 'WARNING'
              };
            })
          }));
        case 39:
          _context3.prev = 39;
          _context3.t0 = _context3["catch"](0);
          console.error('Error creating emission data:', _context3.t0);
          return _context3.abrupt("return", res.status(500).json({
            error: 'Failed to create emission data'
          }));
        case 43:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 39]]);
  }));
  return function createEmissionData(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

// Enhanced statistics with basic analytics
var getAllEmissionData = exports.getAllEmissionData = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$pagination, skip, take, startTime, endTime, _req$query, vehicleStatus, emissionLevel, deviceCategory, whereClause, _yield$Promise$all3, _yield$Promise$all4, emissionData, totalCount, enhancedData;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$pagination = req.pagination, skip = _req$pagination.skip, take = _req$pagination.take, startTime = _req$pagination.startTime, endTime = _req$pagination.endTime;
          _req$query = req.query, vehicleStatus = _req$query.vehicleStatus, emissionLevel = _req$query.emissionLevel, deviceCategory = _req$query.deviceCategory;
          console.log('Pagination:', req.pagination);

          // Build enhanced where clause
          whereClause = {}; // Date filtering
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
          if (vehicleStatus) {
            whereClause.vehicle = {
              status: vehicleStatus
            };
          }

          // Filter by emission level
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

          // Filter by device category
          if (deviceCategory) {
            whereClause.trackingDevice = {
              deviceCategory: deviceCategory
            };
          }
          console.log('Enhanced Where Clause:', JSON.stringify(whereClause, null, 2));
          _context4.next = 12;
          return Promise.all([prisma.emissionData.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            orderBy: {
              timestamp: 'desc'
            },
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  vehicleType: true,
                  status: true,
                  fuelType: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true,
                  deviceCategory: true,
                  status: true
                }
              }
            }
          }), prisma.emissionData.count({
            where: whereClause
          })]);
        case 12:
          _yield$Promise$all3 = _context4.sent;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 2);
          emissionData = _yield$Promise$all4[0];
          totalCount = _yield$Promise$all4[1];
          // Add emission level classification to each record
          enhancedData = emissionData.map(function (data) {
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
          return _context4.abrupt("return", res.status(200).json({
            data: enhancedData,
            meta: {
              page: req.pagination.page,
              limit: req.pagination.limit,
              totalCount: totalCount,
              totalPages: Math.ceil(totalCount / req.pagination.limit),
              filters: {
                applied: {
                  vehicleStatus: vehicleStatus,
                  emissionLevel: emissionLevel,
                  deviceCategory: deviceCategory
                },
                thresholds: EMISSION_THRESHOLDS
              }
            }
          }));
        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching emission data:', _context4.t0);
          return _context4.abrupt("return", res.status(500).json({
            error: 'Failed to fetch emission data'
          }));
        case 24:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 20]]);
  }));
  return function getAllEmissionData(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();

// READ - Get emission data by ID
var getEmissionDataById = exports.getEmissionDataById = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, emissionData, isCritical, isHigh, enhancedData;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return prisma.emissionData.findUnique({
            where: {
              id: parseInt(id)
            },
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  vehicleType: true,
                  fuelType: true,
                  status: true,
                  user: {
                    select: {
                      fullName: true,
                      companyName: true
                    }
                  }
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true,
                  deviceCategory: true,
                  status: true
                }
              }
            }
          });
        case 4:
          emissionData = _context5.sent;
          if (emissionData) {
            _context5.next = 7;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            error: 'Emission data not found'
          }));
        case 7:
          // Add emission level analysis
          isCritical = emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical || emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical || emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical || emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical || emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical;
          isHigh = emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning || emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning || emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning || emissionData.noxPPM && emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning || emissionData.pm25Level && emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning;
          enhancedData = _objectSpread(_objectSpread({}, emissionData), {}, {
            emissionLevel: isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL',
            thresholdAnalysis: {
              co2: {
                value: emissionData.co2Percentage,
                exceedsWarning: emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.warning,
                exceedsCritical: emissionData.co2Percentage >= EMISSION_THRESHOLDS.co2.critical
              },
              co: {
                value: emissionData.coPercentage,
                exceedsWarning: emissionData.coPercentage >= EMISSION_THRESHOLDS.co.warning,
                exceedsCritical: emissionData.coPercentage >= EMISSION_THRESHOLDS.co.critical
              },
              hc: {
                value: emissionData.hcPPM,
                exceedsWarning: emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.warning,
                exceedsCritical: emissionData.hcPPM >= EMISSION_THRESHOLDS.hc.critical
              },
              nox: emissionData.noxPPM ? {
                value: emissionData.noxPPM,
                exceedsWarning: emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.warning,
                exceedsCritical: emissionData.noxPPM >= EMISSION_THRESHOLDS.nox.critical
              } : null,
              pm25: emissionData.pm25Level ? {
                value: emissionData.pm25Level,
                exceedsWarning: emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.warning,
                exceedsCritical: emissionData.pm25Level >= EMISSION_THRESHOLDS.pm25.critical
              } : null
            },
            thresholds: EMISSION_THRESHOLDS
          });
          return _context5.abrupt("return", res.status(200).json(enhancedData));
        case 13:
          _context5.prev = 13;
          _context5.t0 = _context5["catch"](0);
          console.error('Error fetching emission data:', _context5.t0);
          return _context5.abrupt("return", res.status(500).json({
            error: 'Failed to fetch emission data'
          }));
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 13]]);
  }));
  return function getEmissionDataById(_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

// READ - Get emission data by vehicle ID
var getEmissionDataByVehicle = exports.getEmissionDataByVehicle = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var vehicleId, _req$pagination2, _req$pagination2$page, page, _req$pagination2$limi, limit, startTime, endTime, parsedPage, parsedLimit, skip, take, whereClause, _yield$Promise$all5, _yield$Promise$all6, emissionData, totalCount, totalPages, remainingItems;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$pagination2 = req.pagination, _req$pagination2$page = _req$pagination2.page, page = _req$pagination2$page === void 0 ? 1 : _req$pagination2$page, _req$pagination2$limi = _req$pagination2.limit, limit = _req$pagination2$limi === void 0 ? 10 : _req$pagination2$limi, startTime = _req$pagination2.startTime, endTime = _req$pagination2.endTime;
          console.log('Pagination:', req.pagination);
          parsedPage = parseInt(page) || 1;
          parsedLimit = parseInt(limit) || 10;
          skip = (parsedPage - 1) * parsedLimit;
          take = parsedLimit;
          whereClause = {
            vehicleId: parseInt(vehicleId)
          };
          if (startTime && endTime) {
            whereClause.timestamp = {
              gte: new Date(startTime),
              lte: new Date(endTime)
            };
          } else if (startTime) {
            whereClause.timestamp = {
              gte: new Date(startTime)
            };
          } else if (endTime) {
            whereClause.timestamp = {
              lte: new Date(endTime)
            };
          }
          _context6.next = 12;
          return Promise.all([prisma.emissionData.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            orderBy: {
              timestamp: 'desc'
            },
            include: {
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true,
                  deviceCategory: true
                }
              }
            }
          }), prisma.emissionData.count({
            where: whereClause
          })]);
        case 12:
          _yield$Promise$all5 = _context6.sent;
          _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 2);
          emissionData = _yield$Promise$all6[0];
          totalCount = _yield$Promise$all6[1];
          totalPages = Math.ceil(totalCount / parsedLimit);
          remainingItems = Math.max(0, totalCount - parsedPage * parsedLimit);
          return _context6.abrupt("return", res.status(200).json({
            data: emissionData,
            meta: {
              currentPage: parsedPage,
              totalPages: totalPages,
              remainingItems: remainingItems,
              totalItems: totalCount,
              limit: parsedLimit
            }
          }));
        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](0);
          console.error('Error fetching emission data:', _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            error: 'Failed to fetch emission data'
          }));
        case 25:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 21]]);
  }));
  return function getEmissionDataByVehicle(_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}();

// READ - Get emission data by vehicle ID with time interval filtering
var getEmissionDataByVehicleInterval = exports.getEmissionDataByVehicleInterval = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var vehicleId, _req$query2, interval, value, _req$pagination3, skip, take, whereClause, now, startTime, endTime, _yield$Promise$all7, _yield$Promise$all8, emissionData, totalCount;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          vehicleId = req.params.vehicleId;
          _req$query2 = req.query, interval = _req$query2.interval, value = _req$query2.value;
          _req$pagination3 = req.pagination, skip = _req$pagination3.skip, take = _req$pagination3.take;
          if (!(!interval || !value)) {
            _context7.next = 6;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            error: 'Interval and value are required parameters'
          }));
        case 6:
          whereClause = {
            vehicleId: parseInt(vehicleId)
          };
          now = new Date();
          _context7.t0 = interval;
          _context7.next = _context7.t0 === 'hours' ? 11 : _context7.t0 === 'days' ? 14 : _context7.t0 === 'daytime' ? 17 : 22;
          break;
        case 11:
          startTime = new Date(now);
          startTime.setHours(now.getHours() - parseInt(value));
          return _context7.abrupt("break", 23);
        case 14:
          startTime = new Date(now);
          startTime.setDate(now.getDate() - parseInt(value));
          return _context7.abrupt("break", 23);
        case 17:
          startTime = new Date(now);
          startTime.setHours(9, 0, 0, 0);
          endTime = new Date(now);
          endTime.setHours(17, 0, 0, 0);
          return _context7.abrupt("break", 23);
        case 22:
          return _context7.abrupt("return", res.status(400).json({
            error: 'Invalid interval. Use hours, days, or daytime'
          }));
        case 23:
          if (interval === 'daytime') {
            whereClause.timestamp = {
              gte: startTime,
              lte: endTime
            };
          } else {
            whereClause.timestamp = {
              gte: startTime
            };
          }
          _context7.next = 26;
          return Promise.all([prisma.emissionData.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            orderBy: {
              timestamp: 'desc'
            },
            include: {
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true
                }
              }
            }
          }), prisma.emissionData.count({
            where: whereClause
          })]);
        case 26:
          _yield$Promise$all7 = _context7.sent;
          _yield$Promise$all8 = _slicedToArray(_yield$Promise$all7, 2);
          emissionData = _yield$Promise$all8[0];
          totalCount = _yield$Promise$all8[1];
          return _context7.abrupt("return", res.status(200).json({
            data: emissionData,
            meta: {
              page: req.pagination.page,
              limit: req.pagination.limit,
              totalCount: totalCount,
              totalPages: Math.ceil(totalCount / req.pagination.limit),
              interval: interval,
              value: interval === 'daytime' ? 'working hours (9AM-5PM)' : value,
              timeRange: {
                from: startTime,
                to: endTime || now
              }
            }
          }));
        case 33:
          _context7.prev = 33;
          _context7.t1 = _context7["catch"](0);
          console.error('Error fetching emission data by interval:', _context7.t1);
          return _context7.abrupt("return", res.status(500).json({
            error: 'Failed to fetch emission data by interval'
          }));
        case 37:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 33]]);
  }));
  return function getEmissionDataByVehicleInterval(_x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}();

// READ - Get emission data by plate number
var getEmissionDataByPlateNumber = exports.getEmissionDataByPlateNumber = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var plateNumber, _req$pagination4, skip, take, startTime, endTime, whereClause, _yield$Promise$all9, _yield$Promise$all10, emissionData, totalCount;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          plateNumber = req.params.plateNumber;
          _req$pagination4 = req.pagination, skip = _req$pagination4.skip, take = _req$pagination4.take, startTime = _req$pagination4.startTime, endTime = _req$pagination4.endTime;
          whereClause = {
            plateNumber: plateNumber
          };
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
          _context8.next = 7;
          return Promise.all([prisma.emissionData.findMany({
            where: whereClause,
            skip: skip,
            take: take,
            orderBy: {
              timestamp: 'desc'
            },
            include: {
              vehicle: {
                select: {
                  vehicleModel: true,
                  vehicleType: true,
                  status: true
                }
              },
              trackingDevice: {
                select: {
                  serialNumber: true,
                  model: true
                }
              }
            }
          }), prisma.emissionData.count({
            where: whereClause
          })]);
        case 7:
          _yield$Promise$all9 = _context8.sent;
          _yield$Promise$all10 = _slicedToArray(_yield$Promise$all9, 2);
          emissionData = _yield$Promise$all10[0];
          totalCount = _yield$Promise$all10[1];
          return _context8.abrupt("return", res.status(200).json({
            data: emissionData,
            meta: {
              page: req.pagination.page,
              limit: req.pagination.limit,
              totalCount: totalCount,
              totalPages: Math.ceil(totalCount / req.pagination.limit)
            }
          }));
        case 14:
          _context8.prev = 14;
          _context8.t0 = _context8["catch"](0);
          console.error('Error fetching emission data:', _context8.t0);
          return _context8.abrupt("return", res.status(500).json({
            error: 'Failed to fetch emission data'
          }));
        case 18:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 14]]);
  }));
  return function getEmissionDataByPlateNumber(_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}();

// UPDATE - Enhanced update with validation
var updateEmissionData = exports.updateEmissionData = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var id, _req$body2, co2Percentage, coPercentage, o2Percentage, hcPPM, noxPPM, pm25Level, vehicleId, plateNumber, trackingDeviceId, timestamp, deletedAt, existingRecord, updateData, updatedEmissionData, emissionFieldsUpdated;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          id = req.params.id;
          _req$body2 = req.body, co2Percentage = _req$body2.co2Percentage, coPercentage = _req$body2.coPercentage, o2Percentage = _req$body2.o2Percentage, hcPPM = _req$body2.hcPPM, noxPPM = _req$body2.noxPPM, pm25Level = _req$body2.pm25Level, vehicleId = _req$body2.vehicleId, plateNumber = _req$body2.plateNumber, trackingDeviceId = _req$body2.trackingDeviceId, timestamp = _req$body2.timestamp, deletedAt = _req$body2.deletedAt;
          _context9.next = 5;
          return prisma.emissionData.findUnique({
            where: {
              id: parseInt(id)
            },
            include: {
              vehicle: true
            }
          });
        case 5:
          existingRecord = _context9.sent;
          if (existingRecord) {
            _context9.next = 8;
            break;
          }
          return _context9.abrupt("return", res.status(404).json({
            error: 'Emission data not found'
          }));
        case 8:
          // Prepare update data with proper type conversion and validation
          updateData = {};
          if (!(co2Percentage !== undefined)) {
            _context9.next = 13;
            break;
          }
          if (!(co2Percentage < 0 || co2Percentage > 100)) {
            _context9.next = 12;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            error: 'CO2 percentage must be between 0 and 100'
          }));
        case 12:
          updateData.co2Percentage = parseFloat(co2Percentage);
        case 13:
          if (!(coPercentage !== undefined)) {
            _context9.next = 17;
            break;
          }
          if (!(coPercentage < 0 || coPercentage > 100)) {
            _context9.next = 16;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            error: 'CO percentage must be between 0 and 100'
          }));
        case 16:
          updateData.coPercentage = parseFloat(coPercentage);
        case 17:
          if (!(o2Percentage !== undefined)) {
            _context9.next = 21;
            break;
          }
          if (!(o2Percentage < 0 || o2Percentage > 100)) {
            _context9.next = 20;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            error: 'O2 percentage must be between 0 and 100'
          }));
        case 20:
          updateData.o2Percentage = parseFloat(o2Percentage);
        case 21:
          if (!(hcPPM !== undefined)) {
            _context9.next = 25;
            break;
          }
          if (!(hcPPM < 0)) {
            _context9.next = 24;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            error: 'HC PPM must be non-negative'
          }));
        case 24:
          updateData.hcPPM = parseInt(hcPPM);
        case 25:
          if (noxPPM !== undefined) updateData.noxPPM = noxPPM ? parseFloat(noxPPM) : null;
          if (pm25Level !== undefined) updateData.pm25Level = pm25Level ? parseFloat(pm25Level) : null;
          if (vehicleId !== undefined) updateData.vehicleId = parseInt(vehicleId);
          if (plateNumber !== undefined) updateData.plateNumber = plateNumber;
          if (trackingDeviceId !== undefined) updateData.trackingDeviceId = parseInt(trackingDeviceId);
          if (timestamp !== undefined) updateData.timestamp = new Date(timestamp);
          if (deletedAt !== undefined) {
            updateData.deletedAt = deletedAt ? new Date(deletedAt) : null;
          }
          _context9.next = 34;
          return prisma.emissionData.update({
            where: {
              id: parseInt(id)
            },
            data: updateData,
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
                  model: true
                }
              }
            }
          });
        case 34:
          updatedEmissionData = _context9.sent;
          // Re-analyze emission levels if emission values were updated
          emissionFieldsUpdated = co2Percentage !== undefined || coPercentage !== undefined || hcPPM !== undefined || noxPPM !== undefined || pm25Level !== undefined;
          if (!(emissionFieldsUpdated && vehicleId)) {
            _context9.next = 39;
            break;
          }
          _context9.next = 39;
          return updateVehicleEmissionStatus(parseInt(vehicleId), updatedEmissionData);
        case 39:
          return _context9.abrupt("return", res.status(200).json({
            message: 'Emission data updated successfully',
            data: updatedEmissionData
          }));
        case 42:
          _context9.prev = 42;
          _context9.t0 = _context9["catch"](0);
          console.error('Error updating emission data:', _context9.t0);
          return _context9.abrupt("return", res.status(500).json({
            error: 'Failed to update emission data'
          }));
        case 46:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 42]]);
  }));
  return function updateEmissionData(_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}();

// DELETE - Delete emission data by ID
var deleteEmissionData = exports.deleteEmissionData = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var id, existingRecord;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id;
          _context10.next = 4;
          return prisma.emissionData.findUnique({
            where: {
              id: parseInt(id)
            }
          });
        case 4:
          existingRecord = _context10.sent;
          if (existingRecord) {
            _context10.next = 7;
            break;
          }
          return _context10.abrupt("return", res.status(404).json({
            error: 'Emission data not found'
          }));
        case 7:
          _context10.next = 9;
          return prisma.emissionData["delete"]({
            where: {
              id: parseInt(id)
            }
          });
        case 9:
          return _context10.abrupt("return", res.status(200).json({
            message: 'Emission data deleted successfully'
          }));
        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error('Error deleting emission data:', _context10.t0);
          return _context10.abrupt("return", res.status(500).json({
            error: 'Failed to delete emission data'
          }));
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 12]]);
  }));
  return function deleteEmissionData(_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();

// Enhanced statistics with basic analytics
var getEmissionStatistics = exports.getEmissionStatistics = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var _req$query3, vehicleId, interval, _req$pagination5, startTime, endTime, whereClause, intervalStartTime, now, emissionData, stats, normalCount;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _req$query3 = req.query, vehicleId = _req$query3.vehicleId, interval = _req$query3.interval;
          _req$pagination5 = req.pagination, startTime = _req$pagination5.startTime, endTime = _req$pagination5.endTime;
          whereClause = {};
          if (vehicleId) {
            whereClause.vehicleId = parseInt(vehicleId);
          }

          // Handle date filtering
          if (!interval) {
            _context11.next = 23;
            break;
          }
          now = new Date();
          _context11.t0 = interval;
          _context11.next = _context11.t0 === 'day' ? 10 : _context11.t0 === 'week' ? 13 : _context11.t0 === 'month' ? 16 : 19;
          break;
        case 10:
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 1);
          return _context11.abrupt("break", 20);
        case 13:
          intervalStartTime = new Date(now);
          intervalStartTime.setDate(now.getDate() - 7);
          return _context11.abrupt("break", 20);
        case 16:
          intervalStartTime = new Date(now);
          intervalStartTime.setMonth(now.getMonth() - 1);
          return _context11.abrupt("break", 20);
        case 19:
          return _context11.abrupt("return", res.status(400).json({
            error: 'Invalid interval. Use day, week, or month'
          }));
        case 20:
          whereClause.timestamp = {
            gte: intervalStartTime
          };
          _context11.next = 24;
          break;
        case 23:
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
        case 24:
          _context11.next = 26;
          return prisma.emissionData.findMany({
            where: whereClause,
            orderBy: {
              timestamp: 'asc'
            },
            include: {
              vehicle: {
                select: {
                  plateNumber: true,
                  vehicleModel: true,
                  status: true
                }
              }
            }
          });
        case 26:
          emissionData = _context11.sent;
          if (!(emissionData.length === 0)) {
            _context11.next = 29;
            break;
          }
          return _context11.abrupt("return", res.status(200).json({
            message: 'No emission data found for the specified criteria',
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
        case 29:
          // Calculate enhanced statistics
          stats = emissionData.reduce(function (acc, curr) {
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
              }
            }
          }));
        case 34:
          _context11.prev = 34;
          _context11.t1 = _context11["catch"](0);
          console.error('Error calculating emission statistics:', _context11.t1);
          return _context11.abrupt("return", res.status(500).json({
            error: 'Failed to calculate emission statistics'
          }));
        case 38:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 34]]);
  }));
  return function getEmissionStatistics(_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}();

// export const getEmissionDashboard = async (req, res) => {
//   try {
//     const { userId } = req.query
//     const now = new Date()
//     const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
//     const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

//     // Build where clause for user filtering
//     const userFilter = userId ? {
//       vehicle: { userId: parseInt(userId) }
//     } : {}

//     const [
//       recentEmissions,
//       todayStats,
//       weeklyEmissions,
//       activeAlerts
//     ] = await Promise.all([
//       // Recent emissions (last 10 records)
//       prisma.emissionData.findMany({
//         where: {
//           timestamp: { gte: last24Hours },
//           ...userFilter
//         },
//         take: 10,
//         orderBy: { timestamp: 'desc' },
//         include: {
//           vehicle: {
//             select: {
//               plateNumber: true,
//               vehicleModel: true,
//               status: true,
//             }
//           },
//           trackingDevice: {
//             select: {
//               serialNumber: true,
//               status: true,
//             }
//           }
//         }
//       }),

//       // Today's statistics
//       prisma.emissionData.aggregate({
//         where: {
//           timestamp: { gte: last24Hours },
//           ...userFilter
//         },
//         _avg: {
//           co2Percentage: true,
//           coPercentage: true,
//           o2Percentage: true,
//           hcPPM: true,
//           noxPPM: true,
//           pm25Level: true,
//         },
//         _count: true
//       }),

//       // Weekly emission count by status
//       prisma.emissionData.findMany({
//         where: {
//           timestamp: { gte: lastWeek },
//           ...userFilter
//         },
//         select: {
//           co2Percentage: true,
//           coPercentage: true,
//           hcPPM: true,
//           noxPPM: true,
//           pm25Level: true,
//         }
//       }),

//       // Active emission alerts
//       prisma.alert.findMany({
//         where: {
//           type: 'HIGH_EMISSION_ALERT',
//           isRead: false,
//           createdAt: { gte: last24Hours },
//           ...(userId && { userId: parseInt(userId) })
//         },
//         include: {
//           vehicle: {
//             select: {
//               plateNumber: true,
//               vehicleModel: true,
//             }
//           }
//         },
//         orderBy: { createdAt: 'desc' },
//         take: 5
//       })
//     ])

//     // Analyze weekly emissions by threshold levels
//     const weeklyAnalysis = weeklyEmissions.reduce((acc, emission) => {
//       const exceedsThreshold = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

//       const isCritical = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

//       if (isCritical) acc.critical++
//       else if (exceedsThreshold) acc.high++
//       else acc.normal++

//       acc.total++
//       return acc
//     }, { normal: 0, high: 0, critical: 0, total: 0 })

//     // Add emission level classification to recent emissions
//     const enhancedRecentEmissions = recentEmissions.map(emission => {
//       const isCritical = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.critical ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.critical ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.critical ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.critical) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.critical)

//       const isHigh = 
//         emission.co2Percentage >= EMISSION_THRESHOLDS.co2.warning ||
//         emission.coPercentage >= EMISSION_THRESHOLDS.co.warning ||
//         emission.hcPPM >= EMISSION_THRESHOLDS.hc.warning ||
//         (emission.noxPPM && emission.noxPPM >= EMISSION_THRESHOLDS.nox.warning) ||
//         (emission.pm25Level && emission.pm25Level >= EMISSION_THRESHOLDS.pm25.warning)

//       return {
//         ...emission,
//         emissionLevel: isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'NORMAL'
//       }
//     })

//     return res.status(200).json({
//       summary: {
//         todayAverages: {
//           co2: todayStats._avg.co2Percentage?.toFixed(3) || 0,
//           co: todayStats._avg.coPercentage?.toFixed(3) || 0,
//           hc: todayStats._avg.hcPPM?.toFixed(1) || 0,
//           nox: todayStats._avg.noxPPM?.toFixed(3) || null,
//           pm25: todayStats._avg.pm25Level?.toFixed(3) || null,
//         },
//         measurementsToday: todayStats._count || 0,
//         activeAlerts: activeAlerts.length,
//         weeklyAnalysis: {
//           ...weeklyAnalysis,
//           normalPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.normal / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//           highPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.high / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//           criticalPercentage: weeklyAnalysis.total > 0 ? ((weeklyAnalysis.critical / weeklyAnalysis.total) * 100).toFixed(1) : 0,
//         }
//       },
//       recentEmissions: enhancedRecentEmissions,
//       alerts: activeAlerts,
//       thresholds: EMISSION_THRESHOLDS,
//       timestamp: now.toISOString()
//     })
//   } catch (error) {
//     console.error('Error getting emission dashboard:', error)
//     return res.status(500).json({ error: 'Failed to get emission dashboard' })
//   }
// }

// Helper function to adjust start date to beginning of the day if only a date is given
// const adjustStartTime = date => {
//   const d = new Date(date)
//   if (!date.includes('T')) {
//     d.setHours(0, 0, 0, 0) // Start of the day
//   }
//   return d
// }

// // Helper function to adjust end date to end of the day if only a date is given
// const adjustEndTime = date => {
//   const d = new Date(date)
//   if (!date.includes('T')) {
//     d.setHours(23, 59, 59, 999) // End of the day
//   }
//   return d
// }