export class ObserverObj {
    value: any;

    constructor(value?: any) {
        if (value) {
            this.value = value;
        }
    }
}

export class KeyValuePair {
    Key: any;
    Value: any;

    constructor(key: any, value: any) {
        this.Key = key;
        this.Value = value;
    }
}
