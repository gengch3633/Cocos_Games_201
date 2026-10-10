import AdManager from "./AdManager";
import AudioManager from "./AudioManager";
import BaseSystem from "./BaseSystem";
import { CoinfinityRideress } from "./CoinfinityRideress";
import ConfigDataSys from "./ConfigDataSys";
import EventMgr from "./EventMgr";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import GlobalDataMgr from "./GlobalDataMgr";
import GuideManager from "./GuideManager";
import Handler from "./Handler";
import NativeEventType from "./NativeEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { PoolLogger } from "./PoolLogger";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";
import PropDataSys from "./PropDataSys";
import SdkHelper from "./SdkHelper";
import SystemDataSys from "./SystemDataSys";
import { UiManager } from "./UiManage";
import frameworkManager from "./frameworkManager";
import i18n from "./i18n";
import languageUtil from "./languageUtil";

const { ccclass, property } = cc._decorator;

@ccclass("loadingCN")
export default class loadingCN extends cc.Component {
    @property(cc.Label)
    label_progress = null;

    @property(cc.Node)
    loading = null;

    @property(cc.Node)
    ball = null;

    @property(cc.Node)
    privacyPolicy = null;

    @property(cc.Label)
    versionLabel = null;

    @property(cc.Prefab)
    guideNode = null;

    @property(cc.Prefab)
    loadingMaskPrefab = null;

    @property(cc.JsonAsset)
    i18nJson = null;

    wx_code = "";
    couldTouch = true;
    hasAgree = false;
    get_middle_cfg_timer = null;
    get_oaid_timer = null;
    _sdk_init_count = 0;
    tween = null;

    start() {
        const e = this;
        this.label_progress.string = "0%";
        cc.Tween.stopAllByTarget(this.label_progress);
        cc.tween(this.label_progress).call(function () {
            return e.label_progress.string = "0%";
        }).to(5, {}, {
            onUpdate: function (t, o) {
                e.label_progress.string = Math.floor(100 * o) + "%";
            }
        }).union().repeatForever().start();
        AudioManager.getInstance().init();
        this.onGetMiddleCfg();
    }

    onGetMiddleCfg(e) {
        if (undefined === e) {
            e = "{}";
        }
        if (this.get_middle_cfg_timer) {
            clearTimeout(this.get_middle_cfg_timer);
        }
        EventMgr.ignore(NativeEventType.ON_GET_MIDDLE_CONFIG, this.onGetMiddleCfg, this);
        console.log("获取中台配置2222====", e);
        SystemDataSys.init_middle_config(e);
        this.getSystemConfig();
    }

    mapToRange(e) {
        if (e < 0) {
            e = 0;
        }
        if (e > 1) {
            e = 1;
        }
        return .09999999999999998 * e + .9;
    }

    _onPrivacyPolicy() {
        PoolNative.openURL(GameConfigurations.PRIVACY_POLICY);
    }

    touristsLogin(e) {
        const t = this;
        console.log("touristsLogin: ");
        const o = SdkHelper.requestTDId();
        const n = o ? {
            black_box: o
        } : null;
        BaseSystem.touristsLogin(n, Handler.create(this, function (res) {
            if (GameHelper.pocketed) {
                console.log("pp event: appLaunch");
                PoolWrapper.instance.onAppLauch();
                console.log("pp event: appShow");
                PoolWrapper.instance.onAppShow();
            }
            console.log("touristsLogin res: ", res);
            if (e) {
                frameworkManager.reconnectSuc();
            }
            if (101 === res.code || 102 === res.code) {
                t.loading.active = false;
                t.label_progress.string = "";
                cc.Tween.stopAllByTarget(this.label_progress);
                PageMgr.showPage("BlockPage", {
                    type: 101 === res.code ? "area" : "vpn"
                });
            } else {
                PlayerDataSys.initUserId(res.data);
                t.getGameConfig();
            }
        }), Handler.create(this, function (res) {
            if (e) {
                frameworkManager.reconnectFai();
            }
            frameworkManager.httpErr(res, function (retry) {
                t.touristsLogin(retry);
            });
        }));
    }

