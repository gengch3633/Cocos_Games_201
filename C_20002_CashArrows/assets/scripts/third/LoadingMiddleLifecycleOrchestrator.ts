import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

export interface LoadingMiddleLifecycleOrchestratorDeps {
    onFallback: () => void;
    onEnterGame: () => void;
    onShowUmp: (callback: (agreed: boolean) => void) => void;
}

export default class LoadingMiddleLifecycleOrchestrator {
    deps: LoadingMiddleLifecycleOrchestratorDeps;

    constructor(deps: LoadingMiddleLifecycleOrchestratorDeps) {
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
            onShowUmp: (callback) => {
                adapter.onShowUmpPrepare();
                BusinessAnalyticsService.reportData("page_loading_show_ump");
                this.deps.onShowUmp(callback);
            },
        });
    }
}
