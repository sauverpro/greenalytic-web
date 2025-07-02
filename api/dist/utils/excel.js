"use strict";

var _xlsx = _interopRequireDefault(require("xlsx"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Sample student data
var students = [{
  firstName: 'John',
  lastName: 'Doe',
  marks: 85,
  email: 'john@example.com',
  remark: 'Good'
}, {
  firstName: 'Alice',
  lastName: 'Smith',
  marks: 72,
  email: 'alice@example.com',
  remark: 'Average'
}, {
  firstName: 'Bob',
  lastName: 'Brown',
  marks: 90,
  email: 'bob@example.com',
  remark: 'Excellent'
}];

// Convert data to worksheet
var worksheet = _xlsx["default"].utils.json_to_sheet(students);

// Create workbook
var workbook = _xlsx["default"].utils.book_new();
_xlsx["default"].utils.book_append_sheet(workbook, worksheet, 'Students');

// Save Excel file
_xlsx["default"].writeFile(workbook, 'students.xlsx');
console.log('✅ Excel file created: students.xlsx');