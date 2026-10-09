let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "75e38jicRBGA4JOGMQswq3F", "PowerBarComp");
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
      s = (r.property, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.callback = null;
          t.callback_update = null;
          t.valueY = null;
          return t;
        }
        t.prototype.onLoad = function () {
          var e = this,
            t = this.node.getChildByName("node_powerbars"),
            o = t.children;
          this.callback = this.callback || null;
          this.callback_update = this.callback_update || null;
          this.valueY = 0;
          this.node.on(cc.Node.EventType.TOUCH_START, function (n) {
            console.log("TOUCH_START", n);
            var i = n.touch._point;
            e.valueY = 0;
            i = n.touch._point, n.touch._prevPoint;
            for (var a = t.convertToNodeSpaceAR(i), r = 0; r < o.length; r++) if (o[r].y > a.y) o[r].opacity = 0;else {
              o[r].opacity = 255;
              e.valueY = e.valueY + 1;
            }
            e.callback_update && e.callback_update(e.getPercent());
            e.updateLabel();
          });
          this.node.on(cc.Node.EventType.TOUCH_MOVE, function (n) {
            var i = n.touch._point,
              a = n.touch._prevPoint;
            i.y, a.y;
            e.valueY = 0;
            var r = t.convertToNodeSpaceAR(i);
            console.log("p ", r.y);
            for (var l = 0; l < o.length; l++) if (o[l].y > r.y) o[l].opacity = 0;else {
              o[l].opacity = 255;
              e.valueY = e.valueY + 1;
            }
            e.callback_update && e.callback_update(e.getPercent());
            e.updateLabel();
          });
          this.node.on(cc.Node.EventType.TOUCH_END, function () {
            console.log("TOUCH_END", e.valueY);
            e.hideAllBars();
            e.callback && e.callback(e.getPercent());
            e.clearLabel();
          });
          this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            console.log("TOUCH_CANCEL", e.valueY);
            e.hideAllBars();
            e.callback && e.callback(e.getPercent());
            e.clearLabel();
          });
          e.hideAllBars();
        };
        t.prototype.hideAllBars = function () {
          for (var e = this.node.getChildByName("node_powerbars").children, t = 0; t < e.length; t++) e[t].opacity = 0;
        };
        t.prototype.getPercent = function () {
          return this.valueY / 11;
        };
        t.prototype.setCallBack = function (e) {
          this.callback = e;
        };
        t.prototype.setCallBack_update = function (e) {
          this.callback_update = e;
        };
        t.prototype.updateLabel = function () {
          var e = cc.find("label_value", this.node);
          e && (e.getComponent(cc.Label).string = Math.floor(100 * this.getPercent()));
        };
        t.prototype.clearLabel = function () {
          var e = cc.find("label_value", this.node);
          e && (e.getComponent(cc.Label).string = "");
        };
        t.prototype.applyByPower = function (e) {
          var t = cc.find("label_value", this.node);
          t && (t.getComponent(cc.Label).string = e);
        };
        return a([l], t);
      }(cc.Component));
    o.default = s;
    cc._RF.pop();
