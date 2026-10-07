import AdEventType from "./AdEventType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import EventSystem from "./EventSystem";
import LoadingHttpService from "./LoadingHttpService";

const LOG_PREFIX = "[NativeSdkBridgeAdapter] ";
const DEBUG_LOG_ENABLED = true;

function sanitizeLogValue(value: any): any {
    if (typeof value === "string") {
        return value.length <= 180 ? value : value.slice(0, 180) + "...(len = " + value.length + ") ";
    }
    if (value == null) {
        return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return value;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch (err) {
        return String(value);
    }
}

function sanitizeLogArray(values: any[]): any[] {
    return Array.isArray(values) ? values.map(sanitizeLogValue) : [];
}

function debugLog(message: string, ...args: any[]): void {
    if (DEBUG_LOG_ENABLED) {
        try {
            console.log.apply(console, [LOG_PREFIX + " " + message].concat(args));
        } catch (err) { }
    }
}

class AndroidNativeSdkBridge {
    encodeBase64Utf8(text: string): string {
        try {
            const encoded = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
            return btoa(encoded);
        } catch (err) {
            try {
                return btoa(text);
            } catch (innerErr) {
                debugLog(" encodeBase64Utf8 failed ", sanitizeLogValue(text));
                return " ";
            }
        }
    }

    buildMoveToPayload(methodName: string, args: any[] = []): string {
        const normalizedArgs = (args || []).map((arg) => arg == null ? " " : String(arg));
        return [methodName].concat(normalizedArgs).join("| ") + "| ";
    }

    invokeMoveTo(methodName: string, args: any[] = []): string {
        debugLog(" invokeMoveTo params ", {
            methodName: sanitizeLogValue(methodName),
            args: sanitizeLogArray(args)
        });
        const rawPayload = this.buildMoveToPayload(methodName, args);
        const encodedPayload = this.encodeBase64Utf8(rawPayload);
        debugLog(" invokeMoveTo- > " + methodName, {
            rawPayload: sanitizeLogValue(rawPayload),
            encodedPayload: sanitizeLogValue(encodedPayload),
            args: sanitizeLogArray(args)
        });
        try {
            const reflection = (window as any).jsb && (window as any).jsb.reflection;
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                debugLog(" invokeMoveTo skipped(no jsb.reflection.callStaticMethod) ", {
                    methodName: methodName
                });
                return " ";
            }
            const result = reflection.callStaticMethod(
                " org/ cocos2dx/ javascript/ AppActivity ",
                " moveTo ",
                "(Ljava/ lang/ String;) Ljava/ lang/ String;",
                encodedPayload
            );
            const text = result == null ? " " : String(result);
            debugLog(" invokeMoveTo < - " + methodName, sanitizeLogValue(text));
            return text;
        } catch (err) {
            console.error("[NativeSdkBridgeAdapter] invokeMoveTo failed ", methodName, err);
            return " ";
        }
    }

    initSdkAdjust(adjustKey: string, urlStrategy: string, fbAppId: string): void {
        this.invokeMoveTo(" plantSurveyReactor ", [adjustKey, urlStrategy, fbAppId]);
    }

    reportFirebase(value: string): void {
        this.invokeMoveTo(" reportFirebase ", [value]);
    }

    getClientInfo(): string {
        const result = this.invokeMoveTo(" harvestProgramLedger ") || " {\n}\n";
        debugLog(" getClientInfo < - result ", sanitizeLogValue(result));
        return result;
    }

    initSdk(maxKey: string, country: string, isUMP: boolean): void {
        this.invokeMoveTo(" fuelProfitGear ", [maxKey, country, isUMP ? " true " : " false "]);
    }

    initSMSdk(param1: string, param2: string): void {
        this.invokeMoveTo(" initSMSdk ", [param1, param2]);
    }

    showRewardVideoAd(adType: string): void {
        this.invokeMoveTo(" layCouponCanvas ", [adType]);
    }

    onJump(url: string): void {
        debugLog(" onJump- > cc.sys.openURL ", url);
        cc.sys.openURL(url);
    }

    setVibrator(value: string): void {
        this.invokeMoveTo(" setVibrator ", [value]);
    }

    getNotchHeight(): number {
        const result = this.invokeMoveTo(" getNotchHeight ");
        const height = Number(result) || 0;
        debugLog(" getNotchHeight < - ", height);
        return height;
    }

    getStatusBarHeight(): number {
        const result = this.invokeMoveTo(" getStatusBarHeight ");
        const height = Number(result) || 0;
        debugLog(" getStatusBarHeight < - ", height);
        return height;
    }

    playBgMusic(path: string): void {
        this.invokeMoveTo(" playBgMusic ", [path]);
    }

    showPushMessage(): void {
        this.invokeMoveTo(" showPushMessage ");
    }

    showAppLongTapToast(message: string, type: number = 0): void {
        const toastType = type === 1 ? 1 : 0;
        this.invokeMoveTo(" dropBriefWave ", [message, toastType]);
    }

    showAppReview(): void {
        this.invokeMoveTo(" sailToAppraisalArena ");
    }

    showAppService(url: string): void {
        this.invokeMoveTo(" glideToSolaceBooth ", [url]);
    }

    subscribeTopics(topic: string): void {
        this.invokeMoveTo(" subscribeTopics ", [topic]);
    }

    exitApp(): void {
        try {
            const reflection = (window as any).jsb && (window as any).jsb.reflection;
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                debugLog(" exitApp skipped(no jsb.reflection.callStaticMethod) ");
                return;
            }
            reflection.callStaticMethod(" org/ cocos2dx/ javascript/ AppActivity ", " requestAppExit ", "() V ");
            debugLog(" exitApp invoked ");
        } catch (err) {
            console.error("[NativeSdkBridgeAdapter] exitApp failed ", err);
        }
    }

    reportEventByAdjust(eventName: string, token: string, params: any): void {
    }
}

