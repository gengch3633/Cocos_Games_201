let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "9f2ecuYCEBLMaVJtSX+cCvw", "LoadingProjectAdaptersBridge");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
function n(e) {
  try {
    return JSON.stringify(e);
  } catch(t) {
    return String(e);
  }
}
function a(e) {
  var t = {
    type: Object.prototype.toString.call(e),
    asString: String(e),
    name: "",
    message: "",
    stack: "",
    keys:[],
    rawJson: ""
  }
;
  if(e&& "object" == typeof e) {
    try {
      t.name = e.name|| "";
    } catch(e) {
    }
    try {
      t.message = e.message|| "";
    } catch(e) {
    }
    try {
      t.stack = e.stack|| "";
    } catch(e) {
    }
    try {
      t.keys = Object.keys(e);
    } catch(e) {
    }
    try {
      t.rawJson = n(e);
    } catch(e) {
    }
  }
  return t;
}
function o(e, t) {
  var i = a(t);
  console.error(e, "summary =>", i.asString);
  console.error(e, "detail =>", n(i));
  console.error(e, "raw =>", t);
}
i.initProjectLoadingAdapters = function() {
  try {
    var t = e("loading-project-adapters.js");
    t&& t.initProjectLoadingAdapters&& t.initProjectLoadingAdapters();
  } catch(e) {
    o("[LoadingProjectAdaptersBridge] init failed", e);
  }
}
;
i.initSystem = function() {
  try {
    var t = e("PlatformBridge.js"),
    i = e("ClientDataStore.js"),
    n = e("PlayerDataStore.js");
    if(t&& t.default&& i&& i.default) {
      var a = t.default.getClientInfo();
      console.log("[LoadingProjectAdaptersBridge] initSystem clientInfo type=", Object.prototype.toString.call(a));
      i.default.init(a);
    }
    if(n&& n.default) {
      var r = "";
      try {
        r = cc.sys.localStorage.getItem("yid")|| "";
      } catch(e) {
      }
      "yid_read_fail" !== r&& "yid_read_failed" !== r|| (r = "");
      n.default.initUserId({
        yid: r
      }
);
    }
  } catch(e) {
    o("[LoadingProjectAdaptersBridge] initSystem failed", e);
  }
}
;
i.runMiddleCountry = function(t, i, n, a) {
  var r,
  s = "[LoadingProjectAdaptersBridge.runMiddleCountry]",
  l = "MB_CACHE_ATTR_COUNTRY",
  c = "MB_CACHE_ATTR_COUNTRY_UPDATE_AT",
  u = "MB_CACHE_UMP_HANDLED_";
  function d(e) {
    if(! e) return "";
    var t = String(e).toUpperCase();
    return "GB" === t? "UK": t;
  }
  function h(e) {
    var t = d(e);
    if(! t) return "";
    try {
      cc.sys.localStorage.setItem(l, t);
      cc.sys.localStorage.setItem(c, String(Date.now()));
    } catch(e) {
      console.warn(s, "persistCountry fail", e);
    }
    return t;
  }
  function p(e, t) {
    var i = d(t);
    if(! i) return "";
    if(! e) return i;
    try {
      e.local_country = i;
    } catch(e) {
      o(s+ " applyCountryToClient set local_country failed", e);
    }
    try {
      "function" == typeof e.buildCommonUrlStr&& e.buildCommonUrlStr();
    } catch(e) {
      o(s+ " applyCountryToClient buildCommonUrlStr failed", e);
    }
    try {
      "function" == typeof e.buildMiddleCommonUrlStr&& e.buildMiddleCommonUrlStr();
    } catch(e) {
      o(s+ " applyCountryToClient buildMiddleCommonUrlStr failed", e);
    }
    return i;
  }
  function _(e) {
    var t = "";
    try {
      t = e&& e.box_pkg_name? String(e.box_pkg_name): "";
    } catch(e) {
    }
    return u+(t|| "default");
  }
  function f(e) {
    try {
      return "1" === cc.sys.localStorage.getItem(_(e));
    } catch(e) {
      console.warn(s, "hasHandledUmp read fail", e);
      return ! 1;
    }
  }
  function g(e) {
    try {
      cc.sys.localStorage.setItem(_(e), "1");
    } catch(e) {
      console.warn(s, "markUmpHandled write fail", e);
    }
  }
  try {
    var m = function(e, t) {
      if(A) console.warn(s, "重复 "+ e+ " 回调，忽略。");
      else if(R) console.warn(s, "UMP 仍在展示，忽略 "+ e+ " 回调。");
      else {
        A = ! 0;
        if("enter" === e) try {
          var i = b&& b.default&& "function" == typeof b.default.getInstance? b.default.getInstance(): null;
          if(i&& "function" == typeof i.middleTFRegional) {
            console.log(s, "middleTFRegional start");
            i.middleTFRegional();
          }
          if(i&& "function" == typeof i.autoUploadEvent) {
            console.log(s, "autoUploadEvent start");
            i.autoUploadEvent("default-timer");
          }
        } catch(e) {
          o(s+ " middleTFRegional failed", e);
        }
        var n = P[e];
        n&& n(t);
      }
    }
,
    y = function() {
      var e = T|| I;
      e = h(e)|| e;
      S&& e&& p(S, e);
      v&& v.default&& "function" == typeof v.default.saveLocalCountry&& e&& v.default.saveLocalCountry(e);
      return e;
    }
;
    console.log("runMiddleCountry");
    var v = e("MiddleHelper.js"),
    b = e("MiddleManager.js"),
    w = e("ClientDataStore.js"),
    k = e("BusinessAnalyticsService.js");
    console.log(s, "module loaded", {
      hasMiddleHelper: ! ! v, hasMiddleHelperDefault: !(! v|| ! v.default), hasClientDataStore: ! ! w, hasClientDataStoreDefault: !(! w|| ! w.default), hasBusinessAnalyticsService: ! ! k, hasBusinessAnalyticsServiceDefault: !(! k|| ! k.default)
    }
);
    var S = w&& w.default? w.default: null,
    C = k&& k.default? k.default: null,
    T = function() {
      try {
        return d(cc.sys.localStorage.getItem(l));
      } catch(e) {
        console.warn(s, "readCachedCountry fail", e);
        return "";
      }
    }
();
    if(S) {
      var N = p(S, T);
      N&& console.log(s, "启动应用归因缓存 local_country =", N);
    }
    var I = "";
    S&& S.local_country&& (I = d(S.local_country));
    I|| (I = (r = cc.sys.language, {
      zh: "CN", en: "US", id: "ID", pt: "BR", ru: "RU", de: "DE", fr: "FR", es: "MX", hi: "IN", th: "TH", ja: "JP", ko: "KR", fil: "PH", tl: "PH"
    }
[String(r|| "").toLowerCase()]|| "IN"));
    var A = ! 1,
    R = ! 1,
    P = {
      enter: t,
      ban: i,
      backstop: n
    }
;
    if(v&& v.default) {
      var E = v.default;
      console.log(s, "helper state", {
        hasMiddleCountry: !(! E|| "function" != typeof E.middleCountry), hasLocalCountry: !(! E|| "function" != typeof E.localCountry), hasSaveLocalCountry: !(! E|| "function" != typeof E.saveLocalCountry)
      }
);
      if(! E|| "function" != typeof E.middleCountry) throw new Error("middleHelper.middleCountry is not a function");
      E.middleCountry(function(e) {
        var t = "";
        "function" == typeof E.localCountry&& (t = d(E.localCountry()));
! t&& S&& (t = d(S.local_country));
        t = h(t)|| t;
        S&& t&& p(S, t);
        console.log(s, "归因成功，更新缓存 country =", t|| "N/A");
        var i = !(! e|| ! 0 !== e.is_ump|| ! 0 !== e.is_ump_country), n = f(S);
        console.log(s, "UMP判定 needShowUmp =", i, "alreadyHandledUmp =", n);
        if(i&& n) m("enter", e);
        else if(i&& a) {
          C&& C.reportData&& C.reportData("page_loading_show_ump");
          R = ! 0;
          try {
            var o = ! 1;
            a(function(t) {
              if(o) console.warn(s, "UMP 回调重复触发，忽略。");
              else {
                o = ! 0;
                R = ! 1;
                g(S);
                t? m("enter", e): m("backstop", {
                  reason: "ump_reject"
                }
);
              }
            }
);
          } catch(e) {
            R = ! 1;
            m("backstop", e);
          }
        } else m("enter", e);
      }
, function(e) {
        m("ban", e);
      }
, function(e) {
        var t = y();
        console.warn(s, "归因失败，使用默认国家 country =", t|| "IN");
        m("backstop", e);
      }
);
    } else {
      if(S) {
        var M = y();
        console.warn(s, "middleHelper 不可用，使用默认国家 country =", M|| "IN");
      }
      m("backstop");
    }
  } catch(e) {
    o("[LoadingProjectAdaptersBridge] runMiddleCountry failed", e);
    try {
      n&& n(e);
    } catch(e) {
      o("[LoadingProjectAdaptersBridge] runMiddleCountry onBackstop failed", e);
    }
  }
}
;
i.runBaseFlow = function(t, i, n) {
  var a = "[LoadingProjectAdaptersBridge.runBaseFlow]",
  r = "function" == typeof n? n: function() {
  }
;
  try {
    var s = function(e, t) {
      if(null != t) try {
        cc.sys.localStorage.setItem(e, JSON.stringify(t));
      } catch(t) {
        console.warn(a, "setCache fail", e, t);
      }
    }
,
    l = function(e) {
      try {
        var t = cc.sys.localStorage.getItem(e);
        return t? JSON.parse(t): null;
      } catch(t) {
        console.warn(a, "getCache fail", e, t);
        return null;
      }
    }
,
    c = function(e, i) {
      i? console.warn(a, e, i): console.warn(a, e);
      t&& t();
    }
,
    u = e("LoadingHttpService.js"),
    d = e("SystemDataStore.js"),
    h = e("PlayerDataStore.js"),
    p = e("GameConfigStore.js"),
    _ = e("LanguageHelper.js"),
    f = e("LanguageService.js"),
    g = e("ClientDataStore.js"),
    m = e("Handler.js"),
    y = e("NetErrorPopupService.js"),
    v = e("BusinessAnalyticsService.js"),
    b = v&& (v.default|| v),
    w = u.default,
    k = m.default,
    S = y.default|| y,
    C = function(e, t) {
      try {
        b&& "function" == typeof b.reportData&& b.reportData(e, t|| {
        }
);
      } catch(t) {
        console.warn(a, "report fail", e, t);
      }
    }
;
    w.init(function(e, t) {
      console.warn(a, "HTTP 请求失败，自动重试", e);
      t&& t();
    }
);
    var T = {
      SYSTEM_CONFIG: "MB_CACHE_SYSTEM_CONFIG",
      LOGIN_USER_ID: "MB_CACHE_LOGIN_USER_ID",
      GAME_CONFIG: "MB_CACHE_GAME_CONFIG",
      USER_INFO: "MB_CACHE_USER_INFO"
    }
,
    N = function i() {
      console.log(a, "getUserInfo");
      C("page_loading_getUserInfo");
      w.getUserInfo(k.create(null, function(n) {
        C("page_loading_getUserInfo_code", {
          code: n&& n.code
        }
);
        if(S&& S.shouldPop(n)) {
          console.warn(a, "getUserInfo force-retry code=", n&& n.code);
          S.showAndRetry(i);
        } else {
          console.log(a, "getUserInfo success", JSON.stringify(n));
          h.default.init(n.data);
          s(T.USER_INFO, n.data);
          try {
            e(UserInfoService "
} ].js).default.getInstance()._applyToUserData(n.data);
} catch (e) {
console.warn(a, " UserData 同步失败 ", e);
}
r(" userInfo ");
console.log(a, " 登录流程完成 ， 进入游戏 ");
t && t();
}
}), k.create(null, function(e) {
console.error(a, " getUserInfo fail ", e);
var n = l(T.USER_INFO);
if (n) {
console.warn(a, " getUserInfo 使用缓存 ");
h.default.init(n);
r(" userInfo ");
t && t();
} else if (S && S.shouldPop(e)) {
console.warn(a, " getUserInfo 无缓存+ 网络异常 ， 弹重试窗 ");
S.showAndRetry(i);
} else {
r(" userInfo ");
c(" getUserInfo 无缓存 ， 兜底进入游戏 ", e);
}
}));
}, I = function e() {
console.log(a, " getGameConfig ");
C(" page_loading_getGameConfig ");
w.getGameConfig(k.create(null, function(t) {
C(" page_loading_getGameConfig_res ", {
code: t && t.code
});
if (S && S.shouldPop(t)) {
console.warn(a, " getGameConfig force- retry code = ", t && t.code);
S.showAndRetry(e);
} else {
console.log(a, " getGameConfig success ", JSON.stringify(t));
p.default.init(t.data);
s(T.GAME_CONFIG, t.data);
r(" gameConfig ");
N();
}
}), k.create(null, function(t) {
console.error(a, " getGameConfig fail ", t);
var i = l(T.GAME_CONFIG);
if (i) {
console.warn(a, " getGameConfig 使用缓存 ");
p.default.init(i);
r(" gameConfig ");
N();
} else if (S && S.shouldPop(t)) {
console.warn(a, " getGameConfig 无缓存+ 网络异常 ， 弹重试窗 ");
S.showAndRetry(e);
} else {
console.warn(a, " getGameConfig 无缓存 ， 继续 getUserInfo ");
r(" gameConfig ");
N();
}
}));
}, A = function e() {
console.log(a, " touristsLogin ");
C(" page_loading_touristsLogin ");
w.touristsLogin(null, k.create(null, function(t) {
C(" page_loading_touristsLogin_res ", t);
if (S && S.shouldPop(t)) {
console.warn(a, " touristsLogin force- retry code = ", t && t.code);
S.showAndRetry(e);
} else {
console.log(a, " touristsLogin success ", JSON.stringify(t));
C(" register_success ", {
login_type: " tourists "
});
h.default.initUserId(t.data);
s(T.LOGIN_USER_ID, t.data);
r(" login ");
R();
}
}), k.create(null, function(t) {
var i = " ";
try {
i = JSON.stringify(t);
} catch (e) {
i = String(t);
}
console.error(a, " touristsLogin fail json = ", i);
var n = l(T.LOGIN_USER_ID);
if (n && n.yid) {
console.warn(a, " touristsLogin 使用缓存登录态 ");
h.default.initUserId(n);
r(" login ");
R();
} else if (S && S.shouldPop(t)) {
console.warn(a, " touristsLogin 无缓存+ 网络异常 ， 弹重试窗 ");
S.showAndRetry(e);
} else {
C(" register_fail ", {
login_type: " tourists ",
err_code: t && void 0 !== t.code ? t.code : " ",
err_msg: t && t.message ? t.message : " "
});
console.warn(a, " touristsLogin 无缓存登录态 ， 继续拉配置 ");
r(" login ");
R();
}
}));
}, R = function e() {
console.log(a, " getSystemConfig ");
C(" page_loading_getSystemConfig ");
w.getSystemConfig(k.create(null, function(t) {
C(" page_loading_getSystemConfig_res ", {
code: t && t.code
});
if (S && S.shouldPop(t)) {
console.warn(a, " getSystemConfig force- retry code = ", t && t.code);
S.showAndRetry(e);
} else {
console.log(a, " getSystemConfig success ", JSON.stringify(t));
d.default.init_config(t.data);
s(T.SYSTEM_CONFIG, t.data);
try {
_.default.setType(g.default.local_country);
f.setByCountryCode(g.default.local_country);
} catch (e) {
console.error(a, " LanguageHelper.setType fail(continue) ", e);
}
r(" systemConfig ");
I();
}
}), k.create(null, function(e) {
console.error(a, " getSystemConfig fail ", e);
var t = l(T.SYSTEM_CONFIG);
if (t) {
console.warn(a, " getSystemConfig 使用缓存 ");
d.default.init_config(t);
try {
_.default.setType(g.default.local_country);
f.setByCountryCode(g.default.local_country);
} catch (e) {
console.error(a, " LanguageHelper.setType fail(continue) ", e);
}
r(" systemConfig ");
I();
} else {
console.warn(a, " getSystemConfig 无缓存 ， 继续 autoLogin ");
try {
_.default.setType(g.default.local_country);
f.setByCountryCode(g.default.local_country);
} catch (e) {
console.error(a, " LanguageHelper.setType fail(continue) ", e);
}
r(" systemConfig ");
I();
}
}));
};
(function e() {
console.log(a, " autoLogin ");
C(" page_loading_autoLogin_start ");
C(" autoLogin_start ", {
timeStemp: Date.now()
});
w.autoLogin(null, k.create(null, function(t) {
C(" autoLogin_end ", {
timeStemp: Date.now()
});
if (S && S.shouldPop(t)) {
console.warn(a, " autoLogin force- retry code = ", t && t.code);
S.showAndRetry(e);
} else {
var i = " ";
try {
i = JSON.stringify(t);
} catch (e) {
i = "[json stringify failed] ";
}
console.log(a, " autoLogin success yid = ", t && t.data && t.data.yid, " res_json = ", i);
if (t && t.data && t.data.yid) {
C(" page_loading_autoLogin_success ");
C(" register_success ", {
login_type: " auto "
});
h.default.initUserId(t.data);
s(T.LOGIN_USER_ID, t.data);
r(" login ");
R();
} else {
C(" u_login_page_show ");
A();
}
}
}), k.create(null, function(e) {
C(" autoLogin_end ", {
timeStemp: Date.now()
});
console.error(a, " autoLogin fail ", e);
A();
}));
})();
} catch (e) {
o(a + " runBaseFlow 初始化失败 ", e);
i ? i(e) : t && t();
}
};
cc._RF.pop();
