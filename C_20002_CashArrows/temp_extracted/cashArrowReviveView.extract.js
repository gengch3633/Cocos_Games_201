cashArrowReviveView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9ad6aD2Xk9Awo0IiiBsqrc8", "cashArrowReviveView");
var n = __extends, a = __decorate, o = __awaiter, r = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
var s = e("AudioMgr"), l = e("GlobalEventMgr"), c = e("MultiPlatform"), u = e("../migration-bundle/business-common/ad/AdManager"), d = e("UIMgr"), h = e("GEMgr"), p = e("InterfaceMgr"), _ = e("UserData"), f = e("BusinessAnalyticsService"), g = e("./reusable/i18n/LanguageService"), m = cc._decorator.ccclass, y = function(t) {
function i() {
var e = null !== t && t.apply(this, arguments) || this;
e.bool_cantouch = !0;
return e;
}
n(i, t);
i.prototype.onLoad = function() {
this._bindEvents();
this.showAni();
s.default.getInstance().playEffect("audio/revive_popup", p.bundleName.ui);
this.showInterstitialAd();
this._applyI18nTexts();
this._bindLanguageEvent();
};
i.prototype.onDestroy = function() {
this._unbindLanguageEvent();
};
i.prototype.i18n = function(e, t, i) {
return g.t(e, t || [], i);
};
i.prototype._bindLanguageEvent = function() {
l.default.getInstance().on(p.gameEvent.languageChanged, this.onLanguageChanged, this);
};
i.prototype._unbindLanguageEvent = function() {
l.default.getInstance().off(p.gameEvent.languageChanged, this.onLanguageChanged, this);
};
i.prototype.onLanguageChanged = function() {
this._applyI18nTexts();
};
i.prototype._findNodeDeep = function(e, t) {
if (!e) return null;
if (e.name === t) return e;
for (var i = 0; i < e.childrenCount; i++) {
var n = this._findNodeDeep(e.children[i], t);
if (n) return n;
}
return null;
};
i.prototype._setLabelByName = function(e, t, i) {
var n = this._findNodeDeep(this.node, e);
if (n) {
var a = n.getComponent(cc.Label);
if (!a) {
var o = n.getComponentsInChildren(cc.Label);
a = o && o.length > 0 ? o[0] : null;
}
a && (a.string = this.i18n(t, null, i));
}
};
i.prototype._applyI18nTexts = function() {
this._setLabelByName("txt_continue", "key_revive_title_continue", "Continue?");
this._setLabelByName("txt_timesup", "key_revive_title_timesup", "No Health!");
this._setLabelByName("txt_desc", "key_revive_desc", "Don't give up! Revive for free and keep fighting!");
this._setLabelByName("txt_free_revive", "key_revive_btn_free", "Free Revive");
this._setLabelByName("txt_try_again", "key_revive_btn_try_again", "Try Again");
};
i.prototype._bindEvents = function() {
var e = this, t = this.node.getChildByName("bg");
if (t) {
var i = t.getChildByName("btn_retry");
i && i.on(cc.Node.EventType.TOUCH_END, function() {
e.OnClickRevive();
}, e);
var n = t.getChildByName("txt_try_again");
n && n.on(cc.Node.EventType.TOUCH_END, function() {
e.OnClickRestart();
}, e);
var a = t.getChildByName("close_btn");
a && a.on(cc.Node.EventType.TOUCH_END, function() {
e.OnClickRestart();
}, e);
}
};
i.prototype.showInterstitialAd = function() {
return o(this, void 0, void 0, function() {
var e = this;
return r(this, function(t) {
switch (t.label) {
case 0:
this.bool_cantouch = !1;
return [ 4, c.default.getInstance().showInterstitialAd() ];

case 1:
t.sent();
this.scheduleOnce(function() {
e.bool_cantouch = !0;
}, 1);
return [ 2 ];
}
});
});
};
i.prototype.OnClickRevive = function() {
return o(this, void 0, void 0, function() {
var e = this;
return r(this, function(t) {
switch (t.label) {
case 0:
if (!this.bool_cantouch) return [ 2 ];
try {
f.default.reportData("ad_show", {
scene: "revive",
level: _.default.getInstance().level
});
} catch (e) {}
return [ 4, this.playReviveVideoByAdManager() ];

case 1:
if (t.sent()) {
try {
f.default.reportData("level_revive", {
level: _.default.getInstance().level
});
} catch (e) {}
e._claimReviveReward(function() {
l.default.getInstance().emit(p.gameEvent.gameAdFuhuo);
d.default.getInstance().hide(e.node);
});
}
return [ 2 ];
}
});
});
};
i.prototype.playReviveVideoByAdManager = function() {
var e = this;
return new Promise(function(t) {
var i = u && u.default && u.default.getInstance ? u.default.getInstance() : null;
if (i && "function" == typeof i.playNormalVideoAd) try {
i.playNormalVideoAd({
ad_type: "revive",
force_video: !1
}, function(e) {
var i = !e || void 0 === e.compensationQualifyMark || !!e.compensationQualifyMark;
t(i);
}, function(e) {
cc.warn("[cashArrowReviveView] revive video failed:", e && e.message || e);
t(!1);
}, e.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again"));
} catch (e) {
console.error("[cashArrowReviveView] playNormalVideoAd failed", e);
t(!1);
} else t(!1);
});
};
i.prototype._claimReviveReward = function(t) {
try {
var i = e("../migration-bundle/business-common/net/LoadingHttpService"), n = e("../migration-bundle/business-common/core/Handler"), a = i.default, o = n.default;
a.claimArrowAdReward({
video_type: "resurrection"
}, o.create(null, function(e) {
console.log("[cashArrowReviveView] claimReviveReward success", e);
t && t();
}), o.create(null, function(e) {
console.error("[cashArrowReviveView] claimReviveReward error", e);
t && t();
}));
} catch (e) {
console.error("[cashArrowReviveView] claimReviveReward exception", e);
t && t();
}
};
i.prototype.OnClickRestart = function() {
try {
h.default.trackEvent("lvNode", {
level: _.default.getInstance().level,
lose: 1
});
} catch (e) {}
try {
l.default.getInstance().emit(p.gameEvent.levelFailReport);
} catch (e) {}
l.default.getInstance().emit(p.gameEvent.gameRestart);
d.default.getInstance().hide(this.node);
};
i.prototype.showAni = function() {
var e = this.node.getChildByName("bg");
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
return a([ m ], i);
}(cc.Component);
i.default = y;
cc._RF.pop();
}