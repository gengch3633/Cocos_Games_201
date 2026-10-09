let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "00ba3l3251EPbWQ/EntwKrb", "Panel_Guide");
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
    var r = e("Frame.js"),
      c = e("Frame.jsData"),
      s = e("Frame.jsSDK"),
      l = cc._decorator,
      u = l.ccclass,
      d = l.property,
      p = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.type = 0;
          return t;
        }
        t.prototype.updataUi = function () {};
        t.prototype.onLoad = function () {
          this.node.active = c.FrameData.saveData.guideInedx == this.type;
          if (this.node.active) {
            0 == this.type || this.scheduleOnce(this.updataUi.bind(this));
            this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
          }
        };
        t.prototype.onTouch = function () {
          c.FrameData.saveData.guideInedx++;
          if (0 == this.type) {
            this.node.active = !1;
            r.default.ins.setGuideShow(!1);
            s.FrameSDK.openPanel_Yellow();
          } else this.updataUi();
        };
        i([d()], t.prototype, "type", void 0);
        return i([u], t);
      }(cc.Component);
    a.default = p;
    cc._RF.pop();
