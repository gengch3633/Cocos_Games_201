import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class AdAnalyticsService {
    static reportData(event: string, data?: any, redirect: boolean = false): void {
        BusinessAnalyticsService.reportData(event, data, redirect);
    }
}
