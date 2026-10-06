UIAnimation: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2fddec1fzhGQ7rEs9Gsq+IX", "UIAnimation");
var n, a, o, r = __extends, s = __decorate;
Object.defineProperty(i, "__esModule", {
value: !0
});
i.AnimationAppearanceType = i.AnimationType = i.Direction = void 0;
(function(e) {
e[e.UP = 1] = "UP";
e[e.Down = 2] = "Down";
e[e.Left = 3] = "Left";
e[e.Right = 4] = "Right";
})(n = i.Direction || (i.Direction = {}));
(function(e) {
e[e.Move = 0] = "Move";
e[e.Opacity = 1] = "Opacity";
e[e.Scale = 2] = "Scale";
})(a = i.AnimationType || (i.AnimationType = {}));
(function(e) {
e[e.Both = 0] = "Both";
e[e.Show = 1] = "Show";
e[e.Hide = 2] = "Hide";
})(o = i.AnimationAppearanceType || (i.AnimationAppearanceType = {}));
var l = cc._decorator, c = l.ccclass, u = l.property, d = l.menu, h = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.appearanceType = o.Both;
t.duration = .25;
t.delay = 0;
t.inEasing = "backOut";
t.outEasing = "backIn";
t.target = null;
t.type = a.Scale;
t.direction = n.Down;
t.opacity = 255;
t.initOpacity = 0;
t.scale = 1;
t.initScale = 0;
t.tween = null;
return t;
}
var i;
r(t, e);
i = t;
Object.defineProperty(t.prototype, "isShowAnim", {
get: function() {
return this.appearanceType == o.Both || this.appearanceType == o.Show;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "isHideAnim", {
get: function() {
return this.appearanceType == o.Both || this.appearanceType == o.Hide;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "realTarget", {
get: function() {
var e;
return null !== (e = this.target) && void 0 !== e ? e : this.node;
},
enumerable: !1,
configurable: !0
});
t.prototype.getTween = function(e) {
var t, i = null;
if (this.type == a.Move) {
var o, r = 0, s = 0;
if (e) {
(o = this.realTarget.getComponent(cc.Widget)) && (o.updateAlignment(), o.enabled = !1);
r = this.realTarget.x;
s = this.realTarget.y;
this.direction == n.UP ? this.realTarget.y = cc.winSize.height : this.direction == n.Down ? this.realTarget.y = -cc.winSize.height : this.direction == n.Left ? this.realTarget.x = -cc.winSize.width : this.realTarget.x = cc.winSize.width;
} else {
(o = this.realTarget.getComponent(cc.Widget)) && (o.enabled = !1);
r = this.realTarget.x;
s = this.realTarget.y;
this.direction == n.UP ? s = cc.winSize.height : this.direction == n.Down ? s = -cc.winSize.height : r = this.direction == n.Left ? -cc.winSize.width : cc.winSize.width;
}
i = {
x: r,
y: s
};
} else if (this.type == a.Opacity) {
this.realTarget.opacity = e ? this.initOpacity : this.opacity;
i = {
opacity: e ? this.opacity : this.initOpacity
};
} else {
this.realTarget.scale = e ? this.initScale : this.scale;
i = {
scale: e ? this.scale : this.initScale
};
}
null === (t = this.tween) || void 0 === t || t.stop();
var l = null, c = e ? this.inEasing : this.outEasing;
c && (l = {
easing: c
});
this.tween = cc.tween(this.realTarget).delay(this.delay).to(this.duration, i, l);
return this.tween;
};
t.prototype.show = function() {
var e = this;
return new Promise(function(t) {
var n;
null === (n = e.node) || void 0 === n || n.emit(i.EventType.START, !0);
e.getTween(!0).call(function() {
var n;
if (e.type == a.Move) {
var o = e.realTarget.getComponent(cc.Widget);
if (o) {
o.enabled = !0;
o.updateAlignment();
}
}
null === (n = e.node) || void 0 === n || n.emit(i.EventType.END, !0);
t();
}).start();
});
};
t.prototype.hide = function() {
var e = this;
return new Promise(function(t) {
var n;
null === (n = e.node) || void 0 === n || n.emit(i.EventType.START, !1);
e.getTween(!1).call(function() {
var n;
null === (n = e.node) || void 0 === n || n.emit(i.EventType.END, !1);
t();
}).start();
});
};
t.prototype.stop = function() {
var e;
null === (e = this.tween) || void 0 === e || e.stop();
};
t.EventType = {
START: "UIAnimation_Start",
END: "UIAnimation_End"
};
s([ u({
tooltip: "出场类型",
type: cc.Enum(o)
}) ], t.prototype, "appearanceType", void 0);
s([ u({
tooltip: "动画时间"
}) ], t.prototype, "duration", void 0);
s([ u({
tooltip: "延迟时间"
}) ], t.prototype, "delay", void 0);
s([ u({
tooltip: "进入缓动曲线"
}) ], t.prototype, "inEasing", void 0);
s([ u({
tooltip: "出去缓动曲线"
}) ], t.prototype, "outEasing", void 0);
s([ u({
type: cc.Node,
tooltip: "目标"
}) ], t.prototype, "target", void 0);
s([ u({
type: cc.Enum(a),
tooltip: "动画类型"
}) ], t.prototype, "type", void 0);
s([ u({
tooltip: "移动方向",
type: cc.Enum(n),
visible: function() {
return this.type == a.Move;
}
}) ], t.prototype, "direction", void 0);
s([ u({
tooltip: "目标透明度",
visible: function() {
return this.type == a.Opacity;
}
}) ], t.prototype, "opacity", void 0);
s([ u({
tooltip: "初始透明度",
visible: function() {
return this.type == a.Opacity;
}
}) ], t.prototype, "initOpacity", void 0);
s([ u({
tooltip: "目标缩放",
visible: function() {
return this.type == a.Scale;
}
}) ], t.prototype, "scale", void 0);
s([ u({
tooltip: "初始缩放",
visible: function() {
return this.type == a.Scale;
}
}) ], t.prototype, "initScale", void 0);
return i = s([ c, d("UI/Cocos/UIAnimation") ], t);
}(cc.Component);
i.default = h;
cc._RF.pop();
}