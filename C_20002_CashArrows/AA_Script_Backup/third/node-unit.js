let e = require;
let t = module;
"use strict";
cc._RF.push(t, "52fa5q0VNJBBJhg47C1w0L8", "node-unit");
var i,
n = Float64Array;
Uint32Array;
Uint32Array;
Uint32Array;
Int32Array;
Uint8Array;
Uint8Array;
Uint8Array;
Uint32Array;
var a = e("unit-base"),
o = function(e, t) {
  a.call(this, e, t);
  var i = this._contentNum;
  this.trsList = new n(10* i);
  this.localMatList = new n(16* i);
  this.worldMatList = new n(16* i);
  for(var o = 0;
  o < i;
  o++) {
    var r = this._spacesData[o];
    r.trs = new n(this.trsList.buffer, 80* o, 10);
    r.localMat = new n(this.localMatList.buffer, 128* o, 16);
    r.worldMat = new n(this.worldMatList.buffer, 128* o, 16);
  }
}
;
(i = function() {
}
).prototype = a.prototype;
o.prototype = new i();
t.exports = o;
cc._RF.pop();
