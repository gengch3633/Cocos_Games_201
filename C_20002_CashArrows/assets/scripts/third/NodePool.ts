import Pool from "./Pool";
import ResMgr from "./ResMgr";

export default class NodePool extends Pool<cc.Node> {
    static EventType = {
        UNUSE: " NodePool_Event_UNUSE ",
        USED: " NodePool_Event_USED "
    };

    eventTarget: cc.EventTarget = new cc.EventTarget();
    isDelayPut: boolean = false;

    constructor(capacity: number = 0) {
        super(capacity);
        this.setValidAction(this.isValid);
    }

    async setCreateActionByAssetUrl(url: string, bundleName: string = " ", parent: cc.Node = null): Promise<boolean> {
        const prefab = await ResMgr.getInstance().loadRes(url, cc.Prefab, null, bundleName);
        if (prefab) {
            this.setCreateAction(() => ResMgr.getInstance().instantiate(prefab, parent));
            return true;
        }
        return false;
    }

    setCloneAsset(asset: cc.Prefab | cc.Node, parent: cc.Node = null): this {
        if (asset) {
            if (asset instanceof cc.Node) {
                asset.active = false;
            }
            return this.setCreateAction(() => ResMgr.getInstance().instantiate(asset, parent));
        }
    }

    setCreateAction(action: () => cc.Node): this {
        return super.setCreateAction(action);
    }

    setValidAction(action: (node: cc.Node) => boolean): this {
        return super.setValidAction(action);
    }

    get(): cc.Node {
        const node = super.get();
        if (node) {
            node.active = false;
            this.eventTarget.emit(NodePool.EventType.USED, node, this);
            node.emit(NodePool.EventType.USED, node, this);
            return node;
        }
        return null;
    }

    setInitSize(count: number, callback?: (node: cc.Node) => void): void {
        for (let i = 0; i < count; i++) {
            const node = this.get();
            callback && callback(node);
            this.put(node);
        }
    }

    put(node: cc.Node): boolean {
        if (!node || !node.isValid || !cc.isValid(node, true)) {
            return false;
        }
        const doPut = (): boolean => {
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
        if (this.isDelayPut) {
            setTimeout(doPut, 0);
            return true;
        }
        return doPut();
    }

    put2(node: cc.Node): boolean {
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

    isValid(node: cc.Node): boolean {
        return node && node.isValid && cc.isValid(node, true);
    }

    clear(): void {
        while (this.lendArr?.length > 0) {
            this.put(this.lendArr.pop());
        }
        while (this.arr?.length > 0) {
            this.arr.pop()?.destroy();
        }
    }
}