    onLoad() {
        const e = this;
        const t = cc.director.getPhysicsManager();
        if (t) {
            t.enabled = true;
            t.enabledAccumulator = false;
        } else {
            console.error("physicsManager is null");
        }
        const o = cc.instantiate(this.guideNode);
        cc.game.addPersistRootNode(o);
        o.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        GameHelper.instance.init();
        PageMgr.init(this.loadingMaskPrefab);
        GlobalDataMgr.setCurrentLang("CN");
        languageUtil.loadLanguage();
        i18n.init(this.i18nJson.json);
        this.label_progress.string = "";
        UiManager.addButtonListen(this.privacyPolicy, this._onPrivacyPolicy, this, null, undefined, undefined, cc.Button.Transition.NONE);
        this.loading.angle = 0;
        cc.Tween.stopAllByTarget(this.loading);
        cc.tween(this.loading).to(1.5, {
            angle: 360
        }, {
            onUpdate: function () {
                return e.ball.angle = -e.loading.angle;
            }
        }).call(function () {
            e.loading.angle = 0;
            e.ball.angle = 0;
        }).union().repeatForever().start();
        this.versionLabel.string = "v" + PoolNative.getVersion();
    }

    getUserInfo(e) {
        const t = this;
        console.log("获取玩家信息");
        BaseSystem.getUserInfo({
            is_reviewer: SystemDataSys.is_reviewer ? 1 : 0
        }, Handler.create(this, function (o) {
            console.log("getUserInfo res: ", o);
            if (o && -777 == o.code) {
                console.log("黑名单禁止玩家进入");
            } else {
                if (e) {
                    frameworkManager.reconnectSuc();
                }
                if (o && o.code > 0) {
                    const n = o.data;
                    if (n) {
                        ConfigDataSys.init(n.tables, n.user_info.city);
                        PlayerDataSys.init(n);
                        PropDataSys.init();
                        if (!SystemDataSys.reviewing_splash && !PlayerDataSys.is_new_user()) {
                            console.log("showSplashAd(0)");
                            AdManager.getInstance().showSplashAd(0);
                        }
                        if (Number(ConfigDataSys.global_ConfigMap.get("xiaozujian"))) {
                            SdkHelper.showShortcutInfo();
                        }
                        t.jumpScene();
                    }
                }
            }
        }), Handler.create(this, function (o) {
            if (e) {
                frameworkManager.reconnectFai();
            }
            frameworkManager.httpErr(o, function (retry) {
                t.getUserInfo(retry);
            });
        }));
    }

    stopMaxProgress() {
        const e = this.tween;
        if (null !== e && undefined !== e) {
            e.stop();
        }
    }

    setProgress(e) {
        const t = Math.ceil(100 * e);
        this.label_progress.string = t + "%";
    }

    checkReport() {
        const e = cc.sys.localStorage.getItem("user_LastAgreement");
        if (e) {
            BaseSystem.agreementReport({
                url: e,
                type: "user"
            });
            cc.sys.localStorage.removeItem("user_LastAgreement");
            SdkHelper.reportData("U_WATCH_RULE", {
                rule_type: "agreement"
            });
        }
        const t = cc.sys.localStorage.getItem("user_LastPrivacy");
        if (t) {
            BaseSystem.agreementReport({
                url: t,
                type: "privacy"
            });
            cc.sys.localStorage.removeItem("user_LastPrivacy");
            SdkHelper.reportData("U_WATCH_RULE", {
                rule_type: "privacy"
            });
        }
    }

    getGameConfig() {
        console.log("getGameConfig: ");
        this.getUserInfo();
    }

    redLoadScene() {
        return new Promise(function (e) {
            cc.director.preloadScene("game_main", function () {}, function () {
                return e();
            });
        });
    }

    jumpScene() {
        this.stopMaxProgress();
        this.checkReport();
        this.progressFinish();
    }

    getSystemConfig(e) {
        const t = this;
        console.log("getSystemConfig 系统配置");
        BaseSystem.getSystemConfig(Handler.create(this, function (o) {
            console.log("服务器 返回系统配置", o);
            if (e) {
                frameworkManager.reconnectSuc();
            }
            SystemDataSys.init_config(o.data);
            SdkHelper.requestSMId();
            t.touristsLogin();
        }), Handler.create(this, function (o) {
            if (e) {
                frameworkManager.reconnectFai();
            }
            frameworkManager.httpErr(o, function (retry) {
                t.getSystemConfig(retry);
            });
        }));
    }

