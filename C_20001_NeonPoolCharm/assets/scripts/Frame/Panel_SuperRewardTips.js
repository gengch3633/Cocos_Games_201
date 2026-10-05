let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "46413x8eKxFeJag0fsBTMK0", "Panel_SuperRewardTips");
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
          t.panel_window = null;
          t.titleLabel = null;
          t.errorNode = null;
          t.bonusLabel = null;
          t.tipLabel = null;
          t.quitButtonNode = null;
          t.keepButtonNode = null;
          t.collectButtonNode = null;
          t.returnButtonNode = null;
          t.viewData = null;
          return t;
        }
        t.prototype.onQuitButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !1);
          });
        };
        t.prototype.onCollectButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        t.prototype.onEnable = function () {
          r.FrameSDK.openEffect(this);
          switch (this.viewData.type) {
            case " quit ":
              this.titleLabel.string = " skey_140 ";
              this.errorNode.active = !1;
              this.bonusLabel.node.parent.active = !0;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = " skey_141 ";
              this.quitButtonNode.active = !0;
              this.keepButtonNode.active = !0;
              this.collectButtonNode.active = !1;
              this.returnButtonNode.active = !1;
              break;
            case " complete ":
              this.titleLabel.string = " skey_144 ";
              this.errorNode.active = !1;
              this.bonusLabel.node.parent.active = !0;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = " skey_145 ";
              this.quitButtonNode.active = !1;
              this.keepButtonNode.active = !1;
              this.collectButtonNode.active = !0;
              this.returnButtonNode.active = !1;
              break;
            case " error ":
              this.titleLabel.string = " skey_150 ";
              this.errorNode.active = !0;
              this.bonusLabel.node.parent.active = !1;
              this.bonusLabel.string = r.FrameSDK.convertCoinToStr(this.viewData.bonus, !0);
              this.tipLabel.string = " skey_151 ";
              this.quitButtonNode.active = !1;
              this.keepButtonNode.active = !1;
              this.collectButtonNode.active = !1;
              this.returnButtonNode.active = !0;
          }
        };
        t.prototype.onReturnButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        t.prototype.onKeepButtonClick = function () {
          var e = this;
          r.FrameSDK.closeEffect(this, function () {
            var t, a;
            return null === (a = (t = e.viewData).callback) || void 0 === a ? void 0 : a.call(t, !0);
          });
        };
        i([l(cc.Node)], t.prototype, " panel_window ", void 0);
        i([l(cc.Label)], t.prototype, " titleLabel ", void 0);
        i([l(cc.Node)], t.prototype, " errorNode ", void 0);
        i([l(cc.Label)], t.prototype, " bonusLabel ", void 0);
        i([l(cc.Label)], t.prototype, " tipLabel ", void 0);
        i([l(cc.Node)], t.prototype, " quitButtonNode ", void 0);
        i([l(cc.Node)], t.prototype, " keepButtonNode ", void 0);
        i([l(cc.Node)], t.prototype, " collectButtonNode ", void 0);
        i([l(cc.Node)], t.prototype, " returnButtonNode ", void 0);
        return i([s], t);
      }(cc.Component);
    a.default = u;
    cc._RF.pop();
