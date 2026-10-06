import { LKKFYC } from "./LKKFYC";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { JGJYJG } from "./JGJYJG";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class ZJYTTDKP extends LKKFYC {
    listener: {
        MDALOMV(data: unknown): void;
        DSRLJJG(data: unknown): void;
        BTTMYBOCQNPOQX(data: unknown): void;
    } | null = null;

    QVRGUFKEONTDPA(listener: {
        MDALOMV(data: unknown): void;
        DSRLJJG(data: unknown): void;
        BTTMYBOCQNPOQX(data: unknown): void;
    }): void {
        this.listener = listener;
    }

    MKHZXYYX(): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().MKHZXYYX();
    }

    HMZTTQYMEYZ(): void {}

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.TAUWRUVIPNQ, this.TAUWRUVIPNQ, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.AFUYTE, this.AFUYTE, this);
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.CZLAJSLP, this.ODQYGNKVJZRP, this);
    }

    ODQYGNKVJZRP(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.listener != null) {
                this.listener.MDALOMV(data);
            }
        } catch (_e) {}
    }

    AFUYTE(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.listener != null) {
                this.listener.DSRLJJG(data);
            }
        } catch (_e) {}
    }

    TAUWRUVIPNQ(payload: string): void {
        try {
            const data = JSON.parse(payload);
            if (this.listener != null) {
                this.listener.BTTMYBOCQNPOQX(data);
            }
        } catch (_e) {}
    }

    RSGPVX(entry: unknown): boolean {
        return !JGJYJG.YFEMHUUNOADK && XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().RSGPVX(entry);
    }
}
