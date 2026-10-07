let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "c75c4n1BKlBb4TxejjOsWlH", "TimeDataSys");
var n,
i = this&& this.__extends|| (n = function(e, t) {
  return(n = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var o in t) Object.prototype.hasOwnProperty.call(t, o)&& (e[o] = t[o]);
  }
)(e, t);
}
, function(e, t) {
  n(e, t);
  function o() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(o.prototype = t.prototype, new o());
}
);
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var a = e("TimeDataMgr.js"),
r = e("NativeEventType.js"),
l = e("PlayerDataSys.js"),
s = e("EventMgr.js"),
c = e("EngineUtil.js"),
u = function(e) {
  i(t, e);
  function t() {
    var t = e.call(this)|| this;
    t._isStart = null;
    t.game_start_timeStamp = null;
    s.default.listen(r.default.APP_PAUSE, t.appPause, t);
    s.default.listen(r.default.APP_RESTART, t.appRestart, t);
    return t;
  }
  t.prototype.appRestart = function() {
    0 == this.game_start_timeStamp&& (this.game_start_timeStamp = c.default.getTimeStamp());
    this._isStart;
  }
;
  t.prototype.saveTime = function() {
    var e = this.readGameTime()+ this.getGameTime();
    c.default.localStorageSetItem(this.getLSKey(), String(e));
  }
;
  t.prototype.setTimerStart = function(e) {
    this._isStart = e;
  }
;
  t.prototype.appPause = function() {
    if(this._isStart) {
      this.saveTime();
      this.game_start_timeStamp = 0;
    }
  }
;
  t._getInstance = function() {
    t._instance|| (t._instance = new t());
    return t._instance;
  }
;
  t.prototype.getGameTime = function() {
    return c.default.getTimeStamp()- this.game_start_timeStamp;
  }
;
  t.prototype.resetGameTime = function() {
    this.game_start_timeStamp = c.default.getTimeStamp();
    this.clearTimeLS();
  }
;
  t.prototype.getLSKey = function() {
    return l.default.user_level+ "_ptime";
  }
;
  t.prototype.clearTimeLS = function() {
    c.default.localStorageSetItem(this.getLSKey(), "0");
  }
;
  t.prototype.getTimeCuration = function(e) {
    var t = this.readGameTime()+ this.getGameTime();
    console.log("本次挑战时长(秒)："+ t);
    if(e) {
      this._isStart = ! 1;
      this.clearTimeLS();
    }
    return t;
  }
;
  t.prototype.restartTimer = function() {
    this._isStart = ! 0;
    this.game_start_timeStamp = c.default.getTimeStamp();
  }
;
  t.prototype.readGameTime = function() {
    var e = Number(c.default.localStorageGetItem(this.getLSKey(), "0"));
    e > 10800&& (e = 0);
    return e;
  }
;
  return t;
}
(a.default);
o.default = u._getInstance();
cc._RF.pop();
