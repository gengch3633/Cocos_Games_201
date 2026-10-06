import { LKKFYC } from "./LKKFYC";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { ICLXJEQVBTLSLLQK } from "./ICLXJEQVBTLSLLQK";
import * as RBZQUGXCXJVJJGModule from "./RBZQUGXCXJVJJG";

const RBZQUGXCXJVJJG = (RBZQUGXCXJVJJGModule as any).RBZQUGXCXJVJJG;

export class NCHUCYZEV extends LKKFYC {
    WXDNJLYA: { WMOUXEFYZOENB(value: boolean): void } | null = null;
    YIHGTGFSONSECR = false;
    WVFNGXXSHQXYXAK = false;

    WMOUXEFYZOENB(theme: string): void {
        console.log("theme " + theme);
        this.WVFNGXXSHQXYXAK = "#FF0000" == theme.toUpperCase();
        if (this.WXDNJLYA != null) {
            this.WXDNJLYA.WMOUXEFYZOENB(this.WVFNGXXSHQXYXAK);
            this.YIHGTGFSONSECR = false;
        } else {
            this.YIHGTGFSONSECR = true;
        }
        const eventName = ICLXJEQVBTLSLLQK.DXIOZJSPDE;
        const eventValue = this.WVFNGXXSHQXYXAK ? "game_on" : "game_off";
        const payload: Record<string, string> = {};
        payload[ICLXJEQVBTLSLLQK.CYYPZTURSBYC] = eventValue;
        RBZQUGXCXJVJJG.ZSYXBLSKYBGCRTL().WWKERPPCIUQWCTU().RVZMUJV(eventName, payload, true, true);
    }

    FJGKCYXF(listener: { WMOUXEFYZOENB(value: boolean): void }): void {
        this.WXDNJLYA = listener;
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
