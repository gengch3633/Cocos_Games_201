declare const renderer: any;

import MemPool from "./mem-pool";

function NodeMemPool(this: any, unitClass: any) {
    MemPool.call(this, unitClass);
}

function F() {}
F.prototype = MemPool.prototype;
const proto = (NodeMemPool.prototype = new F());
NodeMemPool.prototype.constructor = NodeMemPool;

proto._initNative = function () {
    this._nativeMemPool = new renderer.NodeMemPool();
};

proto._destroyUnit = function (e: number) {
    MemPool.prototype._destroyUnit.call(this, e);
};

export default NodeMemPool;
