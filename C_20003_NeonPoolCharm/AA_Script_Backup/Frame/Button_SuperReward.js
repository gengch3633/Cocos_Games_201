let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "c4dd1PZdeFLlqxD8KNCjk2C", "Button_SuperReward");
    var o,
      n = this && this.__extends || (o = function (e, t) {
        return (o = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
        })(e, t);
      }, function (e, t) {
        o(e, t);
        function a() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
      }),
      i = this && this.__decorate || function (e, t, a, o) {
        var n,
          i = arguments.length,
          r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, a) : o;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, a, o);else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (r = (i < 3 ? n(r) : i > 3 ? n(t, a, r) : n(t, a)) || r);
        return i > 3 && r && Object.defineProperty(t, a, r), r;
      };
    Object.defineProperty(a, "__esModule", {
      value: !0
    });
    var r = e("CLICKLOCK.js"),
      c = e("FrameData.js"),
      s = e("FrameSDK.js"),
      l = e("Panel_SuperReward.js"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.titleLabel = null;
          t.point = null;
          t.but = null;
          t._buttonOriginalPositionY = 0;
          return t;
        }
        t.prototype.onLoad = function () {
          this._buttonOriginalPositionY = this.but.position.y;
          cc.director.on("UPDATA_SUPER_REWARD", this.updateUI, this);
          l.default.coinTarget = this.but;
          this.titleLabel.string = s.FrameSDK.convertCoinToStr(c.FrameData.FRAME_CONF.SuperRewardConfig.extraRewardDisplay, !0);
          this.updateUI();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          this.node.scale = s.FrameSDK.frameData.gameData.noProfitAd || !c.FrameData.FRAME_CONF.superRewardEnabled ? 0 : 1;
          var e = s.FrameSDK.frameData.gameData.currentScene,
            t = c.FrameData.saveData.superReward;
          this.but.setPosition(0, this._buttonOriginalPositionY + ("game" === e ? 282 : 0));
          this.but.scale = "game" === e ? .8 : 1;
          if (t) {
            this.but.opacity = "home" === e || "game" === e ? 255 : 0;
            this.point.opacity = l.default.hasTaskOrReward() ? 255 : 0;
          } else {
            this.but.opacity = 0;
            this.point.opacity = 0;
          }
        };
        t.prototype.onBtnEvent = function () {
          l.default.startSuperReward();
        };
        i([p(cc.Label)], t.prototype, "titleLabel", void 0);
        i([p(cc.Node)], t.prototype, "point", void 0);
        i([p(cc.Node)], t.prototype, "but", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
