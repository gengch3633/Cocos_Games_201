let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "2e57eTl/8hMwbCHcrWS4zO/", "StringUtils");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.format = function(e) {
    for(var t = [], i = 1;
    i < arguments.length;
    i++) t[i- 1] = arguments[i];
    return e? e.replace(/ {
(\ d+)
    }
/ g, function(e, i) {
      return void 0 !== t[i]? t[i]: e;
    }
): "";
  }
;
  e.formatObject = function(e, t) {
    return "object" != typeof t|| null === t? e: e.replace(/ {
([^ {
      }
]*)
    }
/ g, function(e, i) {
      return t.hasOwnProperty(i)? t[i]: e;
    }
);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
