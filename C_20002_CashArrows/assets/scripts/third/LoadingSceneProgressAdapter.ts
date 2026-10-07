export interface LoadingTaskItem {
    count?: number;
}

class LoadingSceneProgressAdapterImpl {
    preloadTextures(): void {}

    preloadScene(sceneName: string, onProgress: (loaded: number, total: number) => void, onLoaded: () => void): void {
        cc.director.preloadScene(sceneName, onProgress, onLoaded);
    }

    getLoadingTasks(): LoadingTaskItem[] {
        return [];
    }

    async loadTask(_task: LoadingTaskItem, onProgress: (current: number, total: number) => void): Promise<void> {
        onProgress(1, 1);
    }

    isDebug(): boolean {
        return false;
    }
}

export default class LoadingSceneProgressAdapter {
    static implementation: LoadingSceneProgressAdapterImpl = new LoadingSceneProgressAdapterImpl();

    static setImplementation(impl?: LoadingSceneProgressAdapterImpl): void {
        this.implementation = impl || new LoadingSceneProgressAdapterImpl();
    }

    static getImplementation(): LoadingSceneProgressAdapterImpl {
        return this.implementation;
    }
}
