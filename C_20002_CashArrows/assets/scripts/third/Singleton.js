let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "6f36bbtJPFCDbyLDBShH2gI", "Singleton");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
  }
  e.getInstance = function() {
    this.ins|| (this.ins = new this());
    return this.ins;
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
