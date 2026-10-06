import MultiPlatform from "./MultiPlatform";
import Singleton from "./Singleton";

interface ArchiveEntry {
    _$key: string;
    _$serverIndex: number;
    _$version: number;
    _$watch: { on(callback: () => void, target: unknown): void };
}

export default class ArchiveMgr extends Singleton {
    localDataMap: Record<string, ArchiveEntry> | null = null;
    serverDatas: Record<string, unknown>[] = [];
    prefix = "";
    _id = "ArchiveMgr_" + Date.now();
    sync = false;
    syncVersionCount = 0;

    async init(enableSync: boolean): Promise<boolean> {
        this.sync = enableSync;
        if (!enableSync) {
            return true;
        }

        const response = {
            success: true,
            data: {} as Record<string, string>,
        };

        if (!response.success) {
            return false;
        }

        const data = response.data;
        for (const key in data) {
            if (typeof key === "string" && key.startsWith("saveGameModule")) {
                const raw = data[key];
                const parts = key.split("saveGameModule");
                const index = parseInt(parts.pop()!, 10);
                if (typeof raw === "string" && raw) {
                    let parsed: unknown = null;
                    try {
                        parsed = JSON.parse(raw);
                    } catch (error) {
                        console.error("解析存档数据失败", error);
                    }
                    if (index >= 1) {
                        this.serverDatas[index] = parsed as Record<string, unknown>;
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
        return new Promise((resolve) => {
            cc.sys.localStorage.clear();
            if (cc.sys.isBrowser) {
                cc.game.end();
            }
            resolve();
        });
    }

    register(entry: ArchiveEntry): void {
        if (!this.localDataMap) {
            this.localDataMap = {};
        }
        this.localDataMap[entry._$key] = entry;
        if (!this.serverDatas) {
            this.serverDatas = [];
        }
        if (!this.serverDatas[entry._$serverIndex]) {
            this.serverDatas[entry._$serverIndex] = {};
        }
        (this.serverDatas[entry._$serverIndex] as Record<string, ArchiveEntry>)[entry._$key] = entry;

        entry._$watch.on(() => {
            entry._$version++;
            this.saveToLocal(entry);
            if (this.sync && entry._$serverIndex) {
                this.syncVersionCount++;
                if (this.syncVersionCount >= 10) {
                    this.saveToServerAll();
                    this.syncVersionCount = 0;
                }
            }
        }, this);

        this.saveToLocal(entry);
    }

    saveToLocal(entry: ArchiveEntry): void {
        cc.director.getScheduler().unscheduleAllForTarget(entry);
        cc.director.getScheduler().schedule(() => {
            cc.sys.localStorage.setItem(entry._$key, JSON.stringify(entry));
        }, entry, 0, 0, 0, false);
    }

    saveToServerAll(): Promise<void> {
        if (!this.sync) {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            console.log("数据保存到服务器");
            let completed = 0;
            let total = 0;
            this.serverDatas.forEach((data) => {
                if (data) {
                    total++;
                    completed++;
                    if (completed >= total) {
                        resolve();
                    }
                }
            });
        });
    }

    get(key: string, serverIndex: number): unknown {
        const storageKey = this.prefix + key;
        const raw = cc.sys.localStorage.getItem(storageKey);
        let localData: { _$version?: number } | null = null;
        if (raw) {
            try {
                localData = JSON.parse(raw);
            } catch {
                // ignore parse errors
            }
        }

        let serverData: { _$version?: number } | null = null;
        if (this.serverDatas && this.serverDatas[serverIndex]) {
            serverData = (this.serverDatas[serverIndex] as Record<string, unknown>)[storageKey] as { _$version?: number } | null;
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
        return (localData._$version || 0) > (serverData._$version || 0) ? localData : serverData;
    }
}
