export class SMap {
    _size = 0;
    _keyMap: Record<string, boolean> = {};
    _change = 0;
    _keys?: string[];
    _values?: any[];
    _kvs?: [string, any][];

    [key: string]: any;

    get size(): number {
        return this._size;
    }

    set(key: string, value: any): void {
        if (!this._keyMap[key]) {
            this._size++;
        }
        this[key] = value;
        this._keyMap[key] = true;
        this._change |= 7;
    }

    delete(key: string): void {
        if (this._keyMap[key]) {
            delete this[key];
            delete this._keyMap[key];
            this._size--;
            this._change |= 7;
        }
    }

    has(key: string): boolean {
        return !!this._keyMap[key];
    }

    get(key: string): any {
        return this[key];
    }

    clear(): void {
        for (const key in this._keyMap) {
            delete this[key];
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

    keys(): string[] {
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

    values(): any[] {
        if (!this._values) {
            this._values = [];
        }
        if (2 & this._change) {
            this._change ^= 2;
            this._values.length = 0;
            for (const key in this._keyMap) {
                this._values.push(this[key]);
            }
        }
        return this._values;
    }

    kvs(): [string, any][] {
        if (!this._kvs) {
            this._kvs = [];
        }
        if (4 & this._change) {
            this._change ^= 4;
            this._kvs.length = 0;
            for (const key in this._keyMap) {
                this._kvs.push([key, this[key]]);
            }
        }
        return this._kvs;
    }

    forEach(callback: (key: string, value: any) => boolean | void, thisArg?: any): void {
        for (const key in this._keyMap) {
            if (callback.call(thisArg, key, this[key]) === false) {
                return;
            }
        }
    }
}
