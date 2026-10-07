export class PoolNative {
    static _gaid = "00000000-0000-0000-0000-000000000000";
    static _isLimitTrackingEnabled = true;
    static _fetchGAIDCallback: (() => void) | null = null;

    static setAppLifecycleChangeCallback(e: string): void {
        cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppLifecycleObserver",
                "setAppLifecycleChangeJSCallback",
                "(Ljava/lang/String;)V",
                e
            );
    }

    static openURL(e: string): void {
        cc.sys.os;
        cc.sys.OS_IOS;
        cc.sys.openURL(e);
    }

    static getPackageName(): string {
        let e = "";
        cc.sys.os === cc.sys.OS_ANDROID &&
            (e = jsb.reflection.callStaticMethod(
                "org/cocos2dx/javascript/AppActivity",
                "getAPPPackageName",
                "()Ljava/lang/String;"
            ));
        e || (e = "com.replace.industries.article");
        return e;
    }

    static getVersion(): string {
        return cc.sys.os === cc.sys.OS_ANDROID
            ? jsb.reflection.callStaticMethod(
                  "org/cocos2dx/javascript/AppActivity",
                  "getAPPVersion",
                  "()Ljava/lang/String;"
              )
            : (cc.sys.os, cc.sys.OS_IOS, "1.0.0");
    }

    static setSecureFlag(e: boolean): void {
        cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setAPPSecureFlag", "(Z)V", e);
    }

    static getVersionCode(): number {
        const e = this.getVersion();
        const t = parseInt(e.replace(/\./g, ""), 10);
        return isNaN(t) ? 100 : t;
    }

    static get isProxyEnabled(): boolean {
        return (
            cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isProxyEnabled", "()Z")
        );
    }

    static get isVPNEnabled(): boolean {
        return (
            cc.sys.os === cc.sys.OS_ANDROID &&
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVPNEnabled", "()Z")
        );
    }

    static vibrate(e: number): void {
        cc.sys.os === cc.sys.OS_IOS || jsb.device.vibrate(0.001 * e);
    }

    static _onGAIDGet(e: string, t: boolean): void {
        this._gaid = null != e ? e : "00000000-0000-0000-0000-000000000000";
        this._isLimitTrackingEnabled = t;
        if (this._fetchGAIDCallback) {
            const o = this._fetchGAIDCallback;
            this._fetchGAIDCallback = null;
            o();
        }
    }

    static get gaid(): string {
        return this._gaid;
    }

    static get isLimitTrackingEnabled(): boolean {
        return this._isLimitTrackingEnabled;
    }

    static fetchGAID(e?: () => void): void {
        cc.sys.os;
        cc.sys.OS_ANDROID;
        null == e || e();
    }

    static getVPNOrProxyType(): number {
        return this.isProxyEnabled ? 2 : this.isVPNEnabled ? 1 : 0;
    }
}

cc.js.setClassName("PoolNative", PoolNative);
