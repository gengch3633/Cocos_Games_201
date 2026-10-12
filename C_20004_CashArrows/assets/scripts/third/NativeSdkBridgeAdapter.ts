import AdEventType from "./AdEventType";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import EventSystem from "./EventSystem";
import LoadingHttpService from "./LoadingHttpService";

const LOG_TAG = "[NativeSdkBridgeAdapter]";
const DEBUG_LOG: boolean = true;

type NativeSdkArg = string | number | boolean | null | undefined;

interface IAndroidCallbackMapping {
    source: string;
    target: string;
}

function sanitizeLogValue(value: any): any {
    if (typeof value === "string") {
        return value.length <= 180 ? value : value.slice(0, 180) + "...(len=" + value.length + ")";
    }
    if (value === null || value === undefined) {
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

function sanitizeLogArgs(args: any[]): any[] {
    return Array.isArray(args) ? args.map((arg: any): any => sanitizeLogValue(arg)) : [];
}

function logDebug(message: string, ...args: any[]): void {
    if (!DEBUG_LOG) {
        return;
    }
    try {
        console.log(LOG_TAG + " " + message, ...args);
    } catch (err) {}
}

function getJsbReflection(): any {
    const jsbRef = (window as any).jsb;
    return jsbRef && jsbRef.reflection ? jsbRef.reflection : null;
}

export interface INativeSdkBridge {
    initSdkAdjust(appId: NativeSdkArg, channel: NativeSdkArg, extra: NativeSdkArg): void;
    reportFirebase(eventName: string): void;
    reportEventByAdjust?(eventName: string): void;
    getClientInfo(): string;
    initSdk(appId: NativeSdkArg, channel: NativeSdkArg, isDebug?: boolean): void;
    initSMSdk(appKey: string, appSecret: string): void;
    showRewardVideoAd(placementId: string): void;
    onJump(url: string): void;
    setVibrator(value: NativeSdkArg): void;
    getNotchHeight(): number;
    getStatusBarHeight(): number;
    playBgMusic(value: NativeSdkArg): void;
    showPushMessage(): void;
    showAppLongTapToast(message: string, type?: number): void;
    showAppReview(): void;
    showAppService(url: string): void;
    subscribeTopics(topics: string): void;
    exitApp(): void;
}

class AndroidSdkBridgeAdapter implements INativeSdkBridge {
    public encodeBase64Utf8(raw: string): string {
        try {
            const escaped = encodeURIComponent(raw).replace(/%([0-9A-F]{2})/g, (_match: string, hex: string): string => {
                return String.fromCharCode(parseInt(hex, 16));
            });
            return btoa(escaped);
        } catch (err) {
            try {
                return btoa(raw);
            } catch (err2) {
                logDebug("encodeBase64Utf8 failed", sanitizeLogValue(raw));
                return "";
            }
        }
    }

    public buildMoveToPayload(methodName: string, args: NativeSdkArg[] = []): string {
        const normalizedArgs = (args || []).map((arg: NativeSdkArg): string => {
            return arg === null || arg === undefined ? "" : String(arg);
        });
        return [methodName].concat(normalizedArgs).join("|") + "|";
    }

    public invokeMoveTo(methodName: string, args: NativeSdkArg[] = []): string {
        logDebug("invokeMoveTo params", {
            methodName: sanitizeLogValue(methodName),
            args: sanitizeLogArgs(args)
        });

        const rawPayload = this.buildMoveToPayload(methodName, args);
        const encodedPayload = this.encodeBase64Utf8(rawPayload);

        logDebug("invokeMoveTo -> " + methodName, {
            rawPayload: sanitizeLogValue(rawPayload),
            encodedPayload: sanitizeLogValue(encodedPayload),
            args: sanitizeLogArgs(args)
        });

        try {
            const reflection = getJsbReflection();
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                logDebug("invokeMoveTo skipped(no jsb.reflection.callStaticMethod)", {
                    methodName: methodName
                });
                return "";
            }
            const result = reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "moveTo",
                "(Ljava/lang/String;)Ljava/lang/String;",
                encodedPayload
            );
            const resultText = result === null || result === undefined ? "" : String(result);
            logDebug("invokeMoveTo <- " + methodName, sanitizeLogValue(resultText));
            return resultText;
        } catch (err) {
            console.error(LOG_TAG + " invokeMoveTo failed", methodName, err);
            return "";
        }
    }

    public initSdkAdjust(appId: NativeSdkArg, channel: NativeSdkArg, extra: NativeSdkArg): void {
        this.invokeMoveTo("plantSurveyReactor", [appId, channel, extra]);
    }

    public reportFirebase(eventName: string): void {
        this.invokeMoveTo("reportFirebase", [eventName]);
    }

    public getClientInfo(): string {
        const result = this.invokeMoveTo("harvestProgramLedger") || "{}";
        logDebug("getClientInfo <- result", sanitizeLogValue(result));
        return result;
    }

    public initSdk(appId: NativeSdkArg, channel: NativeSdkArg, isDebug?: boolean): void {
        this.invokeMoveTo("fuelProfitGear", [appId, channel, isDebug ? "true" : "false"]);
    }

    public initSMSdk(appKey: string, appSecret: string): void {
        this.invokeMoveTo("initSMSdk", [appKey, appSecret]);
    }

    public showRewardVideoAd(placementId: string): void {
        this.invokeMoveTo("layCouponCanvas", [placementId]);
    }

    public onJump(url: string): void {
        logDebug("onJump -> cc.sys.openURL", url);
        cc.sys.openURL(url);
    }

    public setVibrator(value: NativeSdkArg): void {
        this.invokeMoveTo("setVibrator", [value]);
    }

    public getNotchHeight(): number {
        const result = this.invokeMoveTo("getNotchHeight");
        const height = Number(result) || 0;
        logDebug("getNotchHeight <-", height);
        return height;
    }

    public getStatusBarHeight(): number {
        const result = this.invokeMoveTo("getStatusBarHeight");
        const height = Number(result) || 0;
        logDebug("getStatusBarHeight <-", height);
        return height;
    }

    public playBgMusic(value: NativeSdkArg): void {
        this.invokeMoveTo("playBgMusic", [value]);
    }

    public showPushMessage(): void {
        this.invokeMoveTo("showPushMessage");
    }

    public showAppLongTapToast(message: string, type: number = 0): void {
        const nativeType = type === 1 ? 1 : 0;
        this.invokeMoveTo("dropBriefWave", [message, nativeType]);
    }

    public showAppReview(): void {
        this.invokeMoveTo("sailToAppraisalArena");
    }

    public showAppService(url: string): void {
        this.invokeMoveTo("glideToSolaceBooth", [url]);
    }

    public subscribeTopics(topics: string): void {
        this.invokeMoveTo("subscribeTopics", [topics]);
    }

    public exitApp(): void {
        try {
            const reflection = getJsbReflection();
            if (!reflection || typeof reflection.callStaticMethod !== "function") {
                logDebug("exitApp skipped(no jsb.reflection.callStaticMethod)");
                return;
            }
            reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "requestAppExit", "()V");
            logDebug("exitApp invoked");
        } catch (err) {
            console.error(LOG_TAG + " exitApp failed", err);
        }
    }
}

