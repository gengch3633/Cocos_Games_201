import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";

export default class LoadingBaseFlowService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    start(): void {
        LoadingBaseFlowAdapter.getImplementation().startFlow({
            report: (event: string, data?: any) => BusinessAnalyticsService.reportData(event, data),
            onLoginReady: this.deps.onLoginReady,
            onShowWxLogin: this.deps.onShowWxLogin
        });
    }
}
