const { ccclass } = cc._decorator;

@ccclass
export default class PoolManager {
    static initPool(e, t, o) {
        e = new cc.NodePool();
        for (let n = 0; n < t; n++) {
            const i = cc.instantiate(o);
            e.put(i);
        }
    }

    static createItemByPool(e, t) {
        return e.size() > 0 ? e.get() : cc.instantiate(t);
    }

    static recycleToPool(e, t) {
        e.put(t);
    }
}
