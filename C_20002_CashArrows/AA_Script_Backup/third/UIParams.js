let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "a49ecL5bxdBY5mAcTeOn9nH", "UIParams");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
i.UIParams = void 0;
var o = e(UIMgr "
} ].js), r = e(" ClickAudio "), s = cc._decorator, l = s.ccclass, c = s.menu;
s.property;
var u = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isInit = !1;
t._config = null;
t.maskNode = null;
t.runingAnim = !1;
return t;
}
var i;
n(t, e);
i = t;
t.parse = function(e, t, n) {
var a;
void 0 === n && (n = void 0);
var o = null == e ? void 0 : e.getComponent(i);
return null !== (a = null == o ? void 0 : o.parse(t, n)) && void 0 !== a ? a : n;
};
t.prototype.parse = function(e, t) {
void 0 === t && (t = void 0);
var i = null == this ? void 0 : this.params;
return i && (null == i ? void 0 : i.length) > e ? i[e] : t;
};
Object.defineProperty(t.prototype, " params ", {
get: function() {
return this._params;
},
set: function(e) {
var t;
this._params = e;
null === (t = this.node) || void 0 === t || t.emit(i.EventType.CHANGE, e);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, " config ", {
get: function() {
return this._config;
},
enumerable: !1,
configurable: !0
});
t.prototype.init = function(e, t, i) {
this._config = e;
this.params = t;
this.runingAnim = !0;
if (!this.isInit) {
this.initMask();
r.default.addClickAudio(this.node);
}
this.isInit = !0;
if (this.config.hasMask && this.maskNode) {
this.maskNode.active = !0;
this.maskNode.setSiblingIndex(i - 1);
}
};
t.prototype.initMask = function() {
var e, t, n, a = this;
(null !== (e = this.getComponent(cc.BlockInputEvents)) && void 0 !== e ? e : this.addComponent(cc.BlockInputEvents)).enabled = this.config.blockInputEvents;
if (this.config.hasMask) {
var r = null !== (n = null !== (t = this.node.parent) && void 0 !== t ? t : o.default.getInstance().getLayerNode(this.config.layerName)) && void 0 !== n ? n : o.default.getInstance().getDefaultLayerNode();
this.maskNode = this.createMaskNode();
this.maskNode.color = this.config.maskColor;
this.maskNode.opacity = this.config.maskOpacity;
this.maskNode.parent = r;
this.config.maskBlockInputEvents && this.maskNode.addComponent(cc.BlockInputEvents);
this.maskNode.on(cc.Node.EventType.TOUCH_END, function() {
var e;
null === (e = a.node) || void 0 === e || e.emit(i.EventType.CLICK_MASK);
a.config.maskClickHide && !a.runingAnim && o.default.getInstance().hide(a.node);
}, this);
this.node.on(o.default.EventType.HIDE, function() {
a.maskNode && (a.maskNode.active = !1);
}, this);
}
};
t.prototype.createMaskNode = function() {
var e = new cc.Node(this.node.name + " _mask ");
e.group = this.node.group;
e.width = cc.winSize.width;
e.height = cc.winSize.height;
var t = e.addComponent(cc.Widget);
t.isAlignTop = t.isAlignBottom = t.isAlignLeft = t.isAlignRight = !0;
t.top = t.bottom = t.left = t.right = 0;
t.target = cc.Canvas.instance.node;
t.alignMode = cc.Widget.AlignMode.ALWAYS;
var i = new cc.Texture2D();
i.initWithData(new Uint8Array([ 0, 0, 0 ]), cc.Texture2D.PixelFormat.RGB888, 1, 1);
var n = new cc.SpriteFrame(i);
e.addComponent(cc.Sprite).spriteFrame = n;
return e;
};
t.prototype.onDestroy = function() {
var e;
null === (e = this.maskNode) || void 0 === e || e.destroy();
};
t.EventType = {
CHANGE: " UIParams_Event_Change ",
CLICK_MASK: " UIParams_Event_Click_Mask "
};
return i = a([ l, c(" UI/ Cocos/ UIParams ") ], t);
}(cc.Component);
i.UIParams = u;
cc._RF.pop();
