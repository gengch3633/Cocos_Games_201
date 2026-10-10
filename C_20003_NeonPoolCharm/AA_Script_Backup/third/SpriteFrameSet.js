let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "e6420SktkRNVZzYM4C08TMC", "SpriteFrameSet");
    var n = this && this.__decorate || function (e, t, o, n) {
      var i,
        a = arguments.length,
        r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
      if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n);else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, o, r) : i(t, o)) || r);
      return a > 3 && r && Object.defineProperty(t, o, r), r;
    };
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var i = cc._decorator,
      a = i.ccclass,
      r = i.property,
      l = function () {
        function e() {
          this.language = "";
          this.spriteFrame = null;
        }
        n([r], e.prototype, "language", void 0);
        n([r(cc.SpriteFrame)], e.prototype, "spriteFrame", void 0);
        return n([a], e);
      }();
    o.default = l;
    cc._RF.pop();