class NoopSdkBridgeAdapter implements INativeSdkBridge {
    public initSdkAdjust(_appId: NativeSdkArg, _channel: NativeSdkArg, _extra: NativeSdkArg): void {}

    public reportFirebase(_eventName: string): void {}

    public reportEventByAdjust(_eventName: string): void {}

    public getClientInfo(): string {
        return "{}";
    }

    public initSdk(_appId: NativeSdkArg, _channel: NativeSdkArg, _isDebug?: boolean): void {}

    public initSMSdk(_appKey: string, _appSecret: string): void {}

    public showRewardVideoAd(_placementId: string): void {}

    public onJump(url: string): void {
        cc.sys.openURL(url);
    }

    public setVibrator(_value: NativeSdkArg): void {}

    public getNotchHeight(): number {
        return 0;
    }

    public getStatusBarHeight(): number {
        return 0;
    }

    public playBgMusic(_value: NativeSdkArg): void {}

    public showPushMessage(): void {}

    public showAppLongTapToast(_message: string, _type: number = 0): void {}

    public showAppReview(): void {}

    public showAppService(url: string): void {
        cc.sys.openURL(url);
    }

    public subscribeTopics(_topics: string): void {}

    public exitApp(): void {}
}

export default class NativeSdkBridgeAdapter {
    private static bridge: INativeSdkBridge | null = null;

