import ResLoader from "./ResLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResKeeper extends cc.Component {
    caches: Set<any> = new Set();

    onLoad() {
        this.bindSelfAsset();
    }

    get selfAsset() {
        var e;
        return null === (e = this.node._prefab) || void 0 === e ? void 0 : e.asset;
    }

    bindSelfAsset() {
        this.addAsset(this.selfAsset);
    }

    removeSelfAsset() {
        this.caches.delete(this.selfAsset);
    }

    addAsset(e: any) {
        if (!e || !this.isValid || this.caches.has(e)) return e;
        e.addRef();
        this.caches.add(e);
    }

    getBundle(e: string) {
        return ResLoader.getInstance().getBundle(e);
    }

    loadRes(e: string, t: typeof cc.Asset, i: string, n: any) {
        return (async () => {
            var a;
            a = await ResLoader.getInstance().loadRes(e, t, i, n);
            a && this.addAsset(a);
            return a;
        })();
    }

    setSpriteFrame(e: any, t: string, i: string) {
        return (async () => {
            var n, a;
            n = await this.loadRes(t, cc.SpriteFrame, i);
            a = null;
            e instanceof cc.Sprite ? a = e : e.isValid && (a = null == e ? void 0 : e.getComponent(cc.Sprite));
            (null == a ? void 0 : a.isValid) && (a.spriteFrame = n);
        })();
    }

    setSkeleton(e: any, t: string, i: string, n: string) {
        return (async () => {
            var a, o;
            a = await this.loadRes(t, sp.SkeletonData, i);
            o = null;
            e instanceof sp.Skeleton ? o = e : e.isValid && (o = null == e ? void 0 : e.getComponent(sp.Skeleton));
            if (null == o ? void 0 : o.isValid) {
                o.skeletonData = a;
                n && (o.animation = n);
            }
        })();
    }

    removeAsset(e: any) {
        return e && this.caches.delete(e) ? (e.decRef(), e) : e;
    }

    releaseAll(e: boolean = !0) {
        var t = this;
        this.caches.forEach(function (e) {
            t.selfAsset;
            t.removeAsset(e);
        });
    }

    clearAll() {
        this.caches.clear();
    }

    instantiate(e: any, t: cc.Node) {
        var i = cc.instantiate(e);
        return i ? (e instanceof cc.Prefab && this.addAsset(e), t && (i.parent = t), i) : null;
    }

    instantiateByUrl(e: string, t: cc.Node, i: string, n: any) {
        return (async () => {
            var a;
            return (a = await this.loadRes(e, cc.Prefab, i, n)) ? this.instantiate(a, t) : null;
        })();
    }

    onDestroy() {
        this.releaseAll();
    }
}
