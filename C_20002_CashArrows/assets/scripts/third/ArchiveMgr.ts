import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

interface ArchiveData {
    _$key: string;
    _$serverIndex: number;
    _$version: number;
    _$watch: {
        on(callback: Function, caller: any): void;
    };
}

export default class ArchiveMgr extends Singleton {
    localDataMap: { [key: string]: ArchiveData } = null;
    serverDatas: any[] = [];
    prefix: string = "";
    private _id: string = "ArchiveMgr_" + Date.now();
    sync: boolean = false;
    syncVersionCount: number = 0;

    async init(enableSync: boolean): Promise<boolean> {
        this.sync = enableSync;
        if (!enableSync) {
            return true;
        }
        const response = {
            success: true,
            data: {}
        };
        if (!response.success) {
            return false;
        }
        const data = response.data;
        for (const key in data) {
            if (typeof key === "string" && key.startsWith("saveGameModule")) {
                const rawValue = data[key];
                const parts = key.split("saveGameModule");
                const index = parseInt(parts.pop());
                if (typeof rawValue === "string" && rawValue) {
                    let parsed = null;
                    try {
                        parsed = JSON.parse(rawValue);
                    } catch (e) {
                        console.error("解析存档数据失败", e);
                    }
                    if (index >= 1) {
                        this.serverDatas[index] = parsed;
                    }
                }
            }
        }
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

    register(data: ArchiveData): void {
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

    saveToLocal(data: ArchiveData): void {
        cc.director.getScheduler().unscheduleAllForTarget(data);
        cc.director.getScheduler().schedule(() => {
            cc.sys.localStorage.setItem(data._$key, JSON.stringify(data));
        }, data, 0, 0, 0, false);
    }

    saveToServerAll(): Promise<void> {
        if (!this.sync) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            console.log("数据保存到服务器");
            let completed = 0;
            let total = 0;
            this.serverDatas.forEach((item) => {
                if (item) {
                    ++total;
                    if (++completed >= total) {
                        resolve();
                    }
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
