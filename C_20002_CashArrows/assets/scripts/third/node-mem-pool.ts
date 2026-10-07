import MemPool from "./mem-pool";

export default class NodeMemPool extends MemPool {
    _initNative(): void {
        this._nativeMemPool = new renderer.NodeMemPool();
    }

    _destroyUnit(unitID: number): void {
        super._destroyUnit(unitID);
    }
}
