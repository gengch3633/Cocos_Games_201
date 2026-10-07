import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingUmpDialogService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    show(callback: (accepted: boolean) => void): void {
        console.log("LoadingUmpDialogService show", this.deps.umpNode, this.deps.umpBtnAgree, this.deps.umpBtnClose);
        this.deps.onPauseLoading();
        this.deps.umpNode.active = true;
        this.deps.umpBtnAgree.once(cc.Node.EventType.TOUCH_END, () => {
            this.deps.onResumeLoading();
            BusinessAnalyticsService.reportData("click_ump_Agree_btn");
            this.deps.umpNode.active = false;
            callback(true);
        });
        this.deps.umpBtnClose.once(cc.Node.EventType.TOUCH_END, () => {
            this.deps.onResumeLoading();
            BusinessAnalyticsService.reportData("click_ump_Close_btn");
            this.deps.umpNode.active = false;
            callback(false);
        });
    }
}
