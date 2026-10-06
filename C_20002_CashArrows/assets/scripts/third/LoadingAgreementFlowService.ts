import LoadingAgreementAdapter from "./LoadingAgreementAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingAgreementFlowService {
    deps: any;
    runSceneName = " ";
    isShowAgreement = false;

    constructor(deps: any) {
        this.deps = deps;
    }

    checkState() {
        var impl = LoadingAgreementAdapter.getImplementation();
        var state = impl.getAgreementState();
        this.isShowAgreement = impl.shouldShowAgreement();
        BusinessAnalyticsService.reportData(" page_loading_checkArgreementState ", {
            state: state
        });
    }

    enterSceneWithCheckAgreement(sceneName: string) {
        BusinessAnalyticsService.reportData(" page_loading_enterSceneWithCheckArgeement ");
        this.runSceneName = sceneName;
        if (this.isShowAgreement && LoadingAgreementAdapter.getImplementation().shouldGateByMiddleReview()) {
            BusinessAnalyticsService.reportData(" page_loading_showWelcomeNode ");
            this.deps.welcomeNode.active = true;
        } else {
            BusinessAnalyticsService.reportData(" page_loading_runMainScene ");
            this.deps.onLoadScene(this.runSceneName);
        }
    }

    acceptAgreement() {
        LoadingAgreementAdapter.getImplementation().markAgreementAccepted();
        BusinessAnalyticsService.reportData(" click_Accept_btn ");
        this.isShowAgreement = false;
        this.deps.welcomeNode.active = false;
        this.deps.onLoadScene(this.runSceneName);
    }
}
