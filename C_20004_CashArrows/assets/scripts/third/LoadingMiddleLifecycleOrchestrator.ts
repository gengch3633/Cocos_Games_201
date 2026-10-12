import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

interface LifecycleDeps {
    onFallback: () => void;
    onEnterGame: () => void;
    onShowUmp: (data: any) => void;
}

export default class LoadingMiddleLifecycleOrchestrator {
    private deps: LifecycleDeps;

    constructor(deps: LifecycleDeps) {
        this.deps = deps;
    }

    public bind(): void {
        const impl = LoadingMiddleLifecycleAdapter.getImplementation();
        impl.bindLifecycleHooks({
            onBan: () => {
                impl.onBanLog();
                BusinessAnalyticsService.reportData("page_loading_ban");
                this.deps.onFallback();
            },
            onBackstop: () => {
                impl.onBackstopLog();
                BusinessAnalyticsService.reportData("page_loading_backstop");
                this.deps.onFallback();
            },
            onEnterGame: () => {
                impl.onEnterGamePrepare();
                BusinessAnalyticsService.reportData("page_loading_enter");
                this.deps.onEnterGame();
            },
            onShowUmp: (data: any) => {
                impl.onShowUmpPrepare();
                BusinessAnalyticsService.reportData("page_loading_show_ump");
                this.deps.onShowUmp(data);
            }
        });
    }
}