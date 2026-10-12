declare const renderer: any;

export interface IMemPoolUnit {
    unitID: number;
    index: number;
    hasSpace(): boolean;
    isAllFree(): boolean;
    pop(): any;
    push(index: number): void;
}

export type MemPoolUnitClass = new (unitID: number, pool: MemPool) => IMemPoolUnit;

export default class MemPool {
    private _unitClass: MemPoolUnitClass;
    private _pool: Array<IMemPoolUnit | null>;
    private _findOrder: IMemPoolUnit[];
    private _nativeMemPool: any;

    constructor(unitClass: MemPoolUnitClass) {
        this._unitClass = unitClass;
        this._pool = [];
        this._findOrder = [];
        this._nativeMemPool = null;
    }

    public _initNative(): void {
        this._nativeMemPool = new renderer.MemPool();
    }

    private _buildUnit(unitID: number): IMemPoolUnit {
        return new this._unitClass(unitID, this);
    }

    private _destroyUnit(unitID: number): void {
        this._pool[unitID] = null;
        const findOrder = this._findOrder;
        for (let i = 0, len = findOrder.length; i < len; i++) {
            const unit = findOrder[i];
            if (unit && unit.unitID === unitID) {
                findOrder.splice(i, 1);
                break;
            }
        }
    }

    private _findUnitID(): number {
        let id = 0;
        const pool = this._pool;
        while (pool[id]) {
            id++;
        }
        return id;
    }

    public pop(): any {
        const findOrder = this._findOrder;
        const pool = this._pool;
        let unit: IMemPoolUnit | null = null;
        let i = 0;
        const len = findOrder.length;
        for (; i < len; i++) {
            const temp = findOrder[i];
            if (temp && temp.hasSpace()) {
                unit = temp;
                break;
            }
        }
        if (!unit) {
            const id = this._findUnitID();
            unit = this._buildUnit(id);
            pool[id] = unit;
            findOrder.push(unit);
            i = findOrder.length - 1;
        }
        const first = findOrder[0];
        if (first !== unit) {
            findOrder[0] = unit;
            findOrder[i] = first;
        }
        return unit.pop();
    }

    public push(unit: IMemPoolUnit): IMemPoolUnit {
        const poolUnit = this._pool[unit.unitID] as IMemPoolUnit;
        poolUnit.push(unit.index);
        if (this._findOrder.length > 1 && poolUnit.isAllFree()) {
            this._destroyUnit(unit.unitID);
        }
        return poolUnit;
    }
}