let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "5e3c6l2ucJMTqZymDAunnLb", "Panel_Award_5");
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
var r = e("CLICKLOCK.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = cc._decorator,
u = l.ccclass,
d = l.property,
p = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.panel_window = null;
    t.tipsRichText = null;
    t.layout = null;
    t.externalRootNode = null;
    t.boxNode = null;
    t.boxBonusLabels = [];
    t.homeButtonNode = null;
    t.continueButtonNode = null;
    t.viewData = null;
    t.isTouch = ! 0;
    t.numRanking = {
    }
;
    t.hideTime = 0;
    return t;
  }
  t.prototype.onTouchCloseTips = function() {
    if(Date.now()- this.hideTime <= 300) console.log("wait!!!，return");
    else {
      this.hideTime = Date.now();
      s.FrameSDK.closeEffect(this, null);
    }
  }
;
  t.prototype.click_continue = function() {
    var e,
    t;
    if(this.isTouch) {
      this.isTouch = ! 1;
      this.onTouchCloseTips();
      null === (t = (e = this.viewData).closeCB)|| void 0 === t|| t.call(e, "continue");
    }
  }
;
  t.prototype.onLoad = function() {
    if(null == c.FrameData.saveData.award5|| Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length) {
      var e = [],
      t = c.FrameData.getCoinOutNum("boxFixed");
      if(t&& Array.isArray(t)&& t.length >= 3) {
        e.push.apply(e, t);
        e.sort(function() {
          return Math.random()-.5;
        }
);
      } else for(var a = c.FrameData.getCoinOutNum("boxRandom"), o = 0;
      o < 3;
      o++) e[o] = s.FrameSDK.randomInt(a);
      c.FrameData.saveData.award5 = {
        numList: e,
        reward: c.FrameData.getCoinOutNum("superAd"),
        open: {
        }
      }
;
    }
  }
;
  t.prototype.openBox = function(e) {
    var t = this;
    if(! c.FrameData.saveData.award5.open[e]&& this.isTouch) {
      this.isTouch = ! 1;
      s.FrameSDK.frameData.sdkFuc.ppEvent("freeClaim");
      c.FrameData.saveData.award5.open[e] = 1;
      Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length&& cc.director.emit("SUPER_AWARD", "show");
      var a = c.FrameData.saveData.award5.numList[e],
      o = this.boxNode.children[e],
      n = o.getComponent(sp.Skeleton);
      n.setAnimation(0, "step"+ this.numRanking[a]+ "_4", ! 1);
      n.addAnimation(0, "step"+ this.numRanking[a]+ "_5", ! 0);
      s.FrameSDK.playEffect("pool_zhuanpan");
      cc.Tween.stopAllByTarget(o);
      cc.tween(o).delay(.7).call(function() {
        return s.FrameSDK.playEffect("done_coin_arrange");
      }
).delay(1.2).call(function() {
        var o, n;
        t.boxBonusLabels[e].node.parent.active = ! 0;
        t.boxBonusLabels[e].string = ""+ s.FrameSDK.convertCoinToStr(a);
        null === (n = (o = t.viewData).unlockCountUpdateFunc)|| void 0 === n|| n.call(o, Object.keys(c.FrameData.saveData.award5.open).length);
        s.FrameSDK.logGameEvent("thepool_game_new", {
          object_action: "show", object_name: "new_16"
        }
, ! 0);
        s.FrameSDK.frameData.sdkFuc.ppEvent("freeCollected");
        if(Object.keys(c.FrameData.saveData.award5.open).length >= c.FrameData.saveData.award5.numList.length) {
          var i = t.viewData.superExternalNode? "Panel_Award_Super2": "Panel_Award_Super1", r = {
            bonus: c.FrameData.saveData.award5.reward, freeBonus: c.FrameData.getCoinOutNum("superFree"), externalNode: t.viewData.superExternalNode, param: t.viewData.param, closeCB: function() {
              return t._showButtons();
            }
          }
;
          c.FrameData.saveData.award5 = null;
          s.FrameSDK.addCoin(a, 0, 0, function() {
            s.FrameSDK.openWindow(i, r);
          }
);
        } else s.FrameSDK.addCoin(a, 0, 0, function() {
          return t._showButtons();
        }
);
      }
).start();
    }
  }
