let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "52985DRg/1L6o4WSlNnwLNI", "GodText");
    var n,
      i = this && this.__extends || (n = function (e, t) {
        return (n = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (e, t) {
          e.__proto__ = t;
        } || function (e, t) {
          for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        })(e, t);
      }, function (e, t) {
        n(e, t);
        function o() {
          this.constructor = e;
        }
        e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
      }),
      a = this && this.__decorate || function (e, t, o, n) {
        var i,
          a = arguments.length,
          r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
        return a > 3 && r && Object.defineProperty(t, o, r), r;
      };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = cc._decorator,
      l = r.ccclass,
      s = r.property,
      c = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.label = null;
          t.group = null;
          t.callback = null;
          t.canClick = !1;
          return t;
        }
        t.prototype.setText = function (e, t, o) {
          var n = this;
          this.node.active = "" != e;
          if (e) {
            this.callback = o;
            this.label || (this.label = this.node.getComponentInChildren(cc.RichText));
            this.label.string = e;
            this.label.node.scale = .8;
            this.canClick = !1;
            cc.Tween.stopAllByTarget(this.label.node);
            cc.tween(this.label.node).to(.3, {
              scale: 1
            }, {
              easing: "backOut"
            }).call(function () {
              return n.canClick = !0;
            }).start();
          }
        };
        t.prototype.setPos = function (e) {
          this.group.position = e;
        };
        t.prototype.start = function () {
          var e = this;
          this.node.on(cc.Node.EventType.TOUCH_START, function () {
            e.node._touchListener.setSwallowTouches(!1);
            if (e.node.active) {
              e.node.active = !1;
              e.node.emit("click");
            }
          });
        };
        a([s(cc.RichText)], t.prototype, "label", void 0);
        a([s(cc.Node)], t.prototype, "group", void 0);
        return a([l], t);
      }(cc.Component);
    o.default = c;
    cc._RF.pop();
