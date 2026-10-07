import EngineUtil from "./EngineUtil";
import { MathUtils } from "./MathUtil";

class CashMgr {
    getBRCashNum(value: number): string {
        value /= 100;
        const intPart = parseInt(value.toString());
        const formatted = EngineUtil.thousandsNum(intPart.toString());
        let decimal = parseInt((MathUtils.getInstance().accMul(value, 100) - 100 * intPart).toString()).toString();
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
        return decimal === "00" ? formatted : formatted + "." + decimal;
    }

    static getInstance(): CashMgr {
        if (!CashMgr._instance) {
            CashMgr._instance = new CashMgr();
        }
        return CashMgr._instance;
    }

    getIDCashNum(value: number): string {
        return EngineUtil.thousandsNum(String(value));
    }

    getTRCashNum(value: number): string {
        value /= 100;
        const intPart = parseInt(value.toString());
        const formatted = EngineUtil.thousandsNum(intPart.toString());
        let decimal = parseInt((MathUtils.getInstance().accMul(value, 100) - 100 * intPart).toString()).toString();
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
        return decimal === "00" ? formatted : formatted + "," + decimal;
    }

    getUSCashNum(value: number): string {
        value /= 100;
        const intPart = parseInt(value.toString());
        const formatted = EngineUtil.thousandsNum(intPart.toString(), ",");
        let decimal = parseInt((MathUtils.getInstance().accMul(value, 100) - 100 * intPart).toString()).toString();
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
        return decimal === "00" ? formatted : formatted + "." + decimal;
    }

    getCNCashNum(value: number): string {
        if (value === 0) {
            return value.toString();
        }
        const amount = Math.floor(100 * value) / 100 / 100;
        const intPart = parseInt(amount.toString());
        const intStr = intPart.toString();
        let decimal = parseInt((MathUtils.getInstance().accMul(amount, 100) - 100 * intPart).toString()).toString();
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
        if (decimal === "00") {
            return intStr;
        }
        if (decimal.length === 2 && decimal[1] === "0") {
            decimal = decimal[0];
        }
        return intStr + "." + decimal;
    }

    getRUCashNum(value: number): string {
        value /= 100;
        const intPart = parseInt(value.toString());
        const formatted = EngineUtil.thousandsNum(intPart.toString(), ",");
        let decimal = parseInt((MathUtils.getInstance().accMul(value, 100) - 100 * intPart).toString()).toString();
        if (decimal.length === 1) {
            decimal = "0" + decimal;
        }
        return decimal === "00" ? formatted : formatted + "." + decimal;
    }

    private static _instance: CashMgr = null;
}

export default CashMgr.getInstance();
