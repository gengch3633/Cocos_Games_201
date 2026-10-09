let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "a91a2P+8GBB4oyBaj6Ycndx", "CashMgr");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("EngineUtil.js"),
      i = e("MathUtil.js"),
      a = function () {
        function e() {}
        e.prototype.getBRCashNum = function (e) {
          e /= 100;
          var t = parseInt(e.toString()),
            o = n.default.thousandsNum(t.toString()),
            a = parseInt((i.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == a.length && (a = "0" + a);
          return "00" == a ? o : o + "." + a;
        };
        e.getInstance = function () {
          e._instance || (e._instance = new e());
          return e._instance;
        };
        e.prototype.getIDCashNum = function (e) {
          return n.default.thousandsNum(String(e));
        };
        e.prototype.getTRCashNum = function (e) {
          e /= 100;
          var t = parseInt(e.toString()),
            o = n.default.thousandsNum(t.toString()),
            a = parseInt((i.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == a.length && (a = "0" + a);
          return "00" == a ? o : o + "," + a;
        };
        e.prototype.getUSCashNum = function (e) {
          e /= 100;
          var t = parseInt(e.toString()),
            o = n.default.thousandsNum(t.toString(), ","),
            a = parseInt((i.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == a.length && (a = "0" + a);
          return "00" == a ? o : o + "." + a;
        };
        e.prototype.getCNCashNum = function (e) {
          if (0 == e) return e.toString();
          var t = Math.floor(100 * e) / 100 / 100,
            o = parseInt(t.toString()),
            n = o.toString(),
            a = parseInt((i.MathUtils.getInstance().accMul(t, 100) - 100 * o).toString()).toString();
          1 == a.length && (a = "0" + a);
          if ("00" == a) return n;
          2 == a.length && "0" == a[1] && (a = a[0]);
          return n + "." + a;
        };
        e.prototype.getRUCashNum = function (e) {
          e /= 100;
          var t = parseInt(e.toString()),
            o = n.default.thousandsNum(t.toString(), ","),
            a = parseInt((i.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == a.length && (a = "0" + a);
          return "00" == a ? o : o + "." + a;
        };
        return e;
      }();
    o.default = a.getInstance();
    cc._RF.pop();
