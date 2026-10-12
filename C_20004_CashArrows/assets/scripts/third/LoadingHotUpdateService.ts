import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";

export interface ILoadingHotUpdateDeps {
    onUpdateProgress: (...args: any[]) => void;
    onFinish: (...args: any[]) => void;
}

export default class LoadingHotUpdateService {
    private deps: ILoadingHotUpdateDeps;

    constructor(deps: ILoadingHotUpdateDeps) {
        this.deps = deps;
    }

    public start(): void {
        LoadingHotUpdateAdapter.getImplementation().start({
            report: (e: any, t: any): any => {
                return BusinessAnalyticsService.reportData(e, t);
            },
            onUpdateProgress: this.deps.onUpdateProgress,
            onFinish: this.deps.onFinish
        });
    }
}