var n = {
  WX_LOGIN_REQUIRED:- 8888,
  SHOW_TOAST:- 1012,
  USER_INFO_IGNORE:- 777
}
;
function a(e, t, i) {
  return function(n) {
    t&& e.onReconnectFail();
    e.handleHttpErr(n, function(e) {
      return i(e);
    }
);
  }
;
}
function o(e) {
  var t = e.deps,
  i = e.runtime,
  o = function(e) {
    i.report("page_loading_autoLogin_start");
    i.report("autoLogin_start", {
      timeStemp: new Date().getTime()
    }
);
    t.requestAutoLogin(t.getAutoLoginPayload(), function(n) {
      var a;
      i.report("autoLogin_end", {
        timeStemp: new Date().getTime()
      }
);
      var o = (null === (a = null == n? void 0: n.data)|| void 0 === a? void 0: a.yid)|| "";
      e&& t.emitCloseReconnect();
      if(o) {
        i.report("page_loading_autoLogin_success");
        i.report("register_success", {
          login_type: "auto"
        }
);
        t.applyUserId(n.data);
        s();
      } else {
        i.report("u_login_page_show");
        r();
      }
    }
, function(n) {
      if(t.isPermanentLogoutError(n)) {
        i.report("register_fail", {
          login_type: "auto", err_code: n&& void 0 !== n.code? n.code: "", err_msg: n&& n.message? n.message: ""
        }
);
        t.showToast(n.message);
      } else a(t, e, o)(n);
    }
);
  }
,
  r = function(e) {
    i.report("page_loading_touristsLogin");
    t.requestTouristsLogin(t.getTouristsLoginPayload(), function(a) {
      e&& t.emitCloseReconnect();
      i.report("page_loading_touristsLogin_res", a);
      if(a.code !== n.WX_LOGIN_REQUIRED) if(a.code !== n.SHOW_TOAST) {
        i.report("register_success", {
          login_type: "tourists"
        }
);
        t.applyUserId(a.data);
        s();
      } else {
        i.report("register_fail", {
          login_type: "tourists", err_code: a.code, err_msg: a.message|| ""
        }
);
        t.showToast(a.message);
      } else {
        i.report("u_show_wx_login");
        i.onShowWxLogin&& i.onShowWxLogin();
      }
    }
, a(t, e, r));
  }
,
  s = function(e) {
    i.report("page_loading_getSystemConfig");
    t.requestSystemConfig(function(n) {
      i.report("page_loading_getSystemConfig_res", {
        code: n.code
      }
);
      e&& t.onReconnectSuccess();
      t.applySystemConfig(n.data);
      l();
    }
, a(t, e, s));
  }
,
  l = function(e) {
    i.report("page_loading_getGameConfig");
    t.requestGameConfig(function(n) {
      e&& t.onReconnectSuccess();
      i.report("page_loading_getGameConfig_res", {
        code: n.code
      }
);
      t.applyGameConfig(n.data);
      c();
    }
, a(t, e, l));
  }
,
  c = function(e) {
    i.report("page_loading_getUserInfo");
    t.requestUserInfo(function(a) {
      i.report("page_loading_getUserInfo_code", {
        code: a.code
      }
);
      if(! a|| a.code !== n.USER_INFO_IGNORE) {
        e&& t.onReconnectSuccess();
        t.applyUserInfo(a.data);
        t.applyMiddleFunds();
        i.onLoginReady();
      }
    }
, a(t, e, c));
  }
;
  return {
    start: function() {
      return o();
    }
  }
;
}
function r(e) {
  var t = e.deps,
  i = e.runtime,
  n = function() {
    t.afterFinish();
    i.report("page_loading_finishInit");
    i.onFinish();
  }
,
  a = function() {
    i.report("page_loading_check_HP");
    var e = t.getCurrentBaseVersion(),
    a = t.buildManifestUrl(e);
    t.loadRemoteManifest(a, function(e, a) {
      if(e) n();
      else {
        i.report("page_loading_getManifest");
        t.initManifest(null == a? void 0: a._nativeAsset);
        i.report("page_loading_hotUpdate");
        var o = t.buildVersionRequest();
        t.checkGrayUpdate(o.url, o.body, function(e) {
          if(e) {
            i.report("page_loading_canUpdate");
            t.runHotUpdate(function(e, a) {
              if(e < 0) {
                i.onUpdateProgress(.5);
                i.report("page_loading_finish_up");
                n();
              } else t.isProgressEvent(a)&& i.onUpdateProgress(t.getProgressPercent(a));
            }
);
          } else {
            i.report("page_loading_notUpdate");
            n();
          }
        }
);
      }
    }
);
  }
;
  return {
    start: function() {
      if(t.isHotUpdateEnabled()) a();
      else {
        i.report("page_loading_No_HP");
        n();
      }
    }
  }
;
}
export function createLoadingProjectAdapterOverrides(e) {
  return {
    bootstrap: e.bootstrap,
    sceneProgress: e.sceneProgress,
    sdk: e.sdk,
    agreement: e.agreement,
    lifecycle: e.lifecycle,
    baseFlow: {
      startFlow: function(t) {
        o({
          deps: e.baseFlow, runtime: t
        }
).start();
      }
    }
,
    hotUpdate: {
      start: function(t) {
        r({
          deps: e.hotUpdate, runtime: t
        }
).start();
      }
    }
  }
;
}
;
