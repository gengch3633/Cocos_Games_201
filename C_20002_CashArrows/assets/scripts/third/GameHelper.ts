import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";

export default class GameHelper {
    static getLoadingTasks(): any[] {
        return BUSINESS_COMMON_CONFIG.loadingTasks;
    }

    static loadMvcPrefabAsync(task: { path: string }, onProgress: (current: number, total: number) => void): void {
        cc.resources.load(task.path, cc.Prefab, (error, prefab) => {
            if (error) {
                onProgress(1, 1);
            } else {
                const instance = cc.instantiate(prefab);
                const root = cc.director.getScene()?.children?.[0];
                if (root) {
                    root.addChild(instance);
                }
                onProgress(1, 1);
            }
        });
    }

    static isDebug(): boolean {
        return !ClientDataStore.isProd();
    }

    static getPreloadTextureDirs(): string[] {
        return BUSINESS_COMMON_CONFIG.preloadTextureDirs;
    }
}
