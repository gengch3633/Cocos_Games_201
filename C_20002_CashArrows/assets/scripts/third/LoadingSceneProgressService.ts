import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingSceneProgressAdapter, { LoadingTaskItem } from "./LoadingSceneProgressAdapter";

export interface LoadingSceneProgressServiceDeps {
    setProgress: (current: number, total: number, from: number, to: number) => void;
    onProgressFinish: () => void;
}

export default class LoadingSceneProgressService {
    deps: LoadingSceneProgressServiceDeps;

    constructor(deps: LoadingSceneProgressServiceDeps) {
        this.deps = deps;
    }

    preloadTextures(): void {
        LoadingSceneProgressAdapter.getImplementation().preloadTextures();
    }

    async run(): Promise<void> {
        BusinessAnalyticsService.reportData("page_loading_progressFinish");
        let progress = 0.25;
        LoadingSceneProgressAdapter.getImplementation().preloadScene(
            "BPR_Game_Main",
            (loaded, total) => {
                this.deps.setProgress(loaded / total, false, 0, progress);
            },
            () => {
                this.onScenePreloaded(progress).catch((err) => {
                    console.error("loading progressFinish failed, the error was " + err);
                    if (LoadingSceneProgressAdapter.getImplementation().isDebug()) {
                        throw new Error("loading progressFinish failed, the error was " + err);
                    }
                });
            }
        );
    }

    private async onScenePreloaded(startProgress: number): Promise<void> {
        let progress = startProgress;
        try {
            const tasks = LoadingSceneProgressAdapter.getImplementation().getLoadingTasks();
            for (let i = 0; i < tasks.length; i++) {
                progress = await this.progressWithPrefabLoading(progress, tasks, i);
            }
        } finally {
            BusinessAnalyticsService.reportData("page_loading_progressFinish_runMainScene");
            this.deps.onProgressFinish();
        }
    }

    async progressWithPrefabLoading(startProgress: number, tasks: LoadingTaskItem[], index: number): Promise<number> {
        const targetProgress = startProgress + this.getPercentByIndex(tasks, index);
        await LoadingSceneProgressAdapter.getImplementation().loadTask(tasks[index], (current, total) => {
            this.deps.setProgress(current / total, false, startProgress, targetProgress);
        });
        return targetProgress;
    }

    getPercentByIndex(tasks: LoadingTaskItem[], index: number, maxPercent: number = 0.74): number {
        return (maxPercent / this.getLoadingTotalCount(tasks)) * this.getLoadingCount(tasks, index);
    }

    getLoadingTotalCount(tasks: LoadingTaskItem[]): number {
        let total = 0;
        for (let i = 0; i < tasks.length; i++) {
            total += this.getLoadingCount(tasks, i);
        }
        return total;
    }

    getLoadingCount(tasks: LoadingTaskItem[], index: number): number {
        return tasks[index]?.count || 1;
    }
}
