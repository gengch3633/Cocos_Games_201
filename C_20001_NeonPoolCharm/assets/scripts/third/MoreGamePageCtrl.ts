import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import MoreGamePage from "./MoreGamePage";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/MoreGamePageCtrl")
export default class MoreGamePageCtrl extends BasePageCtrl {
    ui: MoreGamePage = null;

    static prefabUrl = "MoreGamePage";
    static className = "MoreGamePageCtrl";

    onUILoad(): void {
        this.ui = this.node.addComponent(MoreGamePage);
    }

    _updateWebView(e?: string): void {
        const o = cc.director.getScene();
        let n = o.getChildByName("_Pool_webview_");
        if (!n) {
            n = new cc.Node("_Pool_webview_");
            o.addChild(n, cc.macro.MAX_ZINDEX);
            n.setParent(o);
        }
        cc.game.isPersistRootNode(n) || cc.game.addPersistRootNode(n);
        n.active = true;
        const i = this.ui.webViewNode.parent.convertToWorldSpaceAR(this.ui.webViewNode.position);
        const a = n.parent.convertToNodeSpaceAR(i);
        n.position = a;
        n.anchorX = this.ui.webViewNode.anchorX;
        n.anchorY = this.ui.webViewNode.anchorY;
        n.width = this.ui.webViewNode.width;
        n.height = this.ui.webViewNode.height;
        const r = n.getComponent(cc.WebView) ?? n.addComponent(cc.WebView);
        if (null != e && r.url !== e) {
            r.url = "";
            r.url = e;
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
        const o = cc.director.getScene().getChildByName("_Pool_webview_");
        if (o) {
            o.active = false;
            (o.getComponent(cc.WebView) ?? o.addComponent(cc.WebView)).url = "";
        }
        super.onDisable();
    }
}
