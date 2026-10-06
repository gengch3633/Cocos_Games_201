Launch: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "29161GKIu5K6ZVwNOBwAnw9", "Launch");
var n = __extends, a = __awaiter, o = __generator;
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = e("ArchiveMgr"), s = e("ConfigMgr"), l = e("MultiPlatform"), c = e("UMengManger"), u = e("ResMgr"), d = e("Singleton"), h = e("ClickAudio"), p = e("Tips"), _ = e("./reusable/i18n/LanguageService"), f = function(e) {
function t() {
return null !== e && e.apply(this, arguments) || this;
}
n(t, e);
t.prototype.addSceneChangeHandle = function() {
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLaunchHandle, this);
};
t.prototype.beforeSceneLaunchHandle = function(e) {
var t = e.getComponentInChildren(cc.Canvas), i = t ? t.node : e;
u.default.getInstance().getKeeper(i, !0);
h.default.addClickAudio(i);
};
t.prototype.load = function(e, t, i) {
var n, d = this, h = {
total: 1,
cur: 0
};
h.total += null !== (n = null == t ? void 0 : t.length) && void 0 !== n ? n : 0;
return new Promise(function(n) {
var f = cc.sys.isBrowser, g = cc.sys.isNative;
if (f) {
e.dataSyncToServer = !1;
console.log("浏览器环境下不支持数据同步功能");
}
e.dataSyncToServer && !e.login && (e.login = !0);
c.default.getInstance().enable = e.report;
var m = function() {
h.cur++;
i && i(h.total, h.cur);
if (h.cur >= h.total) {
d.addSceneChangeHandle();
n();
}
};
l.default.getInstance().init(e);
if (f) {
h.total++;
console.log("浏览器环境，跳过平台登录，直接走业务登录/注册");
r.default.getInstance().init(!1).then(function(e) {
console.log("数据存档加载完成,加载结果", e);
e ? m() : p.default.show(_.t("key_tip_archive_load_fail"));
}).catch(function(e) {
console.error("浏览器环境存档初始化失败", e);
m();
});
} else if (g) {
h.total++;
console.log("原生环境，跳过小游戏平台登录");
r.default.getInstance().init(!1).then(function(e) {
console.log("原生环境数据存档加载完成,加载结果", e);
m();
}).catch(function(e) {
console.error("原生环境存档初始化失败", e);
m();
});
} else if (e.login) {
h.total++;
h.total++;
console.log("开始登录");
l.default.getInstance().login().then(function(t) {
if (t) {
m();
console.log("开始加载数据存档");
r.default.getInstance().init(e.dataSyncToServer).then(function(e) {
console.log("数据存档加载完成,加载结果", e);
e ? m() : p.default.show(_.t("key_tip_archive_load_fail"));
});
} else p.default.show(_.t("key_tip_login_fail_network"));
});
}
s.default.getInstance().loadAll(null).then(function(e) {
return a(d, void 0, void 0, function() {
return o(this, function() {
return e ? (console.log("配置文件加载完成"), m(), [ 2 ]) : (p.default.show(_.t("key_tip_config_load_fail")), 
[ 2 ]);
});
});
});
t.forEach(function(e) {
return u.default.getInstance().getBundle(e).then(function(t) {
return a(d, void 0, void 0, function() {
return o(this, function() {
return t ? (console.log("bundle->" + e + " 加载完成"), m(), [ 2 ]) : (p.default.show(_.t("key_tip_resource_load_fail")), 
[ 2 ]);
});
});
});
});
});
};
return t;
}(d.default);
i.default = f;
cc._RF.pop();
}