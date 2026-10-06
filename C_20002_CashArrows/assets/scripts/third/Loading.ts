import ConfigMgr from "./ConfigMgr";
import Launch from "./Launch";
import SceneMgr from "./SceneMgr";
import UIMgr from "./UIMgr";
import Utils from "./Utils";
import UserData from "./UserData";
import { UILayer } from "./UIDefine";
import * as LoadingProjectAdaptersBridge from "./LoadingProjectAdaptersBridge";
import UiPageAnalyticsService from "./UiPageAnalyticsService";
import AppReviewManager from "./AppReviewManager";
import LanguageService from "./LanguageService";
import CurrencyFormatService from "./CurrencyFormatService";
import LoadingUmpDialogService from "./LoadingUmpDialogService";
import LoadingHttpService from "./LoadingHttpService";
import PlayerDataStore from "./PlayerDataStore";
import Handler from "./Handler";
import PlatformBridge from "./PlatformBridge";
import ClientDataStore from "./ClientDataStore";

function isLogEnabled() {
    try {
        if ("undefined" != typeof window && true === (window as any).__ARROW_ENABLE_LOG__) return true;
    } catch (e) { }
    try {
        if ("undefined" != typeof cc && cc.sys && cc.sys.localStorage) {
            const value = cc.sys.localStorage.getItem("arrow_enable_log");
            return "1" === value || "true" === value;
        }
    } catch (e) { }
    return false;
}

(function () {
    if (!isLogEnabled()) {
        const noop = function () { };
        if ("undefined" != typeof console) {
            console.log = noop;
            console.info = noop;
            console.debug = noop;
            console.warn = noop;
            console.error = noop;
        }
        if ("undefined" != typeof cc) {
            cc.log = noop;
            cc.warn = noop;
            cc.error = noop;
        }
    }
})();

const PROGRESS_STEPS = [{
    name: " waitGaid ",
    weight: 8
}, {
    name: " middleCountry ",
    weight: 8
}, {
    name: " login ",
    weight: 8
}, {
    name: " systemConfig ",
    weight: 8
}, {
    name: " gameConfig ",
    weight: 8
}, {
    name: " userInfo ",
    weight: 8
}, {
    name: " configLoad ",
    weight: 20
}, {
    name: " archiveInit ",
    weight: 10
}, {
    name: " bundleLoad ",
    weight: 15
}, {
    name: " enterScene ",
    weight: 7
}];

let TOTAL_PROGRESS_WEIGHT = 0;
for (let index = 0; index < PROGRESS_STEPS.length; index++) TOTAL_PROGRESS_WEIGHT += PROGRESS_STEPS[index].weight;

function isInvalidBlendEnum(value: any, srcAlphaSaturate: any, srcColor: any, oneMinusSrcColor: any, dstColor: any, oneMinusDstColor: any) {
    return null == value || value === srcAlphaSaturate || value === srcColor || value === oneMinusSrcColor || value === dstColor || value === oneMinusDstColor;
}