;
  t.prototype._showButtons = function() {
    var e = this;
    s.FrameSDK.openRating(function() {
      var t, a;
      if(s.FrameSDK.hasPopUp()) {
        e.onTouchCloseTips();
        null === (a = (t = e.viewData).closeCB)|| void 0 === a|| a.call(t, "home");
      } else {
        cc.Tween.stopAllByTarget(e.homeButtonNode);
        cc.tween(e.homeButtonNode).delay(0).set({
          scale:.2
        }
).to(.4, {
          scale: 1
        }
, {
          easing: "backOut"
        }
).start();
        cc.Tween.stopAllByTarget(e.continueButtonNode);
        cc.tween(e.continueButtonNode).delay(.1).set({
          scale:.2
        }
).to(.4, {
          scale: 1
        }
, {
          easing: "backOut"
        }
).call(function() {
          return e.isTouch = ! 0;
        }
).start();
      }
    }
);
  }
;
  t.prototype.click_Common = function() {
  }
;
  t.prototype.onEnable = function() {
    var e,
    t,
    a = this;
    s.FrameSDK.openEffect(this);
    s.FrameSDK.playEffect("rewardshow");
    s.FrameSDK.logGameEvent("thepool_game_new", {
      object_action: "show", object_name: "new_15"
    }
, ! 0);
    var o = c.FrameData.saveData.award5,
    n = o.reward;
    JSON.parse(JSON.stringify(o.numList)).sort(function(e, t) {
      return e- t;
    }
).forEach(function(e, t) {
      a.numRanking[e] = t+ 1;
    }
);
    s.FrameSDK.frameData.sdkFuc.ppEvent("freeShow");
    this.tipsRichText.string = 'skey_063??&value1==<img src="dollar3" offset=-6/> <size=46><color = #FDE829>'+ s.FrameSDK.convertCoinToStr(n)+ "</c></size>";
    this.externalRootNode.removeAllChildren();
    if(this.viewData.externalNode) {
      this.externalRootNode.addChild(this.viewData.externalNode);
      this.externalRootNode.active = ! 0;
      this.layout.paddingTop = 40;
      this.layout.spacingY = 40;
    } else {
      this.externalRootNode.active = ! 1;
      this.layout.paddingTop = 120;
      this.layout.spacingY = 120;
    }
    var i = [];
    this.boxNode.children.forEach(function(e, t) {
      cc.Tween.stopAllByTarget(e);
      var n = o.open[t], r = o.numList[t];
      if(n) {
        e.getComponent(sp.Skeleton).setAnimation(0, "step"+ a.numRanking[r]+ "_5", ! 0);
        a.boxBonusLabels[t].node.parent.active = ! 0;
        a.boxBonusLabels[t].string = ""+ s.FrameSDK.convertCoinToStr(r);
      } else {
        i.push(t);
        e.getComponent(sp.Skeleton).setAnimation(0, "step3", ! 0);
        a.boxBonusLabels[t].node.parent.active = ! 1;
        a.boxBonusLabels[t].string = "";
      }
    }
);
    null === (t = (e = this.viewData).unlockCountUpdateFunc)|| void 0 === t|| t.call(e, Object.keys(c.FrameData.saveData.award5.open).length);
    this.homeButtonNode.scale = 0;
    this.continueButtonNode.scale = 0;
    cc.Tween.stopAllByTarget(this.homeButtonNode);
    cc.Tween.stopAllByTarget(this.continueButtonNode);
    this.scheduleOnce(function() {
      if(i.length <= 0) a._showButtons();
      else {
        var e = i[Math.floor(Math.random()* i.length)];
        a.openBox(e);
      }
    }
, .5);
  }
;
  t.prototype.click_home = function() {
    var e,
    t;
    if(this.isTouch) {
      this.isTouch = ! 1;
      this.onTouchCloseTips();
      null === (t = (e = this.viewData).closeCB)|| void 0 === t|| t.call(e, "home");
    }
  }
;
  i([d(cc.Node)], t.prototype, "panel_window", void 0);
  i([d(cc.RichText)], t.prototype, "tipsRichText", void 0);
  i([d(cc.Layout)], t.prototype, "layout", void 0);
  i([d(cc.Node)], t.prototype, "externalRootNode", void 0);
  i([d(cc.Node)], t.prototype, "boxNode", void 0);
  i([d([cc.Label])], t.prototype, "boxBonusLabels", void 0);
  i([d(cc.Node)], t.prototype, "homeButtonNode", void 0);
  i([d(cc.Node)], t.prototype, "continueButtonNode", void 0);
  i([r.CLICKLOCK()], t.prototype, "click_home", null);
  i([r.CLICKLOCK()], t.prototype, "click_continue", null);
  i([r.CLICKLOCK()], t.prototype, "click_Common", null);
  return i([u], t);
}
(cc.Component);
a.default = p;
cc._RF.pop();
