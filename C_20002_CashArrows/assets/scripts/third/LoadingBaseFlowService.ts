import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export interface LoadingBaseFlowDeps {
    onLoginReady(): void;
    onShowWxLogin?(): void;
}

export default class LoadingBaseFlowService {
    deps: LoadingBaseFlowDeps;

    constructor(deps: LoadingBaseFlowDeps) {
        this.deps = deps;
    }

    start(): void {
        LoadingBaseFlowAdapter.getImplementation().startFlow({
            report: (event, data) => BusinessAnalyticsService.reportData(event, data),
            onLoginReady: () => this.deps.onLoginReady(),
            onShowWxLogin: () => this.deps.onShowWxLogin?.(),
        });
    }
}
