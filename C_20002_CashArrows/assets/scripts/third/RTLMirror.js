let e = require;
let t = module;
"use strict";
cc._RF.push(t, "d1d7866R8hNP61VlkqpuHw7", "RTLMirror");
var i = e("GlobalEventMgr"),
n = e(InterfaceMgr "
} ].js), a = e(" LanguageService.js "), o = cc.Class({
extends: cc.Component,
properties: {
flipScaleX: {
default: -1,
tooltip: " RTL 时 scaleX 取该值的相对乘积 ； 通常- 1 即可 （ 水平镜像 ） "
}
},
onLoad: function() {
this._origSign = this.node.scaleX < 0 ? -1 : 1;
this._cached = !0;
this.bindLanguageEvent();
this._apply();
},
onDestroy: function() {
this.unbindLanguageEvent();
},
bindLanguageEvent: function() {
i.default.getInstance().on(n.gameEvent.languageChanged, this._apply, this);
},
unbindLanguageEvent: function() {
i.default.getInstance().off(n.gameEvent.languageChanged, this._apply, this);
},
_apply: function() {
if (this.node && this.node.isValid && this._cached) {
var e = Math.abs(this.node.scaleX), t = this.flipScaleX < 0 ? -1 : 1;
a.isRTL() ? this.node.scaleX = e * this._origSign * t : this.node.scaleX = e * this._origSign;
}
}
});
t.exports = o;
t.exports.default = o;
cc._RF.pop();
