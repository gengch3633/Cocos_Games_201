export class ObserverObj<T = any> {
    public value: T | undefined;

    public constructor(value?: T) {
        if (value) {
            this.value = value;
        }
    }
}

export class KeyValuePair<K = any, V = any> {
    public Key: K;
    public Value: V;

    public constructor(key: K, value: V) {
        this.Key = key;
        this.Value = value;
    }
}

export default { ObserverObj, KeyValuePair };