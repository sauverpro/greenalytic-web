"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VehicleService = void 0;
var _client = require("@prisma/client");
var _globaleerorshandling = require("../../middlewares/globaleerorshandling.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
var prisma = new _client.PrismaClient();
var VehicleService = exports.VehicleService = /*#__PURE__*/function () {
  function VehicleService() {
    _classCallCheck(this, VehicleService);
  }
  return _createClass(VehicleService, null, [{
    key: "vehicleExistsAndBelongsToUser",
    value: (
    /**
     * Check if a vehicle exists and belongs to the user
     * @param {number} vehicleId - The ID of the vehicle to check
     * @param {number} userId - The ID of the user making the request
     * @returns {Promise<boolean>} - True if the vehicle exists and belongs to the user, false otherwise
     */
    function () {
      var _vehicleExistsAndBelongsToUser = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(vehicleId, userId) {
        var vehicle;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return prisma.vehicle.findFirst({
                where: {
                  id: vehicleId,
                  userId: userId,
                  deletedAt: null // Check for soft deletion
                }
              });
            case 3:
              vehicle = _context.sent;
              return _context.abrupt("return", !!vehicle);
            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](0);
              console.error('Error checking vehicle ownership:', _context.t0);
              throw new _globaleerorshandling.AppError('Failed to verify vehicle ownership', 500);
            case 11:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[0, 7]]);
      }));
      function vehicleExistsAndBelongsToUser(_x, _x2) {
        return _vehicleExistsAndBelongsToUser.apply(this, arguments);
      }
      return vehicleExistsAndBelongsToUser;
    }()
    /**
     * Get all vehicles belonging to a user with enhanced filtering and pagination
     * @param {number} userId - The ID of the user
     * @param {Object} pagination - Pagination parameters
     * @param {Object} filters - Filter parameters
     * @returns {Promise<Object>} - Paginated list of vehicles with metadata
     */
    )
  }, {
    key: "getVehiclesByUserId",
    value: (function () {
      var _getVehiclesByUserId = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(userId) {
        var pagination,
          filters,
          whereClause,
          totalCount,
          vehicles,
          meta,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              pagination = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              filters = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              _context2.prev = 2;
              // Build where clause
              whereClause = {
                userId: userId,
                deletedAt: null
              }; // Apply filters
              if (filters.status) {
                whereClause.status = filters.status;
              }
              if (filters.vehicleType) {
                whereClause.vehicleType = filters.vehicleType;
              }
              if (filters.fuelType) {
                whereClause.fuelType = filters.fuelType;
              }
              if (filters.emissionStatus) {
                whereClause.emissionStatus = filters.emissionStatus;
              }

              // Search functionality
              if (filters.search) {
                whereClause.OR = [{
                  plateNumber: {
                    contains: filters.search,
                    mode: 'insensitive'
                  }
                }, {
                  vehicleModel: {
                    contains: filters.search,
                    mode: 'insensitive'
                  }
                }];
              }

              // Get total count for pagination
              _context2.next = 11;
              return prisma.vehicle.count({
                where: whereClause
              });
            case 11:
              totalCount = _context2.sent;
              _context2.next = 14;
              return prisma.vehicle.findMany({
                where: whereClause,
                skip: pagination.skip || 0,
                take: pagination.take || 10,
                orderBy: {
                  createdAt: 'desc'
                },
                include: {
                  trackingDevices: {
                    where: {
                      deletedAt: null
                    },
                    select: {
                      id: true,
                      serialNumber: true,
                      model: true,
                      status: true,
                      batteryLevel: true,
                      signalStrength: true
                    }
                  },
                  _count: {
                    select: {
                      // emissionData: true,
                      fuelData: true,
                      gpsData: true,
                      alerts: true
                    }
                  }
                }
              });
            case 14:
              vehicles = _context2.sent;
              // Build pagination metadata
              meta = pagination.buildMeta ? pagination.buildMeta(totalCount) : {
                pagination: {
                  currentPage: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
                  totalPages: Math.ceil(totalCount / (pagination.take || 10)),
                  totalCount: totalCount,
                  limit: pagination.take || 10
                }
              };
              return _context2.abrupt("return", {
                data: vehicles,
                meta: meta
              });
            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2["catch"](2);
              console.error('Error fetching vehicles by user ID:', _context2.t0);
              throw new _globaleerorshandling.AppError('Failed to fetch user vehicles', 500);
            case 23:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[2, 19]]);
      }));
      function getVehiclesByUserId(_x3) {
        return _getVehiclesByUserId.apply(this, arguments);
      }
      return getVehiclesByUserId;
    }()
    /**
     * Get a single vehicle by ID with full details
     * @param {number} vehicleId - The ID of the vehicle
     * @param {number} userId - The ID of the user (for ownership validation)
     * @returns {Promise<Object|null>} - Vehicle with full details or null
     */
    )
  }, {
    key: "getVehicleById",
    value: (function () {
      var _getVehicleById = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(vehicleId) {
        var userId,
          whereClause,
          vehicle,
          _args3 = arguments;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              userId = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;
              _context3.prev = 1;
              whereClause = {
                id: vehicleId,
                deletedAt: null
              }; // Add user filter if provided (for ownership validation)
              if (userId) {
                whereClause.userId = userId;
              }
              _context3.next = 6;
              return prisma.vehicle.findFirst({
                where: whereClause,
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      fullName: true,
                      phoneNumber: true
                    }
                  },
                  trackingDevices: {
                    where: {
                      deletedAt: null
                    },
                    include: {
                      gpsData: {
                        orderBy: {
                          timestamp: 'desc'
                        },
                        take: 1 // Latest GPS data
                      }
                    }
                  },
                  // emissionData: {
                  //   orderBy: { timestamp: 'desc' },
                  //   take: 5 // Latest 5 emission readings
                  // },
                  fuelData: {
                    orderBy: {
                      timestamp: 'desc'
                    },
                    take: 5 // Latest 5 fuel readings
                  },
                  alerts: {
                    where: {
                      isRead: false
                    },
                    orderBy: {
                      createdAt: 'desc'
                    },
                    take: 10 // Latest unacknowledged alerts
                  },
                  _count: {
                    select: {
                      // emissionData: true,
                      fuelData: true,
                      gpsData: true,
                      alerts: true
                    }
                  }
                }
              });
            case 6:
              vehicle = _context3.sent;
              return _context3.abrupt("return", vehicle);
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              console.error('Error fetching vehicle by ID:', _context3.t0);
              throw new _globaleerorshandling.AppError('Failed to fetch vehicle details', 500);
            case 14:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[1, 10]]);
      }));
      function getVehicleById(_x4) {
        return _getVehicleById.apply(this, arguments);
      }
      return getVehicleById;
    }()
    /**
     * Create a new vehicle
     * @param {Object} vehicleData - Vehicle data to create
     * @param {number} userId - The ID of the user creating the vehicle
     * @returns {Promise<Object>} - Created vehicle
     */
    )
  }, {
    key: "createVehicle",
    value: (function () {
      var _createVehicle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(vehicleData, userId) {
        var existingVehicle, vehicle;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return prisma.vehicle.findFirst({
                where: {
                  plateNumber: vehicleData.plateNumber,
                  deletedAt: null
                }
              });
            case 3:
              existingVehicle = _context4.sent;
              if (!existingVehicle) {
                _context4.next = 6;
                break;
              }
              throw new _globaleerorshandling.AppError('A vehicle with this plate number already exists', 400);
            case 6:
              _context4.next = 8;
              return prisma.vehicle.create({
                data: _objectSpread(_objectSpread({}, vehicleData), {}, {
                  userId: userId,
                  status: vehicleData.status || 'NORMAL_EMISSION',
                  emissionStatus: vehicleData.emissionStatus || 'NORMAL'
                }),
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      fullName: true
                    }
                  }
                }
              });
            case 8:
              vehicle = _context4.sent;
              return _context4.abrupt("return", vehicle);
            case 12:
              _context4.prev = 12;
              _context4.t0 = _context4["catch"](0);
              if (!(_context4.t0 instanceof _globaleerorshandling.AppError)) {
                _context4.next = 16;
                break;
              }
              throw _context4.t0;
            case 16:
              console.error('Error creating vehicle:', _context4.t0);
              throw new _globaleerorshandling.AppError('Failed to create vehicle', 500);
            case 18:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 12]]);
      }));
      function createVehicle(_x5, _x6) {
        return _createVehicle.apply(this, arguments);
      }
      return createVehicle;
    }()
    /**
     * Update a vehicle
     * @param {number} vehicleId - The ID of the vehicle to update
     * @param {Object} updateData - Data to update
     * @param {number} userId - The ID of the user updating (for ownership validation)
     * @returns {Promise<Object>} - Updated vehicle
     */
    )
  }, {
    key: "updateVehicle",
    value: (function () {
      var _updateVehicle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(vehicleId, updateData) {
        var userId,
          existingVehicle,
          vehicle,
          _args5 = arguments;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              userId = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : null;
              _context5.prev = 1;
              if (!updateData.plateNumber) {
                _context5.next = 8;
                break;
              }
              _context5.next = 5;
              return prisma.vehicle.findFirst({
                where: {
                  plateNumber: updateData.plateNumber,
                  id: {
                    not: vehicleId
                  },
                  deletedAt: null
                }
              });
            case 5:
              existingVehicle = _context5.sent;
              if (!existingVehicle) {
                _context5.next = 8;
                break;
              }
              throw new _globaleerorshandling.AppError('A vehicle with this plate number already exists', 400);
            case 8:
              _context5.next = 10;
              return prisma.vehicle.update({
                where: {
                  id: vehicleId
                },
                data: _objectSpread(_objectSpread({}, updateData), {}, {
                  updatedAt: new Date()
                }),
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      fullName: true
                    }
                  },
                  trackingDevices: {
                    where: {
                      deletedAt: null
                    },
                    select: {
                      id: true,
                      serialNumber: true,
                      model: true,
                      status: true
                    }
                  }
                }
              });
            case 10:
              vehicle = _context5.sent;
              return _context5.abrupt("return", vehicle);
            case 14:
              _context5.prev = 14;
              _context5.t0 = _context5["catch"](1);
              if (!(_context5.t0 instanceof _globaleerorshandling.AppError)) {
                _context5.next = 18;
                break;
              }
              throw _context5.t0;
            case 18:
              console.error('Error updating vehicle:', _context5.t0);
              throw new _globaleerorshandling.AppError('Failed to update vehicle', 500);
            case 20:
            case "end":
              return _context5.stop();
          }
        }, _callee5, null, [[1, 14]]);
      }));
      function updateVehicle(_x7, _x8) {
        return _updateVehicle.apply(this, arguments);
      }
      return updateVehicle;
    }()
    /**
     * Soft delete a vehicle
     * @param {number} vehicleId - The ID of the vehicle to delete
     * @param {number} userId - The ID of the user deleting (for ownership validation)
     * @returns {Promise<boolean>} - Success status
     */
    )
  }, {
    key: "deleteVehicle",
    value: (function () {
      var _deleteVehicle = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(vehicleId) {
        var userId,
          exists,
          _args6 = arguments;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              userId = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : null;
              _context6.prev = 1;
              if (!userId) {
                _context6.next = 8;
                break;
              }
              _context6.next = 5;
              return this.vehicleExistsAndBelongsToUser(vehicleId, userId);
            case 5:
              exists = _context6.sent;
              if (exists) {
                _context6.next = 8;
                break;
              }
              throw new _globaleerorshandling.AppError('Vehicle not found or access denied', 404);
            case 8:
              _context6.next = 10;
              return prisma.vehicle.update({
                where: {
                  id: vehicleId
                },
                data: {
                  deletedAt: new Date(),
                  updatedAt: new Date()
                }
              });
            case 10:
              return _context6.abrupt("return", true);
            case 13:
              _context6.prev = 13;
              _context6.t0 = _context6["catch"](1);
              if (!(_context6.t0 instanceof _globaleerorshandling.AppError)) {
                _context6.next = 17;
                break;
              }
              throw _context6.t0;
            case 17:
              console.error('Error deleting vehicle:', _context6.t0);
              throw new _globaleerorshandling.AppError('Failed to delete vehicle', 500);
            case 19:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this, [[1, 13]]);
      }));
      function deleteVehicle(_x9) {
        return _deleteVehicle.apply(this, arguments);
      }
      return deleteVehicle;
    }()
    /**
     * Get vehicles with advanced filtering for admin
     * @param {Object} pagination - Pagination parameters
     * @param {Object} filters - Advanced filter parameters
     * @returns {Promise<Object>} - Filtered vehicles with metadata
     */
    )
  }, {
    key: "getVehiclesWithAdvancedFilters",
    value: (function () {
      var _getVehiclesWithAdvancedFilters = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        var pagination,
          filters,
          whereClause,
          totalCount,
          vehicles,
          meta,
          _args7 = arguments;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              pagination = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : {};
              filters = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
              _context7.prev = 2;
              whereClause = {
                deletedAt: null
              }; // Apply filters
              if (filters.status) whereClause.status = filters.status;
              if (filters.vehicleType) whereClause.vehicleType = filters.vehicleType;
              if (filters.fuelType) whereClause.fuelType = filters.fuelType;
              if (filters.emissionStatus) whereClause.emissionStatus = filters.emissionStatus;
              if (filters.userId) whereClause.userId = filters.userId;

              // Year range filter
              if (filters.yearFrom || filters.yearTo) {
                whereClause.yearOfManufacture = {};
                if (filters.yearFrom) whereClause.yearOfManufacture.gte = parseInt(filters.yearFrom);
                if (filters.yearTo) whereClause.yearOfManufacture.lte = parseInt(filters.yearTo);
              }

              // Search functionality
              if (filters.search) {
                whereClause.OR = [{
                  plateNumber: {
                    contains: filters.search,
                    mode: 'insensitive'
                  }
                }, {
                  vehicleModel: {
                    contains: filters.search,
                    mode: 'insensitive'
                  }
                }, {
                  user: {
                    email: {
                      contains: filters.search,
                      mode: 'insensitive'
                    }
                  }
                }, {
                  user: {
                    fullName: {
                      contains: filters.search,
                      mode: 'insensitive'
                    }
                  }
                }];
              }
              _context7.next = 13;
              return prisma.vehicle.count({
                where: whereClause
              });
            case 13:
              totalCount = _context7.sent;
              _context7.next = 16;
              return prisma.vehicle.findMany({
                where: whereClause,
                skip: pagination.skip || 0,
                take: pagination.take || 10,
                orderBy: filters.sortBy ? _defineProperty({}, filters.sortBy, filters.sortOrder || 'desc') : {
                  createdAt: 'desc'
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      fullName: true,
                      phoneNumber: true
                    }
                  },
                  trackingDevices: {
                    where: {
                      deletedAt: null
                    },
                    select: {
                      id: true,
                      serialNumber: true,
                      model: true,
                      status: true,
                      batteryLevel: true
                    }
                  },
                  _count: {
                    select: {
                      // emissionData: true,
                      fuelData: true,
                      gpsData: true,
                      alerts: true
                    }
                  }
                }
              });
            case 16:
              vehicles = _context7.sent;
              meta = pagination.buildMeta ? pagination.buildMeta(totalCount) : {
                pagination: {
                  currentPage: Math.floor((pagination.skip || 0) / (pagination.take || 10)) + 1,
                  totalPages: Math.ceil(totalCount / (pagination.take || 10)),
                  totalCount: totalCount,
                  limit: pagination.take || 10
                },
                filters: filters
              };
              return _context7.abrupt("return", {
                data: vehicles,
                meta: meta
              });
            case 21:
              _context7.prev = 21;
              _context7.t0 = _context7["catch"](2);
              console.error('Error fetching vehicles with advanced filters:', _context7.t0);
              throw new _globaleerorshandling.AppError('Failed to fetch vehicles', 500);
            case 25:
            case "end":
              return _context7.stop();
          }
        }, _callee7, null, [[2, 21]]);
      }));
      function getVehiclesWithAdvancedFilters() {
        return _getVehiclesWithAdvancedFilters.apply(this, arguments);
      }
      return getVehiclesWithAdvancedFilters;
    }()
    /**
     * Get vehicle statistics
     * @returns {Promise<Object>} - Vehicle statistics
     */
    )
  }, {
    key: "getVehicleStatistics",
    value: (function () {
      var _getVehicleStatistics = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        var _yield$Promise$all, _yield$Promise$all2, totalVehicles, activeVehicles, vehiclesByType, vehiclesByFuelType, vehiclesByEmissionStatus, recentVehicles;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return Promise.all([prisma.vehicle.count({
                where: {
                  deletedAt: null
                }
              }), prisma.vehicle.count({
                where: {
                  status: 'ACTIVE',
                  deletedAt: null
                }
              }), prisma.vehicle.groupBy({
                by: ['vehicleType'],
                _count: {
                  vehicleType: true
                },
                where: {
                  deletedAt: null
                }
              }), prisma.vehicle.groupBy({
                by: ['fuelType'],
                _count: {
                  fuelType: true
                },
                where: {
                  deletedAt: null
                }
              }), prisma.vehicle.groupBy({
                by: ['emissionStatus'],
                _count: {
                  emissionStatus: true
                },
                where: {
                  deletedAt: null
                }
              }), prisma.vehicle.count({
                where: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  },
                  // Last 30 days
                  deletedAt: null
                }
              })]);
            case 3:
              _yield$Promise$all = _context8.sent;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 6);
              totalVehicles = _yield$Promise$all2[0];
              activeVehicles = _yield$Promise$all2[1];
              vehiclesByType = _yield$Promise$all2[2];
              vehiclesByFuelType = _yield$Promise$all2[3];
              vehiclesByEmissionStatus = _yield$Promise$all2[4];
              recentVehicles = _yield$Promise$all2[5];
              return _context8.abrupt("return", {
                totalVehicles: totalVehicles,
                activeVehicles: activeVehicles,
                inactiveVehicles: totalVehicles - activeVehicles,
                recentVehicles: recentVehicles,
                breakdown: {
                  byType: vehiclesByType.reduce(function (acc, item) {
                    acc[item.vehicleType] = item._count.vehicleType;
                    return acc;
                  }, {}),
                  byFuelType: vehiclesByFuelType.reduce(function (acc, item) {
                    acc[item.fuelType] = item._count.fuelType;
                    return acc;
                  }, {}),
                  byEmissionStatus: vehiclesByEmissionStatus.reduce(function (acc, item) {
                    acc[item.emissionStatus] = item._count.emissionStatus;
                    return acc;
                  }, {})
                }
              });
            case 14:
              _context8.prev = 14;
              _context8.t0 = _context8["catch"](0);
              console.error('Error fetching vehicle statistics:', _context8.t0);
              throw new _globaleerorshandling.AppError('Failed to fetch vehicle statistics', 500);
            case 18:
            case "end":
              return _context8.stop();
          }
        }, _callee8, null, [[0, 14]]);
      }));
      function getVehicleStatistics() {
        return _getVehicleStatistics.apply(this, arguments);
      }
      return getVehicleStatistics;
    }())
  }]);
}();