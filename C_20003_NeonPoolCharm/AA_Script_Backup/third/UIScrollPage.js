let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "f3f92YzBJBC/pYnZdCGU7uA", "UIScrollPage");
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
      c = (cc._decorator, function (e) {
        i(t, e);
        function t() {
          var t = null !== e && e.apply(this, arguments) || this;
          t.maxPage = 0;
          t.selectSprite = null;
          t.unSelectSprite = null;
          t.currentIndex = 0;
          t.spArr = [];
          return t;
        }
        t.prototype.scrollTo = function (e) {
          var t = this.spArr[this.currentIndex];
          t && (t.spriteFrame = this.unSelectSprite);
          this.currentIndex = e;
          var o = this.spArr[this.currentIndex];
          o && (o.spriteFrame = this.selectSprite);
        };
        t.prototype.setMaxPage = function (e) {
          this.maxPage = e;
          for (var t = 0; t < e; t++) {
            var o = new cc.Node(),
              n = o.addComponent(cc.Sprite);
            n.spriteFrame = this.unSelectSprite;
            this.node.addChild(o);
            this.spArr.push(n);
          }
          this.scrollTo(0);
        };
        t.prototype.onLoad = function () {
          this.node.removeAllChildren();
        };
        a([s], t.prototype, "maxPage", void 0);
        a([s(cc.SpriteFrame)], t.prototype, "selectSprite", void 0);
        a([s(cc.SpriteFrame)], t.prototype, "unSelectSprite", void 0);
        return a([l], t);
      }(cc.Component));
    o.default = c;
    cc._RF.pop();
