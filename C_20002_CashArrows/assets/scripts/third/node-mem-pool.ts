// @ts-nocheck
import memPool from "./mem-pool";

var i, n = memPool, a = function(e) {
n.call(this, e);
};
(i = function() {}).prototype = n.prototype;
var o = a.prototype = new i();
o._initNative = function() {
this._nativeMemPool = new renderer.NodeMemPool();
};
o._destroyUnit = function(e) {
n.prototype._destroyUnit.call(this, e);
};
export default  a;
