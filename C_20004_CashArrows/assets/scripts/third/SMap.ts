const { ccclass, property } = cc._decorator;

@ccclass
export default class SMap {
    private _size: number = 0;
    private _keyMap: { [key: string]: boolean } = {};
    private _change: number = 0;
    private _keys: string[] = null;
    private _values: any[] = null;
    private _kvs: Array<[string, any]> = null;

    public get size(): number {
        return this._size;
    }

    public set(key: string, value: any): void {
        if (!this._keyMap[key]) {
            this._size++;
        }
        (this as any)[key] = value;
        this._keyMap[key] = true;
        this._change |= 7;
    }

    public delete(key: string): void {
        if (this._keyMap[key]) {
            delete (this as any)[key];
            delete this._keyMap[key];
            this._size--;
            this._change |= 7;
        }
    }

    public has(key: string): boolean {
        return !!this._keyMap[key];
    }

    public get(key: string): any {
        return (this as any)[key];
    }

    public clear(): void {
        for (const key in this._keyMap) {
            delete (this as any)[key];
            delete this._keyMap[key];
            this._change |= 7;
        }
        if (this._keys) {
            this._keys.length = 0;
        }
        if (this._values) {
            this._values.length = 0;
        }
        if (this._kvs) {
            this._kvs.length = 0;
        }
        this._size = 0;
    }

    public keys(): string[] {
        if (!this._keys) {
            this._keys = [];
        }
        if (1 & this._change) {
            this._change ^= 1;
            this._keys.length = 0;
            for (const key in this._keyMap) {
                this._keys.push(key);
            }
        }
        return this._keys;
    }

    public values(): any[] {
        if (!this._values) {
            this._values = [];
        }
        if (2 & this._change) {
            this._change ^= 2;
            this._values.length = 0;
            for (const key in this._keyMap) {
                const value = (this as any)[key];
                this._values.push(value);
            }
        }
        return this._values;
    }

    public kvs(): Array<[string, any]> {
        if (!this._kvs) {
            this._kvs = [];
        }
        if (4 & this._change) {
            this._change ^= 4;
            this._kvs.length = 0;
            for (const key in this._keyMap) {
                const value = (this as any)[key];
                this._kvs.push([key, value]);
            }
        }
        return this._kvs;
    }

    public forEach(callback: (key: string, value: any) => boolean | void, thisArg?: any): void {
        for (const key in this._keyMap) {
            if (callback.call(thisArg, key, (this as any)[key]) === false) {
                return;
            }
        }
    }
}