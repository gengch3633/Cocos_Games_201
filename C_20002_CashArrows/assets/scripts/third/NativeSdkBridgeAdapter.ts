import EventSystem from "./EventSystem";
import AdEventType from "./AdEventType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import LoadingHttpService from "./LoadingHttpService";

const l = "[NativeSdkBridgeAdapter] ";
let c = !0;

function u(e: any) {
    if (" string " == typeof e) return e.length <= 180 ? e : e.slice(0, 180) + "...(len = " + e.length + ") ";
    if (null == e) return e;
    if (" number " == typeof e || " boolean " == typeof e) return e;
    try {
        return JSON.parse(JSON.stringify(e));
    } catch (t) {
        return String(e);
    }
}

function d(e: any) {
    return Array.isArray(e) ? e.map(u) : [];
}

function h(e: string, ...t: any[]) {
    if (c) try {
        console.log.apply(console, [l + " " + e, ...t]);
    } catch (e) { }
}

class AndroidBridge {
    encodeBase64Utf8(e: string) {
        try {
            var t = encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function (e, t) {
                return String.fromCharCode(parseInt(t, 16));
            });
            return btoa(t);
        } catch (t) {
            try {
                return btoa(e);
            } catch (t) {
                h(" encodeBase64Utf8 failed ", u(e));
                return " ";
            }
        }
    }

    buildMoveToPayload(e: string, t?: any[]) {
        void 0 === t && (t = []);
        var i = (t || []).map(function (e) {
            return null == e ? " " : String(e);
        });
        return [e, ...i].join("| ") + "| ";
    }

    invokeMoveTo(e: string, t?: any[]) {
        void 0 === t && (t = []);
        h(" invokeMoveTo params ", {
            methodName: u(e),
            args: d(t)
        });
        var i = this.buildMoveToPayload(e, t), n = this.encodeBase64Utf8(i);
        h(" invokeMoveTo- > " + e, {
            rawPayload: u(i),
            encodedPayload: u(n),
            args: d(t)
        });
        try {
            var a = (typeof jsb !== "undefined" ? jsb : null) && (jsb as any).reflection;
            if (!a || " function " != typeof a.callStaticMethod) {
                h(" invokeMoveTo skipped(no jsb.reflection.callStaticMethod) ", {
                    methodName: e
                });
                return " ";
            }
            var o = a.callStaticMethod(" org/ cocos2dx/ javascript/ AppActivity ", " moveTo ", "(Ljava/ lang/ String; ) Ljava/ lang/ String; ", n), r = null == o ? " " : String(o);
            h(" invokeMoveTo < - " + e, u(r));
            return r;
        } catch (t) {
            console.error("[NativeSdkBridgeAdapter] invokeMoveTo failed ", e, t);
            return " ";
        }
    }

    initSdkAdjust(e: any, t: any, i: any) {
        this.invokeMoveTo(" plantSurveyReactor ", [e, t, i]);
    }

    reportFirebase(e: any) {
        this.invokeMoveTo(" reportFirebase ", [e]);
    }

    getClientInfo() {
        var e = this.invokeMoveTo(" harvestProgramLedger ") || " {\n}\n";
        h(" getClientInfo < - result ", u(e));
        return e;
    }

    initSdk(e: any, t: any, i: any) {
        this.invokeMoveTo(" fuelProfitGear ", [e, t, i ? " true " : " false "]);
    }

    initSMSdk(e: any, t: any) {
        this.invokeMoveTo(" initSMSdk ", [e, t]);
    }

    showRewardVideoAd(e: any) {
        this.invokeMoveTo(" layCouponCanvas ", [e]);
    }

    onJump(e: string) {
        h(" onJump- > cc.sys.openURL ", e);
        cc.sys.openURL(e);
    }

    setVibrator(e: any) {
        this.invokeMoveTo(" setVibrator ", [e]);
    }

    getNotchHeight() {
        var e = this.invokeMoveTo(" getNotchHeight "), t = Number(e) || 0;
        h(" getNotchHeight < - ", t);
        return t;
    }

    getStatusBarHeight() {
        var e = this.invokeMoveTo(" getStatusBarHeight "), t = Number(e) || 0;
        h(" getStatusBarHeight < - ", t);
        return t;
    }

    playBgMusic(e: any) {
        this.invokeMoveTo(" playBgMusic ", [e]);
    }

    showPushMessage() {
        this.invokeMoveTo(" showPushMessage ");
    }

    showAppLongTapToast(e: any, t?: number) {
        void 0 === t && (t = 0);
        var i = 1 === t ? 1 : 0;
        this.invokeMoveTo(" dropBriefWave ", [e, i]);
    }

    showAppReview() {
        this.invokeMoveTo(" sailToAppraisalArena ");
    }

    showAppService(e: any) {
        this.invokeMoveTo(" glideToSolaceBooth ", [e]);
    }

    subscribeTopics(e: any) {
        this.invokeMoveTo(" subscribeTopics ", [e]);
    }

    exitApp() {
        try {
            var e = (typeof jsb !== "undefined" ? jsb : null) && (jsb as any).reflection;
            if (!e || " function " != typeof e.callStaticMethod) {
                h(" exitApp skipped(no jsb.reflection.callStaticMethod) ");
                return;
            }
            e.callStaticMethod(" org/ cocos2dx/ javascript/ AppActivity ", " requestAppExit ", "() V ");
            h(" exitApp invoked ");
        } catch (e) {
            console.error("[NativeSdkBridgeAdapter] exitApp failed ", e);
        }
    }
}

