"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserService = exports.suspendUserService = exports.hardDeleteUserService = exports.getUsersByRoleService = exports.getUserVehiclesService = exports.getUserDevicesService = exports.getUserByIdService = exports.getAllUsersService = exports.deleteUserService = exports.createUserService = exports.approveUserService = void 0;
var _prismaClient = _interopRequireDefault(require("../../prismaClient.js"));
var _passwordfunctions = require("../utils/passwordfunctions.js");
var _excluded = ["vehicles", "trackingDevices", "alerts", "reports"],
  _excluded2 = ["password", "verified", "otp", "otpExpiresAt", "token"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var createUserService = exports.createUserService = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(userData) {
    var existingUser, hashedPassword, newUser;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          console.log("Creating user:", userData);
          _context.prev = 1;
          _context.next = 4;
          return _prismaClient["default"].user.findFirst({
            where: {
              email: userData.email
            }
          });
        case 4:
          existingUser = _context.sent;
          if (!existingUser) {
            _context.next = 7;
            break;
          }
          return _context.abrupt("return", {
            success: false,
            message: "Email is already in use."
          });
        case 7:
          _context.next = 9;
          return (0, _passwordfunctions.passHashing)(userData.password);
        case 9:
          hashedPassword = _context.sent;
          _context.next = 12;
          return _prismaClient["default"].user.create({
            data: _objectSpread(_objectSpread({}, userData), {}, {
              password: hashedPassword,
              status: userData.role === 'ADMIN' ? 'ACTIVE' : 'PENDING_APPROVAL',
              language: userData.language || 'English',
              notificationPreference: userData.notificationPreference || 'Email'
            })
          });
        case 12:
          newUser = _context.sent;
          return _context.abrupt("return", {
            success: true,
            user: _objectSpread(_objectSpread({}, newUser), {}, {
              password: undefined // Don't return password
            })
          });
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](1);
          console.error("Error creating user:", _context.t0);
          return _context.abrupt("return", {
            success: false,
            message: "Error creating user, please try again."
          });
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 16]]);
  }));
  return function createUserService(_x) {
    return _ref.apply(this, arguments);
  };
}();
var getAllUsersService = exports.getAllUsersService = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(page, limit) {
    var filters,
      whereClause,
      totalItems,
      totalPages,
      users,
      _args2 = arguments;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          filters = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
          _context2.prev = 1;
          whereClause = {
            deletedAt: null
          };
          if (filters.role) {
            whereClause.role = filters.role;
          }
          if (filters.status) {
            whereClause.status = filters.status;
          }
          if (filters.companyName) {
            whereClause.companyName = {
              contains: filters.companyName,
              mode: 'insensitive'
            };
          }
          _context2.next = 8;
          return _prismaClient["default"].user.count({
            where: whereClause
          });
        case 8:
          totalItems = _context2.sent;
          totalPages = Math.ceil(totalItems / limit);
          _context2.next = 12;
          return _prismaClient["default"].user.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            select: {
              id: true,
              username: true,
              email: true,
              image: true,
              
              role: true,
              status: true,
              phoneNumber: true,
              verified: true,
              companyName: true,
              businessSector: true,
              fleetSize: true,
              language: true,
              createdAt: true,
              updatedAt: true,
              vehicles: {
                select: {
                  id: true,
                  plateNumber: true,
                  vehicleModel: true,
                  vehicleType: true,
                  status: true,
                  fuelType: true
                }
              },
              trackingDevices: {
                select: {
                  id: true,
                  serialNumber: true,
                  model: true,
                  type: true,
                  deviceCategory: true,
                  status: true,
                  isActive: true,
                  installationDate: true
                }
              },
              alerts: {
                where: {
                  isRead: false // Only show unread alerts
                },
                select: {
                  id: true,
                  type: true,
                  title: true,
                  createdAt: true
                },
                take: 5,
                // Latest 5 alerts
                orderBy: {
                  createdAt: 'desc'
                }
              },
              _count: {
                select: {
                  vehicles: true,
                  trackingDevices: true,
                  alerts: {
                    where: {
                      isRead: false
                    }
                  }
                }
              }
            }
          });
        case 12:
          users = _context2.sent;
          return _context2.abrupt("return", {
            success: true,
            users: users,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              remainingItems: Math.max(0, totalItems - page * limit),
              totalItems: totalItems,
              limit: limit
            }
          });
        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          console.error("Error retrieving users:", _context2.t0);
          return _context2.abrupt("return", {
            success: false,
            message: "Error retrieving users, please try again."
          });
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 16]]);
  }));
  return function getAllUsersService(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var getUserByIdService = exports.getUserByIdService = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(id) {
    var user, totalEmissions, totalFuelData, totalGpsData, totalOBDData, deviceCounts, deviceStatusCounts, vehicleStatusCounts, userWithCounts;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return _prismaClient["default"].user.findUnique({
            where: {
              id: Number(id)
            },
            select: {
              id: true,
              username: true,
              email: true,
              image: true,
              
              nationalId: true,
              gender: true,
              role: true,
              status: true,
              phoneNumber: true,
              verified: true,
              companyName: true,
              companyRegistrationNumber: true,
              businessSector: true,
              fleetSize: true,
              language: true,
              notificationPreference: true,
              createdAt: true,
              updatedAt: true,
              vehicles: {
                select: {
                  id: true,
                  plateNumber: true,
                  registrationNumber: true,
                  vehicleModel: true,
                  vehicleType: true,
                  fuelType: true,
                  status: true,
                  yearOfManufacture: true,
                  lastMaintenanceDate: true,
                  _count: {
                    select: {
                      emissionData: true,
                      fuelData: true,
                      gpsData: true,
                      obdData: true,
                      alerts: {
                        where: {
                          isRead: false
                        }
                      }
                    }
                  }
                }
              },
              trackingDevices: {
                select: {
                  id: true,
                  serialNumber: true,
                  plateNumber: true,
                  model: true,
                  type: true,
                  deviceCategory: true,
                  firmwareVersion: true,
                  installationDate: true,
                  communicationProtocol: true,
                  status: true,
                  isActive: true,
                  lastPing: true,
                  enableOBDMonitoring: true,
                  enableGPSTracking: true,
                  enableEmissionMonitoring: true,
                  _count: {
                    select: {
                      emissionData: true,
                      fuelData: true,
                      gpsData: true,
                      obdData: true
                    }
                  }
                }
              },
              alerts: {
                select: {
                  id: true,
                  type: true,
                  title: true,
                  message: true,
                  isRead: true,
                  triggerValue: true,
                  triggerThreshold: true,
                  createdAt: true,
                  vehicle: {
                    select: {
                      plateNumber: true,
                      vehicleModel: true
                    }
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 20
              },
              reports: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  format: true,
                  createdAt: true
                },
                orderBy: {
                  createdAt: 'desc'
                },
                take: 10
              },
              _count: {
                select: {
                  vehicles: true,
                  trackingDevices: true,
                  alerts: {
                    where: {
                      isRead: false
                    }
                  },
                  reports: true
                }
              }
            }
          });
        case 3:
          user = _context3.sent;
          if (user) {
            _context3.next = 6;
            break;
          }
          return _context3.abrupt("return", {
            success: false,
            message: "User not found"
          });
        case 6:
          // Analytics
          totalEmissions = 0;
          totalFuelData = 0;
          totalGpsData = 0;
          totalOBDData = 0;
          deviceCounts = {
            motorcycle: 0,
            car: 0,
            truck: 0,
            tricycle: 0,
            other: 0,
            total: user.trackingDevices.length,
            online: 0,
            offline: 0
          };
          deviceStatusCounts = {
            active: 0,
            inactive: 0,
            pending: 0,
            disconnected: 0,
            maintenance: 0
          };
          user.trackingDevices.forEach(function (device) {
            totalEmissions += device._count.emissionData;
            totalFuelData += device._count.fuelData;
            totalGpsData += device._count.gpsData;
            totalOBDData += device._count.obdData;
            var category = device.deviceCategory.toLowerCase();
            if (deviceCounts.hasOwnProperty(category)) {
              deviceCounts[category]++;
            }
            var status = device.status.toLowerCase();
            if (deviceStatusCounts.hasOwnProperty(status)) {
              deviceStatusCounts[status]++;
            }
            var fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (device.lastPing && new Date(device.lastPing) > fiveMinutesAgo) {
              deviceCounts.online++;
            } else {
              deviceCounts.offline++;
            }
          });
          user.vehicles.forEach(function (vehicle) {
            totalEmissions += vehicle._count.emissionData;
            totalFuelData += vehicle._count.fuelData;
            totalGpsData += vehicle._count.gpsData;
            totalOBDData += vehicle._count.obdData;
          });
          vehicleStatusCounts = {
            normalEmission: 0,
            topPolluting: 0,
            inactiveDisconnected: 0,
            underMaintenance: 0
          };
          user.vehicles.forEach(function (vehicle) {
            var status = vehicle.status.toLowerCase().replace('_', '');
            if (status === 'normalemission') vehicleStatusCounts.normalEmission++;else if (status === 'toppolluting') vehicleStatusCounts.topPolluting++;else if (status === 'inactivedisconnected') vehicleStatusCounts.inactiveDisconnected++;else if (status === 'undermaintenance') vehicleStatusCounts.underMaintenance++;
          });
          userWithCounts = _objectSpread(_objectSpread({}, user), {}, {
            analytics: {
              totalEmissions: totalEmissions,
              totalFuelData: totalFuelData,
              totalGpsData: totalGpsData,
              totalOBDData: totalOBDData,
              deviceCounts: deviceCounts,
              deviceStatusCounts: deviceStatusCounts,
              vehicleStatusCounts: vehicleStatusCounts,
              unreadAlerts: user._count.alerts,
              totalReports: user._count.reports
            }
          });
          return _context3.abrupt("return", {
            success: true,
            user: userWithCounts
          });
        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);
          console.error("Error retrieving user:", _context3.t0);
          return _context3.abrupt("return", {
            success: false,
            message: "Error retrieving user, please try again."
          });
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 20]]);
  }));
  return function getUserByIdService(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var updateUserService = exports.updateUserService = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(id, updateData) {
    var vehicles, trackingDevices, alerts, reports, userData, password, verified, otp, otpExpiresAt, token, safeUpdateData, updatedUser;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          vehicles = updateData.vehicles, trackingDevices = updateData.trackingDevices, alerts = updateData.alerts, reports = updateData.reports, userData = _objectWithoutProperties(updateData, _excluded);
          _context4.prev = 1;
          password = userData.password, verified = userData.verified, otp = userData.otp, otpExpiresAt = userData.otpExpiresAt, token = userData.token, safeUpdateData = _objectWithoutProperties(userData, _excluded2);
          _context4.next = 5;
          return _prismaClient["default"].user.update({
            where: {
              id: Number(id)
            },
            data: safeUpdateData,
            select: {
              id: true,
              username: true,
              email: true,
              
              role: true,
              status: true,
              phoneNumber: true,
              companyName: true,
              businessSector: true,
              fleetSize: true,
              language: true,
              notificationPreference: true,
              verified: true,
              updatedAt: true
            }
          });
        case 5:
          updatedUser = _context4.sent;
          return _context4.abrupt("return", {
            success: true,
            message: "User updated successfully",
            user: updatedUser
          });
        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](1);
          console.error("Error updating user:", _context4.t0);
          return _context4.abrupt("return", {
            success: false,
            message: "Error updating user, please try again."
          });
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 9]]);
  }));
  return function updateUserService(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();
var approveUserService = exports.approveUserService = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id, adminId) {
    var updatedUser;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return _prismaClient["default"].user.update({
            where: {
              id: Number(id)
            },
            data: {
              status: 'ACTIVE',
              verified: true,
              updatedAt: new Date()
            }
          });
        case 3:
          updatedUser = _context5.sent;
          console.log("User ".concat(id, " approved by admin ").concat(adminId));
          return _context5.abrupt("return", {
            success: true,
            message: "User approved successfully",
            user: updatedUser
          });
        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.error("Error approving user:", _context5.t0);
          return _context5.abrupt("return", {
            success: false,
            message: "Error approving user, please try again."
          });
        case 12:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 8]]);
  }));
  return function approveUserService(_x7, _x8) {
    return _ref5.apply(this, arguments);
  };
}();
var suspendUserService = exports.suspendUserService = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(id) {
    var reason,
      updatedUser,
      _args6 = arguments;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          reason = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : '';
          _context6.prev = 1;
          _context6.next = 4;
          return _prismaClient["default"].user.update({
            where: {
              id: Number(id)
            },
            data: {
              status: 'SUSPENDED',
              updatedAt: new Date()
            }
          });
        case 4:
          updatedUser = _context6.sent;
          return _context6.abrupt("return", {
            success: true,
            message: "User suspended successfully",
            user: updatedUser
          });
        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](1);
          console.error("Error suspending user:", _context6.t0);
          return _context6.abrupt("return", {
            success: false,
            message: "Error suspending user, please try again."
          });
        case 12:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 8]]);
  }));
  return function suspendUserService(_x9) {
    return _ref6.apply(this, arguments);
  };
}();
var deleteUserService = exports.deleteUserService = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id) {
    var deletedUser;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return _prismaClient["default"].user.update({
            where: {
              id: Number(id)
            },
            data: {
              deletedAt: new Date(),
              status: 'DEACTIVATED' // Update status
            }
          });
        case 3:
          deletedUser = _context7.sent;
          return _context7.abrupt("return", {
            success: true,
            message: "User deleted successfully",
            user: deletedUser
          });
        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          console.error("Error deleting user:", _context7.t0);
          return _context7.abrupt("return", {
            success: false,
            message: "Error deleting user, please try again."
          });
        case 11:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[0, 7]]);
  }));
  return function deleteUserService(_x10) {
    return _ref7.apply(this, arguments);
  };
}();
var hardDeleteUserService = exports.hardDeleteUserService = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(id) {
    var deletedUser;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return _prismaClient["default"].user["delete"]({
            where: {
              id: Number(id)
            }
          });
        case 3:
          deletedUser = _context8.sent;
          return _context8.abrupt("return", {
            success: true,
            message: "User hard deleted successfully",
            user: deletedUser
          });
        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.error("Error hard deleting user:", _context8.t0);
          return _context8.abrupt("return", {
            success: false,
            message: "Error hard deleting user, please try again."
          });
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 7]]);
  }));
  return function hardDeleteUserService(_x11) {
    return _ref8.apply(this, arguments);
  };
}();
var getUsersByRoleService = exports.getUsersByRoleService = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(role) {
    var users;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return _prismaClient["default"].user.findMany({
            where: {
              role: role,
              deletedAt: null
            },
            select: {
              id: true,
              
              email: true,
              status: true,
              companyName: true,
              _count: {
                select: {
                  vehicles: true,
                  trackingDevices: true
                }
              }
            }
          });
        case 3:
          users = _context9.sent;
          return _context9.abrupt("return", {
            success: true,
            users: users
          });
        case 7:
          _context9.prev = 7;
          _context9.t0 = _context9["catch"](0);
          console.error("Error retrieving users by role:", _context9.t0);
          return _context9.abrupt("return", {
            success: false,
            message: "Error retrieving users by role, please try again."
          });
        case 11:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 7]]);
  }));
  return function getUsersByRoleService(_x12) {
    return _ref9.apply(this, arguments);
  };
}();

