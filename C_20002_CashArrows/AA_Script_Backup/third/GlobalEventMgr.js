let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "421faFAuXpBT6lyRcsCuU8f", "GlobalEventMgr");
var n = __extends,
a = __spreadArrays;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = function(e) {
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.event = new cc.EventTarget();
    return t;
  }
  n(t, e);
  t.prototype.on = function(e, t, i, n) {
    void 0 === n&& (n = ! 1);
    this.event.on(e, t, i, n);
  }
;
  t.prototype.once = function(e, t, i) {
    this.event.once(e, t, i);
  }
;
  t.prototype.off = function(e, t, i) {
    this.event.off(e, t, i);
  }
;
  t.prototype.targetOff = function(e) {
    this.event.targetOff(e);
  }
;
  t.prototype.emit = function(e) {
    for(var t, i = [], n = 1;
    n < arguments.length;
    n++) i[n- 1] = arguments[n];
(t = this.event).emit.apply(t, a([e], i));
  }
;
  return t;
}
(e("Singleton").default);
i.default = o;
cc._RF.pop();
