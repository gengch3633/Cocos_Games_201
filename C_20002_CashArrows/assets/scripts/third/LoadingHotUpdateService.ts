import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export interface LoadingHotUpdateDeps {
    onUpdateProgress?(progress: unknown): void;
    onFinish(): void;
}

export default class LoadingHotUpdateService {
    deps: LoadingHotUpdateDeps;

    constructor(deps: LoadingHotUpdateDeps) {
        this.deps = deps;
    }

    start(): void {
        LoadingHotUpdateAdapter.getImplementation().start({
            report: (event, data) => BusinessAnalyticsService.reportData(event, data),
            onUpdateProgress: (progress) => this.deps.onUpdateProgress?.(progress),
            onFinish: () => this.deps.onFinish(),
        });
    }
}
