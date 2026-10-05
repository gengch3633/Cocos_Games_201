let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "f4bc4cG5QxGmKVHx3xNLpKK", "Panel_ActivityGuide");
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
          t.bg = null;
          t.bankLogo = null;
          t.levelLogo = null;
          t.rtx_tips1 = null;
          t.tips2 = null;
          t.rtx_tips2 = null;
          t.progressBar = null;
          t.progressLabel = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
        };
        t.prototype.onLoad = function () {
          var e = this,
            t = .5 * cc.winSize.width + .5 * this.bg.width;
          this.bg.x = t;
          this.bankLogo.active = " bank " === this.viewData.logoType;
          this.levelLogo.active = " levelReward " === this.viewData.logoType;
          this.rtx_tips1.node.active = 1 == this.viewData.type;
          this.rtx_tips1.string = this.viewData.text;
          this.tips2.active = 2 == this.viewData.type;
          if (2 == this.viewData.type) {
            this.rtx_tips2.string = this.viewData.text;
            this.progressBar.progress = this.viewData.total <= 0 ? 0 : this.viewData.now / this.viewData.total;
            this.progressLabel.string = this.viewData.now + "/ " + this.viewData.total;
          }
          r.FrameSDK.playEffect(" rewardshow ");
          cc.tween(this.bg).to(.7, {
            x: 0
          }, {
            easing: " backOut "
          }).delay(this.viewData.dtime || 1).to(.7, {
            x: -t
          }, {
            easing: " backIn "
          }).call(function () {
            r.FrameSDK.closeEffect(e, null);
          }).start();
        };
        t.prototype.onDisable = function () {
          var e, t;
          null === (t = (e = this.viewData).closeCB) || void 0 === t || t.call(e);
        };
        i([l(cc.Node)], t.prototype, " bg ", void 0);
        i([l(cc.Node)], t.prototype, " bankLogo ", void 0);
        i([l(cc.Node)], t.prototype, " levelLogo ", void 0);
        i([l(cc.RichText)], t.prototype, " rtx_tips1 ", void 0);
        i([l(cc.Node)], t.prototype, " tips2 ", void 0);
        i([l(cc.RichText)], t.prototype, " rtx_tips2 ", void 0);
        i([l(cc.ProgressBar)], t.prototype, " progressBar ", void 0);
        i([l(cc.Label)], t.prototype, " progressLabel ", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
