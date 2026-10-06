import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingMiddleLifecycleOrchestrator {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    bind() {
        var self = this;
        var impl = LoadingMiddleLifecycleAdapter.getImplementation();
        impl.bindLifecycleHooks({
            onBan: function () {
                impl.onBanLog();
                BusinessAnalyticsService.reportData(" page_loading_ban ");
                self.deps.onFallback();
            },
            onBackstop: function () {
                impl.onBackstopLog();
                BusinessAnalyticsService.reportData(" page_loading_backstop ");
                self.deps.onFallback();
            },
            onEnterGame: function () {
                impl.onEnterGamePrepare();
                BusinessAnalyticsService.reportData(" page_loading_enter ");
                self.deps.onEnterGame();
            },
            onShowUmp: function (callback: any) {
                impl.onShowUmpPrepare();
                BusinessAnalyticsService.reportData(" page_loading_show_ump ");
                self.deps.onShowUmp(callback);
            }
        });
    }
}
