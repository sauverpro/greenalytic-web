"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = void 0;
var errorHandler = exports.errorHandler = function errorHandler(res, error) {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "An error occurred while processing your request",
    error: process.env.NODE_ENV === "development" ? error.message : undefined
  });
};