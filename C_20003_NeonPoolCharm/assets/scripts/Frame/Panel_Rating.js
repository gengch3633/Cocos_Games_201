let e = require;let t = module;let a = exports;
    "use strict";

    cc._RF.push(t, "f7b6eQ088hPsbfVEwwOyFW6", "Panel_Rating");
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
    var r = e("FrameData.js"),
      c = e("FrameSDK.js"),
      s = cc._decorator,
      l = s.ccclass,
      u = s.property,
      d = function (e) {
        n(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.panel_window = null;
          t.btn_close = null;
          t.label_tips1 = null;
          t.starLayout = null;
          t.EdBox = null;
          t.viewData = null;
          t.leve = 5;
          return t;
        }
        t.prototype.onOkClickEvent = function (e, t) {
          if ("0" == t) {
            if (this.leve >= 5) {
              c.FrameSDK.frameData.sdkFuc.openUrl && c.FrameSDK.frameData.sdkFuc.openUrl(cc.sys.os === cc.sys.OS_IOS ? r.FrameData.FRAME_CONF.iosRateUrl : r.FrameData.FRAME_CONF.androidRateUrl);
              r.FrameData.saveData.isRating = !0;
              c.FrameSDK.closeEffect(this, this.viewData.closeCB);
            } else {
              var a = this.panel_window.getChildByName("root"),
                o = a.getChildByName("input");
              o.active = !0;
              var n = this.panel_window.getChildByName("root2");
              a.getChildByName("label").active = !1;
              if (this.EdBox.getComponent(cc.EditBox).string.length > 0) {
                o.active = !1;
                a.active = !1;
                n.active = !0;
                r.FrameData.saveData.isRating = !0;
              } else c.FrameSDK.showToast("ukey_067");
            }
          } else c.FrameSDK.closeEffect(this, this.viewData.closeCB);
        };
        t.prototype.onLoad = function () {
          c.FrameSDK.openEffect(this);
          this.panel_window.getChildByName("root").active = !0;
          this.panel_window.getChildByName("root2").active = !1;
          this.initInput();
          r.FrameData.saveData.openRatingInedx++;
        };
        t.prototype.onStarClickEvent = function (e, t) {
          this.leve = Number(t) + 1;
          for (var a = 0; a < this.starLayout.childrenCount; a++) this.starLayout.children[a].getChildByName("yes").active = a < this.leve;
        };
        t.prototype.initInput = function () {
          var e = this,
            t = this.EdBox.getComponent(cc.EditBox);
          t.node.off(cc.Node.EventType.TOUCH_END);
          t.node.off(cc.Node.EventType.MOUSE_UP);
          t.node.on(cc.Node.EventType.TOUCH_MOVE, function (a) {
            var o = e.EdBox;
            if (0 == t.isFocused() && t.textLabel.node.height > o.height) {
              t.textLabel.node.y += a.getDeltaY();
              if (t.textLabel.node.height > o.height) {
                var n = t.textLabel.node.height - o.height;
                t.textLabel.node.y > o.height / 2 + n ? t.textLabel.node.y = o.height / 2 + n : t.textLabel.node.y < o.height / 2 && (t.textLabel.node.y = o.height / 2);
              }
            }
          }, this);
        };
        i([u(cc.Node)], t.prototype, "panel_window", void 0);
        i([u(cc.Node)], t.prototype, "btn_close", void 0);
        i([u(cc.Node)], t.prototype, "label_tips1", void 0);
        i([u(cc.Node)], t.prototype, "starLayout", void 0);
        i([u(cc.Node)], t.prototype, "EdBox", void 0);
        return i([l], t);
      }(cc.Component);
    a.default = d;
    cc._RF.pop();
