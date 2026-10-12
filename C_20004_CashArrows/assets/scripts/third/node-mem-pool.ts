import MemPool from "./mem-pool";

declare const renderer: any;

export default class NodeMemPool extends MemPool {
    _nativeMemPool: any = null;

    constructor(size: number) {
        super(size);
    }

    _initNative(): void {
        this._nativeMemPool = new renderer.NodeMemPool();
    }

    _destroyUnit(unit: any): void {
        super._destroyUnit(unit);
    }
}