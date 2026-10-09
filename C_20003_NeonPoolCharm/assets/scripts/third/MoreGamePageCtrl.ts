import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import MoreGamePage from "./MoreGamePage";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/MoreGamePageCtrl")
export default class MoreGamePageCtrl extends BasePageCtrl {
    ui = null;

    static prefabUrl = "MoreGamePage";
    static className = "MoreGamePageCtrl";

    onUILoad() {
        this.ui = this.node.addComponent(MoreGamePage);
    }

    _updateWebView(url) {
        const scene = cc.director.getScene();
        let webNode = scene.getChildByName("_Pool_webview_");
        if (!webNode) {
            webNode = new cc.Node("_Pool_webview_");
            scene.addChild(webNode, cc.macro.MAX_ZINDEX);
            webNode.setParent(scene);
        }
        if (!cc.game.isPersistRootNode(webNode)) {
            cc.game.addPersistRootNode(webNode);
        }
        webNode.active = true;
        const worldPos = this.ui.webViewNode.parent.convertToWorldSpaceAR(this.ui.webViewNode.position);
        const localPos = webNode.parent.convertToNodeSpaceAR(worldPos);
        webNode.position = localPos;
        webNode.anchorX = this.ui.webViewNode.anchorX;
        webNode.anchorY = this.ui.webViewNode.anchorY;
        webNode.width = this.ui.webViewNode.width;
        webNode.height = this.ui.webViewNode.height;
        let webView = webNode.getComponent(cc.WebView);
        if (webView == null) {
            webView = webNode.addComponent(cc.WebView);
        }
        if (url != null && webView.url !== url) {
            webView.url = "";
            webView.url = url;
        }
    }

    _onSizeChange() {
        this._updateWebView();
    }

    addButtonListen() {
        UiManager.addButtonListen(this.ui.close, this.hide, this);
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.NONE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
        this.ui.webViewNode.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
        this.scheduleOnce(() => {
            this.ui.webViewNode.height = this.ui.webViewNode.convertToWorldSpaceAR(cc.v2()).y;
        });
    }

    _init(data) {
        this._updateWebView(data.url);
    }

    onDisable() {
        const webNode = cc.director.getScene().getChildByName("_Pool_webview_");
        if (webNode) {
            webNode.active = false;
            let webView = webNode.getComponent(cc.WebView);
            if (webView == null) {
                webView = webNode.addComponent(cc.WebView);
            }
            webView.url = "";
        }
        super.onDisable();
    }
}
