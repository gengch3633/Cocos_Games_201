// @ts-nocheck
import Pool from "./Pool";
import ResMgr from "./ResMgr";

export default class NodePool extends Pool {
    eventTarget = new cc.EventTarget();
    isDelayPut = false;

    static EventType = {
        UNUSE: "NodePool_Event_UNUSE",
        USED: "NodePool_Event_USED",
    };

    constructor(capacity = 0) {
        super(capacity);
        this.setValidAction(this.isValid.bind(this));
    }

    async setCreateActionByAssetUrl(url, bundle = "", parent = null) {
        const prefab = await ResMgr.default.getInstance().loadRes(url, cc.Prefab, null, bundle);
        if (prefab) {
            this.setCreateAction(() => ResMgr.default.getInstance().instantiate(prefab, parent));
            return true;
        }
        return false;
    }

    setCloneAsset(asset, parent = null) {
        if (asset) {
            if (asset instanceof cc.Node) {
                asset.active = false;
            }
            return this.setCreateAction(() => ResMgr.default.getInstance().instantiate(asset, parent));
        }
    }

    setCreateAction(action) {
        return super.setCreateAction(action);
    }

    setValidAction(action) {
        return super.setValidAction(action);
    }

    get() {
        const node = super.get();
        if (node) {
            node.active = false;
            this.eventTarget.emit(NodePool.EventType.USED, node, this);
            node.emit(NodePool.EventType.USED, node, this);
            return node;
        }
        return null;
    }

    setInitSize(size, callback = null) {
        for (let i = 0; i < size; i++) {
            const node = this.get();
            callback && callback(node);
            this.put(node);
        }
    }

    put(node) {
        if (!node || !node.isValid || !cc.isValid(node, true)) {
            return false;
        }
        const doPut = () => {
            if (!super.put(node)) {
                return false;
            }
            if (cc.isValid(node, true)) {
                node.active = false;
            }
            this.eventTarget.emit(NodePool.EventType.UNUSE, node, this);
            node?.emit(NodePool.EventType.UNUSE, node, this);
            return true;
        };
        return this.isDelayPut ? (setTimeout(doPut, 0), true) : doPut();
    }

    put2(node) {
        if (!this.validAction(node)) {
            const index = this.lendArr.indexOf(node);
            if (index >= 0) {
                this.lendArr[index] = null;
            }
            return false;
        }
        if (this.arr.indexOf(node) >= 0) {
            return false;
        }
        const lendIndex = this.lendArr.indexOf(node);
        if (lendIndex >= 0) {
            this.lendArr[lendIndex] = null;
        }
        this.arr.push(node);
        node.active = false;
        this.eventTarget.emit(NodePool.EventType.UNUSE, node, this);
        node?.emit(NodePool.EventType.UNUSE, node, this);
        return true;
    }

    isValid(node) {
        return node && node.isValid && cc.isValid(node, true);
    }

    clear() {
        while (this.lendArr?.length > 0) {
            this.put(this.lendArr.pop());
        }
        while (this.arr?.length > 0) {
            this.arr.pop()?.destroy();
        }
    }
}
