import PoolItem from "./PoolItem";

const { ccclass } = cc._decorator;

@ccclass
export default class PrefabPool {
    static _poolMap = new Map<cc.Prefab, cc.Node[]>();
    static _gids = new Map<cc.Prefab, number>();

    static create(e: cc.Prefab, o?: any): cc.Node {
        let n = PrefabPool._poolMap.get(e);
        if (n && n.length > 0) {
            const a = n.pop();
            const r = a.getComponent(PoolItem);
            r.reuse();
            o && r.init(o);
            return a;
        }
        if (null == n) {
            n = new Array<cc.Node>();
            PrefabPool._poolMap.set(e, n);
            PrefabPool._gids.set(e, 0);
        }
        const l = cc.instantiate(e);
        const s = l.getComponent(PoolItem);
        let c = PrefabPool._gids.get(e);
        s.registPool(n, c++);
        PrefabPool._gids.set(e, c);
        console.log("PrefabPool create ", e.name, c);
        o && s.init(o);
        return l;
    }
}
