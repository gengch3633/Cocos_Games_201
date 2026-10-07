import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";

export default class LoadingHotUpdateService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    start(): void {
        LoadingHotUpdateAdapter.getImplementation().start({
            report: (event: string, data?: any) => BusinessAnalyticsService.reportData(event, data),
            onUpdateProgress: this.deps.onUpdateProgress,
            onFinish: this.deps.onFinish
        });
    }
}
