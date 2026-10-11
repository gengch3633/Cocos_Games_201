import MiddleTrackManager from "./MiddleTrackManager";

export default class BusinessAnalyticsService {
    public static reportData(eventName: string, data: any, force: boolean = false): void {
        console.log("BusinessAnalyticsService.reportData", eventName, data, force);
        const params = data || {};
        let redirectType = params.redirect_type;
        if (null != redirectType && "" !== redirectType) {
            redirectType = Number(redirectType);
        }
        if (force) {
            redirectType = 1;
            params.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(eventName, params, redirectType);
    }

    public static onTrack(data: string): void {
        let payload = JSON.parse(data);
        if (!payload) {
            payload = {};
        }
        let routeCypress = payload.traceArcadeRouteCypress;
        if (routeCypress) {
            routeCypress = Number(routeCypress);
        }
        MiddleTrackManager.getInstance().track(payload.enrollFeintProcessOak, payload.ferryBulkTierAgate, routeCypress);
    }

    public static trackAll(): void {
        MiddleTrackManager.getInstance().trackAll();
    }
}