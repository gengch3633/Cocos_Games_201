let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "330cb7hfDtA/aPSxGDG9M90", "RDM_Level");
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
s = e("PaymentItem.js"),
l = e("RDM_LevelItem.js"),
u = cc._decorator,
d = u.ccclass,
p = u.property,
h = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.top = null;
    t.rtx_turnInfo = null;
    t.lbl_gCoin = null;
    t.paymentRootNode = null;
    t.rtx_tips = null;
    t.guide = null;
    t.scrollview = null;
    t.coin = "0";
    t.guideInedx = 0;
    return t;
  }
  a = t;
  t.prototype.openGuide = function() {
    this.guide.active = ! 0;
    this.guide.children.forEach(function(e) {
      e.active = ! 1;
    }
);
    var e = cc.find("mask", this.guide).getComponent(cc.Mask);
    e.node.active = ! 0;
    if(0 == this.guideInedx) {
      c.FrameSDK.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_6"
      }
, ! 0);
      cc.find("tips1", this.guide).active = ! 0;
      e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/node_list2", this.node));
      cc.tween(cc.find("tips1/hand", this.guide)).by(.5, {
        x: 50, y:- 50
      }
).by(.5, {
        x:- 50, y: 50
      }
).union().repeatForever().start();
    } else if(1 == this.guideInedx) {
      c.FrameSDK.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_7"
      }
, ! 0);
      cc.find("tips2", this.guide).active = ! 0;
      e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/scrollview/view/content/item", this.node));
      cc.tween(cc.find("tips2/hand", this.guide)).by(.5, {
        x: 50, y:- 50
      }
).by(.5, {
        x:- 50, y: 50
      }
).union().repeatForever().start();
    } else if(2 == this.guideInedx) {
      cc.find("tips3", this.guide).active = ! 0;
      var t = a.getData(r.FrameData.FRAME_CONF.CoinConf[0].rdm_id);
      cc.find("tips3/label", this.guide).getComponent(cc.Label).string = "skey_040??&value1=="+(t.total- t.now);
      cc.tween(cc.find("tips3/hand", this.guide)).by(.5, {
        x: 50, y:- 50
      }
).by(.5, {
        x:- 50, y: 50
      }
).union().repeatForever().start();
      e.spriteFrame = c.FrameSDK.getNodeTexture(cc.find("panel_window/top/btn_close", this.node));
    } else if(3 == this.guideInedx) {
      c.FrameSDK.logGameEvent("thepool_game_new", {
        object_action: "show", object_name: "new_8"
      }
, ! 0);
      this.node.destroy();
      cc.director.emit("NEW_HAND_FINISH");
    }
  }
;
  t.prototype.onLoad = function() {
    var e = this;
    this.showTurnList();
    cc.director.on("REFRESH_INFO", this.updateUI, this);
    this.updateUI();
    this.guide.active = ! 1;
    if(r.FrameData.saveData.guideInedx <= 1) {
      r.FrameData.saveData.guideInedx = 2;
      this.scheduleOnce(function() {
        e.openGuide();
      }
);
    }
    this.scheduleOnce(function() {
      e.scrollview.node.height = e.scrollview.node.convertToWorldSpaceAR(cc.v2()).y;
    }
);
    var t = r.FrameData.CountryConf.cash_id.slice(0, 4);
    this.paymentRootNode.children.forEach(function(e, a) {
      var o;
      e.getComponent(s.default).paymentID = null !== (o = t[a])&& void 0 !== o? o: 0;
    }
);
  }
;
  t.getTurnInfo = function() {
    var e = JSON.parse(JSON.stringify(r.FrameData.FRAME_CONF.CoinConf)).sort(function() {
      return Math.random()-.5;
    }
)[0];
    return {
      level: e.rdm_1,
      coinCout: r.FrameData.getTargetCoint(e.rdm_id, c.FrameSDK.randomInt(2e4, 5e4))
    }
;
  }
