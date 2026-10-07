let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "3b083/IeQ9OgJ2YYkAkEeaH", "CueDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.ECueState = void 0;
var n = e("ConfigDataSys.js");
o.ECueState = cc.Enum({
  E_LOCK: 0, E_UNLOCK: 1, E_GOT: 2, E_USED: 3
}
);
var i = function() {
  function e() {
    this.max_power = 0;
    this.min_power = 0;
    this.max_line_len = 0;
    this.min_line_len = 0;
    this.max_spin = 0;
    this.min_spin = 0;
    this._get_clubs = {
    }
;
    this._usedCueId = 0;
    this._nextCueID = void 0;
    this._unlockedCueCount = 1;
    this._openedCueCount = 1;
  }
  Object.defineProperty(e.prototype, "get_clubs", {
    get: function() {
      return this._get_clubs;
    }
, set: function(e) {
      this._get_clubs = e;
      var t = Object.keys(e);
      this._openedCueCount = t.length;
      this._unlockedCueCount = t.reduce(function(t, o) {
        return t+(! 0 === e[o]? 1: 0);
      }
, 0);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "usedCueId", {
    get: function() {
      return this._usedCueId;
    }
, set: function(e) {
      this._usedCueId = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "nextCueID", {
    get: function() {
      return this._nextCueID;
    }
, set: function(e) {
      this._nextCueID = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "unlockedCueCount", {
    get: function() {
      return this._unlockedCueCount;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "openedCueCount", {
    get: function() {
      return this._openedCueCount;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  e.prototype.initCueDataMgr = function() {
    var e = this;
    n.default.cue_configMap.forEach(function(t) {
(! e.max_power|| e.max_power < t.force)&& (e.max_power = t.force);
(! e.max_line_len|| e.max_line_len < t.aiming)&& (e.max_line_len = t.aiming);
(! e.max_spin|| e.max_spin < t.spin)&& (e.max_spin = t.spin);
(! e.min_power|| e.min_power > t.force)&& (e.min_power = t.force);
(! e.min_line_len|| e.min_line_len > t.aiming)&& (e.min_line_len = t.aiming);
(! e.min_spin|| e.min_spin > t.spin)&& (e.min_spin = t.spin);
    }
);
  }
;
  return e;
}
();
o.default = i;
cc._RF.pop();
