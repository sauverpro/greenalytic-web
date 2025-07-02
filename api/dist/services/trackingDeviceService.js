"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _prismaClient = _interopRequireDefault(require("../../prismaClient.js"));
var _paginationService = require("./paginationService.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var TrackingDeviceService = /*#__PURE__*/function () {
  function TrackingDeviceService() {
    _classCallCheck(this, TrackingDeviceService);
  }
  return _createClass(TrackingDeviceService, null, [{
    key: "registerTrackingDevice",
    value: function () {
      var _registerTrackingDevice = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
        var _vehicleData, serialNumber, deviceCategory, firmwareVersion, simCardNumber, installationDate, communicationProtocol, plateNumber, chassisNumber, vehicleType, fuelType, dataTransmissionInterval, enableOBDMonitoring, enableGPSTracking, enableEmissionMonitoring, userId, vehicleId, model, type, existingSerial, vehicleData, trackingDevice;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              serialNumber = data.serialNumber, deviceCategory = data.deviceCategory, firmwareVersion = data.firmwareVersion, simCardNumber = data.simCardNumber, installationDate = data.installationDate, communicationProtocol = data.communicationProtocol, plateNumber = data.plateNumber, chassisNumber = data.chassisNumber, vehicleType = data.vehicleType, fuelType = data.fuelType, dataTransmissionInterval = data.dataTransmissionInterval, enableOBDMonitoring = data.enableOBDMonitoring, enableGPSTracking = data.enableGPSTracking, enableEmissionMonitoring = data.enableEmissionMonitoring, userId = data.userId, vehicleId = data.vehicleId, model = data.model, type = data.type;
              if (!(!serialNumber || !deviceCategory || !plateNumber)) {
                _context.next = 4;
                break;
              }
              throw new Error("Missing required fields: serialNumber, deviceCategory, and plateNumber are required");
            case 4:
              _context.next = 6;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  serialNumber: serialNumber
                }
              });
            case 6:
              existingSerial = _context.sent;
              if (!existingSerial) {
                _context.next = 9;
                break;
              }
              throw new Error("Device with this serial number already exists");
            case 9:
              vehicleData = null;
              if (!vehicleId) {
                _context.next = 18;
                break;
              }
              _context.next = 13;
              return _prismaClient["default"].vehicle.findUnique({
                where: {
                  id: vehicleId
                },
                select: {
                  id: true,
                  userId: true,
                  plateNumber: true
                }
              });
            case 13:
              vehicleData = _context.sent;
              if (vehicleData) {
                _context.next = 16;
                break;
              }
              throw new Error("Vehicle not found");
            case 16:
              if (!(vehicleData.plateNumber !== plateNumber)) {
                _context.next = 18;
                break;
              }
              throw new Error("Plate number mismatch with selected vehicle");
            case 18:
              _context.next = 20;
              return _prismaClient["default"].trackingDevice.create({
                data: {
                  serialNumber: serialNumber,
                  deviceCategory: deviceCategory,
                  firmwareVersion: firmwareVersion || null,
                  simCardNumber: simCardNumber || null,
                  installationDate: installationDate ? new Date(installationDate) : new Date(),
                  communicationProtocol: communicationProtocol || 'MQTT',
                  dataTransmissionInterval: dataTransmissionInterval || '30sec',
                  enableOBDMonitoring: enableOBDMonitoring !== undefined ? enableOBDMonitoring : true,
                  enableGPSTracking: enableGPSTracking !== undefined ? enableGPSTracking : true,
                  enableEmissionMonitoring: enableEmissionMonitoring !== undefined ? enableEmissionMonitoring : true,
                  plateNumber: plateNumber,
                  vehicleId: vehicleId || null,
                  userId: ((_vehicleData = vehicleData) === null || _vehicleData === void 0 ? void 0 : _vehicleData.userId) || userId || null,
                  model: model || 'Unknown',
                  type: type || deviceCategory,
                  status: 'PENDING',
                  // Start as pending until activated
                  isActive: false,
                  lastPing: null
                },
                include: {
                  vehicle: {
                    select: {
                      id: true,
                      plateNumber: true,
                      vehicleModel: true,
                      vehicleType: true,
                      fuelType: true
                    }
                  },
                  user: {
                    select: {
                      id: true,
                      
                      email: true,
                      role: true
                    }
                  }
                }
              });
            case 20:
              trackingDevice = _context.sent;
              console.log("Device ".concat(serialNumber, " registered at ").concat(new Date().toISOString()));
              return _context.abrupt("return", {
                success: true,
                message: "Device ".concat(serialNumber, " has been successfully registered and assigned to vehicle ").concat(plateNumber, ". It will begin transmitting data based on the selected configuration."),
                device: trackingDevice
              });
            case 25:
              _context.prev = 25;
              _context.t0 = _context["catch"](0);
              throw new Error("Device registration failed: ".concat(_context.t0.message));
            case 28:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 25]]);
      }));
      function registerTrackingDevice(_x) {
        return _registerTrackingDevice.apply(this, arguments);
      }
      return registerTrackingDevice;
    }()
    /**
     * Add tracking device to vehicle
     */
  }, {
    key: "addTrackingDeviceToVehicle",
    value: (function () {
      var _addTrackingDeviceToVehicle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
        var serialNumber, model, type, plateNumber, vehicleId, vehicleData, existingSerial, existingDeviceCategory, trackingDevice;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              serialNumber = data.serialNumber, model = data.model, type = data.type, plateNumber = data.plateNumber, vehicleId = data.vehicleId;
              if (!(!serialNumber || !model || !type || !plateNumber)) {
                _context2.next = 4;
                break;
              }
              throw new Error("Missing required tracking device information");
            case 4:
              _context2.next = 6;
              return _prismaClient["default"].vehicle.findUnique({
                where: {
                  id: vehicleId,
                  plateNumber: plateNumber
                },
                select: {
                  id: true,
                  userId: true
                }
              });
            case 6:
              vehicleData = _context2.sent;
              if (vehicleData) {
                _context2.next = 9;
                break;
              }
              throw new Error("Vehicle not found or plate number mismatch.");
            case 9:
              _context2.next = 11;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  serialNumber: serialNumber
                }
              });
            case 11:
              existingSerial = _context2.sent;
              if (!existingSerial) {
                _context2.next = 14;
                break;
              }
              throw new Error("Tracking device with this serial number already exists.");
            case 14:
              _context2.next = 16;
              return _prismaClient["default"].trackingDevice.findFirst({
                where: {
                  vehicleId: vehicleId,
                  deviceCategory: type.toUpperCase(),
                  deletedAt: null,
                  status: {
                    not: 'INACTIVE'
                  }
                }
              });
            case 16:
              existingDeviceCategory = _context2.sent;
              if (!existingDeviceCategory) {
                _context2.next = 19;
                break;
              }
              throw new Error("A ".concat(type, " device is already assigned to this vehicle."));
            case 19:
              _context2.next = 21;
              return _prismaClient["default"].trackingDevice.create({
                data: {
                  serialNumber: serialNumber,
                  model: model,
                  type: type,
                  deviceCategory: type.toUpperCase(),
                  // Map to device category
                  plateNumber: plateNumber,
                  vehicleId: vehicleId,
                  userId: vehicleData.userId,
                  isActive: true,
                  status: 'ACTIVE',
                  lastPing: new Date(),
                  installationDate: new Date(),
                  communicationProtocol: 'MQTT' // Default
                }
              });
            case 21:
              trackingDevice = _context2.sent;
              return _context2.abrupt("return", {
                trackingDevice: trackingDevice,
                vehicleId: vehicleId
              });
            case 25:
              _context2.prev = 25;
              _context2.t0 = _context2["catch"](0);
              throw new Error(_context2.t0.message);
            case 28:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 25]]);
      }));
      function addTrackingDeviceToVehicle(_x2) {
        return _addTrackingDeviceToVehicle.apply(this, arguments);
      }
      return addTrackingDeviceToVehicle;
    }())
  }, {
    key: "getTrackingDevicesByVehicleId",
    value: function () {
      var _getTrackingDevicesByVehicleId = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(vehicleId) {
        var vehicle, trackingDevices, devicesWithStatus;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _prismaClient["default"].vehicle.findUnique({
                where: {
                  id: vehicleId
                }
              });
            case 3:
              vehicle = _context3.sent;
              if (vehicle) {
                _context3.next = 6;
                break;
              }
              throw new Error("Vehicle not found");
            case 6:
              _context3.next = 8;
              return _prismaClient["default"].trackingDevice.findMany({
                where: {
                  vehicleId: vehicleId,
                  deletedAt: null
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      
                      email: true,
                      image: true,
                      role: true
                    }
                  },
                  vehicle: {
                    select: {
                      plateNumber: true,
                      vehicleModel: true,
                      vehicleType: true,
                      status: true
                    }
                  },
                  gpsData: {
                    take: 5,
                    orderBy: {
                      timestamp: "desc"
                    }
                  },
                  obdData: {
                    take: 5,
                    orderBy: {
                      timestamp: "desc"
                    }
                  },
                  _count: {
                    select: {
                      gpsData: true,
                      fuelData: true,
                      emissionData: true,
                      obdData: true
                    }
                  }
                },
                orderBy: {
                  createdAt: "desc"
                }
              });
            case 8:
              trackingDevices = _context3.sent;
              devicesWithStatus = trackingDevices.map(function (device) {
                var fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                var isOnline = device.lastPing && new Date(device.lastPing) > fiveMinutesAgo;
                return _objectSpread(_objectSpread({}, device), {}, {
                  connectivityStatus: isOnline ? 'ONLINE' : 'OFFLINE',
                  dataTypesEnabled: {
                    gps: device.enableGPSTracking,
                    obd: device.enableOBDMonitoring,
                    emission: device.enableEmissionMonitoring
                  }
                });
              });
              return _context3.abrupt("return", devicesWithStatus);
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              throw new Error("Failed to retrieve tracking devices: ".concat(_context3.t0.message));
            case 16:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 13]]);
      }));
      function getTrackingDevicesByVehicleId(_x3) {
        return _getTrackingDevicesByVehicleId.apply(this, arguments);
      }
      return getTrackingDevicesByVehicleId;
    }()
    /**
     *  device details
     */
  }, {
    key: "getDeviceDetails",
    value: (function () {
      var _getDeviceDetails = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(deviceId) {
        var dateRange,
          paginationParams,
          parsedDeviceId,
          device,
          dateFilter,
          _paginationParams$pag,
          page,
          _paginationParams$lim,
          limit,
          skip,
          deviceData,
          counts,
          pagination,
          fiveMinutesAgo,
          deviceHealth,
          _args4 = arguments;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              dateRange = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
              paginationParams = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
              _context4.prev = 2;
              parsedDeviceId = parseInt(deviceId, 10);
              if (!isNaN(parsedDeviceId)) {
                _context4.next = 6;
                break;
              }
              throw new Error("Invalid device ID");
            case 6:
              _context4.next = 8;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  id: parsedDeviceId
                },
                include: {
                  vehicle: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          
                          email: true,
                          companyName: true,
                          role: true
                        }
                      }
                    }
                  },
                  user: {
                    select: {
                      id: true,
                      username: true,
                      
                      email: true,
                      phoneNumber: true,
                      role: true,
                      image: true
                    }
                  }
                }
              });
            case 8:
              device = _context4.sent;
              if (device) {
                _context4.next = 11;
                break;
              }
              throw new Error("Device not found");
            case 11:
              dateFilter = {};
              if (dateRange.startDate && dateRange.endDate) {
                dateFilter.timestamp = {
                  gte: new Date(dateRange.startDate),
                  lte: new Date(dateRange.endDate)
                };
              }
              _paginationParams$pag = paginationParams.page, page = _paginationParams$pag === void 0 ? 1 : _paginationParams$pag, _paginationParams$lim = paginationParams.limit, limit = _paginationParams$lim === void 0 ? 10 : _paginationParams$lim;
              skip = (page - 1) * limit; // Data retrieval
              deviceData = {};
              counts = {}; // GPS Data (if enabled)
              if (!device.enableGPSTracking) {
                _context4.next = 24;
                break;
              }
              _context4.next = 20;
              return _prismaClient["default"].gpsData.count({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter)
              });
            case 20:
              counts.gpsData = _context4.sent;
              _context4.next = 23;
              return _prismaClient["default"].gpsData.findMany({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter),
                orderBy: {
                  timestamp: "desc"
                },
                skip: skip,
                take: limit
              });
            case 23:
              deviceData.gpsData = _context4.sent;
            case 24:
              _context4.next = 26;
              return _prismaClient["default"].fuelData.count({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter)
              });
            case 26:
              counts.fuelData = _context4.sent;
              _context4.next = 29;
              return _prismaClient["default"].fuelData.findMany({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter),
                orderBy: {
                  timestamp: "desc"
                },
                skip: skip,
                take: limit
              });
            case 29:
              deviceData.fuelData = _context4.sent;
              if (!device.enableEmissionMonitoring) {
                _context4.next = 37;
                break;
              }
              _context4.next = 33;
              return _prismaClient["default"].emissionData.count({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter)
              });
            case 33:
              counts.emissionData = _context4.sent;
              _context4.next = 36;
              return _prismaClient["default"].emissionData.findMany({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter),
                orderBy: {
                  timestamp: "desc"
                },
                skip: skip,
                take: limit
              });
            case 36:
              deviceData.emissionData = _context4.sent;
            case 37:
              if (!device.enableOBDMonitoring) {
                _context4.next = 44;
                break;
              }
              _context4.next = 40;
              return _prismaClient["default"].oBDData.count({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter)
              });
            case 40:
              counts.obdData = _context4.sent;
              _context4.next = 43;
              return _prismaClient["default"].oBDData.findMany({
                where: _objectSpread({
                  trackingDeviceId: parsedDeviceId
                }, dateFilter),
                orderBy: {
                  timestamp: "desc"
                },
                skip: skip,
                take: limit
              });
            case 43:
              deviceData.obdData = _context4.sent;
            case 44:
              pagination = _paginationService.PaginationService.processMultipleDatasets(counts, {
                page: page,
                limit: limit
              }); // Device health analysis
              fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
              deviceHealth = {
                isOnline: device.lastPing && new Date(device.lastPing) > fiveMinutesAgo,
                lastSeen: device.lastPing,
                dataStreams: {
                  gps: device.enableGPSTracking && counts.gpsData > 0,
                  fuel: counts.fuelData > 0,
                  emission: device.enableEmissionMonitoring && counts.emissionData > 0,
                  obd: device.enableOBDMonitoring && counts.obdData > 0
                },
                configuration: {
                  transmissionInterval: device.dataTransmissionInterval,
                  protocol: device.communicationProtocol,
                  firmwareVersion: device.firmwareVersion
                }
              };
              return _context4.abrupt("return", {
                device: _objectSpread(_objectSpread({}, device), {}, {
                  health: deviceHealth
                }),
                data: deviceData,
                pagination: pagination
              });
            case 50:
              _context4.prev = 50;
              _context4.t0 = _context4["catch"](2);
              throw new Error("Error getting device details: ".concat(_context4.t0.message));
            case 53:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[2, 50]]);
      }));
      function getDeviceDetails(_x4) {
        return _getDeviceDetails.apply(this, arguments);
      }
      return getDeviceDetails;
    }()
    /**
     *  device update
     */
    )
  }, {
    key: "updateDeviceService",
    value: (function () {
      var _updateDeviceService = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(deviceId, data) {
        var existingDevice, serialNumber, plateNumber, vehicleId, vehicleData, existingSerial, updateData, updatedDevice;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  id: deviceId,
                  deletedAt: null
                },
                include: {
                  vehicle: true
                }
              });
            case 3:
              existingDevice = _context5.sent;
              if (existingDevice) {
                _context5.next = 6;
                break;
              }
              throw new Error("Tracking device not found");
            case 6:
              // Validate required fields
              serialNumber = data.serialNumber, plateNumber = data.plateNumber, vehicleId = data.vehicleId;
              if (!(vehicleId && plateNumber)) {
                _context5.next = 13;
                break;
              }
              _context5.next = 10;
              return _prismaClient["default"].vehicle.findUnique({
                where: {
                  id: vehicleId,
                  plateNumber: plateNumber
                },
                select: {
                  id: true,
                  userId: true
                }
              });
            case 10:
              vehicleData = _context5.sent;
              if (vehicleData) {
                _context5.next = 13;
                break;
              }
              throw new Error("Vehicle not found or plate number mismatch.");
            case 13:
              if (!(serialNumber && serialNumber !== existingDevice.serialNumber)) {
                _context5.next = 19;
                break;
              }
              _context5.next = 16;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  serialNumber: serialNumber
                }
              });
            case 16:
              existingSerial = _context5.sent;
              if (!existingSerial) {
                _context5.next = 19;
                break;
              }
              throw new Error("Tracking device with this serial number already exists.");
            case 19:
              // Prepare update data
              updateData = _objectSpread(_objectSpread({}, data), {}, {
                updatedAt: new Date()
              }); // Handle status changes
              if (data.status === 'INACTIVE' || data.isActive === false) {
                updateData.isActive = false;
                updateData.status = 'INACTIVE';
                updateData.lastPing = new Date(); // Update last ping on status change
              } else if (data.status === 'ACTIVE' || data.isActive === true) {
                updateData.isActive = true;
                updateData.status = 'ACTIVE';
              }
              _context5.next = 23;
              return _prismaClient["default"].trackingDevice.update({
                where: {
                  id: deviceId
                },
                data: updateData,
                include: {
                  vehicle: {
                    select: {
                      plateNumber: true,
                      vehicleModel: true,
                      vehicleType: true
                    }
                  },
                  user: {
                    select: {
                      id: true,
                      
                      email: true
                    }
                  }
                }
              });
            case 23:
              updatedDevice = _context5.sent;
              return _context5.abrupt("return", updatedDevice);
            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](0);
              throw _context5.t0;
            case 30:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[0, 27]]);
      }));
      function updateDeviceService(_x5, _x6) {
        return _updateDeviceService.apply(this, arguments);
      }
      return updateDeviceService;
    }()
    /**
     * device listing with filtering capabilities
     */
    )
  }, {
    key: "getAllTrackingDevices",
    value: (function () {
      var _getAllTrackingDevices = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
        var page,
          limit,
          filters,
          skip,
          whereClause,
          fiveMinutesAgo,
          _fiveMinutesAgo,
          totalDevices,
          devices,
          devicesWithStatus,
          _args6 = arguments;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              page = _args6.length > 0 && _args6[0] !== undefined ? _args6[0] : 1;
              limit = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : 10;
              filters = _args6.length > 2 && _args6[2] !== undefined ? _args6[2] : {};
              _context6.prev = 3;
              skip = (page - 1) * limit; // Build where clause with filters
              whereClause = {
                deletedAt: null
              };
              if (filters.status) {
                whereClause.status = filters.status;
              }
              if (filters.deviceCategory) {
                whereClause.deviceCategory = filters.deviceCategory;
              }
              if (filters.isActive !== undefined) {
                whereClause.isActive = filters.isActive;
              }
              if (filters.userId) {
                whereClause.userId = filters.userId;
              }

              // Online/Offline filter
              if (filters.connectivity === 'ONLINE') {
                fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                whereClause.lastPing = {
                  gte: fiveMinutesAgo
                };
              } else if (filters.connectivity === 'OFFLINE') {
                _fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                whereClause.OR = [{
                  lastPing: {
                    lt: _fiveMinutesAgo
                  }
                }, {
                  lastPing: null
                }];
              }
              _context6.next = 13;
              return _prismaClient["default"].trackingDevice.count({
                where: whereClause
              });
            case 13:
              totalDevices = _context6.sent;
              _context6.next = 16;
              return _prismaClient["default"].trackingDevice.findMany({
                where: whereClause,
                skip: skip,
                take: limit,
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      
                      email: true,
                      image: true,
                      companyName: true
                    }
                  },
                  vehicle: {
                    select: {
                      plateNumber: true,
                      vehicleModel: true,
                      vehicleType: true,
                      status: true
                    }
                  },
                  _count: {
                    select: {
                      gpsData: true,
                      fuelData: true,
                      emissionData: true,
                      obdData: true
                    }
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                }
              });
            case 16:
              devices = _context6.sent;
              // Add connectivity status
              devicesWithStatus = devices.map(function (device) {
                var fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                var isOnline = device.lastPing && new Date(device.lastPing) > fiveMinutesAgo;
                return _objectSpread(_objectSpread({}, device), {}, {
                  connectivityStatus: isOnline ? 'ONLINE' : 'OFFLINE'
                });
              });
              return _context6.abrupt("return", {
                devices: devicesWithStatus,
                pagination: {
                  currentPage: page,
                  totalPages: Math.ceil(totalDevices / limit),
                  totalItems: totalDevices,
                  limit: limit
                }
              });
            case 21:
              _context6.prev = 21;
              _context6.t0 = _context6["catch"](3);
              throw new Error("Error retrieving devices: ".concat(_context6.t0.message));
            case 24:
            case "end":
              return _context6.stop();
          }
        }, _callee6, null, [[3, 21]]);
      }));
      function getAllTrackingDevices() {
        return _getAllTrackingDevices.apply(this, arguments);
      }
      return getAllTrackingDevices;
    }()
    /**
     * Device heartbeat update for connectivity tracking
     */
    )
  }, {
    key: "updateDeviceHeartbeat",
    value: (function () {
      var _updateDeviceHeartbeat = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(serialNumber) {
        var updatedDevice;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return _prismaClient["default"].trackingDevice.update({
                where: {
                  serialNumber: serialNumber
                },
                data: {
                  lastPing: new Date(),
                  status: 'ACTIVE',
                  isActive: true
                }
              });
            case 3:
              updatedDevice = _context7.sent;
              return _context7.abrupt("return", updatedDevice);
            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7["catch"](0);
              throw new Error("Error updating device heartbeat: ".concat(_context7.t0.message));
            case 10:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[0, 7]]);
      }));
      function updateDeviceHeartbeat(_x7) {
        return _updateDeviceHeartbeat.apply(this, arguments);
      }
      return updateDeviceHeartbeat;
    }()
    /**
     * Get device configuration for data transmission
     */
    )
  }, {
    key: "getDeviceConfiguration",
    value: (function () {
      var _getDeviceConfiguration = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(serialNumber) {
        var device;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  serialNumber: serialNumber
                },
                select: {
                  id: true,
                  serialNumber: true,
                  deviceCategory: true,
                  communicationProtocol: true,
                  dataTransmissionInterval: true,
                  enableOBDMonitoring: true,
                  enableGPSTracking: true,
                  enableEmissionMonitoring: true,
                  status: true,
                  isActive: true
                }
              });
            case 3:
              device = _context8.sent;
              if (device) {
                _context8.next = 6;
                break;
              }
              throw new Error("Device not found");
            case 6:
              return _context8.abrupt("return", device);
            case 9:
              _context8.prev = 9;
              _context8.t0 = _context8["catch"](0);
              throw new Error("Error getting device configuration: ".concat(_context8.t0.message));
            case 12:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[0, 9]]);
      }));
      function getDeviceConfiguration(_x8) {
        return _getDeviceConfiguration.apply(this, arguments);
      }
      return getDeviceConfiguration;
    }())
  }, {
    key: "removeTrackingDeviceFromVehicle",
    value: function () {
      var _removeTrackingDeviceFromVehicle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(deviceId, vehicleId) {
        var trackingDevice;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  id: deviceId
                },
                include: {
                  vehicle: true
                }
              });
            case 3:
              trackingDevice = _context9.sent;
              if (trackingDevice) {
                _context9.next = 6;
                break;
              }
              throw new Error("Tracking device not found.");
            case 6:
              if (!(trackingDevice.vehicleId === vehicleId)) {
                _context9.next = 12;
                break;
              }
              _context9.next = 9;
              return _prismaClient["default"].trackingDevice.update({
                where: {
                  id: deviceId
                },
                data: {
                  deletedAt: new Date(),
                  status: 'INACTIVE',
                  isActive: false
                }
              });
            case 9:
              return _context9.abrupt("return", {
                success: true,
                message: "Tracking device removed from vehicle."
              });
            case 12:
              throw new Error("Tracking device is not assigned to this vehicle.");
            case 13:
              _context9.next = 18;
              break;
            case 15:
              _context9.prev = 15;
              _context9.t0 = _context9["catch"](0);
              throw new Error(_context9.t0.message);
            case 18:
            case "end":
              return _context9.stop();
          }
        }, _callee9, null, [[0, 15]]);
      }));
      function removeTrackingDeviceFromVehicle(_x9, _x10) {
        return _removeTrackingDeviceFromVehicle.apply(this, arguments);
      }
      return removeTrackingDeviceFromVehicle;
    }()
  }, {
    key: "getTrackingDeviceById",
    value: function () {
      var _getTrackingDeviceById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(id) {
        var trackingDevice;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              _context10.next = 3;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  id: id
                },
                include: {
                  vehicle: true,
                  user: {
                    select: {
                      id: true,
                      username: true,
                      
                      email: true,
                      phoneNumber: true,
                      role: true,
                      image: true
                    }
                  }
                }
              });
            case 3:
              trackingDevice = _context10.sent;
              if (trackingDevice) {
                _context10.next = 6;
                break;
              }
              throw new Error("Tracking device not found.");
            case 6:
              return _context10.abrupt("return", trackingDevice);
            case 9:
              _context10.prev = 9;
              _context10.t0 = _context10["catch"](0);
              throw new Error(_context10.t0.message);
            case 12:
            case "end":
              return _context10.stop();
          }
        }, _callee10, null, [[0, 9]]);
      }));
      function getTrackingDeviceById(_x11) {
        return _getTrackingDeviceById.apply(this, arguments);
      }
      return getTrackingDeviceById;
    }()
  }, {
    key: "getTrackingDevicesByUser",
    value: function () {
      var _getTrackingDevicesByUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(userId) {
        var devices;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _context11.next = 3;
              return _prismaClient["default"].trackingDevice.findMany({
                where: {
                  userId: userId,
                  deletedAt: null
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      
                      email: true,
                      phoneNumber: true,
                      role: true,
                      image: true
                    }
                  },
                  vehicle: {
                    select: {
                      plateNumber: true,
                      vehicleType: true,
                      vehicleModel: true,
                      status: true
                    }
                  }
                },
                orderBy: {
                  createdAt: "desc"
                }
              });
            case 3:
              devices = _context11.sent;
              return _context11.abrupt("return", devices);
            case 7:
              _context11.prev = 7;
              _context11.t0 = _context11["catch"](0);
              throw new Error("Failed to retrieve tracking devices for user: ".concat(_context11.t0.message));
            case 10:
            case "end":
              return _context11.stop();
          }
        }, _callee11, null, [[0, 7]]);
      }));
      function getTrackingDevicesByUser(_x12) {
        return _getTrackingDevicesByUser.apply(this, arguments);
      }
      return getTrackingDevicesByUser;
    }()
    /**
     * Get tracking device status by ID
     */
  }, {
    key: "getTrackingDeviceStatus",
    value: (function () {
      var _getTrackingDeviceStatus = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee12(deviceId) {
        var device, fiveMinutesAgo, isOnline;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              _context12.next = 3;
              return _prismaClient["default"].trackingDevice.findUnique({
                where: {
                  id: deviceId
                },
                select: {
                  id: true,
                  serialNumber: true,
                  status: true,
                  isActive: true,
                  lastPing: true
                }
              });
            case 3:
              device = _context12.sent;
              if (device) {
                _context12.next = 6;
                break;
              }
              throw new Error("Tracking device not found");
            case 6:
              fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
              isOnline = device.lastPing && new Date(device.lastPing) > fiveMinutesAgo;
              return _context12.abrupt("return", _objectSpread(_objectSpread({}, device), {}, {
                connectivityStatus: isOnline ? 'ONLINE' : 'OFFLINE'
              }));
            case 11:
              _context12.prev = 11;
              _context12.t0 = _context12["catch"](0);
              throw new Error("Error retrieving device status: ".concat(_context12.t0.message));
            case 14:
            case "end":
              return _context12.stop();
          }
        }, _callee12, null, [[0, 11]]);
      }));
      function getTrackingDeviceStatus(_x13) {
        return _getTrackingDeviceStatus.apply(this, arguments);
      }
      return getTrackingDeviceStatus;
    }())
  }, {
    key: "deleteVehicleAndTrackingDevice",
    value: function () {
      var _deleteVehicleAndTrackingDevice = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee13(vehicleId) {
        var vehicle;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              _context13.next = 3;
              return _prismaClient["default"].vehicle.findUnique({
                where: {
                  id: vehicleId
                }
              });
            case 3:
              vehicle = _context13.sent;
              if (vehicle) {
                _context13.next = 6;
                break;
              }
              throw new Error("Vehicle not found");
            case 6:
              _context13.next = 8;
              return _prismaClient["default"].trackingDevice.updateMany({
                where: {
                  vehicleId: vehicleId
                },
                data: {
                  deletedAt: new Date(),
                  status: 'INACTIVE',
                  isActive: false
                }
              });
            case 8:
              _context13.next = 10;
              return _prismaClient["default"].vehicle["delete"]({
                where: {
                  id: vehicleId
                }
              });
            case 10:
              return _context13.abrupt("return", {
                success: true,
                message: "Vehicle and associated tracking devices deleted successfully"
              });
            case 13:
              _context13.prev = 13;
              _context13.t0 = _context13["catch"](0);
              throw new Error("Error deleting vehicle and tracking devices: ".concat(_context13.t0.message));
            case 16:
            case "end":
              return _context13.stop();
          }
        }, _callee13, null, [[0, 13]]);
      }));
      function deleteVehicleAndTrackingDevice(_x14) {
        return _deleteVehicleAndTrackingDevice.apply(this, arguments);
      }
      return deleteVehicleAndTrackingDevice;
    }()
  }]);
}();
var _default = exports["default"] = TrackingDeviceService;