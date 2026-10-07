let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "6df43N4RKFAe7e6vjJJTsP4", "TimeDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = function() {
  function e() {
    this._pauseTimeStamp = 0;
    this._prevPauseTime = 0;
    this._game_start_timeStamp = 0;
  }
  Object.defineProperty(e.prototype, "game_start_timeStamp", {
    get: function() {
      return this._game_start_timeStamp;
    }
, set: function(e) {
      this._game_start_timeStamp = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "prevPauseTime", {
    get: function() {
      return this._prevPauseTime;
    }
, set: function(e) {
      this._prevPauseTime = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "pauseTimeStamp", {
    get: function() {
      return this._pauseTimeStamp;
    }
, set: function(e) {
      this._pauseTimeStamp = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  return e;
}
();
o.default = n;
cc._RF.pop();
