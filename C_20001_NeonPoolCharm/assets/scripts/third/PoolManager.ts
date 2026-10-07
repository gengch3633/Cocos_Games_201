const { ccclass } = cc._decorator;

@ccclass
export default class PoolManager {
    static initPool(e: cc.NodePool, t: number, o: cc.Prefab): void {
        e = new cc.NodePool();
        for (let n = 0; n < t; n++) {
            const i = cc.instantiate(o);
            e.put(i);
        }
    }

    static createItemByPool(e: cc.NodePool, t: cc.Prefab): cc.Node {
        return e.size() > 0 ? e.get() : cc.instantiate(t);
    }

    static recycleToPool(e: cc.NodePool, t: cc.Node): void {
        e.put(t);
    }
}
