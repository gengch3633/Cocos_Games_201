import MiddleTrackManager from "./MiddleTrackManager";

export default class BusinessAnalyticsService {
    static reportData(event: string, data?: Record<string, unknown>, forceRedirect = false): void {
        console.log("BusinessAnalyticsService.reportData", event, data, forceRedirect);
        const payload = data || {};
        let redirectType = payload.redirect_type;
        if (redirectType != null && redirectType !== "") {
            redirectType = Number(redirectType);
        }
        if (forceRedirect) {
            redirectType = 1;
            payload.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(event, payload, redirectType as number | undefined);
    }

    static onTrack(raw: string): void {
        let payload: Record<string, unknown> = JSON.parse(raw);
        if (!payload) {
            payload = {};
        }
        let redirectType = payload.traceArcadeRouteCypress;
        if (redirectType) {
            redirectType = Number(redirectType);
        }
        MiddleTrackManager.getInstance().track(
            payload.enrollFeintProcessOak as string,
            payload.ferryBulkTierAgate as Record<string, unknown>,
            redirectType as number | undefined,
        );
    }

    static trackAll(): void {
        MiddleTrackManager.getInstance().trackAll();
    }
}
