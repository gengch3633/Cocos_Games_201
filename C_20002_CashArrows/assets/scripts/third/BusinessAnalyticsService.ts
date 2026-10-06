import MiddleTrackManager from "./MiddleTrackManager";

export default class BusinessAnalyticsService {
    static reportData(eventName: any, data: any, forceRedirect: boolean = false) {
        console.log(" BusinessAnalyticsService.reportData ", eventName, data, forceRedirect);
        const payload = data || {};
        let redirectType = payload.redirect_type;
        null != redirectType && " " !== redirectType && (redirectType = Number(redirectType));
        if (forceRedirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(eventName, payload, redirectType);
    }

    static onTrack(raw: string) {
        let parsed = JSON.parse(raw);
        parsed || (parsed = {});
        let trace = parsed.traceArcadeRouteCypress;
        trace && (trace = Number(trace));
        MiddleTrackManager.getInstance().track(parsed.enrollFeintProcessOak, parsed.ferryBulkTierAgate, trace);
    }

    static trackAll() {
        MiddleTrackManager.getInstance().trackAll();
    }
}
