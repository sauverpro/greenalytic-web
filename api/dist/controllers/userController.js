"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.suspendUser = exports.signup = exports.getUsersByRole = exports.getUserVehicles = exports.getUserDevices = exports.getUserById = exports.getAllUsers = exports.deleteUserPermanent = exports.deleteUser = exports.approveUser = void 0;
var _globaleerorshandling = require("../middlewares/globaleerorshandling.js");
var userService = _interopRequireWildcard(require("../services/userService.js"));
var _excluded = ["password", "otp", "otpExpiresAt", "token"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// **1️⃣ Create User** - Signup controller function
var signup = exports.signup = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res, next) {
    var _req$body, email, password, username, phoneNumber, fullName, role, companyName, businessSector, fleetSize, language, notificationPreference, emailRegex, validRoles, validLanguages, validPreferences, parsedFleetSize, result;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password, username = _req$body.username, phoneNumber = _req$body.phoneNumber, fullName = _req$body.fullName, role = _req$body.role, companyName = _req$body.companyName, businessSector = _req$body.businessSector, fleetSize = _req$body.fleetSize, language = _req$body.language, notificationPreference = _req$body.notificationPreference; // Validate required fields
          if (!(!email || !password || !phoneNumber)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Please provide all required fields: email, password, and phoneNumber.'
          }));
        case 3:
          // Validate email format
          emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.'
          }));
        case 6:
          if (!role) {
            _context.next = 10;
            break;
          }
          validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
          if (validRoles.includes(role)) {
            _context.next = 10;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid role. Must be one of: ".concat(validRoles.join(', '))
          }));
        case 10:
          if (!language) {
            _context.next = 14;
            break;
          }
          validLanguages = ['English', 'French', 'Kinyarwanda'];
          if (validLanguages.includes(language)) {
            _context.next = 14;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid language. Must be one of: ".concat(validLanguages.join(', '))
          }));
        case 14:
          if (!notificationPreference) {
            _context.next = 18;
            break;
          }
          validPreferences = ['Email', 'SMS', 'WhatsApp'];
          if (validPreferences.includes(notificationPreference)) {
            _context.next = 18;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid notification preference. Must be one of: ".concat(validPreferences.join(', '))
          }));
        case 18:
          if (!(fleetSize !== undefined)) {
            _context.next = 22;
            break;
          }
          parsedFleetSize = parseInt(fleetSize, 10);
          if (!(isNaN(parsedFleetSize) || parsedFleetSize < 0)) {
            _context.next = 22;
            break;
          }
          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'Fleet size must be a non-negative number.'
          }));
        case 22:
          _context.next = 24;
          return userService.createUserService(req.body);
        case 24:
          result = _context.sent;
          if (result.success) {
            _context.next = 27;
            break;
          }
          return _context.abrupt("return", res.status(400).json(result));
        case 27:
          return _context.abrupt("return", res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userInformation: {
              id: result.user.id,
              email: result.user.email,
              username: result.user.username,
              fullName: result.user.fullName,
              phoneNumber: result.user.phoneNumber,
              role: result.user.role,
              status: result.user.status,
              companyName: result.user.companyName,
              businessSector: result.user.businessSector,
              fleetSize: result.user.fleetSize,
              language: result.user.language,
              notificationPreference: result.user.notificationPreference,
              verified: result.user.verified
            }
          }));
        case 28:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

// **2️⃣ Get All Users** - Retrieve all users with pagination and filtering
var getAllUsers = exports.getAllUsers = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var _req$pagination, page, limit, _req$query, role, status, companyName, businessSector, filters, validRoles, validStatuses, usersData;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _req$pagination = req.pagination, page = _req$pagination.page, limit = _req$pagination.limit;
          _req$query = req.query, role = _req$query.role, status = _req$query.status, companyName = _req$query.companyName, businessSector = _req$query.businessSector; // Build filters
          filters = {}; // Validate and add role filter
          if (!role) {
            _context2.next = 8;
            break;
          }
          validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
          if (validRoles.includes(role)) {
            _context2.next = 7;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid role filter. Must be one of: ".concat(validRoles.join(', '))
          }));
        case 7:
          filters.role = role;
        case 8:
          if (!status) {
            _context2.next = 13;
            break;
          }
          validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
          if (validStatuses.includes(status)) {
            _context2.next = 12;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status filter. Must be one of: ".concat(validStatuses.join(', '))
          }));
        case 12:
          filters.status = status;
        case 13:
          // Add company name filter
          if (companyName) {
            filters.companyName = companyName;
          }

          // Add business sector filter
          if (businessSector) {
            filters.businessSector = businessSector;
          }
          _context2.next = 17;
          return userService.getAllUsersService(page, limit, filters);
        case 17:
          usersData = _context2.sent;
          return _context2.abrupt("return", res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: usersData.users,
            meta: usersData.pagination
          }));
        case 19:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}());

