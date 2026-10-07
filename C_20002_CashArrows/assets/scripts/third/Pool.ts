export default class Pool<T = any> {
    lendArr: T[] = [];
    arr: T[] = [];
    validAction: (item: T) => boolean = () => true;
    createAction: () => T = null;
    _isInit: boolean = false;
    _capacity: number = 0;

    constructor(capacity: number = 0) {
        this._capacity = capacity;
    }

    get isInit(): boolean {
        return this._isInit;
    }

    setCreateAction(action: () => T): this {
        this.createAction = action;
        this._isInit = true;
        return this;
    }

    setValidAction(action: (item: T) => boolean): this {
        this.validAction = action;
        return this;
    }

    get size(): number {
        return this.arr.length;
    }

    get capacity(): number {
        return this._capacity;
    }

    set capacity(value: number) {
        this._capacity = value;
        this.resize();
    }

    resize(): void {
        let overflow = this.arr.length + this.lendArr.length - this._capacity;
        if (!(overflow <= 0)) {
            for (let i = 0; i < overflow; i++) {
                const item = this.arr.shift();
                if (item !== null && item !== undefined) {
                    continue;
                }
                this.lendArr.shift();
            }
        }
    }

    get(): T {
        let item: T = null;
        if (this.arr.length > 0) {
            item = this.arr.shift();
        } else if (this._capacity <= 0 || this._capacity > this.lendArr.length) {
            if (!this.createAction) {
                return null;
            }
            item = this.createAction();
        } else {
            if (!(this.lendArr.length > 0)) {
                return null;
            }
            item = this.lendArr.shift();
        }
        if (this.validAction(item)) {
            if (this.lendArr.indexOf(item) < 0) {
                this.lendArr.push(item);
            }
            return item;
        }
        return this.get();
    }

    put(item: T): boolean {
        if (!this.validAction(item)) {
            const index = this.lendArr.indexOf(item);
            if (index >= 0) {
                this.lendArr.splice(index, 1);
            }
            return false;
        }
        if (this.arr.indexOf(item) >= 0) {
            return false;
        }
        const lendIndex = this.lendArr.indexOf(item);
        if (lendIndex >= 0) {
            this.lendArr.splice(lendIndex, 1);
        }
        this.arr.push(item);
        return true;
    }

    getLendArr(): T[] {
        return this.lendArr;
    }

    recoverAllLends(): void {
        while (this.lendArr?.length > 0) {
            const item = this.lendArr.shift();
            this.put(item);
        }
    }

    clear(): void {
        this.lendArr = [];
        this.arr = [];
    }
}
