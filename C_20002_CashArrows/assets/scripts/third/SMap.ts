export class SMap {
    _size: number = 0;
    _keyMap: Record<string, boolean> = {};
    _change: number = 0;
    _keys: string[] = null;
    _values: any[] = null;
    _kvs: [string, any][] = null;

    get size(): number {
        return this._size;
    }

    set(key: string | number, value: any): void {
        if (!this._keyMap[key]) {
            this._size++;
        }
        (this as any)[key] = value;
        this._keyMap[key] = true;
        this._change |= 7;
    }

    delete(key: string | number): void {
        if (this._keyMap[key]) {
            delete (this as any)[key];
            delete this._keyMap[key];
            this._size--;
            this._change |= 7;
        }
    }

    has(key: string | number): boolean {
        return !!this._keyMap[key];
    }

    get(key: string | number): any {
        return (this as any)[key];
    }

    clear(): void {
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
                this._values.push((this as any)[key]);
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
                this._kvs.push([key, (this as any)[key]]);
            }
        }
        return this._kvs;
    }

    forEach(callback: (key: string, value: any) => boolean | void, thisArg?: any): void {
        for (const key in this._keyMap) {
            if (callback.call(thisArg, key, (this as any)[key]) === false) {
                return;
            }
        }
    }
}