// Get users vehicles service
var getUserVehiclesService = exports.getUserVehiclesService = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(userId, page, limit) {
    var totalItems, totalPages, vehicles;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return _prismaClient["default"].vehicle.count({
            where: {
              userId: Number(userId),
              deletedAt: null
            }
          });
        case 3:
          totalItems = _context10.sent;
          totalPages = Math.ceil(totalItems / limit);
          _context10.next = 7;
          return _prismaClient["default"].vehicle.findMany({
            where: {
              userId: Number(userId),
              deletedAt: null
            },
            skip: (page - 1) * limit,
            take: limit,
            select: {
              id: true,
              plateNumber: true,
              vehicleModel: true,
              vehicleType: true,
              fuelType: true,
              status: true,
              yearOfManufacture: true,
              lastMaintenanceDate: true
            }
          });
        case 7:
          vehicles = _context10.sent;
          return _context10.abrupt("return", {
            success: true,
            vehicles: vehicles,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              remainingItems: Math.max(0, totalItems - page * limit),
              totalItems: totalItems,
              limit: limit
            }
          });
        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](0);
          console.error("Error retrieving user vehicles:", _context10.t0);
          return _context10.abrupt("return", {
            success: false,
            message: "Error retrieving user vehicles, please try again."
          });
        case 15:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 11]]);
  }));
  return function getUserVehiclesService(_x13, _x14, _x15) {
    return _ref10.apply(this, arguments);
  };
}();

