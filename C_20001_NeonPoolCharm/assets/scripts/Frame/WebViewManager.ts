import { FrameSDK } from "./FrameSDK";

enum WebViewState {
    READY = 0,
    LOADING = 1,
    LOADED = 2,
    ERROR = 3,
}

interface WebViewDelegate {
    onWebViewLoad?(success: boolean): void;
    onWebViewInteract?(): void;
    onWebViewExternalURL?(duration: number): void;
}

export default class WebViewManager {
    static _webViewNode: cc.Node = null;
    static _state: WebViewState = WebViewState.READY;
    static _delegate: WebViewDelegate = null;
    static _jumpTimestamp: number = null;
    static _timeoutID: ReturnType<typeof setTimeout> = null;

    static _onAppShow(): void {
        if (
            this._state === WebViewState.LOADED &&
            this._jumpTimestamp !== null &&
            this._jumpTimestamp !== undefined
        ) {
            const duration = Date.now() - this._jumpTimestamp;
            this._jumpTimestamp = null;
            this._delegate?.onWebViewExternalURL?.(duration);
        }
    }

    static _onWebViewInteract(): void {
        if (this._state === WebViewState.LOADED) {
            this._delegate?.onWebViewInteract?.();
        }
    }

    static _onWebViewError(): void {
        this._clearTimeout();
        if (this._state !== WebViewState.READY && this._state !== WebViewState.ERROR) {
            FrameSDK.frameData.gameFuc.closeLoad();
            this._webViewNode.scale = 1;
            this._state = WebViewState.ERROR;
            this._delegate?.onWebViewLoad?.(false);
        }
    }

    static _onWebViewLoaded(webView: cc.WebView): void {
        this._clearTimeout();
        if (
            this._state !== WebViewState.READY &&
            this._state !== WebViewState.LOADED &&
            this._state !== WebViewState.ERROR
        ) {
            FrameSDK.frameData.gameFuc.closeLoad();
            this._webViewNode.scale = 1;
            webView.evaluateJS(`
            if (!window.__injected) {
                document.addEventListener('submit', function () {
                    window["android"].setCallBack("cc.js.getClassByName('WebViewManager')._onWebViewInteract();");
                });
                window.__injected = true;
            }
        `);
            this._state = WebViewState.LOADED;
            this._delegate?.onWebViewLoad?.(true);
        }
    }

    static _onWebViewJumpExternal(): void {
        if (
            this._state !== WebViewState.LOADED ||
            (this._jumpTimestamp !== null && this._jumpTimestamp !== undefined)
        ) {
            return;
        }
        this._jumpTimestamp = Date.now();
    }

    static _clearTimeout(): void {
        if (this._timeoutID !== null && this._timeoutID !== undefined) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    static hideWebView(parent: cc.Node): void {
        if (parent === this._webViewNode?.parent) {
            this._webViewNode.removeFromParent(false);
            this._state = WebViewState.READY;
            this._delegate = null;
            this._jumpTimestamp = null;
            cc.game.targetOff(this);
            const webView = this._webViewNode.getComponent(cc.WebView);
            if (webView) {
                webView.url = "";
            }
        }
    }

    static showWebView(parent: cc.Node, url: string, delegate: WebViewDelegate, timeout: number = 30): void {
        if (parent === this._webViewNode?.parent) {
            return;
        }
        if (!this._webViewNode) {
            this._webViewNode = new cc.Node();
            this._webViewNode.on("loaded", this._onWebViewLoaded, this);
            this._webViewNode.on("error", this._onWebViewError, this);
            const widget = this._webViewNode.addComponent(cc.Widget);
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            widget.isAlignBottom = true;
            widget.isAlignLeft = true;
            widget.isAlignRight = true;
            widget.isAlignTop = true;
            widget.bottom = 0;
            widget.left = 0;
            widget.right = 0;
            widget.top = 0;
        }
        this._webViewNode.setParent(parent);
        this._webViewNode.getComponent(cc.Widget).updateAlignment();
        this._state = WebViewState.LOADING;
        this._delegate = delegate;
        this._jumpTimestamp = null;
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(
                "org/cocos2dx/lib/Cocos2dxWebView",
                "setExternalJSCallback",
                "(Ljava/lang/String;)V",
                "cc.js.getClassByName('WebViewManager')._onWebViewJumpExternal"
            );
        }
        cc.game.targetOff(this);
        cc.game.on(cc.game.EVENT_SHOW, this._onAppShow, this);
        const webView =
            this._webViewNode.getComponent(cc.WebView) ?? this._webViewNode.addComponent(cc.WebView);
        webView.url = url;
        FrameSDK.frameData.gameFuc.openLoad();
        this._webViewNode.scale = 0;
        this._clearTimeout();
        this._timeoutID = setTimeout(() => {
            FrameSDK.frameData.gameFuc.closeLoad();
            webView.url = "";
            this._state = WebViewState.ERROR;
            this._delegate?.onWebViewLoad?.(false);
        }, 1000 * timeout);
    }
}

cc.js.setClassName("WebViewManager", WebViewManager);
