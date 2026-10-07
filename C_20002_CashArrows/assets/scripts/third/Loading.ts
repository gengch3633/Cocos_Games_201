import AppReviewManager from "./AppReviewManager";
import ClientDataStore from "./ClientDataStore";
import ConfigMgr from "./ConfigMgr";
import CurrencyFormatService from "./CurrencyFormatService";
import Handler from "./Handler";
import LanguageService from "./LanguageService";
import Launch from "./Launch";
import LoadingHttpService from "./LoadingHttpService";
import UIDefine from "./UIDefine";
import {
    initProjectLoadingAdapters,
    initSystem,
    runBaseFlow,
    runMiddleCountry
} from "./LoadingProjectAdaptersBridge";
import LoadingUmpDialogService from "./LoadingUmpDialogService";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SceneMgr from "./SceneMgr";
import { UILayer } from "./UIDefine";
import UiPageAnalyticsService from "./UiPageAnalyticsService";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import Utils from "./Utils";
import "./GEMgr";

function isArrowLogEnabled(): boolean {
    try {
        if (typeof window !== "undefined"&& window.__ARROW_ENABLE_LOG__ === true) { return true; } } catch (e) { } try { if (typeof cc !=="undefined" && cc.sys && cc.sys.localStorage) {
            const value = cc.sys.localStorage.getItem("arrow_enable_log");
            return value === "1" || value === "true";
        }
    } catch (e) {
    }
    return false;
}

(function () {
    if (!isArrowLogEnabled()) {
        const noop = function () {};
        if (typeof console !== "undefined") {
            console.log = noop;
            console.info = noop;
            console.debug = noop;
            console.warn = noop;
            console.error = noop;
        }
        if (typeof cc !== "undefined") {
            cc.log = noop;
            cc.warn = noop;
            cc.error = noop;
        }
    }
})();

const LOADING_STEPS = [
    { name: "waitGaid", weight: 8 },
    { name: "middleCountry", weight: 8 },
    { name: "login", weight: 8 },
    { name: "systemConfig", weight: 8 },
    { name: "gameConfig", weight: 8 },
    { name: "userInfo", weight: 8 },
    { name: "configLoad", weight: 20 },
    { name: "archiveInit", weight: 10 },
    { name: "bundleLoad", weight: 15 },
    { name: "enterScene", weight: 7 }
];

const LOADING_TOTAL_WEIGHT = LOADING_STEPS.reduce((sum, step) => sum + step.weight, 0);

