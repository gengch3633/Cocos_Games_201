import EngineUtil from "./EngineUtil";

class PageMgr {
    map_pages = new Map<string, { node: cc.Node; prefab: cc.Prefab }>();
    arr_pageQueue: { name: string; data: any }[] = [];
    onShowNum = 0;
    set_onShowPages = new Set<cc.Node>();
    pages: cc.Node = null;
    persist: cc.Node = null;
    effects: cc.Node = null;
    toast: cc.Node = null;
    message: cc.Node = null;
    touchNode: cc.Node = null;
    fadeNode: cc.Node = null;
    loadingMask: cc.Node = null;

    getPagesParent(): cc.Node {
        const root = cc.director.getScene().children[0];
        let pages = root.getChildByName("pages");
        if (pages) {
            return pages;
        }
        pages = new cc.Node("pages");
        pages.zIndex = 1;
        root.addChild(pages);
        return pages;
    }

    init(loadingPrefab?: cc.Prefab): void {
        this.createNodes(loadingPrefab);
    }

    hidePage(pageName: string): void {
        if (pageName) {
            const pageInfo = this.map_pages.get(pageName);
            if (pageInfo) {
                const node = pageInfo.node;
                if (node) {
                    const ctrl = node.getComponent(pageName + "Ctrl") || node.getComponent("BasePageCtrl");
                    const reuse = ctrl._reuse;
                    const inQueue = ctrl._inQueue;
                    this.set_onShowPages.delete(node);
                    if (reuse) {
                        ctrl.hide();
                    } else {
                        node.destroy();
                        pageInfo.node = null;
                    }
                    if (inQueue) {
                        this.onShowNum--;
                        if (this.onShowNum < 0) {
                            this.onShowNum = 0;
                        }
                        const next = this.arr_pageQueue.shift();
                        if (next) {
                            this.showPage(next.name, next.data);
                        }
                    }
                } else {
                    console.error("class:pageMgr.fun:hidePage没有页面信息node" + pageName);
                }
            } else {
                console.error("class:pageMgr.fun:hidePage没有页面信息" + pageName);
            }
        } else {
            console.error("class:pageMgr.fun:hidePage页面名称为空");
        }
    }

    showPage(pageName: string, data?: any): void {
        if (pageName) {
            const pageInfo = this.map_pages.get(pageName);
            if (pageInfo) {
                let node = pageInfo.node;
                const prefab = pageInfo.prefab;
                let pageNode = node;
                if (!node || !node.isValid) {
                    pageNode = cc.instantiate(prefab);
                }
                this.addPage(pageName, node, pageNode, prefab, data);
            } else {
                this.loadPage(pageName, data);
            }
        } else {
            console.error("class:pageMgr.showPage页面名称为空");
        }
    }

    createEffectsNode(): void {
        const effects = new cc.Node("effects");
        this.effects = effects;
        effects.setPosition(cc.v2(0, 0));
        cc.director.getScene().children[0].addChild(effects, 99);
    }

    addPage(pageName: string, existingNode: cc.Node, node: cc.Node, prefab: cc.Prefab, data?: any): void {
        let ctrl = node.getComponent(pageName + "Ctrl") || node.getComponent("BasePageCtrl");
        if (!ctrl) {
            ctrl = node.addComponent(pageName + "Ctrl");
        }
        if (!ctrl._only || !this.hasShowPage(pageName)) {
            let zIndex = 0;
            if (ctrl._inQueue) {
                if (this.onShowNum > 0) {
                    this.arr_pageQueue.push({
                        name: pageName,
                        data: data,
                    });
                    return;
                }
                this.onShowNum++;
            } else {
                zIndex = this.getPageIndex();
            }
            if (!existingNode || !existingNode.isValid) {
                existingNode = node;
            }
            const pageCtrl = existingNode.getComponent(pageName + "Ctrl") || existingNode.getComponent("BasePageCtrl");
            if (ctrl._reuse) {
                existingNode.active = true;
            } else {
                existingNode = node;
            }
            const pagesParent = this.getPagesParent();
            if (!this.getPagesParent().getChildByName(pageName)) {
                pagesParent.addChild(existingNode);
            }
            existingNode.zIndex = zIndex;
            pageCtrl._init(data);
            this.set_onShowPages.add(existingNode);
            this.map_pages.set(pageName, {
                node: existingNode,
                prefab: prefab,
            });
        }
    }

