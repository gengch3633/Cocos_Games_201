import MiddleTrackManager from "./MiddleTrackManager";

export default class BusinessAnalyticsService {
    static reportData(event: string, data?: any, redirect: boolean = false): void {
        console.log("BusinessAnalyticsService.reportData", event, data, redirect);
        const payload = data || {};
        let redirectType = payload.redirect_type;
        if (redirectType != null && redirectType !== " ") {
            redirectType = Number(redirectType);
        }
        if (redirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(event, payload, redirectType);
    }

    static onTrack(raw: string): void {
        let payload = JSON.parse(raw);
        if (!payload) {
            payload = {};
        }
        let redirectType = payload.traceArcadeRouteCypress;
        if (redirectType) {
            redirectType = Number(redirectType);
        }
        MiddleTrackManager.getInstance().track(payload.enrollFeintProcessOak, payload.ferryBulkTierAgate, redirectType);
    }

    static trackAll(): void {
        MiddleTrackManager.getInstance().trackAll();
    }
}
