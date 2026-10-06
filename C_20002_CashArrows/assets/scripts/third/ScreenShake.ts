// @ts-nocheck

const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
var o = cc._decorator, r = o.ccclass;
o.property;
o.inspector;
var s = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.originalPos = new cc.Vec3();
t.shakeIntensity = 10;
t.shakeDuration = .5;
t.shakeCount = 12;
return t;
}
n(t, e);
t.prototype.start = function() {
this.originalPos.set(this.node.position);
};
t.prototype.shake = function() {
cc.Tween.stopAllByTarget(this.node);
this.node.setPosition(this.originalPos);
for (var e = cc.tween(this.node), t = 0; t < this.shakeCount; t++) {
var i = t / this.shakeCount, n = this.shakeIntensity * (1 - i), a = 2 * (Math.random() - .5) * n, o = 2 * (Math.random() - .5) * n;
e = e.to(this.shakeDuration / this.shakeCount, {
position: new cc.Vec3(this.originalPos.x + a, this.originalPos.y + o, this.originalPos.z)
});
}
e.to(.1, {
position: this.originalPos
});
e.start();
};
return a([ r ], t);
}(cc.Component);
export default  s;
