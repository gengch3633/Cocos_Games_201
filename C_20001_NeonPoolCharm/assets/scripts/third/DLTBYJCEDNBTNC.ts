import { LKKFYC } from "./LKKFYC";
import { GameAd } from "./FDVQGROQAA";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { JGJYJG } from "./JGJYJG";
import * as XWRHYLPIOGNSHModule from "./XWRHYLPIOGNSH";

const XWRHYLPIOGNSH = (XWRHYLPIOGNSHModule as any).XWRHYLPIOGNSH;

export class DLTBYJCEDNBTNC extends LKKFYC {
    static CEBELIS = "video";

    IVJZUAPRYGUMSD: any = null;

    UWFFOOOATM(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.CEGCLLSF(data);
            }
        } catch (_e) {}
    }

    HMZTTQYMEYZ(): void {}

    VYTSNCHM(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.VYTSNCHM(data);
            }
        } catch (_e) {}
    }

    AUGKPUOQQSPRPKQU(entry: unknown): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().AUGKPUOQQSPRPKQU(entry);
        }
    }

    KPTLEZBST(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.KPTLEZBST(data);
            }
        } catch (_e) {}
    }

    ZBFDUZXA(entry: unknown): boolean {
        if (JGJYJG.YFEMHUUNOADK) {
            const ad = new GameAd();
            ad.entry = entry;
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.CEGCLLSF(ad);
                this.IVJZUAPRYGUMSD.VYTSNCHM(ad);
                this.IVJZUAPRYGUMSD.TXDJUROJFUJ(ad);
                this.IVJZUAPRYGUMSD.KPTLEZBST(ad);
            }
            return true;
        }
        return XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().ZBFDUZXA(entry);
    }

    NEDSFIADEVXEW(listener: unknown): void {
        this.IVJZUAPRYGUMSD = listener;
    }

    TXDJUROJFUJ(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.TXDJUROJFUJ(data);
            }
        } catch (_e) {}
    }

    USVDBZYLUSCZSLDZ(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (DLTBYJCEDNBTNC.CEBELIS == data.type && this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.USVDBZYLUSCZSLDZ(data);
            }
        } catch (_e) {}
    }

    XVQFJJJHUQWTY(entry: unknown): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().XVQFJJJHUQWTY(entry);
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UWFFOOOATM, this.UWFFOOOATM, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.KPTLEZBST, this.KPTLEZBST, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.VYTSNCHM, this.VYTSNCHM, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.TXDJUROJFUJ, this.TXDJUROJFUJ, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.USVDBZYLUSCZSLDZ, this.USVDBZYLUSCZSLDZ, this);
    }
}
