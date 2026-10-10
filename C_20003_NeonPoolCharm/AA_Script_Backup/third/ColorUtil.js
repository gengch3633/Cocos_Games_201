let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "c586cjP0a5FjpZrzNfC8oaB", "ColorUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.isHex = function (e) {
        return /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(e);
      };
      e.rgbaToHex = function (e) {
        var t = (256 | e.r).toString(16).slice(1),
          o = (256 | e.g).toString(16).slice(1),
          n = (256 | e.b).toString(16).slice(1);
        return null == e.a ? ("#" + t + o + n).toUpperCase() : ("#" + t + o + n + (256 | e.a).toString(16).slice(1)).toUpperCase();
      };
      e.hexToRgba = function (t) {
        return e.isHex(t) ? {
          r: parseInt(t.substr(1, 2), 16) || 0,
          g: parseInt(t.substr(3, 2), 16) || 0,
          b: parseInt(t.substr(5, 2), 16) || 0,
          a: parseInt(t.substr(7, 2), 16) || 255
        } : null;
      };
      return e;
    }();
    o.default = n;
    cc._RF.pop();
