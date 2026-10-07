let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "1bc2bVtoqBHFq6YrY6XcuyZ", "PlayerDataMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
o.ETaskStatus = void 0;
var n = e("EventMgr.js"),
i = e("GameEventType.js");
o.ETaskStatus = cc.Enum({
  E_NON_COMPLETE: 0, E_CAN_RECEIVE: 1, E_COMPLETE: 2
}
);
var a = function() {
  function e() {
    this._bind_wx = 0;
    this._wx_gender = "保密";
    this._wx_head = "";
    this._yid = "yid_read_failed";
    this._create_time = "";
    this._user_id = "";
    this._user_name = "";
    this._cash_balance = 0;
    this._gold_balance = 0;
    this._sign_balance = 0;
    this._new_user = ! 0;
    this.userCpm = 0;
    this._curSceneID = 0;
    this._user_level = 0;
    this.level_ad = 0;
    this.level_pass = 0;
    this.isYSDKLoginSuccess = ! 1;
    this.level_force = ! 1;
    this.show_draw = ! 1;
    this.show_extract = ! 1;
    this.show_scene = ! 1;
    this.show_level_reward = ! 1;
    this.is_gm = ! 1;
    this._max_extract_id = 0;
    this._scene_id = 1;
    this.total_video_count = 0;
    this.level_pass_success_count = 0;
    this.guide_id = 0;
    this.total_gold = 0;
    this._xiaoqiuADCount = 0;
    this.chat_group_ban = ! 0;
    this.user_order_eid = [];
    this.headList = [];
    this._level_config_index = 0;
    this._levelInfo = {
      level_a: 1,
      level_b: 1,
      level_c: 1,
      roundCount: 0,
      turnCount: 0
    }
;
    this._turn_pass = 0;
    this._table = "";
  }
  Object.defineProperty(e.prototype, "curSceneID", {
    get: function() {
      return this._curSceneID;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "level_config_index", {
    get: function() {
      return this._level_config_index;
    }
, set: function(e) {
      this._level_config_index;
      this._level_config_index = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "bind_wx", {
    get: function() {
      return this._bind_wx;
    }
, set: function(e) {
      this._bind_wx = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "yid", {
    get: function() {
      return this._yid;
    }
, set: function(e) {
      this._yid = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "create_time", {
    get: function() {
      return this._create_time;
    }
, set: function(e) {
      this._create_time = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "user_id", {
    get: function() {
      return this._user_id;
    }
, set: function(e) {
      this._user_id = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "user_name", {
    get: function() {
      return this._user_name;
    }
, set: function(e) {
      this._user_name = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "cash_balance", {
    get: function() {
      return this._cash_balance;
    }
, set: function(e) {
      this._cash_balance = e;
      n.default.trigger(i.default.UPDATE_CASH, e);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "gold_balance", {
    get: function() {
      return this._gold_balance;
    }
, set: function(e) {
      this._gold_balance = e;
      n.default.trigger(i.default.UPDATE_GOLD, e);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "sign_balance", {
    get: function() {
      return this._sign_balance;
    }
, set: function(e) {
      this._sign_balance = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "max_extract_id", {
    get: function() {
      return this._max_extract_id;
    }
, set: function(e) {
      e != this._max_extract_id&& (this.show_extract = ! 0);
      this._max_extract_id = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "scene_id", {
    get: function() {
      return this._scene_id;
    }
, set: function(e) {
      e != this._scene_id&& (this.show_scene = ! 0);
      this._scene_id = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "new_user", {
    get: function() {
      return this._new_user;
    }
, set: function(e) {
      this._new_user = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "wx_gender", {
    get: function() {
      return this._wx_gender;
    }
, set: function(e) {
      this._wx_gender = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "wx_head", {
    get: function() {
      return this._wx_head;
    }
, set: function(e) {
      this._wx_head = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(e.prototype, "userOrderEid", {
    get: function() {
      return this.user_order_eid;
    }
, set: function(e) {
      this.user_order_eid = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  return e;
}
();
o.default = a;
cc._RF.pop();
