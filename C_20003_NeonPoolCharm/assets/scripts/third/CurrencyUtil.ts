import EngineUtil from "./EngineUtil";
import GlobalDataMgr from "./GlobalDataMgr";
import { MathUtils } from "./MathUtil";
import { Currency, CurrencyMulty, Default_Language, defaultCurrencyMulty, languages } from "./SystemConfig";

class CurrencyUtil {
    static _isntance;

    getCurrencyUnit() {
        return Currency[GlobalDataMgr.curLanguage] || Currency[Default_Language];
    }

    getCommonCashNum(e, t, o) {
        let n = MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
        n = Math.floor(MathUtils.getInstance().accMul(n, 100));
        n = MathUtils.getInstance().accDiv(n, 100);
        const r = String(n);
        const l = r.indexOf(".") >= 0 ? r.substring(r.indexOf(".") + 1) : "";
        const s = (n = Math.floor(100 * n)) % 100;
        const c = EngineUtil.thousandsNum(String(Math.floor(MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), t);
        return s > 0 ? c + o + l : c;
    }

    getRUCashNum(e) {
        return EngineUtil.thousandsNum(String(Math.floor(MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), ",");
    }

    getCurrecyFormatStr(e) {
        if (0 == e) return e.toString();
        const t = e / this.getCurrencyMulty();
        let o = "";
        switch (GlobalDataMgr.curLanguage) {
            case languages.IN:
                o = this.getINCashNum(e);
                break;
            case languages.RU:
                o = this.getRUCashNum(e);
                break;
            case languages.PH:
            case languages.US:
                o = this.getUSCashNum(e);
                break;
            case languages.ID:
                o = this.getIDCashNum(e);
                break;
            case languages.BR:
                o = this.getCommonCashNum(e, ".", ",");
                break;
            default:
                o = String(t);
        }
        return o;
    }

    getIDCashNum(e) {
        return EngineUtil.thousandsNum(String(Math.floor(MathUtils.getInstance().accDiv(e, this.getCurrencyMulty()))), ".");
    }

    getUSCashNum(e) {
        e = MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
        const t = parseInt(e.toString());
        const o = EngineUtil.thousandsNum(t.toString(), ",");
        let n = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        1 == n.length && (n = "0" + n);
        return "00" == n ? o : o + "." + n;
    }

    getCurrencyMulty() {
        return CurrencyMulty[GlobalDataMgr.curLanguage] || defaultCurrencyMulty;
    }

    getCurrencyWithSymbol(e) {
        return "" + this.getCurrencyUnit() + this.getCurrecyFormatStr(e);
    }

    static _getInstance() {
        CurrencyUtil._isntance || (CurrencyUtil._isntance = new CurrencyUtil());
        return CurrencyUtil._isntance;
    }

    getINCashNum(e) {
        e = MathUtils.getInstance().accDiv(e, this.getCurrencyMulty());
        const t = parseInt(e.toString());
        let o = t.toString();
        let n = "";
        if (o.length >= 3) {
            n = "" + o.substring(o.length - 3);
            o = 3 == o.length ? "" : o.substring(0, o.length - 3);
        } else {
            n = o;
            o = "";
        }
        const r = (o.length < 1 ? "" : EngineUtil.hundredsNum(o, ",") + ",") + n;
        let l = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        1 == l.length && (l = "0" + l);
        return "00" == l ? r : r + "." + l;
    }
}

export default CurrencyUtil._getInstance();
