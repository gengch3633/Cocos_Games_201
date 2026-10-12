import * as BusinessCommonConfig from "./BusinessCommonConfig";
import EventSystem, { CLOSE_RECONNECT } from "./EventSystem";

interface IBasePageCtrl extends cc.Component {
    _init?(data?: any): void;
}

interface IPageInfo {
    node: cc.Node;
    prefab: cc.Prefab;
}

class UIHelper {
    public pages: Map<string, IPageInfo> = new Map<string, IPageInfo>();
    public persist: cc.Node = null;
    public toast: cc.Node = null;
    public pagesParent: cc.Node = null;
    public toastPrefab: cc.Prefab = null;
    public toastShows: number = 0;
    public networkErrorText: string = "Network error, please try again";

    public init(): void {
        const persist: cc.Node = new cc.Node("persist");
        this.persist = persist;

        const toast: cc.Node = new cc.Node("toast");
        this.toast = toast;

        persist.addChild(toast);
        persist.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        cc.game.addPersistRootNode(persist);
    }

    public setToastNode(node: cc.Node): void {
        if (this.toast) {
            node.parent = this.toast;
        }
    }

    public setNetworkErrorText(text: string): void {
        this.networkErrorText = text;
    }

    public getPagesParent(): cc.Node {
        const root: cc.Node = cc.director.getScene().children[0];
        let pages: cc.Node = root.getChildByName("pages");
        if (pages) {
            return pages;
        }
        pages = new cc.Node("pages");
        pages.zIndex = 1;
        root.addChild(pages);
        return pages;
    }

    public showToast(content: string, duration: number = 0.8): void {
        if (!content) {
            return;
        }
        if (cc.isValid(this.toastPrefab)) {
            const toastNode: cc.Node = cc.instantiate(this.toastPrefab);
            this.setToastNode(toastNode);

            const contentNode: cc.Node = toastNode.getChildByName("content");
            let label: cc.Label = null;
            if (contentNode) {
                const textNode: cc.Node = contentNode.getChildByName("text");
                if (textNode) {
                    label = textNode.getComponent(cc.Label);
                }
            }
            if (label) {
                label.string = content;
            }
            if (contentNode) {
                const labelWidth: number = (label && label.node && label.node.width) || 100;
                contentNode.width = labelWidth + 100;
            }

            toastNode.zIndex = 999;
            toastNode.setPosition(cc.v2(0, 0));
            if (contentNode) {
                contentNode.setPosition(cc.v2(0, 0));
            }
            if (label && label.node) {
                label.node.setPosition(cc.v2(0, 0));
            }

            this.toastShows++;
            toastNode.runAction(cc.sequence(
                cc.moveBy(duration, 0, 100),
                cc.delayTime(1),
                cc.fadeOut(0.3),
                cc.callFunc((): void => {
                    toastNode.parent = null;
                    toastNode.destroy();
                    this.toastShows--;
                })
            ));
        } else {
            cc.loader.loadRes(
                BusinessCommonConfig.BUSINESS_COMMON_CONFIG.toastPrefabPath,
                cc.Prefab,
                (err: Error, prefab: cc.Prefab): void => {
                    if (!err) {
                        this.toastPrefab = prefab;
                        this.showToast(content, duration);
                    }
                }
            );
        }
    }

    public showPage(name: string, data?: any): void {
        const page: IPageInfo = this.pages.get(name);
        if (page) {
            let node: cc.Node = page.node;
            const prefab: cc.Prefab = page.prefab;
            if (!node || !node.isValid) {
                node = cc.instantiate(prefab);
            }
            this.addPage(name, node, node, prefab, data);
        } else {
            cc.resources.load("BPR_pages/BPR_" + name, cc.Prefab, (err: Error, prefab: cc.Prefab): void => {
                if (!err) {
                    this.addPage(name, null, cc.instantiate(prefab), prefab, data);
                }
            });
        }
    }

    public addPage(name: string, node: cc.Node, newNode: cc.Node, prefab: cc.Prefab, data?: any): void {
        if (!node || !node.isValid) {
            node = newNode;
        }
        const parent: cc.Node = this.getPagesParent();
        if (!parent.getChildByName(name)) {
            parent.addChild(node);
        }
        node.name = name;
        node.zIndex = 99;

        const ctrl = (node.getComponent(name + "Ctrl") || node.getComponent("BasePageCtrl")) as IBasePageCtrl;
        if (ctrl && typeof ctrl._init === "function") {
            ctrl._init(data);
        }

        this.pages.set(name, { node: node, prefab: prefab });
    }

    public hidePage(name: string): void {
        const page: IPageInfo = this.pages.get(name);
        if (page && page.node) {
            page.node.destroy();
            page.node = null;
        }
    }

    public httpErr(_err: any, callback?: (data?: any) => void): void {
        this.showToast(this.networkErrorText);
        this.showPage("ReconnectPage", { name: "ReconnectPage", callback: callback });
    }

    public reconnectSuc(): void {
        this.hidePage("LoadingPage");
        EventSystem.trigger(CLOSE_RECONNECT);
    }

    public reconnectFai(): void {
        this.hidePage("LoadingPage");
    }
}

export default new UIHelper();