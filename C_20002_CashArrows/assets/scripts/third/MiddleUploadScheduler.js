let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "1180f49ArJEP4O1pc0nmhTq", "MiddleUploadScheduler");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e(e) {
    this.lastUploadTime = 0;
    this.clickTimer = null;
    this.uploadTimer = null;
    this.isClickMode = ! 1;
    this.deps = e;
    this.log("init");
    this.initClickListener();
    this.startDefaultUploadTimer();
  }
  e.prototype.log = function(t, i) {
    if(void 0 !== i) {
      var n = "";
      try {
        n = JSON.stringify(i);
      } catch(e) {
        n = String(i);
      }
      console.log(e.LOG_TAG+ " "+ t+ " "+ n);
    } else console.log(e.LOG_TAG+ " "+ t);
  }
;
  e.prototype.markUploadTriggered = function() {
    this.lastUploadTime = Date.now();
    this.log("markUploadTriggered", {
      lastUploadTime: this.lastUploadTime
    }
);
  }
;
  e.prototype.refreshTimerByMode = function() {
    this.isClickMode? this.startClickModeTimer(): this.startDefaultUploadTimer();
  }
;
  e.prototype.destroy = function() {
    cc.director.off(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
    var e = cc.Canvas.instance&& cc.Canvas.instance.node;
    if(e) {
      e.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
      e.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
    if(this.clickTimer) {
      clearInterval(this.clickTimer);
      this.clickTimer = null;
    }
    if(this.uploadTimer) {
      clearInterval(this.uploadTimer);
      this.uploadTimer = null;
    }
  }
;
  e.prototype.initClickListener = function() {
    cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLoaded, this);
    this.onSceneLoaded();
  }
;
  e.prototype.onSceneLoaded = function() {
    var e = cc.Canvas.instance&& cc.Canvas.instance.node;
    if(e) {
      e.off(cc.Node.EventType.TOUCH_START, this.onClick, this);
      e.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
      e.on(cc.Node.EventType.TOUCH_START, this.onClick, this);
      e.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
  }
;
  e.prototype.startDefaultUploadTimer = function() {
    var e = this;
    if(this.deps.isReady()) {
      if(this.uploadTimer) {
        clearInterval(this.uploadTimer);
        this.uploadTimer = null;
      }
      var t = this.getSafeIntervalSeconds();
      this.log("startDefaultUploadTimer", {
        intervalSeconds: t
      }
);
      this.uploadTimer = setInterval(function() {
        if(! e.isClickMode) {
          var i = Date.now()- e.lastUploadTime, n = 4e3* t;
          i >= n? e.triggerUpload("default-timer"): e.log("default timer tick skipped", {
            elapsedMs: i, thresholdMs: n, intervalSeconds: t
          }
);
        }
      }
, 1e3* t);
    } else this.log("startDefaultUploadTimer skipped(not ready)");
  }
;
  e.prototype.startClickModeTimer = function() {
    var e = this;
    if(this.clickTimer) {
      clearInterval(this.clickTimer);
      this.clickTimer = null;
    }
    var t = this.getSafeIntervalSeconds();
    this.log("startClickModeTimer", {
      intervalSeconds: t
    }
);
    this.clickTimer = setInterval(function() {
      e.triggerUpload("click-timer");
    }
, 1e3* t);
  }
;
  e.prototype.onClick = function() {
    if(this.deps.isReady()) {
      var e = Date.now();
      if(! this.isClickMode) {
        this.isClickMode = ! 0;
        this.log("switch to click mode");
        this.startClickModeTimer();
      }
      var t = this.getSafeIntervalSeconds(),
      i = e- this.lastUploadTime,
      n = 1e3* t;
      i >= n? this.triggerUpload("click-immediate"): this.log("click immediate skipped", {
        elapsedMs: i, thresholdMs: n, intervalSeconds: t
      }
);
    } else this.log("onClick ignored(not ready)");
  }
;
  e.prototype.triggerUpload = function(e) {
    this.lastUploadTime = Date.now();
    this.log("triggerUpload", {
      source: e, triggerAt: this.lastUploadTime
    }
);
    this.deps.uploadNow(e);
  }
;
  e.prototype.getSafeIntervalSeconds = function() {
    var e = Number(this.deps.getIntervalSeconds());
    return ! isNaN(e)&& e > 0? e: 60;
  }
;
  e.LOG_TAG = "[MiddleUploadScheduler]";
  return e;
}
();
i.default = n;
cc._RF.pop();
