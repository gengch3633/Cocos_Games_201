export class ObserverObj<T = unknown> {
    value: T;

    constructor(value?: T) {
        if (value) {
            this.value = value;
        }
    }
}

export class KeyValuePair<K = unknown, V = unknown> {
    Key: K;
    Value: V;

    constructor(key: K, value: V) {
        this.Key = key;
        this.Value = value;
    }
}

const commonDefine = {
    ObserverObj,
    KeyValuePair,
};

export default commonDefine;
