let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "6d30eD7GIJJw7nIgAazuuJT", "AdCallbackParser");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.decode = function(e, t) {
    if(! e) return "";
    try {
      return t(e)|| "";
    } catch(e) {
      return "";
    }
  }
;
  e.parse = function(e, t) {
    var i = this.decode(e, t);
    if(! i) return null;
    try {
      return JSON.parse(i);
    } catch(e) {
      return null;
    }
  }
;
  e.getStructuredContent = function(e, t) {
    var i,
    n = this.parse(e, t);
    return n? null !== (i = n.structuredContentPackage)&& void 0 !== i? i: n: null;
  }
;
  e.getCpmPayload = function(e, t) {
    return this.getStructuredContent(e, t);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
