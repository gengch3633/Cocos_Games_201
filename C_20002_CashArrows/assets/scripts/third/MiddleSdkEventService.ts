import MiddleNetwork from "./MiddleNetwork";
import MiddleService from "./MiddleService";
import { MiddleReqType } from "./MiddleReqType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import MiddleHandler from "./MiddleHandler";
import PlatformBridge from "./PlatformBridge";
import { MIDDLE_PROJECT_ADAPTER_CONFIG } from "./MiddleProjectAdapterConfig";

export default class MiddleSdkEventService {
    kIsUploadEventFirstCall: string;

    constructor() {
        this.kIsUploadEventFirstCall = " com.sdk.kIsUploadEventFirstCall ";
    }

    uploadOnce(e: any) {
        var t = this, i = this.getEventRequestIsFirstFlag();
        this.reportBehaviorConfigEvent(" ", 0, i);
        var r = MiddleService.paramData(MiddleReqType.SDKEvent);
        MiddleNetwork.getSDKEvent(r, MiddleHandler.create(this, function (n: any) {
            try {
                try {
                    console.log("[MiddleSdkEventService.getSDKEvent] res => ", JSON.stringify(n));
                } catch (e) {
                    console.log("[MiddleSdkEventService.getSDKEvent] res(raw) => ", n);
                }
                if (!n) {
                    t.reportBehaviorConfigEvent({
                        message: " empty_response "
                    }, -1, i);
                    return;
                }
                var a = n && n.data && " object " == typeof n.data ? n.data : n;
                if (!a || " object " != typeof a) {
                    t.reportBehaviorConfigEvent({
                        message: " invalid_response_payload ",
                        raw: n
                    }, -1, i);
                    return;
                }
                var o = a.is_active, r = a.is_init_firebase, s = a.new_callback_events, u = a.new_callback_events_token, d = a.new_callback_events_params, h = a.sdk_key, p = a.url_strategy, _ = a.fb_app_id, f = a.interval_seconds, g = Number(f);
                !isNaN(g) && g > 0 && e && e(g);
                var m = h;
                null == m && (m = MIDDLE_PROJECT_ADAPTER_CONFIG.adjustKey);
                if (o) {
                    var y = {
                        adjustKey: m,
                        urlStrategy: p,
                        fbAppId: _
                    };
                    try {
                        console.log("[MiddleSdkEventService.initSdkAdjust] params => ", JSON.stringify(y));
                    } catch (e) {
                        console.log("[MiddleSdkEventService.initSdkAdjust] params(raw) => ", y);
                    }
                    PlatformBridge.getNativeBridge().initSdkAdjust(m, p, _);
                }
                true === r && PlatformBridge.getNativeBridge().reportFirebase(r + " ");
                Array.isArray(s) && s.length > 0 && s.forEach(function (e: any) {
                    var i = t.findEventToken(e, u), n = t.findEventParams(e, d), a = PlatformBridge.getNativeBridge();
                    a && " function " == typeof a.reportEventByAdjust && a.reportEventByAdjust(e, i, n);
                });
                t.reportBehaviorConfigEvent(a, 1, i);
            } catch (e) {
                t.reportBehaviorConfigEvent(e, -1, i);
            }
        }), MiddleHandler.create(this, function (e: any) {
            t.reportBehaviorConfigEvent(e, -1, i);
        }));
    }

    getEventRequestIsFirstFlag() {
        var e = false;
        try {
            (e = null === cc.sys.localStorage.getItem(this.kIsUploadEventFirstCall)) && cc.sys.localStorage.setItem(this.kIsUploadEventFirstCall, " 1 ");
        } catch (t) {
            e = true;
        }
        return e;
    }

    findEventToken(e: any, t: any) {
        if (!Array.isArray(t) || t.length <= 0) return " ";
        for (var i = 0, n = t; i < n.length; i++) {
            var a = n[i];
            if (a) {
                var o = a[e];
                if (o) return o;
            }
        }
        return " ";
    }

    findEventParams(e: any, t: any) {
        if (!Array.isArray(t) || t.length <= 0) return null;
        for (var i = 0, n = t; i < n.length; i++) {
            var a = n[i];
            if (a) {
                var o = a[e];
                if (void 0 !== o) return o;
            }
        }
        return null;
    }

    reportBehaviorConfigEvent(e: any, t: any, i: boolean = false) {
        var n = {
            behavior_config_value: e,
            behavior_config_status: t,
            behavior_first_req: i,
            redirect_type: " 0 "
        };
        BusinessAnalyticsService.reportData(" behavior_config ", n);
    }
}
