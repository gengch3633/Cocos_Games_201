const { ccclass } = cc._decorator;

@ccclass
export default class Pool<T = any> {
    public lendArr: T[] = [];
    public arr: T[] = [];
    public validAction: (item: T) => boolean = () => true;
    public createAction: (() => T) | null = null;

    private _isInit: boolean = false;
    private _capacity: number = 0;

    constructor(capacity: number = 0) {
        this._capacity = capacity;
    }

    public get isInit(): boolean {
        return this._isInit;
    }

    public setCreateAction(action: () => T): Pool<T> {
        this.createAction = action;
        this._isInit = true;
        return this;
    }

    public setValidAction(action: (item: T) => boolean): Pool<T> {
        this.validAction = action;
        return this;
    }

    public get size(): number {
        return this.arr.length;
    }

    public get capacity(): number {
        return this._capacity;
    }

    public set capacity(value: number) {
        this._capacity = value;
        this.resize();
    }

    public resize(): void {
        const removeCount: number = this.arr.length + this.lendArr.length - this._capacity;
        if (removeCount <= 0) {
            return;
        }
        for (let i = 0; i < removeCount; i++) {
            const item = this.arr.shift();
            if (item === null || item === undefined) {
                this.lendArr.shift();
            }
        }
    }

    public get(): T | null {
        let item: T;
        if (this.arr.length > 0) {
            item = this.arr.shift() as T;
        } else if (this._capacity <= 0 || this._capacity > this.lendArr.length) {
            if (!this.createAction) {
                return null;
            }
            item = this.createAction();
        } else {
            if (this.lendArr.length <= 0) {
                return null;
            }
            item = this.lendArr.shift() as T;
        }

        if (this.validAction(item)) {
            if (this.lendArr.indexOf(item) < 0) {
                this.lendArr.push(item);
            }
            return item;
        }
        return this.get();
    }

    public put(item: T): boolean {
        if (!this.validAction(item)) {
            const invalidIndex: number = this.lendArr.indexOf(item);
            if (invalidIndex >= 0) {
                this.lendArr.splice(invalidIndex, 1);
            }
            return false;
        }

        if (this.arr.indexOf(item) >= 0) {
            return false;
        }

        const lendIndex: number = this.lendArr.indexOf(item);
        if (lendIndex >= 0) {
            this.lendArr.splice(lendIndex, 1);
        }

        this.arr.push(item);
        return true;
    }

    public getLendArr(): T[] {
        return this.lendArr;
    }

    public recoverAllLends(): void {
        while (this.lendArr.length > 0) {
            const item = this.lendArr.shift() as T;
            this.put(item);
        }
    }

    public clear(): void {
        this.lendArr = [];
        this.arr = [];
    }
}