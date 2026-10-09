import { FrameSDK } from "./FrameSDK";

enum WebViewState {
    READY = 0,
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
}

export default class WebViewManager {

    static _webViewNode: cc.Node = null;
    static _state = WebViewState.READY;
    static _delegate: any = null;
    static _jumpTimestamp = null;
    static _timeoutID: any = null;

    static _onAppShow() {
        if (WebViewManager._state === WebViewState.LOADED && null !== WebViewManager._jumpTimestamp && undefined !== WebViewManager._jumpTimestamp) {
            let a = Date.now() - WebViewManager._jumpTimestamp;
            WebViewManager._jumpTimestamp = null;
            let delegate = WebViewManager._delegate;
            if (null !== delegate && undefined !== delegate) {
                let cb = delegate.onWebViewExternalURL;
                if (null !== cb && undefined !== cb) {
                    cb.call(delegate, a);
                }
            }
        }
    }

    static _onWebViewInteract() {
        if (WebViewManager._state === WebViewState.LOADED) {
            let delegate = WebViewManager._delegate;
            if (null !== delegate && undefined !== delegate) {
                let cb = delegate.onWebViewInteract;
                if (null !== cb && undefined !== cb) {
                    cb.call(delegate);
                }
            }
        }
    }

    static _onWebViewError() {
        WebViewManager._clearTimeout();
        if (WebViewManager._state !== WebViewState.READY && WebViewManager._state !== WebViewState.ERROR) {
            FrameSDK.frameData.gameFuc.closeLoad();
            WebViewManager._webViewNode.scale = 1;
            WebViewManager._state = WebViewState.ERROR;
            if (null !== WebViewManager._delegate && undefined !== WebViewManager._delegate) {
                WebViewManager._delegate.onWebViewLoad(false);
            }
        }
    }

    static _onWebViewLoaded(e) {
        WebViewManager._clearTimeout();
        if (WebViewManager._state !== WebViewState.READY && WebViewManager._state !== WebViewState.LOADED && WebViewManager._state !== WebViewState.ERROR) {
            FrameSDK.frameData.gameFuc.closeLoad();
            WebViewManager._webViewNode.scale = 1;
            e.evaluateJS("\n            if (!window.__injected) {\n                document.addEventListener('submit', function () {\n                    window[\"android\"].setCallBack(\"cc.js.getClassByName('WebViewManager')._onWebViewInteract();\");\n                });\n                window.__injected = true;\n            }\n        ");
            WebViewManager._state = WebViewState.LOADED;
            if (null !== WebViewManager._delegate && undefined !== WebViewManager._delegate) {
                WebViewManager._delegate.onWebViewLoad(true);
            }
        }
    }

    static _onWebViewJumpExternal() {
        if (WebViewManager._state === WebViewState.LOADED && (null === WebViewManager._jumpTimestamp || undefined === WebViewManager._jumpTimestamp)) {
            WebViewManager._jumpTimestamp = Date.now();
        }
    }

    static _clearTimeout() {
        if (null !== WebViewManager._timeoutID && undefined !== WebViewManager._timeoutID) {
            clearTimeout(WebViewManager._timeoutID);
            WebViewManager._timeoutID = null;
        }
    }

    static hideWebView(e) {
        let parent = undefined;
        if (null !== WebViewManager._webViewNode && undefined !== WebViewManager._webViewNode) {
            parent = WebViewManager._webViewNode.parent;
        }
        if (e === parent) {
            WebViewManager._webViewNode.removeFromParent(false);
            WebViewManager._state = WebViewState.READY;
            WebViewManager._delegate = null;
            WebViewManager._jumpTimestamp = null;
            cc.game.targetOff(WebViewManager);
            let a = WebViewManager._webViewNode.getComponent(cc.WebView);
            if (a) {
                a.url = "";
            }
        }
    }

    static showWebView(e, t, a, i?) {
        if (undefined === i) {
            i = 30;
        }
        let parent = undefined;
        if (null !== WebViewManager._webViewNode && undefined !== WebViewManager._webViewNode) {
            parent = WebViewManager._webViewNode.parent;
        }
        if (e !== parent) {
            if (!WebViewManager._webViewNode) {
                WebViewManager._webViewNode = new cc.Node();
                WebViewManager._webViewNode.on("loaded", WebViewManager._onWebViewLoaded, WebViewManager);
                WebViewManager._webViewNode.on("error", WebViewManager._onWebViewError, WebViewManager);
                let l = WebViewManager._webViewNode.addComponent(cc.Widget);
                l.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
                l.isAlignBottom = true;
                l.isAlignLeft = true;
                l.isAlignRight = true;
                l.isAlignTop = true;
                l.bottom = 0;
                l.left = 0;
                l.right = 0;
                l.top = 0;
            }
            WebViewManager._webViewNode.setParent(e);
            WebViewManager._webViewNode.getComponent(cc.Widget).updateAlignment();
            WebViewManager._state = WebViewState.LOADING;
            WebViewManager._delegate = a;
            WebViewManager._jumpTimestamp = null;
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/lib/Cocos2dxWebView", "setExternalJSCallback", "(Ljava/lang/String;)V", "cc.js.getClassByName('WebViewManager')._onWebViewJumpExternal");
            }
            cc.game.targetOff(WebViewManager);
            cc.game.on(cc.game.EVENT_SHOW, WebViewManager._onAppShow, WebViewManager);
            let existing = WebViewManager._webViewNode.getComponent(cc.WebView);
            let u = null !== existing && undefined !== existing ? existing : WebViewManager._webViewNode.addComponent(cc.WebView);
            u.url = t;
            FrameSDK.frameData.gameFuc.openLoad();
            WebViewManager._webViewNode.scale = 0;
            WebViewManager._clearTimeout();
            WebViewManager._timeoutID = setTimeout(function () {
                FrameSDK.frameData.gameFuc.closeLoad();
                u.url = "";
                WebViewManager._state = WebViewState.ERROR;
                if (null !== WebViewManager._delegate && undefined !== WebViewManager._delegate) {
                    WebViewManager._delegate.onWebViewLoad(false);
                }
            }, 1e3 * i);
        }
    }
}

cc.js.setClassName("WebViewManager", WebViewManager);
