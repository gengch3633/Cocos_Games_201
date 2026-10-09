let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "a675cgtxTRFQpzwG+1Nq/Rc", "CurrencyUtil");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e("GlobalDataMgr.js"),
      i = e("EngineUtil.js"),
      a = e("MathUtil.js"),
      r = e("SystemConfig.js"),
      l = function () {
        function e() {}
        e.prototype.getCurrencyUnit = function () {
          return r.Currency[n.default.curLanguage] || r.Currency[r.Default_Language];
        };
        e.prototype.getCommonCashNum = function (e, t, o) {
          var n = a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
          n = Math.floor(a.MathUtils.getInstance().accMul(n, 100));
          n = a.MathUtils.getInstance().accDiv(n, 100);
          var r = String(n),
            l = r.indexOf(".") >= 0 ? r.substring(r.indexOf(".") + 1) : "",
            s = (n = Math.floor(100 * n)) % 100,
            c = i.default.thousandsNum(String(Math.floor(a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), t);
          return s > 0 ? c + o + l : c;
        };
        e.prototype.getRUCashNum = function (e) {
          return i.default.thousandsNum(String(Math.floor(a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), ",");
        };
        e.prototype.getCurrecyFormatStr = function (e) {
          if (0 == e) return e.toString();
          var t = e / this.getCurrencyMulty(),
            o = "";
          switch (n.default.curLanguage) {
            case r.languages.IN:
              o = this.getINCashNum(e);
              break;
            case r.languages.RU:
              o = this.getRUCashNum(e);
              break;
            case r.languages.PH:
            case r.languages.US:
              o = this.getUSCashNum(e);
              break;
            case r.languages.ID:
              o = this.getIDCashNum(e);
              break;
            case r.languages.BR:
              o = this.getCommonCashNum(e, ".", ",");
              break;
            default:
              o = String(t);
          }
          return o;
        };
        e.prototype.getIDCashNum = function (e) {
          return i.default.thousandsNum(String(Math.floor(a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), ".");
        };
        e.prototype.getUSCashNum = function (e) {
          e = a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
          var t = parseInt(e.toString()),
            o = i.default.thousandsNum(t.toString(), ","),
            n = parseInt((a.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == n.length && (n = "0" + n);
          return "00" == n ? o : o + "." + n;
        };
        e.prototype.getCurrencyMulty = function () {
          return r.CurrencyMulty[n.default.curLanguage] || r.defaultCurrencyMulty;
        };
        e.prototype.getCurrencyWithSymbol = function (e) {
          return "" + this.getCurrencyUnit() + this.getCurrecyFormatStr(e);
        };
        e._getInstance = function () {
          e._isntance || (e._isntance = new e());
          return e._isntance;
        };
        e.prototype.getINCashNum = function (e) {
          e = a.MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
          var t = parseInt(e.toString()),
            o = t.toString(),
            n = "";
          if (o.length >= 3) {
            n = "" + o.substring(o.length - 3);
            o = 3 == o.length ? "" : o.substring(0, o.length - 3);
          } else {
            n = o;
            o = "";
          }
          var r = (o.length < 1 ? "" : i.default.hundredsNum(o, ",") + ",") + n,
            l = parseInt((a.MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
          1 == l.length && (l = "0" + l);
          return "00" == l ? r : r + "." + l;
        };
        return e;
      }();
    o.default = l._getInstance();
    cc._RF.pop();
