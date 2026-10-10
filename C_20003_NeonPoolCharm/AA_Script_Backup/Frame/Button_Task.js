let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "a966ep7w7xGdaugn8VUtNR3", "Button_Task");
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
      l = e("Panel_Task.js"),
      u = cc._decorator,
      d = u.ccclass,
      p = u.property,
      h = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.point = null;
          t.but = null;
          return t;
        }
        t.prototype.onLoad = function () {
          cc.director.on("UPDATA_LEVEL", this.updateUI, this);
          cc.director.on("UPDATA_TASK", this.updateUI, this);
          l.default.coinTarget = this.but;
          this.updateUI();
        };
        t.prototype.onBtnEvent = function () {
          l.default.startTask();
        };
        t.prototype.onDestroy = function () {
          cc.director.removeAll(this);
        };
        t.prototype.updateUI = function () {
          this.but.active = Boolean(c.FrameData.saveData.lvAwardinfo) && "home" === s.FrameSDK.frameData.gameData.currentScene;
          this.point.opacity = l.default.isTaskFinish() ? 255 : 0;
        };
        i([p(cc.Node)], t.prototype, "point", void 0);
        i([p(cc.Node)], t.prototype, "but", void 0);
        i([r.CLICKLOCK()], t.prototype, "onBtnEvent", null);
        return i([d], t);
      }(cc.Component);
    a.default = h;
    cc._RF.pop();
