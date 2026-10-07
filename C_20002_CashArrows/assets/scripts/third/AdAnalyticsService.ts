import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class AdAnalyticsService {
    static reportData(event: string, data?: any, redirect?: boolean): void {
        if (redirect === undefined) {
            redirect = false;
        }
        BusinessAnalyticsService.reportData(event, data, redirect);
    }
}
