import GuideManager from "./GuideManager";
import GameServiceMgr from "./GameServiceMgr";
import { CoinfinityRideress } from "./CoinfinityRideress";
import { PoolNative } from "./PoolNative";
import PageMgr from "./PageMgr";
import { Debugger } from "./Debugger";

export default class GameHelper {
    private static _instance: GameHelper = null;
    private static __Nhwi8h85e9sfgz__: boolean;
    private _lastVideoEndTime = 0;

    static get instance(): GameHelper {
        return GameHelper._instance ?? (GameHelper._instance = new GameHelper());
    }

    static get pocketed(): boolean {
        return GameHelper.__Nhwi8h85e9sfgz__ === true;
    }

    init(): void {
        cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this._beforeSceneLaunch, this);
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this._afterSceneLaunch, this);
        PoolNative.setAppLifecycleChangeCallback(
            "cc.js.getClassByName('GameHelper').instance._onAppLifecycleChange"
        );
        if (Debugger.isDebugMode) {
            PoolNative.setSecureFlag(false);
        }
    }

    static get frameSDK(): any {
        return GameHelper.getClassByName("FrameSDK");
    }

    static get frameData(): any {
        return GameHelper.getClassByName("FrameData");
    }

    static get spawn(): boolean {
        return CoinfinityRideress.instance.dissentious.spawn ?? false;
    }

    static get intranetValue(): boolean {
        return CoinfinityRideress.instance.intranet ?? false;
    }

    static get countryCode(): string {
        return CoinfinityRideress.instance.dissentious.dragons ?? "";
    }

    _beforeSceneLaunch(): void {}

    static getClassByName(name: string): any {
        return cc.js.getClassByName(name) || cc.js["_registeredClassNames"][name];
    }

    _onNewHandFinish(): void {
        GuideManager.Instance.checkGuide();
    }

    showInterstitial(
        scene: string,
        pos: string,
        success?: () => void,
        fail?: (result?: boolean) => void,
        extra?: unknown,
        extra2?: unknown
    ): void {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK?.isShowInters()) {
            frameSDK.openInters(scene, pos, success, fail, extra, extra2);
        } else {
            fail?.(false);
        }
    }

    addFrameListener(): void {
        GameHelper.frameSDK?.addNewHandFinishListen(this._onNewHandFinish, this);
        GameHelper.frameSDK?.addSuperAwardListen(this._onSuperAward, this);
    }

    _afterSceneLaunch(scene: cc.Scene): void {
        if (scene.name === "game_main") {
            this._addFrameUI(scene);
            if (cc.sys.localStorage.getItem("newHand") != null) {
                GuideManager.Instance.checkGuide();
            }
        } else if (scene.name === "game_tabel") {
            this._addFrameUI(scene);
        }
    }

    showVideo(
        scene: string,
        pos: string,
        success?: () => void,
        fail?: (result?: boolean) => void,
        extra?: unknown,
        extra2?: unknown
    ): void {
        const frameSDK = GameHelper.frameSDK;
        if (frameSDK) {
            frameSDK.openVideo(scene, pos, success, fail, extra, extra2);
        } else {
            fail(false);
        }
    }

    _onAppLifecycleChange(state: unknown): void {
        cc.director.emit("APP_LIFECYCLE_CHANGE", state);
    }

    _addFrameUI(scene: cc.Scene): void {
        const bundle = cc.assetManager.getBundle("Frame");
        if (bundle) {
            bundle.load("Frame", cc.Prefab, (err, prefab: cc.Prefab) => {
                const canvas = scene.getComponentInChildren(cc.Canvas);
                if (canvas) {
                    const frameNode = cc.instantiate(prefab);
                    frameNode.parent = canvas.node;
                    PageMgr.effects?.removeAllChildren(true);
                    frameNode.getChildByName("effectsNode")?.setParent(PageMgr.effects);
                } else {
                    console.error("Canvas not found");
                }
            });
        } else {
            console.warn("Frame bundle not found");
        }
    }

    _onSuperAward(action: string, clubId?: unknown): void {
        if (action === "show") {
            GameServiceMgr.refreshNextClub(null, () => {});
        } else if (clubId != null) {
            GameServiceMgr.getClub(clubId, () => {});
        }
    }
}

cc.js.setClassName("GameHelper", GameHelper);
