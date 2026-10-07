let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "dc1b6Bhs7ZObbhpuFb426Z/", "ListPageItemComp");
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
),
a = this&& this.__decorate|| function(e, t, o, n) {
  var i,
  a = arguments.length,
  r = a < 3? t: null === n? n = Object.getOwnPropertyDescriptor(t, o): n;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);
  else for(var l = e.length- 1;
  l >= 0;
  l--)(i = e[l])&& (r = (a < 3? i(r): a > 3? i(t, o, r): i(t, o))|| r);
  return a > 3&& r&& Object.defineProperty(t, o, r),
  r;
}
;
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var r = e("BallLogicMgr.js"),
l = e("DB.js"),
s = e("util.js"),
c = cc._decorator,
u = c.ccclass,
p = c.property,
d = function(e) {
  i(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.idx = 0;
    t.ball_Prefab = null;
    t.white_ball_Prefab = null;
    t.ui_detail_Prefab = null;
    t.publictableInfo = null;
    t.delCb = null;
    t.createBalls = null;
    t.isEditing = null;
    t.isAllowDel = null;
    t.isCalDel = null;
    return t;
  }
  t.prototype.setData = function(e) {
    this.publictableInfo = s.clone(e);
    cc.find("label_name", this.node).getComponent(cc.Label).string = e.sID;
    cc.find("label_totalv", this.node).getComponent(cc.Label).string = e.totalNum;
    cc.find("label_prv", this.node).getComponent(cc.Label).string = Math.floor(100* e.pr)+ "%";
- 1 == e.tableID&& (cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个");
    cc.find("label_zan", this.node).getComponent(cc.Label).string = this.publictableInfo.zanIDS;
    this.clear();
    var t = this.publictableInfo.time,
    o = new Date().getTime()- t,
    n = Math.floor(o/ 36e5);
    this.isAllowDel&& n >= 24&& t >= 0&& this.setDelBtn(! 0);
    for(var i = cc.find("sprite_bg", this.node), a = e.tableInfo.balls, l = 0;
    l < a.length;
    l++) {
      var c = a[l];
      if(c.ballType == r.BallIDType_White) {
(u = cc.instantiate(this.white_ball_Prefab)).parent = i;
        u.x = c.x;
        u.y = c.y;
        this.createBalls.push(u);
      } else if(c.ballType == r.BallIDType_Normal) {
        var u;
(u = cc.instantiate(this.ball_Prefab)).parent = i;
        u.x = c.x;
        u.y = c.y;
        u.getComponent("BallMaterialComp").setMatIdx(c.ballMatIdx);
        this.createBalls.push(u);
      }
    }
  }
;
  t.prototype.setDelCB = function(e) {
    this.delCb = e;
  }
;
  t.prototype.clear = function() {
    this.createBalls = this.createBalls|| [];
    for(var e = 0;
    e < this.createBalls.length;
    e++) {
      this.createBalls[e].destroy();
      this.createBalls[e].parent = null;
    }
    this.createBalls = [];
  }
;
  t.prototype.setAsEditing = function(e) {
    this.isEditing = e;
    var t = cc.find("cm_plus", this.node);
    if(e) {
      t.opacity = 255;
      cc.find("label_name", this.node).getComponent(cc.Label).string = "新建一个";
    } else t.opacity = 0;
  }
;
  t.prototype.onDestroy = function() {
    this.clear();
  }
;
  t.prototype.update = function() {
  }
;
  t.prototype.getIsEditing = function() {
    return this.isEditing;
  }
;
  t.prototype.onEnable = function() {
  }
;
  t.prototype.onLoad = function() {
    var e = this;
    this.idx = this.idx|| 0;
    this.createBalls = this.createBalls|| [];
    this.isEditing = this.isEditing|| ! 1;
    this.publictableInfo = this.publictableInfo|| null;
    this.delCb = this.delCb|| null;
    this.isCalDel = ! 1;
    this.setDelBtn(! 1);
    this.node.on(cc.Node.EventType.TOUCH_START, function() {
      if(e.isEditing) e.publictableInfo&& r.gotoEditor(e.publictableInfo.tableInfo);
      else if(e.publictableInfo) {
        var t = cc.instantiate(e.ui_detail_Prefab), o = e.node.parent.parent;
        t.getComponent("ListPageItemDetailComp").show(o, e.publictableInfo);
      }
    }
);
    cc.find("button_del", this.node).on("click", function() {
      e.isCalDel&& l.removeOnePublicTableInfo(e.publictableInfo, function() {
        console.log("removeOnePublicTableInfo finish", e.publictableInfo.sID);
        if(e.delCb) {
          r.publicTableList_removeBysID(e.publictableInfo.sID);
          e.delCb(e.publictableInfo.sID);
        }
      }
);
    }
);
  }
;
  t.prototype.setAllowDel = function(e) {
    this.isAllowDel = e;
    e|| this.setDelBtn(! 1);
  }
;
  t.prototype.setDelBtn = function(e) {
    cc.find("button_del", this.node).active = e;
    this.isCalDel = e;
  }
;
  a([p], t.prototype, "idx", void 0);
  a([p(cc.Prefab)], t.prototype, "ball_Prefab", void 0);
  a([p(cc.Prefab)], t.prototype, "white_ball_Prefab", void 0);
  a([p(cc.Prefab)], t.prototype, "ui_detail_Prefab", void 0);
  return a([u], t);
}
(cc.Component);
o.default = d;
cc._RF.pop();
