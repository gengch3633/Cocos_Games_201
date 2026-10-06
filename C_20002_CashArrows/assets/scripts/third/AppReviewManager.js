let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "eb23fO2yqtFyJAKHBJXmF8C", "AppReviewManager");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = "[AppReviewManager]";
function a(t) {
  var i = e(t);
  return i&& i.default? i.default: i;
}
function o(e, t) {
  try {
    var i = a("../migration-bundle/business-common/report/BusinessAnalyticsService");
    i&& i.reportData&& i.reportData(e, t|| {
    }
);
  } catch(t) {
    console.warn(n+ " report failed", e, t);
  }
}
var r = function() {
  function e() {
    this._inited = ! 1;
    this._resumeTs = 0;
    this._state = null;
  }
  e.getInstance = function() {
    e._instance|| (e._instance = new e());
    return e._instance;
  }
;
  e.prototype._storageKey = function() {
    var e = a("Common");
    return(e&& e.version? e.version: "1.0.0")+ "_arrow_app_review";
  }
;
  e.prototype._load = function() {
    var e = {
      passCount: 0,
      playSeconds: 0,
      shownCount: 0,
      lastShownTs: 0,
      jumped: ! 1
    }
;
    try {
      var t = cc.sys.localStorage.getItem(this._storageKey());
      if(t) {
        var i = JSON.parse(t);
        if(i&& "object" == typeof i) {
          e.passCount = Number(i.passCount)|| 0;
          e.playSeconds = Number(i.playSeconds)|| 0;
          e.shownCount = Number(i.shownCount)|| 0;
          e.lastShownTs = Number(i.lastShownTs)|| 0;
          e.jumped = ! ! i.jumped;
        }
      }
    } catch(e) {
      console.warn(n+ " load failed", e);
    }
    this._state = e;
    console.log(n+ " _load state="+ JSON.stringify(e)+ " key="+ this._storageKey());
  }
;
  e.prototype._save = function() {
    if(this._state) try {
      cc.sys.localStorage.setItem(this._storageKey(), JSON.stringify(this._state));
    } catch(e) {
      console.warn(n+ " save failed", e);
    }
  }
;
  e.prototype._flushPlayTime = function() {
    if(this._state) {
      var e = Date.now();
      this._resumeTs > 0&& e > this._resumeTs&& (this._state.playSeconds+= (e- this._resumeTs)/ 1e3);
      this._resumeTs = e;
      this._save();
    }
  }
;
  e.prototype._currentPlaySeconds = function() {
    if(! this._state) return 0;
    var e = 0,
    t = Date.now();
    this._resumeTs > 0&& t > this._resumeTs&& (e = (t- this._resumeTs)/ 1e3);
    return this._state.playSeconds+ e;
  }
;
  e.prototype.init = function() {
    if(! this._inited) {
      this._inited = ! 0;
      this._load();
      this._resumeTs = Date.now();
      var e = this;
      cc.game.on(cc.game.EVENT_HIDE, function() {
        e._flushPlayTime();
        console.log(n+ " EVENT_HIDE flush playSeconds="+ Math.floor(e._currentPlaySeconds()));
      }
);
      cc.game.on(cc.game.EVENT_SHOW, function() {
        e._resumeTs = Date.now();
        console.log(n+ " EVENT_SHOW resume timing");
      }
);
      var t = a("GlobalEventMgr"),
      i = a("InterfaceMgr");
      t.getInstance().on(i.gameEvent.gameNext, this.onLevelPassed, this);
      console.log(n+ " inited thresholds{ MIN_PASS=5, MIN_SECONDS=120, MAX_SHOW=1, COOLDOWN_DAYS=3 } state="+ JSON.stringify(this._state));
    }
  }
;
  e.prototype.onLevelPassed = function() {
    if(this._state) {
      this._state.passCount+= 1;
      this._flushPlayTime();
      console.log(n+ " onLevelPassed passCount="+ this._state.passCount+ " playSeconds="+ Math.floor(this._currentPlaySeconds()));
      this._tryTrigger();
    }
  }
;
  e.prototype._isFeatureEnabled = function() {
    try {
      var e = cc.sys.localStorage.getItem("MB_APP_REVIEW_ENABLED");
      if("0" === e) {
        console.log(n+ " config(localStorage) app_review_enabled=0 -> enabled=false");
        return ! 1;
      }
      if("1" === e) {
        console.log(n+ " config(localStorage) app_review_enabled=1 -> enabled=true");
        return ! 0;
      }
      console.log(n+ " config app_review_enabled not set yet(v="+ e+ "), default enabled=true");
    } catch(e) {
      console.warn(n+ " read app_review config failed", e);
    }
    return ! 0;
  }
;
  e.prototype._canShow = function() {
    var e = this._state;
    if(! e) {
      console.log(n+ " _canShow=false reason=no_state");
      return ! 1;
    }
    var t = Math.floor(this._currentPlaySeconds()),
    i = e.lastShownTs > 0? 2592e5-(Date.now()- e.lastShownTs): 0;
    console.log(n+ " _canShow check -> enabled="+ this._isFeatureEnabled()+ " jumped="+ e.jumped+ " shownCount="+ e.shownCount+ "/1 passCount="+ e.passCount+ "/5 playSeconds="+ t+ "/120 cooldownLeftMs="+(i > 0? i: 0));
    if(! this._isFeatureEnabled()) {
      console.log(n+ " _canShow=false reason=feature_disabled(config app_review_enabled=0)");
      return ! 1;
    }
    if(e.jumped) {
      console.log(n+ " _canShow=false reason=already_jumped");
      return ! 1;
    }
    if(e.shownCount >= 1) {
      console.log(n+ " _canShow=false reason=reach_max_show shownCount="+ e.shownCount+ " max=1");
      return ! 1;
    }
    if(e.passCount < 5) {
      console.log(n+ " _canShow=false reason=pass_not_enough passCount="+ e.passCount+ " need=5");
      return ! 1;
    }
    if(t < 120) {
      console.log(n+ " _canShow=false reason=playtime_not_enough playSeconds="+ t+ " need=120");
      return ! 1;
    }
    if(e.lastShownTs > 0&& Date.now()- e.lastShownTs < 2592e5) {
      console.log(n+ " _canShow=false reason=in_cooldown leftMs="+ i);
      return ! 1;
    }
    console.log(n+ " _canShow=true -> will show review dialog");
    return ! 0;
  }
;
  e.prototype._tryTrigger = function() {
    if(this._canShow()) {
      var e = a("UIMgr"),
      t = a("UIDefine").appReviewView;
      if(t) {
        console.log(n+ " show appReviewView");
        this._state.shownCount+= 1;
        this._state.lastShownTs = Date.now();
        this._save();
        o("app_review_show", {
          pass_count: this._state.passCount, play_seconds: Math.floor(this._currentPlaySeconds()), shown_count: this._state.shownCount
        }
);
        var i = e.getInstance().show(t);
        i&& "function" == typeof i.then&& i.then(function() {
        }
).catch(function(e) {
          console.warn(n+ " show appReviewView failed", e);
        }
);
      } else console.warn(n+ " appReviewView config missing");
    }
  }
;
  e.prototype.markJumped = function() {
    console.log(n+ " markJumped -> set jumped=true, never show again, jump google play");
    if(this._state) {
      this._state.jumped = ! 0;
      this._save();
    }
    this._callNativeReview();
  }
;
  e.prototype._callNativeReview = function() {
    try {
      var e = a("../migration-bundle/src/framework/Platform/NativeSdkBridgeAdapter"),
      t = e&& "function" == typeof e.getBridge? e.getBridge(): null;
      if(t&& "function" == typeof t.showAppReview) {
        t.showAppReview();
        console.log(n+ " showAppReview invoked");
        return;
      }
      console.warn(n+ " native showAppReview unavailable");
    } catch(e) {
      console.error(n+ " _callNativeReview failed", e);
    }
  }
;
  return e;
}
();
i.default = r;
t.exports = r;
t.exports.default = r;
cc._RF.pop();
