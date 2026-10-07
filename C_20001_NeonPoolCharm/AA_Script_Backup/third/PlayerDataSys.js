let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "df2770qzcBDqqNUuc3MQwUk", "PlayerDataSys");
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
var a = e("CueDataSys.js"),
r = e("PlayerDataMgr.js"),
l = e("CashMgr.js"),
s = e("SystemConfig.js"),
c = e("GlobalDataMgr.js"),
u = e("AdManager.js"),
p = e("ClientData.js"),
d = e("SdkHelper.js"),
_ = e("EngineUtil.js"),
f = e("ConfigDataSys.js"),
h = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.user_id = null;
    t.user_name = null;
    t.yid = null;
    t._curSceneID = null;
    t.new_user = null;
    t.cash_balance = null;
    t.userCpm = null;
    t.prop_info = {
    }
;
    return t;
  }
  Object.defineProperty(t.prototype, "validConfigLevelID", {
    get: function() {
      return this.getConfigLevelID(this.user_level);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "xiaoqiuADCount", {
    get: function() {
      return this._xiaoqiuADCount;
    }
, set: function(e) {
      this._xiaoqiuADCount = e;
      Number(_.default.localStorageSetItem("xq_count", String(e)));
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "user_level", {
    get: function() {
      return this._user_level;
    }
, set: function(e) {
      this._user_level = e;
      this.caculateSceneIndex();
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "level_info", {
    get: function() {
      return this._levelInfo;
    }
, set: function(e) {
      this._levelInfo = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "table", {
    get: function() {
      return this._table;
    }
, set: function(e) {
      this._table = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "turn_pass", {
    get: function() {
      return this._turn_pass;
    }
, set: function(e) {
      this._turn_pass = e;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "unlockSceneCount", {
    get: function() {
      var e = this, t = 0;
      f.default.scene_configMap.forEach(function(o) {
        e._user_level > o.unlock_lv&& t++;
      }
);
      return t;
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "sucai_isAuto", {
    get: function() {
      return ! ! cc.sys.localStorage.getItem("sucai_isAuto");
    }
, set: function(e) {
      e? cc.sys.localStorage.setItem("sucai_isAuto", "true"): cc.sys.localStorage.removeItem("sucai_isAuto");
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "sucai_endRed", {
    get: function() {
      var e = cc.sys.localStorage.getItem("sucai_endRed");
      return e? Number(e): 0;
    }
, set: function(e) {
      cc.sys.localStorage.setItem("sucai_endRed", e);
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  Object.defineProperty(t.prototype, "sucai_ballArr", {
    get: function() {
      var e = cc.sys.localStorage.getItem("sucai_ballArr");
      return e? e.split(",").map(function(e) {
        return Number(e);
      }
):[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
, set: function(e) {
      cc.sys.localStorage.setItem("sucai_ballArr", e.join(","));
    }
, enumerable: ! 1, configurable: ! 0
  }
);
  t.prototype.getCashBalance = function(e) {
    if(0 == e) return e.toString();
    e|| (e = this.cash_balance);
    var t = Math.floor(100* e)/ 100;
    if(t < 100&& c.default.curLanguage == s.languages.ID) return t.toString();
    var o = "";
    switch(c.default.curLanguage) {
      case s.languages.ID: o = l.default.getIDCashNum(t);
      break;
      case s.languages.BR: o = l.default.getBRCashNum(t);
      break;
      case s.languages.RU: o = l.default.getRUCashNum(t);
      break;
      default: o = l.default.getCNCashNum(t);
    }
    return o;
  }
;
  t.prototype.setFirstVideoCpm = function(e) {
    _.default.localStorageSetItem("FIRST_VIDEO_CPM", e);
  }
;
  t.prototype.addUserCashbalance = function(e) {
    e >= 0&& (this.cash_balance+= e);
  }
;
  t.prototype.getFirstVideoCpm = function() {
    return _.default.localStorageGetItem("FIRST_VIDEO_CPM");
  }
;
  t.prototype.updateCashRecord = function(e) {
    var t = this;
    e&& e.length&& e.forEach(function(e) {
      t.extract_gold_cash_record.set(e.id, e);
    }
);
  }
;
  t.prototype.setWdExtract = function(e) {
    cc.sys.localStorage.setItem("saveWdExtract", e.join(","));
  }
;
  t.prototype.getTiXianInfo = function(e) {
    return null != cc.sys.localStorage.getItem("tixian_"+ e);
  }
;
  t.prototype.saveWdExtract = function(e) {
    var t = cc.sys.localStorage.getItem("saveWdExtract"),
    o = [];
    t&& (o = t.split(",").map(function(e) {
      return Number(e);
    }
));
    o.unshift(e);
    cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
  }
;
  t.prototype.getWdExtract = function() {
    var e = cc.sys.localStorage.getItem("saveWdExtract"),
    t = [];
    e&& (t = e.split(",").map(function(e) {
      return Number(e);
    }
));
    return t;
  }
;
  t.prototype.getCashWithUnit = function(e) {
    return "CN" == c.default.curLanguage? this.getCashBalance(e)+ "元": this.getCashUnit()+ " "+ this.getCashBalance(e);
  }
;
  t._getInstance = function() {
    this._instance|| (t._instance = new t());
    return t._instance;
  }
;
  t.prototype.removeWdExtract = function(e) {
    var t = cc.sys.localStorage.getItem("saveWdExtract"),
    o = [];
    t&& (o = t.split(",").map(function(e) {
      return Number(e);
    }
));
    if(o.length) {
      o.splice(e, 1);
      cc.sys.localStorage.setItem("saveWdExtract", o.join(","));
    }
  }
;
  t.prototype.init = function(e) {
    if(e) {
      var t = e.game_info;
      console.log("game_info data: ", t);
      var o = Array.from(f.default.level_configMap.keys());
      this.max_level_id = o[o.length- 1];
      this.loop_range = Number(f.default.global_ConfigMap.get("level_loop_range"));
      this.loop_start_level_id = this.max_level_id- this.loop_range;
      this.setUserInfo(e);
      a.default.initData(t);
      this._xiaoqiuADCount = Number(_.default.localStorageGetItem("xq_count", "0"));
    }
  }
;
  t.prototype.initUserId = function(e) {
    console.log("initUserId data: ", e);
    var t = e.user_id,
    o = e.user_name,
    n = e.yid;
    this.user_id = t|| "";
    this.user_name = o|| "";
    this.yid = n|| "yid_read_failed";
    p.default.yid = n;
    p.default.setCommonData();
    _.default.setLocalData("yid", n);
  }
;
  t.prototype.getCashUnit = function() {
    return s.Currency[c.default.curLanguage]|| "R$ ";
  }
;
  t.prototype.getConfigLevelID = function(e) {
    if(e <= this.max_level_id) return e;
    var t = e- this.max_level_id;
    return this.loop_start_level_id+ t% this.loop_range;
  }
;
  t.prototype.is_new_user = function() {
    return this.new_user;
  }
;
  t.prototype.initWxData = function(e) {
    if(e) {
      this.initUserId(e);
      var t = e.gender,
      o = e.yid,
      n = e.user_id,
      i = e.nickname,
      a = e.headimgurl;
      this.yid = o|| "yid_read_failed";
      this.user_id = n;
      this.user_name = i;
      this.wx_gender = t|| "";
      this.wx_head = a|| "";
      this.bind_wx = 1;
    }
  }
;
  t.prototype.arrivedNewCity = function() {
    if(1 != this._curSceneID) {
      var e = _.default.localStorageGetItem("arrived_new_country", "0,0").split(",");
      this._curSceneID > Number(e[0])&& Number(_.default.localStorageSetItem("arrived_new_country", String(this._curSceneID)+ ",0"));
    }
  }
;
  t.prototype.setTiXianInfo = function(e) {
    cc.sys.localStorage.setItem("tixian_"+ e, ! 0);
  }
;
  t.prototype.getUserCpm = function() {
    return u.default.getInstance().cpm_data|| {
      cpm: 0,
      source: "",
      unitId: "",
      isApp: "",
      isClose: "",
      activity_date: "",
      activity_num: ""
    }
;
  }
;
  t.prototype.caculateSceneIndex = function() {
    for(var e = Array.from(f.default.scene_configMap.keys()), t = e.length- 1;
    t > - 1;
    t--) {
      var o = e[t],
      n = f.default.scene_configMap.get(o);
      if(this._user_level > n.unlock_lv) {
        if(this._curSceneID < o) {
          this._curSceneID = o;
          this.arrivedNewCity();
        }
        return;
      }
    }
    this._curSceneID = 0;
  }
;
  t.prototype.setUserInfo = function(e) {
    if(e) {
      var t = e.user_info,
      o = e.game_info;
      console.log("user_info data: ", t);
      this.user_level = o.level_a|| 1;
      this.level_info.level_a = o.level_a;
      this.level_info.level_b = o.level_b;
      this.level_info.level_c = o.level_c;
      this.level_info.roundCount = o.roundCount;
      this.level_info.turnCount = o.turnCount;
      this.turn_pass = o.turn_pass;
      this.table = o.table;
      this.level_loop = o.level_loop;
      this.level_ad = o.level_ad;
      this._scene_id = o.scene_id;
      this.sign_level_count = o.sign_level_count;
      this.sign_today = o.sign_today;
      this.sign_in_count = o.sign_in_count;
      this.level_pass = o.level_pass;
      this.prop_info = o.prop;
      this.cash_balance = t.cash_balance|| 0;
      this.gold_balance = t.gold_balance|| 0;
      this.sign_balance = t.sign_balance|| 0;
      this._max_extract_id = t.max_extract_id|| 0;
      this.extract_gold_cash_record = new Map();
      this.total_video_count = t.total_video_count|| 0;
      this.level_pass_success_count = t.level_pass_success_count|| 0;
      t.headimgurl&& (this.wx_head = t.headimgurl);
      this.guide_id = t.guide_id;
      this.new_user = 0 == this.guide_id;
      this.total_gold = t.total_gold|| 0;
      this.is_gm = t.is_gm;
      this.create_time = t.create_time;
      this.updateCashRecord(t.extract_gold_cash_record);
      this.chat_group_ban = null == t.show_red_group|| ! t.show_red_group;
      d.default.setUserInfo({
        yid: this.yid, user_id: this.user_id, gender: this.wx_gender, create_time: this.create_time, is_travel: 0
      }
);
    }
  }
;
  t.prototype.getLevelTableFileName = function() {
    var e = f.default.level_configMap.get(this.validConfigLevelID);
    return e? e.lv_file: "l_1";
  }
;
  t.prototype.uploadCpm = function(e) {
    this.userCpm = Number(e);
  }
;
  t.prototype.updateUserInfo = function(e) {
    if(e) {
      var t = e.cash_balance;
      e.gold_balance;
      null != t&& (this.cash_balance = t);
    }
  }
;
  return t;
}
(r.default);
o.default = h._getInstance();
cc._RF.pop();
