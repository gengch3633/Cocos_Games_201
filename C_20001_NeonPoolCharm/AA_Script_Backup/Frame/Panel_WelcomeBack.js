let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "14770+XpL1EBKNdijlKLGk4", "Panel_WelcomeBack");
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
var r = e(FrameSDK "
  }].js),
      c = cc._decorator,
      s = c.ccclass,
      l = c.property,
      u = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.animationNode = null;
          t.richText = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
          r.FrameSDK.playEffect(" rewardshow ");
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.animationNode.width;
          this.animationNode.x = t;
          cc.tween(this.animationNode).to(.7, {
            x: 0
          }, {
            easing: " backOut "
          }).delay(2).to(.7, {
            x: -t
          }, {
            easing: " backIn "
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
          this.richText.string = " skey_122?? & value1 == < size = 36 > < color = # FDFF48 > 30 < / c > < / size > ";
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, " animationNode ", void 0);
        i([l(cc.RichText)], t.prototype, " richText ", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
