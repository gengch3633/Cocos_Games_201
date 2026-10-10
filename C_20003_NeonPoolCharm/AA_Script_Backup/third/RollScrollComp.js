let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "d9b53ISUflC5q2gsTNAkzSb", "RollScrollComp");
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
    var r = e("EventMgr.js"),
      l = e("GameEventType.js"),
      s = cc._decorator,
      c = s.ccclass,
      u = s.property,
      p = r.default,
      d = l.default,
      _ = function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.item_prefab = null;
          t.rolleNode = null;
          t.callback = null;
          t.valueY = null;
          return t;
        }
        t.prototype.setCallBack = function (e) {
          this.callback = e;
        };
        t.prototype.updateLabel = function (e) {
          cc.find("label_value", this.node.parent).getComponent(cc.Label).string = e;
        };
        t.prototype.clearLabel = function () {
          cc.find("label_value", this.node.parent).getComponent(cc.Label).string = "";
        };
        t.prototype.onLoad = function () {
          var e = this;
          this.callback = this.callback || null;
          this.valueY = 0;
          var t = this.node.parent;
          t.on(cc.Node.EventType.TOUCH_START, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
              p.trigger(d.HIDE_GAMETIP);
              t.touch._point;
              e.valueY = 0;
            }
          });
          t.on(cc.Node.EventType.TOUCH_MOVE, function (t) {
            if (!t.touch || 0 == t.touch.getID()) {
              p.trigger(d.HIDE_GAMETIP);
              var o = t.touch._point,
                n = t.touch._prevPoint,
                i = o.x - n.x;
              e.valueY = e.valueY + i;
              var a = e.rolleNode.x += i,
                r = Math.abs(a);
              r > 126 && (a = (i < 0 ? -1 : 1) * (r - 126));
              e.rolleNode.x = a;
              e.callback && e.callback(i, e.valueY);
            }
          });
          t.on(cc.Node.EventType.TOUCH_END, function () {});
          t.on(cc.Node.EventType.TOUCH_CANCEL, function () {});
        };
        a([u(cc.Prefab)], t.prototype, "item_prefab", void 0);
        a([u(cc.Node)], t.prototype, "rolleNode", void 0);
        return a([c], t);
      }(cc.Component);
    o.default = _;
    cc._RF.pop();