    progressFinish() {
        const e = this;
        if (SystemDataSys.auth_type) {
            SdkHelper.ysdkLogin();
        }
        GuideManager.Instance.runTask();
        this.redLoadScene().then(function () {
            return new Promise(function (resolve) {
                cc.assetManager.loadBundle("Frame", function (t, o) {
                    const n = GameHelper.frameSDK;
                    if (null !== n && undefined !== n) {
                        n.init({
                            isDeBug: false,
                            sdkFuc: {
                                beforeOpenVideo: function (cb) {
                                    if (GameHelper.pocketed) {
                                        cb(true);
                                    } else {
                                        PageMgr.showPage("VideoAlertPage", {
                                            exitCB: cb
                                        });
                                    }
                                },
                                isReadyVideo: function () {
                                    return PoolWrapper.instance.videoReady;
                                },
                                openVideo: function (placement, listener) {
                                    PoolWrapper.instance.showVideo(placement, listener);
                                },
                                openInters: function (placement, listener) {
                                    PoolWrapper.instance.showInterstitial(placement, listener);
                                },
                                openBanner: function () {},
                                hiddenBanner: function () {},
                                isSplashReady: function () {
                                    return PoolWrapper.instance.splashReady;
                                },
                                openSplash: function (listener) {
                                    PoolWrapper.instance.showSplash(listener);
                                },
                                logCommonEvent: function (name, data) {
                                    PoolLogger.instance.logEvent(name, data);
                                },
                                earlierStageEvent: function (name, data) {
                                    CoinfinityRideress.instance.unphotographic(name, data);
                                },
                                logGameEvent: function (name, data, once) {
                                    if (undefined === once) {
                                        once = false;
                                    }
                                    PoolLogger.instance.logGameEvent(name, data, once);
                                },
                                lifeEvent: function (name) {
                                    PoolLogger.instance.logLifeEvent(name);
                                },
                                ppEvent: function (name) {
                                    PoolLogger.instance.logPPEvent(name);
                                },
                                openUrl: function (url) {
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
                                }
                            },
                            ListenKeys: {
                                FRESH_FLAG: "IS_PLAY",
                                FRESH_STRING: "CHANGE_LAN",
                                VIDEO_SUC: "AD_SUC",
                                APP_LIFECYCLE_CHANGE: "APP_LIFECYCLE_CHANGE"
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
                                    const scene = cc.director.getScene();
                                    let sceneName;
                                    if (null !== scene && undefined !== scene) {
                                        sceneName = scene.name;
                                    }
                                    switch (sceneName) {
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
                                myLanguge: "US"
                            },
                            gameFuc: {
                                openLoad: function () {
                                    PageMgr.showLoading();
                                },
                                closeLoad: function () {
                                    PageMgr.hideLoading();
                                },
                                vibrate: function (duration) {
                                    SdkHelper.setVibrator(duration);
                                }
                            },
                            gameNodeObj: {}
                        }, GameConfigurations.newBallData, i18n, function () {
                            return o.preload("Frame", cc.Prefab, function () {
                                return resolve();
                            });
                        });
                    }
                    GameHelper.instance.addFrameListener();
                });
            });
        }).then(function () {
            return new Promise(function (resolve) {
                if (null == cc.sys.localStorage.getItem("newHand")) {
                    cc.assetManager.loadBundle("newHand", function (err, bundle) {
                        bundle.load("newHand", cc.Prefab, function (loadErr, prefab) {
                            resolve(prefab);
                        });
                    });
                } else {
                    resolve(null);
                }
            });
        }).then(function (prefab) {
            return new Promise(function (resolve) {
                GameHelper.frameSDK.beforeEnterGame(function () {
                    return resolve(prefab);
                });
            });
        }).then(function (prefab) {
            cc.Tween.stopAllByTarget(e.label_progress);
            e.label_progress.string = "100%";
            cc.director.loadScene("game_main", function (err, scene) {
                if (prefab) {
                    const n = cc.instantiate(prefab);
                    n.getComponent("newHand").init(function (name, data) {
                        CoinfinityRideress.instance.unphotographic(name, data);
                    }, function (a, b, c) {
                        CoinfinityRideress.instance.actionsCybernetician(a, b, c);
                    }, function (name, data, once) {
                        PoolLogger.instance.logGameEvent(name, data, once);
                    }, function (name) {
                        PoolLogger.instance.logLifeEvent(name);
                    });
                    n.parent = scene;
                }
            });
        });
    }

    setMaxProgress(e) {
        const t = this;
        this.tween = cc.tween({
            persent: 0
        }).to(10, {
            persent: e
        }, {
            progress: function (start, end, current, ratio) {
                t.setProgress(current);
                return start + (end - start) * ratio;
            }
        }).start();
    }
}
