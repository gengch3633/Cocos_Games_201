import AdEventType from "./AdEventType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import EventSystem from "./EventSystem";
import LoadingHttpService from "./LoadingHttpService";

const LOG_TAG = "[NativeSdkBridgeAdapter]";
const DEBUG_LOG = true;

declare global {
    interface Window {
        branch?: { [key: string]: Function | undefined };
        callAndroid?: { [key: string]: Function | undefined };
        pilot?: NativeBridge;
    }
}

interface NativeBridge {
    initSdkAdjust(sdkKey: string, urlStrategy: string, fbAppId: string): void;
    reportFirebase(value: string): void;
    reportEventByAdjust?(eventName: string, token: string, params: any): void;
    getClientInfo(): string;
    initSdk(maxKey: string, country: string, isUMP: boolean): void;
    initSMSdk(key: string, secret: string): void;
    showRewardVideoAd(adType: string): void;
    onJump(url: string): void;
    setVibrator(enabled: string): void;
    getNotchHeight(): number;
    getStatusBarHeight(): number;
    playBgMusic(name: string): void;
    showPushMessage(): void;
    showAppLongTapToast(message: string, type?: number): void;
    showAppReview(): void;
    showAppService(url: string): void;
    subscribeTopics(topic: string): void;
    exitApp(): void;
}

function safePreview(value: any): any {
    if (typeof value === "string") {
        return value.length <= 180 ? value : value.slice(0, 180) + "...(len=" + value.length + ")";
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

function previewArgs(args: any[]): any[] {
    return Array.isArray(args) ? args.map(safePreview) : [];
}

function debugLog(message: string, ...args: any[]): void {
    if (DEBUG_LOG) {
        try {
            console.log.apply(console, [LOG_TAG + " " + message, ...args]);
        } catch (err) {
        }
    }
}

class AndroidNativeBridge implements NativeBridge {
    encodeBase64Utf8(text: string): string {
        try {
            const encoded = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });
            return btoa(encoded);
        } catch (err) {
            try {
                return btoa(text);
            } catch (innerErr) {
                debugLog("encodeBase64Utf8 failed", safePreview(text));
                return "";
            }
        }
    }

    buildMoveToPayload(methodName: string, args: any[] = []): string {
        const normalized = (args || []).map((arg) => (arg == null ? "" : String(arg)));
        return [methodName, ...normalized].join("|") + "|";
    }

    invokeMoveTo(methodName: string, args: any[] = []): string {
        debugLog("invokeMoveTo params", {
            methodName: safePreview(methodName),
            args: previewArgs(args),
        });
        const rawPayload = this.buildMoveToPayload(methodName, args);
        const encodedPayload = this.encodeBase64Utf8(rawPayload);
        debugLog("invokeMoveTo -> " + methodName, {
            rawPayload: safePreview(rawPayload),
            encodedPayload: safePreview(encodedPayload),
            args: previewArgs(args),
        });
        try {
            const reflection = (jsb as any)?.reflection;
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                debugLog("invokeMoveTo skipped(no jsb.reflection.callStaticMethod)", { methodName: methodName });
                return "";
            }
            const result = reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "moveTo",
                "(Ljava/lang/String;)Ljava/lang/String;",
                encodedPayload
            );
            const text = result == null ? "" : String(result);
            debugLog("invokeMoveTo <- " + methodName, safePreview(text));
            return text;
        } catch (err) {
            console.error("[NativeSdkBridgeAdapter] invokeMoveTo failed", methodName, err);
            return "";
        }
    }

    initSdkAdjust(sdkKey: string, urlStrategy: string, fbAppId: string): void {
        this.invokeMoveTo("plantSurveyReactor", [sdkKey, urlStrategy, fbAppId]);
    }

    reportFirebase(value: string): void {
        this.invokeMoveTo("reportFirebase", [value]);
    }

    getClientInfo(): string {
        const result = this.invokeMoveTo("harvestProgramLedger") || "{}";
        debugLog("getClientInfo <- result", safePreview(result));
        return result;
    }

    initSdk(maxKey: string, country: string, isUMP: boolean): void {
        this.invokeMoveTo("fuelProfitGear", [maxKey, country, isUMP ? "true" : "false"]);
    }

    initSMSdk(key: string, secret: string): void {
        this.invokeMoveTo("initSMSdk", [key, secret]);
    }

    showRewardVideoAd(adType: string): void {
        this.invokeMoveTo("layCouponCanvas", [adType]);
    }

    onJump(url: string): void {
        debugLog("onJump -> cc.sys.openURL", url);
        cc.sys.openURL(url);
    }

    setVibrator(enabled: string): void {
        this.invokeMoveTo("setVibrator", [enabled]);
    }

    getNotchHeight(): number {
        const value = Number(this.invokeMoveTo("getNotchHeight")) || 0;
        debugLog("getNotchHeight <-", value);
        return value;
    }

    getStatusBarHeight(): number {
        const value = Number(this.invokeMoveTo("getStatusBarHeight")) || 0;
        debugLog("getStatusBarHeight <-", value);
        return value;
    }

    playBgMusic(name: string): void {
        this.invokeMoveTo("playBgMusic", [name]);
    }

    showPushMessage(): void {
        this.invokeMoveTo("showPushMessage");
    }

    showAppLongTapToast(message: string, type = 0): void {
        const toastType = type === 1 ? 1 : 0;
        this.invokeMoveTo("dropBriefWave", [message, toastType]);
    }

    showAppReview(): void {
        this.invokeMoveTo("sailToAppraisalArena");
    }

    showAppService(url: string): void {
        this.invokeMoveTo("glideToSolaceBooth", [url]);
    }

    subscribeTopics(topic: string): void {
        this.invokeMoveTo("subscribeTopics", [topic]);
    }

    exitApp(): void {
        try {
            const reflection = (jsb as any)?.reflection;
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                debugLog("exitApp skipped(no jsb.reflection.callStaticMethod)");
                return;
            }
            reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "requestAppExit", "()V");
            debugLog("exitApp invoked");
        } catch (err) {
            console.error("[NativeSdkBridgeAdapter] exitApp failed", err);
        }
    }
}

