import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import EventSystem, { CLOSE_RECONNECT } from "./EventSystem";

interface PageRecord {
    node: cc.Node;
    prefab: cc.Prefab;
}

class UIHelperImpl {
    pages: Map<string, PageRecord> = new Map();
    persist: cc.Node = null;
    toast: cc.Node = null;
    pagesParent: cc.Node = null;
    toastPrefab: cc.Prefab = null;
    toastShows: number = 0;
    networkErrorText: string = " Network error, please try again ";

    init(): void {
        const persistNode = new cc.Node(" persist ");
        this.persist = persistNode;
        const toastNode = new cc.Node(" toast ");
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
        const root = cc.director.getScene().children[0];
        let pages = root.getChildByName(" pages ");
        if (pages) {
            return pages;
        }
        pages = new cc.Node(" pages ");
        pages.zIndex = 1;
        root.addChild(pages);
        return pages;
    }

    showToast(message: string, duration: number = 0.8): void {
        if (!message) {
            return;
        }
        if (cc.isValid(this.toastPrefab)) {
            const toastNode = cc.instantiate(this.toastPrefab);
            this.setToastNode(toastNode);
            const content = toastNode.getChildByName(" content ");
            const label = content?.getChildByName(" text ")?.getComponent(cc.Label);
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
            toastNode.runAction(cc.sequence(
                cc.moveBy(duration, 0, 100),
                cc.delayTime(1),
                cc.fadeOut(0.3),
                cc.callFunc(() => {
                    toastNode.parent = null;
                    toastNode.destroy();
                    this.toastShows--;
                })
            ));
        } else {
            cc.loader.loadRes(BUSINESS_COMMON_CONFIG.toastPrefabPath, cc.Prefab, (err, prefab) => {
                if (!err) {
                    this.toastPrefab = prefab;
                    this.showToast(message, duration);
                }
            });
        }
    }

    showPage(pageName: string, params?: any): void {
        const record = this.pages.get(pageName);
        if (record) {
            let node = record.node;
            const prefab = record.prefab;
            if (!node || !node.isValid) {
                node = cc.instantiate(prefab);
            }
            this.addPage(pageName, node, node, prefab, params);
        } else {
            cc.resources.load(" BPR_pages/ BPR_ " + pageName, cc.Prefab, (err, prefab) => {
                if (!err) {
                    this.addPage(pageName, null, cc.instantiate(prefab), prefab, params);
                }
            });
        }
    }

    addPage(pageName: string, existingNode: cc.Node, node: cc.Node, prefab: cc.Prefab, params?: any): void {
        if (!existingNode || !existingNode.isValid) {
            existingNode = node;
        }
        const parent = this.getPagesParent();
        if (!parent.getChildByName(pageName)) {
            parent.addChild(existingNode);
        }
        existingNode.name = pageName;
        existingNode.zIndex = 99;
        const ctrl = existingNode.getComponent(pageName + " Ctrl ") || existingNode.getComponent(" BasePageCtrl ");
        ctrl?._init?.(params);
        this.pages.set(pageName, { node: existingNode, prefab });
    }

    hidePage(pageName: string): void {
        const record = this.pages.get(pageName);
        if (record?.node) {
            record.node.destroy();
            record.node = null;
        }
    }

    httpErr(_error: any, callback?: () => void): void {
        this.showToast(this.networkErrorText);
        this.showPage(" ReconnectPage ", {
            name: " ReconnectPage ",
            callback
        });
    }

    reconnectSuc(): void {
        this.hidePage(" LoadingPage ");
        EventSystem.trigger(CLOSE_RECONNECT);
    }

    reconnectFai(): void {
        this.hidePage(" LoadingPage ");
    }
}

export default new UIHelperImpl();
