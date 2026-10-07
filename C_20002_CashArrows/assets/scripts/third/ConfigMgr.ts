import EncryptXOR from "./EncryptXOR";
import { GametimeConfig } from "./ConfigDefine";
import InterfaceMgr from "./InterfaceMgr";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import URL from "./URL";
import UserData from "./UserData";

enum LoadState {
    None = 0,
    Done = 1,
}

interface ConfigTab {
    TabName: string;
}

export default class ConfigMgr extends Singleton {
    game_knzmx: string = " tt_knzmx ";
    game_hystz: string = " tt_hystz ";
    game_wnzzl: string = " wx_wnzzl ";
    game_kyzmw: string = " wx_kyzmw ";
    gameName: string = " wx_wnzzl ";
    lk_oss: string = " https:// lkgame.mrkzx.cn/ ";
    dataMap: Map<string, any> = new Map();
    levelMap: Map<string, any> = new Map();
    mackList: any = null;
    loadState: LoadState = LoadState.None;

    loadAll(baseUrl: string, bundleName: string = " config ", jsonDir: string = "/ json "): Promise<boolean> {
        const self = this;
        return new Promise((resolve) => {
            if (self.loadState != LoadState.Done) {
                let pendingCount = 0;
                const isHttpUrl = URL.isHttpUrl(baseUrl);

                const onAllComplete = () => {
                    if (--pendingCount <= 0) {
                        self.loadState = LoadState.Done;
                        resolve(true);
                    }
                };

                const loadRemoteConfig = async (name: string, isEncrypted: boolean) => {
                    try {
                        for (let retry = 0; retry < 3; retry++) {
                            await new Promise<void>((res, rej) => {
                                cc.assetManager.loadRemote(
                                    URL.parse(baseUrl, name + (isEncrypted ? ".txt " : ".json? t = " + Date.now())),
                                    (err, asset: any) => {
                                        if (err) {
                                            rej(err);
                                            return;
                                        }
                                        let data = asset;
                                        if (isEncrypted) {
                                            const decrypted = EncryptXOR.getInstance().decrypt(asset.msg);
                                            data = JSON.parse(decrypted);
                                        } else {
                                            data = asset.json;
                                        }
                                        self.dataMap.set(name, data);
                                        res();
                                    }
                                );
                            });
                        }
                        onAllComplete();
                    } catch (err) {
                        console.error(" load local " + name + " error ", err);
                        resolve(false);
                    }
                };

                const processAsset = (name: string, asset: cc.TextAsset | cc.JsonAsset) => {
                    try {
                        let isEncrypted = false;
                        if (asset instanceof cc.TextAsset) {
                            const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                            self.dataMap.set(name, JSON.parse(decrypted));
                            isEncrypted = true;
                        } else {
                            self.dataMap.set(name, (asset as cc.JsonAsset).json);
                        }
                        asset.decRef();
                        const isI18n = String(name || " ").indexOf(" i18n_ ") === 0;
                        isHttpUrl && !isI18n ? loadRemoteConfig(name, isEncrypted) : onAllComplete();
                    } catch (err) {
                        console.error(" load local " + name + " error ", err);
                        resolve(false);
                    }
                };

                ResMgr.getInstance().getBundle(bundleName).then((bundle) => {
                    pendingCount += 2;
                    bundle.loadDir(jsonDir, cc.TextAsset, (err, assets: cc.TextAsset[]) => {
                        pendingCount--;
                        if (err) {
                            console.error(err);
                        } else {
                            pendingCount += assets.length;
                            assets.forEach((item) => processAsset(item.name, item));
                        }
                    });
                    bundle.loadDir(jsonDir, cc.JsonAsset, (err, assets: cc.JsonAsset[]) => {
                        pendingCount--;
                        if (err) {
                            console.error(err);
                        } else {
                            pendingCount += assets.length;
                            assets.forEach((item) => processAsset(item.name, item));
                        }
                    });
                });
            } else {
                resolve(true);
            }
        });
    }

    getOne(config: ConfigTab): any {
        const tabName = config.TabName;
        return this.dataMap.get(tabName);
    }

    getById(config: ConfigTab, id: any, idField: string = " id "): any {
        const result = this.find(config, (row) => row[idField] == id);
        result || console.error(" 配置表 " + config.TabName + " 中没有找到 " + String(idField) + " = " + id + " 的数据 ");
        return result;
    }

    getAll(config: ConfigTab): any {
        const tabName = config.TabName;
        return this.dataMap.get(tabName);
    }

    find(config: ConfigTab, predicate: (row: any) => boolean): any {
        const rows = this.getAll(config);
        return rows?.find(predicate);
    }

    filter(config: ConfigTab, predicate: (row: any) => boolean): any {
        const rows = this.getAll(config);
        return rows?.filter(predicate);
    }

