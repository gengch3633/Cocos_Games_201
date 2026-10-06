// @ts-nocheck
import NativeSdkBridgeAdapter from "./NativeSdkBridgeAdapter";
import * as LanguageService from "./LanguageService";
import ResKeeper from "./ResKeeper";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIAnimation from "./UIAnimation";
import { UIParams } from "./UIParams";

const { __extends, __awaiter, __generator } = cc;
let n;
const a = __extends;
const o = __awaiter;
const r = __generator;
export let DestroyStrategy;
var s = ResKeeper, l = ResMgr, c = Singleton, u = UIAnimation, d = UIParams, h = NativeSdkBridgeAdapter, p = LanguageService;
(function(e) {
e[e.CleanAll = 0] = "CleanAll";
e[e.Destroy_KeepSelf_CleanDynamic = 1] = "Destroy_KeepSelf_CleanDynamic";
e[e.Destroy_CleanSelfToScene_CleanDynamic = 2] = "Destroy_CleanSelfToScene_CleanDynamic";
e[e.DestroyOnly = 3] = "DestroyOnly";
e[e.Hide_CleanDynamic = 4] = "Hide_CleanDynamic";
e[e.HideOnly = 5] = "HideOnly";
})(n = DestroyStrategy || (DestroyStrategy = {}));
var _ = {
waitOption: {
url: "prefab/waitingUI",
bundleName: "cocos-module-common"
},
showWait: !0,
blockInputEvents: !0,
hasMask: !0,
maskColor: cc.Color.BLACK,
maskOpacity: 178.5,
maskBlockInputEvents: !0,
maskClickHide: !0,
backClosable: !0,
destroyStrategy: n.DestroyOnly,
animingClose: !1,
group: -1
}, f = _, g = function() {
function e(e, t) {
this.url = e;
this.bundle = t;
Object.assign(this, f);
}
e.prototype.setUrl = function(e, t) {
this.url = e;
this.bundle = t;
return this;
};
e.prototype.setLayerName = function(e) {
this.layerName = e;
return this;
};
e.prototype.setBlockInputEvents = function(e) {
this.blockInputEvents = e;
return this;
};
e.prototype.setMaskColor = function(e) {
this.maskColor = e;
return this;
};
e.prototype.setMaskOpacity = function(e) {
this.maskOpacity = e;
return this;
};
e.prototype.setHasMask = function(e) {
this.hasMask = e;
return this;
};
e.prototype.setMaskBlockInputEvents = function(e) {
this.maskBlockInputEvents = e;
return this;
};
e.prototype.setMaskClickHide = function(e) {
this.maskClickHide = e;
return this;
};
e.prototype.setBackClosable = function(e) {
this.backClosable = e;
return this;
};
e.prototype.setDestroyStrategy = function(e) {
this.destroyStrategy = e;
return this;
};
e.prototype.setAnimingClose = function(e) {
this.animingClose = e;
return this;
};
e.prototype.setGroup = function(e) {
this.group = e;
return this;
};
e.prototype.getId = function() {
var e;
return (this.bundle ? (null !== (e = this.bundle) && void 0 !== e ? e : "") + "#" : "") + this.url;
};
e.prototype.clone = function(t) {
t || (t = new e(this.url, this.bundle));
Object.assign(t, this);
return t;
};
return e;
}();
export const UIConfig = g;
var m = function(e) {
function t() {
var t = e.call(this) || this;
t._layerMgr = null;
t.map = new Map();
t.loadingMap = new Map();
t.eventTarget = new cc.EventTarget();
t.waitingUI = null;
t.waitCount = 0;
t.deleteMap = new Map();
t._androidBackBound = !1;
t._lastBackPressAt = 0;
t._backExitGapMs = 2e3;
t.loadWatingUI();
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, t.beforeSceneLaunchHandle, t);
t.bindAndroidBackBridge();
t.bindAndroidBackKey();
return t;
}
a(t, e);
Object.defineProperty(t.prototype, "uiRoot", {
get: function() {
return this.layerMgr.uiRoot;
},
set: function(e) {
this.layerMgr.uiRoot = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "layerMgr", {
get: function() {
this._layerMgr || (this._layerMgr = new y());
return this._layerMgr;
},
enumerable: !1,
configurable: !0
});
t.prototype.initLayer = function(e, t) {
void 0 === t && (t = null);
this.layerMgr.init(e, t);
};
t.prototype.getDefaultLayerNode = function() {
return this.layerMgr.getDefaultLayerNode();
};
t.prototype.getTopLayerNode = function() {
return this.layerMgr.getTopLayerNode();
};
t.prototype.getLayerNode = function(e) {
return this.layerMgr.getLayerNode(e);
};
t.prototype.loadWatingUI = function() {
var e = this;
this.waitCount = 0;
this.uiRoot = null;
this.waitingUI && this.waitingUI.node && this.waitingUI.node.isValid && this.waitingUI.node.destroy();
this.waitingUI = null;
l.default.getInstance().loadRes(f.waitOption.url, cc.Prefab, null, f.waitOption.bundleName).then(function(t) {
if (t) {
var i = cc.instantiate(t);
e.waitingUI = v(i);
e.waitingUI || console.error("Waiting UI component not found on node");
}
});
};
t.prototype.beforeSceneLaunchHandle = function() {
this.loadWatingUI();
this.cleanInvalidUI();
};
t.prototype.bindAndroidBackKey = function() {
if (!this._androidBackBound && cc && cc.sys && cc.systemEvent && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onAndroidKeyDown, this);
this._androidBackBound = !0;
}
};
t.prototype.bindAndroidBackBridge = function() {
if (cc && cc.sys && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
var e = this;
window.__ANDROID_BACK__ = function() {
return e.handleAndroidBack();
};
}
};
t.prototype.onAndroidKeyDown = function(e) {
if (e && e.keyCode === cc.macro.KEY.back && this.handleAndroidBack()) {
e.stopPropagation && e.stopPropagation();
e.preventDefault && e.preventDefault();
}
};
t.prototype._getNodeBackScore = function(e) {
if (!e || !e.isValid) return -1;
var t = e.getSiblingIndex ? e.getSiblingIndex() : 0;
return 1e5 * (e.parent && e.parent.isValid && e.parent.getSiblingIndex ? e.parent.getSiblingIndex() : 0) + t;
};
t.prototype.getTopVisibleUINode = function() {
var e = null, t = -1;
this.map.forEach(function(i) {
if (i && i.isValid && i.active) {
var n = i.getComponent(d);
if (n && n.config) {
var a = this._getNodeBackScore(i);
if (a >= t) {
t = a;
e = i;
}
}
}
}, this);
return e;
};
t.prototype.handleAndroidBack = function() {
this.cleanInvalidUI();
var e = this.getTopVisibleUINode();
if (!e || !e.isValid) return this.handleRootBackPress();
var t = e.getComponent(d), i = t && t.config;
if (i && !1 === i.backClosable) {
this._lastBackPressAt = 0;
return !0;
}
this._lastBackPressAt = 0;
this.hide(e);
return !0;
};
t.prototype.getExitToastText = function() {
var e = "再按一次退出游戏";
try {
var t = p.default || p;
"id-ID" === (t && t.getCurrentLanguage ? String(t.getCurrentLanguage()) : "") && (e = "Tekan sekali lagi untuk keluar game");
} catch (e) {}
return e;
};
t.prototype.showNativeBackToast = function() {
try {
var e = h.default || h, t = e && e.getBridge ? e.getBridge() : null;
t && t.showAppLongTapToast && t.showAppLongTapToast(this.getExitToastText(), 0);
} catch (e) {
console.warn("[UIMgr] showNativeBackToast failed", e);
}
};
t.prototype.requestNativeExitApp = function() {
try {
var e = h.default || h, t = e && e.getBridge ? e.getBridge() : null;
t && t.exitApp && t.exitApp();
} catch (e) {
console.warn("[UIMgr] requestNativeExitApp failed", e);
}
};
t.prototype.handleRootBackPress = function() {
var e = Date.now();
if (e - this._lastBackPressAt <= this._backExitGapMs) {
this._lastBackPressAt = 0;
this.requestNativeExitApp();
return !0;
}
this._lastBackPressAt = e;
this.showNativeBackToast();
return !0;
};
t.prototype.setGlobalOption = function(e) {
f = Object.assign(_, e);
this.waitingUI && this.waitingUI.isValid && this.waitingUI.node && this.waitingUI.node.destroy();
this.loadWatingUI();
};
t.prototype.show = function(e) {
for (var i, n, a, s = [], c = 1; c < arguments.length; c++) s[c - 1] = arguments[c];
return o(this, void 0, Promise, function() {
var o, c, h, p, _, f, g, m, y, v, b = this;
return r(this, function(r) {
switch (r.label) {
case 0:
return (o = null == e ? void 0 : e.getId()) ? this.loadingMap.has(o) ? (this.loadingMap.set(o, s), 
[ 2, null ]) : (c = Date.now(), this.loadingMap.set(o, s), p = this.map.get(o), 
e.showWait && this.showWatingUI(), h = (null == p ? void 0 : p.isValid) ? Promise.resolve(p) : new Promise(function(t) {
l.default.getInstance().instantiateByUrl(e.url, null, e.bundle, function(t, i) {
var n;
e.showWait && b.waitingUI && b.waitingUI.isValid && (null === (n = b.waitingUI) || void 0 === n || n.progress(t, i));
}).then(function(e) {
return t(e);
});
}), e.group >= 0 && this.map.forEach(function(t, i) {
(null == t ? void 0 : t.isValid) && o != i && t.getComponent(d).config.group == e.group && b.hide(t);
}), [ 4, h ]) : [ 2, null ];

case 1:
_ = r.sent();
console.log(e.getId() + " 打开耗时: " + (Date.now() - c) + "ms");
if (!_) {
console.error("ui打开错误 ", e.url, e.bundle);
e.showWait && this.hideWatingUI();
return [ 2, null ];
}
try {
f = null !== (i = e.layerName) && void 0 !== i ? i : this.layerMgr.getDefaultLayerName();
g = null !== (n = this.layerMgr.getLayerNode(f)) && void 0 !== n ? n : this.layerMgr.getDefaultLayerNode();
m = g.children.length + (e.hasMask ? 1 : 0);
(y = null !== (a = _.getComponent(d)) && void 0 !== a ? a : _.addComponent(d)).init(e, this.loadingMap.get(o), m);
_.active = !0;
this.map.set(o, _);
this.loadingMap.delete(o);
this.eventTarget.emit(t.EventType.BEFORE_SHOW, o, _);
v = _.getComponents(u.default).filter(function(e) {
return e.isShowAnim;
});
y.runingAnim = v.length > 0;
g.insertChild(_, m);
e.showWait && this.hideWatingUI();
(null == v ? void 0 : v.length) > 0 && Promise.all(v.map(function(e) {
return e.show();
})).then(function() {
if (null == _ ? void 0 : _.isValid) {
y.runingAnim = !1;
null == _ || _.emit(t.EventType.ANIMATION_SHOW_COMPLETE);
b.eventTarget.emit(t.EventType.ANIMATION_SHOW_COMPLETE, o, _);
}
});
this.eventTarget.emit(t.EventType.SHOW, o, _);
return [ 2, _ ];
} catch (t) {
console.error("ui打开错误 ", null == e ? void 0 : e.url, null == e ? void 0 : e.bundle, t);
return [ 2, null ];
}
return [ 2 ];
}
});
});
};
t.prototype.setUIParams = function(e) {
for (var i, n = [], a = 1; a < arguments.length; a++) n[a - 1] = arguments[a];
if (this.isShow(e)) {
var o = null === (i = this.map.get(e.getId())) || void 0 === i ? void 0 : i.getComponent(d);
if (o) {
o.params = n;
this.eventTarget.emit(t.EventType.CHANGE_PARAMS, e.getId(), o.node);
}
}
};
t.prototype.getUIParams = function(e, t, i) {
var n;
void 0 === i && (i = void 0);
if (!this.isShow(e)) return null;
var a = null === (n = this.map.get(e.getId())) || void 0 === n ? void 0 : n.getComponent(d);
return a ? t < 0 ? a.params : a.parse(t, i) : null;
};
t.prototype.isShow = function(e) {
var t = e.getId(), i = this.map.get(t);
return i && i.isValid && i.active;
};
t.prototype.getUINode = function(e) {
var t = e.getId(), i = this.map.get(t);
return i && i.isValid ? i : null;
};
t.prototype.cleanInvalidUI = function() {
var e = this;
this.map.forEach(function(t, i) {
t.isValid || e.map.delete(i);
});
};
t.prototype.hide = function(e) {
var i = this;
return new Promise(function(a) {
var o, r, c;
if ((c = e instanceof cc.Node ? null === (r = null === (o = e.getComponent(d)) || void 0 === o ? void 0 : o.config) || void 0 === r ? void 0 : r.getId() : null == e ? void 0 : e.getId()) && i.map.has(c)) {
var h = i.map.get(c);
if (!h || !h.isValid) {
i.map.delete(c);
return void a();
}
if (i.deleteMap.get(c)) a(); else {
var p = h.getComponent(d);
if (null == p || !p.runingAnim || p.config.animingClose) {
i.deleteMap.set(c, !0);
i.eventTarget.emit(t.EventType.BEFORE_HIDE, c, h);
p.runingAnim = !0;
var _ = Promise.resolve(), f = h.getComponents(u.default).filter(function(e) {
return e.isHideAnim;
});
(null == f ? void 0 : f.length) > 0 && (_ = Promise.all(f.map(function(e) {
return e.hide();
})));
_.then(function() {
var e, o;
p.runingAnim = !1;
h.emit(t.EventType.ANIMATION_HIDE_COMPLETE);
i.eventTarget.emit(t.EventType.ANIMATION_HIDE_COMPLETE, c, h);
var r = p.config.destroyStrategy, u = h.getComponent(s.default);
if (r == n.Destroy_KeepSelf_CleanDynamic || r == n.Destroy_CleanSelfToScene_CleanDynamic || r == n.Hide_CleanDynamic) {
null == u || u.removeSelfAsset();
r == n.Destroy_CleanSelfToScene_CleanDynamic && (null === (e = l.default.getInstance().getKeeper(cc.Canvas.instance.node)) || void 0 === e || e.addAsset(null == u ? void 0 : u.selfAsset), 
null === (o = null == u ? void 0 : u.selfAsset) || void 0 === o || o.decRef());
}
r != n.DestroyOnly && r != n.HideOnly || null == u || u.clearAll();
if (r == n.CleanAll || r == n.Destroy_KeepSelf_CleanDynamic || r == n.Destroy_CleanSelfToScene_CleanDynamic || r == n.DestroyOnly) {
h.emit(t.EventType.HIDE);
h.destroy();
i.map.delete(c);
} else {
h.active = !1;
h.emit(t.EventType.HIDE);
}
i.deleteMap.delete(c);
a();
i.eventTarget.emit(t.EventType.HIDE, c, h);
});
} else a();
}
} else a();
});
};
t.prototype.showWatingUI = function() {
var e, t, i, n;
if (this.waitingUI && this.waitingUI.isValid) {
this.waitCount++;
null === (i = null === (t = null === (e = this.waitingUI) || void 0 === e ? void 0 : e.node) || void 0 === t ? void 0 : t.getComponent(cc.Widget)) || void 0 === i || i.updateAlignment();
this.waitingUI.node.parent = this.getTopLayerNode();
this.waitingUI.node.zIndex = cc.macro.MAX_ZINDEX;
null === (n = this.waitingUI) || void 0 === n || n.show();
}
};
t.prototype.hideWatingUI = function() {
if (this.waitingUI && this.waitingUI.isValid) {
this.waitCount = Math.max(0, this.waitCount - 1);
this.waitCount <= 0 && this.waitingUI.hide();
}
};
t.prototype.setBlockInputEvents = function(e) {
this.layerMgr.getBlockInputNode().active = e;
};
t.prototype.on = function(e, t, i) {
this.eventTarget.on(e, t, i);
};
t.prototype.once = function(e, t, i) {
this.eventTarget.once(e, t, i);
};
t.prototype.off = function(e, t, i) {
this.eventTarget.off(e, t, i);
};
t.prototype.targetOff = function(e) {
this.eventTarget.targetOff(e);
};
t.EventType = {
BEFORE_SHOW: "UIMgr_Event_Before_Show",
SHOW: "UIMgr_Event_Show",
ANIMATION_SHOW_COMPLETE: "UIMgr_EVENT_ANIMATION_SHOW_COMPLETE",
BEFORE_HIDE: "UIMgr_Event_BEFORE_HIDE",
ANIMATION_HIDE_COMPLETE: "UIMgr_EVENT_ANIMATION_HIDE_COMPLETE",
HIDE: "UIMgr_Event_Hide",
CHANGE_PARAMS: "UIParams_Event_Params_Change"
};
return t;
}(c.default);
export default m;
export { DestroyStrategy, UIConfig };
var y = function() {
function e() {
this.uiRoot = null;
this.layerMap = new Map();
this.names = [];
this.defaultLayer = null;
this.globalBlockInputNode = null;
}
e.prototype.createNode = function(e, t) {
var i;
void 0 === t && (t = null);
var n = new cc.Node(e);
n.parent = t || (null !== (i = this.uiRoot) && void 0 !== i ? i : cc.Canvas.instance.node);
n.width = cc.winSize.width;
n.height = cc.winSize.height;
var a = n.addComponent(cc.Widget);
a.isAlignTop = a.isAlignBottom = a.isAlignLeft = a.isAlignRight = !0;
a.top = a.bottom = a.left = a.right = 0;
a.target = cc.Canvas.instance.node;
a.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
return n;
};
e.prototype.init = function(e, t) {
var i = this;
void 0 === t && (t = null);
if (e && !(e.length <= 0)) {
this.names = e;
this.defaultLayer = t;
e.forEach(function(e) {
var t = i.createNode("layer_" + e);
i.layerMap.set(e, t);
});
}
};
e.prototype.getDefaultLayerName = function() {
var e;
return null !== (e = this.defaultLayer) && void 0 !== e ? e : this.names[0];
};
e.prototype.setDefaultLayerName = function(e) {
this.defaultLayer = e;
};
e.prototype.getDefaultLayerNode = function() {
var e, t, i = this.uiRoot;
i && !i.isValid && (i = null);
return null !== (t = null !== (e = this.getLayerNode(this.getDefaultLayerName())) && void 0 !== e ? e : i) && void 0 !== t ? t : cc.Canvas.instance.node;
};
e.prototype.getTopLayerNode = function() {
var e, t, i = this.uiRoot;
i && !i.isValid && (i = null);
return null !== (t = null !== (e = this.getLayerNode(this.names[this.names.length - 1])) && void 0 !== e ? e : i) && void 0 !== t ? t : cc.Canvas.instance.node;
};
e.prototype.getLayerNode = function(e) {
if (null == e || null == e) return null;
var t = this.layerMap.get(e);
if (!t || !t.isValid) {
if (this.names.length <= 0) return null;
this.init(this.names, this.defaultLayer);
}
return this.layerMap.get(e);
};
e.prototype.getBlockInputNode = function() {
if (!this.globalBlockInputNode || !this.globalBlockInputNode.isValid) {
var e = this.createNode("blockInput", this.getTopLayerNode());
e.addComponent(cc.BlockInputEvents);
this.globalBlockInputNode = e;
}
this.globalBlockInputNode.zIndex = cc.macro.MAX_ZINDEX;
return this.globalBlockInputNode;
};
return e;
}();
function v(e) {
for (var t = e.getComponents(cc.Component), i = 0; i < t.length; i++) {
var n = t[i];
if (n.show && n.hide && n.progress) return n;
}
return null;
}
