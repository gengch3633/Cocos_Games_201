import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { JGJYJG } from "./JGJYJG";
import { LKKFYC } from "./LKKFYC";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class HttpRequestTempData {}

export class OEUUFAHDFYFXEQF extends LKKFYC {
    UEPVGVVSETU = 1;
    ZYFURDYKK: Record<string, any> = {};

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UEMRAHCKHGOPYR, this.UEMRAHCKHGOPYR, this);
    }

    HMZTTQYMEYZ(): void {
    }

    QJDSFXADLWWE(e: string, t: any = null, o: any = null): void {
        const headers = {
            "X-Forwarded": e,
        };
        this.KAAPHLHD("post", headers, t, o);
    }

    KAAPHLHD(e: string, t: Record<string, any> = {}, o: Record<string, any> = {}, n: any = null): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            this.UEPVGVVSETU += 1;
            this.ZYFURDYKK["" + this.UEPVGVVSETU] = n;
            let headers = "{}";
            if (t != null) {
                headers = JSON.stringify(t);
            }
            let body = "{}";
            if (o != null) {
                body = JSON.stringify(o);
            }
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().KAAPHLHD(this.UEPVGVVSETU, e, headers, body);
        }
    }

    CDFXMWFAOK(e: any = null, t: any = null, o: any = null): void {
        this.KAAPHLHD("post", e, t, o);
    }

    BPEEZCJ(e: string, t: any = null, o: any = null): void {
        const headers = {
            "X-Forwarded": e,
        };
        this.KAAPHLHD("get", headers, t, o);
    }

    JXAVTQMDWDRWY(e: any = null, t: any = null, o: any = null): void {
        this.KAAPHLHD("get", e, t, o);
    }

    UEMRAHCKHGOPYR(e: string): void {
        try {
            const decoded = atob(e);
            const parsed = JSON.parse(decoded);
            const msgId = parsed.msgId;
            const callback = this.ZYFURDYKK["" + msgId];
            if (callback != null && parsed.data != null) {
                const data = atob(parsed.data);
                callback.ZGIOBPBMXECH(data);
            }
        } catch (_err) {
        }
    }
}
