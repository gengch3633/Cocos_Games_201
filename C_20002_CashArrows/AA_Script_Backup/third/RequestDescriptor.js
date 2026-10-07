let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "c5af7wpTotP0oHZbMWVtJxU", "RequestDescriptor");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e) {
    this.descriptors = e;
  }
  e.prototype.get = function(e) {
    return this.descriptors[e]|| null;
  }
;
  e.prototype.getUri = function(e) {
    var t = this.get(e);
    return(null == t? void 0: t.uri)|| "";
  }
;
  e.prototype.getUrl = function(e) {
    var t = this.get(e);
    return(null == t? void 0: t.url)|| "";
  }
;
  e.prototype.needEnqueue = function(e) {
    var t = this.get(e);
    return ! !(null == t? void 0: t.enqueue);
  }
;
  return e;
}
();
i.default = n;
cc._RF.pop();
