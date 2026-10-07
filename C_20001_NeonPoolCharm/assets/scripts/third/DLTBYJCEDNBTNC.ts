import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { GameAd } from "./FDVQGROQAA";
import { JGJYJG } from "./JGJYJG";
import { LKKFYC } from "./LKKFYC";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class DLTBYJCEDNBTNC extends LKKFYC {
    static CEBELIS = "video";

    IVJZUAPRYGUMSD: any = null;

    UWFFOOOATM(data: string): void {
        try {
            const parsed = JSON.parse(data);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.CEGCLLSF(parsed);
            }
        } catch (_e) {
        }
    }

    HMZTTQYMEYZ(): void {
    }

    VYTSNCHM(data: string): void {
        try {
            const parsed = JSON.parse(data);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.VYTSNCHM(parsed);
            }
        } catch (_e) {
        }
    }

    AUGKPUOQQSPRPKQU(data: any): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().AUGKPUOQQSPRPKQU(data);
        }
    }

    KPTLEZBST(data: string): void {
        try {
            const parsed = JSON.parse(data);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.KPTLEZBST(parsed);
            }
        } catch (_e) {
        }
    }

    ZBFDUZXA(entry: any): boolean {
        if (JGJYJG.YFEMHUUNOADK) {
            const gameAd = new GameAd();
            gameAd.entry = entry;
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.CEGCLLSF(gameAd);
                this.IVJZUAPRYGUMSD.VYTSNCHM(gameAd);
                this.IVJZUAPRYGUMSD.TXDJUROJFUJ(gameAd);
                this.IVJZUAPRYGUMSD.KPTLEZBST(gameAd);
            }
            return true;
        }
        return XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().ZBFDUZXA(entry);
    }

    NEDSFIADEVXEW(handler: any): void {
        this.IVJZUAPRYGUMSD = handler;
    }

    TXDJUROJFUJ(data: string): void {
        try {
            const parsed = JSON.parse(data);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.TXDJUROJFUJ(parsed);
            }
        } catch (_e) {
        }
    }

    USVDBZYLUSCZSLDZ(data: string): void {
        try {
            const parsed = JSON.parse(data);
            if (DLTBYJCEDNBTNC.CEBELIS == parsed.type && this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.USVDBZYLUSCZSLDZ(parsed);
            }
        } catch (_e) {
        }
    }

    XVQFJJJHUQWTY(data: any): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().XVQFJJJHUQWTY(data);
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UWFFOOOATM, this.UWFFOOOATM, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.KPTLEZBST, this.KPTLEZBST, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.VYTSNCHM, this.VYTSNCHM, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.TXDJUROJFUJ, this.TXDJUROJFUJ, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.USVDBZYLUSCZSLDZ, this.USVDBZYLUSCZSLDZ, this);
    }
}
