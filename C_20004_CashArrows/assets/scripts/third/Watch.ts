const ignoreSymbol = Symbol("__$ignore$");
const isProxySymbol = Symbol("isProxy");
const rawSymbol = Symbol("raw");

const arrayMethodsPatch: Record<string, Function> = {};

export default class Watch {
    private _$eventTarget: cc.EventTarget;
    private _$srcTarget: any;
    private _$dict: WeakMap<any, { proxy: any, fieldName: string | symbol }>;
    private _$hackKeys: (string | symbol)[];

    public static EventType = {
        CHANGE: "Watch_Event_Change"
    };

    constructor(target: any) {
        this._$eventTarget = new cc.EventTarget();
        this._$srcTarget = null;
        this._$dict = new WeakMap();
        this._$hackKeys = [ "on", "once", "off", "targetOff", "emit", "clearAllEvent", "_$eventTarget", "_$srcTarget", "_$dict", ignoreSymbol ];
        this._$srcTarget = target;
    }

    public static isProxy(obj: any): boolean {
        return !!obj?.[isProxySymbol];
    }

    public static toRaw(obj: any): any {
        const raw = obj && obj[rawSymbol];
        return raw ? Watch.toRaw(raw) : obj;
    }

    public static create<T extends object>(target: T): T {
        return Watch.isProxy(target) ? target : new Proxy(target, new Watch(target));
    }

    public static isObject(obj: any): boolean {
        return obj != null && typeof obj === "object";
    }

    public static hasChanged(a: any, b: any): boolean {
        return a !== b && (a === a || b === b);
    }

    public get(target: any, property: string | symbol, receiver: any): any {
        if (property === isProxySymbol) return true;
        if (property === rawSymbol) return target;
        if (target === this._$srcTarget && this._$hackKeys.includes(property)) {
            return Reflect.get(this, property);
        }
        if (Array.isArray(target)) {
            if (typeof property === "string" && arrayMethodsPatch[property]) {
                return Reflect.get(arrayMethodsPatch, property, receiver);
            }
            if (property === "splice") {
                return this.customSplice.bind(this, target);
            }
        }
        const value = Reflect.get(target, property, receiver);
        if (!Watch.isObject(value)) return value;
        if (Watch.isProxy(value)) return value;
        const ignoreKeys = (target as any)[ignoreSymbol];
        if (ignoreKeys?.includes(property)) return value;
        let dictEntry = this._$dict.get(value);
        if (!dictEntry) {
            const proxy = new Proxy(value, this as any);
            let fieldName = property;
            if (target != this._$srcTarget) {
                const parentEntry = this._$dict.get(target);
                if (parentEntry) {
                    fieldName = parentEntry.fieldName;
                }
            }
            dictEntry = {
                proxy,
                fieldName
            };
            this._$dict.set(value, dictEntry);
        }
        return dictEntry.proxy;
    }

    public set(target: any, property: string | symbol, value: any, receiver: any): boolean {
        const oldValue = Reflect.get(target, property, receiver);
        const result = Reflect.set(target, property, value, receiver);
        if (Watch.hasChanged(value, oldValue)) {
            let fieldName = property;
            if (target != this._$srcTarget) {
                const dictEntry = this._$dict.get(target);
                if (dictEntry) {
                    fieldName = dictEntry.fieldName;
                }
            }
            this.emit(Watch.EventType.CHANGE, fieldName, property, value, oldValue);
        }
        return result;
    }

    public customSplice(target: any[], start: number, deleteCount: number, ...items: any[]): any[] {
        const dictEntry = this._$dict.get(target);
        const oldLength = target.length;
        const result = target.splice(start, deleteCount, ...items);
        if (oldLength === target.length) {
            return result;
        }
        this.emit(Watch.EventType.CHANGE, dictEntry?.fieldName, "length", target.length, oldLength);
        return result;
    }

    public on(callback: Function, target: any, ...args: any[]): void {
        if (args && args.length > 0) {
            args.forEach((arg) => {
                this._$eventTarget.on(Watch.EventType.CHANGE + "_" + String(arg), callback, target);
            });
        } else {
            this._$eventTarget.on(Watch.EventType.CHANGE, callback, target);
        }
    }

    public once(callback: Function, target: any, ...args: any[]): void {
        if (args && args.length > 0) {
            args.forEach((arg) => {
                this._$eventTarget.once(Watch.EventType.CHANGE + "_" + String(arg), callback, target);
            });
        } else {
            this._$eventTarget.once(Watch.EventType.CHANGE, callback, target);
        }
    }

    public off(callback: Function, target: any, ...args: any[]): void {
        if (args && args.length > 0) {
            args.forEach((arg) => {
                this._$eventTarget.off(Watch.EventType.CHANGE + "_" + String(arg), callback, target);
            });
        } else {
            this._$eventTarget.off(Watch.EventType.CHANGE, callback, target);
        }
    }

    public targetOff(target: any): void {
        this._$eventTarget.targetOff(target);
    }

    public emit(eventType: string, field: string | symbol | null | undefined, property: string | symbol, value: any, oldValue: any): void {
        const ignoreKeys = this._$srcTarget?.[ignoreSymbol];
        if (!ignoreKeys || !ignoreKeys.includes(field)) {
            if (!eventType) {
                eventType = Watch.EventType.CHANGE;
            }
            if (field != null) {
                this._$eventTarget.emit(eventType + "_" + String(field), field, property, value, oldValue);
            }
            this._$eventTarget.emit(eventType, field, property, value, oldValue);
        }
    }

    public clearAllEvent(): void {
        this._$eventTarget.clear();
    }
}

["includes", "indexOf", "lastIndexOf"].forEach((method) => {
    arrayMethodsPatch[method] = function (this: any, ...args: any[]) {
        const raw = Watch.toRaw(this);
        const result = raw[method].apply(raw, args);
        if (result === -1 || result === false) {
            return raw[method].apply(raw, args.map((arg: any) => Watch.toRaw(arg)));
        }
        return result;
    };
});

export function nameof(): any {
    return new Proxy({}, {
        get(target: any, property: string | symbol): any {
            return property;
        }
    });
}

export function ignoreWatch(): (target: any, property: string | symbol) => void {
    return function (target: any, property: string | symbol): void {
        let ignoreList = target[ignoreSymbol];
        if (!ignoreList) {
            ignoreList = [];
            target[ignoreSymbol] = ignoreList;
        }
        ignoreList.push(property);
    };
}