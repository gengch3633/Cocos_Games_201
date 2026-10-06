import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";

interface LoadingTask {
    path: string;
    count?: number;
}

export default class GameHelper {
    static getLoadingTasks(): LoadingTask[] {
        return BUSINESS_COMMON_CONFIG.loadingTasks;
    }

    static loadMvcPrefabAsync(task: LoadingTask, callback: (current: number, total: number) => void): void {
        cc.resources.load(task.path, cc.Prefab, (error, prefab) => {
            if (error) {
                callback(1, 1);
                return;
            }
            const instance = cc.instantiate(prefab);
            const sceneRoot = cc.director.getScene()?.children?.[0];
            if (sceneRoot) {
                sceneRoot.addChild(instance);
            }
            callback(1, 1);
        });
    }

    static isDebug(): boolean {
        return !ClientDataStore.isProd();
    }

    static getPreloadTextureDirs(): string[] {
        return BUSINESS_COMMON_CONFIG.preloadTextureDirs;
    }
}
