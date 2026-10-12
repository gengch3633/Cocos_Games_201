import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";

export interface ILoadingTask {
    count?: number;
}

export interface ILoadingSceneProgressDeps {
    setProgress(progress: number, immediately: boolean, startProgress: number, endProgress: number): void;
    onProgressFinish(): void;
}

export default class LoadingSceneProgressService {
    private readonly deps: ILoadingSceneProgressDeps;

    public constructor(deps: ILoadingSceneProgressDeps) {
        this.deps = deps;
    }

    public preloadTextures(): void {
        LoadingSceneProgressAdapter.getImplementation().preloadTextures();
    }

    public async run(): Promise<void> {
        BusinessAnalyticsService.reportData("page_loading_progressFinish");

        let progress: number = 0.25;
        LoadingSceneProgressAdapter.getImplementation().preloadScene(
            "BPR_Game_Main",
            (current: number, total: number): void => {
                this.deps.setProgress(current / total, false, 0, progress);
            },
            async (): Promise<void> => {
                try {
                    const tasks: ILoadingTask[] = LoadingSceneProgressAdapter.getImplementation().getLoadingTasks();
                    for (let i: number = 0; i < tasks.length; i++) {
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
        );
    }

    private async progressWithPrefabLoading(progress: number, tasks: ILoadingTask[], index: number): Promise<number> {
        const nextProgress: number = progress + this.getPercentByIndex(tasks, index);
        await LoadingSceneProgressAdapter.getImplementation().loadTask(
            tasks[index],
            (current: number, total: number): void => {
                this.deps.setProgress(current / total, false, progress, nextProgress);
            }
        );
        return nextProgress;
    }

    private getPercentByIndex(tasks: ILoadingTask[], index: number, maxPercent: number = 0.74): number {
        return maxPercent / this.getLoadingTotalCount(tasks) * this.getLoadingCount(tasks, index);
    }

    private getLoadingTotalCount(tasks: ILoadingTask[]): number {
        let total: number = 0;
        for (let i: number = 0; i < tasks.length; i++) {
            total += this.getLoadingCount(tasks, i);
        }
        return total;
    }

    private getLoadingCount(tasks: ILoadingTask[], index: number): number {
        const task: ILoadingTask = tasks[index];
        return (task && task.count) || 1;
    }
}