// **3️⃣ Get User By ID** - Retrieve a user by ID
var getUserById = exports.getUserById = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, parsedUserId, result;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 4:
          _context3.next = 6;
          return userService.getUserByIdService(parsedUserId);
        case 6:
          result = _context3.sent;
          if (result.success) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(404).json(result));
        case 9:
          return _context3.abrupt("return", res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: result.user
          }));
        case 10:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());

// **4️⃣ Update User** - Update user details
var updateUser = exports.updateUser = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var id, updateData, parsedUserId, password, otp, otpExpiresAt, token, safeUpdateData, validRoles, validStatuses, validLanguages, validPreferences, parsedFleetSize, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          updateData = req.body; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context4.next = 5;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 5:
          // Exclude sensitive fields from update
          password = updateData.password, otp = updateData.otp, otpExpiresAt = updateData.otpExpiresAt, token = updateData.token, safeUpdateData = _objectWithoutProperties(updateData, _excluded); // Validate role if being updated
          if (!safeUpdateData.role) {
            _context4.next = 10;
            break;
          }
          validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
          if (validRoles.includes(safeUpdateData.role)) {
            _context4.next = 10;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid role. Must be one of: ".concat(validRoles.join(', '))
          }));
        case 10:
          if (!safeUpdateData.status) {
            _context4.next = 14;
            break;
          }
          validStatuses = ['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'DEACTIVATED'];
          if (validStatuses.includes(safeUpdateData.status)) {
            _context4.next = 14;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid status. Must be one of: ".concat(validStatuses.join(', '))
          }));
        case 14:
          if (!safeUpdateData.language) {
            _context4.next = 18;
            break;
          }
          validLanguages = ['English', 'French', 'Kinyarwanda'];
          if (validLanguages.includes(safeUpdateData.language)) {
            _context4.next = 18;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid language. Must be one of: ".concat(validLanguages.join(', '))
          }));
        case 18:
          if (!safeUpdateData.notificationPreference) {
            _context4.next = 22;
            break;
          }
          validPreferences = ['Email', 'SMS', 'WhatsApp'];
          if (validPreferences.includes(safeUpdateData.notificationPreference)) {
            _context4.next = 22;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid notification preference. Must be one of: ".concat(validPreferences.join(', '))
          }));
        case 22:
          if (!(safeUpdateData.fleetSize !== undefined)) {
            _context4.next = 27;
            break;
          }
          parsedFleetSize = parseInt(safeUpdateData.fleetSize, 10);
          if (!(isNaN(parsedFleetSize) || parsedFleetSize < 0)) {
            _context4.next = 26;
            break;
          }
          return _context4.abrupt("return", res.status(400).json({
            success: false,
            message: 'Fleet size must be a non-negative number.'
          }));
        case 26:
          safeUpdateData.fleetSize = parsedFleetSize;
        case 27:
          _context4.next = 29;
          return userService.updateUserService(parsedUserId, safeUpdateData);
        case 29:
          result = _context4.sent;
          if (result.success) {
            _context4.next = 32;
            break;
          }
          return _context4.abrupt("return", res.status(400).json(result));
        case 32:
          return _context4.abrupt("return", res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: result.user
          }));
        case 33:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function (_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}());

// **5️⃣ Delete User (Soft Delete)** - Soft delete a user
var deleteUser = exports.deleteUser = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, parsedUserId, result;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 4:
          _context5.next = 6;
          return userService.deleteUserService(parsedUserId);
        case 6:
          result = _context5.sent;
          if (result.success) {
            _context5.next = 9;
            break;
          }
          return _context5.abrupt("return", res.status(404).json(result));
        case 9:
          return _context5.abrupt("return", res.status(200).json({
            success: true,
            message: 'User deleted successfully (soft delete)'
          }));
        case 10:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function (_x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}());

// Delete User (Hard Delete) - Uncomment if needed
var deleteUserPermanent = exports.deleteUserPermanent = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var id, parsedUserId, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context6.next = 4;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 4:
          _context6.next = 6;
          return userService.hardDeleteUserService(parsedUserId);
        case 6:
          result = _context6.sent;
          if (result.success) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.status(404).json(result));
        case 9:
          return _context6.abrupt("return", res.status(200).json({
            success: true,
            message: 'User deleted successfully (hard delete)'
          }));
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function (_x12, _x13) {
    return _ref6.apply(this, arguments);
  };
}());

