let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "26522SksYxJdIKQaB5LayiK", "Panel_Tips");
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
c = e(FrameSDK "
  }].js),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.rtx_tips1 = null;
          t.bar = null;
          t.labelbar = null;
          t.labelBtn = null;
          t.viewData = null;
          t.hideTime = 0;
          return t;
        }
        t.prototype.onTouchCloseTips = function () {
          if (Date.now() - this.hideTime <= 300) console.log(" wait ! ! ! ， return ");else {
            this.hideTime = Date.now();
            c.FrameSDK.closeEffect(this, null);
          }
        };
        t.prototype.clickConfirm = function () {
          this.onTouchCloseTips();
        };
        t.prototype.onEnable = function () {
          c.FrameSDK.openEffect(this);
          var e = " ",
            t = " LV." + this.viewData.now + "/ LV." + this.viewData.total;
          this.labelBtn.string = " skey_060 ";
          if (this.viewData.isCharity) {
            if (1 == this.viewData.status) {
              this.labelBtn.string = " skey_061 ";
              t = this.viewData.now + "/ " + this.viewData.total;
              e = " skey_081?? & value1 == < color = # DF4704 > " + this.viewData.total + " < / c > & value2 == < color = # DF4704 > " + Math.ceil(Math.max(0, this.viewData.total - this.viewData.now) / r.FrameData.getCoinOutNum(" charity ")) + " < / c > ";
            } else 2 == this.viewData.status && (e = " skey_059?? & value1 == < color = # DF4704 > " + this.viewData.total + " < / c > & value2 == < color = # DF4704 > " + this.viewData.now + " < / c > & value3 == < color = # DF4704 > " + Math.max(0, this.viewData.total - this.viewData.now) + " < / c > ");
          } else if (1 == this.viewData.status) e = " skey_057?? & value1 == < color = # DF4704 > " + this.viewData.total + " < / c > & value2 == < color = # DF4704 > " + this.viewData.now + " < / c > & value3 == < color = # DF4704 > " + Math.max(0, this.viewData.total - this.viewData.now) + " < / c > ";else if (2 == this.viewData.status) {
            this.labelBtn.string = " skey_061 ";
            t = c.FrameSDK.convertCoinToStr(this.viewData.now, !0) + "/ " + c.FrameSDK.convertCoinToStr(this.viewData.total, !0);
            e = " skey_058?? & value1 == < color = # 009D12 > " + c.FrameSDK.convertCoinToStr(this.viewData.now, !0) + " < / c > & value2 == < color = # 009D12 > " + c.FrameSDK.convertCoinToStr(this.viewData.total, !0) + " < / c > ";
          } else 3 == this.viewData.status && (e = " skey_059?? & value1 == < color = # DF4704 > " + this.viewData.total + " < / c > & value2 == < color = # DF4704 > " + this.viewData.now + " < / c > & value3 == < color = # DF4704 > " + Math.max(0, this.viewData.total - this.viewData.now) + " < / c > ");
          this.rtx_tips1.string = e;
          this.bar.fillRange = this.viewData.now / this.viewData.total;
          this.labelbar.string = t;
        };
        i([u(cc.Node)], t.prototype, " panel_window ", void 0);
        i([u(cc.RichText)], t.prototype, " rtx_tips1 ", void 0);
        i([u(cc.Sprite)], t.prototype, " bar ", void 0);
        i([u(cc.Label)], t.prototype, " labelbar ", void 0);
        i([u(cc.Label)], t.prototype, " labelBtn ", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
