let e = require;
let t = module;
"use strict";
cc._RF.push(t, "2ed6c70RnRLyKRnwPlPAmTq", "DB");
var o = e("BallLogicMgr.js"),
n = e("GlobalConfig.js"),
i = e("Net.js");
console.log("****require DB***");
var a,
r = n.testDBInLocalhost,
l = n.testDBInALI;
console.log("isWX", ! 1, cc.sys.platform);
console.log("isTT", ! 1);
var s = {
  isWX: function() {
    return ! 1;
  }
,
  isTT: function() {
    return ! 1;
  }
,
  userInfo_reward: {
    bmIdx:[],
    btx1:[],
    btx2:[],
    msc1:[],
    cueIDs:[],
    cuetx:[]
  }
,
  userInfo: {
    _id:- 1,
    openid:- 1,
    name: "username",
    pic: "",
    gender:- 1,
    age:- 1,
    exp: 0,
    level: 0,
    title: "",
    tili: 0,
    coin: 0,
    total_coin: 0,
    login_time: 0,
    login_timestr: 0,
    p1: 0,
    p2: 0,
    reward: {
      bmIdx:[],
      btx1:[],
      btx2:[],
      msc1:[],
      cueIDs:[],
      cuetx:[]
    }
  }
,
  getID: function() {
    a.userInfo.openid = 1;
    a.get_userInfo();
  }
,
  updateUserInfoKV: function(e, t, o) {
    o = o|| function() {
    }
;
    console.log("updateUserInfoKV", e, t, ! 1);
    a.userInfo.openid;
  }
,
  getMovieInfo: function(e) {
    e.openid,
    e.tableID;
  }
,
  createOnePublicTableInfo: function(e, t, n) {
    t = t|| function() {
    }
;
    console.log("createOnePublicTableInfo", e);
    var i = o.pack_PublicTableInfo(e);
    n&& (i.mv = n);
  }
,
  updateOnePublicTableInfo: function(e, t, o, n) {
    n = n|| function() {
    }
;
    console.log("updateOnePublicTableInfo", t, o, e);
  }
,
  removeOnePublicTableInfo: function(e, t) {
    t = t|| function() {
    }
;
  }
,
  getPublicTableInfo: function(e, t, o) {
    t >= 0&& a.userInfo.openid;
    e = e|| function() {
    }
;
    o = o|| null;
    console.log("getPublicTableInfo", ! 1);
  }
,
  createOneTableInfo: function() {
  }
,
  saveOneTableInfo: function(e, t) {
    t = t|| function() {
    }
;
  }
,
  saveTablesInfo: function(e) {
    e = e|| function() {
    }
;
  }
,
  getLevel: function(e) {
    e|| (e = a.userInfo);
    return 1;
  }
,
  get_userInfo_authorize_test: function() {
  }
,
  resetLoginTime: function() {
    var e = new Date().getTime();
    a.userInfo.login_time = e;
    var t = new Date(e),
    o = t.getFullYear()+ "-"+(t.getMonth()+ 1)+ "-"+ t.getDate()+ " "+ t.getHours()+ ":"+ t.getMinutes()+ ":"+ t.getSeconds();
    a.userInfo.login_timestr = o;
  }
,
  resetTTName: function() {
  }
,
  get_userInfo: function(e, t) {
    "boolean" != typeof t&& (t = ! 0);
    return a.userInfo;
  }
,
  get_ranklist: function() {
    return null;
  }
,
  get_userIcon: function(e, t) {
    cc.loader.loadRes("use/default_user", cc.SpriteFrame, function(e, o) {
      t.getComponent("cc.Sprite").spriteFrame = o;
    }
);
  }
,
  doShare: function() {
  }
,
  checkAuthorize: function(e) {
    e(! 0, "");
  }
,
  closeAuthor: function() {
  }
,
  is_got_userInfo: function() {
    return ! 1;
  }
,
  addoffLineCoin: function(e) {
    a.userInfo.coin = a.userInfo.coin+ e;
    n.unlogin_obj_setKV("coin", a.userInfo.coin);
  }
}
;
a = s;
if(r) {
  n.setting.platform_localhost.platform_str;
  i.set_url(n.setting.platform_localhost.db_url);
} else if(l) {
  n.setting.platform_alitestball.platform_str;
  i.set_url(n.setting.platform_alitestball.db_url);
} else {
  n.setting.platform_other.platform_str;
  i.set_url(n.setting.platform_other.db_url);
  console.log("set url", n.setting.platform_other.db_url);
}
s.getID();
t.exports = s;
cc._RF.pop();
