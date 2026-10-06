let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "510216H6L5Dtr01fwGUvmMr", "netErrorView");
var n = __extends,
a = __decorate;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var o = e(UIMgr "
} ].js), r = e(" NetErrorPopupService.js "), s = e(" GlobalEventMgr "), l = e(" InterfaceMgr "), c = e(" LanguageService.js "), u = null;
try {
var d = e(" MiddleHelper.js ");
u = d && d.default ? d.default : d;
} catch (e) {
u = null;
}
var h = cc._decorator.ccclass, p = "[netErrorView] ", _ = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._retryFn = null;
t._btnClose = null;
t._btnRetry = null;
t._lblTitle = null;
t._lblDesc = null;
t._lblContinue = null;
t._lblRetryText = null;
t._onCloseBound = null;
t._onRetryBound = null;
return t;
}
n(t, e);
t.prototype.onLoad = function() {
var e = r.default || r;
e && " function " == typeof e.consumePendingRetry && (this._retryFn = e.consumePendingRetry());
this._cacheNodes();
this._bindButtons();
this._refreshTexts();
this._bindLanguageEvent();
};
t.prototype.onDestroy = function() {
this._unbindButtons();
this._unbindLanguageEvent();
var e = r.default || r;
e && " function " == typeof e.notifyClosed && e.notifyClosed();
};
t.prototype._cacheNodes = function() {
var e = this.node.getChildByName(" bg ");
if (e) {
this._btnClose = e.getChildByName(" close_btn ") || null;
this._btnRetry = e.getChildByName(" btn_retry ") || null;
this._lblTitle = e.getChildByName(" txt_timesup ") || null;
this._lblDesc = e.getChildByName(" txt_desc ") || null;
this._lblContinue = e.getChildByName(" txt_continue ") || null;
this._btnRetry && (this._lblRetryText = this._btnRetry.getChildByName(" txt_free_revive ") || null);
} else cc.warn(p, " bg 节点缺失 ");
};
t.prototype._bindButtons = function() {
var e = this;
if (this._btnClose) {
this._onCloseBound = function() {
e.OnClickClose();
};
this._btnClose.on(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
} else cc.warn(p, " close_btn 节点缺失 ");
if (this._btnRetry) {
this._onRetryBound = function() {
e.OnClickFuhuo();
};
this._btnRetry.on(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
} else cc.warn(p, " btn_retry 节点缺失 ");
};
t.prototype._unbindButtons = function() {
this._btnClose && this._btnClose.isValid && this._onCloseBound && this._btnClose.off(cc.Node.EventType.TOUCH_END, this._onCloseBound, this);
this._btnRetry && this._btnRetry.isValid && this._onRetryBound && this._btnRetry.off(cc.Node.EventType.TOUCH_END, this._onRetryBound, this);
this._btnClose = null;
this._btnRetry = null;
this._onCloseBound = null;
this._onRetryBound = null;
};
t.prototype._bindLanguageEvent = function() {
s.default.getInstance().on(l.gameEvent.languageChanged, this._refreshTexts, this);
};
t.prototype._unbindLanguageEvent = function() {
s.default.getInstance().off(l.gameEvent.languageChanged, this._refreshTexts, this);
};
t.prototype._hasServerAttribution = function() {
try {
if (!u || " function " != typeof u.getRegionalState) return !1;
var e = u.getRegionalState();
return !(!e || !e.hasServerCountry);
} catch (e) {
cc.warn(p, " _hasServerAttribution error ", e);
return !1;
}
};
t.prototype._t = function(e, t) {
try {
var i = c.default || c;
if (i) {
var n;
this._hasServerAttribution() || " function " != typeof i.tWithLanguage ? " function " == typeof i.t && (n = i.t(e, [], t)) : n = i.tWithLanguage(" en- US ", e, [], t);
return n || t || e;
}
} catch (t) {
cc.warn(p, " _t error key = " + e, t);
}
return t || e;
};
t.prototype._setLabelText = function(e, t) {
if (e && e.isValid) {
var i = e.getComponent(cc.Label);
i && (i.string = t);
}
};
t.prototype._refreshTexts = function() {
this._setLabelText(this._lblContinue, this._t(" key_net_error_continue ", " Continue? "));
this._setLabelText(this._lblTitle, this._t(" key_net_error_title ", " Network connection failed ! "));
this._setLabelText(this._lblDesc, this._t(" key_net_error_message ", " Please check your cellular or Wi- Fi connection and retry "));
this._setLabelText(this._lblRetryText, this._t(" key_net_error_retry ", " Try Again "));
};
t.prototype.OnClickClose = function() {
this._retryFn = null;
try {
o.default.getInstance().hide(this.node);
} catch (e) {
cc.warn(p, " OnClickClose hide 失败 ", e);
}
};
t.prototype.OnClickFuhuo = function() {
var e = this._retryFn;
this._retryFn = null;
try {
o.default.getInstance().hide(this.node);
} catch (e) {
cc.warn(p, " OnClickFuhuo hide 失败 ", e);
}
if (" function " == typeof e) try {
e();
} catch (e) {
cc.warn(p, " retryFn 执行异常 ", e);
} else cc.warn(p, " 点击重试但无 retryFn 绑定 ， no- op ");
};
return a([ h ], t);
}(cc.Component);
i.default = _;
cc._RF.pop();