class NoopNativeBridge implements NativeBridge {
    initSdkAdjust(): void {
    }

    reportFirebase(): void {
    }

    reportEventByAdjust(): void {
    }

    getClientInfo(): string {
        return "{}";
    }

    initSdk(): void {
    }

    initSMSdk(): void {
    }

    showRewardVideoAd(): void {
    }

    onJump(url: string): void {
        cc.sys.openURL(url);
    }

    setVibrator(): void {
    }

    getNotchHeight(): number {
        return 0;
    }

    getStatusBarHeight(): number {
        return 0;
    }

    playBgMusic(): void {
    }

    showPushMessage(): void {
    }

    showAppLongTapToast(_message: string, _type = 0): void {
    }

    showAppReview(): void {
    }

    showAppService(url: string): void {
        cc.sys.openURL(url);
    }

    subscribeTopics(): void {
    }

    exitApp(): void {
    }
}

export default class NativeSdkBridgeAdapter {
    static bridge: NativeBridge | null = null;
    static androidCallbacksBound = false;
    static branchHandlersBound = false;
    static ANDROID_CALLBACK_MAP = [
        { source: "onGaidResult", target: "moduleSerialNailed" },
        { source: "onTrack", target: "relayFragmentaryNote" },
        { source: "onTrackAll", target: "unloadHeapedNotes" },
        { source: "onVideoError", target: "backedFeatureCrumbled" },
        { source: "onVideoClose", target: "backedFeatureWithdrawn" },
        { source: "onVideoOpensuccess", target: "backedFeatureRipened" },
        { source: "appResumed", target: "cycleAscendedAlert" },
        { source: "appPaused", target: "cycleDescendedMute" },
        { source: "pushTokenInitialized", target: "pushTokenInitialized" },
    ];

    static parseEncodedJson(raw: any, allowText = false): any {
        if (raw == null) {
            return null;
        }
        if (typeof raw === "object") {
            return raw;
        }
        if (typeof raw !== "string") {
            return null;
        }
        const trimmed = String(raw || "").trim();
        if (!trimmed) {
            return allowText ? "" : null;
        }
        try {
            let normalized = trimmed.replace(/-/g, "+").replace(/_/g, "/");
            const padding = normalized.length % 4;
            if (padding) {
                normalized += "=".repeat(4 - padding);
            }
            const decoded = atob(normalized);
            try {
                const parsed = JSON.parse(decoded);
                debugLog("parseEncodedJson success(base64-json)", safePreview(parsed));
                return parsed;
            } catch (err) {
                if (allowText) {
                    debugLog("parseEncodedJson success(base64-text)", safePreview(decoded));
                    return decoded;
                }
            }
        } catch (err) {
        }
        try {
            const parsed = JSON.parse(trimmed);
            debugLog("parseEncodedJson success(raw-json)", safePreview(parsed));
            return parsed;
        } catch (err) {
            if (allowText) {
                debugLog("parseEncodedJson fallback(raw-text)", safePreview(trimmed));
                return trimmed;
            }
            debugLog("parseEncodedJson failed", safePreview(trimmed));
            return null;
        }
    }

