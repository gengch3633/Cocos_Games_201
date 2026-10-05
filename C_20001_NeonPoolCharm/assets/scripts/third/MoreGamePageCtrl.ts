import { UiManager } from "./UiManage";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import MoreGamePage from "./MoreGamePage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/MoreGamePageCtrl")
export default class MoreGamePageCtrl extends BasePageCtrl {
    ui: MoreGamePage = null;

    onUILoad(): void {
        this.ui = this.node.addComponent(MoreGamePage);
    }

    _updateWebView(url?: string): void {
        const scene = cc.director.getScene();
        let webViewNode = scene.getChildByName("_Pool_webview_");
        if (!webViewNode) {
            webViewNode = new cc.Node("_Pool_webview_");
            scene.addChild(webViewNode, cc.macro.MAX_ZINDEX);
            webViewNode.setParent(scene);
        }
        if (!cc.game.isPersistRootNode(webViewNode)) {
            cc.game.addPersistRootNode(webViewNode);
        }
        webViewNode.active = true;
        const worldPos = this.ui.webViewNode.parent.convertToWorldSpaceAR(this.ui.webViewNode.position);
        const localPos = webViewNode.parent.convertToNodeSpaceAR(worldPos);
        webViewNode.position = localPos;
        webViewNode.anchorX = this.ui.webViewNode.anchorX;
        webViewNode.anchorY = this.ui.webViewNode.anchorY;
        webViewNode.width = this.ui.webViewNode.width;
        webViewNode.height = this.ui.webViewNode.height;
        const webView = webViewNode.getComponent(cc.WebView) ?? webViewNode.addComponent(cc.WebView);
        if (url != null && webView.url !== url) {
            webView.url = "";
            webView.url = url;
        }
    }

    _onSizeChange(): void {
        this._updateWebView();
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.close, this.hide, this);
    }

    onLoad(): void {
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

    _init(e: { url: string }): void {
        this._updateWebView(e.url);
    }

    onDisable(): void {
        const scene = cc.director.getScene();
        const webViewNode = scene.getChildByName("_Pool_webview_");
        if (webViewNode) {
            webViewNode.active = false;
            (webViewNode.getComponent(cc.WebView) ?? webViewNode.addComponent(cc.WebView)).url = "";
        }
        super.onDisable();
    }

    static prefabUrl = "MoreGamePage";
    static className = "MoreGamePageCtrl";
}
