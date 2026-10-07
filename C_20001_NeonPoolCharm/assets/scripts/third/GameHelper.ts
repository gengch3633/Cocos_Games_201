import { CoinfinityRideress } from "./CoinfinityRideress";
import { Debugger } from "./Debugger";
import GuideManager from "./GuideManager";
import GameServiceMgr from "./GameServiceMgr";
import PageMgr from "./PageMgr";
import { PoolNative } from "./PoolNative";

class GameHelper {
    _lastVideoEndTime = 0;
    __Nhwi8h85e9sfgz__: boolean = undefined;

    static _instance: GameHelper = null;

    static get instance(): GameHelper {
        return this._instance != null ? this._instance : (this._instance = new GameHelper());
    }

    static get pocketed(): boolean {
        return this.instance.__Nhwi8h85e9sfgz__ === true;
    }

    init(): void {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._beforeSceneLaunch, this);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._afterSceneLaunch, this);
        PoolNative.setAppLifecycleChangeCallback("cc.js.getClassByName('GameHelper').instance._onAppLifecycleChange");
        if (Debugger.isDebugMode) {
            PoolNative.setSecureFlag(false);
        }
    }

    static get frameSDK(): any {
        return this.getClassByName("FrameSDK");
    }

    static get frameData(): any {
        return this.getClassByName("FrameData");
    }

    static get spawn(): boolean {
        return CoinfinityRideress.instance.dissentious.spawn != null ? CoinfinityRideress.instance.dissentious.spawn : false;
    }

    static get intranetValue(): boolean {
        return CoinfinityRideress.instance.intranet != null ? CoinfinityRideress.instance.intranet : false;
    }

    static get countryCode(): string {
        return CoinfinityRideress.instance.dissentious.dragons != null ? CoinfinityRideress.instance.dissentious.dragons : "";
    }

    _beforeSceneLaunch(): void {
    }

    static getClassByName(name: string): any {
        return cc.js.getClassByName(name) || cc.js._registeredClassNames[name];
    }

    _onNewHandFinish(): void {
        GuideManager.Instance.checkGuide();
    }

    showInterstitial(t: any, o: any, n: any, i: any, a: any, r: any): void {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK?.isShowInters()) {
            frameSDK.openInters(t, o, n, i, a, r);
        } else if (i != null) {
            i(false);
        }
    }

    addFrameListener(): void {
        GameHelper.frameSDK?.addNewHandFinishListen(this._onNewHandFinish, this);
        GameHelper.frameSDK?.addSuperAwardListen(this._onSuperAward, this);
    }

    _afterSceneLaunch(e: cc.Scene): void {
        if (e.name === "game_main") {
            this._addFrameUI(e);
            if (cc.sys.localStorage.getItem("newHand") != null) {
                GuideManager.Instance.checkGuide();
            }
        } else if (e.name === "game_tabel") {
            this._addFrameUI(e);
        }
    }

    showVideo(t: any, o: any, n: any, i: any, a: any, r: any): void {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK) {
            frameSDK.openVideo(t, o, n, i, a, r);
        } else {
            i(false);
        }
    }

    _onAppLifecycleChange(e: any): void {
        cc.director.emit("APP_LIFECYCLE_CHANGE", e);
    }

    _addFrameUI(e: cc.Scene): void {
        const bundle = cc.assetManager.getBundle("Frame");
        if (bundle) {
            bundle.load("Frame", cc.Prefab, (err, prefab) => {
                const canvas = e.getComponentInChildren(cc.Canvas);
                if (canvas) {
                    const node = cc.instantiate(prefab);
                    node.parent = canvas.node;
                    PageMgr.effects?.removeAllChildren(true);
                    node.getChildByName("effectsNode")?.setParent(PageMgr.effects);
                } else {
                    console.error("Canvas not found");
                }
            });
        } else {
            console.warn("Frame bundle not found");
        }
    }

    _onSuperAward(e: string, t: any): void {
        if (e === "show") {
            GameServiceMgr.refreshNextClub(null, () => {
            });
        } else if (t != null) {
            GameServiceMgr.getClub(t, () => {
            });
        }
    }
}

cc.js.setClassName("GameHelper", GameHelper);
export default GameHelper;
