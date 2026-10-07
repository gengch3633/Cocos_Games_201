const IGNORE_KEY = Symbol("__$ignore$");
const IS_PROXY_KEY = Symbol("isProxy");
const RAW_KEY = Symbol("raw");

export function nameof(): any {
    return new Proxy({}, {
        get(_target, prop) {
            return prop;
        },
    });
}

const arrayInstrumentations: { [key: string]: Function } = {};
["includes", "indexOf", "lastIndexOf"].forEach((methodName) => {
    arrayInstrumentations[methodName] = function (this: any, ...args: any[]) {
        const raw = Watch.toRaw(this);
        const result = raw[methodName].apply(raw, args);
        return result === -1 || result === false
            ? raw[methodName].apply(raw, args.map((arg) => Watch.toRaw(arg)))
            : result;
    };
});

export default class Watch implements ProxyHandler<object> {
    static EventType = {
        CHANGE: "Watch_Event_Change",
    };

    private _$eventTarget = new cc.EventTarget();
    private _$srcTarget: object | null = null;
    private _$dict = new WeakMap<object, { proxy: object; fieldName: string | symbol }>();
    private _$hackKeys = [
        "on", "once", "off", "targetOff", "emit", "clearAllEvent",
        "_$eventTarget", "_$srcTarget", "_$dict", IGNORE_KEY,
    ];

    constructor(target: object) {
        this._$srcTarget = target;
    }

    static isProxy(value: any): boolean {
        return !!value?.[IS_PROXY_KEY];
    }

    static toRaw<T>(value: T): T {
        const raw = (value as any)?.[RAW_KEY];
        return raw ? Watch.toRaw(raw) : value;
    }

    static create<T extends object>(target: T): T {
        return Watch.isProxy(target) ? target : new Proxy(target, new Watch(target)) as T;
    }

    static isObject(value: any): boolean {
        return value != null && typeof value === "object";
    }

    static hasChanged(value: any, oldValue: any): boolean {
        return value !== oldValue && (value == value || oldValue == oldValue);
    }

    get(target: object, prop: string | symbol, receiver: any): any {
        if (prop === IS_PROXY_KEY) {
            return true;
        }
        if (prop === RAW_KEY) {
            return target;
        }
        if (target === this._$srcTarget && this._$hackKeys.includes(prop as string)) {
            return Reflect.get(this, prop);
        }
        if (Array.isArray(target)) {
            if (arrayInstrumentations[prop as string]) {
                return Reflect.get(arrayInstrumentations, prop, receiver);
            }
            if (prop === "splice") {
                return this.customSplice.bind(this, target);
            }
        }
        const result = Reflect.get(target, prop, receiver);
        if (!Watch.isObject(result)) {
            return result;
        }
        if (Watch.isProxy(result)) {
            return result;
        }
        const ignoreList = (target as any)[IGNORE_KEY];
        if (ignoreList?.includes(prop)) {
            return result;
        }
        let entry = this._$dict.get(result);
        if (!entry) {
            const proxy = new Proxy(result, this);
            let fieldName: string | symbol = prop;
            if (target !== this._$srcTarget) {
                const parentEntry = this._$dict.get(target);
                if (parentEntry) {
                    fieldName = parentEntry.fieldName;
                }
            }
            entry = { proxy, fieldName };
            this._$dict.set(result, entry);
        }
        return entry.proxy;
    }

    set(target: object, prop: string | symbol, value: any, receiver: any): boolean {
        const oldValue = Reflect.get(target, prop, receiver);
        const ok = Reflect.set(target, prop, value, receiver);
        if (Watch.hasChanged(value, oldValue)) {
            let fieldName: string | symbol = prop;
            if (target !== this._$srcTarget) {
                const entry = this._$dict.get(target);
                if (entry) {
                    fieldName = entry.fieldName;
                }
            }
            this.emit(Watch.EventType.CHANGE, fieldName, prop, value, oldValue);
        }
        return ok;
    }

    customSplice(target: any[], start: number, deleteCount: number, ...items: any[]): any[] {
        const entry = this._$dict.get(target);
        const oldLength = target.length;
        const removed = target.splice(start, deleteCount, ...items);
        if (oldLength !== target.length) {
            this.emit(Watch.EventType.CHANGE, entry?.fieldName, "length", target.length, oldLength);
        }
        return removed;
    }

    on(callback: Function, target?: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.on(Watch.EventType.CHANGE + "_" + String(field), callback, target);
            });
        } else {
            this._$eventTarget.on(Watch.EventType.CHANGE, callback, target);
        }
    }

    once(callback: Function, target?: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.once(Watch.EventType.CHANGE + "_" + String(field), callback, target);
            });
        } else {
            this._$eventTarget.once(Watch.EventType.CHANGE, callback, target);
        }
    }

    off(callback: Function, target?: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.off(Watch.EventType.CHANGE + "_" + String(field), callback, target);
            });
        } else {
            this._$eventTarget.off(Watch.EventType.CHANGE, callback, target);
        }
    }

    targetOff(target: any): void {
        this._$eventTarget.targetOff(target);
    }

    emit(eventType: string, fieldName?: any, key?: any, newValue?: any, oldValue?: any): void {
        const ignoreList = this._$srcTarget?.[IGNORE_KEY as any];
        if (!ignoreList || !ignoreList.includes(fieldName)) {
            if (!eventType) {
                eventType = Watch.EventType.CHANGE;
            }
            if (fieldName != null) {
                this._$eventTarget.emit(eventType + "_" + String(fieldName), fieldName, key, newValue, oldValue);
            }
            this._$eventTarget.emit(eventType, fieldName, key, newValue, oldValue);
        }
    }

    clearAllEvent(): void {
        this._$eventTarget.clear();
    }
}

export function ignoreWatch(): MethodDecorator {
    return (target: object, propertyKey: string | symbol) => {
        let list = (target as any)[IGNORE_KEY];
        if (!list) {
            list = [];
            (target as any)[IGNORE_KEY] = list;
        }
        list.push(propertyKey);
    };
}
