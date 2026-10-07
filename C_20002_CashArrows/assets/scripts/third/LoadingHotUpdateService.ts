import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";

export interface LoadingHotUpdateServiceDeps {
    onUpdateProgress: (current: number, total: number) => void;
    onFinish: () => void;
}

export default class LoadingHotUpdateService {
    deps: LoadingHotUpdateServiceDeps;

    constructor(deps: LoadingHotUpdateServiceDeps) {
        this.deps = deps;
    }

    start(): void {
        LoadingHotUpdateAdapter.getImplementation().start({
            report: (event: string, data?: any) => BusinessAnalyticsService.reportData(event, data),
            onUpdateProgress: this.deps.onUpdateProgress,
            onFinish: this.deps.onFinish,
        });
    }
}
