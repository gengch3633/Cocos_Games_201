let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "6f62bSHLkFOmah+a3GRSm5H", "RDM_CharityItem");
var o,
n = this&& this.__extends|| (o = function(e, t) {
  return(o = Object.setPrototypeOf|| {
    __proto__:[]
  }
  instanceof Array&& function(e, t) {
    e.__proto__ = t;
  }
|| function(e, t) {
    for(var a in t) Object.prototype.hasOwnProperty.call(t, a)&& (e[a] = t[a]);
  }
)(e, t);
}
, function(e, t) {
  o(e, t);
  function a() {
    this.constructor = e;
  }
  e.prototype = null === t? Object.create(t):(a.prototype = t.prototype, new a());
}
),
i = this&& this.__decorate|| function(e, t, a, o) {
  var n,
  i = arguments.length,
  r = i < 3? t: null === o? o = Object.getOwnPropertyDescriptor(t, a): o;
  if("object" == typeof Reflect&& "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);
  else for(var c = e.length- 1;
  c >= 0;
  c--)(n = e[c])&& (r = (i < 3? n(r): i > 3? n(t, a, r): n(t, a))|| r);
  return i > 3&& r&& Object.defineProperty(t, a, r),
  r;
}
;
Object.defineProperty(a, "__esModule", {
  value: ! 0
}
);
var r = e("FrameData.js"),
c = e("FrameSDK.js"),
s = e("RDM_Charity.js"),
l = cc._decorator,
u = l.ccclass,
d = (l.property, function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.data = null;
    t.conf = null;
    return t;
  }
  t.prototype.onBtnEvent = function() {
    var e = this;
    this.data.now >= this.data.total? new Promise(function(t) {
      r.FrameData.saveData.account.length <= 0? c.FrameSDK.openWindow("Panel_Account", {
        numStr: c.FrameSDK.convertCharityToStr(e.conf.reward, ! 0), closeCB: t
      }
): t();
    }
).then(function() {
      c.FrameSDK.logLiftEvent("finish_task");
      c.FrameSDK.logGameEvent("thepool_game_rdm", {
        object_action: "show", object_name: "rdm2_"+ e.data.status+ "_end", object_notes: "redeem_"+ e.conf.rdm_id
      }
, ! 0);
      1 == e.data.status? r.FrameData.saveData.CharityStep[e.conf.rdm_id] = {
        status: 2
      }
: 2 == e.data.status&& (r.FrameData.saveData.CharityStep[e.conf.rdm_id].status = 3);
      cc.director.emit("REFRESH_INFO");
      c.FrameSDK.logGameEvent("thepool_game_rdm", {
        object_action: "show", object_name: "rdm2_"+ e.data.status+ "_start", object_notes: "redeem_"+ e.conf.rdm_id
      }
, ! 0);
    }
): c.FrameSDK.openWindow("Panel_Tips", this.data);
  }
;
  t.prototype.onBtnTestEvent = function() {
    1 != this.data.status&& 2 != this.data.status|| (this.data.now = this.data.total);
    this.updateUI();
  }
;
  t.prototype.init = function(e) {
    this.conf = e;
    this.data = s.default.getData(e.rdm_id);
    this.updateUI();
  }
;
  t.prototype.updateUI = function() {
    this.node.children.forEach(function(e) {
      e.active = ! 1;
    }
);
    var e = this.data, t = this.node.getChildByName("state"+ e.status);
    if(1 == e.status) {
      cc.find("label_1", t).getComponent(cc.Label).string = ""+ c.FrameSDK.convertCharityToStr(this.conf.reward, ! 0);
      cc.find("CashFishCredit/count", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(e.now)+ "/"+ c.FrameSDK.convertCharityToStr(e.total);
      cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
    } else if(2 == e.status) {
      cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(this.conf.reward, ! 0);
      cc.find("rtx_tips2", t).getComponent(cc.RichText).string = e.tips;
    } else 3 == e.status&& (cc.find("label_1", t).getComponent(cc.Label).string = c.FrameSDK.convertCharityToStr(this.conf.reward, ! 0));
    e.now >= e.total&& 1 == e.status&& c.FrameSDK.logLiftEvent("reach_threshold");
    t.active = ! 0;
  }
;
  return i([u], t);
}
(cc.Component));
a.default = d;
cc._RF.pop();
