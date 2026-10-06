import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UIMgr from "./UIMgr";

export default class SceneMgr extends Singleton {
    _preSceneName: any = null;
    _sceneName: any;

    get sceneName() {
        var e;
        return null !== (e = this._sceneName) && void 0 !== e ? e : cc.director.getScene().name;
    }

    get preSceneName() {
        return this._preSceneName;
    }

    includes(e: string) {
        return null != cc.assetManager.bundles.find(function (t) {
            return null != t.getSceneInfo(e);
        });
    }

    async loadScene(e: string, t: any = null, i: any = null) {
        if (this.includes(e)) {
            this._preSceneName = this._sceneName;
            cc.director.loadScene(e, () => {
                this._sceneName = e;
                i && i();
            });
            UIMgr.getInstance().hideWatingUI();
            return;
        }
        UIMgr.getInstance().showWatingUI();
        await ResMgr.getInstance().getBundle(t);
        return this.loadScene(e, t, i);
    }
}
