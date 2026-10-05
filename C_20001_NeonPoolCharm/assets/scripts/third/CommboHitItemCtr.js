let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "07a55BiL0lBapyYj13OXJ0Y", "CommboHitItemCtr");
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
var r = e("EventMgr.js"),
l = e("GameEventType.js"),
s = e(EngineUtil "
  }].js),
      c = cc._decorator,
      u = c.ccclass,
      p = c.menu,
      d = c.property,
      _ = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.commbo_label = null;
          t.bg_effect_sk = null;
          t.idle_ani = null;
          t.combo_root_node = null;
          t._comboCount = null;
          t._curTimeCount = null;
          t._comboNumTween = null;
          t._rootTween = null;
          t._hideTween = null;
          return t;
        }
        t.prototype.onHideAinComplete = function () {
          this.combo_root_node.active = !1;
        };
        t.prototype.update = function (e) {
          if (this.combo_root_node.active && !(this._curTimeCount <= 0)) {
            this._curTimeCount -= e;
            this.updateProgress();
          }
        };
        t.prototype.onBgEffectSkComplete = function () {
          this.bg_effect_sk.node.active = !1;
        };
        t.prototype.setComboLabel = function () {
          this.commbo_label.getComponent(cc.Label).string = " " + this._comboCount;
        };
        t.prototype.onComboHit = function (e) {
          if (e < 2) this.hideCount();else {
            this._comboCount = e;
            this.idle_ani.stop();
            if (this.combo_root_node.active) {
              this._curTimeCount = 1;
              this.playComboNumAni();
            } else {
              this.setComboLabel();
              this._curTimeCount = 1;
              this.combo_root_node.active = !0;
              this._rootTween.stop();
              this.combo_root_node.scale = .2;
              this._rootTween.start();
              this._hideTween.stop();
              this.updateProgress();
            }
          }
        };
        t.prototype.onLoad = function () {
          var e = this;
          this._comboCount = 0;
          this.combo_root_node.active = !1;
          this._curTimeCount = 1;
          this.bg_effect_sk.setCompleteListener(this.onBgEffectSkComplete.bind(this));
          this.bg_effect_sk.node.active = !1;
          this._comboNumTween = cc.tween(this.combo_root_node).set({
            scale: 1
          }).call(function () {
            e.bg_effect_sk.node.active = !0;
            e.bg_effect_sk.setAnimation(0, " idle_1 ", !1);
          }).to(.01, {
            scale: 1.5
          }).call(function () {
            s.default.seti18nString(e.commbo_label, " " + e._comboCount);
          }).to(.2, {
            scale: 1
          }, {
            easing: " bounceOut "
          }).call(function () {
            e.idle_ani.play();
          });
          this.combo_root_node.scale = .2;
          this._rootTween = cc.tween(this.combo_root_node).set({
            scale: .2
          }).call(function () {
            e.bg_effect_sk.node.active = !0;
            e.bg_effect_sk.setAnimation(0, " idle_1 ", !1);
          }).to(.2, {
            scale: 1
          }, {
            easing: " bounceOut "
          }).call(function () {
            e.idle_ani.play();
          });
          this._hideTween = cc.tween(this.combo_root_node).set({
            scale: 1
          }).call(function () {
            e.bg_effect_sk.node.active = !0;
            e.bg_effect_sk.setAnimation(0, " idle_2 ", !1);
          }).to(.1, {
            scaleY: .2
          }).call(this.onHideAinComplete.bind(this));
        };
        t.prototype.hideCount = function () {
          if (this.combo_root_node.active) {
            this.idle_ani.stop();
            this._curTimeCount = 0;
            this._comboNumTween.stop();
            this.commbo_label.scale = 1;
            this._rootTween.stop();
            this._hideTween.start();
          }
        };
        t.prototype.onEnable = function () {
          r.default.listen(l.default.ON_COMMBO_HIT, this.onComboHit, this);
        };
        t.prototype.onDisable = function () {
          r.default.ignore(l.default.ON_COMMBO_HIT, this.onComboHit, this);
        };
        t.prototype.updateProgress = function () {};
        t.prototype.playComboNumAni = function () {
          this.commbo_label.scale = 1;
          this._comboNumTween.stop();
          this._comboNumTween.start();
        };
        a([d(cc.Node)], t.prototype, " commbo_label ", void 0);
        a([d(sp.Skeleton)], t.prototype, " bg_effect_sk ", void 0);
        a([d(cc.Animation)], t.prototype, " idle_ani ", void 0);
        a([d(cc.Node)], t.prototype, " combo_root_node ", void 0);
        return a([u, p(" UI/ pages/ items/ CommboHitItemCtr ")], t);
      }(cc.Component));
    o.default = _;
    cc._RF.pop();
