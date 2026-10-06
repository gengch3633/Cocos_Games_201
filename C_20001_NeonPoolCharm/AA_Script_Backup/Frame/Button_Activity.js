let e = require;
let t = module;
let a = exports;
"use strict";
cc._RF.push(t, "d6557CC4r1O/I3rLAD53b5W", "Button_Activity");
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
var r = e("CLICKLOCK.js"),
c = e("FrameData.js"),
s = e("FrameSDK.js"),
l = e(Panel_Activity "
  }].js),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleLabel = null;
          t.progressRichText = null;
          t.point = null;
          t.addNode = null;
          t.but = null;
          t._buttonOriginalPositionY = 0;
          return t;
        }
        t.prototype.onLoad = function () {
          this._buttonOriginalPositionY = this.but.position.y;
          this.addNode.active = !1;
          l.default.coinTarget = this.but;
          cc.director.on(" UPDATA_ACTIVITY ", this.updateUI, this);
          cc.director.on(" UPDATA_ACTIVITY_COIN ", this.updateCoin, this);
          this.titleLabel.string = s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.PiggyConfig.num, !0);
          this.updateUI();
        };
        t.prototype.updateCoin = function (e, t, a) {
          var o = this;
          this.addNode.active = !0;
          this.addNode.getComponentInChildren(cc.Label).string = "+ " + s.FrameSDK.convertCoinToStr(e);
          this.addNode.stopAllActions();
          this.addNode.opacity = 255;
          this.addNode.y = 0;
          cc.Tween.stopAllByTarget(this.addNode);
          cc.tween(this.addNode).to(1, {
            y: 25
          }, {
            onUpdate: function (e, n) {
              o._updateProgress(cc.misc.lerp(t, a, n));
            }
          }).call(function () {
            o._updateProgress(a);
          }).to(.5, {
            opacity: 0
          }).call(function () {
            o.addNode.active = !1;
            o.point.opacity = l.default.isAcitiviyClaimable() ? 255 : 0;
          }).start();
        };
        t.prototype._updateProgress = function (e) {
          this.progressRichText.string = " < outline color = # 9C22C5 width = 2 > < color = # 86FF04 > " + s.FrameSDK.convertCoinToStr(e) + " < / c > / " + s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.PiggyConfig.num) + " < / outline > ";
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          var e = s.FrameSDK.frameData.gameData.currentScene,
            t = c.FrameData.saveData.activity;
          this.but.setPosition(0, this._buttonOriginalPositionY + (" game " === e ? 107 : 0));
          this.but.scale = " game " === e ? .8 : 1;
          if (t) {
            this.but.opacity = " home " === e || " game " === e ? 255 : 0;
            this.progressRichText.node.parent.active = l.default.isActivityCollectable() || l.default.isAcitiviyClaimable();
            this._updateProgress(t.coin);
            this.point.opacity = l.default.isAcitiviyClaimable() ? 255 : 0;
          } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
          }
        };
        t.prototype.onBtnEvent = function () {
          l.default.startActivity();
        };
        i([p(cc.Label)], t.prototype, " titleLabel ", void 0);
        i([p(cc.RichText)], t.prototype, " progressRichText ", void 0);
        i([p(cc.Node)], t.prototype, " point ", void 0);
        i([p(cc.Node)], t.prototype, " addNode ", void 0);
        i([p(cc.Node)], t.prototype, " but ", void 0);
        i([r.CLICKLOCK()], t.prototype, " onBtnEvent ", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
