import Singleton from "./Singleton";

export default class ResLoader extends Singleton {
    remoteUrl: string = "";

    getBundle(e: string) {
        var t = this;
        return new Promise<any>(function (i) {
            var n = e ? cc.assetManager.getBundle(e) : cc.assetManager.resources;
            if (n) i(n);
            else {
                var r = cc.sys.isBrowser || cc.sys.isNative ? "" : t.remoteUrl;
                cc.assetManager.loadBundle(r + e, {
                    onProgress: function () {
                    },
                    onFileProgress: function () {
                    }
                }, function (e, n) {
                    var r;
                    e && console.log(e);
                    if ((null === (r = null == n ? void 0 : n.deps) || void 0 === r ? void 0 : r.length) > 0) {
                        var s = n.deps.length;
                        n.deps.forEach(function (e) {
                            return (async () => {
                                await t.getBundle(e);
                                0 == --s && i(n);
                            })();
                        });
                    } else i(n);
                });
            }
        });
    }

    loadRes(e: string, t: typeof cc.Asset, i: string, n: any) {
        var r = this;
        return new Promise<any>(function (s) {
            (i ? r.getBundle(i) : Promise.resolve(cc.resources)).then(function (i) {
                if (i) {
                    var a = i.get(e, t);
                    if (a) s(a);
                    else i.load(e, t, function (e, t) {
                        n && n(e, t);
                    }, function (e, t) {
                        e && console.error(e);
                        s(t);
                    });
                } else s(null);
            });
        });
    }

    setSpriteFrame(e: any, t: string, i: string) {
        return (async () => {
            var n, a;
            n = await this.loadRes(t, cc.SpriteFrame, i);
            a = null;
            e instanceof cc.Sprite ? a = e : (null == e ? void 0 : e.isValid) && (a = null == e ? void 0 : e.getComponent(cc.Sprite));
            (null == a ? void 0 : a.isValid) && (a.spriteFrame = n);
        })();
    }

    setSkeleton(e: any, t: string, i: string, n: string) {
        return (async () => {
            var a, r;
            a = await this.loadRes(t, sp.SkeletonData, i);
            r = null;
            if (null == (r = e instanceof sp.Skeleton ? e : null == e ? void 0 : e.getComponent(sp.Skeleton)) ? void 0 : r.isValid) {
                r.skeletonData = a;
                r.animation = n;
            }
        })();
    }

    instantiate(e: any, t: cc.Node) {
        var i = cc.instantiate(e);
        return i ? (t && (i.parent = t), i) : null;
    }

    instantiateByUrl(e: string, t: cc.Node, i: string, n: any) {
        return (async () => {
            var a;
            return (a = await this.loadRes(e, cc.Prefab, i, n)) ? this.instantiate(a, t) : null;
        })();
    }
}