// Get users tracking devices service
var getUserDevicesService = exports.getUserDevicesService = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(userId, page, limit) {
    var totalItems, totalPages, trackingDevices;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return _prismaClient["default"].trackingDevice.count({
            where: {
              userId: Number(userId),
              deletedAt: null
            }
          });
        case 3:
          totalItems = _context11.sent;
          totalPages = Math.ceil(totalItems / limit);
          _context11.next = 7;
          return _prismaClient["default"].trackingDevice.findMany({
            where: {
              userId: Number(userId),
              deletedAt: null
            },
            skip: (page - 1) * limit,
            take: limit,
            select: {
              id: true,
              serialNumber: true,
              model: true,
              type: true,
              deviceCategory: true,
              status: true,
              isActive: true,
              installationDate: true
            }
          });
        case 7:
          trackingDevices = _context11.sent;
          return _context11.abrupt("return", {
            success: true,
            trackingDevices: trackingDevices,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              remainingItems: Math.max(0, totalItems - page * limit),
              totalItems: totalItems,
              limit: limit
            }
          });
        case 11:
          _context11.prev = 11;
          _context11.t0 = _context11["catch"](0);
          console.error("Error retrieving user tracking devices:", _context11.t0);
          return _context11.abrupt("return", {
            success: false,
            message: "Error retrieving user tracking devices, please try again."
          });
        case 15:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 11]]);
  }));
  return function getUserDevicesService(_x16, _x17, _x18) {
    return _ref11.apply(this, arguments);
  };
}();