class NoopBridge {
    initSdkAdjust() { }
    reportFirebase() { }
    reportEventByAdjust() { }
    getClientInfo() {
        return " {\n}\n";
    }
    initSdk() { }
    initSMSdk() { }
    showRewardVideoAd() { }
    onJump(e: string) {
        cc.sys.openURL(e);
    }
    setVibrator() { }
    getNotchHeight() {
        return 0;
    }
    getStatusBarHeight() {
        return 0;
    }
    playBgMusic() { }
    showPushMessage() { }
    showAppLongTapToast(e: any, t?: number) {
        void 0 === t && (t = 0);
    }
    showAppReview() { }
    showAppService(e: string) {
        cc.sys.openURL(e);
    }
    subscribeTopics() { }
    exitApp() { }
}

export default class NativeSdkBridgeAdapter {
    static bridge: any = null;
    static androidCallbacksBound = !1;
    static branchHandlersBound = !1;
    static ANDROID_CALLBACK_MAP = [{
        source: " onGaidResult ",
        target: " moduleSerialNailed "
    }, {
        source: " onTrack ",
        target: " relayFragmentaryNote "
    }, {
        source: " onTrackAll ",
        target: " unloadHeapedNotes "
    }, {
        source: " onVideoError ",
        target: " backedFeatureCrumbled "
    }, {
        source: " onVideoClose ",
        target: " backedFeatureWithdrawn "
    }, {
        source: " onVideoOpensuccess ",
        target: " backedFeatureRipened "
    }, {
        source: " appResumed ",
        target: " cycleAscendedAlert "
    }, {
        source: " appPaused ",
        target: " cycleDescendedMute "
    }, {
        source: " pushTokenInitialized ",
        target: " pushTokenInitialized "
    }];

    static parseEncodedJson(e: any, t?: boolean) {
        void 0 === t && (t = !1);
        if (null == e) return null;
        if (" object " == typeof e) return e;
        if (" string " != typeof e) return null;
        var i = String(e || " ").trim();
        if (!i) return t ? " " : null;
        try {
            var n = i.replace(/-/g, "+ ").replace(/_/g, "/ "), a = n.length % 4, o = a ? n + " = ".repeat(4 - a) : n, r = atob(o);
            try {
                var s = JSON.parse(r);
                h(" parseEncodedJson success(base64- json) ", u(s));
                return s;
            } catch (e) {
                if (t) {
                    h(" parseEncodedJson success(base64- text) ", u(r));
                    return r;
                }
            }
        } catch (e) { }
        try {
            var s = JSON.parse(i);
            h(" parseEncodedJson success(raw- json) ", u(s));
            return s;
        } catch (e) {
            if (t) {
                h(" parseEncodedJson fallback(raw- text) ", u(i));
                return i;
            }
            h(" parseEncodedJson failed ", u(i));
            return null;
        }
    }

