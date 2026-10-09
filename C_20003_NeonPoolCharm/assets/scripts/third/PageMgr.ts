import EngineUtil from "./EngineUtil";

class PageMgr {
    map_pages = new Map();
    arr_pageQueue = [];
    onShowNum = 0;
    set_onShowPages = new Set();
    pages = null;
    persist = null;
    effects = null;
    toast = null;
    message = null;
    touchNode = null;
    fadeNode = null;
    loadingMask = null;

    static _instance = null;

    getPagesParent() {
        const e = cc.director.getScene().children[0];
        let t = e.getChildByName("pages");
        if (t) return t;
        (t = new cc.Node("pages")).zIndex = 1;
        e.addChild(t);
        return t;
    }

    init(e) {
        this.createNodes(e);
    }

    hidePage(e) {
        if (e) {
            const t = this.map_pages.get(e);
            if (t) {
                const o = t.node;
                if (o) {
                    const n = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl");
                    const i = n._reuse;
                    const a = n._inQueue;
                    this.set_onShowPages.delete(o);
                    if (i) n.hide(); else {
                        o.destroy();
                        t.node = null;
                    }
                    if (a) {
                        this.onShowNum--;
                        this.onShowNum < 0 && (this.onShowNum = 0);
                        const r = this.arr_pageQueue.shift();
                        if (r) {
                            const l = r.name;
                            const s = r.data;
                            this.showPage(l, s);
                        }
                    }
                } else console.error("class:pageMgr.fun:hidePage没有页面信息node" + e);
            } else console.error("class:pageMgr.fun:hidePage没有页面信息" + e);
        } else console.error("class:pageMgr.fun:hidePage页面名称为空");
    }

    showPage(e, t) {
        if (e) {
            const o = this.map_pages.get(e);
            if (o) {
                const n = o.node;
                const i = o.prefab;
                let a = n;
                n && n.isValid || (a = cc.instantiate(i));
                this.addPage(e, n, a, i, t);
            } else this.loadPage(e, t);
        } else console.error("class:pageMgr.showPage页面名称为空");
    }

    createEffectsNode() {
        const e = new cc.Node("effects");
        this.effects = e;
        e.setPosition(cc.v2(0, 0));
        cc.director.getScene().children[0].addChild(e, 99);
    }

    addPage(e, t, o, n, i) {
        let a = null;
        (a = o.getComponent(e + "Ctrl") || o.getComponent("BasePageCtrl")) || (a = o.addComponent(e + "Ctrl"));
        if (!a._only || !this.hasShowPage(e)) {
            let r = 0;
            if (a._inQueue) {
                if (this.onShowNum > 0) {
                    this.arr_pageQueue.push({
                        name: e,
                        data: i
                    });
                    return;
                }
                this.onShowNum++;
            } else r = this.getPageIndex();
            t && t.isValid || (t = o);
            const l = t.getComponent(e + "Ctrl") || t.getComponent("BasePageCtrl");
            a._reuse ? t.active = true : t = o;
            const s = this.getPagesParent();
            this.getPagesParent().getChildByName(e) || s.addChild(t);
            t.zIndex = r;
            l._init(i);
            this.set_onShowPages.add(t);
            this.map_pages.set(e, {
                node: t,
                prefab: n
            });
        }
    }

    loadPage(e, t) {
        const o = this;
        cc.resources.load("pages/" + e, cc.Prefab, function (i, a) {
            i ? EngineUtil.error("class:pageMgr.fun:showPage加载页面错误", e, i) : o.addPage(e, null, cc.instantiate(a), a, t);
        });
    }

    static _getInstance() {
        if (this._instance) return this._instance;
        this._instance = new PageMgr();
        return this._instance;
    }

    getMessageNode() {
        return this.message;
    }

    hasShowPage(e) {
        const t = this.map_pages.get(e);
        if (!t) return false;
        const o = t.node;
        return !!o && !!o.isValid && !!o.active;
    }

    getPageIndex() {
        let e = 0;
        this.set_onShowPages.forEach(function (t) {
            const o = t.zIndex;
            o >= e && (e = o + 1);
        });
        return e;
    }

    showLoading() {
        this.loadingMask && (this.loadingMask.active = true);
    }

    hasPage(e) {
        return !!this.map_pages.get(e);
    }

    addFullScreenWidget(e) {
        const t = e.getComponent(cc.Widget);
        const o = t != null ? t : e.addComponent(cc.Widget);
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

    setToastNode(e) {
        e.parent = this.toast;
    }

    getTouchNode() {
        return this.touchNode;
    }

    hideLoading() {
        this.loadingMask && (this.loadingMask.active = false);
    }

    createNodes(e) {
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
        if (e) this.loadingMask = cc.instantiate(e); else {
            this.loadingMask = new cc.Node("loadingMask");
            this.loadingMask.addComponent(cc.BlockInputEvents);
        }
        this.loadingMask.setParent(this.fadeNode);
        this.loadingMask.active = false;
    }

    clear() {
        this.map_pages.forEach(function (e) {
            const t = e.prefab;
            const o = e.node;
            cc.assetManager.releaseAsset(t);
            o && cc.isValid(o) && o.destroy();
        });
        this.map_pages.clear();
        this.set_onShowPages.clear();
        this.onShowNum = 0;
        this.arr_pageQueue = [];
        this.pages && this.pages.destroy();
        this.pages = null;
    }

    hideAllPage() {
        const e = this;
        this.map_pages.forEach(function (t) {
            t.prefab;
            const o = t.node;
            if (cc.isValid(o)) {
                const n = o.name;
                e.hidePage(n);
            }
        });
    }
}

export default PageMgr._getInstance();
