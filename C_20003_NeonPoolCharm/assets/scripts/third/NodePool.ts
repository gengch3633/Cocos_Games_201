import EngineUtil from "./EngineUtil";

const i: any = {};
const a: any = {};

export default class NodePool {
    _pathList: any = null;
    static _instance = null;

    static get Instance() {
        null == NodePool._instance && (NodePool._instance = new NodePool());
        return NodePool._instance;
    }

    loadPool(e, t) {
        const o = this;
        Array.isArray(e) || (e = [e]);
        const n = [];
        for (let i = 0; i < e.length; i++) n.push(this._pathList[e[i]]);
        cc.resources.load(n, cc.Prefab, function (e) {
            Array.isArray(e) || (e = [e]);
            for (let n = 0; n < e.length; n++) {
                const i = e[n].name;
                o.hasPool(i) || o.initPool(i, e[n]);
            }
            t && t();
        });
    }

    addPath(e) {
        this._pathList = this._pathList || {};
        Array.isArray(e) || (e = [e]);
        for (let t = 0; t < e.length; t++) {
            const o = cc.path.basename(e[t]);
            this._pathList[o] = this._pathList[o] || e[t];
        }
        console.log(this._pathList);
    }

    putNode(e, t) {
        if (cc.isValid(t)) {
            const o = i[e];
            if (o) {
                if (!(o.findIndex(function (e) {
                    return e == t;
                }) >= 0)) {
                    t.stopAllActions();
                    t.removeFromParent(true);
                    t.x = 0;
                    t.y = 0;
                    t.scale = 1;
                    t.opacity = 255;
                    t.active = false;
                    o.push(t);
                }
            } else console.error("putNode: pool %s not found", e);
        } else console.error("putNode: node param is invalid");
    }

    getNode(e) {
        const t = i[e];
        if (!t) {
            console.error("getNode: pool %s not found", e);
            return null;
        }
        let o = t.length > 0 ? t.pop() : cc.instantiate(a[e]);
        (o = cc.isValid(o) ? o : cc.instantiate(a[e])).active = true;
        o.x = 0;
        o.y = 0;
        return o;
    }

    getPool() {
        return i;
    }

    hasPool(e) {
        return a[e] && a[e].isValid;
    }

    reset() {
        if (i) {
            const e = i;
            for (const t in e) for (let o = e[t]; o.length > 0;) EngineUtil.destroyNode(o.pop());
        }
    }

    _test() {
        console.log(i);
    }

    initPool(e, t, o) {
        if (undefined === t) {
            t = 1;
        }
        if (undefined === o) {
            o = "";
        }
        o || (o = e.name);
        if (!this.hasPool(o)) {
            if (i[o]) for (let r = 0, l = i[o]; r < l.length; r++) {
                const s = l[r];
                EngineUtil.destroyNode(s);
            }
            i[o] = [];
            a[o] = e;
            for (let c = 0; c < t; c++) {
                const u = cc.instantiate(e);
                u.active = false;
                i[o].push(u);
            }
        }
    }
}
