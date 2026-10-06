// @ts-nocheck

const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
var o = cc._decorator, r = o.ccclass, s = o.property, l = o.menu, c = o.requireComponent, u = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._sprite = null;
t.frames = [];
return t;
}
n(t, e);
Object.defineProperty(t.prototype, "sprite", {
get: function() {
this._sprite || (this._sprite = this.getComponent(cc.Sprite));
return this._sprite;
},
enumerable: !1,
configurable: !0
});
t.prototype.setFrame = function(e) {
var t = this.frames.find(function(t) {
return t.name == e;
});
t && (this.sprite.spriteFrame = t);
};
t.prototype.setFrameByIndex = function(e) {
e >= this.frames.length && (e = this.frames.length - 1);
e < 0 || (this.sprite.spriteFrame = this.frames[e]);
};
t.prototype.getFrameIndex = function() {
var e = this;
return this.frames.findIndex(function(t) {
return e.sprite.spriteFrame == t;
});
};
t.prototype.getFrame = function() {
var e = this;
return this.frames.find(function(t) {
return e.sprite.spriteFrame == t;
});
};
a([ s([ cc.SpriteFrame ]) ], t.prototype, "frames", void 0);
return a([ r, c(cc.Sprite), l("UI/Cocos/SpriteFrames") ], t);
}(cc.Component);
export default  u;
