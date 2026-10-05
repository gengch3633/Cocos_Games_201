import GlobalDataMgr from "./GlobalDataMgr";
import EngineUtil from "./EngineUtil";
import { MathUtils } from "./MathUtil";
import {
    Currency,
    CurrencyMulty,
    Default_Language,
    defaultCurrencyMulty,
    languages,
} from "./SystemConfig";

class CurrencyUtil {
    private static _isntance: CurrencyUtil = null;

    private static _getInstance(): CurrencyUtil {
        if (!CurrencyUtil._isntance) {
            CurrencyUtil._isntance = new CurrencyUtil();
        }
        return CurrencyUtil._isntance;
    }

    getCurrencyUnit(): string {
        return Currency[GlobalDataMgr.curLanguage] || Currency[Default_Language];
    }

    getCommonCashNum(amount: number, thousandsSep: string, decimalSep: string): string {
        let n = MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty());
        n = Math.floor(MathUtils.getInstance().accMul(n, 100));
        n = MathUtils.getInstance().accDiv(n, 100);
        const str = String(n);
        const decimalPart = str.indexOf(".") >= 0 ? str.substring(str.indexOf(".") + 1) : "";
        const cents = Math.floor(100 * n) % 100;
        const formatted = EngineUtil.thousandsNum(
            String(Math.floor(MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty()))),
            thousandsSep
        );
        return cents > 0 ? formatted + decimalSep + decimalPart : formatted;
    }

    getRUCashNum(amount: number): string {
        return EngineUtil.thousandsNum(
            String(Math.floor(MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty()))),
            ","
        );
    }

    getCurrecyFormatStr(amount: number): string {
        if (amount == 0) {
            return amount.toString();
        }
        const value = amount / this.getCurrencyMulty();
        let result = "";
        switch (GlobalDataMgr.curLanguage) {
            case languages.IN:
                result = this.getINCashNum(amount);
                break;
            case languages.RU:
                result = this.getRUCashNum(amount);
                break;
            case languages.PH:
            case languages.US:
                result = this.getUSCashNum(amount);
                break;
            case languages.ID:
                result = this.getIDCashNum(amount);
                break;
            case languages.BR:
                result = this.getCommonCashNum(amount, ".", ",");
                break;
            default:
                result = String(value);
        }
        return result;
    }

    getIDCashNum(amount: number): string {
        return EngineUtil.thousandsNum(
            String(Math.floor(MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty()))),
            "."
        );
    }

    getUSCashNum(amount: number): string {
        amount = MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty());
        const intPart = parseInt(amount.toString(), 10);
        const formatted = EngineUtil.thousandsNum(intPart.toString(), ",");
        let cents = parseInt(
            (MathUtils.getInstance().accMul(amount, 100) - 100 * intPart).toString(),
            10
        ).toString();
        if (cents.length == 1) {
            cents = "0" + cents;
        }
        return cents == "00" ? formatted : formatted + "." + cents;
    }

    getCurrencyMulty(): number {
        return (
            (CurrencyMulty as Record<string, number>)[GlobalDataMgr.curLanguage] ||
            defaultCurrencyMulty
        );
    }

    getCurrencyWithSymbol(amount: number): string {
        return "" + this.getCurrencyUnit() + this.getCurrecyFormatStr(amount);
    }

    getINCashNum(amount: number): string {
        amount = MathUtils.getInstance().accDiv(amount, this.getCurrencyMulty());
        const intPart = parseInt(amount.toString(), 10);
        let head = intPart.toString();
        let tail = "";
        if (head.length >= 3) {
            tail = "" + head.substring(head.length - 3);
            head = head.length == 3 ? "" : head.substring(0, head.length - 3);
        } else {
            tail = head;
            head = "";
        }
        const formatted =
            (head.length < 1 ? "" : EngineUtil.hundredsNum(head, ",") + ",") + tail;
        let cents = parseInt(
            (MathUtils.getInstance().accMul(amount, 100) - 100 * intPart).toString(),
            10
        ).toString();
        if (cents.length == 1) {
            cents = "0" + cents;
        }
        return cents == "00" ? formatted : formatted + "." + cents;
    }
}

export default CurrencyUtil._getInstance();
