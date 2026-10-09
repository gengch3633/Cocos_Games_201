import { CoinfinityRideress } from "./CoinfinityRideress";
import { Debugger } from "./Debugger";
import GameServiceMgr from "./GameServiceMgr";
import GuideManager from "./GuideManager";
import PageMgr from "./PageMgr";
import { PoolNative } from "./PoolNative";

class GameHelper {

    _lastVideoEndTime = 0;

    static _instance: GameHelper = null;
    static __Nhwi8h85e9sfgz__: any;

    static get instance() {
        return this._instance != null ? this._instance : this._instance = new GameHelper();
    }

    static get pocketed() {
        return true === this.__Nhwi8h85e9sfgz__;
    }

    init() {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._beforeSceneLaunch, this);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._afterSceneLaunch, this);
        PoolNative.setAppLifecycleChangeCallback("cc.js.getClassByName('GameHelper').instance._onAppLifecycleChange");
        if (Debugger.isDebugMode) {
            PoolNative.setSecureFlag(false);
        }
    }

    static get frameSDK() {
        return this.getClassByName("FrameSDK");
    }

    static get frameData() {
        return this.getClassByName("FrameData");
    }

    static get spawn() {
        const value = CoinfinityRideress.instance.dissentious.spawn;
        return value != null && value;
    }

    static get intranetValue() {
        const value = CoinfinityRideress.instance.intranet;
        return value != null && value;
    }

    static get countryCode() {
        const value = CoinfinityRideress.instance.dissentious.dragons;
        return value != null ? value : "";
    }

    _beforeSceneLaunch() {
    }

    static getClassByName(name) {
        return cc.js.getClassByName(name) || cc.js._registeredClassNames[name];
    }

    _onNewHandFinish() {
        GuideManager.Instance.checkGuide();
    }

    showInterstitial(placement, fromVideo, onStart, onEnd, onInterrupt, webData) {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK != null && frameSDK.isShowInters()) {
            frameSDK.openInters(placement, fromVideo, onStart, onEnd, onInterrupt, webData);
        } else if (onEnd != null) {
            onEnd(false);
        }
    }

    addFrameListener() {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK != null) {
            frameSDK.addNewHandFinishListen(this._onNewHandFinish, this);
        }
        const frameSDK2 = GameHelper.frameSDK;
        if (frameSDK2 != null) {
            frameSDK2.addSuperAwardListen(this._onSuperAward, this);
        }
    }

    _afterSceneLaunch(scene) {
        if ("game_main" === scene.name) {
            this._addFrameUI(scene);
            if (null != cc.sys.localStorage.getItem("newHand")) {
                GuideManager.Instance.checkGuide();
            }
        } else if ("game_tabel" === scene.name) {
            this._addFrameUI(scene);
        }
    }

    showVideo(placement, fromInters, onStart, onEnd, onInterrupt, webData) {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK) {
            frameSDK.openVideo(placement, fromInters, onStart, onEnd, onInterrupt, webData);
        } else {
            onEnd(false);
        }
    }

    _onAppLifecycleChange(state) {
        cc.director.emit("APP_LIFECYCLE_CHANGE", state);
    }

    _addFrameUI(scene) {
        const bundle = cc.assetManager.getBundle("Frame");
        if (bundle) {
            bundle.load("Frame", cc.Prefab, function (err, prefab) {
                const canvas = scene.getComponentInChildren(cc.Canvas);
                if (canvas) {
                    const node = cc.instantiate(prefab);
                    node.parent = canvas.node;
                    if (PageMgr.effects != null) {
                        PageMgr.effects.removeAllChildren(true);
                    }
                    const effectsNode = node.getChildByName("effectsNode");
                    if (effectsNode != null) {
                        effectsNode.setParent(PageMgr.effects);
                    }
                } else {
                    console.error("Canvas not found");
                }
            });
        } else {
            console.warn("Frame bundle not found");
        }
    }

    _onSuperAward(action, club) {
        if ("show" === action) {
            GameServiceMgr.refreshNextClub(null, function () {
            });
        } else if (null != club) {
            GameServiceMgr.getClub(club, function () {
            });
        }
    }
}

export default GameHelper;
cc.js.setClassName("GameHelper", GameHelper);
