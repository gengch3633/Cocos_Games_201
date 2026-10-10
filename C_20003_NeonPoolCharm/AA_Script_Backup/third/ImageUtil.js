let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "2c837SJjaNFc51YVOU3ZGQ3", "ImageUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = function () {
      function e() {}
      e.getTrim = function (e, t, o) {
        var n,
          i,
          a,
          r = 0,
          l = 0,
          s = 4 * t;
        e: for (r = 0; r < t; r++) for (l = 0; l < o; l++) if (0 !== e[s * l + 4 * r + 3]) break e;
        n = r;
        e: for (r = t - 1; r >= 0; r--) for (l = 0; l < o; l++) if (0 !== e[s * l + 4 * r + 3]) break e;
        i = r + 1;
        e: for (r = 0; r < o; r++) for (l = 0; l < t; l++) if (0 !== e[s * r + 4 * l + 3]) break e;
        a = r;
        e: for (r = o - 1; r >= 0; r--) for (l = 0; l < t; l++) if (0 !== e[s * r + 4 * l + 3]) break e;
        return {
          minX: n,
          maxX: i,
          minY: a,
          maxY: r + 1
        };
      };
      return e;
    }();
    o.default = n;
    cc._RF.pop();
