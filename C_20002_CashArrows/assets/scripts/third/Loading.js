let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "5e97bFcaYNC/ppZx78uSOup", "Loading");
var n = __extends,
a = __decorate,
o = __awaiter,
r = __generator;
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
function s() {
  try {
    if("undefined" != typeof window&& ! 0 === window.__ARROW_ENABLE_LOG__) return ! 0;
  } catch(e) {
  }
  try {
    if("undefined" != typeof cc&& cc.sys&& cc.sys.localStorage) {
      var e = cc.sys.localStorage.getItem("arrow_enable_log");
      return "1" === e|| "true" === e;
    }
  } catch(e) {
  }
  return ! 1;
}
(function() {
  if(! s()) {
    var e = function() {
    }
;
    if("undefined" != typeof console) {
      console.log = e;
      console.info = e;
      console.debug = e;
      console.warn = e;
      console.error = e;
    }
    if("undefined" != typeof cc) {
      cc.log = e;
      cc.warn = e;
      cc.error = e;
    }
  }
}
)();
for(var l = e("ConfigMgr.js"), c = e("Launch.js"), u = e("SceneMgr.js"), d = e("UIMgr.js"), h = e("Utils.js"), p = (e("GEMgr.js"), e("UserData.js")), _ = e("UIDefine.js"), f = e("LoadingProjectAdaptersBridge.js"), g = e("UiPageAnalyticsService.js"), m = e("AppReviewManager.js"), y = e(LanguageService "
} ].js), v = e(" CurrencyFormatService.js "), b = e(" LoadingUmpDialogService.js "), w = e(" LoadingHttpService.js "), k = e(" PlayerDataStore.js "), S = e(" Handler.js "), C = e(" PlatformBridge.js "), T = e(" ClientDataStore.js "), N = [ {
name: " waitGaid ",
weight: 8
}, {
name: " middleCountry ",
weight: 8
}, {
name: " login ",
weight: 8
}, {
name: " systemConfig ",
weight: 8
}, {
name: " gameConfig ",
weight: 8
}, {
name: " userInfo ",
weight: 8
}, {
name: " configLoad ",
weight: 20
}, {
name: " archiveInit ",
weight: 10
}, {
name: " bundleLoad ",
weight: 15
}, {
name: " enterScene ",
weight: 7
} ], I = 0, A = 0; A < N.length; A++) I += N[A].weight;
function R() {
if (cc.sys && cc.sys.isNative && !cc.__spineBlendGuardPatched) {
var e = cc.gfx || {}, t = cc.Material && cc.Material.prototype;
if (t && " function " == typeof t.setBlend) {
var i = t.setBlend, n = null != e.BLEND_FUNC_ADD ? e.BLEND_FUNC_ADD : e.BLEND_OP_ADD, a = null != e.BLEND_SRC_ALPHA ? e.BLEND_SRC_ALPHA : cc.macro.SRC_ALPHA, o = null != e.BLEND_ONE_MINUS_SRC_ALPHA ? e.BLEND_ONE_MINUS_SRC_ALPHA : cc.macro.ONE_MINUS_SRC_ALPHA, r = null != e.BLEND_ONE ? e.BLEND_ONE : cc.macro.ONE, s = null != e.BLEND_SRC_COLOR ? e.BLEND_SRC_COLOR : cc.macro.SRC_COLOR, l = null != e.BLEND_ONE_MINUS_SRC_COLOR ? e.BLEND_ONE_MINUS_SRC_COLOR : cc.macro.ONE_MINUS_SRC_COLOR, c = null != e.BLEND_DST_COLOR ? e.BLEND_DST_COLOR : cc.macro.DST_COLOR, u = null != e.BLEND_ONE_MINUS_DST_COLOR ? e.BLEND_ONE_MINUS_DST_COLOR : cc.macro.ONE_MINUS_DST_COLOR, d = null != e.BLEND_SRC_ALPHA_SATURATE ? e.BLEND_SRC_ALPHA_SATURATE : cc.macro.SRC_ALPHA_SATURATE;
t.setBlend = function(e, t, s, l, c, u, d, p, _) {
null == t && (t = n);
null == c && (c = n);
null == s && (s = a);
null == l && (l = o);
h(u) && (u = r);
h(d) && (d = o);
null == u && (u = r);
null == d && (d = o);
null == p && (p = 4294967295);
return i.call(this, e, t, s, l, c, u, d, p, _);
};
cc.__spineBlendGuardPatched = !0;
console.warn("[BlendGuard] Native blend guard enabled ");
}
}
function h(e) {
return null == e || e === s || e === l || e === c || e === u || e === d;
}
}
var P = cc._decorator, E = P.ccclass, M = P.property, L = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.sp_logo = null;
t.sf_logoarr = [];
t.node_noMac = null;
t.progressBar = null;
t.img_jindu = null;
t.umpNode = null;
t.umpBtnAgree = null;
t.umpBtnClose = null;
t._isProgressPaused = !1;
t._pendingProgressRatio = 0;
t._hasPendingProgress = !1;
t._realProgress = 0;
t._sceneEntering = !1;
return t;
}
n(t, e);
t.prototype.onLoad = function() {
R();
console.log("[Loading][UMP] onLoad hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose);
f.initProjectLoadingAdapters();
y.init();
this.playLogoSpineOnce();
this.init();
};
t.prototype.playLogoSpineOnce = function() {
if (this.sp_logo && this.sp_logo.setAnimation) try {
var e = this.sp_logo.defaultAnimation || " animation ";
this.sp_logo.loop = !1;
this.sp_logo.clearTracks && this.sp_logo.clearTracks();
this.sp_logo.setAnimation(0, e, !1);
this.sp_logo.setCompleteListener && this.sp_logo.setCompleteListener(function() {});
} catch (e) {
console.warn("[Loading] play logo spine failed: ", e);
}
};
t.prototype.ShowNoMac = function() {
return o(this, void 0, void 0, function() {
var e, t;
return r(this, function(i) {
switch (i.label) {
case 0:
e = !0;
return [ 4, l.default.getInstance().getMackList() ];

case 1:
t = i.sent();
console.log(" maclist: ", t);
t.forEach(function(t) {
t.macId == p.default.getInstance().userID && (e = !1);
});
e ? this.node_noMac.active = !0 : this.init();
return [ 2 ];
}
});
});
};
t.prototype.init = function() {
var e = this, t = null;
h.default.AddIrregularityClick();
cc.macro.ENABLE_MULTI_TOUCH = !1;
var i = {
gameName: " ",
rewardVideo: [],
inters: " ",
custom: " ",
ossUrl: " ",
login: !1,
dataSyncToServer: !1,
report: !1
};
if (cc.sys.isBrowser) {
var n = this.getURLParams();
if (n) {
Object.assign(i, n);
console.log(" url params: ", n);
}
}
d.default.getInstance().initLayer(Object.keys(_.UILayer), _.UILayer.Bottom);
m.default.getInstance().init();
g.default.init();
g.default.trackEnter(" launch_page ");
f.initSystem();
var a, o, r = (a = function(t) {
e._animateProgressTo(t);
}, o = {}, {
stepDone: function(e) {
if (!o[e]) {
o[e] = !0;
for (var t = 0, i = 0; i < N.length; i++) o[N[i].name] && (t += N[i].weight);
var n = t / I;
console.log("[Loading][Progress] stepDone: " + e + "- > " + Math.round(100 * n) + "% ");
a && a(n);
}
},
batchDone: function(e) {
for (var t = 0; t < e.length; t++) o[e[t]] = !0;
for (var i = 0, n = 0; n < N.length; n++) o[N[n].name] && (i += N[n].weight);
var r = i / I;
console.log("[Loading][Progress] batchDone:[" + e.join(", ") + "]- > " + Math.round(100 * r) + "% ");
a && a(r);
}
});
try {
var s = b && b.default;
console.log("[Loading][UMP] service check hasServiceClass = " + !!s + " hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose + " umpNodeName = " + (this.umpNode ? this.umpNode.name : " null ") + " umpNodeActive = " + (this.umpNode ? this.umpNode.active : " null ") + " umpNodeActiveInHierarchy = " + (this.umpNode ? this.umpNode.activeInHierarchy : " null "));
if (s && this.umpNode && this.umpBtnAgree && this.umpBtnClose) {
this.umpNode.active = !1;
console.log("[Loading][UMP] service created, set umpNode.active = false ");
t = new s({
umpNode: this.umpNode,
umpBtnAgree: this.umpBtnAgree,
umpBtnClose: this.umpBtnClose,
onPauseLoading: function() {
console.log("[Loading][UMP] onPauseLoading fillRange = " + (e.img_jindu ? e.img_jindu.fillRange : " null ") + " umpNodeActive = " + (e.umpNode ? e.umpNode.active : " null "));
e._isProgressPaused = !0;
},
onResumeLoading: function() {
console.log("[Loading][UMP] onResumeLoading hasPendingProgress = " + e._hasPendingProgress + " fillRange = " + (e.img_jindu ? e.img_jindu.fillRange : " null ") + " umpNodeActive = " + (e.umpNode ? e.umpNode.active : " null "));
e._isProgressPaused = !1;
if (e._hasPendingProgress) {
e._hasPendingProgress = !1;
e._realProgress = Math.max(e._realProgress, e._pendingProgressRatio);
}
}
});
} else s && console.warn("[Loading][UMP] 节点未配置 ， 跳过展示 。 hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose);
} catch (e) {
console.error("[Loading][UMP] 初始化弹窗服务失败: ", e);
}
var l = function() {
console.log(" doLaunch ", " doLaunch ");
try {
var e = v.getCurrentCountry();
e && y.setByCountryCode(e);
} catch (e) {
console.warn("[Loading] sync country- language before launch failed: ", e);
}
try {
var t = C && C.default ? C.default : C, n = T && T.default ? T.default : T, a = n && n.local_country, o = t && " function " == typeof t.getNativeBridge ? t.getNativeBridge() : null;
if (o && " function " == typeof o.initSMSdk) {
o.initSMSdk(" MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKP9X+ CjUjA2ijFyOPVAqmXPOuQl39+ 2KRHZZMydD/ TuOEL/ SzZqE9A+ BT49r41twoDHp/ bNc7OjTYjclIkCDp8CAwEAAQ == ", a);
console.log("[Loading] initSMSdk called country = " + a);
}
} catch (e) {
console.warn("[Loading] initSMSdk failed: ", e);
}
var s = Number(k.default.current_arrow_level_id || 0), l = s > 0 ? {
arrow_level_id: s
} : {
arrow_level_id: 1
};
console.log("[ArrowLevel] doLaunch: 请求关卡配置 req = " + JSON.stringify(l));
w.default.getArrowLevelConfig(l, S.default.create(null, function(e) {
if (e && e.data && e.data.arrow_level) {
k.default.updateArrowLevel(e.data.arrow_level);
console.log("[ArrowLevel] doLaunch: 关卡配置加载成功 arrow_level = " + JSON.stringify(e.data.arrow_level));
} else console.warn("[ArrowLevel] doLaunch: 关卡配置返回数据异常 res = " + JSON.stringify(e));
}), S.default.create(null, function(e) {
console.warn("[ArrowLevel] doLaunch: 关卡配置请求失败 ， 使用本地 level 兜底 err = " + JSON.stringify(e));
}));
var u = 0, d = [ " configLoad ", " archiveInit ", " bundleLoad " ];
c.default.getInstance().load(i, [ " lobby " ], function(e, t) {
if (u < d.length) {
r.stepDone(d[u]);
u++;
}
if (t >= e) {
for (var i = u; i < d.length; i++) r.stepDone(d[i]);
r.stepDone(" enterScene ");
}
});
}, u = function() {
f.runMiddleCountry(function() {
r.stepDone(" middleCountry ");
f.runBaseFlow(l, l, function(e) {
r.stepDone(e);
});
}, null, function() {
r.batchDone([ " middleCountry ", " systemConfig ", " login ", " gameConfig ", " userInfo " ]);
l();
}, function(i) {
console.log("[Loading][UMP] onShowUmp called hasServiceInstance = " + !!t + " hasCallBack = " + !!i + " umpNodeActiveBeforeShow = " + (e.umpNode ? e.umpNode.active : " null ") + " umpNodeActiveInHierarchyBeforeShow = " + (e.umpNode ? e.umpNode.activeInHierarchy : " null "));
if (t && i) t.show(function(t) {
console.log("[Loading][UMP] onShowUmp callback isAgree = " + t + " umpNodeActiveAfterChoice = " + (e.umpNode ? e.umpNode.active : " null ") + " umpNodeActiveInHierarchyAfterChoice = " + (e.umpNode ? e.umpNode.activeInHierarchy : " null "));
i(t);
}); else {
console.warn("[Loading][UMP] show fallback: service/ callback missing, default reject ");
i && i(!1);
}
});
};
if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
var p = !1, A = null, R = function(e) {
if (!p) {
p = !0;
if (A) {
clearTimeout(A);
A = null;
}
console.log("[Loading][GAID] resolved reason = " + e);
r.stepDone(" waitGaid ");
u();
}
}, P = window, E = P.branch = P.branch || {}, M = E.moduleSerialNailed;
E.moduleSerialNailed = function() {
" function " == typeof M && M.apply(E, arguments);
R(" callback ");
};
A = setTimeout(function() {
console.warn("[Loading][GAID] timeout 20000ms, proceed without GAID ");
R(" timeout ");
}, 2e4);
console.log("[Loading][GAID] waiting for moduleSerialNailed(timeout = 20000ms) ");
} else {
console.log("[Loading][GAID] non- Android, skip GAID wait ");
r.stepDone(" waitGaid ");
u();
}
};
t.prototype.getURLParams = function() {
var e, t, i, n = null === (i = null === (t = null === (e = null === window || void 0 === window ? void 0 : window.location) || void 0 === e ? void 0 : e.search) || void 0 === t ? void 0 : t.substring(1)) || void 0 === i ? void 0 : i.split("& ");
if (!n || n.length <= 0) return null;
for (var a = {}, o = 0, r = n; o < r.length; o++) {
var s = r[o].split(" = "), l = s[0], c = s[1];
l && c && (a[l] = c);
}
return a;
};
t.prototype._animateProgressTo = function(e) {
if (this._isProgressPaused) {
this._pendingProgressRatio = e;
this._hasPendingProgress = !0;
} else this._realProgress = Math.max(this._realProgress, Math.min(e, 1));
};
t.prototype.updateProgressBar = function(e, t) {
this._animateProgressTo(t / e);
};
t.prototype.update = function(e) {
if (!this._isProgressPaused && this.img_jindu) {
var t = this._realProgress, i = this.img_jindu.fillRange || 0;
if (i < t) t - (i += (t - i) * Math.min(4 * e, 1)) < .002 && (i = t); else {
var n = Math.min(t + .06, .99);
i < n && (i += .025 * e) > n && (i = n);
}
this.img_jindu.fillRange = i;
this.progressBar.getComponentInChildren(cc.Label).string = Math.floor(100 * i) + "% ";
if (t >= 1 && i >= .999 && !this._sceneEntering) {
this._sceneEntering = !0;
cc.assetManager.loadBundle(" game ", function(e, t) {
e || t.loadDir(" prefab ", function() {
g.default.trackLeave(" launch_page ");
u.default.getInstance().loadScene(" lobby ", " lobby ");
});
});
}
}
};
a([ M(sp.Skeleton) ], t.prototype, " sp_logo ", void 0);
a([ M(cc.SpriteFrame) ], t.prototype, " sf_logoarr ", void 0);
a([ M(cc.Node) ], t.prototype, " node_noMac ", void 0);
a([ M(cc.ProgressBar) ], t.prototype, " progressBar ", void 0);
a([ M(cc.Sprite) ], t.prototype, " img_jindu ", void 0);
a([ M(cc.Node) ], t.prototype, " umpNode ", void 0);
a([ M(cc.Node) ], t.prototype, " umpBtnAgree ", void 0);
a([ M(cc.Node) ], t.prototype, " umpBtnClose ", void 0);
return a([ E ], t);
}(cc.Component);
i.default = L;
cc._RF.pop();
