import InterfaceMgr from "./InterfaceMgr";
import { GametimeConfig } from "./ConfigDefine";
import UserData from "./UserData";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import EncryptXOR from "./EncryptXOR";
import URL from "./URL";

enum LoadState {
    None = 0,
    Done = 1,
}

interface ConfigTable {
    TabName: string;
}

export default class ConfigMgr extends Singleton {
    game_knzmx = "tt_knzmx";
    game_hystz = "tt_hystz";
    game_wnzzl = "wx_wnzzl";
    game_kyzmw = "wx_kyzmw";
    gameName = "wx_wnzzl";
    lk_oss = "https://lkgame.mrkzx.cn/";
    dataMap = new Map<string, unknown[]>();
    levelMap = new Map<string, unknown>();
    mackList: unknown[] | null = null;
    loadState = LoadState.None;

    loadAll(baseUrl: string, bundleName = "config", dir = "/json"): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.loadState === LoadState.Done) {
                resolve(true);
                return;
            }

            let pending = 0;
            const isRemote = URL.isHttpUrl(baseUrl);

            const finishOne = () => {
                if (--pending <= 0) {
                    this.loadState = LoadState.Done;
                    resolve(true);
                }
            };

            const loadRemoteTable = async (tableName: string, encrypted: boolean) => {
                try {
                    for (let attempt = 0; attempt < 3; attempt++) {
                        await new Promise<void>((remoteResolve, remoteReject) => {
                            cc.assetManager.loadRemote(
                                URL.parse(baseUrl, tableName + (encrypted ? ".txt" : ".json?t=" + Date.now())),
                                (_error, asset: any) => {
                                    if (encrypted) {
                                        const decrypted = EncryptXOR.getInstance().decrypt(asset.msg);
                                        asset = JSON.parse(decrypted);
                                    } else {
                                        asset = asset.json;
                                    }
                                    this.dataMap.set(tableName, asset);
                                    remoteResolve();
                                },
                            );
                        });
                    }
                    finishOne();
                } catch (error) {
                    console.error("load local " + tableName + " error", error);
                    resolve(false);
                }
            };

            const loadLocalTable = (tableName: string, asset: cc.TextAsset | cc.JsonAsset) => {
                try {
                    let encrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        this.dataMap.set(tableName, JSON.parse(decrypted));
                        encrypted = true;
                    } else {
                        this.dataMap.set(tableName, asset.json);
                    }
                    asset.decRef();
                    const isI18n = String(tableName || "").indexOf("i18n_") === 0;
                    if (isRemote && !isI18n) {
                        loadRemoteTable(tableName, encrypted);
                    } else {
                        finishOne();
                    }
                } catch (error) {
                    console.error("load local " + tableName + " error", error);
                    resolve(false);
                }
            };

            ResMgr.getInstance()
                .getBundle(bundleName)
                .then((bundle) => {
                    pending += 2;
                    bundle.loadDir(dir, cc.TextAsset, (error, assets) => {
                        pending--;
                        if (error) {
                            console.error(error);
                        } else {
                            pending += assets.length;
                            assets.forEach((asset) => loadLocalTable(asset.name, asset));
                        }
                    });
                    bundle.loadDir(dir, cc.JsonAsset, (error, assets) => {
                        pending--;
                        if (error) {
                            console.error(error);
                        } else {
                            pending += assets.length;
                            assets.forEach((asset) => loadLocalTable(asset.name, asset));
                        }
                    });
                });
        });
    }

    getOne<T = unknown[]>(table: ConfigTable): T | undefined {
        return this.dataMap.get(table.TabName) as T | undefined;
    }

    getById<T extends Record<string, unknown>>(table: ConfigTable, id: unknown, idField = "id"): T | undefined {
        const row = this.find<T>(table, (item) => item[idField] == id);
        if (!row) {
            console.error("配置表 " + table.TabName + " 中没有找到 " + String(idField) + "=" + id + " 的数据");
        }
        return row;
    }

    getAll<T = unknown[]>(table: ConfigTable): T | undefined {
        return this.dataMap.get(table.TabName) as T | undefined;
    }

    find<T = unknown>(table: ConfigTable, predicate: (item: T) => boolean): T | undefined {
        return this.getAll<T[]>(table)?.find(predicate);
    }

    filter<T = unknown>(table: ConfigTable, predicate: (item: T) => boolean): T[] | undefined {
        return this.getAll<T[]>(table)?.filter(predicate);
    }

    forEach<T = unknown>(table: ConfigTable, callback: (item: T) => void): void {
        this.getAll<T[]>(table)?.forEach(callback);
    }

    loadLevel(baseUrl: string, bundleName = "config", dir = "/game"): Promise<boolean> {
        return new Promise((resolve) => {
            let pending = 0;
            const isRemote = URL.isHttpUrl(baseUrl);

            const finishOne = () => {
                if (--pending <= 0) {
                    resolve(true);
                }
            };

            const loadRemoteLevel = async (levelName: string, encrypted: boolean) => {
                try {
                    for (let attempt = 0; attempt < 3; attempt++) {
                        const data = await new Promise<unknown>((remoteResolve) => {
                            const url = URL.parse(baseUrl, dir, levelName + (encrypted ? ".txt" : ".json")) + "?v=" + Date.now();
                            cc.assetManager.loadRemote(url, (error, asset: any) => {
                                if (error) {
                                    console.log(error);
                                    remoteResolve(null);
                                    return;
                                }
                                if (encrypted) {
                                    remoteResolve(JSON.parse(EncryptXOR.getInstance().decrypt(asset.text)));
                                } else {
                                    remoteResolve(asset.json);
                                }
                            });
                        });
                        if (data) {
                            this.levelMap.set(levelName, data);
                            break;
                        }
                    }
                    finishOne();
                } catch (error) {
                    console.error("load local " + levelName + " error", error);
                    resolve(false);
                }
            };

            const loadLocalLevel = (levelName: string, asset: cc.TextAsset | cc.JsonAsset) => {
                try {
                    let encrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        this.levelMap.set(levelName, JSON.parse(decrypted));
                        encrypted = true;
                    } else {
                        this.levelMap.set(levelName, asset.json);
                    }
                    asset.decRef();
                    if (isRemote) {
                        loadRemoteLevel(levelName, encrypted);
                    } else {
                        finishOne();
                    }
                } catch (error) {
                    console.error("load local " + levelName + " error", error);
                    resolve(false);
                }
            };

            ResMgr.getInstance()
                .getBundle(bundleName)
                .then((bundle) => {
                    pending += 2;
                    bundle.loadDir(dir, cc.TextAsset, (error, assets) => {
                        pending--;
                        if (error) {
                            console.error(error);
                        } else {
                            pending += assets.length;
                            assets.forEach((asset) => loadLocalLevel(asset.name, asset));
                        }
                    });
                    bundle.loadDir(dir, cc.JsonAsset, (error, assets) => {
                        pending--;
                        if (error) {
                            console.error(error);
                        } else {
                            pending += assets.length;
                            assets.forEach((asset) => loadLocalLevel(asset.name, asset));
                        }
                    });
                });
        });
    }

    getTimeInfoByLevel(level: number): unknown {
        return this.find(GametimeConfig, (item: { id: number }) => item.id === level);
    }

    getAllLevels(): unknown[] {
        return Array.from(this.levelMap.values());
    }

    async loadLevelData(levelId: string, remote = false): Promise<boolean> {
        if (this.levelMap.get(levelId) != null) {
            return true;
        }
        return new Promise((resolve, reject) => {
            if (remote) {
                const url = this.lk_oss + this.gameName.split("_")[1] + "/level/" + levelId + ".json?t=" + Date.now();
                cc.assetManager.loadRemote(url, (error, asset: cc.JsonAsset) => {
                    if (error) {
                        reject(error);
                    } else {
                        console.log("json", asset);
                        this.levelMap.set(levelId, asset.json);
                        resolve(true);
                    }
                });
            } else {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.config).load("game/" + levelId, (error, asset: cc.JsonAsset) => {
                    if (error) {
                        reject(error);
                    } else {
                        this.levelMap.set(levelId, asset.json);
                        console.log("load " + levelId + " data success");
                        resolve(true);
                    }
                });
            }
        });
    }

    async loadmacList(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const url = this.lk_oss + this.gameName.split("_")[1] + "/systemConfig/maclist.json?t=" + Date.now();
            cc.assetManager.loadRemote(url, (error, asset: cc.JsonAsset) => {
                if (error) {
                    reject(error);
                } else {
                    console.log("macList", asset.json);
                    this.mackList = asset.json;
                    resolve(true);
                }
            });
        });
    }

    async getMackList(): Promise<unknown[]> {
        if (this.mackList) {
            return this.mackList;
        }
        await this.loadmacList();
        return this.mackList || [];
    }

    getLevelById(levelId: number): unknown {
        return this.levelMap.get("level_" + levelId);
    }

    async checkMac(): Promise<boolean> {
        const macList = (await this.getMackList()) as Array<{ macId: string }>;
        for (let i = 0; i < macList.length; i++) {
            if (UserData.getInstance().userID == macList[i].macId) {
                return true;
            }
        }
        return false;
    }
}
