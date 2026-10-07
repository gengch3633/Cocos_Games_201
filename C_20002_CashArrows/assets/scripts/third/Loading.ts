import AppReviewManager from "./AppReviewManager";
import ClientDataStore from "./ClientDataStore";
import ConfigMgr from "./ConfigMgr";
import CurrencyFormatService from "./CurrencyFormatService";
import Handler from "./Handler";
import LanguageService from "./LanguageService";
import Launch from "./Launch";
import LoadingHttpService from "./LoadingHttpService";
import * as LoadingProjectAdaptersBridge from "./LoadingProjectAdaptersBridge";
import LoadingUmpDialogService from "./LoadingUmpDialogService";
import PlatformBridge from "./PlatformBridge";
import PlayerDataStore from "./PlayerDataStore";
import SceneMgr from "./SceneMgr";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UiPageAnalyticsService from "./UiPageAnalyticsService";
import UserData from "./UserData";
import Utils from "./Utils";

declare const sp: any;

interface LoadingStep {
    name: string;
    weight: number;
}

const LOADING_STEPS: LoadingStep[] = [
    { name: "waitGaid", weight: 8 },
    { name: "middleCountry", weight: 8 },
    { name: "login", weight: 8 },
    { name: "systemConfig", weight: 8 },
    { name: "gameConfig", weight: 8 },
    { name: "userInfo", weight: 8 },
    { name: "configLoad", weight: 20 },
    { name: "archiveInit", weight: 10 },
    { name: "bundleLoad", weight: 15 },
    { name: "enterScene", weight: 7 },
];

const LOADING_TOTAL_WEIGHT = LOADING_STEPS.reduce((sum, step) => sum + step.weight, 0);

function isArrowLogEnabled(): boolean {
    try {
        if (typeof window !== "undefined" && (window as any).__ARROW_ENABLE_LOG__ === true) {
            return true;
        }
    } catch {}
    try {
        if (typeof cc !== "undefined" && cc.sys?.localStorage) {
            const value = cc.sys.localStorage.getItem("arrow_enable_log");
            return value === "1" || value === "true";
        }
    } catch {}
    return false;
}

(function suppressLogsUnlessEnabled() {
    if (isArrowLogEnabled()) {
        return;
    }
    const noop = () => {};
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
})();

