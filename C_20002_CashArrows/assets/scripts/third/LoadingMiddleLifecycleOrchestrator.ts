import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

export default class LoadingMiddleLifecycleOrchestrator {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    bind(): void {
        const adapter = LoadingMiddleLifecycleAdapter.getImplementation();
        adapter.bindLifecycleHooks({
            onBan: () => {
                adapter.onBanLog();
                BusinessAnalyticsService.reportData("page_loading_ban");
                this.deps.onFallback();
            },
            onBackstop: () => {
                adapter.onBackstopLog();
                BusinessAnalyticsService.reportData("page_loading_backstop");
                this.deps.onFallback();
            },
            onEnterGame: () => {
                adapter.onEnterGamePrepare();
                BusinessAnalyticsService.reportData("page_loading_enter");
                this.deps.onEnterGame();
            },
            onShowUmp: (callback: (accepted: boolean) => void) => {
                adapter.onShowUmpPrepare();
                BusinessAnalyticsService.reportData("page_loading_show_ump");
                this.deps.onShowUmp(callback);
            }
        });
    }
}
