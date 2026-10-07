import Singleton from "./Singleton";

export default class ArchiveMgr extends Singleton {
    localDataMap: { [key: string]: any } | null = null;
    serverDatas: any[] = [];
    prefix = "";
    _id = "ArchiveMgr_" + Date.now();
    sync = false;
    syncVersionCount = 0;

    async init(enableSync: boolean): Promise<boolean> {
        this.sync = enableSync;
        if (!enableSync) {
            return true;
        }
        const response = { success: true, data: {} as any };
        if (!response.success) {
            return false;
        }
        const data = response.data;
        for (const key in data) {
            if (typeof key === "string" && key.startsWith("saveGameModule")) {
                let raw = data[key];
                const parts = key.split("saveGameModule");
                const index = parseInt(parts.pop()!);
                let parsed = null;
                if (typeof raw === "string" && raw) {
                    try {
                        parsed = JSON.parse(raw);
                    } catch (e) {
                        console.error("解析存档数据失败", e);
                    }
                }
                if (index >= 1) {
                    this.serverDatas[index] = parsed;
                }
            }
        }
        const MultiPlatform = require("./MultiPlatform").default;
        MultiPlatform.getInstance().on(MultiPlatform.EventType.OnHide, this.saveToServerAll, this);
        return true;
    }

    setPrefix(prefix: string): void {
        if (prefix) {
            this.prefix = prefix;
        }
    }

    forceSaveToServer(): Promise<void> {
        return this.saveToServerAll();
    }

    reset(): Promise<void> {
        return new Promise(async (resolve) => {
            cc.sys.localStorage.clear();
            if (cc.sys.isBrowser) {
                cc.game.end();
            }
            resolve();
        });
    }

    register(item: any): void {
        if (!this.localDataMap) {
            this.localDataMap = {};
        }
        this.localDataMap[item._$key] = item;
        if (!this.serverDatas) {
            this.serverDatas = [];
        }
        if (!this.serverDatas[item._$serverIndex]) {
            this.serverDatas[item._$serverIndex] = {};
        }
        this.serverDatas[item._$serverIndex][item._$key] = item;
        item._$watch.on(() => {
            item._$version++;
            this.saveToLocal(item);
            if (this.sync && item._$serverIndex) {
                this.syncVersionCount++;
                if (this.syncVersionCount >= 10) {
                    this.saveToServerAll();
                    this.syncVersionCount = 0;
                }
            }
        }, this);
        this.saveToLocal(item);
    }

    saveToLocal(item: any): void {
        cc.director.getScheduler().unscheduleAllForTarget(item);
        cc.director.getScheduler().schedule(() => {
            cc.sys.localStorage.setItem(item._$key, JSON.stringify(item));
        }, item, 0, 0, 0, false);
    }

    saveToServerAll(): Promise<void> {
        if (!this.sync) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            console.log("数据保存到服务器");
            let finished = 0;
            let total = 0;
            this.serverDatas.forEach((entry) => {
                if (entry) {
                    ++total;
                }
                if (++finished >= total) {
                    resolve();
                }
            });
        });
    }

    get(key: string, serverIndex: number): any {
        const storageKey = this.prefix + key;
        const localRaw = cc.sys.localStorage.getItem(storageKey) ?? null;
        let localData = null;
        if (localRaw) {
            try {
                localData = JSON.parse(localRaw);
            } catch (e) {
            }
        }
        let serverData = null;
        if (this.serverDatas && this.serverDatas[serverIndex]) {
            serverData = this.serverDatas[serverIndex][storageKey];
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
