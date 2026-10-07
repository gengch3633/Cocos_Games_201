import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";

export default class LoadingSceneProgressService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    preloadTextures(): void {
        LoadingSceneProgressAdapter.getImplementation().preloadTextures();
    }

    async run(): Promise<void> {
        BusinessAnalyticsService.reportData(" page_loading_progressFinish ");
        let progressEnd = 0.25;
        const adapter = LoadingSceneProgressAdapter.getImplementation();
        adapter.preloadScene(" BPR_Game_Main ", (current: number, total: number) => {
            this.deps.setProgress(current / total, false, 0, progressEnd);
        }, async () => {
            try {
                const tasks = adapter.getLoadingTasks();
                for (let i = 0; i < tasks.length; i++) {
                    progressEnd = await this.progressWithPrefabLoading(progressEnd, tasks, i);
                }
            } catch (err) {
                console.error(" loading progressFinish failed, the error was " + err);
                if (adapter.isDebug()) {
                    throw new Error(" loading progressFinish failed, the error was " + err);
                }
            } finally {
                BusinessAnalyticsService.reportData(" page_loading_progressFinish_runMainScene ");
                this.deps.onProgressFinish();
            }
        });
    }

    async progressWithPrefabLoading(startProgress: number, tasks: any[], index: number): Promise<number> {
        const endProgress = startProgress + this.getPercentByIndex(tasks, index);
        await LoadingSceneProgressAdapter.getImplementation().loadTask(tasks[index], (current: number, total: number) => {
            this.deps.setProgress(current / total, false, startProgress, endProgress);
        });
        return endProgress;
    }

    getPercentByIndex(tasks: any[], index: number, totalWeight: number = 0.74): number {
        return totalWeight / this.getLoadingTotalCount(tasks) * this.getLoadingCount(tasks, index);
    }

    getLoadingTotalCount(tasks: any[]): number {
        let count = 0;
        for (let i = 0; i < tasks.length; i++) {
            count += this.getLoadingCount(tasks, i);
        }
        return count;
    }

    getLoadingCount(tasks: any[], index: number): number {
        return tasks[index]?.count || 1;
    }
}
