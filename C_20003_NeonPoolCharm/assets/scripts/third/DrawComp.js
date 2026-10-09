let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "7ffb3XOlr5NU6mjiEK1i2Ts", "DrawComp");
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
          t.graphics = null;
          return t;
        }
        t.prototype.randNumber = function () {
          var e = Math.random();
          e < .1 && (e = .1);
          return e;
        };
        t.prototype.clear = function () {
          var e = this.graphics;
          e && e.clear();
        };
        t.prototype.drawDir = function (e, t, o) {
          o = o || "#00ff00";
          var n = this.graphics;
          if (n) {
            n.clear();
            n.strokeColor.fromHEX(o);
            n.strokeColor.a = 125;
            n.moveTo(e.x, e.y);
            n.lineTo(t.x, t.y);
            n.stroke();
          }
        };
        t.prototype.drawRect = function (e) {
          e.x = 0;
          e.y = 0;
          var t = this.graphics;
          if (t) {
            t.clear();
            t.strokeColor.fromHEX("#00ff00");
            t.strokeColor.a = 125;
            t.rect(e.x, e.y, e.width, e.height);
            t.stroke();
          }
        };
        t.prototype.drawcircle = function (e, t, o) {
          o = o || "#00ff00";
          var n = this.graphics;
          if (n) {
            n.strokeColor.fromHEX(o);
            n.strokeColor.a = 125;
            n.circle(e.x, e.y, 15);
            t && n.circle(t.x, t.y, 15);
            n.stroke();
          }
        };
        t.prototype.start = function () {};
        t.prototype.onLoad = function () {
          this.graphics = this.getComponent(cc.Graphics);
          if (this.graphics) {
            this.graphics.lineWidth = 2;
            this.size = 150;
            this.num = 6;
          }
        };
        t.prototype.drawSix = function (e) {
          var t = this.graphics;
          if (t) {
            t.strokeColor.fromHEX("#00ff00");
            t.strokeColor.a = 0;
            for (var o = {
                x: 0,
                y: 0
              }, n = 0; n < this.num; n++) {
              var i = n / 3 * Math.PI,
                a = e * this.randNumber(),
                r = a * Math.cos(i),
                l = a * Math.sin(i);
              if (0 === n) {
                o.x = r;
                o.y = l;
                t.moveTo(r, l);
              }
              t.lineTo(r, l);
            }
            t.lineTo(o.x, o.y);
            t.moveTo(0, 0);
            t.fillColor.fromHEX("#00ff00");
            t.fillColor.a = 125;
            t.fill();
            t.stroke();
          }
        };
        t.prototype.drawSixLine = function (e) {
          var t = this.graphics;
          if (t) {
            t.strokeColor.fromHEX("#ffffff");
            t.strokeColor.a = 0;
            for (var o = 0; o < this.num; o++) {
              var n = o / 3 * Math.PI,
                i = e * Math.cos(n),
                a = e * Math.sin(n);
              t.moveTo(0, 0);
              t.lineTo(i, a);
            }
            for (var r = this.size / 3, l = 1; l < 4; l++) t.circle(0, 0, l * r);
            t.stroke();
          }
        };
        return a([l], t);
      }(cc.Component));
    o.default = s;
    cc._RF.pop();