;
  t.prototype.updateUI = function() {
    var e = this;
    this.coin = c.FrameSDK.convertCoinToStr(r.FrameData.credit, ! 0);
    this.lbl_gCoin.string = this.coin;
    var t = r.FrameData.FRAME_CONF.RedeemRateConfig[0];
    this.rtx_tips.string = 'skey_094??&value1==<img src="dollar4" offset=-3/> <color= #8AFF77>'+ c.FrameSDK.convertCoinToStr(t)+ "</c>&value2==<color= #8AFF77>"+ c.FrameSDK.convertCoinToStr(t, ! 0)+ "</c>";
    r.FrameData.FRAME_CONF.CoinConf.forEach(function(t, a) {
      var o = e.scrollview.content.children[a]|| cc.instantiate(e.scrollview.content.children[0]);
      o.getComponentInChildren(l.default).init(t);
      o.parent = e.scrollview.content;
    }
);
    r.FrameData.saveData.account;
  }
;
  t.prototype.onEnable = function() {
    c.FrameSDK.playEffect("rdm");
  }
;
  t.prototype.onDestroy = function() {
    cc.director.removeAll(this);
  }
;
  t.prototype.onBtnEvent = function(e, t) {
    if("0" == t) this.node.destroy();
    else if("3" == t) {
      this.guideInedx++;
      this.openGuide();
    }
  }
;
  t.prototype.showTurnList = function() {
    var e = this;
    this.rtx_turnInfo.node.stopAllActions();
    var t = a.getTurnInfo(),
    o = c.FrameSDK.getRandomInviteCode();
    this.rtx_turnInfo.string = "skey_001??&value1=="+ o+ "</c>&value2=="+ t.level+ "&value3==<color = #FFF882>"+ c.FrameSDK.convertCoinToStr(t.coinCout, ! 0)+ "</c>";
    cc.tween(this.rtx_turnInfo.node).delay(.1).set({
      y:-(.5* this.rtx_turnInfo.node.parent.height+.5* this.rtx_turnInfo.node.height)
    }
).to(1, {
      y: 0
    }
).delay(1).to(1, {
      y:.5* this.rtx_turnInfo.node.parent.height+.5* this.rtx_turnInfo.node.height
    }
).call(function() {
      e.showTurnList();
    }
).start();
  }
;
  t.getData = function(e) {
    var t = r.FrameData.getCoinConf(e),
    a = r.FrameData.getExchangeStatus(e),
    o = {
    }
;
    if(1 == a) o = {
      now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_1),
      total: t.rdm_1,
      tips: "skey_049??&value1==<color= #DF4704>"+ t.rdm_1+ "</c>"
    }
;
    else if(2 == a) {
      var n = r.FrameData.saveData.CoinStep[e];
      o = {
        now: Math.min(r.FrameData.saveData.credit.yellowCoin, n.targetCoin),
        total: n.targetCoin,
        tips: "skey_050??&value1==<color= #009D12>"+ c.FrameSDK.convertCoinToStr(n.targetCoin, ! 0)+ "</c>"
      }
;
    } else if(3 == a) {
      n = r.FrameData.saveData.CoinStep[e];
      o = {
        now: Math.min(c.FrameSDK.frameData.gameData.passLevel, t.rdm_3),
        total: t.rdm_3,
        tips: "skey_053??&value1==<color= #DF4704>"+ t.rdm_3+ "</c>&value2==<color= #009D12>"+ c.FrameSDK.convertCoinToStr(n.targetCoin, ! 0)+ "</c>"
      }
;
    }
    o.status = a;
    return o;
  }
;
  var a;
  i([p(cc.Node)], t.prototype, "top", void 0);
  i([p(cc.RichText)], t.prototype, "rtx_turnInfo", void 0);
  i([p(cc.Label)], t.prototype, "lbl_gCoin", void 0);
  i([p(cc.Node)], t.prototype, "paymentRootNode", void 0);
  i([p(cc.RichText)], t.prototype, "rtx_tips", void 0);
  i([p(cc.Node)], t.prototype, "guide", void 0);
  i([p(cc.ScrollView)], t.prototype, "scrollview", void 0);
  return a = i([d], t);
}
(cc.Component);
a.default = h;
cc._RF.pop();
