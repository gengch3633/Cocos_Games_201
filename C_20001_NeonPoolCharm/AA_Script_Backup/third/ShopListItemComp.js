let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "920e6nd+dFFAIckglg5oflP", "ShopListItemComp");
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
var r = e(GlobalConfig "
  }].js),
      l = e(" DB.js "),
      s = e(" BallLogicMgr.js "),
      c = cc._decorator,
      u = c.ccclass,
      p = c.property,
      d = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.idx = 0;
          t.isEditing = null;
          t.btn_state = null;
          t.cfg = null;
          t.shop = null;
          t.type = null;
          return t;
        }
        t.prototype.update = function () {};
        t.prototype.setShop = function (e) {
          this.shop = e;
        };
        t.prototype.setupConfig = function (e, t) {
          this.type = e;
          this.cfg = t;
          var o = cc.find(" node_coin ", this.node),
            n = cc.find(" label_coin ", o),
            i = cc.find(" node_ball2_shop_all ", this.node);
          n.getComponent(cc.Label).string = t.cost;
          i.getComponent(cc.ParticleSystem).enabled = !1;
          i = cc.find(" node_ball2_shop_all ", this.node);
          if (0 == e) i.getComponent(" BallMaterialComp ").setMatIdx(this.cfg.matIdx);else if (1 == e) i.getComponent(" BallMaterialComp ").setMatIdx(1);else if (2 == e) {
            i.getComponent(" BallMaterialComp ").setMatIdx(1);
            i.getComponent(cc.ParticleSystem).enabled = !0;
            cc.loader.loadRes(" mParticles/ " + this.cfg.file, cc.ParticleAsset, function (e, t) {
              i.getComponent(cc.ParticleSystem).file = t;
            });
          }
          this.update_btnstate();
        };
        t.prototype.set_btnstate = function (e) {
          this.btn_state = e;
          var t = cc.find(" button_buy ", this.node).getChildByName(" Background ").getChildByName(" Label "),
            o = cc.find(" cm_inuse ", this.node);
          o.opacity = 0;
          if (0 == e) t.getComponent(cc.Label).string = " 购买 ";else if (1 == e) t.getComponent(cc.Label).string = " 装备 ";else if (2 == e) {
            t.getComponent(cc.Label).string = " 卸下 ";
            o.opacity = 255;
          }
        };
        t.prototype.setAsEditing = function (e) {
          this.isEditing = e;
        };
        t.prototype.getIsEditing = function () {
          return this.isEditing;
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.idx = this.idx || 0;
          this.isEditing = this.isEditing || !1;
          cc.find(" node_ball2_shop_all ", this.node).getComponent(" BallMaterialComp ").setMatIdx(0);
          cc.find(" button_buy ", this.node).on(" click ", function () {
            console.log(" cfg ", e.cfg, l.userInfo.coin, e.type, e.cfg.cid);
            if (e.cfg) if (0 == e.btn_state) {
              if (l.userInfo.coin >= e.cfg.cost) 0 == e.type ? e.cfg.cid && s.buy_ball(e.cfg, function (t, o) {
                if (0 == o) {
                  l.userInfo.coin = l.userInfo.coin - e.cfg.cost;
                  e.set_btnstate(1);
                  e.shop.updateCoin();
                  e.showTip(" 购买成功 ");
                }
              }) : 1 == e.type ? e.cfg.cid && s.buy_color(e.cfg, function () {
                l.userInfo.coin = l.userInfo.coin - e.cfg.cost;
                e.set_btnstate(1);
                e.shop.updateCoin();
                e.showTip(" 购买成功 ");
              }) : 2 == e.type && e.cfg.cid && s.buy_particle(e.cfg, function () {
                l.userInfo.coin = l.userInfo.coin - e.cfg.cost;
                e.set_btnstate(1);
                e.shop.updateCoin();
                e.showTip(" 购买成功 ");
              });else {
                s.coin_notEnough();
                e.showTip(" 金币不足 ");
              }
            } else if (1 == e.btn_state) {
              if (0 == e.type) {
                if (e.cfg.cid) {
                  s.pack_ballMatIdx(e.cfg.cid);
                  s.last_pack_ball = e;
                }
              } else if (1 == e.type) {
                if (e.cfg.cid) {
                  s.pack_color(e.cfg.cid);
                  s.last_pack_color && s.last_pack_color.set_btnstate(1);
                  s.last_pack_color = e;
                }
              } else if (2 == e.type && e.cfg.cid) {
                s.pack_particle(e.cfg.cid);
                s.last_pack_particle && s.last_pack_particle.set_btnstate(1);
                s.last_pack_particle = e;
              }
              e.set_btnstate(2);
            } else if (2 == e.btn_state) {
              if (0 == e.type) {
                if (e.cfg.cid) {
                  s.unpack_ballMatIdx(e.cfg.cid);
                  s.last_pack_ball = null;
                }
              } else if (1 == e.type) {
                if (e.cfg.cid) {
                  s.pack_color(-1);
                  s.last_pack_color = null;
                }
              } else if (2 == e.type && e.cfg.cid) {
                s.pack_particle(-1);
                s.last_pack_particle = null;
              }
              e.set_btnstate(1);
            }
          });
          this.set_btnstate(0);
        };
        t.prototype.onDestroy = function () {
          this.clear();
        };
        t.prototype.onEnable = function () {};
        t.prototype.update_btnstate = function () {
          if (this.cfg) {
            var e = this.cfg.cid;
            if (0 == this.type) {
              console.log(" PageType.Ball bmIdx ", l.userInfo.reward.bmIdx, typeof l.userInfo.reward.bmIdx);
              if (l.userInfo.reward.bmIdx.indexOf(e) < 0) this.set_btnstate(0);else if (r.shop_ball_get().arr.indexOf(e) >= 0) {
                this.set_btnstate(2);
                s.last_pack_ball = this;
              } else this.set_btnstate(1);
            } else if (1 == this.type) {
              if (l.userInfo.reward.btx1.indexOf(e) < 0) this.set_btnstate(0);else if (r.shop_color_get() == e) {
                this.set_btnstate(2);
                s.last_pack_color = this;
              } else this.set_btnstate(1);
            } else if (2 == this.type) if (l.userInfo.reward.btx2.indexOf(e) < 0) this.set_btnstate(0);else if (r.shop_particle_get() == e) {
              this.set_btnstate(2);
              s.last_pack_particle = this;
            } else this.set_btnstate(1);
          }
        };
        t.prototype.showTip = function (e) {
          this.shop.showTip(e);
        };
        t.prototype.random_move = function (e) {
          var t = cc.find(" node_ball2_shop_all ", this.node);
          if (e) {
            var o = cc.moveTo(2.3, cc.v2(100, t.y)),
              n = cc.moveTo(2.3, cc.v2(-100, t.y)),
              i = cc.repeatForever(cc.sequence(o, n));
            t.runAction(i);
          } else {
            t.x = 0;
            t.stopAllActions();
          }
        };
        t.prototype.clear = function () {};
        t.prototype.setData = function () {};
        a([p], t.prototype, " idx ", void 0);
        return a([u], t);
      }(cc.Component);
    o.default = d;
    cc._RF.pop();
