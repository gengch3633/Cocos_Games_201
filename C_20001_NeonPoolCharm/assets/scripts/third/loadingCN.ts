import PropDataSys from "./PropDataSys";
import NativeEventType from "./NativeEventType";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import i18n from "./i18n";
import { PoolLogger } from "./PoolLogger";
import AudioManager from "./AudioManager";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import SystemDataSys from "./SystemDataSys";
import GlobalDataMgr from "./GlobalDataMgr";
import EventMgr from "./EventMgr";
import Handler from "./Handler";
import frameworkManager from "./frameworkManager";
import AdManager from "./AdManager";
import SdkHelper from "./SdkHelper";
import BaseSystem from "./BaseSystem";
import languageUtil from "./languageUtil";
import GuideManager from "./GuideManager";
import { UiManager } from "./UiManage";
import { CoinfinityRideress } from "./CoinfinityRideress";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";
import PageMgr from "./PageMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class loadingCN extends cc.Component {
    @property(cc.Label)
    label_progress: cc.Label = null;
    @property(cc.Node)
    loading: cc.Node = null;
    @property(cc.Node)
    ball: cc.Node = null;
    @property(cc.Node)
    privacyPolicy: cc.Node = null;
    @property(cc.Label)
    versionLabel: cc.Label = null;
    @property(cc.Prefab)
    guideNode: cc.Prefab = null;
    @property(cc.Prefab)
    loadingMaskPrefab: cc.Prefab = null;
    @property(cc.JsonAsset)
    i18nJson: cc.JsonAsset = null;

    wx_code: string = "";
    couldTouch: boolean = true;
    hasAgree: boolean = false;
    get_middle_cfg_timer: any = null;
    get_oaid_timer: any = null;
    _sdk_init_count: number = 0;
    tween: cc.Tween<any> = null;

    start(): void {
        this.label_progress.string = "0%";
        cc.Tween.stopAllByTarget(this.label_progress);
        cc.tween(this.label_progress)
            .call(() => {
                this.label_progress.string = "0%";
            })
            .to(
                5,
                {},
                {
                    onUpdate: (_target, ratio) => {
                        this.label_progress.string = Math.floor(100 * ratio) + "%";
                    },
                }
            )
            .union()
            .repeatForever()
            .start();
        AudioManager.getInstance().init();
        this.onGetMiddleCfg();
    }

    onGetMiddleCfg(config: string = "{}"): void {
        this.get_middle_cfg_timer && clearTimeout(this.get_middle_cfg_timer);
        EventMgr.ignore(NativeEventType.ON_GET_MIDDLE_CONFIG, this.onGetMiddleCfg, this);
        console.log("获取中台配置2222====", config);
        SystemDataSys.init_middle_config(config);
        this.getSystemConfig();
    }

    mapToRange(value: number): number {
        value < 0 && (value = 0);
        value > 1 && (value = 1);
        return 0.09999999999999998 * value + 0.9;
    }

    _onPrivacyPolicy(): void {
        PoolNative.openURL(GameConfigurations.PRIVACY_POLICY);
    }

    touristsLogin(retry?: boolean): void {
        console.log("touristsLogin: ");
        const tdId = SdkHelper.requestTDId();
        const params = tdId ? { black_box: tdId } : null;
        BaseSystem.touristsLogin(
            params,
            Handler.create(this, (res: any) => {
                if (GameHelper.pocketed) {
                    console.log("pp event: appLaunch");
                    PoolWrapper.instance.onAppLauch();
                    console.log("pp event: appShow");
                    PoolWrapper.instance.onAppShow();
                }
                console.log("touristsLogin res: ", res);
                retry && frameworkManager.reconnectSuc();
                if (res.code === 101 || res.code === 102) {
                    this.loading.active = false;
                    this.label_progress.string = "";
                    cc.Tween.stopAllByTarget(this.label_progress);
                    PageMgr.showPage("BlockPage", {
                        type: res.code === 101 ? "area" : "vpn",
                    });
                } else {
                    PlayerDataSys.initUserId(res.data);
                    this.getGameConfig();
                }
            }),
            Handler.create(this, (err: any) => {
                retry && frameworkManager.reconnectFai();
                (frameworkManager as any).httpErr(err, (again: boolean) => {
                    this.touristsLogin(again);
                });
            })
        );
    }

    onLoad(): void {
        const physicsManager = cc.director.getPhysicsManager();
        if (physicsManager) {
            physicsManager.enabled = true;
            physicsManager.enabledAccumulator = false;
        } else {
            console.error("physicsManager is null");
        }
        const guideRoot = cc.instantiate(this.guideNode);
        cc.game.addPersistRootNode(guideRoot);
        guideRoot.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        GameHelper.instance.init();
        PageMgr.init(this.loadingMaskPrefab);
        GlobalDataMgr.setCurrentLang("CN");
        languageUtil.loadLanguage();
        i18n.init(this.i18nJson.json);
        this.label_progress.string = "";
        UiManager.addButtonListen(
            this.privacyPolicy,
            this._onPrivacyPolicy,
            this,
            null,
            undefined,
            undefined,
            cc.Button.Transition.NONE
        );
        this.loading.angle = 0;
        cc.Tween.stopAllByTarget(this.loading);
        cc.tween(this.loading)
            .to(
                1.5,
                { angle: 360 },
                {
                    onUpdate: () => {
                        this.ball.angle = -this.loading.angle;
                    },
                }
            )
            .call(() => {
                this.loading.angle = 0;
                this.ball.angle = 0;
            })
            .union()
            .repeatForever()
            .start();
        this.versionLabel.string = "v" + PoolNative.getVersion();
    }

    getUserInfo(retry?: boolean): void {
        console.log("获取玩家信息");
        BaseSystem.getUserInfo(
            {
                is_reviewer: SystemDataSys.is_reviewer ? 1 : 0,
            },
            Handler.create(this, (res: any) => {
                console.log("getUserInfo res: ", res);
                if (res && res.code == -777) {
                    console.log("黑名单禁止玩家进入");
                } else {
                    retry && frameworkManager.reconnectSuc();
                    if (res && res.code > 0) {
                        const data = res.data;
                        if (data) {
                            ConfigDataSys.init(data.tables, data.user_info.city);
                            PlayerDataSys.init(data);
                            PropDataSys.init();
                            if (!SystemDataSys.reviewing_splash && !PlayerDataSys.is_new_user()) {
                                console.log("showSplashAd(0)");
                                AdManager.getInstance().showSplashAd(0);
                            }
                            if (Number(ConfigDataSys.global_ConfigMap.get("xiaozujian"))) {
                                SdkHelper.showShortcutInfo();
                            }
                            this.jumpScene();
                        }
                    }
                }
            }),
            Handler.create(this, (err: any) => {
                retry && frameworkManager.reconnectFai();
                (frameworkManager as any).httpErr(err, (again: boolean) => {
                    this.getUserInfo(again);
                });
            })
        );
    }

    stopMaxProgress(): void {
        this.tween?.stop();
    }

    setProgress(value: number): void {
        const percent = Math.ceil(100 * value);
        this.label_progress.string = percent + "%";
    }

    checkReport(): void {
        const lastAgreement = cc.sys.localStorage.getItem("user_LastAgreement");
        if (lastAgreement) {
            BaseSystem.agreementReport({
                url: lastAgreement,
                type: "user",
            });
            cc.sys.localStorage.removeItem("user_LastAgreement");
            SdkHelper.reportData("U_WATCH_RULE", {
                rule_type: "agreement",
            });
        }
        const lastPrivacy = cc.sys.localStorage.getItem("user_LastPrivacy");
        if (lastPrivacy) {
            BaseSystem.agreementReport({
                url: lastPrivacy,
                type: "privacy",
            });
            cc.sys.localStorage.removeItem("user_LastPrivacy");
            SdkHelper.reportData("U_WATCH_RULE", {
                rule_type: "privacy",
            });
        }
    }

    getGameConfig(): void {
        console.log("getGameConfig: ");
        this.getUserInfo();
    }

    redLoadScene(): Promise<void> {
        return new Promise((resolve) => {
            cc.director.preloadScene("game_main", () => {}, () => resolve());
        });
    }

    jumpScene(): void {
        this.stopMaxProgress();
        this.checkReport();
        this.progressFinish();
    }

    getSystemConfig(retry?: boolean): void {
        console.log("getSystemConfig 系统配置");
        BaseSystem.getSystemConfig(
            Handler.create(this, (res: any) => {
                console.log("服务器 返回系统配置", res);
                retry && frameworkManager.reconnectSuc();
                SystemDataSys.init_config(res.data);
                SdkHelper.requestSMId();
                this.touristsLogin();
            }),
            Handler.create(this, (err: any) => {
                retry && frameworkManager.reconnectFai();
                (frameworkManager as any).httpErr(err, (again: boolean) => {
                    this.getSystemConfig(again);
                });
            })
        );
    }

    progressFinish(): void {
        if (SystemDataSys.auth_type) {
            SdkHelper.ysdkLogin();
        }
        GuideManager.Instance.runTask();
        this.redLoadScene()
            .then(() => {
                return new Promise<void>((resolve) => {
                    cc.assetManager.loadBundle("Frame", (_err, bundle) => {
                        GameHelper.frameSDK?.init(
                            {
                                isDeBug: false,
                                sdkFuc: {
                                    beforeOpenVideo(exitCB: (ok: boolean) => void) {
                                        GameHelper.pocketed
                                            ? exitCB(true)
                                            : PageMgr.showPage("VideoAlertPage", { exitCB });
                                    },
                                    isReadyVideo() {
                                        return PoolWrapper.instance.videoReady;
                                    },
                                    openVideo(placement: string, callback: () => void) {
                                        PoolWrapper.instance.showVideo(placement, callback);
                                    },
                                    openInters(placement: string, callback: () => void) {
                                        PoolWrapper.instance.showInterstitial(placement, callback);
                                    },
                                    openBanner() {},
                                    hiddenBanner() {},
                                    isSplashReady() {
                                        return PoolWrapper.instance.splashReady;
                                    },
                                    openSplash(callback: () => void) {
                                        PoolWrapper.instance.showSplash(callback);
                                    },
                                    logCommonEvent(name: string, data: any) {
                                        PoolLogger.instance.logEvent(name, data);
                                    },
                                    earlierStageEvent(name: string, data: any) {
                                        CoinfinityRideress.instance.unphotographic(name, data);
                                    },
                                    logGameEvent(name: string, data: any, force?: boolean) {
                                        PoolLogger.instance.logGameEvent(name, data, force);
                                    },
                                    lifeEvent(name: string) {
                                        PoolLogger.instance.logLifeEvent(name);
                                    },
                                    ppEvent(name: string) {
                                        PoolLogger.instance.logPPEvent(name);
                                    },
                                    openUrl(url: string) {
                                        PoolNative.openURL(url);
                                    },
                                    get gaid() {
                                        return PoolNative.gaid;
                                    },
                                    get inviteCode() {
                                        return PoolWrapper.instance.hardCode;
                                    },
                                    get countryCode() {
                                        return GameHelper.countryCode;
                                    },
                                },
                                ListenKeys: {
                                    FRESH_FLAG: "IS_PLAY",
                                    FRESH_STRING: "CHANGE_LAN",
                                    VIDEO_SUC: "AD_SUC",
                                    APP_LIFECYCLE_CHANGE: "APP_LIFECYCLE_CHANGE",
                                },
                                gameData: {
                                    get passLevel() {
                                        return PlayerDataSys.level_pass;
                                    },
                                    get currentRound() {
                                        return PlayerDataSys.level_info.level_b;
                                    },
                                    get totalRound() {
                                        return PlayerDataSys.level_info.roundCount;
                                    },
                                    get currentTurn() {
                                        return PlayerDataSys.level_info.level_c;
                                    },
                                    get totalTurn() {
                                        return PlayerDataSys.level_info.turnCount;
                                    },
                                    get currentLevelInfo() {
                                        return PlayerDataSys.level_info;
                                    },
                                    get currentScene() {
                                        switch (cc.director.getScene()?.name) {
                                            case "game_main":
                                                return "home";
                                            case "game_tabel":
                                                return "game";
                                            default:
                                                return "loading";
                                        }
                                    },
                                    get noProfitAd() {
                                        return !GameHelper.pocketed;
                                    },
                                    isSound: AudioManager.getInstance().getAudioState(),
                                    myLanguge: "US",
                                },
                                gameFuc: {
                                    openLoad() {
                                        PageMgr.showLoading();
                                    },
                                    closeLoad() {
                                        PageMgr.hideLoading();
                                    },
                                    vibrate(duration: number) {
                                        SdkHelper.setVibrator(duration);
                                    },
                                },
                                gameNodeObj: {},
                            },
                            GameConfigurations.newBallData,
                            i18n,
                            () => {
                                bundle.preload("Frame", cc.Prefab, () => resolve());
                            }
                        );
                        GameHelper.instance.addFrameListener();
                    });
                });
            })
            .then(() => {
                return new Promise<cc.Prefab>((resolve) => {
                    if (cc.sys.localStorage.getItem("newHand") == null) {
                        cc.assetManager.loadBundle("newHand", (_err, bundle) => {
                            bundle.load("newHand", cc.Prefab, (_loadErr, prefab) => {
                                resolve(prefab);
                            });
                        });
                    } else {
                        resolve(null);
                    }
                });
            })
            .then((newHandPrefab) => {
                return new Promise<cc.Prefab>((resolve) => {
                    GameHelper.frameSDK.beforeEnterGame(() => resolve(newHandPrefab));
                });
            })
            .then((newHandPrefab) => {
                cc.Tween.stopAllByTarget(this.label_progress);
                this.label_progress.string = "100%";
                cc.director.loadScene("game_main", (_err, scene) => {
                    if (newHandPrefab) {
                        const newHandNode = cc.instantiate(newHandPrefab);
                        newHandNode.getComponent("newHand").init(
                            (name: string, data: any) => {
                                CoinfinityRideress.instance.unphotographic(name, data);
                            },
                            (name: string, data: any, force?: boolean) => {
                                CoinfinityRideress.instance.actionsCybernetician(name, data, force);
                            },
                            (name: string, data: any, force?: boolean) => {
                                PoolLogger.instance.logGameEvent(name, data, force);
                            },
                            (name: string) => {
                                PoolLogger.instance.logLifeEvent(name);
                            }
                        );
                        newHandNode.parent = scene;
                    }
                });
            });
    }

    setMaxProgress(target: number): void {
        this.tween = cc
            .tween({ persent: 0 })
            .to(
                10,
                { persent: target },
                {
                    progress: (start, end, _current, ratio) => {
                        this.setProgress(end);
                        return start + (end - start) * ratio;
                    },
                }
            )
            .start();
    }
}