    private static androidCallbacksBound = false;

    private static branchHandlersBound = false;

    private static readonly ANDROID_CALLBACK_MAP: IAndroidCallbackMapping[] = [
        { source: "onGaidResult", target: "moduleSerialNailed" },
        { source: "onTrack", target: "relayFragmentaryNote" },
        { source: "onTrackAll", target: "unloadHeapedNotes" },
        { source: "onVideoError", target: "backedFeatureCrumbled" },
        { source: "onVideoClose", target: "backedFeatureWithdrawn" },
        { source: "onVideoOpensuccess", target: "backedFeatureRipened" },
        { source: "appResumed", target: "cycleAscendedAlert" },
        { source: "appPaused", target: "cycleDescendedMute" },
        { source: "pushTokenInitialized", target: "pushTokenInitialized" }
    ];

    public static parseEncodedJson(encoded: any, allowText: boolean = false): any {
        if (encoded === null || encoded === undefined) {
            return null;
        }
        if (typeof encoded === "object") {
            return encoded;
        }
        if (typeof encoded !== "string") {
            return null;
        }

        const text = String(encoded || "").trim();
        if (!text) {
            return allowText ? "" : null;
        }

        try {
            const normalized = text.replace(/-/g, "+").replace(/_/g, "/");
            const padding = normalized.length % 4;
            const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
            const decoded = atob(padded);
            try {
                const parsedJson = JSON.parse(decoded);
                logDebug("parseEncodedJson success(base64-json)", sanitizeLogValue(parsedJson));
                return parsedJson;
            } catch (err) {
                if (allowText) {
                    logDebug("parseEncodedJson success(base64-text)", sanitizeLogValue(decoded));
                    return decoded;
                }
            }
        } catch (err) {}

        try {
            const parsedJson = JSON.parse(text);
            logDebug("parseEncodedJson success(raw-json)", sanitizeLogValue(parsedJson));
            return parsedJson;
        } catch (err) {
            if (allowText) {
                logDebug("parseEncodedJson fallback(raw-text)", sanitizeLogValue(text));
                return text;
            }
            logDebug("parseEncodedJson failed", sanitizeLogValue(text));
            return null;
        }
    }

    public static pickValue(source: any, keys: string[]): any {
        if (!source) {
            return undefined;
        }
        for (const key of keys) {
            const value = source[key];
            if (value !== undefined && value !== null && value !== "") {
                return value;
            }
        }
        return undefined;
    }

