import LoadingSceneProgressAdapter, { LoadingTaskItem } from "./LoadingSceneProgressAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export interface LoadingSceneProgressDeps {
    setProgress(current: number, total: number, from?: number, to?: number): void;
    onProgressFinish(): void;
}

export default class LoadingSceneProgressService {
    deps: LoadingSceneProgressDeps;

    constructor(deps: LoadingSceneProgressDeps) {
        this.deps = deps;
    }

    preloadTextures(): void {
        LoadingSceneProgressAdapter.getImplementation().preloadTextures();
    }

    async run(): Promise<void> {
        BusinessAnalyticsService.reportData("page_loading_progressFinish");
        let progress = 0.25;
        await new Promise<void>((resolve) => {
            LoadingSceneProgressAdapter.getImplementation().preloadScene(
                "BPR_Game_Main",
                (loaded, total) => {
                    this.deps.setProgress(loaded / total, false, 0, progress);
                },
                () => {
                    resolve();
                }
            );
        });

        try {
            const tasks = LoadingSceneProgressAdapter.getImplementation().getLoadingTasks();
            for (let i = 0; i < tasks.length; i++) {
                progress = await this.progressWithPrefabLoading(progress, tasks, i);
            }
        } catch (error) {
            console.error("loading progressFinish failed, the error was " + error);
            if (LoadingSceneProgressAdapter.getImplementation().isDebug()) {
                throw new Error("loading progressFinish failed, the error was " + error);
            }
        } finally {
            BusinessAnalyticsService.reportData("page_loading_progressFinish_runMainScene");
            this.deps.onProgressFinish();
        }
    }

    async progressWithPrefabLoading(progress: number, tasks: LoadingTaskItem[], index: number): Promise<number> {
        const target = progress + this.getPercentByIndex(tasks, index);
        await LoadingSceneProgressAdapter.getImplementation().loadTask(tasks[index], (loaded, total) => {
            this.deps.setProgress(loaded / total, false, progress, target);
        });
        return target;
    }

    getPercentByIndex(tasks: LoadingTaskItem[], index: number, totalWeight = 0.74): number {
        return (totalWeight / this.getLoadingTotalCount(tasks)) * this.getLoadingCount(tasks, index);
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
