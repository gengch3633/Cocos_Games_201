const { ccclass } = cc._decorator;

@ccclass
export default class PoolManager {
    static initPool(pool: cc.NodePool, count: number, prefab: cc.Prefab): void {
        pool = new cc.NodePool();
        for (let i = 0; i < count; i++) {
            const node = cc.instantiate(prefab);
            pool.put(node);
        }
    }

    static createItemByPool(pool: cc.NodePool, prefab: cc.Prefab): cc.Node {
        return pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
    }

    static recycleToPool(pool: cc.NodePool, node: cc.Node): void {
        pool.put(node);
    }
}
