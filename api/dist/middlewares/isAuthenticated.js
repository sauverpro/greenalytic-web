"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAuthenticated = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _globaleerorshandling = require("./globaleerorshandling.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var isAuthenticated = exports.isAuthenticated = function isAuthenticated(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return next(new _globaleerorshandling.AppError('Access token required', 401));
  }
  _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return next(new _globaleerorshandling.AppError('Invalid token', 403));
    }
    req.userId = user.id; // ← This sets req.userId
    next();
  });
};