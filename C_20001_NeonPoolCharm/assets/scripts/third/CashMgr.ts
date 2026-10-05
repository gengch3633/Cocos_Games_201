import EngineUtil from "./EngineUtil";
import { MathUtils } from "./MathUtil";

class CashMgr {
    private static _instance: CashMgr = null;

    static getInstance(): CashMgr {
        if (!CashMgr._instance) {
            CashMgr._instance = new CashMgr();
        }
        return CashMgr._instance;
    }

    getBRCashNum(amount: number): string {
        amount /= 100;
        const intPart = parseInt(amount.toString(), 10);
        const formatted = EngineUtil.thousandsNum(intPart.toString());
        let cents = parseInt(
            (MathUtils.getInstance().accMul(amount, 100) - 100 * intPart).toString(),
            10
        ).toString();
        if (cents.length == 1) {
            cents = "0" + cents;
        }
        return cents == "00" ? formatted : formatted + "." + cents;
    }

    getIDCashNum(amount: number): string {
        return EngineUtil.thousandsNum(String(amount));
    }

    getTRCashNum(amount: number): string {
        amount /= 100;
        const intPart = parseInt(amount.toString(), 10);
        const formatted = EngineUtil.thousandsNum(intPart.toString());
        let cents = parseInt(
            (MathUtils.getInstance().accMul(amount, 100) - 100 * intPart).toString(),
            10
        ).toString();
        if (cents.length == 1) {
            cents = "0" + cents;
        }
        return cents == "00" ? formatted : formatted + "," + cents;
    }

    getUSCashNum(amount: number): string {
        amount /= 100;
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

    getCNCashNum(amount: number): string {
        if (amount == 0) {
            return amount.toString();
        }
        const value = Math.floor(100 * amount) / 100 / 100;
        const intPart = parseInt(value.toString(), 10);
        const head = intPart.toString();
        let cents = parseInt(
            (MathUtils.getInstance().accMul(value, 100) - 100 * intPart).toString(),
            10
        ).toString();
        if (cents.length == 1) {
            cents = "0" + cents;
        }
        if (cents == "00") {
            return head;
        }
        if (cents.length == 2 && cents[1] == "0") {
            cents = cents[0];
        }
        return head + "." + cents;
    }

    getRUCashNum(amount: number): string {
        amount /= 100;
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
}

export default CashMgr.getInstance();
