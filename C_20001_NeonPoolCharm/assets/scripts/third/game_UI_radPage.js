let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "c53d2PAg0FMabLys/e0G+jL", "game_UI_radPage");
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
l = e(CueDataSys "
  }].js),
      s = cc._decorator,
      c = s.ccclass,
      u = (s.property, l.default),
      p = (Math.PI, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.pos_value = null;
          t.nodeCircle = null;
          t.angle = null;
          t.cb_yes = null;
          return t;
        }
        t.prototype.getPosValue = function () {
          return this.pos_value;
        };
        t.prototype.start = function () {};
        t.prototype.close = function () {
          this.node.parent = null;
        };
        t.prototype.updateLabelAngle = function () {
          cc.find(" label_angle ", this.node).getComponent(cc.Label).string = this.angle;
        };
        t.prototype.movetoPos = function (e) {
          var t = cc.find(" node_circle ", this.node);
          this.nodeCircle = t;
          var o = cc.find(" node_red ", t);
          e = this.modifyP(e);
          this.pos_value = cc.v2(e.x / 210, e.y / 210);
          var n = e.mag() / 210;
          if (n > 1) {
            e.x = e.x / n;
            e.y = e.y / n;
            this.pos_value.x = this.pos_value.x / n;
            this.pos_value.y = this.pos_value.y / n;
          }
          this.pos_value.x = this.pos_value.x > 1 ? 1 : this.pos_value.x;
          this.pos_value.y = this.pos_value.y > 1 ? 1 : this.pos_value.y;
          o.x = e.x;
          o.y = e.y;
          this.updateLabelValue();
        };
        t.prototype.modifyP = function (e) {
          e.x += this.nodeCircle.x;
          e.y += this.nodeCircle.y;
          var t = Math.max(0, e.x + 250);
          t = Math.min(t, 499);
          var o = Math.floor(t / 20),
            n = Math.max(0, e.y + 250);
          n = Math.min(n, 499);
          var i = 20 * (o + .5) - 250,
            a = 20 * (Math.floor(n / 20) + .5) - 250;
          return cc.v2(i, a);
        };
        t.prototype.updateLabelValue = function () {
          cc.find(" label_value ", this.node).getComponent(cc.Label).string = "(" + Math.round(100 * this.pos_value.x) + ", " + Math.round(100 * this.pos_value.y) + ") ";
        };
        t.prototype.show = function (e, t) {
          this.node.parent = e;
          this.cb_yes = t || null;
        };
        t.prototype.closeAndDestroy = function () {
          this.node.parent = null;
          this.node.destroy();
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.cb_yes = this.cb_yes || null;
          this.pos_value = cc.v2(0, 0);
          this.angle = 0;
          var t = cc.find(" node_circle ", this.node);
          t.on(cc.Node.EventType.TOUCH_START, function (o) {
            console.log(" TOUCH_START ");
            var n = cc.v2(o.touch._point.x, o.touch._point.y),
              i = t.convertToNodeSpaceAR(n);
            e.movetoPos(i);
          });
          t.on(cc.Node.EventType.TOUCH_MOVE, function (o) {
            console.log(" TOUCH_MOVE ");
            var n = cc.v2(o.touch._point.x, o.touch._point.y),
              i = t.convertToNodeSpaceAR(n);
            e.movetoPos(i);
          });
          t.on(cc.Node.EventType.TOUCH_END, function () {
            if (e.cb_yes) {
              var t = u.getUsedCueRoleAngle();
              r.useSimCueAttri && r.simCueSpin && (t = r.simCueSpin);
              e.cb_yes(e.pos_value, t);
            }
            e.closeAndDestroy();
          });
          t.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            if (e.cb_yes) {
              var t = u.getUsedCueRoleAngle();
              r.useSimCueAttri && r.simCueSpin && (t = r.simCueSpin);
              e.cb_yes(e.pos_value, t);
            }
            e.closeAndDestroy();
          });
          cc.find(" button_bg ", this.node).on(" click ", function () {
            e.closeAndDestroy();
          });
        };
        return a([c], t);
      }(cc.Component));
    o.default = p;
    cc._RF.pop();
