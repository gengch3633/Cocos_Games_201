import { LKKFYC } from "./LKKFYC";
import { GameAd } from "./FDVQGROQAA";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { JGJYJG } from "./JGJYJG";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class OYDJETXQHM extends LKKFYC {
    static NDOJTRG = "interstitial";

    IVJZUAPRYGUMSD: any = null;

    HJLLBADXE(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.HJLLBADXE(data);
            }
        } catch (_e) {}
    }

    HMZTTQYMEYZ(): void {}

    JFFPSVW(entry: unknown): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().JFFPSVW(entry);
    }

    ETCGFWY(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.ETCGFWY(data);
            }
        } catch (_e) {}
    }

    KRGTITGFJPNED(listener: unknown): void {
        this.IVJZUAPRYGUMSD = listener;
    }

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.HJLLBADXE, this.HJLLBADXE, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.VYMHFYXPYDC, this.VYMHFYXPYDC, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.ETCGFWY, this.ETCGFWY, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.USVDBZYLUSCZSLDZ, this.USVDBZYLUSCZSLDZ, this);
    }

    YDKKCKYYIQZTDCWY(entry: unknown): boolean {
        if (JGJYJG.YFEMHUUNOADK) {
            const ad = new GameAd();
            ad.entry = entry;
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.HJLLBADXE(ad);
                this.IVJZUAPRYGUMSD.VYMHFYXPYDC(ad);
                this.IVJZUAPRYGUMSD.ETCGFWY(ad);
            }
            return true;
        }
        return XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().YDKKCKYYIQZTDCWY(entry);
    }

    VYMHFYXPYDC(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.VYMHFYXPYDC(data);
            }
        } catch (_e) {}
    }

    USVDBZYLUSCZSLDZ(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (OYDJETXQHM.NDOJTRG == data.type && this.IVJZUAPRYGUMSD != null) {
                this.IVJZUAPRYGUMSD.USVDBZYLUSCZSLDZ(data);
            }
        } catch (_e) {}
    }
}