// **6️⃣ Approve User** - Admin approval workflow
var approveUser = exports.approveUser = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id, adminId, parsedUserId, parsedAdminId, result;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          adminId = req.body.adminId; // Should come from authenticated admin
          // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context7.next = 5;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 5:
          // Validate admin ID
          parsedAdminId = parseInt(adminId, 10);
          if (!isNaN(parsedAdminId)) {
            _context7.next = 8;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid admin ID'
          }));
        case 8:
          _context7.next = 10;
          return userService.approveUserService(parsedUserId, parsedAdminId);
        case 10:
          result = _context7.sent;
          if (result.success) {
            _context7.next = 13;
            break;
          }
          return _context7.abrupt("return", res.status(400).json(result));
        case 13:
          return _context7.abrupt("return", res.status(200).json({
            success: true,
            message: 'User approved successfully',
            data: result.user
          }));
        case 14:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function (_x14, _x15) {
    return _ref7.apply(this, arguments);
  };
}());

// **7️⃣ Suspend User** - User suspension
var suspendUser = exports.suspendUser = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var id, reason, parsedUserId, result;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          id = req.params.id;
          reason = req.body.reason; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context8.next = 5;
            break;
          }
          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 5:
          _context8.next = 7;
          return userService.suspendUserService(parsedUserId, reason);
        case 7:
          result = _context8.sent;
          if (result.success) {
            _context8.next = 10;
            break;
          }
          return _context8.abrupt("return", res.status(400).json(result));
        case 10:
          return _context8.abrupt("return", res.status(200).json({
            success: true,
            message: 'User suspended successfully',
            data: result.user
          }));
        case 11:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function (_x16, _x17) {
    return _ref8.apply(this, arguments);
  };
}());

// **8️⃣ Get Users by Role** - Helper function for admin dashboard
var getUsersByRole = exports.getUsersByRole = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var role, validRoles, result;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          role = req.params.role; // Validate role
          validRoles = ['ADMIN', 'USER', 'FLEET_MANAGER', 'TECHNICIAN', 'ANALYST', 'SUPPORT_AGENT'];
          if (validRoles.includes(role)) {
            _context9.next = 4;
            break;
          }
          return _context9.abrupt("return", res.status(400).json({
            success: false,
            message: "Invalid role. Must be one of: ".concat(validRoles.join(', '))
          }));
        case 4:
          _context9.next = 6;
          return userService.getUsersByRoleService(role);
        case 6:
          result = _context9.sent;
          if (result.success) {
            _context9.next = 9;
            break;
          }
          return _context9.abrupt("return", res.status(400).json(result));
        case 9:
          return _context9.abrupt("return", res.status(200).json({
            success: true,
            message: "".concat(role, " users retrieved successfully"),
            data: result.users
          }));
        case 10:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return function (_x18, _x19) {
    return _ref9.apply(this, arguments);
  };
}());

// **9️⃣ Get User vehicles** - Retrieve user vehicles
var getUserVehicles = exports.getUserVehicles = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var id, parsedUserId, _req$pagination2, page, limit, result;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          id = req.params.id; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context10.next = 4;
            break;
          }
          return _context10.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 4:
          _req$pagination2 = req.pagination, page = _req$pagination2.page, limit = _req$pagination2.limit;
          _context10.next = 7;
          return userService.getUserVehiclesService(parsedUserId, page, limit);
        case 7:
          result = _context10.sent;
          if (result.success) {
            _context10.next = 10;
            break;
          }
          return _context10.abrupt("return", res.status(404).json(result));
        case 10:
          return _context10.abrupt("return", res.status(200).json({
            success: true,
            message: 'User vehicles retrieved successfully',
            data: result.vehicles
          }));
        case 11:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return function (_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}());

// **🔟 Get User devices** - Retrieve devices
var getUserDevices = exports.getUserDevices = (0, _globaleerorshandling.catchAsync)(/*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee11(req, res) {
    var id, parsedUserId, _req$pagination3, page, limit, result;
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          id = req.params.id; // Validate user ID
          parsedUserId = parseInt(id, 10);
          if (!isNaN(parsedUserId)) {
            _context11.next = 4;
            break;
          }
          return _context11.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid user ID'
          }));
        case 4:
          _req$pagination3 = req.pagination, page = _req$pagination3.page, limit = _req$pagination3.limit;
          _context11.next = 7;
          return userService.getUserDevicesService(parsedUserId, page, limit);
        case 7:
          result = _context11.sent;
          if (result.success) {
            _context11.next = 10;
            break;
          }
          return _context11.abrupt("return", res.status(404).json(result));
        case 10:
          return _context11.abrupt("return", res.status(200).json({
            success: true,
            message: 'User devices retrieved successfully',
            data: result.devices
          }));
        case 11:
        case "end":
          return _context11.stop();
      }
    }, _callee11);
  }));
  return function (_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}());