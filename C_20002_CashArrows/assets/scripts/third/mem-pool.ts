declare const renderer: any;

export default function MemPool(this: any, unitClass: any) {
    this._unitClass = unitClass;
    this._pool = [];
    this._findOrder = [];
}

const proto = MemPool.prototype;

proto._initNative = function () {
    this._nativeMemPool = new renderer.MemPool();
};

proto._buildUnit = function (e: number) {
    return new this._unitClass(e, this);
};

proto._destroyUnit = function (e: number) {
    this._pool[e] = null;
    for (let t = 0, i = this._findOrder.length; t < i; t++) {
        const n = this._findOrder[t];
        if (n && n.unitID == e) {
            this._findOrder.splice(t, 1);
            break;
        }
    }
};

proto._findUnitID = function () {
    let e = 0;
    const t = this._pool;
    while (t[e]) e++;
    return e;
};

proto.pop = function () {
    let e = null;
    let t = 0;
    const i = this._findOrder;
    const n = this._pool;
    const a = i.length;
    for (; t < a; t++) {
        const o = i[t];
        if (o && o.hasSpace()) {
            e = o;
            break;
        }
    }
    if (!e) {
        const r = this._findUnitID();
        e = this._buildUnit(r);
        n[r] = e;
        i.push(e);
        t = i.length - 1;
    }
    const s = i[0];
    if (s !== e) {
        i[0] = e;
        i[t] = s;
    }
    return e.pop();
};

proto.push = function (e: any) {
    const t = this._pool[e.unitID];
    t.push(e.index);
    this._findOrder.length > 1 && t.isAllFree() && this._destroyUnit(e.unitID);
    return t;
};
