export class PoolNative {
    static _gaid = "00000000-0000-0000-0000-000000000000";
    static _isLimitTrackingEnabled = true;
    static _fetchGAIDCallback = null;

    static setAppLifecycleChangeCallback(e) {
        cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppLifecycleObserver", "setAppLifecycleChangeJSCallback", "(Ljava/lang/String;)V", e);
    }

    static openURL(e) {
        cc.sys.os, cc.sys.OS_IOS, cc.sys.openURL(e);
    }

    static getPackageName() {
        var e = "";
        cc.sys.os === cc.sys.OS_ANDROID && (e = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAPPPackageName", "()Ljava/lang/String;"));
        e || (e = "com.replace.industries.article");
        return e;
    }

    static getVersion() {
        return cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAPPVersion", "()Ljava/lang/String;") : (cc.sys.os, cc.sys.OS_IOS, "1.0.0");
    }

    static setSecureFlag(e) {
        cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setAPPSecureFlag", "(Z)V", e);
    }

    static getVersionCode() {
        var e = this.getVersion(),
            t = parseInt(e.replace(/\./g, ""), 10);
        return isNaN(t) ? 100 : t;
    }

    static get isProxyEnabled() {
        return cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isProxyEnabled", "()Z");
    }

    static get isVPNEnabled() {
        return cc.sys.os === cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "isVPNEnabled", "()Z");
    }

    static vibrate(e) {
        cc.sys.os === cc.sys.OS_IOS || jsb.device.vibrate(0.001 * e);
    }

    static _onGAIDGet(e, t) {
        this._gaid = null != e ? e : "00000000-0000-0000-0000-000000000000";
        this._isLimitTrackingEnabled = t;
        if (this._fetchGAIDCallback) {
            var o = this._fetchGAIDCallback;
            this._fetchGAIDCallback = null;
            o();
        }
    }

    static get gaid() {
        return this._gaid;
    }

    static get isLimitTrackingEnabled() {
        return this._isLimitTrackingEnabled;
    }

    static fetchGAID(e) {
        cc.sys.os, cc.sys.OS_ANDROID, null == e || e();
    }

    static getVPNOrProxyType() {
        return this.isProxyEnabled ? 2 : this.isVPNEnabled ? 1 : 0;
    }
}

cc.js.setClassName("PoolNative", PoolNative);
