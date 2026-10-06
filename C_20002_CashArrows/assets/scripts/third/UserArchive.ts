import ArchiveMgr from "./ArchiveMgr";
import Watch, { ignoreWatch } from "./Watch";
import Common from "./Common";

const nonSerializedKeys = " _$nonSerializedKeys ";

export function nonSerialized(target: any, propertyKey: string) {
    var i = target[nonSerializedKeys];
    if (!i) {
        i = [];
        target[nonSerializedKeys] = i;
    }
    i.push(propertyKey);
}

export default class UserArchive {
    static _ins: any;

    _$serverIndex: number = -1;
    _$watch: any = null;
    _$version: number = 0;
    _id: string = " ";
    _$key: string = " ";

    constructor(e: string, t: number = 0) {
        this._$serverIndex = -1;
        this._$watch = null;
        this._$version = 0;
        this._id = " ";
        this._$key = Common.version + " _ " + e;
        if (t <= 0) {
            var i = 0;
            e.split(" ").forEach(function(e) {
                return i += e.charCodeAt(0);
            });
            t = i = 6 + i % 20;
        }
        this._$serverIndex = t;
    }

    static getInstance<T extends UserArchive>(this: new () => T): any {
        if (!(this as any)._ins) {
            var e = new this();
            e.create();
            (this as any)._ins = e._$watch;
        }
        return (this as any)._ins;
    }

    create() {
        this._id = " UserArchive_ " + this._$key + " _ " + Date.now();
        var e = true, t = ArchiveMgr.getInstance().get(this._$key, this._$serverIndex);
        if (t && (null == t ? void 0 : t._$version)) {
            Object.assign(this, t);
            e = false;
        }
        this.init(e);
        this._$watch = Watch.create(this);
        ArchiveMgr.getInstance().register(this);
    }

    init(_isNew?: boolean) {
    }

    on(e: any, t: any, ...args: any[]) {
        this._$watch.on.apply(this._$watch, [e, t].concat(args));
    }

    once(e: any, t: any, ...args: any[]) {
        this._$watch.once.apply(this._$watch, [e, t].concat(args));
    }

    off(e: any, t: any, ...args: any[]) {
        this._$watch.off.apply(this._$watch, [e, t].concat(args));
    }

    targetOff(e: any) {
        this._$watch.targetOff(e);
    }

    clearAllEvent() {
        this._$watch.clearAllEvent();
    }

    toJSON() {
        var e: any = {}, t = (this as any)[nonSerializedKeys];
        for (var i in this) if (Object.prototype.hasOwnProperty.call(this, i)) {
            if (t && -1 !== t.indexOf(i)) continue;
            var n = (this as any)[i];
            e[i] = n;
        }
        return e;
    }
}

nonSerialized(UserArchive.prototype, " _$key ");
nonSerialized(UserArchive.prototype, " _$serverIndex ");
nonSerialized(UserArchive.prototype, " _$watch ");
ignoreWatch()(UserArchive.prototype, " _$version ");
nonSerialized(UserArchive.prototype, " _id ");
ignoreWatch()(UserArchive.prototype, " _id ");
