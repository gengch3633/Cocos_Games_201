import EngineUtil from "./EngineUtil";
import { MathUtils } from "./MathUtil";

class CashMgr {
    static _instance;

    getBRCashNum(e) {
        e /= 100;
        const t = parseInt(e.toString());
        const o = EngineUtil.thousandsNum(t.toString());
        let a = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        if (1 == a.length) {
            a = "0" + a;
        }
        return "00" == a ? o : o + "." + a;
    }

    static getInstance() {
        CashMgr._instance || (CashMgr._instance = new CashMgr());
        return CashMgr._instance;
    }

    getIDCashNum(e) {
        return EngineUtil.thousandsNum(String(e));
    }

    getTRCashNum(e) {
        e /= 100;
        const t = parseInt(e.toString());
        const o = EngineUtil.thousandsNum(t.toString());
        let a = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        if (1 == a.length) {
            a = "0" + a;
        }
        return "00" == a ? o : o + "," + a;
    }

    getUSCashNum(e) {
        e /= 100;
        const t = parseInt(e.toString());
        const o = EngineUtil.thousandsNum(t.toString(), ",");
        let a = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        if (1 == a.length) {
            a = "0" + a;
        }
        return "00" == a ? o : o + "." + a;
    }

    getCNCashNum(e) {
        if (0 == e) return e.toString();
        const t = Math.floor(100 * e) / 100 / 100;
        const o = parseInt(t.toString());
        const n = o.toString();
        let a = parseInt((MathUtils.getInstance().accMul(t, 100) - 100 * o).toString()).toString();
        if (1 == a.length) {
            a = "0" + a;
        }
        if ("00" == a) return n;
        if (2 == a.length && "0" == a[1]) {
            a = a[0];
        }
        return n + "." + a;
    }

    getRUCashNum(e) {
        e /= 100;
        const t = parseInt(e.toString());
        const o = EngineUtil.thousandsNum(t.toString(), ",");
        let a = parseInt((MathUtils.getInstance().accMul(e, 100) - 100 * t).toString()).toString();
        if (1 == a.length) {
            a = "0" + a;
        }
        return "00" == a ? o : o + "." + a;
    }
}

export default CashMgr.getInstance();
