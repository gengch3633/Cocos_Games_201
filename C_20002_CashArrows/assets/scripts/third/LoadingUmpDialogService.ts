import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingUmpDialogService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    show(callback: (accepted: boolean) => void) {
        var self = this;
        console.log(" LoadingUmpDialogService show ", this.deps.umpNode, this.deps.umpBtnAgree, this.deps.umpBtnClose);
        this.deps.onPauseLoading();
        this.deps.umpNode.active = true;
        this.deps.umpBtnAgree.once(cc.Node.EventType.TOUCH_END, function () {
            self.deps.onResumeLoading();
            BusinessAnalyticsService.reportData(" click_ump_Agree_btn ");
            self.deps.umpNode.active = false;
            callback(true);
        });
        this.deps.umpBtnClose.once(cc.Node.EventType.TOUCH_END, function () {
            self.deps.onResumeLoading();
            BusinessAnalyticsService.reportData(" click_ump_Close_btn ");
            self.deps.umpNode.active = false;
            callback(false);
        });
    }
}
