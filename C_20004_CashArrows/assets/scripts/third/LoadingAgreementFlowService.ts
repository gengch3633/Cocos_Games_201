import BusinessAnalyticsService from "./BusinessAnalyticsService.js";
import LoadingAgreementAdapter from "./LoadingAgreementAdapter.js";

interface ILoadingAgreementDeps {
    welcomeNode: cc.Node;
    onLoadScene: (sceneName: string) => void;
}

export default class LoadingAgreementFlowService {
    public deps: ILoadingAgreementDeps;
    public runSceneName: string = "";
    public isShowAgreement: boolean = false;

    constructor(deps: ILoadingAgreementDeps) {
        this.deps = deps;
        this.runSceneName = "";
        this.isShowAgreement = false;
    }

    public checkState(): void {
        const implementation = LoadingAgreementAdapter.getImplementation();
        const state = implementation.getAgreementState();
        this.isShowAgreement = implementation.shouldShowAgreement();
        BusinessAnalyticsService.reportData("page_loading_checkArgreementState", {
            state: state
        });
    }

    public enterSceneWithCheckAgreement(sceneName: string): void {
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

    public acceptAgreement(): void {
        LoadingAgreementAdapter.getImplementation().markAgreementAccepted();
        BusinessAnalyticsService.reportData("click_Accept_btn");
        this.isShowAgreement = false;
        this.deps.welcomeNode.active = false;
        this.deps.onLoadScene(this.runSceneName);
    }
}