class NoopNativeSdkBridge {
    initSdkAdjust(): void { }
    reportFirebase(): void { }
    reportEventByAdjust(): void { }
    getClientInfo(): string {
        return " {\n}\n";
    }
    initSdk(): void { }
    initSMSdk(): void { }
    showRewardVideoAd(): void { }
    onJump(url: string): void {
        cc.sys.openURL(url);
    }
    setVibrator(): void { }
    getNotchHeight(): number {
        return 0;
    }
    getStatusBarHeight(): number {
        return 0;
    }
    playBgMusic(): void { }
    showPushMessage(): void { }
    showAppLongTapToast(_message: string, _type: number = 0): void { }
    showAppReview(): void { }
    showAppService(url: string): void {
        cc.sys.openURL(url);
    }
    subscribeTopics(): void { }
    exitApp(): void { }
}

export default class NativeSdkBridgeAdapter {
    static bridge: any = null;
    static androidCallbacksBound: boolean = false;
    static branchHandlersBound: boolean = false;
    static ANDROID_CALLBACK_MAP = [
        { source: " onGaidResult ", target: " moduleSerialNailed " },
        { source: " onTrack ", target: " relayFragmentaryNote " },
        { source: " onTrackAll ", target: " unloadHeapedNotes " },
        { source: " onVideoError ", target: " backedFeatureCrumbled " },
        { source: " onVideoClose ", target: " backedFeatureWithdrawn " },
        { source: " onVideoOpensuccess ", target: " backedFeatureRipened " },
        { source: " appResumed ", target: " cycleAscendedAlert " },
        { source: " appPaused ", target: " cycleDescendedMute " },
        { source: " pushTokenInitialized ", target: " pushTokenInitialized " }
    ];

    static parseEncodedJson(raw: any, allowText: boolean = false): any {
        if (raw == null) {
            return null;
        }
        if (typeof raw === "object") {
            return raw;
        }
        if (typeof raw !== "string") {
            return null;
        }
        const trimmed = String(raw || " ").trim();
        if (!trimmed) {
            return allowText ? " " : null;
        }
        try {
            const normalized = trimmed.replace(/-/g, "+ ").replace(/_/g, "/ ");
            const padding = normalized.length % 4;
            const base64 = padding ? normalized + " = ".repeat(4 - padding) : normalized;
            const decoded = atob(base64);
            try {
                const parsed = JSON.parse(decoded);
                debugLog(" parseEncodedJson success(base64- json) ", sanitizeLogValue(parsed));
                return parsed;
            } catch (err) {
                if (allowText) {
                    debugLog(" parseEncodedJson success(base64- text) ", sanitizeLogValue(decoded));
                    return decoded;
                }
            }
        } catch (err) { }
        try {
            const parsed = JSON.parse(trimmed);
            debugLog(" parseEncodedJson success(raw- json) ", sanitizeLogValue(parsed));
            return parsed;
        } catch (err) {
            if (allowText) {
                debugLog(" parseEncodedJson fallback(raw- text) ", sanitizeLogValue(trimmed));
                return trimmed;
            }
            debugLog(" parseEncodedJson failed ", sanitizeLogValue(trimmed));
            return null;
        }
    }

