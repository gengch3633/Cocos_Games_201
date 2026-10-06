import { LKKFYC } from "./LKKFYC";
import { JGJYJG } from "./JGJYJG";
import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import * as XWRHYLPIOGNSHModule from "./XWRHYLPIOGNSH";

const XWRHYLPIOGNSH = (XWRHYLPIOGNSHModule as any).XWRHYLPIOGNSH;

export class HttpRequestTempData {
    ZGIOBPBMXECH(_data: string): void {}
}

export class OEUUFAHDFYFXEQF extends LKKFYC {
    UEPVGVVSETU = 1;
    ZYFURDYKK: Record<string, HttpRequestTempData> = {};

    HWZEEGYDTCHMYPA(): void {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UEMRAHCKHGOPYR, this.UEMRAHCKHGOPYR, this);
    }

    HMZTTQYMEYZ(): void {}

    QJDSFXADLWWE(forwarded: string, body: unknown = null, callback: HttpRequestTempData): void {
        const headers = {
            "X-Forwarded": forwarded,
        };
        this.KAAPHLHD("post", headers, body, callback);
    }

    KAAPHLHD(
        method: string,
        headers: Record<string, unknown> = {},
        body: unknown = {},
        callback: HttpRequestTempData
    ): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            this.UEPVGVVSETU += 1;
            this.ZYFURDYKK["" + this.UEPVGVVSETU] = callback;
            let headerJson = "{}";
            if (headers != null) {
                headerJson = JSON.stringify(headers);
            }
            let bodyJson = "{}";
            if (body != null) {
                bodyJson = JSON.stringify(body);
            }
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().KAAPHLHD(this.UEPVGVVSETU, method, headerJson, bodyJson);
        }
    }

    CDFXMWFAOK(headers: Record<string, unknown> = null, body: unknown = null, callback: HttpRequestTempData): void {
        this.KAAPHLHD("post", headers, body, callback);
    }

    BPEEZCJ(forwarded: string, body: unknown = null, callback: HttpRequestTempData): void {
        const headers = {
            "X-Forwarded": forwarded,
        };
        this.KAAPHLHD("get", headers, body, callback);
    }

    JXAVTQMDWDRWY(headers: Record<string, unknown> = null, body: unknown = null, callback: HttpRequestTempData): void {
        this.KAAPHLHD("get", headers, body, callback);
    }

    UEMRAHCKHGOPYR(payload: string): void {
        try {
            const decoded = atob(payload);
            const response = JSON.parse(decoded);
            const msgId = response.msgId;
            const callback = this.ZYFURDYKK["" + msgId];
            if (callback != null && response.data != null) {
                const data = atob(response.data);
                callback.ZGIOBPBMXECH(data);
            }
        } catch (_e) {}
    }
}
