import Pool from "./Pool";
import ResMgr from "./ResMgr";

export default class NodePool extends Pool {
    public static EventType = {
        UNUSE: "NodePool_Event_UNUSE",
        USED: "NodePool_Event_USED"
    };

    public eventTarget: cc.EventTarget = null;
    public isDelayPut: boolean = false;

    constructor(size: number = 0) {
        super(size);
        this.eventTarget = new cc.EventTarget();
        this.isDelayPut = false;
        this.setValidAction(this.isValid);
    }

    public async setCreateActionByAssetUrl(url: string, bundleName: string = "", parent: cc.Node = null): Promise<boolean> {
        const prefab = await ResMgr.getInstance().loadRes(url, cc.Prefab, null, bundleName);
        if (prefab) {
            this.setCreateAction(() => ResMgr.getInstance().instantiate(prefab, parent));
            return true;
        }
        return false;
    }

    public setCloneAsset(asset: cc.Node | cc.Prefab, parent: cc.Node = null): void {
        if (asset) {
            if (asset instanceof cc.Node) {
                asset.active = false;
            }
            this.setCreateAction(() => ResMgr.getInstance().instantiate(asset, parent));
        }
    }

    public setCreateAction(action: () => cc.Node): void {
        super.setCreateAction(action);
    }

    public setValidAction(action: (node: cc.Node) => boolean): void {
        super.setValidAction(action);
    }

    public get(): cc.Node | null {
        const node = super.get();
        if (!node) {
            return null;
        }
        node.active = false;
        this.eventTarget.emit(NodePool.EventType.USED, node, this);
        node.emit(NodePool.EventType.USED, node, this);
        return node;
    }

    public setInitSize(size: number, cb: ((node: cc.Node) => void) | null = null): void {
        for (let i = 0; i < size; i++) {
            const node = this.get();
            if (cb) {
                cb(node);
            }
            this.put(node);
        }
    }

    public put(node: cc.Node): boolean {
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
            node.emit(NodePool.EventType.UNUSE, node, this);
            return true;
        };
        if (this.isDelayPut) {
            setTimeout(doPut, 0);
            return true;
        }
        return doPut();
    }

    public put2(node: cc.Node): boolean {
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
        node.emit(NodePool.EventType.UNUSE, node, this);
        return true;
    }

    public isValid(node: cc.Node): boolean {
        return !!(node && node.isValid && cc.isValid(node, true));
    }

    public clear(): void {
        while (this.lendArr && this.lendArr.length > 0) {
            this.put(this.lendArr.pop());
        }
        while (this.arr && this.arr.length > 0) {
            const node = this.arr.pop();
            if (node) {
                node.destroy();
            }
        }
    }
}