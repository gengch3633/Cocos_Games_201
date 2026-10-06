import Singleton from "./Singleton";
import ResKeeper from "./ResKeeper";
import ResLoader from "./ResLoader";

export default class ResMgr extends Singleton {
    resLoader: ResLoader = ResLoader.getInstance();

    get remoteUrl() {
        return this.resLoader.remoteUrl;
    }

    set remoteUrl(e: string) {
        this.resLoader.remoteUrl = e;
    }

    getBundle(e: string) {
        return this.resLoader.getBundle(e);
    }

    loadRes(e: string, t: typeof cc.Asset, i: any = null, n?: string, a?: any) {
        var o = i ? this.getKeeper(i) : this.resLoader;
        return null == o ? void 0 : o.loadRes(e, t, n, a);
    }

    setSpriteFrame(e: any, t: string, i: string, n: any = null) {
        var a = n ? this.getKeeper(n) : this.getKeeper(e, !0);
        return null == a ? void 0 : a.setSpriteFrame(e, t, i);
    }

    setSkeleton(e: any, t: string, i: string, n: string, r: any = null) {
        return (async () => {
            var a;
            return null == (a = r ? this.getKeeper(r) : this.getKeeper(e, !0)) ? void 0 : a.setSkeleton(e, t, i, n);
        })();
    }

    instantiate(e: any, t: cc.Node) {
        var i = cc.instantiate(e);
        return i ? (t && t.isValid && i.parent !== t && (i.parent = t), i) : null;
    }

    instantiateByUrl(e: string, t: cc.Node, i: string, n: any) {
        return (async () => {
            var a;
            return (a = await this.resLoader.loadRes(e, cc.Prefab, i, n)) ? this.instantiate(a, t) : null;
        })();
    }

    getKeeper(e: any, t: boolean = !1) {
        if (!e || !e.isValid) return null;
        var i = e.getComponent(ResKeeper);
        if (i) return i;
        if (t) return e.addComponent(ResKeeper);
        var n = e instanceof cc.Node ? e : e.node;
        return this.getKeeper(n.parent, t);
    }
}
