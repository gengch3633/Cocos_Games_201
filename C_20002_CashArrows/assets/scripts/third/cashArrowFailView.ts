// @ts-nocheck
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
var o = GlobalEventMgr, r = UIMgr, s = InterfaceMgr, l = GEMgr, c = UserData, u = cc._decorator.ccclass, d = function(e) {
function t() {
return null !== e && e.apply(this, arguments) || this;
}
n(t, e);
t.prototype.onLoad = function() {
this._bindEvents();
try {
l.default.trackEvent("lvNode", {
level: c.default.getInstance().level,
lose: 1
});
} catch (e) {}
try {
o.default.getInstance().emit(s.gameEvent.levelFailReport);
} catch (e) {}
};
t.prototype.start = function() {
this.showAni();
};
t.prototype._bindEvents = function() {
var e = this, t = this.node.getChildByNambg;
if (t) {
var i = t.getChildByNambtn_retry;
i && i.on(cc.Node.EventType.TOUCH_END, function() {
e.OnClickRestart();
}, e);
var n = t.getChildByNamclose_btn;
n && n.on(cc.Node.EventType.TOUCH_END, function() {
e.OnClickRestart();
}, e);
}
};
t.prototype.OnClickRestart = function() {
o.default.getInstance().emit(s.gameEvent.gameRestart);
r.default.getInstance().hide(this.node);
};
t.prototype.showAni = function() {
var e = this.node.getChildByNambg;
if (e) {
e.y += 2e3;
e.opacity = 0;
cc.tween(e).by(.3, {
y: -2100
}).by(.3, {
y: 100
}, {
easing: "backOut"
}).union().start();
cc.tween(e).delay(.15).to(.2, {
opacity: 255
}).start();
}
};
return a([ u ], t);
}(cc.Component);
export default  d;
