import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class AdAnalyticsService {
    static reportData(eventName: any, data: any, force: boolean = false) {
        BusinessAnalyticsService.reportData(eventName, data, force);
    }
}
