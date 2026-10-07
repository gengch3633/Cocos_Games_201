const { ccclass } = cc._decorator;

@ccclass
export default class PoolItem extends cc.Component {
    _pool: cc.Node[] = null;
    _gid: number = null;
    _using = false;
    _loaded = false;
    _data: any = false;

    clear(): void {
    }

    registPool(e: cc.Node[], t: number): void {
        this._pool = e;
        this._gid = t;
        this._using = true;
    }

    recover(): void {
        if (this._using) {
            this._using = false;
            this.node.removeFromParent(false);
            this.clear();
            this._pool.push(this.node);
        }
    }

    init(_data?: any): void {
    }

    reuse(): void {
        this._using = true;
    }
}
