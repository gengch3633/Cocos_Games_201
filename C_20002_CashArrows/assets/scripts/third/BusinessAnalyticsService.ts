import MiddleTrackManager from "./MiddleTrackManager";

export default class BusinessAnalyticsService {
    static reportData(event: string, data?: any, redirect?: boolean): void {
        if (redirect === undefined) {
            redirect = false;
        }
        console.log("BusinessAnalyticsService.reportData", event, data, redirect);
        const payload = data || {};
        let redirectType = payload.redirect_type;
        if (redirectType != null && redirectType !== "") {
            redirectType = Number(redirectType);
        }
        if (redirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(event, payload, redirectType);
    }

    static onTrack(raw: string): void {
        let parsed = JSON.parse(raw);
        if (!parsed) {
            parsed = {};
        }
        let traceRoute = parsed.traceArcadeRouteCypress;
        if (traceRoute) {
            traceRoute = Number(traceRoute);
        }
        MiddleTrackManager.getInstance().track(parsed.enrollFeintProcessOak, parsed.ferryBulkTierAgate, traceRoute);
    }

    static trackAll(): void {
        MiddleTrackManager.getInstance().trackAll();
    }
}
