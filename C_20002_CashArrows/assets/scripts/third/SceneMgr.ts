import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIMgr from "./UIMgr";

export default class SceneMgr extends Singleton {
    _preSceneName: string | null = null;
    _sceneName: string | null = null;

    get sceneName(): string {
        return this._sceneName != null ? this._sceneName : cc.director.getScene().name;
    }

    get preSceneName(): string | null {
        return this._preSceneName;
    }

    includes(sceneName: string): boolean {
        return cc.assetManager.bundles.find((bundle) => bundle.getSceneInfo(sceneName) != null) != null;
    }

    async loadScene(
        sceneName: string,
        bundleName: string | null = null,
        onLoaded: (() => void) | null = null
    ): Promise<void> {
        if (this.includes(sceneName)) {
            this._preSceneName = this._sceneName;
            cc.director.loadScene(sceneName, () => {
                this._sceneName = sceneName;
                onLoaded && onLoaded();
            });
            UIMgr.getInstance().hideWatingUI();
            return;
        }
        UIMgr.getInstance().showWatingUI();
        await ResMgr.getInstance().getBundle(bundleName);
        return this.loadScene(sceneName, bundleName, onLoaded);
    }
}
