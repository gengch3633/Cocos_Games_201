import { LKKFYC } from "./LKKFYC";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import * as QKTGTRSTJQUModule from "./QKTGTRSTJQU";

const QKTGTRSTJQU = (QKTGTRSTJQUModule as any).QKTGTRSTJQU;

export class HCMSRP extends LKKFYC {
    EFUHWT: { DWPYXIXOCY(value: string): void } | null = null;
    YIHGTGFSONSECR = false;
    DDICCKBHMAEGX = "";

    DWPYXIXOCY(value: string): void {
        QKTGTRSTJQU.QSWIRPSKS();
        this.DDICCKBHMAEGX = value;
        if (this.EFUHWT != null) {
            this.EFUHWT.DWPYXIXOCY(this.DDICCKBHMAEGX);
            this.YIHGTGFSONSECR = false;
        } else {
            this.YIHGTGFSONSECR = true;
        }
    }

    BNTJZPHDS(listener: { DWPYXIXOCY(value: string): void }): void {
        this.EFUHWT = listener;
        if (this.YIHGTGFSONSECR) {
            this.EFUHWT.DWPYXIXOCY(this.DDICCKBHMAEGX);
        }
    }

    HMZTTQYMEYZ(): void {}

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.DWPYXIXOCY, this.DWPYXIXOCY, this);
    }
}