    forEach(config: ConfigTab, callback: (row: any) => void): void {
        const rows = this.getAll(config);
        rows?.forEach(callback);
    }

    loadLevel(baseUrl: string, bundleName: string = " config ", gameDir: string = "/ game "): Promise<boolean> {
        const self = this;
        return new Promise((resolve) => {
            let pendingCount = 0;
            const isHttpUrl = URL.isHttpUrl(baseUrl);

            const onAllComplete = () => {
                if (--pendingCount <= 0) {
                    resolve(true);
                }
            };

            const loadRemoteAsset = (url: string, isEncrypted: boolean): Promise<any> => {
                return new Promise((res) => {
                    cc.assetManager.loadRemote(url, (err, asset: any) => {
                        if (err) {
                            console.log(err);
                            res(null);
                        } else {
                            let data = null;
                            if (isEncrypted) {
                                data = JSON.parse(EncryptXOR.getInstance().decrypt(asset.text));
                            } else {
                                data = asset.json;
                            }
                            res(data);
                        }
                    });
                });
            };

            const loadRemoteLevel = async (name: string, isEncrypted: boolean) => {
                try {
                    for (let retry = 0; retry < 3; retry++) {
                        const url =
                            URL.parse(baseUrl, gameDir, name + (isEncrypted ? ".txt " : ".json ")) +
                            "? v = " +
                            Date.now();
                        const data = await loadRemoteAsset(url, isEncrypted);
                        if (data) {
                            self.levelMap.set(name, data);
                            break;
                        }
                    }
                    onAllComplete();
                } catch (err) {
                    console.error(" load local " + name + " error ", err);
                    resolve(false);
                }
            };

            const processAsset = (name: string, asset: cc.TextAsset | cc.JsonAsset) => {
                try {
                    let isEncrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        self.levelMap.set(name, JSON.parse(decrypted));
                        isEncrypted = true;
                    } else {
                        self.levelMap.set(name, (asset as cc.JsonAsset).json);
                    }
                    asset.decRef();
                    isHttpUrl ? loadRemoteLevel(name, isEncrypted) : onAllComplete();
                } catch (err) {
                    console.error(" load local " + name + " error ", err);
                    resolve(false);
                }
            };

            ResMgr.getInstance().getBundle(bundleName).then((bundle) => {
                pendingCount += 2;
                bundle.loadDir(gameDir, cc.TextAsset, (err, assets: cc.TextAsset[]) => {
                    pendingCount--;
                    if (err) {
                        console.error(err);
                    } else {
                        pendingCount += assets.length;
                        assets.forEach((item) => processAsset(item.name, item));
                    }
                });
                bundle.loadDir(gameDir, cc.JsonAsset, (err, assets: cc.JsonAsset[]) => {
                    pendingCount--;
                    if (err) {
                        console.error(err);
                    } else {
                        pendingCount += assets.length;
                        assets.forEach((item) => processAsset(item.name, item));
                    }
                });
            });
        });
    }

    getTimeInfoByLevel(levelId: number): any {
        return this.find(GametimeConfig, (row) => row.id === levelId);
    }

    getAllLevels(): any[] {
        return Array.from(this.levelMap.values());
    }

    async loadLevelData(levelName: string, fromRemote: boolean): Promise<boolean> {
        if (null != this.levelMap.get(levelName)) {
            return true;
        }
        return new Promise((resolve, reject) => {
            if (fromRemote) {
                const url =
                    this.lk_oss +
                    this.gameName.split(" _ ")[1] +
                    "/ level/ " +
                    levelName +
                    ".json? t = " +
                    Date.now();
                cc.assetManager.loadRemote(url, (err, asset: cc.JsonAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(" json ", asset);
                        this.levelMap.set(levelName, asset.json);
                        resolve(true);
                    }
                });
            } else {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.config).load(" game/ " + levelName, (err, asset: cc.JsonAsset) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.levelMap.set(levelName, asset.json);
                        console.log(" load " + levelName + " data success ");
                        resolve(true);
                    }
                });
            }
        });
    }

    async loadmacList(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const url =
                this.lk_oss +
                this.gameName.split(" _ ")[1] +
                "/ systemConfig/ maclist.json? t = " +
                Date.now();
            cc.assetManager.loadRemote(url, (err, asset: cc.JsonAsset) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(" macList ", asset.json);
                    this.mackList = asset.json;
                    resolve(true);
                }
            });
        });
    }

    async getMackList(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.mackList) {
                resolve(this.mackList);
            } else {
                this.loadmacList()
                    .then(() => {
                        resolve(this.mackList);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        });
    }

    getLevelById(id: number): any {
        return this.levelMap.get(" level_ " + id);
    }

    async checkMac(): Promise<boolean> {
        const macList = await this.getMackList();
        for (let i = 0; i < macList.length; i++) {
            if (UserData.getInstance().userID == macList[i].macId) {
                return true;
            }
        }
        return false;
    }
}