    static pickValue(source: any, keys: string[]): any {
        if (source) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
                    return source[key];
                }
            }
        }
    }

    static bindBranchHandlers(): void {
        if (this.branchHandlersBound) {
            debugLog("bindBranchHandlers skipped(already bound)");
            return;
        }
        const globalWindow = window as Window;
        const branch = globalWindow.branch = globalWindow.branch || {};
        debugLog("bindBranchHandlers start");
        const bindHandler = (name: string, handler: Function) => {
            const previous = branch[name];
            debugLog("bind branch." + name, { hasPrevious: typeof previous === "function" });
            branch[name] = (...args: any[]) => {
                debugLog("branch." + name + " invoked", previewArgs(args));
                try {
                    handler(...args);
                } catch (err) {
                    console.error("[NativeSdkBridgeAdapter] branch." + name + " failed", err);
                }
                if (typeof previous === "function" && previous !== branch[name]) {
                    try {
                        debugLog("branch." + name + " -> previous handler", previewArgs(args));
                        previous.apply(branch, args);
                    } catch (err) {
                        console.error("[NativeSdkBridgeAdapter] previous branch." + name + " failed", err);
                    }
                }
            };
        };
        bindHandler("moduleSerialNailed", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw) || {};
            const androidId = NativeSdkBridgeAdapter.pickValue(parsed, ["machineUniqueSignature", "gaid", "googleId"]);
            const referrerUrl = NativeSdkBridgeAdapter.pickValue(parsed, ["originLocationAddress", "referrer_url"]);
            const referrerTimestamp = NativeSdkBridgeAdapter.pickValue(parsed, ["originRecordedMoment", "referrer_timestamp_server"]);
            const installTimestamp = NativeSdkBridgeAdapter.pickValue(parsed, ["setupRecordedMoment", "install_timestamp_server"]);
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
            debugLog("branch.moduleSerialNailed applied to ClientDataStore", {
                androidId: androidId ? String(androidId) : "",
                referrerUrl: referrerUrl || "",
                refTs: referrerTimestamp || 0,
                installTs: installTimestamp || 0,
            });
        });
        bindHandler("relayFragmentaryNote", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw);
            debugLog("branch.relayFragmentaryNote parsed", safePreview(parsed));
            const payload = parsed && typeof parsed === "object"
                ? JSON.stringify(parsed)
                : typeof raw === "string"
                    ? raw
                    : raw != null
                        ? JSON.stringify(raw)
                        : "{}";
            debugLog("branch.relayFragmentaryNote -> BusinessAnalyticsService.onTrack", safePreview(payload));
            BusinessAnalyticsService.onTrack(payload);
        });
        bindHandler("unloadHeapedNotes", () => {
            debugLog("branch.unloadHeapedNotes -> BusinessAnalyticsService.trackAll");
            BusinessAnalyticsService.trackAll();
        });
        bindHandler("backedFeatureCrumbled", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw);
            const data = parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed) || {};
            const payload = {
                type: data.type || data.draftLidArticleNettle || data.code || "unknown",
                message: data.claspOpinionGlanceSpruce || data.message || "",
                raw: parsed || raw,
            };
            debugLog("branch.backedFeatureCrumbled -> EventMgr.trigger(VIDEO_ERROR)", safePreview(payload));
            EventSystem.trigger(AdEventType.VIDEO_ERROR, payload);
        });
        bindHandler("backedFeatureWithdrawn", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw);
            const data = parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed) || {};
            const compensationQualifyMark = data.compensationQualifyMark !== undefined
                ? data.compensationQualifyMark
                : data.appraiseChaliceRungBorage;
            debugLog("branch.backedFeatureWithdrawn -> EventMgr.trigger(VIDEO_CLOSE)", {
                compensationQualifyMark: !!compensationQualifyMark,
            });
            EventSystem.trigger(AdEventType.VIDEO_CLOSE, {
                compensationQualifyMark: !!compensationQualifyMark,
            });
        });
        bindHandler("backedFeatureRipened", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw);
            const data = parsed && (parsed.ferryBulkTierAgate || parsed.data) || {};
            const payload = parsed && typeof parsed === "object"
                ? { ...data, ...parsed }
                : data && typeof data === "object"
                    ? data
                    : {};
            debugLog("branch.backedFeatureRipened -> EventMgr.trigger(VIDEO_OPEN_SUCCESS)", safePreview(payload));
            EventSystem.trigger(AdEventType.VIDEO_OPEN_SUCCESS, payload);
        });
        bindHandler("pushTokenInitialized", (raw: any) => {
            const parsed = NativeSdkBridgeAdapter.parseEncodedJson(raw, true);
            const token = typeof parsed === "string" ? parsed.trim() : typeof raw === "string" ? raw.trim() : "";
            debugLog("branch.pushTokenInitialized parsed", { raw: safePreview(raw), token: safePreview(token) });
            if (token) {
                LoadingHttpService.init((_reason, retryFn) => retryFn());
                LoadingHttpService.syncFirebaseToken(token, null, null);
            }
        });
        bindHandler("cycleAscendedAlert", () => {
            debugLog("branch.cycleAscendedAlert -> cc.game.EVENT_SHOW");
            cc.game?.emit?.(cc.game.EVENT_SHOW);
        });
        bindHandler("cycleDescendedMute", () => {
            debugLog("branch.cycleDescendedMute -> cc.game.EVENT_HIDE");
            cc.game?.emit?.(cc.game.EVENT_HIDE);
        });
        this.branchHandlersBound = true;
        debugLog("bindBranchHandlers done");
    }

    static bindAndroidCallbacks(): void {
        if (this.androidCallbacksBound) {
            debugLog("bindAndroidCallbacks skipped(already bound)");
            return;
        }
        const globalWindow = window as Window;
        const callAndroid = globalWindow.callAndroid = globalWindow.callAndroid || {};
        debugLog("bindAndroidCallbacks start");
        this.ANDROID_CALLBACK_MAP.forEach((mapping) => {
            const source = mapping.source;
            const target = mapping.target;
            const previous = callAndroid[source];
            debugLog("bind callAndroid." + source + " -> branch." + target, {
                hasPrevious: typeof previous === "function",
            });
            callAndroid[source] = (...args: any[]) => {
                debugLog("callAndroid." + source + " invoked", previewArgs(args));
                try {
                    const branch = globalWindow.branch;
                    const handler = branch && branch[target];
                    if (typeof handler === "function") {
                        debugLog("forward callAndroid." + source + " -> branch." + target, previewArgs(args));
                        handler.apply(branch, args);
                    } else {
                        debugLog("branch." + target + " missing, skip forward");
                    }
                } catch (err) {
                    console.error("[NativeSdkBridgeAdapter] forward " + source + " -> branch." + target + " failed", err);
                }
                if (typeof previous === "function" && previous !== callAndroid[source]) {
                    try {
                        debugLog("callAndroid." + source + " -> previous handler", previewArgs(args));
                        previous.apply(callAndroid, args);
                    } catch (err) {
                        console.error("[NativeSdkBridgeAdapter] previous " + source + " callback failed", err);
                    }
                }
            };
        });
        this.androidCallbacksBound = true;
        debugLog("bindAndroidCallbacks done");
    }

    static getBridge(): NativeBridge {
        if (this.bridge) {
            debugLog("getBridge reuse existing bridge");
            return this.bridge;
        }
        debugLog("getBridge create bridge", {
            os: cc.sys.os,
            isAndroid: cc.sys.os === cc.sys.OS_ANDROID,
        });
        this.bridge = cc.sys.os === cc.sys.OS_ANDROID ? new AndroidNativeBridge() : new NoopNativeBridge();
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.bindBranchHandlers();
            this.bindAndroidCallbacks();
        }
        debugLog("getBridge ready", {
            bridgeType: cc.sys.os === cc.sys.OS_ANDROID ? "android" : "noop",
        });
        return this.bridge;
    }

    static setBridge(bridge: NativeBridge): void {
        debugLog("setBridge override bridge", { hasBridge: !!bridge });
        this.bridge = bridge;
    }
}
