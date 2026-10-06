import UserData from "./UserData";
import GEMgr from "./GEMgr";
import UserAudioData from "./UserAudioData";
import ConfigMgr from "./ConfigMgr";
import Singleton from "./Singleton";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import { RewardVideoState } from "./Platform";
import UMengManger from "./UMengManger";
import LanguageService from "./LanguageService";
import AdManager from "./AdManager";
import AdLegacyBridge from "./AdLegacyBridge";

export enum PlatformType {
    ByteDance = 0,
    WeChat = 1,
    Unknown = 2
}

class MultiPlatformInterface {
    event: any;
    adConfig: any;
    _interface: any;

    get interface() {
        return this._interface;
    }

    get byteDancePlatform() {
        return this._interface;
    }

    get weChatPlatform() {
        return this._interface;
    }

    init(e: any, t: any) {
        this.adConfig = e;
        this.event = t;
        this._interface = null;
    }

    get platformType() {
        return cc.sys.platform == cc.sys.BYTEDANCE_GAME ? PlatformType.ByteDance : cc.sys.platform == cc.sys.WECHAT_GAME || cc.sys.platform == cc.sys.WECHAT_GAME_SUB ? PlatformType.WeChat : PlatformType.Unknown;
    }
}

export default class MultiPlatform extends Singleton {
    adConfig: any;
    _multiPlatformInterface: MultiPlatformInterface;
    _userData: any;
    event: cc.EventTarget;
    skipShare: boolean;
    videoIndex: number;

    static EventType = {
        REWARED_VIDEO_SHOW: " MultiPlatform_Event_Before_Show ",
        REWARED_VIDEO_HIDE: " MultiPlatform_Event_Hide ",
        BEFORE_LOGIN: " MultiPlatform_Event_BEFORE_LOGIN ",
        LOGIN: " MultiPlatform_Event_LOGIN ",
        INIT_COMPLETE: " MultiPlatform_Event_INIT_COMPLETE ",
        OnShow: " MultiPlatform_Event_OnShow ",
        OnHide: " MultiPlatform_Event_OnHide "
    };

    constructor() {
        super();
        this.adConfig = null;
        this._multiPlatformInterface = null;
        this._userData = null;
        this.event = new cc.EventTarget();
        this.skipShare = !1;
        this.videoIndex = 1;
    }

    get multiPlatformInterface() {
        return this._multiPlatformInterface;
    }

    get platformType() {
        return this.multiPlatformInterface.platformType;
    }

    get appId() {
        var e, t, i;
        return null !== (i = null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t ? void 0 : t.appId) && void 0 !== i ? i : " ";
    }

    get userData() {
        return this._userData;
    }

    get userId() {
        var e, t;
        return null !== (t = null === (e = this._userData) || void 0 === e ? void 0 : e.id) && void 0 !== t ? t : 0;
    }

    get openId() {
        var e, t;
        return null !== (t = null === (e = this._userData) || void 0 === e ? void 0 : e.openId) && void 0 !== t ? t : null;
    }

    get vibrateEnabled() {
        return UserAudioData.getInstance().vibrate;
    }

    init(e: any) {
        e = Object.assign({}, e);
        this.adConfig = e;
        this._multiPlatformInterface = new MultiPlatformInterface();
        this._multiPlatformInterface.init(e, this.event);
        this.event.emit(MultiPlatform.EventType.INIT_COMPLETE);
    }

