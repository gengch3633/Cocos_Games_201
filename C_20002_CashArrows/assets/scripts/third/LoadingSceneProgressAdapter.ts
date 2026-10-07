class DefaultLoadingSceneProgressAdapter {
    preloadTextures(): void {
    }

    preloadScene(sceneName: string, onProgress: (completedCount: number, totalCount: number) => void, onLoaded: () => void): void {
        cc.director.preloadScene(sceneName, onProgress, onLoaded);
    }

    getLoadingTasks(): any[] {
        return [];
    }

    async loadTask(task: any, onProgress: (current: number, total: number) => void): Promise<void> {
        onProgress(1, 1);
    }

    isDebug(): boolean {
        return false;
    }
}

export default class LoadingSceneProgressAdapter {
    static implementation: DefaultLoadingSceneProgressAdapter = new DefaultLoadingSceneProgressAdapter();

    static setImplementation(impl: DefaultLoadingSceneProgressAdapter): void {
        this.implementation = impl || new DefaultLoadingSceneProgressAdapter();
    }

    static getImplementation(): DefaultLoadingSceneProgressAdapter {
        return this.implementation;
    }
}
