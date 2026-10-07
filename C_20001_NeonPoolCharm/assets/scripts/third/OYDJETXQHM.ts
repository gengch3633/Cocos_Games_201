import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { GameAd } from "./FDVQGROQAA";
import { JGJYJG } from "./JGJYJG";
import { LKKFYC } from "./LKKFYC";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class OYDJETXQHM extends LKKFYC {
    static NDOJTRG = "interstitial";

    IVJZUAPRYGUMSD: any = null;

    HJLLBADXE(e: string): void {
        try {
            const parsed = JSON.parse(e);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.HJLLBADXE(parsed);
            }
        } catch (_err) {
        }
    }

    HMZTTQYMEYZ(): void {
    }

    JFFPSVW(e: any): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().JFFPSVW(e);
    }

    ETCGFWY(e: string): void {
        try {
            const parsed = JSON.parse(e);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.ETCGFWY(parsed);
            }
        } catch (_err) {
        }
    }

    KRGTITGFJPNED(e: any): void {
        this.IVJZUAPRYGUMSD = e;
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.HJLLBADXE, this.HJLLBADXE, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.VYMHFYXPYDC, this.VYMHFYXPYDC, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.ETCGFWY, this.ETCGFWY, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.USVDBZYLUSCZSLDZ, this.USVDBZYLUSCZSLDZ, this);
    }

    YDKKCKYYIQZTDCWY(e: any): boolean {
        if (JGJYJG.YFEMHUUNOADK) {
            const gameAd = new GameAd();
            gameAd.entry = e;
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.HJLLBADXE(gameAd);
                this.IVJZUAPRYGUMSD.VYMHFYXPYDC(gameAd);
                this.IVJZUAPRYGUMSD.ETCGFWY(gameAd);
            }
            return true;
        }
        return XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().YDKKCKYYIQZTDCWY(e);
    }

    VYMHFYXPYDC(e: string): void {
        try {
            const parsed = JSON.parse(e);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.VYMHFYXPYDC(parsed);
            }
        } catch (_err) {
        }
    }

    USVDBZYLUSCZSLDZ(e: string): void {
        try {
            const parsed = JSON.parse(e);
            if (OYDJETXQHM.NDOJTRG == parsed.type && this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.USVDBZYLUSCZSLDZ(parsed);
            }
        } catch (_err) {
        }
    }
}
