let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "56794g116BDX6/pTKqCODPR", "ClickAudio");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(AudioMgr "
} ].js), r = cc._decorator, s = r.ccclass, l = r.property, c = r.menu, u = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.successClip = null;
t.failClip = null;
t.audio = !0;
return t;
}
var i;
n(t, e);
i = t;
t.addClickAudio = function(e) {
e.getComponents(cc.Button).concat(e.getComponentsInChildren(cc.Button)).forEach(function(e) {
var t;
return null !== (t = e.getComponent(i)) && void 0 !== t ? t : e.addComponent(i);
});
};
t.prototype.onLoad = function() {
this.getComponent(cc.Button) && this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
};
t.prototype.touchEndHandle = function() {
if (this.enabled) {
var e = this.getComponent(cc.Button);
e && (e.node.hasEventListener(cc.Button.EventType.CLICK) || e.clickEvents.length > 0) && this.play(e.interactable);
}
};
t.prototype.play = function(e) {
void 0 === e && (e = !0);
if (this.audio) {
var t = e ? this.successClip : this.failClip;
t ? o.default.getInstance().playEffect(t) : o.default.getInstance().playClickEff(e);
}
};
a([ l(cc.AudioClip) ], t.prototype, " successClip ", void 0);
a([ l(cc.AudioClip) ], t.prototype, " failClip ", void 0);
a([ l(cc.Boolean) ], t.prototype, " audio ", void 0);
return i = a([ s, c(" UI/ Cocos/ Btn/ ClickAudio ") ], t);
}(cc.Component);
i.default = u;
cc._RF.pop();
