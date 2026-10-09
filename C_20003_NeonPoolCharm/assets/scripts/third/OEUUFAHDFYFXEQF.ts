import { ABPXIYEANGWLG } from "./ABPXIYEANGWLG";
import { JGJYJG } from "./JGJYJG";
import { LKKFYC } from "./LKKFYC";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export function HttpRequestTempData() {
}

export class OEUUFAHDFYFXEQF extends LKKFYC {
    UEPVGVVSETU = 1;
    ZYFURDYKK = {};

    HWZEEGYDTCHMYPA() {
        this.DUKMQHWIHYGN.HWZEEGYDTCHMYPA(ABPXIYEANGWLG.UEMRAHCKHGOPYR, this.UEMRAHCKHGOPYR, this);
    }

    HMZTTQYMEYZ() {}

    QJDSFXADLWWE(e, t, o) {
        if (undefined === t) {
            t = null;
        }
        const n = {
            "X-Forwarded": e
        };
        this.KAAPHLHD("post", n, t, o);
    }

    KAAPHLHD(e, t, o, n) {
        if (undefined === t) {
            t = {};
        }
        if (undefined === o) {
            o = {};
        }
        if (!JGJYJG.YFEMHUUNOADK) {
            this.UEPVGVVSETU += 1;
            this.ZYFURDYKK["" + this.UEPVGVVSETU] = n;
            let i = "{}";
            null != t && (i = JSON.stringify(t));
            let a = "{}";
            null != o && (a = JSON.stringify(o));
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().KAAPHLHD(this.UEPVGVVSETU, e, i, a);
        }
    }

    CDFXMWFAOK(e, t, o) {
        if (undefined === e) {
            e = null;
        }
        if (undefined === t) {
            t = null;
        }
        this.KAAPHLHD("post", e, t, o);
    }

    BPEEZCJ(e, t, o) {
        if (undefined === t) {
            t = null;
        }
        const n = {
            "X-Forwarded": e
        };
        this.KAAPHLHD("get", n, t, o);
    }

    JXAVTQMDWDRWY(e, t, o) {
        if (undefined === e) {
            e = null;
        }
        if (undefined === t) {
            t = null;
        }
        this.KAAPHLHD("get", e, t, o);
    }

    UEMRAHCKHGOPYR(e) {
        try {
            const t = atob(e),
                o = JSON.parse(t),
                n = o.msgId,
                i = this.ZYFURDYKK["" + n];
            if (null != i && null != o.data) {
                const a = atob(o.data);
                i.ZGIOBPBMXECH(a);
            }
        } catch (e) {}
    }
}
