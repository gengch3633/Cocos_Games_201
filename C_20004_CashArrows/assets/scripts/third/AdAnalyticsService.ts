import BusinessAnalyticsService from "./BusinessAnalyticsService";

const { ccclass } = cc._decorator;

@ccclass
export default class AdAnalyticsService {
    public static reportData(eventName: string, params: any, immediately: boolean = false): void {
        BusinessAnalyticsService.reportData(eventName, params, immediately);
    }
}