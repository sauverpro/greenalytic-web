"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _isadmin = require("./isadmin.js");
Object.keys(_isadmin).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _isadmin[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _isadmin[key];
    }
  });
});