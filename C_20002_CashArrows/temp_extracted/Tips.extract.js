Tips: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "b9c67zvtGNHuKRqV6BBUgjg", "Tips");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.Position = void 0;
var n, a = e("NodePool"), o = e("ResMgr"), r = e("UIMgr");
(function(e) {
e[e.Center = 0] = "Center";
e[e.Top = 1] = "Top";
e[e.Bottom = 2] = "Bottom";
e[e.BottomLeft = 3] = "BottomLeft";
})(n = i.Position || (i.Position = {}));
var s = {
url: "texture/tip",
bundleName: "cocos-module-common",
fontSize: 30,
lineHeight: 35,
pos: n.Center,
duration: 1,
maxCount: 5,
margin: new cc.Rect(0, 0, 0, 0)
}, l = function() {
function e() {}
e.setGlobalOption = function(t) {
t = Object.assign(s, t);
e.option = t;
o.default.getInstance().loadRes(t.url, cc.SpriteFrame, null, t.bundleName);
};
e.show = function(t, i) {
var n, o;
e.pool || (e.pool = new a.default(e.option.maxCount).setCreateAction(function() {
return e.createTipNode();
}));
var r = null !== (n = null == i ? void 0 : i.duration) && void 0 !== n ? n : e.option.duration, s = null !== (o = null == i ? void 0 : i.pos) && void 0 !== o ? o : e.option.pos, l = function() {
var i = e.pool.get();
if (i) {
e.fillContent(i, t);
e.showContent(i, r, s);
}
}, c = e.pool.getLendArr();
if ((null == c ? void 0 : c.length) >= 1) {
var u = r / 10;
c.forEach(function(e) {
e && e.isValid && cc.isValid(e, !0) && cc.tween(e).by(u, {
y: e.height + 5
}).start();
});
setTimeout(function() {
return l();
}, 1e3 * u);
} else l();
};
e.createTipNode = function() {
var t = new cc.Node("tip").addComponent(cc.Sprite);
t.node.active = !1;
t.sizeMode = cc.Sprite.SizeMode.RAW;
t.type = cc.Sprite.Type.SLICED;
o.default.getInstance().setSpriteFrame(t, e.option.url, e.option.bundleName).then(function() {
var e;
return null === (e = null == t ? void 0 : t.node) || void 0 === e ? void 0 : e.emit("load_complete");
});
var i = new cc.Node("lab").addComponent(cc.Label);
i.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
i.verticalAlign = cc.Label.VerticalAlign.CENTER;
i.fontSize = e.option.fontSize;
i.lineHeight = e.option.lineHeight;
i.enableBold = !0;
t.node.addChild(i.node);
r.default.getInstance().getTopLayerNode().addChild(t.node);
return t.node;
};
e.fillContent = function(t, i) {
var n, a = cc.Canvas.instance.node.width, o = t.getComponentInChildren(cc.Label);
o.string = i;
if (i.length * o.fontSize > 3 * a / 5) {
o.node.width = 3 * a / 5;
o.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
} else {
o.node.width = i.length * o.fontSize;
o.overflow = cc.Label.Overflow.NONE;
}
var r = 1 + ~~(i.length * o.fontSize / (3 * a / 5));
o.node.height = o.fontSize * r;
var s = t.getComponent(cc.Sprite);
if (s) {
var l = function() {
var t, i = null === (t = null == s ? void 0 : s.spriteFrame) || void 0 === t ? void 0 : t.getOriginalSize();
if (i) {
s.sizeMode = cc.Sprite.SizeMode.CUSTOM;
s.node.width = Math.max(i.width, o.node.width + e.option.margin.x + e.option.margin.width);
s.node.height = Math.max(i.height, o.node.height + e.option.margin.y + e.option.margin.height);
}
};
s.spriteFrame ? l() : null === (n = null == s ? void 0 : s.node) || void 0 === n || n.once("load_complete", l, this);
} else console.error("未找到Sprite组件");
};
e.showContent = function(t, i, a) {
cc.Tween.stopAllByTarget(t);
var o = cc.Canvas.instance.node.width, r = cc.Canvas.instance.node.height;
if (a == n.Center) t.x = t.y = 0; else if (a == n.Top) {
t.x = 0;
t.y = r / 6 * 2;
} else if (a == n.Bottom) {
t.x = 0;
t.y = -r / 6 * 2;
} else a == n.BottomLeft && (t.x = -o / 5 * 2, t.y = -r / 5 * 2);
t.zIndex = cc.macro.MAX_ZINDEX;
t.opacity = 127.5;
t.active = !0;
cc.tween(t).to(i / 3, {
opacity: 255
}).delay(i).by(i / 3, {
y: 100,
opacity: -255
}).call(function() {
t.active = !1;
e.pool.put(t);
}).start();
};
e.option = s;
e.pool = null;
return e;
}();
i.default = l;
cc._RF.pop();
}