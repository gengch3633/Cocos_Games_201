import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { ICLXJEQVBTLSLLQK } from "./ICLXJEQVBTLSLLQK";
import { LKKFYC } from "./LKKFYC";
import { RBZQUGXCXJVJJG } from "./RBZQUGXCXJVJJG";

export class NCHUCYZEV extends LKKFYC {
    WXDNJLYA: { WMOUXEFYZOENB: (flag: boolean) => void } = null;
    YIHGTGFSONSECR = false;
    WVFNGXXSHQXYXAK = false;

    WMOUXEFYZOENB(e: string): void {
        console.log("theme " + e);
        this.WVFNGXXSHQXYXAK = "#FF0000" == e.toUpperCase();
        if (null != this.WXDNJLYA) {
            this.WXDNJLYA.WMOUXEFYZOENB(this.WVFNGXXSHQXYXAK);
            this.YIHGTGFSONSECR = false;
        } else {
            this.YIHGTGFSONSECR = true;
        }
        const o = ICLXJEQVBTLSLLQK.DXIOZJSPDE;
        const n = this.WVFNGXXSHQXYXAK ? "game_on" : "game_off";
        const i = {
            [ICLXJEQVBTLSLLQK.CYYPZTURSBYC]: n,
        };
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(o, i, true, true);
    }

    FJGKCYXF(e: { WMOUXEFYZOENB: (flag: boolean) => void }): void {
        this.WXDNJLYA = e;
        if (this.YIHGTGFSONSECR) {
            this.WXDNJLYA.WMOUXEFYZOENB(this.WVFNGXXSHQXYXAK);
            this.YIHGTGFSONSECR = false;
        }
    }

    HMZTTQYMEYZ(): void {}

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.WMOUXEFYZOENB, this.WMOUXEFYZOENB, this);
    }
}
