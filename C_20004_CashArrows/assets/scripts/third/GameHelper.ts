import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";

export default class GameHelper {
    public static getLoadingTasks(): { path: string; count: number }[] {
        return BUSINESS_COMMON_CONFIG.loadingTasks;
    }

    public static loadMvcPrefabAsync(task: { path: string }, callback: (code: number, progress: number) => void): void {
        cc.resources.load(task.path, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (err) {
                callback(1, 1);
            } else {
                const node = cc.instantiate(prefab);
                const root = cc.director.getScene()?.children?.[0];
                if (root) {
                    root.addChild(node);
                }
                callback(1, 1);
            }
        });
    }

    public static isDebug(): boolean {
        return !ClientDataStore.isProd();
    }

    public static getPreloadTextureDirs(): string[] {
        return BUSINESS_COMMON_CONFIG.preloadTextureDirs;
    }
}