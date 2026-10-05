export class PoolNative {
    private static _gaid = "00000000-0000-0000-0000-000000000000";
    private static _isLimitTrackingEnabled = true;
    private static _fetchGAIDCallback: (() => void) | null = null;

    static setAppLifecycleChangeCallback(callback: string): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppLifecycleObserver",
                "setAppLifecycleChangeJSCallback",
                "(Ljava/lang/String;)V",
                callback
            );
        }
    }

    static openURL(url: string): void {
        cc.sys.openURL(url);
    }

    static getPackageName(): string {
        let name = "";
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            name = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "getAPPPackageName",
                "()Ljava/lang/String;"
            );
        }
        if (!name) {
            name = "com.replace.industries.article";
        }
        return name;
    }

    static getVersion(): string {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            return jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "getAPPVersion",
                "()Ljava/lang/String;"
            );
        }
        return "1.0.0";
    }

    static setSecureFlag(enabled: boolean): void {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "setAPPSecureFlag",
                "(Z)V",
                enabled
            );
        }
    }

    static getVersionCode(): number {
        const version = PoolNative.getVersion();
        const code = parseInt(version.replace(/\./g, ""), 10);
        return isNaN(code) ? 100 : code;
    }

    static get isProxyEnabled(): boolean {
        return (
            cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "isProxyEnabled",
                "()Z"
            )
        );
    }

    static get isVPNEnabled(): boolean {
        return (
            cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "isVPNEnabled",
                "()Z"
            )
        );
    }

    static vibrate(duration: number): void {
        if (cc.sys.os !== cc.sys.OS_IOS) {
            jsb.device.vibrate(0.001 * duration);
        }
    }

    static _onGAIDGet(gaid: string | null, isLimitTrackingEnabled: boolean): void {
        PoolNative._gaid = gaid != null ? gaid : "00000000-0000-0000-0000-000000000000";
        PoolNative._isLimitTrackingEnabled = isLimitTrackingEnabled;
        if (PoolNative._fetchGAIDCallback) {
            const callback = PoolNative._fetchGAIDCallback;
            PoolNative._fetchGAIDCallback = null;
            callback();
        }
    }

    static get gaid(): string {
        return PoolNative._gaid;
    }

    static get isLimitTrackingEnabled(): boolean {
        return PoolNative._isLimitTrackingEnabled;
    }

    static fetchGAID(callback?: () => void): void {
        if (callback != null) {
            callback();
        }
    }

    static getVPNOrProxyType(): number {
        return PoolNative.isProxyEnabled ? 2 : PoolNative.isVPNEnabled ? 1 : 0;
    }
}

cc.js.setClassName("PoolNative", PoolNative);