function patchSpineBlendGuard(): void {
    if (!cc.sys?.isNative || (cc as any).__spineBlendGuardPatched) {
        return;
    }
    const gfx = cc.gfx || {};
    const materialProto = cc.Material?.prototype;
    if (!materialProto || typeof materialProto.setBlend !== "function") {
        return;
    }
    const originalSetBlend = materialProto.setBlend;
    const blendOpAdd = gfx.BLEND_FUNC_ADD != null ? gfx.BLEND_FUNC_ADD : gfx.BLEND_OP_ADD;
    const srcAlpha = gfx.BLEND_SRC_ALPHA != null ? gfx.BLEND_SRC_ALPHA : cc.macro.SRC_ALPHA;
    const oneMinusSrcAlpha =
        gfx.BLEND_ONE_MINUS_SRC_ALPHA != null ? gfx.BLEND_ONE_MINUS_SRC_ALPHA : cc.macro.ONE_MINUS_SRC_ALPHA;
    const one = gfx.BLEND_ONE != null ? gfx.BLEND_ONE : cc.macro.ONE;
    const srcColor = gfx.BLEND_SRC_COLOR != null ? gfx.BLEND_SRC_COLOR : cc.macro.SRC_COLOR;
    const oneMinusSrcColor =
        gfx.BLEND_ONE_MINUS_SRC_COLOR != null ? gfx.BLEND_ONE_MINUS_SRC_COLOR : cc.macro.ONE_MINUS_SRC_COLOR;
    const dstColor = gfx.BLEND_DST_COLOR != null ? gfx.BLEND_DST_COLOR : cc.macro.DST_COLOR;
    const oneMinusDstColor =
        gfx.BLEND_ONE_MINUS_DST_COLOR != null ? gfx.BLEND_ONE_MINUS_DST_COLOR : cc.macro.ONE_MINUS_DST_COLOR;
    const srcAlphaSaturate =
        gfx.BLEND_SRC_ALPHA_SATURATE != null ? gfx.BLEND_SRC_ALPHA_SATURATE : cc.macro.SRC_ALPHA_SATURATE;

    const isUnsetBlend = (value: any) =>
        value == null || value === srcColor || value === oneMinusSrcColor || value === dstColor || value === oneMinusDstColor || value === srcAlphaSaturate;

    materialProto.setBlend = function (
        this: any,
        target: any,
        blendOp: any,
        src: any,
        dst: any,
        blendOpAlpha: any,
        srcAlphaArg: any,
        dstAlphaArg: any,
        mask: any,
        blendColor: any
    ) {
        if (blendOp == null) {
            blendOp = blendOpAdd;
        }
        if (blendOpAlpha == null) {
            blendOpAlpha = blendOpAdd;
        }
        if (src == null) {
            src = srcAlpha;
        }
        if (dst == null) {
            dst = oneMinusSrcAlpha;
        }
        if (isUnsetBlend(srcAlphaArg)) {
            srcAlphaArg = one;
        }
        if (isUnsetBlend(dstAlphaArg)) {
            dstAlphaArg = oneMinusSrcAlpha;
        }
        if (srcAlphaArg == null) {
            srcAlphaArg = one;
        }
        if (dstAlphaArg == null) {
            dstAlphaArg = oneMinusSrcAlpha;
        }
        if (mask == null) {
            mask = 4294967295;
        }
        return originalSetBlend.call(this, target, blendOp, src, dst, blendOpAlpha, srcAlphaArg, dstAlphaArg, mask, blendColor);
    };
    (cc as any).__spineBlendGuardPatched = true;
    console.warn("[BlendGuard] Native blend guard enabled");
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {
    @property(sp.Skeleton)
    sp_logo: sp.Skeleton | null = null;

    @property([cc.SpriteFrame])
    sf_logoarr: cc.SpriteFrame[] = [];

    @property(cc.Node)
    node_noMac: cc.Node | null = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar | null = null;

    @property(cc.Sprite)
    img_jindu: cc.Sprite | null = null;

    @property(cc.Node)
    umpNode: cc.Node | null = null;

    @property(cc.Node)
    umpBtnAgree: cc.Node | null = null;

    @property(cc.Node)
    umpBtnClose: cc.Node | null = null;

    private _isProgressPaused = false;
    private _pendingProgressRatio = 0;
    private _hasPendingProgress = false;
    private _realProgress = 0;
    private _sceneEntering = false;

    onLoad(): void {
        patchSpineBlendGuard();
        console.log(
            "[Loading][UMP] onLoad hasUmpNode=" +
                !!this.umpNode +
                " hasAgreeBtn=" +
                !!this.umpBtnAgree +
                " hasCloseBtn=" +
                !!this.umpBtnClose
        );
        LoadingProjectAdaptersBridge.initProjectLoadingAdapters();
        LanguageService.init();
        this.playLogoSpineOnce();
        this.init();
    }

    playLogoSpineOnce(): void {
        if (!this.sp_logo?.setAnimation) {
            return;
        }
        try {
            const animation = this.sp_logo.defaultAnimation || "animation";
            this.sp_logo.loop = false;
            this.sp_logo.clearTracks?.();
            this.sp_logo.setAnimation(0, animation, false);
            this.sp_logo.setCompleteListener?.(() => {});
        } catch (err) {
            console.warn("[Loading] play logo spine failed:", err);
        }
    }

    async ShowNoMac(): Promise<void> {
        let allowed = true;
        const macList = await ConfigMgr.getInstance().getMackList();
        console.log("maclist:", macList);
        macList.forEach((item: any) => {
            if (item.macId === UserData.getInstance().userID) {
                allowed = false;
            }
        });
        if (allowed) {
            if (this.node_noMac) {
                this.node_noMac.active = true;
            }
        } else {
            this.init();
        }
    }

    init(): void {
        Utils.AddIrregularityClick();
        cc.macro.ENABLE_MULTI_TOUCH = false;

        const launchConfig: Record<string, any> = {
            gameName: "",
            rewardVideo: [],
            inters: "",
            custom: "",
            ossUrl: "",
            login: false,
            dataSyncToServer: false,
            report: false,
        };

        if (cc.sys.isBrowser) {
            const urlParams = this.getURLParams();
            if (urlParams) {
                Object.assign(launchConfig, urlParams);
                console.log("url params:", urlParams);
            }
        }

        UIMgr.getInstance().initLayer(Object.keys(UIDefine.UILayer), UIDefine.UILayer.Bottom);
        AppReviewManager.getInstance().init();
        UiPageAnalyticsService.init();
        UiPageAnalyticsService.trackEnter("launch_page");
        LoadingProjectAdaptersBridge.initSystem();

        const completedSteps: Record<string, boolean> = {};
        const progressTracker = {
            stepDone: (stepName: string) => {
                if (completedSteps[stepName]) {
                    return;
                }
                completedSteps[stepName] = true;
                let weight = 0;
                for (const step of LOADING_STEPS) {
                    if (completedSteps[step.name]) {
                        weight += step.weight;
                    }
                }
                const ratio = weight / LOADING_TOTAL_WEIGHT;
                console.log("[Loading][Progress] stepDone: " + stepName + " -> " + Math.round(100 * ratio) + "%");
                this._animateProgressTo(ratio);
            },
            batchDone: (stepNames: string[]) => {
                for (const stepName of stepNames) {
                    completedSteps[stepName] = true;
                }
                let weight = 0;
                for (const step of LOADING_STEPS) {
                    if (completedSteps[step.name]) {
                        weight += step.weight;
                    }
                }
                const ratio = weight / LOADING_TOTAL_WEIGHT;
                console.log("[Loading][Progress] batchDone: [" + stepNames.join(",") + "] -> " + Math.round(100 * ratio) + "%");
                this._animateProgressTo(ratio);
            },
        };

        let umpService: LoadingUmpDialogService | null = null;
        try {
            console.log(
                "[Loading][UMP] service check hasServiceClass=" +
                    !!LoadingUmpDialogService +
                    " hasUmpNode=" +
                    !!this.umpNode +
                    " hasAgreeBtn=" +
                    !!this.umpBtnAgree +
                    " hasCloseBtn=" +
                    !!this.umpBtnClose +
                    " umpNodeName=" +
                    (this.umpNode ? this.umpNode.name : "null") +
                    " umpNodeActive=" +
                    (this.umpNode ? this.umpNode.active : "null") +
                    " umpNodeActiveInHierarchy=" +
                    (this.umpNode ? this.umpNode.activeInHierarchy : "null")
            );
            if (LoadingUmpDialogService && this.umpNode && this.umpBtnAgree && this.umpBtnClose) {
                this.umpNode.active = false;
                console.log("[Loading][UMP] service created, set umpNode.active=false");
                umpService = new LoadingUmpDialogService({
                    umpNode: this.umpNode,
                    umpBtnAgree: this.umpBtnAgree,
                    umpBtnClose: this.umpBtnClose,
                    onPauseLoading: () => {
                        console.log(
                            "[Loading][UMP] onPauseLoading fillRange=" +
                                (this.img_jindu ? this.img_jindu.fillRange : "null") +
                                " umpNodeActive=" +
                                (this.umpNode ? this.umpNode.active : "null")
                        );
                        this._isProgressPaused = true;
                    },
                    onResumeLoading: () => {
                        console.log(
                            "[Loading][UMP] onResumeLoading hasPendingProgress=" +
                                this._hasPendingProgress +
                                " fillRange=" +
                                (this.img_jindu ? this.img_jindu.fillRange : "null") +
                                " umpNodeActive=" +
                                (this.umpNode ? this.umpNode.active : "null")
                        );
                        this._isProgressPaused = false;
                        if (this._hasPendingProgress) {
                            this._hasPendingProgress = false;
                            this._realProgress = Math.max(this._realProgress, this._pendingProgressRatio);
                        }
                    },
                });
            } else if (LoadingUmpDialogService) {
                console.warn(
                    "[Loading][UMP] 节点未配置，跳过展示。 hasUmpNode=" +
                        !!this.umpNode +
                        " hasAgreeBtn=" +
                        !!this.umpBtnAgree +
                        " hasCloseBtn=" +
                        !!this.umpBtnClose
                );
            }
        } catch (err) {
            console.error("[Loading][UMP] 初始化弹窗服务失败:", err);
        }

        const doLaunch = () => {
            console.log("doLaunch", "doLaunch");
            try {
                const country = CurrencyFormatService.getCurrentCountry();
                if (country) {
                    LanguageService.setByCountryCode(country);
                }
            } catch (err) {
                console.warn("[Loading] sync country-language before launch failed:", err);
            }
            try {
                const bridge = PlatformBridge.getNativeBridge?.();
                const country = ClientDataStore.local_country;
                if (bridge && typeof bridge.initSMSdk === "function") {
                    bridge.initSMSdk(
                        "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKP9X+CjUjA2ijFyOPVAqmXPOuQl39+2KRHZZMydD/TuOEL/SzZqE9A+BT49r41twoDHp/bNc7OjTYjclIkCDp8CAwEAAQ==",
                        country
                    );
                    console.log("[Loading] initSMSdk called country=" + country);
                }
            } catch (err) {
                console.warn("[Loading] initSMSdk failed:", err);
            }
            const levelId = Number(PlayerDataStore.current_arrow_level_id || 0);
            const req = levelId > 0 ? { arrow_level_id: levelId } : { arrow_level_id: 1 };
            console.log("[ArrowLevel] doLaunch: 请求关卡配置 req=" + JSON.stringify(req));
            LoadingHttpService.getArrowLevelConfig(
                req,
                Handler.create(null, (res: any) => {
                    if (res?.data?.arrow_level) {
                        PlayerDataStore.updateArrowLevel(res.data.arrow_level);
                        console.log("[ArrowLevel] doLaunch: 关卡配置加载成功 arrow_level=" + JSON.stringify(res.data.arrow_level));
                    } else {
                        console.warn("[ArrowLevel] doLaunch: 关卡配置返回数据异常 res=" + JSON.stringify(res));
                    }
                }),
                Handler.create(null, (err: any) => {
                    console.warn("[ArrowLevel] doLaunch: 关卡配置请求失败，使用本地 level 兜底 err=" + JSON.stringify(err));
                })
            );

            let configStepIndex = 0;
            const configSteps = ["configLoad", "archiveInit", "bundleLoad"];
            Launch.getInstance().load(launchConfig, ["lobby"], (total, current) => {
                if (configStepIndex < configSteps.length) {
                    progressTracker.stepDone(configSteps[configStepIndex]);
                    configStepIndex++;
                }
                if (current >= total) {
                    for (let i = configStepIndex; i < configSteps.length; i++) {
                        progressTracker.stepDone(configSteps[i]);
                    }
                    progressTracker.stepDone("enterScene");
                }
            });
        };

        const startMiddleFlow = () => {
            LoadingProjectAdaptersBridge.runMiddleCountry(
                () => {
                    progressTracker.stepDone("middleCountry");
                    LoadingProjectAdaptersBridge.runBaseFlow(doLaunch, doLaunch, (step) => {
                        progressTracker.stepDone(step);
                    });
                },
                null as any,
                () => {
                    progressTracker.batchDone(["middleCountry", "systemConfig", "login", "gameConfig", "userInfo"]);
                    doLaunch();
                },
                (callback) => {
                    console.log(
                        "[Loading][UMP] onShowUmp called hasServiceInstance=" +
                            !!umpService +
                            " hasCallBack=" +
                            !!callback +
                            " umpNodeActiveBeforeShow=" +
                            (this.umpNode ? this.umpNode.active : "null") +
                            " umpNodeActiveInHierarchyBeforeShow=" +
                            (this.umpNode ? this.umpNode.activeInHierarchy : "null")
                    );
                    if (umpService && callback) {
                        umpService.show((agreed) => {
                            console.log(
                                "[Loading][UMP] onShowUmp callback isAgree=" +
                                    agreed +
                                    " umpNodeActiveAfterChoice=" +
                                    (this.umpNode ? this.umpNode.active : "null") +
                                    " umpNodeActiveInHierarchyAfterChoice=" +
                                    (this.umpNode ? this.umpNode.activeInHierarchy : "null")
                            );
                            callback(agreed);
                        });
                    } else {
                        console.warn("[Loading][UMP] show fallback: service/callback missing, default reject");
                        callback?.(false);
                    }
                }
            );
        };

        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            let gaidResolved = false;
            let gaidTimeout: ReturnType<typeof setTimeout> | null = null;
            const resolveGaid = (reason: string) => {
                if (gaidResolved) {
                    return;
                }
                gaidResolved = true;
                if (gaidTimeout) {
                    clearTimeout(gaidTimeout);
                    gaidTimeout = null;
                }
                console.log("[Loading][GAID] resolved reason=" + reason);
                progressTracker.stepDone("waitGaid");
                startMiddleFlow();
            };

            const win = window as any;
            const branch = (win.branch = win.branch || {});
            const previousCallback = branch.moduleSerialNailed;
            branch.moduleSerialNailed = function (...args: any[]) {
                if (typeof previousCallback === "function") {
                    previousCallback.apply(branch, args);
                }
                resolveGaid("callback");
            };

            gaidTimeout = setTimeout(() => {
                console.warn("[Loading][GAID] timeout 20000ms, proceed without GAID");
                resolveGaid("timeout");
            }, 20000);
            console.log("[Loading][GAID] waiting for moduleSerialNailed (timeout=20000ms)");
        } else {
            console.log("[Loading][GAID] non-Android, skip GAID wait");
            progressTracker.stepDone("waitGaid");
            startMiddleFlow();
        }
    }

    getURLParams(): Record<string, string> | null {
        const search = window?.location?.search?.substring(1);
        if (!search) {
            return null;
        }
        const pairs = search.split("&");
        if (pairs.length <= 0) {
            return null;
        }
        const params: Record<string, string> = {};
        for (const pair of pairs) {
            const [key, value] = pair.split("=");
            if (key && value) {
                params[key] = value;
            }
        }
        return params;
    }

    private _animateProgressTo(ratio: number): void {
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
        if (this._isProgressPaused || !this.img_jindu) {
            return;
        }
        const target = this._realProgress;
        let current = this.img_jindu.fillRange || 0;
        if (current < target) {
            current += (target - current) * Math.min(4 * dt, 1);
            if (target - current < 0.002) {
                current = target;
            }
        } else {
            const cap = Math.min(target + 0.06, 0.99);
            if (current < cap) {
                current += 0.025 * dt;
                if (current > cap) {
                    current = cap;
                }
            }
        }
        this.img_jindu.fillRange = current;
        const label = this.progressBar?.getComponentInChildren(cc.Label);
        if (label) {
            label.string = Math.floor(100 * current) + "%";
        }
        if (target >= 1 && current >= 0.999 && !this._sceneEntering) {
            this._sceneEntering = true;
            cc.assetManager.loadBundle("game", (err, bundle) => {
                if (!err && bundle) {
                    bundle.loadDir("prefab", () => {
                        UiPageAnalyticsService.trackLeave("launch_page");
                        SceneMgr.getInstance().loadScene("lobby", "lobby");
                    });
                }
            });
        }
    }
}
