import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIMgr from "./UIMgr";

export default class SceneMgr extends Singleton {
    private _sceneName: string = null;
    private _preSceneName: string = null;

    public get sceneName(): string {
        return this._sceneName != null ? this._sceneName : cc.director.getScene().name;
    }

    public get preSceneName(): string {
        return this._preSceneName;
    }

    public includes(sceneName: string): boolean {
        return null != cc.assetManager.bundles.find((bundle: cc.AssetManager.Bundle) => {
            return null != bundle.getSceneInfo(sceneName);
        });
    }

    public async loadScene(sceneName: string, bundleName: string = null, callback: () => void = null): Promise<void> {
        if (this.includes(sceneName)) {
            this._preSceneName = this._sceneName;
            cc.director.loadScene(sceneName, () => {
                this._sceneName = sceneName;
                callback && callback();
            });
            UIMgr.getInstance().hideWatingUI();
            return;
        }

        UIMgr.getInstance().showWatingUI();
        await ResMgr.getInstance().getBundle(bundleName);
        await this.loadScene(sceneName, bundleName, callback);
    }
}