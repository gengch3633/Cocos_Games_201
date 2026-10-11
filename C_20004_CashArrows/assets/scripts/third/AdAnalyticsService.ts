import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class AdAnalyticsService {
    public static reportData(eventName: string, data: any, forced: boolean = false): void {
        BusinessAnalyticsService.reportData(eventName, data, forced);
    }
}