import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class ArchiveMgr extends Singleton {
    localDataMap: any = null;
    serverDatas: any[] = [];
    prefix: string = "";
    _id: string;
    sync: boolean = false;
    syncVersionCount: number = 0;

    constructor() {
        super();
        this.localDataMap = null;
        this.serverDatas = [];
        this.prefix = "";
        this._id = "ArchiveMgr_" + Date.now();
        this.sync = false;
        this.syncVersionCount = 0;
    }

    async init(e: any): Promise<any> {
        var t: any, i: any, n: any, a: any, s: any, l: any, c: any;
        this.sync = e;
        if (!e) return true;
        if (!(t = {
            success: true, data: {
            }
        }).success) return false;
        for (n in i = t.data) if ("string" == typeof n && n.startsWith("saveGameModule") && (a = i[n], s = n.split("saveGameModule"), l = parseInt(s.pop()), "string" == typeof a && (c = null, a))) {
            try {
                c = JSON.parse(a);
            } catch (e) {
                console.error("解析存档数据失败", e);
            }
            l >= 1 && (this.serverDatas[l] = c);
        }
        MultiPlatform.getInstance().on(MultiPlatform.EventType.OnHide, this.saveToServerAll, this);
        return true;
    }

    setPrefix(e: any) {
        e && (this.prefix = e);
    }

    forceSaveToServer() {
        return this.saveToServerAll();
    }

    reset() {
        return new Promise(function (t) {
            cc.sys.localStorage.clear();
            cc.sys.isBrowser && cc.game.end();
            t(undefined);
        });
    }

    register(e: any) {
        var t = this;
        this.localDataMap || (this.localDataMap = {});
        this.localDataMap[e._$key] = e;
        this.serverDatas || (this.serverDatas = []);
        this.serverDatas[e._$serverIndex] || (this.serverDatas[e._$serverIndex] = {});
        this.serverDatas[e._$serverIndex][e._$key] = e;
        e._$watch.on(function () {
            e._$version++;
            t.saveToLocal(e);
            if (t.sync && e._$serverIndex) {
                t.syncVersionCount++;
                t.syncVersionCount >= 10 && (t.saveToServerAll(), t.syncVersionCount = 0);
            }
        }, this);
        this.saveToLocal(e);
    }

    saveToLocal(e: any) {
        cc.director.getScheduler().unscheduleAllForTarget(e);
        cc.director.getScheduler().schedule(function () {
            cc.sys.localStorage.setItem(e._$key, JSON.stringify(e));
        }, e, 0, 0, 0, false);
    }

    saveToServerAll() {
        var e = this;
        return this.sync ? new Promise(function (t) {
            console.log("数据保存到服务器");
            var i = 0, n = 0;
            e.serverDatas.forEach(function (e) {
                e && ++n >= ++i && t(undefined);
            });
        }) : Promise.resolve();
    }

    get(e: any, t: any) {
        var i, n = this.prefix + e, a = null !== (i = cc.sys.localStorage.getItem(n)) && void 0 !== i ? i : null, o = null;
        if (a) try {
            o = JSON.parse(a);
        } catch (e) {}
        var r = null;
        this.serverDatas && this.serverDatas[t] && (r = this.serverDatas[t][n]);
        return null == o && null == r ? null : null == o ? r : null == r ? o : o._$version > r._$version ? o : r;
    }
}
