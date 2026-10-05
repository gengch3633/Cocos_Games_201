import PoolItem from "./PoolItem";

const { ccclass } = cc._decorator;

@ccclass
export default class PrefabPool {
    private static _poolMap = new Map<cc.Prefab, cc.Node[]>();
    private static _gids = new Map<cc.Prefab, number>();

    static create(prefab: cc.Prefab, data?: any): cc.Node {
        let pool = PrefabPool._poolMap.get(prefab);
        if (pool && pool.length > 0) {
            const node = pool.pop();
            const item = node.getComponent(PoolItem);
            item.reuse();
            if (data) {
                item.init(data);
            }
            return node;
        }
        if (pool == null) {
            pool = [];
            PrefabPool._poolMap.set(prefab, pool);
            PrefabPool._gids.set(prefab, 0);
        }
        const node = cc.instantiate(prefab);
        const item = node.getComponent(PoolItem);
        let gid = PrefabPool._gids.get(prefab);
        item.registPool(pool, gid++);
        PrefabPool._gids.set(prefab, gid);
        console.log("PrefabPool create ", prefab.name, gid);
        if (data) {
            item.init(data);
        }
        return node;
    }
}
