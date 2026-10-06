import { LKKFYC } from "./LKKFYC";
import { JGJYJG } from "./JGJYJG";
import { XWRHYLPIOGNSH } from "./XWRHYLPIOGNSH";

export class QETMKQUCUPSO extends LKKFYC {
    GGGFAZHDLUFCDNBX(eventName: string, payload: unknown = null): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(3, eventName, payload);
        }
    }

    VOBECDCFOCEQ(eventName: string, payload: unknown = null): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(1, eventName, payload);
        }
    }

    HWZEEGYDTCHMYPA(): void {}

    HMZTTQYMEYZ(): void {}

    RVZMUJV(
        eventName: string,
        properties: Record<string, unknown> = null,
        flush: boolean = false,
        realtime: boolean = false
    ): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            const payload: { event_name: string; properties?: Record<string, unknown> } = {
                event_name: eventName,
            };
            if (properties != null) {
                payload.properties = properties;
            }
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().RVZMUJV(payload, flush, realtime);
        }
    }

    WZTYVRSF(eventName: string, payload: unknown = null): void {
        if (!JGJYJG.YFEMHUUNOADK) {
            XWRHYLPIOGNSH.ZSYXBLSKYBGCRTL().WNLBMXMEUWELMZGL(2, eventName, payload);
        }
    }
}
