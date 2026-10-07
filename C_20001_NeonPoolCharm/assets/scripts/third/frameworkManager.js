let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f6e46+xOIxLwbJdOwPbgvjh", "frameworkManager");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e("HotUpdate.js"),
i = e("SystemConfig.js"),
a = e("PageMgr.js"),
r = e("EventMgr.js"),
l = e("GameEventType.js"),
s = e("SdkHelper.js"),
c = function() {
  function e() {
  }
  e.prototype.error = function() {
    for(var e = [], t = 0;
    t < arguments.length;
    t++) e[t] = arguments[t];
    if(! n.default.getInstance().isOnlineRelease()) if(cc.sys.isNative) try {
      console.error(i.GAME_NAME, JSON.stringify(e));
    } catch(e) {
      console.error(i.GAME_NAME, e);
    } else console.error(i.GAME_NAME, e);
  }
;
  e.prototype.httpErr = function(e) {
    this.log(e);
    s.default.showToast(i18n.t("network_toast"));
    s.default.reportData("httpErr", {
      response: JSON.stringify(e)
    }
);
  }
;
  e.prototype.reconnectFai = function() {
    a.default.hidePage("LoadingPage");
  }
;
  e.prototype.log = function() {
    for(var e = [], t = 0;
    t < arguments.length;
    t++) e[t] = arguments[t];
    if(cc.sys.isNative) try {
      console.log(i.GAME_NAME, JSON.stringify(e));
    } catch(e) {
      console.error(i.GAME_NAME, e);
    } else console.log(i.GAME_NAME, e);
  }
;
  e._getInterface = function() {
    e._interface|| (e._interface = new e());
    return e._interface;
  }
;
  e.prototype.reconnectSuc = function() {
    a.default.hidePage("LoadingPage");
    r.default.trigger(l.default.CLOSE_RECONNECT);
  }
;
  e._interface = null;
  return e;
}
();
o.default = c._getInterface();
cc._RF.pop();
