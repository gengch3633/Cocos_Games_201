export default class MemPool {
    _unitClass: any;
    _pool: any[];
    _findOrder: any[];
    _nativeMemPool: any;

    constructor(unitClass: any) {
        this._unitClass = unitClass;
        this._pool = [];
        this._findOrder = [];
    }

    _initNative(): void {
        this._nativeMemPool = new renderer.MemPool();
    }

    _buildUnit(unitID: number): any {
        return new this._unitClass(unitID, this);
    }

    _destroyUnit(unitID: number): void {
        this._pool[unitID] = null;
        for (let i = 0, len = this._findOrder.length; i < len; i++) {
            const unit = this._findOrder[i];
            if (unit && unit.unitID == unitID) {
                this._findOrder.splice(i, 1);
                break;
            }
        }
    }

    _findUnitID(): number {
        let id = 0;
        const pool = this._pool;
        while (pool[id]) {
            id++;
        }
        return id;
    }

    pop(): any {
        let unit = null;
        let swapIndex = 0;
        const findOrder = this._findOrder;
        const pool = this._pool;
        for (let i = 0, len = findOrder.length; i < len; i++) {
            const candidate = findOrder[i];
            if (candidate && candidate.hasSpace()) {
                unit = candidate;
                swapIndex = i;
                break;
            }
        }
        if (!unit) {
            const unitID = this._findUnitID();
            unit = this._buildUnit(unitID);
            pool[unitID] = unit;
            findOrder.push(unit);
            swapIndex = findOrder.length - 1;
        }
        const first = findOrder[0];
        if (first !== unit) {
            findOrder[0] = unit;
            findOrder[swapIndex] = first;
        }
        return unit.pop();
    }

    push(item: { unitID: number; index: number }): any {
        const unit = this._pool[item.unitID];
        unit.push(item.index);
        if (this._findOrder.length > 1 && unit.isAllFree()) {
            this._destroyUnit(item.unitID);
        }
        return unit;
    }
}
