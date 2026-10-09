const { ccclass } = cc._decorator;

@ccclass
export default class PoolItem extends cc.Component {
    _pool = null;
    _gid = null;
    _using = false;
    _loaded = false;
    _data = false;

    clear() {}

    registPool(e, t) {
        this._pool = e;
        this._gid = t;
        this._using = true;
    }

    recover() {
        if (this._using) {
            this._using = false;
            this.node.removeFromParent(false);
            this.clear();
            this._pool.push(this.node);
        }
    }

    init() {}

    reuse() {
        this._using = true;
    }
}
