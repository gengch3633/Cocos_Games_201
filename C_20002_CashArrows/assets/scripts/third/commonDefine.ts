export class ObserverObj<T = any> {
    value: T;

    constructor(value?: T) {
        if (value !== undefined) {
            this.value = value;
        }
    }
}

export class KeyValuePair<K, V> {
    Key: K;
    Value: V;

    constructor(key: K, value: V) {
        this.Key = key;
        this.Value = value;
    }
}
