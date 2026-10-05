let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "e19a9hwjN9PT5CY+32HJh9S", "game_UI_settting");
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
      l = cc._decorator,
      s = l.ccclass,
      c = (l.property, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.callback = null;
          t.callback_ok = null;
          return t;
        }
        t.prototype.closeAndDestroy = function () {
          this.node.parent = null;
          this.node.destroy();
        };
        t.prototype.show = function (e) {
          this.node.parent = e;
        };
        t.prototype.start = function () {};
        t.prototype.setCallback = function (e) {
          this.callback = e;
        };
        t.prototype.close = function () {
          this.node.parent = null;
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback_ok = this.callback_ok || null;
          cc.find(" button_close ", this.node).on(" click ", function () {
            e.closeAndDestroy();
          });
          var t = cc.find(" node_container ", this.node),
            o = cc.find(" toggleContainer_sens ", t);
          o.getChildByName(" toggle1 ").on(" toggle ", function () {
            r.sens_toggle_set(1);
          });
          o.getChildByName(" toggle2 ").on(" toggle ", function () {
            r.sens_toggle_set(0);
          });
          o.getChildByName(" toggle3 ").on(" toggle ", function () {
            r.sens_toggle_set(2);
          });
          this.scheduleOnce(function () {
            var e = r.sens_toggle_get();
            console.log(" sens ", e);
            0 == e ? o.getChildByName(" toggle2 ").getComponent(cc.Toggle).isChecked = !0 : 1 == e ? o.getChildByName(" toggle1 ").getComponent(cc.Toggle).isChecked = !0 : 2 == e && (o.getChildByName(" toggle3 ").getComponent(cc.Toggle).isChecked = !0);
          }, .03);
        };
        return a([s], t);
      }(cc.Component));
    o.default = c;
    cc._RF.pop();
