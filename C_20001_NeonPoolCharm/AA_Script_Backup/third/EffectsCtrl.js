let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e2e70x1eFtECJMjcWoypa/Z", "EffectsCtrl");
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
o.prefabsEnum = void 0;
var r = e("PlayerDataSys.js"),
l = e(RequestData "
  }].js),
      s = e(" EventMgr.js "),
      c = e(" GameEventType.js "),
      u = e(" EngineUtil.js "),
      p = e(" GameDataMgr.js "),
      d = cc._decorator.ccclass;
    o.prefabsEnum = cc.Enum({
      casheffect: 0,
      diamondeffect: 1,
      AddCashNumEffect: 2,
      AddDiamondNumEffect: 3,
      yellowcasheffect: 4,
      earn: 5
    });
    var _ = [],
      f = [];
    cc._decorator.property;
    var h = function (e) {
      i(t, e);
      function t() {
        var t = null !== e && e.apply(this, arguments) || this;
        t.effectPool = new cc.NodePool();
        t.cashPool = new cc.NodePool();
        t.earnPool = new cc.NodePool();
        t.load_imgs = [];
        t.load_fruits = [];
        t.load_prefabs = [];
        t.tarNodes = new Map();
        t.diamondPool = new cc.NodePool();
        t.isEnableWork = !1;
        t.node = null;
        return t;
      }
      t.prototype.loadSpriteFrames = function () {
        for (var e = function (e) {
            var o = " " + _[e];
            cc.loader.loadRes(o, cc.SpriteFrame, function (t, o) {
              t ? cc.error(t.message || t) : o instanceof cc.SpriteFrame && (this.load_imgs[e] = o);
            }.bind(t));
          }, t = this, o = 0; o < _.length; o++) e(o);
      };
      t.prototype.onLoad = function () {
        s.default.listen(c.default.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        s.default.listen(c.default.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        s.default.listen(c.default.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        s.default.listen(c.default.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        s.default.listen(c.default.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        s.default.listen(c.default.GUIDEEFFECT, this.guideEffect, this);
        s.default.listen(c.default.SHOWEFFECT_EARN, this.earnEffect, this);
      };
      t.prototype.earnEffect = function (e) {
        var t = this,
          n = u.default.convertNodePosition(cc.find(" persist/ effects "), e),
          i = this.load_prefabs[o.prefabsEnum.earn];
        if (i) {
          var a = this.earnPool.size() > 0 ? this.earnPool.get() : cc.instantiate(i);
          a.setPosition(n);
          this.getEffectParent().addChild(a);
          a.scale = 0;
          cc.tween(a).by(.5, {
            scale: 1
          }).by(.5, {
            scale: 0
          }).call(function () {
            return t.recoveryEarn(a);
          }).start();
        } else console.error(" CashEffect error ");
      };
      t.prototype.addEffect = function (e, t, n, i) {
        var a;
        if (a = n == l.RewardType.XianJin ? this.load_prefabs[o.prefabsEnum.diamondeffect] : n == l.RewardType.HongBao ? this.load_prefabs[o.prefabsEnum.casheffect] : this.load_prefabs[o.prefabsEnum.AddCashNumEffect]) {
          var r,
            p = (r = n == l.RewardType.XianJin ? this.diamondPool : n == l.RewardType.HongBao ? this.cashPool : this.effectPool).size() > 0 ? r.get() : cc.instantiate(a);
          if (this.getTarNode(n)) {
            if (p) {
              p.setPosition(e);
              var d = 110;
              4 == n && (d = 110);
              var _ = u.default.getRandomNum(0, 360);
              d = u.default.getRandomNum(10, d);
              var f = u.default.getPosByRot(d, _),
                h = f.x,
                g = f.y,
                y = u.default.getRandomNum(8, 10) / 16;
              this.node.addChild(p);
              i && s.default.trigger(c.default.EFFECTFLYSTART);
              cc.tween(p).by(.1, {
                x: h,
                y: g
              }).delay(.1).to(y, {
                x: t.x,
                y: t.y
              }, {
                easing: " cubicIn "
              }).to(.1, {
                scale: 0
              }).call(function () {
                if (i) {
                  i();
                  s.default.trigger(c.default.EFFECTFLYEND, n);
                }
                cc.Tween.stopAllByTarget(p);
                p.scale = 1;
                r.put(p);
              }).start();
            } else console.error(" effect error " + n);
          } else console.error(" tarNode error " + n);
        } else console.error(" effect error ");
      };
      t.prototype.onDestroy = function () {
        s.default.ignore(c.default.SHOWEFFECT_FLYINGRED, this.addEffects, this);
        s.default.ignore(c.default.SET_EFFECT_TARGETS, this.setTargetNodes, this);
        s.default.ignore(c.default.PUSH_EFFECT_TARGETS, this.pushTargetNode, this);
        s.default.ignore(c.default.SHOWEFFECT_BLANCE, this.addCashNumEffect, this);
        s.default.ignore(c.default.SHOWEFFECT_DIAMOND, this.addLoveNumEffect, this);
        s.default.ignore(c.default.GUIDEEFFECT, this.guideEffect, this);
        s.default.ignore(c.default.SHOWEFFECT_EARN, this.earnEffect, this);
      };
      t.prototype.pushTargetNode = function (e) {
        var t = this;
        if (e) {
          this.tarNodes.size > 0 ? e.forEach(function (e, o) {
            t.tarNodes.set(o, e);
          }) : this.tarNodes = e;
          this.isEnableWork = !0;
        }
      };
      t.prototype.getEffectParent = function () {
        return this.node;
      };
      t.prototype.recoveryCash = function (e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.cashPool.put(e);
      };
      t.prototype.addCashNumEffect = function (e) {
        var t = this,
          n = this.load_prefabs[o.prefabsEnum.AddCashNumEffect];
        if (n) {
          var i = this.cashPool.size() > 0 ? this.cashPool.get() : cc.instantiate(n);
          i.getComponent(cc.Label).string = "+ " + r.default.getCashWithUnit(e);
          var a = this.getTarNode(p.EffectEnum.cash);
          if (a) {
            var l = this.node.convertToNodeSpaceAR(a.convertToWorldSpaceAR(cc.v2(0, 0))),
              s = l.x,
              c = l.y;
            i.setPosition(cc.v2(s + 80, c + 0));
            this.getEffectParent().addChild(i);
            i.opacity = 255;
            cc.tween(i).by(1.5, {
              y: 40,
              opacity: -100
            }).call(function () {
              return t.recoveryCash(i);
            }).start();
          } else console.error(" tarNode error 0000 ");
        } else console.error(" CashEffect error ");
      };
      t.prototype.recoveryEarn = function (e) {
        cc.Tween.stopAllByTarget(e);
        this.earnPool.put(e);
      };
      t.prototype.setTargetNodes = function (e) {
        if (e) {
          this.tarNodes = e;
          this.isEnableWork = !0;
        }
      };
      t.prototype.guideEffect = function () {
        var e,
          t = this,
          o = this.getTarNode(0);
        if (o) {
          var n = u.default.convertNodePosition(this.node, o);
          e = cc.v2(n.x, n.y);
        }
        for (var i = function (n) {
            var i = a.node.children[n];
            cc.tween(i).to(1, {
              x: e.x,
              y: e.y
            }, {
              easing: " cubicIn "
            }).call(function () {
              o.parent.getChildByName(" sk ").active = !0;
              o.parent.getChildByName(" sk ").getComponent(sp.Skeleton).setAnimation(0, " fankui ", !1);
            }).to(.1, {
              scale: 0
            }).call(function () {
              t.recoveryEffect(i);
            }).start();
          }, a = this, r = 0; r < this.node.children.length; r++) i(r);
      };
      t.prototype.getTarNode = function (e) {
        var t;
        t = this.tarNodes.get(e);
        if (cc.isValid(t)) return t;
      };
      t.prototype.addLoveNumEffect = function (e) {
        var t = this,
          n = this.load_prefabs[o.prefabsEnum.AddDiamondNumEffect];
        if (n) {
          var i = this.diamondPool.size() > 0 ? this.diamondPool.get() : cc.instantiate(n);
          i.getComponent(cc.Label).string = "+ " + e;
          var a = this.getTarNode(p.EffectEnum.cash);
          if (a) {
            var r = this.node.convertToNodeSpaceAR(a.convertToWorldSpaceAR(cc.v2(0, 0))),
              l = r.x,
              s = r.y;
            i.setPosition(cc.v2(l + 45, s + 0));
            this.getEffectParent().addChild(i);
            i.opacity = 255;
            cc.tween(i).by(1.5, {
              y: 40,
              opacity: -100
            }).call(function () {
              return t.recoveryDiamond(i);
            }).start();
          } else console.error(" tarNode error 0000 ");
        } else console.error(" LoveNumEffect error ");
      };
      t.prototype.addEffects = function (e) {
        if (this.isEnableWork) for (var t = e.num, o = e.startPos, n = e.endPos, i = e.type, a = e.callback, r = e.seed_id, l = e.reward, s = (e.reward_money, e.reward_love, !n), c = 0; c < i.length; c++) {
          var p = i[c];
          if (!n) {
            var d = this.getTarNode(p);
            if (d) {
              var _ = u.default.convertNodePosition(this.node, d);
              n = cc.v2(_.x, _.y);
            }
          }
          for (var f = t, h = 0; h < f; h++) h == f - 1 ? this.addEffect(o, n, p, a, r, l) : this.addEffect(o, n, p, null, r, " ", h);
          s && (n = null);
        }
      };
      t.prototype.start = function () {
        this.loadSpriteFrames();
        this.loadPrefabs();
      };
      t.prototype.loadPrefabs = function () {
        for (var e = function (e) {
            var o = " prefabs/ " + f[e];
            cc.loader.loadRes(o, cc.Prefab, function (t, o) {
              t ? cc.error(t.message || t) : o instanceof cc.Prefab && (this.load_prefabs[e] = o);
            }.bind(t));
          }, t = this, o = 0; o < f.length; o++) e(o);
      };
      t.prototype.recoveryDiamond = function (e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.diamondPool.put(e);
      };
      t.prototype.recoveryEffect = function (e) {
        cc.Tween.stopAllByTarget(e);
        e.scale = 1;
        this.effectPool.put(e);
      };
      t.prototype.loadArray = function (e, t, o) {
        o && (e[t] = o);
      };
      return a([d], t);
    }(cc.Component);
    o.default = h;
    cc._RF.pop();
