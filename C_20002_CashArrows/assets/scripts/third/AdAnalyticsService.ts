import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class AdAnalyticsService {
    static reportData(event: string, data?: Record<string, unknown>, redirect?: boolean): void {
        BusinessAnalyticsService.reportData(event, data, redirect);
    }
}
