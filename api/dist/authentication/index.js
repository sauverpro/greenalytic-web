"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _signup = require("./signup.js");
Object.keys(_signup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _signup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _signup[key];
    }
  });
});
var _login = require("./login.js");
Object.keys(_login).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _login[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _login[key];
    }
  });
});
var _forgetpassword = require("./forgetpassword.js");
Object.keys(_forgetpassword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _forgetpassword[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _forgetpassword[key];
    }
  });
});
var _changepassword = require("./changepassword.js");
Object.keys(_changepassword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _changepassword[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _changepassword[key];
    }
  });
});
var _usersCrud = require("./usersCrud.js");
Object.keys(_usersCrud).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _usersCrud[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _usersCrud[key];
    }
  });
});