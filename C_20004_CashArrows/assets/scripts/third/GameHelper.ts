import * as BusinessCommonConfig from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";

export default class GameHelper {
    public static getLoadingTasks(): any {
        return BusinessCommonConfig.BUSINESS_COMMON_CONFIG.loadingTasks;
    }

    public static loadMvcPrefabAsync(
        config: { path: string },
        callback: (arg1: number, arg2: number) => void
    ): void {
        cc.resources.load(config.path, cc.Prefab, (err: Error | null, prefab: cc.Prefab) => {
            if (err) {
                callback(1, 1);
            } else {
                const node = cc.instantiate(prefab);
                const scene = cc.director.getScene();
                const parent = scene && scene.children && scene.children.length > 0 ? scene.children[0] : null;
                if (parent) {
                    parent.addChild(node);
                }
                callback(1, 1);
            }
        });
    }

    public static isDebug(): boolean {
        return !ClientDataStore.isProd();
    }

    public static getPreloadTextureDirs(): any {
        return BusinessCommonConfig.BUSINESS_COMMON_CONFIG.preloadTextureDirs;
    }
}