class DefaultLoadingSceneProgressAdapter {
    public preloadTextures(): void {
    }

    public preloadScene(
        sceneName: string,
        onProgress: (completedCount: number, totalCount: number, item: any) => void,
        onLoaded: (error: Error | null, scene?: cc.Scene) => void
    ): void {
        cc.director.preloadScene(sceneName, onProgress, onLoaded);
    }

    public getLoadingTasks(): any[] {
        return [];
    }

    public async loadTask(
        task: any,
        onProgress: (completedCount: number, totalCount: number) => void
    ): Promise<void> {
        onProgress(1, 1);
    }

    public isDebug(): boolean {
        return false;
    }
}

export default class LoadingSceneProgressAdapter {
    public static implementation: DefaultLoadingSceneProgressAdapter = new DefaultLoadingSceneProgressAdapter();

    public static setImplementation(implementation?: DefaultLoadingSceneProgressAdapter): void {
        this.implementation = implementation || new DefaultLoadingSceneProgressAdapter();
    }

    public static getImplementation(): DefaultLoadingSceneProgressAdapter {
        return this.implementation;
    }
}