export interface LoadingTaskItem {
    count?: number;
}

class DefaultLoadingSceneProgressAdapter {
    preloadTextures(): void {}

    preloadScene(sceneName: string, onProgress: (loaded: number, total: number) => void, onComplete: () => void): void {
        cc.director.preloadScene(sceneName, onProgress, onComplete);
    }

    getLoadingTasks(): LoadingTaskItem[] {
        return [];
    }

    async loadTask(_task: LoadingTaskItem, onProgress: (loaded: number, total: number) => void): Promise<void> {
        onProgress(1, 1);
    }

    isDebug(): boolean {
        return false;
    }
}

export default class LoadingSceneProgressAdapter {
    static implementation: DefaultLoadingSceneProgressAdapter = new DefaultLoadingSceneProgressAdapter();

    static setImplementation(impl?: DefaultLoadingSceneProgressAdapter): void {
        this.implementation = impl || new DefaultLoadingSceneProgressAdapter();
    }

    static getImplementation(): DefaultLoadingSceneProgressAdapter {
        return this.implementation;
    }
}
