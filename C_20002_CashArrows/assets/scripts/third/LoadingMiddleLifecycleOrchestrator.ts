import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export interface LoadingMiddleLifecycleDeps {
    onFallback(): void;
    onEnterGame(): void;
    onShowUmp(data?: unknown): void;
}

export default class LoadingMiddleLifecycleOrchestrator {
    deps: LoadingMiddleLifecycleDeps;

    constructor(deps: LoadingMiddleLifecycleDeps) {
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
            onShowUmp: (data) => {
                adapter.onShowUmpPrepare();
                BusinessAnalyticsService.reportData("page_loading_show_ump");
                this.deps.onShowUmp(data);
            },
        });
    }
}
