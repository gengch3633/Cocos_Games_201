import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";

const { ccclass, property } = cc._decorator;

interface LoadingBaseFlowDeps {
    onLoginReady: (...args: any[]) => void;
    onShowWxLogin: (...args: any[]) => void;
}

interface LoadingBaseFlowParams {
    report: (data: any, type: any) => any;
    onLoginReady: (...args: any[]) => void;
    onShowWxLogin: (...args: any[]) => void;
}

@ccclass
export default class LoadingBaseFlowService {
    private deps: LoadingBaseFlowDeps;

    constructor(deps: LoadingBaseFlowDeps) {
        this.deps = deps;
    }

    public start(): void {
        LoadingBaseFlowAdapter.getImplementation().startFlow({
            report: (data: any, type: any) => BusinessAnalyticsService.reportData(data, type),
            onLoginReady: this.deps.onLoginReady,
            onShowWxLogin: this.deps.onShowWxLogin
        } as LoadingBaseFlowParams);
    }
}