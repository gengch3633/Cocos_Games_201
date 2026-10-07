let e = require;
let t = module;
"use strict";
cc._RF.push(t, "9673byYhzlAVqiVRAbBIuJP", "node-mem-pool");
var i,
n = e("mem-pool"),
a = function(e) {
  n.call(this, e);
}
;
(i = function() {
}
).prototype = n.prototype;
var o = a.prototype = new i();
o._initNative = function() {
  this._nativeMemPool = new renderer.NodeMemPool();
}
;
o._destroyUnit = function(e) {
  n.prototype._destroyUnit.call(this, e);
}
;
t.exports = a;
cc._RF.pop();
