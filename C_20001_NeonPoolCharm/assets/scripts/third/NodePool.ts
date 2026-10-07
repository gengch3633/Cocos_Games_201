import EngineUtil from "./EngineUtil";

const poolMap: Record<string, cc.Node[]> = {};
const prefabMap: Record<string, cc.Prefab> = {};

class NodePool {
    private static _instance: NodePool = null;
    _pathList: Record<string, string> = null;

    static get Instance(): NodePool {
        if (NodePool._instance == null) {
            NodePool._instance = new NodePool();
        }
        return NodePool._instance;
    }

    loadPool(paths: string | string[], callback?: () => void): void {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        const loadPaths: string[] = [];
        for (let i = 0; i < paths.length; i++) {
            loadPaths.push(this._pathList[paths[i]]);
        }
        cc.resources.load(loadPaths, cc.Prefab, (assets: cc.Prefab | cc.Prefab[]) => {
            if (!Array.isArray(assets)) {
                assets = [assets];
            }
            for (let i = 0; i < assets.length; i++) {
                const name = assets[i].name;
                if (!this.hasPool(name)) {
                    this.initPool(name, assets[i]);
                }
            }
            callback && callback();
        });
    }

    addPath(paths: string | string[]): void {
        this._pathList = this._pathList || {};
        if (!Array.isArray(paths)) {
            paths = [paths];
        }
        for (let i = 0; i < paths.length; i++) {
            const basename = cc.path.basename(paths[i]);
            this._pathList[basename] = this._pathList[basename] || paths[i];
        }
        console.log(this._pathList);
    }

    putNode(poolName: string, node: cc.Node): void {
        if (cc.isValid(node)) {
            const pool = poolMap[poolName];
            if (pool) {
                if (
                    !(
                        pool.findIndex((item) => {
                            return item == node;
                        }) >= 0
                    )
                ) {
                    node.stopAllActions();
                    node.removeFromParent(true);
                    node.x = 0;
                    node.y = 0;
                    node.scale = 1;
                    node.opacity = 255;
                    node.active = false;
                    pool.push(node);
                }
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

    initPool(e: cc.Prefab | string, t: number | cc.Prefab = 1, o: string = ""): void {
        if (t === undefined) {
            t = 1;
        }
        if (o === undefined) {
            o = "";
        }
        if (!o) {
            o = (e as cc.Prefab).name;
        }
        if (!this.hasPool(o)) {
            if (poolMap[o]) {
                for (const node of poolMap[o]) {
                    EngineUtil.destroyNode(node);
                }
            }
            poolMap[o] = [];
            prefabMap[o] = e as cc.Prefab;
            const count = typeof t === "number" ? t : 0;
            for (let c = 0; c < count; c++) {
                const node = cc.instantiate(e as cc.Prefab);
                node.active = false;
                poolMap[o].push(node);
            }
        }
    }
}

export default NodePool;
