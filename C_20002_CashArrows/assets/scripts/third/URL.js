let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "a21bcl//zBFOqqb4US9V6TN", "URL");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.parse = function(e) {
    for(var t, i = [], n = 1;
    n < arguments.length;
    n++) i[n- 1] = arguments[n];
    var a = (t = [e]).concat.apply(t, i),
    o = a.filter(function(e) {
      return null != e;
    }
).map(function(e) {
      e.startsWith("/")&& (e = e.substring(1));
      e.endsWith("/")&& (e = e.substring(0, e.length- 1));
      return e;
    }
);
    return o.join("/");
  }
;
  e.isHttpUrl = function(e) {
    return e&& (0 == e.indexOf("http://")|| 0 == e.indexOf("https://"));
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
