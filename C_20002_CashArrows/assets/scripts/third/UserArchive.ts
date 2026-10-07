import ArchiveMgr from "./ArchiveMgr";
import Common from "./Common";
import Watch, { ignoreWatch } from "./Watch";

const NON_SERIALIZED_KEYS = "_$nonSerializedKeys";

export function nonSerialized() {
    return function (target: any, propertyKey: string) {
        let keys = target[NON_SERIALIZED_KEYS];
        if (!keys) {
            keys = [];
            target[NON_SERIALIZED_KEYS] = keys;
        }
        keys.push(propertyKey);
    };
}

export default class UserArchive {
    static _ins: any;

    @nonSerialized()
    _$key = "";

    @nonSerialized()
    _$serverIndex = -1;

    @nonSerialized()
    _$watch: any = null;

    @ignoreWatch()
    _$version = 0;

    @nonSerialized()
    @ignoreWatch()
    _id = "";

    constructor(key: string, serverIndex = 0) {
        this._$serverIndex = -1;
        this._$watch = null;
        this._$version = 0;
        this._id = "";
        this._$key = Common.version + "_" + key;
        if (serverIndex <= 0) {
            let hash = 0;
            key.split("").forEach((char) => {
                hash += char.charCodeAt(0);
            });
            serverIndex = 6 + (hash % 20);
        }
        this._$serverIndex = serverIndex;
    }

    static getInstance<T extends UserArchive>(this: new () => T): any {
        const ctor = this as typeof UserArchive & { _ins?: any };
        if (!ctor._ins) {
            const instance = new this();
            instance.create();
            ctor._ins = instance._$watch;
        }
        return ctor._ins;
    }

    create(): void {
        this._id = "UserArchive_" + this._$key + "_" + Date.now();
        let isNew = true;
        const saved = ArchiveMgr.getInstance().get(this._$key, this._$serverIndex);
        if (saved?._$version) {
            Object.assign(this, saved);
            isNew = false;
        }
        this.init(isNew);
        this._$watch = Watch.create(this);
        ArchiveMgr.getInstance().register(this);
    }

    init(_isNew: boolean): void {
    }

    on(event: string, callback: Function, target?: any, useCapture?: boolean): void {
        this._$watch.on(event, callback, target, useCapture);
    }

    once(event: string, callback: Function, target?: any, useCapture?: boolean): void {
        this._$watch.once(event, callback, target, useCapture);
    }

    off(event: string, callback?: Function, target?: any, useCapture?: boolean): void {
        this._$watch.off(event, callback, target, useCapture);
    }

    targetOff(target: any): void {
        this._$watch.targetOff(target);
    }

    clearAllEvent(): void {
        this._$watch.clearAllEvent();
    }

    toJSON(): { [key: string]: any } {
        const result: { [key: string]: any } = {};
        const excluded = (this as any)[NON_SERIALIZED_KEYS];
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                if (excluded && excluded.indexOf(key) !== -1) {
                    continue;
                }
                result[key] = (this as any)[key];
            }
        }
        return result;
    }
}
