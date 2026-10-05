import EngineUtil from "./EngineUtil";

const poolMap: Record<string, cc.Node[]> = {};
const prefabMap: Record<string, cc.Prefab> = {};

export default class NodePool {
    private static _instance: NodePool = null;

    private _pathList: Record<string, string> = null;

    static get Instance(): NodePool {
        if (NodePool._instance == null) {
            NodePool._instance = new NodePool();
        }
        return NodePool._instance;
    }

    loadPool(names: string | string[], callback?: () => void): void {
        const list = Array.isArray(names) ? names : [names];
        const paths: string[] = [];
        for (let i = 0; i < list.length; i++) {
            paths.push(this._pathList[list[i]]);
        }
        cc.resources.load(paths, cc.Prefab, (err, assets: cc.Prefab | cc.Prefab[]) => {
            const prefabs = Array.isArray(assets) ? assets : [assets];
            for (let i = 0; i < prefabs.length; i++) {
                const name = prefabs[i].name;
                if (!this.hasPool(name)) {
                    this.initPool(name, prefabs[i]);
                }
            }
            callback?.();
        });
    }

    addPath(paths: string | string[]): void {
        this._pathList = this._pathList || {};
        const list = Array.isArray(paths) ? paths : [paths];
        for (let i = 0; i < list.length; i++) {
            const baseName = cc.path.basename(list[i]);
            this._pathList[baseName] = this._pathList[baseName] || list[i];
        }
        console.log(this._pathList);
    }

    putNode(poolName: string, node: cc.Node): void {
        if (cc.isValid(node)) {
            const pool = poolMap[poolName];
            if (pool) {
                if (pool.findIndex((item) => item == node) >= 0) {
                    return;
                }
                node.stopAllActions();
                node.removeFromParent(true);
                node.x = 0;
                node.y = 0;
                node.scale = 1;
                node.opacity = 255;
                node.active = false;
                pool.push(node);
            } else {
                console.error("putNode: pool %s not found", poolName);
            }
        } else {
            console.error("putNode: node param is invalid");
        }
    }

    getNode(poolName: string): cc.Node {
        const pool = poolMap[poolName];
        if (!pool) {
            console.error("getNode: pool %s not found", poolName);
            return null;
        }
        let node = pool.length > 0 ? pool.pop() : cc.instantiate(prefabMap[poolName]);
        node = cc.isValid(node) ? node : cc.instantiate(prefabMap[poolName]);
        node.active = true;
        node.x = 0;
        node.y = 0;
        return node;
    }

    getPool(): Record<string, cc.Node[]> {
        return poolMap;
    }

    hasPool(poolName: string): boolean {
        return prefabMap[poolName] && prefabMap[poolName].isValid;
    }

    reset(): void {
        if (poolMap) {
            for (const key in poolMap) {
                const pool = poolMap[key];
                while (pool.length > 0) {
                    EngineUtil.destroyNode(pool.pop());
                }
            }
        }
    }

    _test(): void {
        console.log(poolMap);
    }

    initPool(nameOrPrefab: string | cc.Prefab, prefabOrCount?: cc.Prefab | number, poolName = ""): void {
        let prefab: cc.Prefab;
        let count = 1;
        let name = poolName;
        if (typeof nameOrPrefab === "string") {
            name = nameOrPrefab;
            prefab = prefabOrCount as cc.Prefab;
        } else {
            prefab = nameOrPrefab;
            count = typeof prefabOrCount === "number" ? prefabOrCount : 1;
            if (!name) {
                name = prefab.name;
            }
        }
        if (!name) {
            name = prefab.name;
        }
        if (!this.hasPool(name)) {
            if (poolMap[name]) {
                for (const node of poolMap[name]) {
                    EngineUtil.destroyNode(node);
                }
            }
            poolMap[name] = [];
            prefabMap[name] = prefab;
            for (let i = 0; i < count; i++) {
                const node = cc.instantiate(prefab);
                node.active = false;
                poolMap[name].push(node);
            }
        }
    }
}
