import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import EventSystem, { CLOSE_RECONNECT } from "./EventSystem";

class UIHelper {
    pages = new Map<string, any>();
    persist: cc.Node | null = null;
    toast: cc.Node | null = null;
    pagesParent: cc.Node | null = null;
    toastPrefab: cc.Prefab | null = null;
    toastShows = 0;
    networkErrorText = " Network error, please try again ";

    init() {
        var e = new cc.Node(" persist ");
        this.persist = e;
        var t = new cc.Node(" toast ");
        this.toast = t;
        e.addChild(t);
        e.setPosition(cc.v2(cc.winSize.width / 2, cc.winSize.height / 2));
        cc.game.addPersistRootNode(e);
    }

    setToastNode(e: cc.Node) {
        this.toast && (e.parent = this.toast);
    }

    setNetworkErrorText(e: string) {
        this.networkErrorText = e;
    }

    getPagesParent() {
        var e = cc.director.getScene()!.children[0], t = e.getChildByName(" pages ");
        if (t) return t;
        (t = new cc.Node(" pages ")).zIndex = 1;
        e.addChild(t);
        return t;
    }

    showToast(e: string, t?: number) {
        var i, a, o, r = this;
        void 0 === t && (t = .8);
        if (e) if (cc.isValid(this.toastPrefab)) {
            var s = cc.instantiate(this.toastPrefab!);
            this.setToastNode(s);
            var l = s.getChildByName(" content "), c = null === (i = null == l ? void 0 : l.getChildByName(" text ")) || void 0 === i ? void 0 : i.getComponent(cc.Label);
            c && (c.string = e);
            l && (l.width = ((null === (a = null == c ? void 0 : c.node) || void 0 === a ? void 0 : a.width) || 100) + 100);
            s.zIndex = 999;
            s.setPosition(cc.v2(0, 0));
            null == l || l.setPosition(cc.v2(0, 0));
            null === (o = null == c ? void 0 : c.node) || void 0 === o || o.setPosition(cc.v2(0, 0));
            this.toastShows++;
            s.runAction(cc.sequence(cc.moveBy(t, 0, 100), cc.delayTime(1), cc.fadeOut(.3), cc.callFunc(function() {
                s.parent = null;
                s.destroy();
                r.toastShows--;
            })));
        } else cc.loader.loadRes(BUSINESS_COMMON_CONFIG.toastPrefabPath, cc.Prefab, function(i, n) {
            if (!i) {
                r.toastPrefab = n;
                r.showToast(e, t);
            }
        });
    }

    showPage(e: string, t: any) {
        var i = this, n = this.pages.get(e);
        if (n) {
            var a = n.node, o = n.prefab;
            a && a.isValid || (a = cc.instantiate(o));
            this.addPage(e, a, a, o, t);
        } else cc.resources.load(" BPR_pages/ BPR_ " + e, cc.Prefab, function(n, a) {
            n || i.addPage(e, null, cc.instantiate(a), a, t);
        });
    }

    addPage(e: string, t: cc.Node | null, i: cc.Node, n: cc.Prefab, a: any) {
        var o;
        t && t.isValid || (t = i);
        var r = this.getPagesParent();
        r.getChildByName(e) || r.addChild(t);
        t.name = e;
        t.zIndex = 99;
        var s = t.getComponent(e + " Ctrl ") || t.getComponent(" BasePageCtrl ");
        null === (o = null == s ? void 0 : (s as any)._init) || void 0 === o || o.call(s, a);
        this.pages.set(e, {
            node: t,
            prefab: n
        });
    }

    hidePage(e: string) {
        var t = this.pages.get(e);
        if (null == t ? void 0 : t.node) {
            t.node.destroy();
            t.node = null;
        }
    }

    httpErr(e: any, t: any) {
        this.showToast(this.networkErrorText);
        this.showPage(" ReconnectPage ", {
            name: " ReconnectPage ",
            callback: t
        });
    }

    reconnectSuc() {
        this.hidePage(" LoadingPage ");
        EventSystem.trigger(CLOSE_RECONNECT);
    }

    reconnectFai() {
        this.hidePage(" LoadingPage ");
    }
}

export default new UIHelper();
