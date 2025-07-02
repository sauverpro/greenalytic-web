"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyingtoken = exports.tokengenerating = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Validate JWT configuration on startup
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
var tokengenerating = exports.tokengenerating = function tokengenerating(payload) {
  var token = _jsonwebtoken["default"].sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP || '24h'
  });
  return token;
};
var verifyingtoken = exports.verifyingtoken = function verifyingtoken(req, res, next) {
  try {
    var auth = req.headers.authorization;
    var token = auth === null || auth === void 0 ? void 0 : auth.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "no access token provided"
      });
    }
    _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message
        });
      }
      req.userId = decoded.id; // id from payload
      req.userEmail = decoded.email; // email from payload
      req.username = decoded.username; // username from payload
      req.userRole = decoded.role; // role from payload

      next();
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internal server from verify token error: ".concat(err.message)
    });
  }
};