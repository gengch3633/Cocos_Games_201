import MiddleTrackManager from "./MiddleTrackManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BusinessAnalyticsService {

    public static reportData(eventName: string, params?: any, forceRedirect: boolean = false): void {
        console.log("BusinessAnalyticsService.reportData", eventName, params, forceRedirect);
        const data: any = params || {};
        let redirectType: any = data.redirect_type;
        if (redirectType != null && redirectType !== "") {
            redirectType = Number(redirectType);
        }
        if (forceRedirect) {
            redirectType = 1;
            data.redirect_type = 1;
        }
        MiddleTrackManager.getInstance().track(eventName, data, redirectType);
    }

    public static onTrack(trackData: string): void {
        let data: any = JSON.parse(trackData);
        if (!data) {
            data = {};
        }
        let redirectType: any = data.traceArcadeRouteCypress;
        if (redirectType) {
            redirectType = Number(redirectType);
        }
        MiddleTrackManager.getInstance().track(data.enrollFeintProcessOak, data.ferryBulkTierAgate, redirectType);
    }

    public static trackAll(): void {
        MiddleTrackManager.getInstance().trackAll();
    }
}
