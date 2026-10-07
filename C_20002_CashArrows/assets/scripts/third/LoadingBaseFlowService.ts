import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";

export interface LoadingBaseFlowServiceDeps {
    onLoginReady: () => void;
    onShowWxLogin: () => void;
}

export default class LoadingBaseFlowService {
    deps: LoadingBaseFlowServiceDeps;

    constructor(deps: LoadingBaseFlowServiceDeps) {
        this.deps = deps;
    }

    start(): void {
        LoadingBaseFlowAdapter.getImplementation().startFlow({
            report: (event: string, data?: any) => BusinessAnalyticsService.reportData(event, data),
            onLoginReady: this.deps.onLoginReady,
            onShowWxLogin: this.deps.onShowWxLogin,
        });
    }
}
