import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingHotUpdateService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    start() {
        LoadingHotUpdateAdapter.getImplementation().start({
            report: function (eventName: any, data: any) {
                return BusinessAnalyticsService.reportData(eventName, data);
            },
            onUpdateProgress: this.deps.onUpdateProgress,
            onFinish: this.deps.onFinish
        });
    }
}
