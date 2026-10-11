import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

export default class ArchiveMgr extends Singleton {
    public localDataMap: { [key: string]: any } = null;
    public serverDatas: any[] = [];
    public prefix: string = "";
    public _id: string = "ArchiveMgr_" + Date.now();
    public sync: boolean = false;
    public syncVersionCount: number = 0;

    public async init(sync: boolean): Promise<boolean> {
        this.sync = sync;
        if (!sync) {
            return true;
        }
        const result: { success: boolean; data: any } = {
            success: true,
            data: {}
        };
        if (!result.success) {
            return false;
        }
        const data = result.data;
        for (const key in data) {
            if (typeof key === "string" && key.startsWith("saveGameModule")) {
                const value = data[key];
                const parts = key.split("saveGameModule");
                const index = parseInt(parts.pop());
                let parsed: any = null;
                if (typeof value === "string" && value) {
                    try {
                        parsed = JSON.parse(value);
                    } catch (e) {
                        console.error("解析存档数据失败", e);
                    }
                }
                if (index >= 1) {
                    this.serverDatas[index] = parsed;
                }
            }
        }
        MultiPlatform.getInstance().on(MultiPlatform.EventType.OnHide, this.saveToServerAll, this);
        return true;
    }

    public setPrefix(prefix: string): void {
        if (prefix) {
            this.prefix = prefix;
        }
    }

    public forceSaveToServer(): Promise<void> {
        return this.saveToServerAll();
    }

    public reset(): Promise<void> {
        return new Promise((resolve) => {
            cc.sys.localStorage.clear();
            if (cc.sys.isBrowser) {
                cc.game.end();
            }
            resolve();
        });
    }

    public register(data: any): void {
        if (!this.localDataMap) {
            this.localDataMap = {};
        }
        this.localDataMap[data._$key] = data;
        if (!this.serverDatas) {
            this.serverDatas = [];
        }
        if (!this.serverDatas[data._$serverIndex]) {
            this.serverDatas[data._$serverIndex] = {};
        }
        this.serverDatas[data._$serverIndex][data._$key] = data;
        data._$watch.on(() => {
            data._$version++;
            this.saveToLocal(data);
            if (this.sync && data._$serverIndex) {
                this.syncVersionCount++;
                if (this.syncVersionCount >= 10) {
                    this.saveToServerAll();
                    this.syncVersionCount = 0;
                }
            }
        }, this);
        this.saveToLocal(data);
    }

    public saveToLocal(data: any): void {
        cc.director.getScheduler().unscheduleAllForTarget(data);
        cc.director.getScheduler().schedule(
            () => {
                cc.sys.localStorage.setItem(data._$key, JSON.stringify(data));
            },
            data,
            0,
            0,
            0,
            false
        );
    }

    public saveToServerAll(): Promise<void> {
        if (!this.sync) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            console.log("数据保存到服务器");
            let i = 0;
            let n = 0;
            this.serverDatas.forEach((data) => {
                if (data && ++n >= ++i) {
                    resolve();
                }
            });
        });
    }

    public get(key: string, serverIndex: number): any {
        const fullKey = this.prefix + key;
        const localRaw = cc.sys.localStorage.getItem(fullKey) ?? null;
        let localData: any = null;
        if (localRaw) {
            try {
                localData = JSON.parse(localRaw);
            } catch (e) {}
        }
        let serverData: any = null;
        if (this.serverDatas && this.serverDatas[serverIndex]) {
            serverData = this.serverDatas[serverIndex][fullKey];
        }
        if (localData == null && serverData == null) {
            return null;
        }
        if (localData == null) {
            return serverData;
        }
        if (serverData == null) {
            return localData;
        }
        return localData._$version > serverData._$version ? localData : serverData;
    }
}