function patchNativeSpineBlendGuard() {
    if (cc.sys && cc.sys.isNative && !(cc as any).__spineBlendGuardPatched) {
        const gfx = cc.gfx || {};
        const prototype = cc.Material && cc.Material.prototype;
        if (prototype && " function " == typeof prototype.setBlend) {
            const originalSetBlend = prototype.setBlend;
            const blendOpAdd = null != gfx.BLEND_FUNC_ADD ? gfx.BLEND_FUNC_ADD : gfx.BLEND_OP_ADD;
            const srcAlpha = null != gfx.BLEND_SRC_ALPHA ? gfx.BLEND_SRC_ALPHA : cc.macro.SRC_ALPHA;
            const oneMinusSrcAlpha = null != gfx.BLEND_ONE_MINUS_SRC_ALPHA ? gfx.BLEND_ONE_MINUS_SRC_ALPHA : cc.macro.ONE_MINUS_SRC_ALPHA;
            const blendOne = null != gfx.BLEND_ONE ? gfx.BLEND_ONE : cc.macro.ONE;
            const srcColor = null != gfx.BLEND_SRC_COLOR ? gfx.BLEND_SRC_COLOR : cc.macro.SRC_COLOR;
            const oneMinusSrcColor = null != gfx.BLEND_ONE_MINUS_SRC_COLOR ? gfx.BLEND_ONE_MINUS_SRC_COLOR : cc.macro.ONE_MINUS_SRC_COLOR;
            const dstColor = null != gfx.BLEND_DST_COLOR ? gfx.BLEND_DST_COLOR : cc.macro.DST_COLOR;
            const oneMinusDstColor = null != gfx.BLEND_ONE_MINUS_DST_COLOR ? gfx.BLEND_ONE_MINUS_DST_COLOR : cc.macro.ONE_MINUS_DST_COLOR;
            const srcAlphaSaturate = null != gfx.BLEND_SRC_ALPHA_SATURATE ? gfx.BLEND_SRC_ALPHA_SATURATE : cc.macro.SRC_ALPHA_SATURATE;
            prototype.setBlend = function (effect: any, blendOp?: any, src?: any, dst?: any, blendOpAlpha?: any, srcAlphaArg?: any, dstAlphaArg?: any, mask?: any, pass?: any) {
                null == blendOp && (blendOp = blendOpAdd);
                null == blendOpAlpha && (blendOpAlpha = blendOpAdd);
                null == src && (src = srcAlpha);
                null == dst && (dst = oneMinusSrcAlpha);
                isInvalidBlendEnum(srcAlphaArg, srcAlphaSaturate, srcColor, oneMinusSrcColor, dstColor, oneMinusDstColor) && (srcAlphaArg = blendOne);
                isInvalidBlendEnum(dstAlphaArg, srcAlphaSaturate, srcColor, oneMinusSrcColor, dstColor, oneMinusDstColor) && (dstAlphaArg = oneMinusSrcAlpha);
                null == srcAlphaArg && (srcAlphaArg = blendOne);
                null == dstAlphaArg && (dstAlphaArg = oneMinusSrcAlpha);
                null == mask && (mask = 4294967295);
                return originalSetBlend.call(this, effect, blendOp, src, dst, blendOpAlpha, srcAlphaArg, dstAlphaArg, mask, pass);
            };
            (cc as any).__spineBlendGuardPatched = true;
            console.warn("[BlendGuard] Native blend guard enabled ");
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

    _isProgressPaused: boolean = false;
    _pendingProgressRatio: number = 0;
    _hasPendingProgress: boolean = false;
    _realProgress: number = 0;
    _sceneEntering: boolean = false;

    onLoad() {
        patchNativeSpineBlendGuard();
        console.log("[Loading][UMP] onLoad hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose);
        LoadingProjectAdaptersBridge.initProjectLoadingAdapters();
        LanguageService.init();
        this.playLogoSpineOnce();
        this.init();
    }

    playLogoSpineOnce() {
        if (this.sp_logo && this.sp_logo.setAnimation) {
            try {
                const animation = this.sp_logo.defaultAnimation || " animation ";
                this.sp_logo.loop = false;
                this.sp_logo.clearTracks && this.sp_logo.clearTracks();
                this.sp_logo.setAnimation(0, animation, false);
                this.sp_logo.setCompleteListener && this.sp_logo.setCompleteListener(function () { });
            } catch (e) {
                console.warn("[Loading] play logo spine failed: ", e);
            }
        }
    }

    async ShowNoMac() {
        let allowed = true;
        const macList = await ConfigMgr.getInstance().getMackList();
        console.log(" maclist: ", macList);
        macList.forEach(function (item) {
            item.macId == UserData.getInstance().userID && (allowed = false);
        });
        allowed ? this.node_noMac.active = true : this.init();
    }

    init() {
        const self = this;
        let umpService: LoadingUmpDialogService = null;
        Utils.AddIrregularityClick();
        cc.macro.ENABLE_MULTI_TOUCH = false;
        const launchConfig: any = {
            gameName: " ",
            rewardVideo: [],
            inters: " ",
            custom: " ",
            ossUrl: " ",
            login: false,
            dataSyncToServer: false,
            report: false
        };
        if (cc.sys.isBrowser) {
            const urlParams = this.getURLParams();
            if (urlParams) {
                Object.assign(launchConfig, urlParams);
                console.log(" url params: ", urlParams);
            }
        }
        UIMgr.getInstance().initLayer(Object.keys(UILayer), UILayer.Bottom);
        AppReviewManager.getInstance().init();
        UiPageAnalyticsService.init();
        UiPageAnalyticsService.trackEnter(" launch_page ");
        LoadingProjectAdaptersBridge.initSystem();
        const progressTracker = (function (animateTo: (ratio: number) => void) {
            const completed: any = {};
            return {
                stepDone: function (stepName: string) {
                    if (!completed[stepName]) {
                        completed[stepName] = true;
                        let weight = 0;
                        for (let index = 0; index < PROGRESS_STEPS.length; index++) {
                            completed[PROGRESS_STEPS[index].name] && (weight += PROGRESS_STEPS[index].weight);
                        }
                        const ratio = weight / TOTAL_PROGRESS_WEIGHT;
                        console.log("[Loading][Progress] stepDone: " + stepName + "- > " + Math.round(100 * ratio) + "% ");
                        animateTo && animateTo(ratio);
                    }
                },
                batchDone: function (stepNames: string[]) {
                    for (let index = 0; index < stepNames.length; index++) completed[stepNames[index]] = true;
                    let weight = 0;
                    for (let index = 0; index < PROGRESS_STEPS.length; index++) {
                        completed[PROGRESS_STEPS[index].name] && (weight += PROGRESS_STEPS[index].weight);
                    }
                    const ratio = weight / TOTAL_PROGRESS_WEIGHT;
                    console.log("[Loading][Progress] batchDone:[" + stepNames.join(", ") + "]- > " + Math.round(100 * ratio) + "% ");
                    animateTo && animateTo(ratio);
                }
            };
        })(function (ratio: number) {
            self._animateProgressTo(ratio);
        });
        try {
            const UmpServiceClass = LoadingUmpDialogService;
            console.log("[Loading][UMP] service check hasServiceClass = " + !!UmpServiceClass + " hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose + " umpNodeName = " + (this.umpNode ? this.umpNode.name : " null ") + " umpNodeActive = " + (this.umpNode ? this.umpNode.active : " null ") + " umpNodeActiveInHierarchy = " + (this.umpNode ? this.umpNode.activeInHierarchy : " null "));
            if (UmpServiceClass && this.umpNode && this.umpBtnAgree && this.umpBtnClose) {
                this.umpNode.active = false;
                console.log("[Loading][UMP] service created, set umpNode.active = false ");
                umpService = new UmpServiceClass({
                    umpNode: this.umpNode,
                    umpBtnAgree: this.umpBtnAgree,
                    umpBtnClose: this.umpBtnClose,
                    onPauseLoading: function () {
                        console.log("[Loading][UMP] onPauseLoading fillRange = " + (self.img_jindu ? self.img_jindu.fillRange : " null ") + " umpNodeActive = " + (self.umpNode ? self.umpNode.active : " null "));
                        self._isProgressPaused = true;
                    },
                    onResumeLoading: function () {
                        console.log("[Loading][UMP] onResumeLoading hasPendingProgress = " + self._hasPendingProgress + " fillRange = " + (self.img_jindu ? self.img_jindu.fillRange : " null ") + " umpNodeActive = " + (self.umpNode ? self.umpNode.active : " null "));
                        self._isProgressPaused = false;
                        if (self._hasPendingProgress) {
                            self._hasPendingProgress = false;
                            self._realProgress = Math.max(self._realProgress, self._pendingProgressRatio);
                        }
                    }
                });
            } else UmpServiceClass && console.warn("[Loading][UMP] 节点未配置 ， 跳过展示 。 hasUmpNode = " + !!this.umpNode + " hasAgreeBtn = " + !!this.umpBtnAgree + " hasCloseBtn = " + !!this.umpBtnClose);
        } catch (e) {
            console.error("[Loading][UMP] 初始化弹窗服务失败: ", e);
        }
        const doLaunch = function () {
            console.log(" doLaunch ", " doLaunch ");
            try {
                const country = CurrencyFormatService.getCurrentCountry();
                country && LanguageService.setByCountryCode(country);
            } catch (e) {
                console.warn("[Loading] sync country- language before launch failed: ", e);
            }
            try {
                const platformBridge = PlatformBridge && PlatformBridge.default ? PlatformBridge.default : PlatformBridge;
                const clientStore = ClientDataStore && ClientDataStore.default ? ClientDataStore.default : ClientDataStore;
                const localCountry = clientStore && clientStore.local_country;
                const nativeBridge = platformBridge && " function " == typeof platformBridge.getNativeBridge ? platformBridge.getNativeBridge() : null;
                if (nativeBridge && " function " == typeof nativeBridge.initSMSdk) {
                    nativeBridge.initSMSdk(" MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKP9X+ CjUjA2ijFyOPVAqmXPOuQl39+ 2KRHZZMydD/ TuOEL/ SzZqE9A+ BT49r41twoDHp/ bNc7OjTYjclIkCDp8CAwEAAQ == ", localCountry);
                    console.log("[Loading] initSMSdk called country = " + localCountry);
                }
            } catch (e) {
                console.warn("[Loading] initSMSdk failed: ", e);
            }
            const currentLevel = Number(PlayerDataStore.current_arrow_level_id || 0);
            const arrowLevelReq = currentLevel > 0 ? {
                arrow_level_id: currentLevel
            } : {
                arrow_level_id: 1
            };
            console.log("[ArrowLevel] doLaunch: 请求关卡配置 req = " + JSON.stringify(arrowLevelReq));
            LoadingHttpService.getArrowLevelConfig(arrowLevelReq, Handler.create(null, function (response) {
                if (response && response.data && response.data.arrow_level) {
                    PlayerDataStore.updateArrowLevel(response.data.arrow_level);
                    console.log("[ArrowLevel] doLaunch: 关卡配置加载成功 arrow_level = " + JSON.stringify(response.data.arrow_level));
                } else console.warn("[ArrowLevel] doLaunch: 关卡配置返回数据异常 res = " + JSON.stringify(response));
            }), Handler.create(null, function (err) {
                console.warn("[ArrowLevel] doLaunch: 关卡配置请求失败 ， 使用本地 level 兜底 err = " + JSON.stringify(err));
            }));
            let configStepIndex = 0;
            const configSteps = [" configLoad ", " archiveInit ", " bundleLoad "];
            Launch.getInstance().load(launchConfig, [" lobby "], function (total: number, current: number) {
                if (configStepIndex < configSteps.length) {
                    progressTracker.stepDone(configSteps[configStepIndex]);
                    configStepIndex++;
                }
                if (current >= total) {
                    for (let index = configStepIndex; index < configSteps.length; index++) progressTracker.stepDone(configSteps[index]);
                    progressTracker.stepDone(" enterScene ");
                }
            });
        };
        const runAfterGaid = function () {
            LoadingProjectAdaptersBridge.runMiddleCountry(function () {
                progressTracker.stepDone(" middleCountry ");
                LoadingProjectAdaptersBridge.runBaseFlow(launchConfig, launchConfig, function (stepName: string) {
                    progressTracker.stepDone(stepName);
                });
            }, null, function () {
                progressTracker.batchDone([" middleCountry ", " systemConfig ", " login ", " gameConfig ", " userInfo "]);
                doLaunch();
            }, function (showUmpCallback: any) {
                console.log("[Loading][UMP] onShowUmp called hasServiceInstance = " + !!umpService + " hasCallBack = " + !!showUmpCallback + " umpNodeActiveBeforeShow = " + (self.umpNode ? self.umpNode.active : " null ") + " umpNodeActiveInHierarchyBeforeShow = " + (self.umpNode ? self.umpNode.activeInHierarchy : " null "));
                if (umpService && showUmpCallback) umpService.show(function (accepted) {
                    console.log("[Loading][UMP] onShowUmp callback isAgree = " + accepted + " umpNodeActiveAfterChoice = " + (self.umpNode ? self.umpNode.active : " null ") + " umpNodeActiveInHierarchyAfterChoice = " + (self.umpNode ? self.umpNode.activeInHierarchy : " null "));
                    showUmpCallback(accepted);
                });
                else {
                    console.warn("[Loading][UMP] show fallback: service/ callback missing, default reject ");
                    showUmpCallback && showUmpCallback(false);
                }
            });
        };
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            let gaidResolved = false;
            let gaidTimeout: any = null;
            const resolveGaid = function (reason: string) {
                if (!gaidResolved) {
                    gaidResolved = true;
                    if (gaidTimeout) {
                        clearTimeout(gaidTimeout);
                        gaidTimeout = null;
                    }
                    console.log("[Loading][GAID] resolved reason = " + reason);
                    progressTracker.stepDone(" waitGaid ");
                    runAfterGaid();
                }
            };
            const win = window as any;
            const branch = win.branch = win.branch || {};
            const originalModuleSerialNailed = branch.moduleSerialNailed;
            branch.moduleSerialNailed = function () {
                " function " == typeof originalModuleSerialNailed && originalModuleSerialNailed.apply(branch, arguments);
                resolveGaid(" callback ");
            };
            gaidTimeout = setTimeout(function () {
                console.warn("[Loading][GAID] timeout 20000ms, proceed without GAID ");
                resolveGaid(" timeout ");
            }, 2e4);
            console.log("[Loading][GAID] waiting for moduleSerialNailed(timeout = 20000ms) ");
        } else {
            console.log("[Loading][GAID] non- Android, skip GAID wait ");
            progressTracker.stepDone(" waitGaid ");
            runAfterGaid();
        }
    }

    getURLParams() {
        const search = window?.location?.search?.substring(1);
        const pairs = search?.split("& ");
        if (!pairs || pairs.length <= 0) return null;
        const params: any = {};
        for (const pair of pairs) {
            const parts = pair.split(" = ");
            const key = parts[0];
            const value = parts[1];
            key && value && (params[key] = value);
        }
        return params;
    }

    _animateProgressTo(ratio: number) {
        if (this._isProgressPaused) {
            this._pendingProgressRatio = ratio;
            this._hasPendingProgress = true;
        } else this._realProgress = Math.max(this._realProgress, Math.min(ratio, 1));
    }

    updateProgressBar(total: number, current: number) {
        this._animateProgressTo(current / total);
    }

    update(dt: number) {
        if (!this._isProgressPaused && this.img_jindu) {
            let target = this._realProgress;
            let current = this.img_jindu.fillRange || 0;
            if (current < target) target - (current += (target - current) * Math.min(4 * dt, 1)) < .002 && (current = target);
            else {
                const maxIdle = Math.min(target + .06, .99);
                current < maxIdle && (current += .025 * dt) > maxIdle && (current = maxIdle);
            }
            this.img_jindu.fillRange = current;
            this.progressBar.getComponentInChildren(cc.Label).string = Math.floor(100 * current) + "% ";
            if (target >= 1 && current >= .999 && !this._sceneEntering) {
                this._sceneEntering = true;
                cc.assetManager.loadBundle(" game ", function (err, bundle) {
                    err || bundle.loadDir(" prefab ", function () {
                        UiPageAnalyticsService.trackLeave(" launch_page ");
                        SceneMgr.getInstance().loadScene(" lobby ", " lobby ");
                    });
                });
            }
        }
    }
}
