let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "2632aSYuq5DtZszWFpZPrhl", "GameConfigStore");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = new(function() {
  function e() {
    this.fd_status = ! 1;
    this.game_level_phase_cfg = null;
    this.difficulty_max = 0;
    this.difficulty_min = 0;
    this.max_cash_reward = 0;
    this.props_rate_conf = null;
    this.app_review_enabled = 0;
  }
  e.prototype.init = function(e) {
    this.fd_status = ! 0;
    if(e) {
      var t = e.game_level_phase_cfg, i = e.difficulty_max, n = e.difficulty_min, a = e.max_cash_reward, o = e.props_rate_conf;
      this.game_level_phase_cfg = t;
      this.difficulty_max = i;
      this.difficulty_min = n;
      this.max_cash_reward = a;
      this.props_rate_conf = o;
      var r = e.app_review_enabled;
      this.app_review_enabled = null == r? 1: r? 1: 0;
      try {
        cc.sys.localStorage.setItem("MB_APP_REVIEW_ENABLED", String(this.app_review_enabled));
      } catch(e) {
      }
      console.log("[GameConfigStore] init app_review_enabled raw="+ r+ " -> "+ this.app_review_enabled);
    }
  }
;
  e.prototype.isAppReviewEnabled = function() {
    return 1 === this.app_review_enabled;
  }
;
  return e;
}
())();
i.default = n;
cc._RF.pop();
