const { ccclass } = cc._decorator;

@ccclass
export default class PoolItem extends cc.Component {
    private _pool: cc.Node[] = null;
    private _gid: number = null;
    private _using = false;
    private _loaded = false;
    private _data: any = false;

    clear(): void {}

    registPool(pool: cc.Node[], gid: number): void {
        this._pool = pool;
        this._gid = gid;
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

    init(_data?: any): void {}

    reuse(): void {
        this._using = true;
    }
}