    static pickValue(e: any, t: string[]) {
        if (e) for (var i = 0, n = t; i < n.length; i++) {
            var a = n[i];
            if (void 0 !== e[a] && null !== e[a] && " " !== e[a]) return e[a];
        }
    }

    static bindBranchHandlers() {
        var e = this;
        if (this.branchHandlersBound) h(" bindBranchHandlers skipped(already bound) "); else {
            var t = window as any, i = t.branch = t.branch || {};
            h(" bindBranchHandlers start ");
            var bindHandler = function (eventName: string, handler: (...args: any[]) => void) {
                var n = i[eventName];
                h(" bind branch." + eventName, {
                    hasPrevious: " function " == typeof n
                });
                i[eventName] = function () {
                    for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o];
                    h(" branch." + eventName + " invoked ", d(a));
                    try {
                        handler.apply(void 0, a);
                    } catch (t) {
                        console.error("[NativeSdkBridgeAdapter] branch." + eventName + " failed ", t);
                    }
                    if (" function " == typeof n && n !== i[eventName]) try {
                        h(" branch." + eventName + "- > previous handler ", d(a));
                        n.apply(i, a);
                    } catch (t) {
                        console.error("[NativeSdkBridgeAdapter] previous branch." + eventName + " failed ", t);
                    }
                };
            };
            bindHandler(" moduleSerialNailed ", function (t) {
                var i = e.parseEncodedJson(t) || {}, n = e.pickValue(i, [" machineUniqueSignature ", " gaid ", " googleId "]), a = e.pickValue(i, [" originLocationAddress ", " referrer_url "]), o = e.pickValue(i, [" originRecordedMoment ", " referrer_timestamp_server "]), s = e.pickValue(i, [" setupRecordedMoment ", " install_timestamp_server "]);
                n && (ClientDataStore.oaid = String(n));
                void 0 !== a && (ClientDataStore.referrer_url = String(a));
                void 0 !== o && (ClientDataStore.referrer_timestamp_server = Number(o) || 0);
                void 0 !== s && (ClientDataStore.install_timestamp_server = Number(s) || 0);
                " function " == typeof (ClientDataStore as any).buildCommonUrlStr && (ClientDataStore as any).buildCommonUrlStr();
                " function " == typeof (ClientDataStore as any).buildMiddleCommonUrlStr && (ClientDataStore as any).buildMiddleCommonUrlStr();
                h(" branch.moduleSerialNailed applied to ClientDataStore ", {
                    androidId: n ? String(n) : " ",
                    referrerUrl: a || " ",
                    refTs: o || 0,
                    installTs: s || 0
                });
            });
            bindHandler(" relayFragmentaryNote ", function (t) {
                var i = e.parseEncodedJson(t);
                h(" branch.relayFragmentaryNote parsed ", u(i));
                var n;
                h(" branch.relayFragmentaryNote- > BusinessAnalyticsService.onTrack ", u(n = i && " object " == typeof i ? JSON.stringify(i) : " string " == typeof t ? t : null != t ? JSON.stringify(t) : " {\n}\n"));
                BusinessAnalyticsService.onTrack(n);
            });
            bindHandler(" unloadHeapedNotes ", function () {
                h(" branch.unloadHeapedNotes- > BusinessAnalyticsService.trackAll ");
                BusinessAnalyticsService.trackAll();
            });
            bindHandler(" backedFeatureCrumbled ", function (t) {
                var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data || i) || {}, r = {
                    type: o.type || o.draftLidArticleNettle || o.code || " unknown ",
                    message: o.claspOpinionGlanceSpruce || o.message || " ",
                    raw: i || t
                };
                h(" branch.backedFeatureCrumbled- > EventMgr.trigger(VIDEO_ERROR) ", u(r));
                EventSystem.trigger(AdEventType.VIDEO_ERROR, r);
            });
            bindHandler(" backedFeatureWithdrawn ", function (t) {
                var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data || i) || {}, r = void 0 !== o.compensationQualifyMark ? o.compensationQualifyMark : o.appraiseChaliceRungBorage;
                h(" branch.backedFeatureWithdrawn- > EventMgr.trigger(VIDEO_CLOSE) ", {
                    compensationQualifyMark: !!r
                });
                EventSystem.trigger(AdEventType.VIDEO_CLOSE, {
                    compensationQualifyMark: !!r
                });
            });
            bindHandler(" backedFeatureRipened ", function (t) {
                var i = e.parseEncodedJson(t), o = i && (i.ferryBulkTierAgate || i.data) || {}, r = i && " object " == typeof i ? Object.assign(Object.assign({}, o), i) : o && " object " == typeof o ? o : {};
                h(" branch.backedFeatureRipened- > EventMgr.trigger(VIDEO_OPEN_SUCCESS) ", u(r));
                EventSystem.trigger(AdEventType.VIDEO_OPEN_SUCCESS, r);
            });
            bindHandler(" pushTokenInitialized ", function (t) {
                var i = e.parseEncodedJson(t, !0), n = " string " == typeof i ? i.trim() : " string " == typeof t ? t.trim() : " ";
                h(" branch.pushTokenInitialized parsed ", {
                    raw: u(t),
                    token: u(n)
                });
                if (n) {
                    LoadingHttpService.init(function (e: any, t: any) {
                        return t();
                    });
                    LoadingHttpService.syncFirebaseToken(n);
                }
            });
            bindHandler(" cycleAscendedAlert ", function () {
                h(" branch.cycleAscendedAlert- > cc.game.EVENT_SHOW ");
                cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_SHOW);
            });
            bindHandler(" cycleDescendedMute ", function () {
                h(" branch.cycleDescendedMute- > cc.game.EVENT_HIDE ");
                cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_HIDE);
            });
            this.branchHandlersBound = !0;
            h(" bindBranchHandlers done ");
        }
    }

    static bindAndroidCallbacks() {
        if (this.androidCallbacksBound) h(" bindAndroidCallbacks skipped(already bound) "); else {
            var e = window as any, t = e.callAndroid = e.callAndroid || {};
            h(" bindAndroidCallbacks start ");
            this.ANDROID_CALLBACK_MAP.forEach(function (i) {
                var n = i.source, a = i.target, o = t[n];
                h(" bind callAndroid." + n + "- > branch." + a, {
                    hasPrevious: " function " == typeof o
                });
                t[n] = function () {
                    for (var i = [], r = 0; r < arguments.length; r++) i[r] = arguments[r];
                    h(" callAndroid." + n + " invoked ", d(i));
                    try {
                        var s = e.branch, l = s && s[a];
                        if (" function " == typeof l) {
                            h(" forward callAndroid." + n + "- > branch." + a, d(i));
                            l.apply(s, i);
                        } else h(" branch." + a + " missing, skip forward ");
                    } catch (e) {
                        console.error("[NativeSdkBridgeAdapter] forward " + n + "- > branch." + a + " failed ", e);
                    }
                    if (" function " == typeof o && o !== t[n]) try {
                        h(" callAndroid." + n + "- > previous handler ", d(i));
                        o.apply(t, i);
                    } catch (e) {
                        console.error("[NativeSdkBridgeAdapter] previous " + n + " callback failed ", e);
                    }
                };
            });
            this.androidCallbacksBound = !0;
            h(" bindAndroidCallbacks done ");
        }
    }

    static getBridge() {
        if (this.bridge) {
            h(" getBridge reuse existing bridge ");
            return this.bridge;
        }
        h(" getBridge create bridge ", {
            os: cc.sys.os,
            isAndroid: cc.sys.os === cc.sys.OS_ANDROID
        });
        this.bridge = cc.sys.os === cc.sys.OS_ANDROID ? new AndroidBridge() : new NoopBridge();
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.bindBranchHandlers();
            this.bindAndroidCallbacks();
        }
        h(" getBridge ready ", {
            bridgeType: cc.sys.os === cc.sys.OS_ANDROID ? " android " : " noop "
        });
        return this.bridge;
    }

    static setBridge(e: any) {
        h(" setBridge override bridge ", {
            hasBridge: !!e
        });
        this.bridge = e;
    }
}
