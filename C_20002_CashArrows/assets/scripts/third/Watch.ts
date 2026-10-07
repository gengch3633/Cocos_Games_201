const IGNORE_KEY = Symbol("__$ignore$");
const IS_PROXY = Symbol("isProxy");
const RAW_KEY = Symbol("raw");

export function nameof(): Record<string, string> {
    return new Proxy({}, {
        get(_target, propertyKey) {
            return propertyKey;
        }
    }) as Record<string, string>;
}

const arrayProtoPatch: Record<string, Function> = {};
["includes", "indexOf", "lastIndexOf"].forEach((methodName) => {
    arrayProtoPatch[methodName] = function (...args: any[]) {
        const rawArray = Watch.toRaw(this);
        const result = rawArray[methodName].apply(rawArray, args);
        if (result === -1 || result === false) {
            return rawArray[methodName].apply(
                rawArray,
                args.map((item) => Watch.toRaw(item))
            );
        }
        return result;
    };
});

export default class Watch {
    static EventType = {
        CHANGE: "Watch_Event_Change"
    };

    _$eventTarget: cc.EventTarget = new cc.EventTarget();
    _$srcTarget: any = null;
    _$dict: WeakMap<any, any> = new WeakMap();
    _$hackKeys: string[] = [
        "on", "once", "off", "targetOff", "emit", "clearAllEvent",
        "_$eventTarget", "_$srcTarget", "_$dict", IGNORE_KEY as any
    ];

    constructor(target: any) {
        this._$srcTarget = target;
    }

    static isProxy(value: any): boolean {
        return !!value?.[IS_PROXY];
    }

    static toRaw<T>(value: T): T {
        const raw = (value as any)?.[RAW_KEY];
        return raw ? Watch.toRaw(raw) : value;
    }

    static create<T extends object>(target: T): T {
        return Watch.isProxy(target) ? target : new Proxy(target, new Watch(target) as ProxyHandler<T>);
    }

    static isObject(value: any): boolean {
        return value != null && typeof value === "object";
    }

    static hasChanged(value: any, oldValue: any): boolean {
        return value !== oldValue && (value == value || oldValue == oldValue);
    }

    get(target: any, propertyKey: string | symbol, receiver: any): any {
        if (propertyKey === IS_PROXY) {
            return true;
        }
        if (propertyKey === RAW_KEY) {
            return target;
        }
        if (target === this._$srcTarget && this._$hackKeys.includes(propertyKey as string)) {
            return Reflect.get(this, propertyKey);
        }
        if (Array.isArray(target)) {
            if (arrayProtoPatch[propertyKey as string]) {
                return Reflect.get(arrayProtoPatch, propertyKey, receiver);
            }
            if (propertyKey === "splice") {
                return this.customSplice.bind(this, target);
            }
        }
        const value = Reflect.get(target, propertyKey, receiver);
        if (!Watch.isObject(value)) {
            return value;
        }
        if (Watch.isProxy(value)) {
            return value;
        }
        const ignoreKeys = target[IGNORE_KEY];
        if (ignoreKeys?.includes(propertyKey)) {
            return value;
        }
        let cached = this._$dict.get(value);
        if (!cached) {
            const proxy = new Proxy(value, this);
            let fieldName = propertyKey;
            if (target !== this._$srcTarget) {
                const parentCached = this._$dict.get(target);
                if (parentCached) {
                    fieldName = parentCached.fieldName;
                }
            }
            cached = { proxy, fieldName };
            this._$dict.set(value, cached);
        }
        return cached.proxy;
    }

    set(target: any, propertyKey: string | symbol, value: any, receiver: any): boolean {
        const oldValue = Reflect.get(target, propertyKey, receiver);
        const result = Reflect.set(target, propertyKey, value, receiver);
        if (Watch.hasChanged(value, oldValue)) {
            let fieldName = propertyKey;
            if (target !== this._$srcTarget) {
                const cached = this._$dict.get(target);
                if (cached) {
                    fieldName = cached.fieldName;
                }
            }
            this.emit(Watch.EventType.CHANGE, fieldName, propertyKey, value, oldValue);
        }
        return result;
    }

    customSplice(target: any[], start: number, deleteCount: number, ...items: any[]): any[] {
        const cached = this._$dict.get(target);
        const oldLength = target.length;
        const removed = target.splice.apply(target, [start, deleteCount, ...items] as any);
        if (oldLength !== target.length) {
            this.emit(Watch.EventType.CHANGE, cached?.fieldName, "length", target.length, oldLength);
        }
        return removed;
    }

    on(callback: (...args: any[]) => void, target: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.on(`${Watch.EventType.CHANGE}_${String(field)}`, callback, target);
            });
        } else {
            this._$eventTarget.on(Watch.EventType.CHANGE, callback, target);
        }
    }

    once(callback: (...args: any[]) => void, target: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.once(`${Watch.EventType.CHANGE}_${String(field)}`, callback, target);
            });
        } else {
            this._$eventTarget.once(Watch.EventType.CHANGE, callback, target);
        }
    }

    off(callback: (...args: any[]) => void, target: any, ...fields: any[]): void {
        if (fields?.length) {
            fields.forEach((field) => {
                this._$eventTarget.off(`${Watch.EventType.CHANGE}_${String(field)}`, callback, target);
            });
        } else {
            this._$eventTarget.off(Watch.EventType.CHANGE, callback, target);
        }
    }

    targetOff(target: any): void {
        this._$eventTarget.targetOff(target);
    }

    emit(eventType: string, fieldPath: any, propertyKey: any, newValue: any, oldValue: any): void {
        const ignoreKeys = this?._$srcTarget?.[IGNORE_KEY];
        if (ignoreKeys?.includes(fieldPath)) {
            return;
        }
        if (!eventType) {
            eventType = Watch.EventType.CHANGE;
        }
        if (fieldPath != null) {
            this._$eventTarget.emit(`${eventType}_${String(fieldPath)}`, fieldPath, propertyKey, newValue, oldValue);
        }
        this._$eventTarget.emit(eventType, fieldPath, propertyKey, newValue, oldValue);
    }

    clearAllEvent(): void {
        this._$eventTarget.clear();
    }
}

export function ignoreWatch() {
    return function (target: any, propertyKey: string): void {
        let keys = target[IGNORE_KEY];
        if (!keys) {
            keys = [];
            target[IGNORE_KEY] = keys;
        }
        keys.push(propertyKey);
    };
}