function patchSpineBlendGuard(): void {
    if (cc.sys && cc.sys.isNative && !(cc as any).__spineBlendGuardPatched) {
        const gfx = cc.gfx || {};
        const materialPrototype = cc.Material && cc.Material.prototype;
        if (materialPrototype && typeof materialPrototype.setBlend === "function") {
            const originalSetBlend = materialPrototype.setBlend;
            const blendOpAdd = gfx.BLEND_FUNC_ADD != null ? gfx.BLEND_FUNC_ADD : gfx.BLEND_OP_ADD;
            const blendSrcAlpha = gfx.BLEND_SRC_ALPHA != null ? gfx.BLEND_SRC_ALPHA : cc.macro.SRC_ALPHA;
            const blendOneMinusSrcAlpha = gfx.BLEND_ONE_MINUS_SRC_ALPHA != null ? gfx.BLEND_ONE_MINUS_SRC_ALPHA : cc.macro.ONE_MINUS_SRC_ALPHA;
            const blendOne = gfx.BLEND_ONE != null ? gfx.BLEND_ONE : cc.macro.ONE;
            const blendSrcColor = gfx.BLEND_SRC_COLOR != null ? gfx.BLEND_SRC_COLOR : cc.macro.SRC_COLOR;
            const blendOneMinusSrcColor = gfx.BLEND_ONE_MINUS_SRC_COLOR != null ? gfx.BLEND_ONE_MINUS_SRC_COLOR : cc.macro.ONE_MINUS_SRC_COLOR;
            const blendDstColor = gfx.BLEND_DST_COLOR != null ? gfx.BLEND_DST_COLOR : cc.macro.DST_COLOR;
            const blendOneMinusDstColor = gfx.BLEND_ONE_MINUS_DST_COLOR != null ? gfx.BLEND_ONE_MINUS_DST_COLOR : cc.macro.ONE_MINUS_DST_COLOR;
            const blendSrcAlphaSaturate = gfx.BLEND_SRC_ALPHA_SATURATE != null ? gfx.BLEND_SRC_ALPHA_SATURATE : cc.macro.SRC_ALPHA_SATURATE;

            function isInvalidBlendValue(value: any): boolean {
                return value == null
                    || value === ConfigMgr
                    || value === Launch
                    || value === SceneMgr
                    || value === UIMgr
                    || value === Utils;
            }

            materialPrototype.setBlend = function (
                target: any,
                blendOp?: any,
                src?: any,
                dst?: any,
                blendOpAlpha?: any,
                srcAlpha?: any,
                dstAlpha?: any,
                mask?: any,
                autoMerge?: any
            ) {
                if (blendOp == null) {
                    blendOp = blendOpAdd;
                }
                if (blendOpAlpha == null) {
                    blendOpAlpha = blendOpAdd;
                }
                if (src == null) {
                    src = blendSrcAlpha;
                }
                if (dst == null) {
                    dst = blendOneMinusSrcAlpha;
                }
                if (isInvalidBlendValue(srcAlpha)) {
                    srcAlpha = blendOne;
                }
                if (isInvalidBlendValue(dstAlpha)) {
                    dstAlpha = blendOneMinusSrcAlpha;
                }
                if (srcAlpha == null) {
                    srcAlpha = blendOne;
                }
                if (dstAlpha == null) {
                    dstAlpha = blendOneMinusSrcAlpha;
                }
                if (mask == null) {
                    mask = 4294967295;
                }
                return originalSetBlend.call(this, target, blendOp, src, dst, blendOpAlpha, srcAlpha, dstAlpha, mask, autoMerge);
            };
            (cc as any).__spineBlendGuardPatched = true;
            console.warn("[BlendGuard] Native blend guard enabled");
        }
    }
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    @property(sp.Skeleton)
    sp_logo: sp.Skeleton = null;

    @property([cc.SpriteFrame])
    sf_logoarr: cc.SpriteFrame[] = [];

    @property(cc.Node)
    node_noMac: cc.Node = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Sprite)
    img_jindu: cc.Sprite = null;

    @property(cc.Node)
    umpNode: cc.Node = null;

    @property(cc.Node)
    umpBtnAgree: cc.Node = null;

    @property(cc.Node)
    umpBtnClose: cc.Node = null;

    private _isProgressPaused: boolean = false;
    private _pendingProgressRatio: number = 0;
    private _hasPendingProgress: boolean = false;
    private _realProgress: number = 0;
    private _sceneEntering: boolean = false;

    onLoad(): void {
        patchSpineBlendGuard();
        console.log("[Loading][UMP] onLoad hasUmpNode=" + !!this.umpNode + " hasAgreeBtn=" + !!this.umpBtnAgree + " hasCloseBtn="+ !!this.umpBtnClose); initProjectLoadingAdapters(); LanguageService.init(); this.playLogoSpineOnce(); this.init(); } playLogoSpineOnce(): void { if (this.sp_logo && this.sp_logo.setAnimation) { try { const animationName = this.sp_logo.defaultAnimation ||"animation";
                this.sp_logo.loop = false;
                this.sp_logo.clearTracks && this.sp_logo.clearTracks();
                this.sp_logo.setAnimation(0, animationName, false);
                this.sp_logo.setCompleteListener && this.sp_logo.setCompleteListener(function () {});
            } catch (error) {
                console.warn("[Loading] play logo spine failed:", error);
            }
        }
    }

    async ShowNoMac(): Promise<void> {
        let showNoMac = true;
        const macList = await ConfigMgr.getInstance().getMackList();
        console.log("maclist:", macList);
        macList.forEach((item: any) => {
            if (item.macId === UserData.getInstance().userID) {
                showNoMac = false;
            }
        });
        if (showNoMac) {
            this.node_noMac.active = true;
        } else {
            this.init();
        }
    }

    init(): void {
        const self = this;
        let umpService: any = null;

        Utils.AddIrregularityClick();
        cc.macro.ENABLE_MULTI_TOUCH = false;

        const launchConfig: any = {
            gameName: "",
            rewardVideo: [],
            inters: "",
            custom: "",
            ossUrl: "",
            login: false,
            dataSyncToServer: false,
            report: false
        };

        if (cc.sys.isBrowser) {
            const urlParams = this.getURLParams();
            if (urlParams) {
                Object.assign(launchConfig, urlParams);
                console.log("url params:", urlParams);
            }
        }

        UIMgr.getInstance().initLayer(Object.keys(UILayer), UILayer.Bottom);
        AppReviewManager.getInstance().init();
        UiPageAnalyticsService.init();
        UiPageAnalyticsService.trackEnter("launch_page");
        initSystem();

        const progressTracker = (() => {
            const animateProgress = (ratio: number) => {
                self._animateProgressTo(ratio);
            };
            const completedSteps: { [name: string]: boolean } = {};
            return {
                stepDone(stepName: string) {
                    if (!completedSteps[stepName]) {
                        completedSteps[stepName] = true;
                        let completedWeight = 0;
                        for (let index = 0; index < LOADING_STEPS.length; index++) {
                            if (completedSteps[LOADING_STEPS[index].name]) {
                                completedWeight += LOADING_STEPS[index].weight;
                            }
                        }
                        const ratio = completedWeight / LOADING_TOTAL_WEIGHT;
                        console.log("[Loading][Progress] stepDone: " + stepName + "->" + Math.round(100 * ratio) + "%");
                        animateProgress && animateProgress(ratio);
                    }
                },
                batchDone(stepNames: string[]) {
                    for (let index = 0; index < stepNames.length; index++) {
                        completedSteps[stepNames[index]] = true;
                    }
                    let completedWeight = 0;
                    for (let index = 0; index < LOADING_STEPS.length; index++) {
                        if (completedSteps[LOADING_STEPS[index].name]) {
                            completedWeight += LOADING_STEPS[index].weight;
                        }
                    }
                    const ratio = completedWeight / LOADING_TOTAL_WEIGHT;
                    console.log("[Loading][Progress] batchDone:[" + stepNames.join(",") + "] -> " + Math.round(100 * ratio) + "%");
                    animateProgress && animateProgress(ratio);
                }
            };
        })();

        try {
            const UmpServiceClass = LoadingUmpDialogService;
            console.log("[Loading][UMP] service check hasServiceClass=" + !!UmpServiceClass + " hasUmpNode=" + !!this.umpNode + " hasAgreeBtn=" + !!this.umpBtnAgree + " hasCloseBtn=" + !!this.umpBtnClose + " umpNodeName=" + (this.umpNode ? this.umpNode.name : "null") + " umpNodeActive=" + (this.umpNode ? this.umpNode.active : "null") + " umpNodeActiveInHierarchy=" + (this.umpNode ? this.umpNode.activeInHierarchy : "null"));
            if (UmpServiceClass && this.umpNode && this.umpBtnAgree && this.umpBtnClose) {
                this.umpNode.active = false;
                console.log("[Loading][UMP] service created, set umpNode.active=false");
                umpService = new UmpServiceClass({
                    umpNode: this.umpNode,
                    umpBtnAgree: this.umpBtnAgree,
                    umpBtnClose: this.umpBtnClose,
                    onPauseLoading: () => {
                        console.log("[Loading][UMP] onPauseLoading fillRange=" + (self.img_jindu ? self.img_jindu.fillRange : "null") + " umpNodeActive=" + (self.umpNode ? self.umpNode.active : "null"));
                        self._isProgressPaused = true;
                    },
                    onResumeLoading: () => {
                        console.log("[Loading][UMP] onResumeLoading hasPendingProgress=" + self._hasPendingProgress + " fillRange=" + (self.img_jindu ? self.img_jindu.fillRange : "null") + " umpNodeActive=" + (self.umpNode ? self.umpNode.active : "null"));
                        self._isProgressPaused = false;
                        if (self._hasPendingProgress) {
                            self._hasPendingProgress = false;
                            self._realProgress = Math.max(self._realProgress, self._pendingProgressRatio);
                        }
                    }
                });
            } else if (UmpServiceClass) {
                console.warn("[Loading][UMP] 节点未配置，跳过展示。 hasUmpNode=" + !!this.umpNode + " hasAgreeBtn=" + !!this.umpBtnAgree + " hasCloseBtn=" + !!this.umpBtnClose);
            }
        } catch (error) {
            console.error("[Loading][UMP] 初始化弹窗服务失败:", error);
        }

        const doLaunch = () => {
            console.log("doLaunch", "doLaunch");
            try {
                const country = CurrencyFormatService.getCurrentCountry();
                if (country) {
                    LanguageService.setByCountryCode(country);
                }
            } catch (error) {
                console.warn("[Loading] sync country-language before launch failed:", error);
            }
            try {
                const platformBridge = PlatformBridge && PlatformBridge.default ? PlatformBridge.default : PlatformBridge;
                const clientDataStore = ClientDataStore && ClientDataStore.default ? ClientDataStore.default : ClientDataStore;
                const localCountry = clientDataStore && clientDataStore.local_country;
                const nativeBridge = platformBridge && typeof platformBridge.getNativeBridge === "function"
                    ? platformBridge.getNativeBridge()
                    : null;
                if (nativeBridge && typeof nativeBridge.initSMSdk === "function") {
                    nativeBridge.initSMSdk("MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKP9X+CjUjA2ijFyOPVAqmXPOuQl39+2KRHZZMydD/TuOEL/SzZqE9A+BT49r41twoDHp/bNc7OjTYjclIkCDp8CAwEAAQ==", localCountry);
                    console.log("[Loading] initSMSdk called country=" + localCountry);
                }
            } catch (error) {
                console.warn("[Loading] initSMSdk failed:", error);
            }
            const currentLevelId = Number(PlayerDataStore.current_arrow_level_id || 0);
            const levelRequest = currentLevelId > 0 ? { arrow_level_id: currentLevelId } : { arrow_level_id: 1 };
            console.log("[ArrowLevel] doLaunch: 请求关卡配置 req=" + JSON.stringify(levelRequest));
            LoadingHttpService.getArrowLevelConfig(levelRequest, Handler.create(null, (response: any) => {
                if (response && response.data && response.data.arrow_level) {
                    PlayerDataStore.updateArrowLevel(response.data.arrow_level);
                    console.log("[ArrowLevel] doLaunch: 关卡配置加载成功 arrow_level=" + JSON.stringify(response.data.arrow_level));
                } else {
                    console.warn("[ArrowLevel] doLaunch: 关卡配置返回数据异常 res=" + JSON.stringify(response));
                }
            }), Handler.create(null, (error: any) => {
                console.warn("[ArrowLevel] doLaunch: 关卡配置请求失败，使用本地 level 兜底 err=" + JSON.stringify(error));
            }));
            let bundleStepIndex = 0;
            const bundleSteps = ["configLoad", "archiveInit", "bundleLoad"];
            Launch.getInstance().load(launchConfig, ["lobby"], (total: number, current: number) => {
                if (bundleStepIndex < bundleSteps.length) {
                    progressTracker.stepDone(bundleSteps[bundleStepIndex]);
                    bundleStepIndex++;
                }
                if (current >= total) {
                    for (let index = bundleStepIndex; index < bundleSteps.length; index++) {
                        progressTracker.stepDone(bundleSteps[index]);
                    }
                    progressTracker.stepDone("enterScene");
                }
            });
        };

        const startBaseFlow = () => {
            runMiddleCountry(() => {
                progressTracker.stepDone("middleCountry");
                runBaseFlow(doLaunch, undefined, (stepName: string) => {
                    progressTracker.stepDone(String(stepName || "").trim());
                });
            }, null, () => {
                progressTracker.batchDone(["middleCountry", "systemConfig", "login", "gameConfig", "userInfo"]);
                doLaunch();
            }, (showUmpCallback: (agreed: boolean) => void) => {
                console.log("[Loading][UMP] onShowUmp called hasServiceInstance=" + !!umpService + " hasCallBack=" + !!showUmpCallback + " umpNodeActiveBeforeShow=" + (self.umpNode ? self.umpNode.active : "null") + " umpNodeActiveInHierarchyBeforeShow=" + (self.umpNode ? self.umpNode.activeInHierarchy : "null"));
                if (umpService && showUmpCallback) {
                    umpService.show((agreed: boolean) => {
                        console.log("[Loading][UMP] onShowUmp callback isAgree=" + agreed + " umpNodeActiveAfterChoice=" + (self.umpNode ? self.umpNode.active : "null") + " umpNodeActiveInHierarchyAfterChoice=" + (self.umpNode ? self.umpNode.activeInHierarchy : "null"));
                        showUmpCallback(agreed);
                    });
                } else {
                    console.warn("[Loading][UMP] show fallback: service/callback missing, default reject");
                    showUmpCallback && showUmpCallback(false);
                }
            });
        };

        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            let gaidResolved = false;
            let gaidTimeoutId: any = null;
            const resolveGaidWait = (reason: string) => {
                if (!gaidResolved) {
                    gaidResolved = true;
                    if (gaidTimeoutId) {
                        clearTimeout(gaidTimeoutId);
                        gaidTimeoutId = null;
                    }
                    console.log("[Loading][GAID] resolved reason=" + reason);
                    progressTracker.stepDone("waitGaid");
                    startBaseFlow();
                }
            };
            const globalWindow = window as any;
            const branch = globalWindow.branch = globalWindow.branch || {};
            const originalModuleSerialNailed = branch.moduleSerialNailed;
            branch.moduleSerialNailed = function () {
                if (typeof originalModuleSerialNailed === "function") {
                    originalModuleSerialNailed.apply(branch, arguments);
                }
                resolveGaidWait("callback");
            };
            gaidTimeoutId = setTimeout(() => {
                console.warn("[Loading][GAID] timeout 20000ms, proceed without GAID");
                resolveGaidWait("timeout");
            }, 20000);
            console.log("[Loading][GAID] waiting for moduleSerialNailed (timeout=20000ms)");
        } else {
            console.log("[Loading][GAID] non-Android, skip GAID wait");
            progressTracker.stepDone("waitGaid");
            startBaseFlow();
        }
    }

    getURLParams(): { [key: string]: string } {
        const search = window?.location?.search?.substring(1);
        const pairs = search?.split("&");
        if (!pairs || pairs.length <= 0) {
            return null;
        }
        const params: { [key: string]: string } = {};
        for (const pair of pairs) {
            const parts = pair.split("=");
            const key = parts[0];
            const value = parts[1];
            if (key && value) {
                params[key] = value;
            }
        }
        return params;
    }

    _animateProgressTo(ratio: number): void {
        if (this._isProgressPaused) {
            this._pendingProgressRatio = ratio;
            this._hasPendingProgress = true;
        } else {
            this._realProgress = Math.max(this._realProgress, Math.min(ratio, 1));
        }
    }

    updateProgressBar(total: number, current: number): void {
        this._animateProgressTo(current / total);
    }

    update(dt: number): void {
        if (!this._isProgressPaused && this.img_jindu) {
            const targetProgress = this._realProgress;
            let fillRange = this.img_jindu.fillRange || 0;
            if (fillRange < targetProgress) {
                fillRange += (targetProgress - fillRange) * Math.min(4 * dt, 1);
                if (targetProgress - fillRange < 0.002) {
                    fillRange = targetProgress;
                }
            } else {
                const maxFill = Math.min(targetProgress + 0.06, 0.99);
                if (fillRange < maxFill) {
                    fillRange += 0.025 * dt;
                    if (fillRange > maxFill) {
                        fillRange = maxFill;
                    }
                }
            }
            this.img_jindu.fillRange = fillRange;
            this.progressBar.getComponentInChildren(cc.Label).string = Math.floor(100 * fillRange) + "%";
            if (targetProgress >= 1 && fillRange >= 0.999 && !this._sceneEntering) {
                this._sceneEntering = true;
                const enterLobbyAndGame = () => {
                    UiPageAnalyticsService.trackLeave("launch_page");
                    SceneMgr.getInstance().loadScene("lobby", "lobby", () => {
                        console.log("[Loading] lobby scene loaded, open gameView");
                        UIMgr.getInstance().initLayer(Object.keys(UILayer), UILayer.Bottom);
                        if (!UIMgr.getInstance().isShow(UIDefine.gameView)) {
                            UIMgr.getInstance().show(UIDefine.gameView);
                        }
                    });
                };
                cc.assetManager.loadBundle("game", (error, bundle) => {
                    if (error || !bundle) {
                        console.warn("[Loading] game bundle load failed, still enter lobby", error);
                        enterLobbyAndGame();
                        return;
                    }
                    bundle.loadDir("prefab", (prefabErr) => {
                        if (prefabErr) {
                            console.warn("[Loading] game prefab preload failed, still enter lobby", prefabErr);
                        }
                        enterLobbyAndGame();
                    });
                });
            }
        }
    }
}

declare global {
    interface Window {
        __ARROW_ENABLE_LOG__?: boolean;
        branch?: any;
    }
}