    showRewardedVideoAd(e: any, i: any) {
        return __awaiter(this, void 0, Promise, function () {
            var n;
            return __generator(this, function (a) {
                switch (a.label) {
                    case 0:
                        return [4, ConfigMgr.getInstance().checkMac()];

                    case 1:
                        return a.sent() ? [2, !0] : [2, new Promise(function (a) {
                            var o, r, c = n.adConfig.rewardVideo;
                            if (!c || c.length <= 0) a(!0); else {
                                UIMgr.getInstance().showWatingUI();
                                n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, e, i);
                                n.reportVideo(e, 0);
                                var u = c[n.videoIndex % c.length];
                                n.videoIndex++;
                                null === (r = null === (o = n._multiPlatformInterface) || void 0 === o ? void 0 : o.interface) || void 0 === r || r.play(u, function (o: any) {
                                    for (var r = [], c = 1; c < arguments.length; c++) r[c - 1] = arguments[c];
                                    UIMgr.getInstance().hideWatingUI();
                                    n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, e, i, o);
                                    o != RewardVideoState.PlaySuccess && o != RewardVideoState.CloseReward || n.reportVideo(e, o == RewardVideoState.PlaySuccess ? 1 : 2);
                                    if (o == RewardVideoState.CloseReward || o == RewardVideoState.Close || o == RewardVideoState.PlayErr) {
                                        cc.audioEngine.resumeMusic();
                                        cc.audioEngine.resumeAllEffects();
                                        cc.game.resume();
                                        (window as any).ZYSDK.ZYSDK.reportVideo(o == RewardVideoState.CloseReward);
                                        a(o == RewardVideoState.CloseReward);
                                        GEMgr.trackEvent(" adNode ", {
                                            adtype: e,
                                            adlevel: UserData.getInstance().level
                                        });
                                        cc.sys.isBrowser || GEMgr.ge.track(" userAction ", {
                                            action: " AD_ " + e,
                                            module: " 关卡 " + UserData.getInstance().level,
                                            isAD: 1
                                        }, new Date());
                                        (n as any).zyReportUserAction(" 关卡 " + UserData.getInstance().level, e, !0);
                                        o == RewardVideoState.PlayErr && Tips.show(LanguageService.t(" key_tip_reward_video_play_fail "));
                                    } else o == RewardVideoState.PlaySuccess && (cc.audioEngine.pauseMusic(), cc.audioEngine.pauseAllEffects(),
                                        cc.game.pause());
                                });
                            }
                        })];

                    case 2:
                        n = this;
                        return [2, new Promise(function (a) {
                            var o, r, c = n.adConfig.rewardVideo;
                            if (!c || c.length <= 0) a(!0); else {
                                UIMgr.getInstance().showWatingUI();
                                n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, e, i);
                                n.reportVideo(e, 0);
                                var u = c[n.videoIndex % c.length];
                                n.videoIndex++;
                                null === (r = null === (o = n._multiPlatformInterface) || void 0 === o ? void 0 : o.interface) || void 0 === r || r.play(u, function (o: any) {
                                    for (var r = [], c = 1; c < arguments.length; c++) r[c - 1] = arguments[c];
                                    UIMgr.getInstance().hideWatingUI();
                                    n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, e, i, o);
                                    o != RewardVideoState.PlaySuccess && o != RewardVideoState.CloseReward || n.reportVideo(e, o == RewardVideoState.PlaySuccess ? 1 : 2);
                                    if (o == RewardVideoState.CloseReward || o == RewardVideoState.Close || o == RewardVideoState.PlayErr) {
                                        cc.audioEngine.resumeMusic();
                                        cc.audioEngine.resumeAllEffects();
                                        cc.game.resume();
                                        a(o == RewardVideoState.CloseReward);
                                        GEMgr.trackEvent(" adNode ", {
                                            adtype: e,
                                            adlevel: UserData.getInstance().level
                                        });
                                        cc.sys.isBrowser || GEMgr.ge.track(" userAction ", {
                                            action: " AD_ " + e,
                                            module: " 关卡 " + UserData.getInstance().level,
                                            isAD: 1
                                        }, new Date());
                                        o == RewardVideoState.PlayErr && Tips.show(" 激励视频播放失败, 请重试 ");
                                    } else o == RewardVideoState.PlaySuccess && (cc.audioEngine.pauseMusic(), cc.audioEngine.pauseAllEffects(),
                                        cc.game.pause());
                                });
                            }
                        })];
                }
            });
        });
    }

    showRewardedVideoAdByAdManager(e: any, i: any) {
        var n = this;
        return new Promise(function (a) {
            var o = AdManager && AdManager.getInstance ? AdManager.getInstance() : null, r: any = null, c: any = null;
            if (o && "function" == typeof o.playNormalVideoAd) {
                var u = new Date().getTime() / 1e3, d = Number(o.interval || 1.5);
                if (o.lastTouchDate && u - o.lastTouchDate < d) {
                    Tips.show(" 广告点击太频繁 ");
                    a(!1);
                } else {
                    var f = !1, g = function () {
                        if (r && c) {
                            r.ignore(r.events.VIDEO_OPEN_SUCCESS, c, n);
                            c = null;
                        }
                    }, v = function (o: any, r: any, c: any) {
                        var u = o == RewardVideoState.PlaySuccess;
                        if (!f || u) {
                            if (!u) {
                                f = !0;
                                g();
                                UIMgr.getInstance().hideWatingUI();
                            }
                            n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_HIDE, e, i, o, c);
                            o != RewardVideoState.PlaySuccess && o != RewardVideoState.CloseReward || n.reportVideo(e, o == RewardVideoState.PlaySuccess ? 1 : 2);
                            if (u) {
                                cc.audioEngine.pauseMusic();
                                cc.audioEngine.pauseAllEffects();
                                cc.game.pause();
                            } else {
                                cc.audioEngine.resumeMusic();
                                cc.audioEngine.resumeAllEffects();
                                cc.game.resume();
                                a(!!r);
                                GEMgr.trackEvent(" adNode ", {
                                    adtype: e,
                                    adlevel: UserData.getInstance().level
                                });
                                cc.sys.isBrowser || GEMgr.ge.track(" userAction ", {
                                    action: " AD_ " + e,
                                    module: " 关卡 " + UserData.getInstance().level,
                                    isAD: 1
                                }, new Date());
                                o == RewardVideoState.PlayErr && Tips.show(" 激励视频播放失败, 请重试 ");
                            }
                        }
                    };
                    UIMgr.getInstance().showWatingUI();
                    n.event.emit(MultiPlatform.EventType.REWARED_VIDEO_SHOW, e, i);
                    n.reportVideo(e, 0);
                    if ((r = AdLegacyBridge ? AdLegacyBridge : null) && r.events && "function" == typeof r.listen) {
                        c = function (e: any) {
                            v(RewardVideoState.PlaySuccess, !1, e);
                        };
                        r.listen(r.events.VIDEO_OPEN_SUCCESS, c, n);
                    }
                    try {
                        o.playNormalVideoAd({
                            ad_type: e || " reward_video ",
                            force_video: !1
                        }, function (e: any) {
                            var t = !(!e || !e.compensationQualifyMark);
                            v(t ? RewardVideoState.CloseReward : RewardVideoState.Close, t, e);
                        }, function (e: any) {
                            v(RewardVideoState.PlayErr, !1, e);
                        }, " 激励视频播放失败, 请重试 ");
                    } catch (e) {
                        console.error("[MultiPlatform] playNormalVideoAd failed ", e);
                        v(RewardVideoState.PlayErr, !1, e);
                    }
                }
            } else {
                console.warn("[MultiPlatform] AdManager unavailable, fallback reward success ");
                a(!0);
            }
        });
    }

    reportVideo(e: any, t: any) {
        var i, a, o = {
            scene: e,
            state: t
        };
        console.log(" video ", o);
        UMengManger.getInstance().trackEvent(" video ", o);
        this.platformType == PlatformType.ByteDance && (null === (a = null === (i = this.multiPlatformInterface) || void 0 === i ? void 0 : i.byteDancePlatform) || void 0 === a || a.reportAnalytics(" video ", o));
    }

    reportFightStart(e: any) {
        var t, i, a = {
            level: e
        };
        console.log(" fightStart ", a);
        UMengManger.getInstance().trackEvent(" fightStart ", a);
        this.platformType == PlatformType.ByteDance && (null === (i = null === (t = this.multiPlatformInterface) || void 0 === t ? void 0 : t.byteDancePlatform) || void 0 === i || i.reportAnalytics(" fightStart ", a));
    }

    reportFightEnd(e: any, t: any) {
        var i, a, o = {
            level: e,
            iswin: t
        };
        console.log(" fightEnd ", o);
        UMengManger.getInstance().trackEvent(" fightEnd ", o);
        this.platformType == PlatformType.ByteDance && (null === (a = null === (i = this.multiPlatformInterface) || void 0 === i ? void 0 : i.byteDancePlatform) || void 0 === a || a.reportAnalytics(" fightEnd ", o));
    }

    reportTask(e: any) {
        var t, i, a = {
            taskID: e
        };
        console.log(" task ", a);
        UMengManger.getInstance().trackEvent(" task ", a);
        this.platformType == PlatformType.ByteDance && (null === (i = null === (t = this.multiPlatformInterface) || void 0 === t ? void 0 : t.byteDancePlatform) || void 0 === i || i.reportAnalytics(" task ", a));
    }

    share(e?: any) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function () {
                var t, i, a;
                return (null === (t = this._multiPlatformInterface) || void 0 === t ? void 0 : t.interface) ? this.skipShare ? [2, !0] : (e || (e = {}),
                    this.platformType == PlatformType.ByteDance && (this.adConfig.templateId || console.error(" 未配置抖音平台分享模板 "),
                        e.templateId = this.adConfig.templateId), [2, null === (a = null === (i = this._multiPlatformInterface) || void 0 === i ? void 0 : i.interface) || void 0 === a ? void 0 : a.share(e)]) : [2, !0];
            });
        });
    }

    vibrateLong() {
        var e, t;
        this.vibrateEnabled && (null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t || t.vibrateLong());
    }

    vibrateShort() {
        var e, t;
        this.vibrateEnabled && (null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t || t.vibrateShort());
    }

    setClipboardData(e: any) {
        var t, i;
        return null === (i = null === (t = this._multiPlatformInterface) || void 0 === t ? void 0 : t.interface) || void 0 === i ? void 0 : i.setClipboardData(e);
    }

    getClipboardData() {
        var e, t;
        return null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t ? void 0 : t.getClipboardData();
    }

    login() {
        var e = this;
        return new Promise(function (i) {
            var n, a, o;
            e.event.emit(MultiPlatform.EventType.BEFORE_LOGIN);
            if (null === (n = e._multiPlatformInterface) || void 0 === n ? void 0 : n.interface) null === (o = null === (a = e._multiPlatformInterface) || void 0 === a ? void 0 : a.interface) || void 0 === o || o.login().then(function (n: any) {
                if (n) {
                    e._userData = n;
                    i(!0);
                    e.event.emit(MultiPlatform.EventType.LOGIN, n);
                } else {
                    i(!1);
                    e.event.emit(MultiPlatform.EventType.LOGIN, null);
                }
            }); else {
                i(!1);
                e.event.emit(MultiPlatform.EventType.LOGIN, null);
            }
        });
    }

    quit() {
        var e, t;
        null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t || t.quit();
    }

    get uma() {
        var e, t, i;
        return null !== (i = null === (t = null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) || void 0 === t ? void 0 : t.uma) && void 0 !== i ? i : null;
    }

    getStyleByNode(e: cc.Node) {
        var t = e.convertToWorldSpaceAR(cc.v2(0, 0));
        console.log(t);
        var i = cc.view.getDevicePixelRatio(), n = cc.view.getScaleX(), a = cc.view.getScaleY(), o = cc.view.getVisibleSize().height, r = (t.x - e.height / 2) * n / i, s = (o - t.y) * a / i - e.height, l = e.width, c = e.height;
        console.log(" style ", r, s, l, c);
        return {
            left: r,
            top: s,
            width: l,
            height: c
        };
    }

    showInterstitialAd() {
        var e: any, t: any, i: any;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (n) {
                switch (n.label) {
                    case 0:
                        console.log(" showInterstitialAd ");
                        console.log(this.adConfig.inters);
                        return (null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) ? [4, null === (i = null === (t = this._multiPlatformInterface) || void 0 === t ? void 0 : t.interface) || void 0 === i ? void 0 : i.showInterstitialAd(this.adConfig.inters)] : [2, !1];

                    case 1:
                        return n.sent() ? (GEMgr.trackEvent(" adNode ", {
                            adtype: " 插屏广告 ",
                            adlevel: UserData.getInstance().level
                        }), cc.sys.isBrowser || GEMgr.ge.track(" userAction ", {
                            action: " AD_插屏广告 ",
                            module: " 关卡 " + UserData.getInstance().level,
                            isAD: 1
                        }, new Date()), [2]) : [2, !1];
                }
            });
        });
    }

    showCustomAd(e: any) {
        var t, i, n;
        (null === (t = this._multiPlatformInterface) || void 0 === t ? void 0 : t.interface) && (null === (n = null === (i = this._multiPlatformInterface) || void 0 === i ? void 0 : i.interface) || void 0 === n || n.showCustomAd(this.adConfig.custom, e));
    }

    hideCustomAd() {
        var e, t, i;
        (null === (e = this._multiPlatformInterface) || void 0 === e ? void 0 : e.interface) && (null === (i = null === (t = this._multiPlatformInterface) || void 0 === t ? void 0 : t.interface) || void 0 === i || i.hideCustomAd());
    }

    on(e: any, t: any, i: any) {
        this.event.on(e, t, i);
    }

    once(e: any, t: any, i: any) {
        this.event.once(e, t, i);
    }

    off(e: any, t: any, i: any) {
        this.event.off(e, t, i);
    }

    targetOff(e: any) {
        this.event.targetOff(e);
    }
}
