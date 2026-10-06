import ResMgr from "./ResMgr";
import Pool from "./Pool";

export default class NodePool extends Pool {
    static EventType = {
        UNUSE: " NodePool_Event_UNUSE ",
        USED: " NodePool_Event_USED "
    };

    eventTarget: cc.EventTarget = new cc.EventTarget();
    isDelayPut: boolean = !1;

    constructor(t: number = 0) {
        super(t);
        this.setValidAction(this.isValid);
    }

    setCreateActionByAssetUrl(e: string, t: string = " ", i: any = null) {
        return (async () => {
            var n = await ResMgr.getInstance().loadRes(e, cc.Prefab, null, t);
            return n ? (this.setCreateAction(function () {
                return ResMgr.getInstance().instantiate(n, i);
            }), !0) : !1;
        })();
    }

    setCloneAsset(e: any, t: any = null) {
        if (e) {
            e instanceof cc.Node && (e.active = !1);
            return this.setCreateAction(function () {
                return ResMgr.getInstance().instantiate(e, t);
            });
        }
    }

    setCreateAction(t: () => any) {
        return super.setCreateAction(t);
    }

    setValidAction(t: (e: any) => boolean) {
        return super.setValidAction(t);
    }

    get() {
        var i = super.get();
        return i ? (i.active = !1, this.eventTarget.emit(NodePool.EventType.USED, i, this), i.emit(NodePool.EventType.USED, i, this),
        i) : null;
    }

    setInitSize(e: number, t: ((n: any) => void) | null = null) {
        for (var i = 0; i < e; i++) {
            var n = this.get();
            t && t(n);
            this.put(n);
        }
    }

    put(i: any) {
        var n = this;
        if (!i || !i.isValid || !cc.isValid(i, !0)) return !1;
        var a = function () {
            return !!Pool.prototype.put.call(n, i) && (cc.isValid(i, !0) && (i.active = !1), n.eventTarget.emit(NodePool.EventType.UNUSE, i, n),
            null == i || i.emit(NodePool.EventType.UNUSE, i, n), !0);
        };
        return this.isDelayPut ? (setTimeout(a, 0), !0) : a();
    }

    put2(e: any) {
        if (!this.validAction(e)) {
            var i = this.lendArr.indexOf(e);
            i >= 0 && (this.lendArr[i] = null);
            return !1;
        }
        if (this.arr.indexOf(e) >= 0) return !1;
        var n = this.lendArr.indexOf(e);
        n >= 0 && (this.lendArr[n] = null);
        this.arr.push(e);
        e.active = !1;
        this.eventTarget.emit(NodePool.EventType.UNUSE, e, this);
        null == e || e.emit(NodePool.EventType.UNUSE, e, this);
        return !0;
    }

    isValid(e: any) {
        return e && e.isValid && cc.isValid(e, !0);
    }

    clear() {
        for (var e, t, i, n; (null === (e = null == this ? void 0 : this.lendArr) || void 0 === e ? void 0 : e.length) > 0;) this.put(this.lendArr.pop());
        for (; (null === (t = null == this ? void 0 : this.arr) || void 0 === t ? void 0 : t.length) > 0;) null === (n = null === (i = null == this ? void 0 : this.arr) || void 0 === i ? void 0 : i.pop()) || void 0 === n || n.destroy();
    }
}
