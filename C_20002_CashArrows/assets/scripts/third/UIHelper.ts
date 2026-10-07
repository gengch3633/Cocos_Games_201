import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import EventSystem, { CLOSE_RECONNECT } from "./EventSystem";

class UIHelperImpl {
    pages = new Map<string, { node: cc.Node | null; prefab: cc.Prefab }>();
    persist: cc.Node | null = null;
    toast: cc.Node | null = null;
    pagesParent: cc.Node | null = null;
    toastPrefab: cc.Prefab | null = null;
    toastShows = 0;
    networkErrorText = "Network error, please try again";

    init(): void {
        const persistNode = new cc.Node("persist");
        this.persist = persistNode;
        const toastNode = new cc.Node("toast");
        this.toast = toastNode;
        persistNode.addChild(toastNode);
        persistNode.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        cc.game.addPersistRootNode(persistNode);
    }

    setToastNode(node: cc.Node): void {
        if (this.toast) {
            node.parent = this.toast;
        }
    }

    setNetworkErrorText(text: string): void {
        this.networkErrorText = text;
    }

    getPagesParent(): cc.Node {
        const sceneRoot = cc.director.getScene().children[0];
        let pages = sceneRoot.getChildByName("pages");
        if (pages) {
            return pages;
        }
        pages = new cc.Node("pages");
        pages.zIndex = 1;
        sceneRoot.addChild(pages);
        return pages;
    }

    showToast(message: string, duration = 0.8): void {
        if (!message) {
            return;
        }
        if (cc.isValid(this.toastPrefab)) {
            const toastNode = cc.instantiate(this.toastPrefab);
            this.setToastNode(toastNode);
            const content = toastNode.getChildByName("content");
            const label = content?.getChildByName("text")?.getComponent(cc.Label);
            if (label) {
                label.string = message;
            }
            if (content) {
                content.width = (label?.node?.width || 100) + 100;
            }
            toastNode.zIndex = 999;
            toastNode.setPosition(cc.v2(0, 0));
            content?.setPosition(cc.v2(0, 0));
            label?.node?.setPosition(cc.v2(0, 0));
            this.toastShows++;
            toastNode.runAction(
                cc.sequence(
                    cc.moveBy(duration, 0, 100),
                    cc.delayTime(1),
                    cc.fadeOut(0.3),
                    cc.callFunc(() => {
                        toastNode.parent = null;
                        toastNode.destroy();
                        this.toastShows--;
                    })
                )
            );
        } else {
            cc.loader.loadRes(BUSINESS_COMMON_CONFIG.toastPrefabPath, cc.Prefab, (err, prefab: cc.Prefab) => {
                if (!err) {
                    this.toastPrefab = prefab;
                    this.showToast(message, duration);
                }
            });
        }
    }

    showPage(pageName: string, params?: any): void {
        const cached = this.pages.get(pageName);
        if (cached) {
            let node = cached.node;
            const prefab = cached.prefab;
            if (!node || !node.isValid) {
                node = cc.instantiate(prefab);
            }
            this.addPage(pageName, node, node, prefab, params);
        } else {
            cc.resources.load("BPR_pages/BPR_" + pageName, cc.Prefab, (err, prefab: cc.Prefab) => {
                if (!err) {
                    this.addPage(pageName, null, cc.instantiate(prefab), prefab, params);
                }
            });
        }
    }

    addPage(
        pageName: string,
        existingNode: cc.Node | null,
        node: cc.Node,
        prefab: cc.Prefab,
        params?: any
    ): void {
        let pageNode = existingNode;
        if (!pageNode || !pageNode.isValid) {
            pageNode = node;
        }
        const parent = this.getPagesParent();
        if (!parent.getChildByName(pageName)) {
            parent.addChild(pageNode);
        }
        pageNode.name = pageName;
        pageNode.zIndex = 99;
        const ctrl = pageNode.getComponent(pageName + "Ctrl") || pageNode.getComponent("BasePageCtrl");
        ctrl?._init?.(params);
        this.pages.set(pageName, {
            node: pageNode,
            prefab,
        });
    }

    hidePage(pageName: string): void {
        const cached = this.pages.get(pageName);
        if (cached?.node) {
            cached.node.destroy();
            cached.node = null;
        }
    }

    httpErr(_err: any, callback?: Function): void {
        this.showToast(this.networkErrorText);
        this.showPage("ReconnectPage", {
            name: "ReconnectPage",
            callback,
        });
    }

    reconnectSuc(): void {
        this.hidePage("LoadingPage");
        EventSystem.trigger(CLOSE_RECONNECT);
    }

    reconnectFai(): void {
        this.hidePage("LoadingPage");
    }
}

export default new UIHelperImpl();
