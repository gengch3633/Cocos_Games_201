const { ccclass, property } = cc._decorator;

@ccclass
export default class SMap<K extends string | number = string, V = any> {
    private _size: number = 0;
    private _keyMap: { [key: string]: boolean } = {};
    private _change: number = 0;
    private _keys: string[] = null;
    private _values: V[] = null;
    private _kvs: Array<[string, V]> = null;

    public get size(): number {
        return this._size;
    }

    public set(key: K, value: V): void {
        const id = String(key);
        if (!this._keyMap[id]) {
            this._size++;
        }
        (this as any)[id] = value;
        this._keyMap[id] = true;
        this._change |= 7;
    }

    public delete(key: K): void {
        const id = String(key);
        if (this._keyMap[id]) {
            delete (this as any)[id];
            delete this._keyMap[id];
            this._size--;
            this._change |= 7;
        }
    }

    public has(key: K): boolean {
        return !!this._keyMap[String(key)];
    }

    public get(key: K): V {
        return (this as any)[String(key)];
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

    public values(): V[] {
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

    public kvs(): Array<[string, V]> {
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

    public forEach(callback: (key: string, value: V) => boolean | void, thisArg?: any): void {
        for (const key in this._keyMap) {
            if (callback.call(thisArg, key, (this as any)[key]) === false) {
                return;
            }
        }
    }
}