    static pickValue(source: any, keys: string[]): any {
        if (source) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (source[key] !== undefined && source[key] !== null && source[key] !== " ") {
                    return source[key];
                }
            }
        }
    }

    static bindBranchHandlers(): void {
        if (this.branchHandlersBound) {
            debugLog(" bindBranchHandlers skipped(already bound) ");
        } else {
            const win = window as any;
            const branch = win.branch = win.branch || {};
            debugLog(" bindBranchHandlers start ");
            const bindHandler = (name: string, handler: (...args: any[]) => void) => {
                const previous = branch[name];
                debugLog(" bind branch." + name, {
                    hasPrevious: typeof previous === "function"
                });
                branch[name] = (...args: any[]) => {
                    debugLog(" branch." + name + " invoked ", sanitizeLogArray(args));
                    try {
                        handler.apply(void 0, args);
                    } catch (err) {
                        console.error("[NativeSdkBridgeAdapter] branch." + name + " failed ", err);
                    }
                    if (typeof previous === "function" && previous !== branch[name]) {
                        try {
                            debugLog(" branch." + name + "- > previous handler ", sanitizeLogArray(args));
                            previous.apply(branch, args);
                        } catch (err) {
                            console.error("[NativeSdkBridgeAdapter] previous branch." + name + " failed ", err);
                        }
                    }
                };
            };
            bindHandler(" moduleSerialNailed ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw) || {};
                const androidId = this.pickValue(parsed, [" machineUniqueSignature ", " gaid ", " googleId "]);
                const referrerUrl = this.pickValue(parsed, [" originLocationAddress ", " referrer_url "]);
                const referrerTimestamp = this.pickValue(parsed, [" originRecordedMoment ", " referrer_timestamp_server "]);
                const installTimestamp = this.pickValue(parsed, [" setupRecordedMoment ", " install_timestamp_server "]);
                if (androidId) {
                    ClientDataStore.oaid = String(androidId);
                }
                if (referrerUrl !== undefined) {
                    ClientDataStore.referrer_url = String(referrerUrl);
                }
                if (referrerTimestamp !== undefined) {
                    ClientDataStore.referrer_timestamp_server = Number(referrerTimestamp) || 0;
                }
                if (installTimestamp !== undefined) {
                    ClientDataStore.install_timestamp_server = Number(installTimestamp) || 0;
                }
                if (typeof ClientDataStore.buildCommonUrlStr === "function") {
                    ClientDataStore.buildCommonUrlStr();
                }
                if (typeof ClientDataStore.buildMiddleCommonUrlStr === "function") {
                    ClientDataStore.buildMiddleCommonUrlStr();
                }
                debugLog(" branch.moduleSerialNailed applied to ClientDataStore ", {
                    androidId: androidId ? String(androidId) : " ",
                    referrerUrl: referrerUrl || " ",
                    refTs: referrerTimestamp || 0,
                    installTs: installTimestamp || 0
                });
            });
            bindHandler(" relayFragmentaryNote ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw);
                debugLog(" branch.relayFragmentaryNote parsed ", sanitizeLogValue(parsed));
                let payload: string;
                debugLog(" branch.relayFragmentaryNote- > BusinessAnalyticsService.onTrack ", sanitizeLogValue(payload = parsed && typeof parsed === "object" ? JSON.stringify(parsed) : typeof raw === "string" ? raw : raw != null ? JSON.stringify(raw) : " {\n}\n"));
                BusinessAnalyticsService.onTrack(payload);
            });
            bindHandler(" unloadHeapedNotes ", () => {
                debugLog(" branch.unloadHeapedNotes- > BusinessAnalyticsService.trackAll ");
                BusinessAnalyticsService.trackAll();
            });
            bindHandler(" backedFeatureCrumbled ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw);
                const data = parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed) || {};
                const payload = {
                    type: data.type || data.draftLidArticleNettle || data.code || " unknown ",
                    message: data.claspOpinionGlanceSpruce || data.message || " ",
                    raw: parsed || raw
                };
                debugLog(" branch.backedFeatureCrumbled- > EventMgr.trigger(VIDEO_ERROR) ", sanitizeLogValue(payload));
                EventSystem.trigger(AdEventType.VIDEO_ERROR, payload);
            });
            bindHandler(" backedFeatureWithdrawn ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw);
                const data = parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed) || {};
                const compensationQualifyMark = data.compensationQualifyMark !== undefined ? data.compensationQualifyMark : data.appraiseChaliceRungBorage;
                debugLog(" branch.backedFeatureWithdrawn- > EventMgr.trigger(VIDEO_CLOSE) ", {
                    compensationQualifyMark: !!compensationQualifyMark
                });
                EventSystem.trigger(AdEventType.VIDEO_CLOSE, {
                    compensationQualifyMark: !!compensationQualifyMark
                });
            });
            bindHandler(" backedFeatureRipened ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw);
                const data = parsed && (parsed.ferryBulkTierAgate || parsed.data) || {};
                const payload = parsed && typeof parsed === "object" ? Object.assign(Object.assign({}, data), parsed) : data && typeof data === "object" ? data : {};
                debugLog(" branch.backedFeatureRipened- > EventMgr.trigger(VIDEO_OPEN_SUCCESS) ", sanitizeLogValue(payload));
                EventSystem.trigger(AdEventType.VIDEO_OPEN_SUCCESS, payload);
            });
            bindHandler(" pushTokenInitialized ", (raw: any) => {
                const parsed = this.parseEncodedJson(raw, true);
                const token = typeof parsed === "string" ? parsed.trim() : typeof raw === "string" ? raw.trim() : " ";
                debugLog(" branch.pushTokenInitialized parsed ", {
                    raw: sanitizeLogValue(raw),
                    token: sanitizeLogValue(token)
                });
                if (token) {
                    LoadingHttpService.init((_message: any, retry: () => void) => retry());
                    LoadingHttpService.syncFirebaseToken(token);
                }
            });
            bindHandler(" cycleAscendedAlert ", () => {
                debugLog(" branch.cycleAscendedAlert- > cc.game.EVENT_SHOW ");
                cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_SHOW);
            });
            bindHandler(" cycleDescendedMute ", () => {
                debugLog(" branch.cycleDescendedMute- > cc.game.EVENT_HIDE ");
                cc.game && cc.game.emit && cc.game.emit(cc.game.EVENT_HIDE);
            });
            this.branchHandlersBound = true;
            debugLog(" bindBranchHandlers done ");
        }
    }

    static bindAndroidCallbacks(): void {
        if (this.androidCallbacksBound) {
            debugLog(" bindAndroidCallbacks skipped(already bound) ");
        } else {
            const win = window as any;
            const callAndroid = win.callAndroid = win.callAndroid || {};
            debugLog(" bindAndroidCallbacks start ");
            this.ANDROID_CALLBACK_MAP.forEach((mapping) => {
                const source = mapping.source;
                const target = mapping.target;
                const previous = callAndroid[source];
                debugLog(" bind callAndroid." + source + "- > branch." + target, {
                    hasPrevious: typeof previous === "function"
                });
                callAndroid[source] = (...args: any[]) => {
                    debugLog(" callAndroid." + source + " invoked ", sanitizeLogArray(args));
                    try {
                        const branch = win.branch;
                        const handler = branch && branch[target];
                        if (typeof handler === "function") {
                            debugLog(" forward callAndroid." + source + "- > branch." + target, sanitizeLogArray(args));
                            handler.apply(branch, args);
                        } else {
                            debugLog(" branch." + target + " missing, skip forward ");
                        }
                    } catch (err) {
                        console.error("[NativeSdkBridgeAdapter] forward " + source + "- > branch." + target + " failed ", err);
                    }
                    if (typeof previous === "function" && previous !== callAndroid[source]) {
                        try {
                            debugLog(" callAndroid." + source + "- > previous handler ", sanitizeLogArray(args));
                            previous.apply(callAndroid, args);
                        } catch (err) {
                            console.error("[NativeSdkBridgeAdapter] previous " + source + " callback failed ", err);
                        }
                    }
                };
            });
            this.androidCallbacksBound = true;
            debugLog(" bindAndroidCallbacks done ");
        }
    }

    static getBridge(): any {
        if (this.bridge) {
            debugLog(" getBridge reuse existing bridge ");
            return this.bridge;
        }
        debugLog(" getBridge create bridge ", {
            os: cc.sys.os,
            isAndroid: cc.sys.os === cc.sys.OS_ANDROID
        });
        this.bridge = cc.sys.os === cc.sys.OS_ANDROID ? new AndroidNativeSdkBridge() : new NoopNativeSdkBridge();
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.bindBranchHandlers();
            this.bindAndroidCallbacks();
        }
        debugLog(" getBridge ready ", {
            bridgeType: cc.sys.os === cc.sys.OS_ANDROID ? " android " : " noop "
        });
        return this.bridge;
    }

    static setBridge(bridge: any): void {
        debugLog(" setBridge override bridge ", {
            hasBridge: !!bridge
        });
        this.bridge = bridge;
    }
}