    loadPage(pageName: string, data?: any): void {
        cc.resources.load("pages/" + pageName, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (err) {
                EngineUtil.error("class:pageMgr.fun:showPage加载页面错误", pageName, err);
            } else {
                this.addPage(pageName, null, cc.instantiate(prefab), prefab, data);
            }
        });
    }

    static _getInstance(): PageMgr {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new PageMgr();
        return this._instance;
    }

    getMessageNode(): cc.Node {
        return this.message;
    }

    hasShowPage(pageName: string): boolean {
        const pageInfo = this.map_pages.get(pageName);
        if (!pageInfo) {
            return false;
        }
        const node = pageInfo.node;
        return !!node && !!node.isValid && !!node.active;
    }

    getPageIndex(): number {
        let maxIndex = 0;
        this.set_onShowPages.forEach((node) => {
            const zIndex = node.zIndex;
            if (zIndex >= maxIndex) {
                maxIndex = zIndex + 1;
            }
        });
        return maxIndex;
    }

    showLoading(): void {
        if (this.loadingMask) {
            this.loadingMask.active = true;
        }
    }

    hasPage(pageName: string): boolean {
        return !!this.map_pages.get(pageName);
    }

    addFullScreenWidget(node: cc.Node): void {
        const widget = node.getComponent(cc.Widget) != null ? node.getComponent(cc.Widget) : node.addComponent(cc.Widget);
        widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.isAlignTop = true;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        widget.top = 0;
        widget.updateAlignment();
    }

    setToastNode(node: cc.Node): void {
        node.parent = this.toast;
    }

    getTouchNode(): cc.Node {
        return this.touchNode;
    }

    hideLoading(): void {
        if (this.loadingMask) {
            this.loadingMask.active = false;
        }
    }

    createNodes(loadingPrefab?: cc.Prefab): void {
        const persist = new cc.Node("persist");
        this.addFullScreenWidget(persist);
        this.persist = persist;
        const effects = new cc.Node("effects");
        this.addFullScreenWidget(effects);
        this.effects = effects;
        const toast = new cc.Node("toast");
        this.toast = toast;
        const message = new cc.Node("message");
        this.message = message;
        const touchNode = new cc.Node("TouchNode");
        this.touchNode = touchNode;
        const fadeNode = new cc.Node("fadeNode");
        this.fadeNode = fadeNode;
        this.persist.addChild(effects);
        this.persist.addChild(toast);
        this.persist.addChild(message);
        this.persist.addChild(touchNode);
        this.persist.addChild(fadeNode);
        persist.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        cc.game.addPersistRootNode(persist);
        if (this.loadingMask) {
            this.loadingMask.removeFromParent(true);
            this.loadingMask = null;
        }
        if (loadingPrefab) {
            this.loadingMask = cc.instantiate(loadingPrefab);
        } else {
            this.loadingMask = new cc.Node("loadingMask");
            this.loadingMask.addComponent(cc.BlockInputEvents);
        }
        this.loadingMask.setParent(this.fadeNode);
        this.loadingMask.active = false;
    }

    clear(): void {
        this.map_pages.forEach((pageInfo) => {
            const prefab = pageInfo.prefab;
            const node = pageInfo.node;
            cc.assetManager.releaseAsset(prefab);
            if (node && cc.isValid(node)) {
                node.destroy();
            }
        });
        this.map_pages.clear();
        this.set_onShowPages.clear();
        this.onShowNum = 0;
        this.arr_pageQueue = [];
        if (this.pages) {
            this.pages.destroy();
        }
        this.pages = null;
    }

    hideAllPage(): void {
        this.map_pages.forEach((pageInfo) => {
            const node = pageInfo.node;
            if (cc.isValid(node)) {
                const pageName = node.name;
                this.hidePage(pageName);
            }
        });
    }

    static _instance: PageMgr = null;
}

export default PageMgr._getInstance();
