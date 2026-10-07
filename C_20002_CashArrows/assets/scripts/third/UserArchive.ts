import ArchiveMgr from "./ArchiveMgr";
import Common from "./Common";
import Watch, { ignoreWatch } from "./Watch";

const NON_SERIALIZED_KEYS = "_$nonSerializedKeys";

export function nonSerialized(target: any, propertyKey: string): void {
    let keys = target[NON_SERIALIZED_KEYS];
    if (!keys) {
        keys = [];
        target[NON_SERIALIZED_KEYS] = keys;
    }
    keys.push(propertyKey);
}

export default class UserArchive {
    static _ins: any = null;

    _$serverIndex: number = -1;
    _$watch: any = null;
    _$version: number = 0;
    _id: string = "";
    _$key: string;

    static getInstance<T extends typeof UserArchive>(this: T): InstanceType<T> {
        if (!this._ins) {
            const instance = new this();
            instance.create();
            this._ins = instance._$watch;
        }
        return this._ins;
    }

    constructor(key: string, serverIndex: number = 0) {
        this._$key = Common.version + "_" + key;
        if (serverIndex <= 0) {
            let sum = 0;
            key.split("").forEach((part) => {
                sum += part.charCodeAt(0);
            });
            serverIndex = 6 + sum % 20;
        }
        this._$serverIndex = serverIndex;
    }

    create(): void {
        this._id = "UserArchive_" + this._$key + "_"+ Date.now(); let isNew = true; const saved = ArchiveMgr.getInstance().get(this._$key, this._$serverIndex); if (saved && saved._$version) { Object.assign(this, saved); isNew = false; } this.init(isNew); this._$watch = Watch.create(this); ArchiveMgr.getInstance().register(this); } init(_isNew: boolean): void {} on(event: string, callback: (...args: any[]) => void, ...args: any[]): void { this._$watch.on(event, callback, ...args); } once(event: string, callback: (...args: any[]) => void, ...args: any[]): void { this._$watch.once(event, callback, ...args); } off(event: string, callback: (...args: any[]) => void, ...args: any[]): void { this._$watch.off(event, callback, ...args); } targetOff(target: any): void { this._$watch.targetOff(target); } clearAllEvent(): void { this._$watch.clearAllEvent(); } toJSON(): Record<string, any> { const result: Record<string, any> = {}; const skipKeys = (Object.getPrototypeOf(this) as any)[NON_SERIALIZED_KEYS] || []; for (const key in this) { if (!Object.prototype.hasOwnProperty.call(this, key)) { continue; } if (skipKeys.indexOf(key) !==-1) { continue; } result[key] = (this as any)[key]; } return result; }
} nonSerialized(UserArchive.prototype,"_$key");
nonSerialized(UserArchive.prototype, "_$serverIndex");
nonSerialized(UserArchive.prototype, "_$watch");
ignoreWatch()(UserArchive.prototype, "_$version");
nonSerialized(UserArchive.prototype, "_id");
ignoreWatch()(UserArchive.prototype, "_id");
