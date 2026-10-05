import EngineUtil from "./EngineUtil";

interface PageEntry {
    node: cc.Node;
    prefab: cc.Prefab;
}

interface PageQueueItem {
    name: string;
    data: any;
}

class PageMgr {
    map_pages: Map<string, PageEntry> = new Map();
    arr_pageQueue: PageQueueItem[] = [];
    onShowNum: number = 0;
    set_onShowPages: Set<cc.Node> = new Set();
    pages: cc.Node = null;
    persist: cc.Node = null;
    effects: cc.Node = null;
    toast: cc.Node = null;
    message: cc.Node = null;
    touchNode: cc.Node = null;
    fadeNode: cc.Node = null;
    loadingMask: cc.Node = null;

    private static _instance: PageMgr = null;

    private static _getInstance(): PageMgr {
        if (PageMgr._instance) {
            return PageMgr._instance;
        }
        PageMgr._instance = new PageMgr();
        return PageMgr._instance;
    }

    getPagesParent(): cc.Node {
        const e = cc.director.getScene().children[0];
        let t = e.getChildByName("pages");
        if (t) {
            return t;
        }
        t = new cc.Node("pages");
        t.zIndex = 1;
        e.addChild(t);
        return t;
    }

    init(e?: cc.Prefab): void {
        this.createNodes(e);
    }

    hidePage(e: string): void {
        if (e) {
            const t = this.map_pages.get(e);
            if (t) {
                const o = t.node;
                if (o) {
                    const n: any = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl");
                    const i = n._reuse;
                    const a = n._inQueue;
                    this.set_onShowPages.delete(o);
                    if (i) {
                        n.hide();
                    } else {
                        o.destroy();
                        t.node = null;
                    }
                    if (a) {
                        this.onShowNum--;
                        if (this.onShowNum < 0) {
                            this.onShowNum = 0;
                        }
                        const r = this.arr_pageQueue.shift();
                        if (r) {
                            const l = r.name;
                            const s = r.data;
                            this.showPage(l, s);
                        }
                    }
                } else {
                    console.error("class:pageMgr.fun:hidePage没有页面信息node" + e);
                }
            } else {
                console.error("class:pageMgr.fun:hidePage没有页面信息" + e);
            }
        } else {
            console.error("class:pageMgr.fun:hidePage页面名称为空");
        }
    }

    showPage(e: string, t?: any): void {
        if (e) {
            const o = this.map_pages.get(e);
            if (o) {
                const n = o.node;
                const i = o.prefab;
                let a = n;
                if (!n || !n.isValid) {
                    a = cc.instantiate(i);
                }
                this.addPage(e, n, a, i, t);
            } else {
                this.loadPage(e, t);
            }
        } else {
            console.error("class:pageMgr.showPage页面名称为空");
        }
    }

    createEffectsNode(): void {
        const e = new cc.Node("effects");
        this.effects = e;
        e.setPosition(cc.v2(0, 0));
        cc.director.getScene().children[0].addChild(e, 99);
    }

    addPage(e: string, t: cc.Node, o: cc.Node, n: cc.Prefab, i?: any): void {
        let a: any = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl");
        if (!a) {
            a = o.addComponent(e + "Ctrl");
        }
        if (!a._only || !this.hasShowPage(e)) {
            let r = 0;
            if (a._inQueue) {
                if (this.onShowNum > 0) {
                    this.arr_pageQueue.push({
                        name: e,
                        data: i,
                    });
                    return;
                }
                this.onShowNum++;
            } else {
                r = this.getPageIndex();
            }
            if (!t || !t.isValid) {
                t = o;
            }
            const l: any = t.getComponent(e + "Ctrl") || t.getComponent("BasePageCtrl");
            if (a._reuse) {
                t.active = true;
            } else {
                t = o;
            }
            const s = this.getPagesParent();
            if (!this.getPagesParent().getChildByName(e)) {
                s.addChild(t);
            }
            t.zIndex = r;
            l._init(i);
            this.set_onShowPages.add(t);
            this.map_pages.set(e, {
                node: t,
                prefab: n,
            });
        }
    }

    loadPage(e: string, t?: any): void {
        cc.resources.load("pages/" + e, cc.Prefab, (err: Error, prefab: cc.Prefab) => {
            if (err) {
                EngineUtil.error("class:pageMgr.fun:showPage加载页面错误", e, err);
            } else {
                this.addPage(e, null, cc.instantiate(prefab), prefab, t);
            }
        });
    }

    getMessageNode(): cc.Node {
        return this.message;
    }

    hasShowPage(e: string): boolean {
        const t = this.map_pages.get(e);
        if (!t) {
            return false;
        }
        const o = t.node;
        return !!o && !!o.isValid && !!o.active;
    }

    getPageIndex(): number {
        let e = 0;
        this.set_onShowPages.forEach((t) => {
            const o = t.zIndex;
            if (o >= e) {
                e = o + 1;
            }
        });
        return e;
    }

    showLoading(): void {
        if (this.loadingMask) {
            this.loadingMask.active = true;
        }
    }

    hasPage(e: string): boolean {
        return !!this.map_pages.get(e);
    }

    addFullScreenWidget(e: cc.Node): void {
        const o = e.getComponent(cc.Widget) ?? e.addComponent(cc.Widget);
        o.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
        o.isAlignBottom = true;
        o.isAlignLeft = true;
        o.isAlignRight = true;
        o.isAlignTop = true;
        o.bottom = 0;
        o.left = 0;
        o.right = 0;
        o.top = 0;
        o.updateAlignment();
    }

    setToastNode(e: cc.Node): void {
        e.parent = this.toast;
    }

    getTouchNode(): cc.Node {
        return this.touchNode;
    }

    hideLoading(): void {
        if (this.loadingMask) {
            this.loadingMask.active = false;
        }
    }

    createNodes(e?: cc.Prefab): void {
        const t = new cc.Node("persist");
        this.addFullScreenWidget(t);
        this.persist = t;
        const o = new cc.Node("effects");
        this.addFullScreenWidget(o);
        this.effects = o;
        const n = new cc.Node("toast");
        this.toast = n;
        const i = new cc.Node("message");
        this.message = i;
        const a = new cc.Node("TouchNode");
        this.touchNode = a;
        const r = new cc.Node("fadeNode");
        this.fadeNode = r;
        this.persist.addChild(o);
        this.persist.addChild(n);
        this.persist.addChild(i);
        this.persist.addChild(a);
        this.persist.addChild(r);
        t.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        cc.game.addPersistRootNode(t);
        if (this.loadingMask) {
            this.loadingMask.removeFromParent(true);
            this.loadingMask = null;
        }
        if (e) {
            this.loadingMask = cc.instantiate(e);
        } else {
            this.loadingMask = new cc.Node("loadingMask");
            this.loadingMask.addComponent(cc.BlockInputEvents);
        }
        this.loadingMask.setParent(this.fadeNode);
        this.loadingMask.active = false;
    }

    clear(): void {
        this.map_pages.forEach((entry) => {
            const prefab = entry.prefab;
            const node = entry.node;
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
        this.map_pages.forEach((entry) => {
            const o = entry.node;
            if (cc.isValid(o)) {
                const n = o.name;
                this.hidePage(n);
            }
        });
    }
}

export default PageMgr._getInstance();
