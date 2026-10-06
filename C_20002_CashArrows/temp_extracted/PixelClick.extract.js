PixelClick: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3eed6ABiMtGPKU3e0Yljm1s", "PixelClick");
var n = __extends, a = __decorate;
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("RenderUtils"), r = cc._decorator, s = r.ccclass;
r.property;
var l = r.menu, c = r.requireComponent, u = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._sprite = null;
t.pixelsData = null;
return t;
}
var i;
n(t, e);
i = t;
Object.defineProperty(t.prototype, "sprite", {
get: function() {
this._sprite || (this._sprite = this.node.getComponent(cc.Sprite));
return this._sprite;
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Sprite.EventType.SpriteFrameChanged, this.spriteChange, this);
this.node.on(cc.Sprite.EventType.TrimChanged, this.spriteChange, this);
this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.spriteChange, this);
this.node.on(cc.Node.EventType.SIZE_CHANGED, this.spriteChange, this);
};
t.prototype.spriteChange = function() {
this.pixelsData = o.default.getPixelsData(this.node);
};
t.prototype.onTouchEnd = function(e) {
var t = this.node.convertToNodeSpaceAR(e.getLocation());
this.pixelsData || (this.pixelsData = o.default.getPixelsData(this.node));
var n = t.x + this.node.anchorX * this.node.width, a = -(t.y - this.node.anchorY * this.node.height), r = 4 * this.node.width * Math.floor(a) + 4 * Math.floor(n), s = this.pixelsData.slice(r, r + 4), l = cc.color(s[0], s[1], s[2], s[3]);
if (l.a > 0) {
console.log("click");
this.node.emit(i.EventType.CLICK, e, l);
}
};
t.prototype.clear = function() {
this.pixelsData = null;
};
t.EventType = {
CLICK: "pixelClick"
};
return i = a([ s, l("UI/Cocos/PixelClick"), c(cc.Sprite) ], t);
}(cc.Component);
i.default = u;
cc._RF.pop();
}