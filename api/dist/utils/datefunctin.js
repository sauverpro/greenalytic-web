"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.todaysdate = exports.formattedDate = void 0;
var date = new Date(); // This gets the current date and time

// Now, format the date as desired
var options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  fractionalSecondDigits: 3,
  // Milliseconds
  hour12: false,
  // Use 24-hour format
  timeZoneName: "short"
};
var todaysdate = exports.todaysdate = date;
var formattedDate = exports.formattedDate = date.toLocaleString("en-US", options);