    public static bindBranchHandlers(): void {
        if (this.branchHandlersBound) {
            logDebug("bindBranchHandlers skipped(already bound)");
            return;
        }

        const win = window as any;
        const branch = (win.branch = win.branch || {});
        logDebug("bindBranchHandlers start");

        const bindHandler = (handlerName: string, handler: (...args: any[]) => void): void => {
            const previousHandler = branch[handlerName];
            logDebug("bind branch." + handlerName, {
                hasPrevious: typeof previousHandler === "function"
            });

            branch[handlerName] = (...args: any[]): void => {
                logDebug("branch." + handlerName + " invoked", sanitizeLogArgs(args));
                try {
                    handler.apply(void 0, args);
                } catch (err) {
                    console.error(LOG_TAG + " branch." + handlerName + " failed", err);
                }
                if (typeof previousHandler === "function" && previousHandler !== branch[handlerName]) {
                    try {
                        logDebug("branch." + handlerName + " -> previous handler", sanitizeLogArgs(args));
                        previousHandler.apply(branch, args);
                    } catch (err) {
                        console.error(LOG_TAG + " previous branch." + handlerName + " failed", err);
                    }
                }
            };
        };

        bindHandler("moduleSerialNailed", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw) || {};
            const androidId = this.pickValue(parsed, ["machineUniqueSignature", "gaid", "googleId"]);
            const referrerUrl = this.pickValue(parsed, ["originLocationAddress", "referrer_url"]);
            const referrerTimestamp = this.pickValue(parsed, ["originRecordedMoment", "referrer_timestamp_server"]);
            const installTimestamp = this.pickValue(parsed, ["setupRecordedMoment", "install_timestamp_server"]);

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

            logDebug("branch.moduleSerialNailed applied to ClientDataStore", {
                androidId: androidId ? String(androidId) : "",
                referrerUrl: referrerUrl || "",
                refTs: referrerTimestamp || 0,
                installTs: installTimestamp || 0
            });
        });

        bindHandler("relayFragmentaryNote", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw);
            logDebug("branch.relayFragmentaryNote parsed", sanitizeLogValue(parsed));
            const trackData = parsed && typeof parsed === "object"
                ? JSON.stringify(parsed)
                : typeof raw === "string"
                    ? raw
                    : raw !== null && raw !== undefined
                        ? JSON.stringify(raw)
                        : "{}";
            logDebug("branch.relayFragmentaryNote -> BusinessAnalyticsService.onTrack", sanitizeLogValue(trackData));
            BusinessAnalyticsService.onTrack(trackData);
        });

        bindHandler("unloadHeapedNotes", (): void => {
            logDebug("branch.unloadHeapedNotes -> BusinessAnalyticsService.trackAll");
            BusinessAnalyticsService.trackAll();
        });

        bindHandler("backedFeatureCrumbled", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw);
            const errorData = (parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed)) || {};
            const videoError = {
                type: errorData.type || errorData.draftLidArticleNettle || errorData.code || "unknown",
                message: errorData.claspOpinionGlanceSpruce || errorData.message || "",
                raw: parsed || raw
            };
            logDebug("branch.backedFeatureCrumbled -> EventMgr.trigger(VIDEO_ERROR)", sanitizeLogValue(videoError));
            EventSystem.trigger(AdEventType.VIDEO_ERROR, videoError);
        });

        bindHandler("backedFeatureWithdrawn", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw);
            const resultData = (parsed && (parsed.ferryBulkTierAgate || parsed.data || parsed)) || {};
            const compensationQualifyMark = resultData.compensationQualifyMark !== undefined
                ? resultData.compensationQualifyMark
                : resultData.appraiseChaliceRungBorage;
            const videoClosePayload = {
                compensationQualifyMark: !!compensationQualifyMark
            };
            logDebug("branch.backedFeatureWithdrawn -> EventMgr.trigger(VIDEO_CLOSE)", videoClosePayload);
            EventSystem.trigger(AdEventType.VIDEO_CLOSE, videoClosePayload);
        });

        bindHandler("backedFeatureRipened", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw);
            const resultData = (parsed && (parsed.ferryBulkTierAgate || parsed.data)) || {};
            const videoOpenSuccessPayload = parsed && typeof parsed === "object"
                ? { ...resultData, ...parsed }
                : resultData && typeof resultData === "object"
                    ? resultData
                    : {};
            logDebug("branch.backedFeatureRipened -> EventMgr.trigger(VIDEO_OPEN_SUCCESS)", sanitizeLogValue(videoOpenSuccessPayload));
            EventSystem.trigger(AdEventType.VIDEO_OPEN_SUCCESS, videoOpenSuccessPayload);
        });

        bindHandler("pushTokenInitialized", (raw: any): void => {
            const parsed = this.parseEncodedJson(raw, true);
            const token = typeof parsed === "string"
                ? parsed.trim()
                : typeof raw === "string"
                    ? raw.trim()
                    : "";
            logDebug("branch.pushTokenInitialized parsed", {
                raw: sanitizeLogValue(raw),
                token: sanitizeLogValue(token)
            });
            if (token) {
                LoadingHttpService.init((_result: any, next: () => void): any => next());
                LoadingHttpService.syncFirebaseToken(token);
            }
        });

        bindHandler("cycleAscendedAlert", (): void => {
            logDebug("branch.cycleAscendedAlert -> cc.game.EVENT_SHOW");
            const game = cc.game as any;
            if (game && game.emit) {
                game.emit(game.EVENT_SHOW);
            }
        });

        bindHandler("cycleDescendedMute", (): void => {
            logDebug("branch.cycleDescendedMute -> cc.game.EVENT_HIDE");
            const game = cc.game as any;
            if (game && game.emit) {
                game.emit(game.EVENT_HIDE);
            }
        });

        this.branchHandlersBound = true;
        logDebug("bindBranchHandlers done");
    }

    public static bindAndroidCallbacks(): void {
        if (this.androidCallbacksBound) {
            logDebug("bindAndroidCallbacks skipped(already bound)");
            return;
        }

        const win = window as any;
        const callAndroid = (win.callAndroid = win.callAndroid || {});
        logDebug("bindAndroidCallbacks start");

        this.ANDROID_CALLBACK_MAP.forEach((mapping: IAndroidCallbackMapping): void => {
            const source = mapping.source;
            const target = mapping.target;
            const previousHandler = callAndroid[source];
            logDebug("bind callAndroid." + source + " -> branch." + target, {
                hasPrevious: typeof previousHandler === "function"
            });

            callAndroid[source] = (...args: any[]): void => {
                logDebug("callAndroid." + source + " invoked", sanitizeLogArgs(args));
                try {
                    const branch = win.branch;
                    const handler = branch && branch[target];
                    if (typeof handler === "function") {
                        logDebug("forward callAndroid." + source + " -> branch." + target, sanitizeLogArgs(args));
                        handler.apply(branch, args);
                    } else {
                        logDebug("branch." + target + " missing, skip forward");
                    }
                } catch (err) {
                    console.error(LOG_TAG + " forward " + source + " -> branch." + target + " failed", err);
                }
                if (typeof previousHandler === "function" && previousHandler !== callAndroid[source]) {
                    try {
                        logDebug("callAndroid." + source + " -> previous handler", sanitizeLogArgs(args));
                        previousHandler.apply(callAndroid, args);
                    } catch (err) {
                        console.error(LOG_TAG + " previous " + source + " callback failed", err);
                    }
                }
            };
        });

        this.androidCallbacksBound = true;
        logDebug("bindAndroidCallbacks done");
    }

    public static getBridge(): INativeSdkBridge {
        if (this.bridge) {
            logDebug("getBridge reuse existing bridge");
            return this.bridge;
        }

        const isAndroid = cc.sys.os === cc.sys.OS_ANDROID;
        logDebug("getBridge create bridge", {
            os: cc.sys.os,
            isAndroid: isAndroid
        });

        const bridge: INativeSdkBridge = isAndroid ? new AndroidSdkBridgeAdapter() : new NoopSdkBridgeAdapter();
        this.bridge = bridge;

        if (isAndroid) {
            this.bindBranchHandlers();
            this.bindAndroidCallbacks();
        }

        logDebug("getBridge ready", {
            bridgeType: isAndroid ? "android" : "noop"
        });

        return bridge;
    }

    public static setBridge(bridge: INativeSdkBridge | null): void {
        logDebug("setBridge override bridge", {
            hasBridge: !!bridge
        });
        this.bridge = bridge;
    }
}