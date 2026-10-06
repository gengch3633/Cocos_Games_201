class DefaultLoadingSceneProgressAdapter {
    preloadTextures() {
    }

    preloadScene(sceneName: string, onProgress: any, onLoaded: any) {
        cc.director.preloadScene(sceneName, onProgress, onLoaded);
    }

    getLoadingTasks() {
        return [];
    }

    async loadTask(_task: any, callback: (current: number, total: number) => void) {
        callback(1, 1);
    }

    isDebug() {
        return false;
    }
}

export default class LoadingSceneProgressAdapter {
    static implementation: DefaultLoadingSceneProgressAdapter = new DefaultLoadingSceneProgressAdapter();

    static setImplementation(impl: DefaultLoadingSceneProgressAdapter) {
        this.implementation = impl || new DefaultLoadingSceneProgressAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
