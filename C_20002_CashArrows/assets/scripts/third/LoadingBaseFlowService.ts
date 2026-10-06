import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingBaseFlowService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    start() {
        LoadingBaseFlowAdapter.getImplementation().startFlow({
            report: function (eventName: any, data: any) {
                return BusinessAnalyticsService.reportData(eventName, data);
            },
            onLoginReady: this.deps.onLoginReady,
            onShowWxLogin: this.deps.onShowWxLogin
        });
    }
}
