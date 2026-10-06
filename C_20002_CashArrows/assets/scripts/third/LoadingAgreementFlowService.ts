import LoadingAgreementAdapter from "./LoadingAgreementAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export interface LoadingAgreementFlowDeps {
    welcomeNode: cc.Node;
    onLoadScene(sceneName: string): void;
}

export default class LoadingAgreementFlowService {
    deps: LoadingAgreementFlowDeps;
    runSceneName = "";
    isShowAgreement = false;

    constructor(deps: LoadingAgreementFlowDeps) {
        this.deps = deps;
    }

    checkState(): void {
        const adapter = LoadingAgreementAdapter.getImplementation();
        const state = adapter.getAgreementState();
        this.isShowAgreement = adapter.shouldShowAgreement();
        BusinessAnalyticsService.reportData("page_loading_checkArgreementState", { state });
    }

    enterSceneWithCheckAgreement(sceneName: string): void {
        BusinessAnalyticsService.reportData("page_loading_enterSceneWithCheckArgeement");
        this.runSceneName = sceneName;
        if (this.isShowAgreement && LoadingAgreementAdapter.getImplementation().shouldGateByMiddleReview()) {
            BusinessAnalyticsService.reportData("page_loading_showWelcomeNode");
            this.deps.welcomeNode.active = true;
        } else {
            BusinessAnalyticsService.reportData("page_loading_runMainScene");
            this.deps.onLoadScene(this.runSceneName);
        }
    }

    acceptAgreement(): void {
        LoadingAgreementAdapter.getImplementation().markAgreementAccepted();
        BusinessAnalyticsService.reportData("click_Accept_btn");
        this.isShowAgreement = false;
        this.deps.welcomeNode.active = false;
        this.deps.onLoadScene(this.runSceneName);
    }
}
