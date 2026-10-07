let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "75b0anbtJpAG4+w+JPtuHIE", "effectsLayout");
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
var r = e("CashFishCredit.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = e("Panel_Activity.js"),
u = cc._decorator,
d = u.ccclass,
p = u.property,
h = function(e) {
  n(t, e);
  function t() {
    var t = null !== e&& e.apply(this, arguments)|| this;
    t.inputBlocker = null;
    t.yellowCoinNode = null;
    t.greenCoinNode = null;
    t.activityNode = null;
    t.animationRootNode = null;
    t.particle = null;
    t.icon_SpriteFrame = null;
    t.charity_SpriteFrame = null;
    t._yellowReferenceCount = 0;
    t._greenReferenceCount = 0;
    t._activityReferenceCount = 0;
    return t;
  }
  a = t;
  t.prototype.playGreen = function() {
    this.greenCoinNode.opacity = ++ this._greenReferenceCount > 0? 255: 0;
  }
;
  t.prototype.piaoCoin = function(e, t, a, o) {
    var n = this;
    r.default.isUnlocked("yellowCoin")|| (e = 0);
    r.default.isUnlocked("greenCoin")|| (t = 0);
    var i = 0 !== e,
    u = 0 !== t&& ! s.FrameSDK.frameData.gameData.noProfitAd;
    i|| u? new Promise(function(a) {
      e <= 100? a(! 1): s.FrameSDK.openWindow("Panel_CoinTips", {
        num: e, charityNum: t, closeCB: function() {
          return a(! 0);
        }
      }
);
    }
).then(function(d) {
      n.inputBlocker.enabled = d;
      n.particle.node.active = d;
      if(d) {
        s.FrameSDK.frameData.gameFuc.vibrate(500);
        n.particle.resetSystem();
      }
      var p = ! 1, h = ! 1, m = ! 1;
      if(i&& e > 0) {
        var f = cc.v3(.5* cc.winSize.width, .5* cc.winSize.height), _ = void 0, v = e < 10? 5: e <= 50? 10: 20, y = 0;
        u&& t > 0&& (f.x-= 100);
        if(d) {
          _ = 200;
          y = 1.5;
          s.FrameSDK.playEffect("done_coin_arrange");
        }
        cc.Tween.stopAllByTarget(n.animationRootNode);
        cc.tween(n.animationRootNode).delay(y).call(function() {
          return s.FrameSDK.playEffect(v > 5? "coin_arrange_collect": "coin_less_collect");
        }
).start();
        var g = (b = (b = r.default.getTarget("yellowCoin")).getChildByName("coin")|| b).convertToWorldSpaceAR(cc.v3());
        n.playYellow();
        n.playGlodTween(f, g, ! 1, v, void 0, _, y, function() {
          cc.director.emit("FRESH_CREDIT", {
            type: "yellowCoin", num: c.FrameData.saveData.credit.yellowCoin+ e, change: e
          }
);
          c.FrameData.saveData.credit.yellowCoin+= e;
          n.stopYellow();
          p = ! 0;
          if(h&& ! m) {
            m = ! 0;
            n.inputBlocker.enabled = ! 1;
            null == o|| o();
          }
        }
, ! 0);
        if(l.default.isActivityCollectable()&& e > 0) {
          var D = l.default.coinTarget.convertToWorldSpaceAR(cc.v3());
          n.playGlodTween(f, D, ! 1, v, void 0, _, y, function() {
            l.default.isActivityCollectable()&& e > 0&& l.default.addCoin(e);
          }
, ! 1);
        }
      } else {
        if(e < 0) {
          var F = Math.max(0, c.FrameData.saveData.credit.yellowCoin+ e);
          cc.director.emit("FRESH_CREDIT", {
            type: "yellowCoin", num: F, change: e
          }
);
          c.FrameData.saveData.credit.yellowCoin = F;
        }
        p = ! 0;
      }
      if(u&& t > 0) {
        f = cc.v3(.5* cc.winSize.width, .5* cc.winSize.height), _ = void 0;
        var b, C = t < 10? 1: t <= 40? 3: 5, w = (y = 0, ! 0);
        if(u&& e > 0) {
          f.x+= 100;
          w = ! 1;
        }
        if(d) {
          _ = 200;
          y = 1.5;
        }
        g = (b = (b = r.default.getTarget("greenCoin")).getChildByName("coin")|| b).convertToWorldSpaceAR(cc.v3());
        w&& s.FrameSDK.playEffect(C > 5? "coin_arrange_collect": "coin_less_collect");
        n.playGreen();
        n.playGlodTween(f, g, ! 0, C, void 0, _, y, function() {
          cc.director.emit("FRESH_CREDIT", {
            type: "greenCoin", num: c.FrameData.saveData.credit.greenCoin+ t, change: t
          }
);
          c.FrameData.saveData.credit.greenCoin+= t;
          for(var e = c.FrameData.getCoinOutNum("charityRate"), i = 0;
          i < a;
          i++) c.FrameData.saveData.charityDonated+= s.FrameSDK.randomInt(e[0], e[1]);
          c.FrameData.saveData.charityDonateTime+= Math.max(0, Math.floor(a));
          n.stopGreen();
          h = ! 0;
          if(p&& ! m) {
            n.inputBlocker.enabled = ! 1;
            m = ! 0;
            null == o|| o();
          }
        }
, ! 0);
      } else {
        if(t < 0&& ! s.FrameSDK.frameData.gameData.noProfitAd) {
          F = Math.max(0, c.FrameData.saveData.credit.greenCoin+ t);
          cc.director.emit("FRESH_CREDIT", {
            type: "greenCoin", num: F, change: t
          }
);
          c.FrameData.saveData.credit.greenCoin = F;
        }
        h = ! 0;
      }
      if(p&& h&& ! m) {
        n.inputBlocker.enabled = ! 1;
        m = ! 0;
        null == o|| o();
      }
    }
): null == o|| o();
  }
;
  t.prototype.createIconAndFlyBezier = function(e, t, a, o, n, i) {
    var r = this;
    void 0 === i&& (i = 1);
    a = new cc.Vec2(a.x- t.getParent().width/ 2, a.y- t.getParent().height/ 2);
    o = new cc.Vec2(o.x- t.getParent().width/ 2, o.y- t.getParent().height/ 2);
    t.setPosition(a);
    t.zIndex = 1e3;
    var c = e% 2 == 0? s.FrameSDK.randomIntNum(10, 60):- s.FrameSDK.randomIntNum(10, 60),
    l = s.FrameSDK.randomIntNum(- 80, - 20);
    cc.tween(t).to(.3* i, {
      position: cc.v3(a.x+ c, a.y+ l)
    }
, {
      easing: "quadOut"
    }
).call(function() {
      r.createBezier(e, t, a, o, n, i);
    }
).start();
  }
;
  t.prototype.startFlyProcess = function(e, t, o, n, i, r) {
    var c,
    l;
    void 0 === r&& (r = 5);
    var u = e? this.charity_SpriteFrame: this.icon_SpriteFrame,
    d = this.animationRootNode.convertToNodeSpaceAR(t),
    p = this.animationRootNode.convertToNodeSpaceAR(o),
    h = .15;
    r > 1&& .2+ 1.4+ h*(r- 1) > 2&& (h = Math.max(.01, (1.8- 1.4)/(r- 1)));
    for(var m = function() {
      var e = null !== (c = a._nodePool.get())&& void 0 !== c? c: new cc.Node();
      e.scale = 1;
      e.opacity = 0;
      e.setPosition(d.x, d.y, 0);
      f.animationRootNode.addChild(e);
(null !== (l = e.getComponent(cc.Sprite))&& void 0 !== l? l: e.addComponent(cc.Sprite)).spriteFrame = u;
      var t = _% 2 == 0? s.FrameSDK.randomIntNum(10, 60):- s.FrameSDK.randomIntNum(10, 60), o = s.FrameSDK.randomIntNum(- 80, - 20), m = s.FrameSDK.randomIntNum(80, 150);
      _% 3 == 1? m = - m: _% 3 == 2&& (m = s.FrameSDK.randomIntNum(- 80, 80));
      var v = cc.v2(d.x+ m, d.y- Math.abs(m)), y = cc.v2(p.x- m, p.y- Math.abs(m)), g = _;
      cc.tween(e).delay(h* _).set({
        opacity: 255
      }
).to(.2, {
        x: d.x+ t, y: d.y+ o
      }
, {
        easing: "sineInOut"
      }
).bezierTo(1.4, v, y, p).call(function() {
        s.FrameSDK.playEffect("cash_collect");
        null == n|| n(g);
        g === r- 1&& (null == i|| i());
        a._nodePool.put(e);
      }
).start();
    }
, f = this, _ = 0;
    _ < r;
    _++) m();
  }
;
  t.prototype.playGlodTween = function(e, t, o, n, i, r, c, l, u) {
    var d,
    p;
    void 0 === n&& (n = 15);
    void 0 === i&& (i = 150);
    void 0 === r&& (r = 150);
    void 0 === c&& (c = 0);
    void 0 === l&& (l = null);
    void 0 === u&& (u = ! 0);
    e = this.animationRootNode.convertToNodeSpaceAR(e);
    t = this.animationRootNode.convertToNodeSpaceAR(t);
    for(var h = o? this.charity_SpriteFrame: this.icon_SpriteFrame, m = u? function() {
      return s.FrameSDK.playEffect("cash_collect");
    }
: function() {
    }
, f = 0, _ = function(o) {
      var u = null !== (d = a._nodePool.get())&& void 0 !== d? d: new cc.Node();
(null !== (p = u.getComponent(cc.Sprite))&& void 0 !== p? p: u.addComponent(cc.Sprite)).spriteFrame = h;
      u.scale = 1;
      u.opacity = 0;
      u.setPosition(e);
      v.animationRootNode.addChild(u);
      var _ = cc.v3(e.x+ s.FrameSDK.randomIntNum(- i, i), e.y+ s.FrameSDK.randomIntNum(- r, r));
      cc.tween(u).delay(c).set({
        opacity: 255
      }
).to(.08+.015* o, {
        position: _
      }
).delay(.2+.01* o).to(.47, {
        position: t
      }
).call(function() {
        return m();
      }
).parallel(cc.tween().to(.2, {
        scale: 1.5
      }
), cc.tween().to(.2, {
        opacity: 0
      }
)).call(function() {
        a._nodePool.put(u);
++ f === n&& (null == l|| l());
      }
).start();
    }
, v = this, y = 0;
    y < n;
    y++) _(y);
  }
;
  t.prototype.onEnable = function() {
    cc.director.on("ADD_COIN", this.piaoCoin, this);
    cc.director.on("ADD_BIT_COIN", this.piaoBitCoin, this);
    this.inputBlocker.enabled = ! 1;
    this.yellowCoinNode.opacity = 0;
    this.greenCoinNode.opacity = 0;
    this.activityNode.opacity = 0;
  }
;
  t.prototype.onDisable = function() {
    cc.director.removeAll(this);
  }
;
  t.prototype.createBezier = function(e, t, a, o, n, i) {
    var r = t.scale,
    c = s.FrameSDK.randomIntNum(80, 150);
    e% 3 == 1? c = - c: e% 3 == 2&& (c = s.FrameSDK.randomIntNum(- 80, 80));
    var l = [],
    u = cc.v2(a.x+ c, a.y- Math.abs(c)),
    d = cc.v2(o.x- c, o.y- Math.abs(c));
    l.push(u);
    l.push(d);
    l.push(o);
    cc.tween(t).repeatForever(cc.tween().to(.3, {
      scaleX:- 1* r
    }
).to(.3, {
      scaleX: 1* r
    }
));
    cc.tween(t).delay(.1* e* i).call(function() {
    }
).parallel(cc.tween().to(.1* i, {
      opacity: 255
    }
), cc.tween().then(cc.bezierTo(1.5* i, l))).call(function() {
      null == n|| n(e);
      t.destroy();
    }
).start();
  }
;
  t.prototype.playYellow = function() {
    this.yellowCoinNode.opacity = ++ this._yellowReferenceCount > 0? 255: 0;
    l.default.isActivityCollectable()&& (this.activityNode.opacity = ++ this._activityReferenceCount > 0? 255: 0);
  }
;
  t.prototype.stopGreen = function() {
    this._greenReferenceCount = Math.max(0, this._greenReferenceCount- 1);
    this.greenCoinNode.opacity = this._greenReferenceCount > 0? 255: 0;
  }
;
  t.prototype.piaoBitCoin = function(e, t, a, o, n) {
    var i,
    u,
    d,
    p,
    h = this,
    m = ! 1,
    f = ! 1,
    _ = ! 1,
    v = function() {
      if(m&& f&& ! _) {
        _ = ! 0;
        null == n|| n();
      }
    }
;
    if(e > 0) {
      var y = (b = (b = r.default.getTarget("yellowCoin")).getChildByName("coin")|| b).convertToWorldSpaceAR(cc.Vec2.ZERO),
      g = cc.v2(null !== (i = null == o? void 0: o.x)&& void 0 !== i? i:.5* cc.winSize.width, null !== (u = null == o? void 0: o.y)&& void 0 !== u? u:.5* cc.winSize.height),
      D = e > 5? 5: e;
      t > 0&& (g.x-= 100);
      this.playYellow();
      this.startFlyProcess(! 1, g, y, void 0, function() {
        cc.director.emit("FRESH_CREDIT", {
          type: "yellowCoin", num: c.FrameData.saveData.credit.yellowCoin+ e, change: e
        }
);
        c.FrameData.saveData.credit.yellowCoin+= e;
        h.stopYellow();
        m = ! 0;
        v();
      }
, D);
      if(l.default.isActivityCollectable()) {
        var F = l.default.coinTarget.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.startFlyProcess(! 1, g, F, void 0, function() {
          l.default.isActivityCollectable()&& l.default.addCoin(e);
        }
, D);
      }
    } else m = ! 0;
    if(t > 0) {
      var b;
      y = (b = (b = r.default.getTarget("greenCoin")).getChildByName("coin")|| b).convertToWorldSpaceAR(cc.Vec2.ZERO),
      g = cc.v2(null !== (d = null == o? void 0: o.x)&& void 0 !== d? d:.5* cc.winSize.width, null !== (p = null == o? void 0: o.y)&& void 0 !== p? p:.5* cc.winSize.height),
      D = t > 5? 5: t;
      e > 0&& (g.x+= 100);
      this.playGreen();
      this.startFlyProcess(! 0, g, y, void 0, function() {
        cc.director.emit("FRESH_CREDIT", {
          type: "greenCoin", num: c.FrameData.saveData.credit.greenCoin+ t, change: t
        }
);
        c.FrameData.saveData.credit.greenCoin+= t;
        for(var e = c.FrameData.getCoinOutNum("charityRate"), o = 0;
        o < a;
        o++) c.FrameData.saveData.charityDonated+= s.FrameSDK.randomInt(e[0], e[1]);
        c.FrameData.saveData.charityDonateTime+= Math.max(0, Math.floor(a));
        h.stopGreen();
        f = ! 0;
        v();
      }
, D);
    } else f = ! 0;
    v();
    _|| s.FrameSDK.playEffect("pool_ui_butie");
  }
;
  t.prototype.stopYellow = function() {
    this._yellowReferenceCount = Math.max(0, this._yellowReferenceCount- 1);
    this.yellowCoinNode.opacity = this._yellowReferenceCount > 0? 255: 0;
    if(this.activityNode.opacity > 0) {
      this._activityReferenceCount = Math.max(0, this._activityReferenceCount- 1);
      this.activityNode.opacity = this._activityReferenceCount > 0? 255: 0;
    }
  }
;
  var a;
  t._nodePool = new cc.NodePool();
  i([p(cc.BlockInputEvents)], t.prototype, "inputBlocker", void 0);
  i([p(cc.Node)], t.prototype, "yellowCoinNode", void 0);
  i([p(cc.Node)], t.prototype, "greenCoinNode", void 0);
  i([p(cc.Node)], t.prototype, "activityNode", void 0);
  i([p(cc.Node)], t.prototype, "animationRootNode", void 0);
  i([p(cc.ParticleSystem)], t.prototype, "particle", void 0);
  i([p(cc.SpriteFrame)], t.prototype, "icon_SpriteFrame", void 0);
  i([p(cc.SpriteFrame)], t.prototype, "charity_SpriteFrame", void 0);
  return a = i([d], t);
}
(cc.Component);
a.default = h;
cc._RF.pop();
