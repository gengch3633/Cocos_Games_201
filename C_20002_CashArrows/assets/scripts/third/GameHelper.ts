import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";

export default class GameHelper {
    static getLoadingTasks() {
        return BUSINESS_COMMON_CONFIG.loadingTasks;
    }

    static loadMvcPrefabAsync(task: any, callback: any) {
        cc.resources.load(task.path, cc.Prefab, function (err: any, prefab: any) {
            if (err) callback(1, 1); else {
                const node = cc.instantiate(prefab);
                const root = cc.director.getScene()?.children?.[0];
                root && root.addChild(node);
                callback(1, 1);
            }
        });
    }

    static isDebug() {
        return !ClientDataStore.isProd();
    }

    static getPreloadTextureDirs() {
        return BUSINESS_COMMON_CONFIG.preloadTextureDirs;
    }
}
