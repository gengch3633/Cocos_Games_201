import { GametimeConfig } from "./ConfigDefine";
import EncryptXOR from "./EncryptXOR";
import InterfaceMgr from "./InterfaceMgr";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import URL from "./URL";
import UserData from "./UserData";

enum LoadState {
    None = 0,
    Done = 1
}

export default class ConfigMgr extends Singleton {
    public game_knzmx: string = "tt_knzmx";
    public game_hystz: string = "tt_hystz";
    public game_wnzzl: string = "wx_wnzzl";
    public game_kyzmw: string = "wx_kyzmw";
    public gameName: string = "wx_wnzzl";
    public lk_oss: string = "https://lkgame.mrkzx.cn/";
    public dataMap: Map<string, any> = new Map();
    public levelMap: Map<string, any> = new Map();
    public mackList: any = null;
    public loadState: LoadState = LoadState.None;

    public loadAll(baseUrl: string, bundleName: string = "config", dir: string = "/json"): Promise<boolean> {
        const self = this;
        return new Promise(function (resolve) {
            if (self.loadState != LoadState.Done) {
                let pending = 0;
                const isHttp = URL.isHttpUrl(baseUrl);

                const loadRemoteData = async (name: string, isTxt: boolean): Promise<void> => {
                    try {
                        for (let retry = 0; retry < 3; retry++) {
                            await new Promise<void>(function (res) {
                                cc.assetManager.loadRemote(URL.parse(baseUrl, name + (isTxt ? ".txt" : ".json?t=" + Date.now())), function (err: any, asset: any) {
                                    if (isTxt) {
                                        const decrypted = EncryptXOR.getInstance().decrypt(asset.msg);
                                        asset = JSON.parse(decrypted);
                                    } else {
                                        asset = asset.json;
                                    }
                                    self.dataMap.set(name, asset);
                                    res();
                                });
                            });
                        }
                        onProgressDone();
                    } catch (e) {
                        console.error("load local " + name + " error", e);
                        resolve(false);
                    }
                };

                const handleAsset = function (name: string, asset: any): void {
                    try {
                        let isTxt = false;
                        if (asset instanceof cc.TextAsset) {
                            const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                            self.dataMap.set(name, JSON.parse(decrypted));
                            isTxt = true;
                        } else {
                            self.dataMap.set(name, asset.json);
                        }
                        asset.decRef();
                        const isI18n = 0 === String(name || "").indexOf("i18n_");
                        if (isHttp && !isI18n) {
                            loadRemoteData(name, isTxt);
                        } else {
                            onProgressDone();
                        }
                    } catch (e) {
                        console.error("load local " + name + " error", e);
                        resolve(false);
                    }
                };

                const onProgressDone = function (): void {
                    if (--pending <= 0) {
                        self.loadState = LoadState.Done;
                        resolve(true);
                    }
                };

                ResMgr.getInstance().getBundle(bundleName).then(function (bundle: any) {
                    pending += 2;
                    bundle.loadDir(dir, cc.TextAsset, function (err: any, assets: any[]) {
                        pending--;
                        if (err) {
                            console.error(err);
                        } else {
                            pending += assets.length;
                            assets.forEach(function (asset: any) {
                                return handleAsset(asset.name, asset);
                            });
                        }
                    });
                    bundle.loadDir(dir, cc.JsonAsset, function (err: any, assets: any[]) {
                        pending--;
                        if (err) {
                            console.error(err);
                        } else {
                            pending += assets.length;
                            assets.forEach(function (asset: any) {
                                return handleAsset(asset.name, asset);
                            });
                        }
                    });
                });
            } else {
                resolve(true);
            }
        });
    }

    public getOne(table: any): any {
        const name = table.TabName;
        return this.dataMap.get(name);
    }

    public getById(table: any, value: any, field: string = "id"): any {
        const item = this.find(table, function (item: any) {
            return item[field] == value;
        });
        if (!item) {
            console.error("配置表 " + table.TabName + " 中没有找到 " + String(field) + "=" + value + " 的数据");
        }
        return item;
    }

    public getAll(table: any): any {
        const name = table.TabName;
        return this.dataMap.get(name);
    }

    public find(table: any, predicate: (item: any) => boolean): any {
        const list = this.getAll(table);
        return list === null || list === void 0 ? void 0 : list.find(predicate);
    }

    public filter(table: any, predicate: (item: any) => boolean): any {
        const list = this.getAll(table);
        return list === null || list === void 0 ? void 0 : list.filter(predicate);
    }

    public forEach(table: any, callback: (item: any) => void): void {
        const list = this.getAll(table);
        if (!(list === null || list === void 0)) {
            list.forEach(callback);
        }
    }

    public loadLevel(baseUrl: string, bundleName: string = "config", dir: string = "/game"): Promise<boolean> {
        const self = this;
        return new Promise(function (resolve) {
            let pending = 0;
            const isHttp = URL.isHttpUrl(baseUrl);

            const loadRemote = function (path: string, isTxt: boolean): Promise<any> {
                return new Promise(function (res) {
                    cc.assetManager.loadRemote(path, function (err: any, asset: any) {
                        if (err) {
                            console.log(err);
                            res(null);
                        } else {
                            let data: any = null;
                            if (isTxt) {
                                data = JSON.parse(EncryptXOR.getInstance().decrypt(asset.text));
                            } else {
                                data = asset.json;
                            }
                            res(data);
                        }
                    });
                });
            };

            const loadLevelData = async (name: string, isTxt: boolean): Promise<void> => {
                try {
                    for (let retry = 0; retry < 3; retry++) {
                        const path = URL.parse(baseUrl, dir, name + (isTxt ? ".txt" : ".json")) + "?v=" + Date.now();
                        const result = await loadRemote(path, isTxt);
                        if (result) {
                            self.levelMap.set(name, result);
                            break;
                        }
                    }
                    onProgressDone();
                } catch (e) {
                    console.error("load local " + name + " error", e);
                    resolve(false);
                }
            };

            const handleAsset = function (name: string, asset: any): void {
                try {
                    let isTxt = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        self.levelMap.set(name, JSON.parse(decrypted));
                        isTxt = true;
                    } else {
                        self.levelMap.set(name, asset.json);
                    }
                    asset.decRef();
                    if (isHttp) {
                        loadLevelData(name, isTxt);
                    } else {
                        onProgressDone();
                    }
                } catch (e) {
                    console.error("load local " + name + " error", e);
                    resolve(false);
                }
            };

            const onProgressDone = function (): void {
                if (--pending <= 0) {
                    resolve(true);
                }
            };

            ResMgr.getInstance().getBundle(bundleName).then(function (bundle: any) {
                pending += 2;
                bundle.loadDir(dir, cc.TextAsset, function (err: any, assets: any[]) {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach(function (asset: any) {
                            return handleAsset(asset.name, asset);
                        });
                    }
                });
                bundle.loadDir(dir, cc.JsonAsset, function (err: any, assets: any[]) {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach(function (asset: any) {
                            return handleAsset(asset.name, asset);
                        });
                    }
                });
            });
        });
    }

    public getTimeInfoByLevel(levelId: number): any {
        return this.find(GametimeConfig, function (item: any) {
            return item.id === levelId;
        });
    }

    public getAllLevels(): any[] {
        return Array.from(this.levelMap.values());
    }

    public async loadLevelData(level: string, remote: boolean): Promise<boolean> {
        if (null != this.levelMap.get(level)) {
            return true;
        }
        const self = this;
        return new Promise(function (resolve, reject) {
            if (remote) {
                const url = self.lk_oss + self.gameName.split("_")[1] + "/level/" + level + ".json?t=" + Date.now();
                cc.assetManager.loadRemote(url, function (err: any, asset: any) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("json", asset);
                        self.levelMap.set(level, asset.json);
                        resolve(true);
                    }
                });
            } else {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.config).load("game/" + level, function (err: any, asset: any) {
                    if (err) {
                        reject(err);
                    } else {
                        self.levelMap.set(level, asset.json);
                        console.log("load " + level + " data success");
                        resolve(true);
                    }
                });
            }
        });
    }

    public async loadmacList(): Promise<boolean> {
        const self = this;
        return new Promise(function (resolve, reject) {
            const url = self.lk_oss + self.gameName.split("_")[1] + "/systemConfig/maclist.json?t=" + Date.now();
            cc.assetManager.loadRemote(url, function (err: any, asset: any) {
                if (err) {
                    reject(err);
                } else {
                    console.log("macList", asset.json);
                    self.mackList = asset.json;
                    resolve(true);
                }
            });
        });
    }

    public async getMackList(): Promise<any> {
        const self = this;
        return new Promise(function (resolve, reject) {
            if (self.mackList) {
                resolve(self.mackList);
            } else {
                self.loadmacList().then(function () {
                    resolve(self.mackList);
                }).catch(function (e) {
                    reject(e);
                });
            }
        });
    }

    public getLevelById(levelId: string): any {
        return this.levelMap.get("level_" + levelId);
    }

    public async checkMac(): Promise<boolean> {
        const list = await this.getMackList();
        for (let i = 0; i < list.length; i++) {
            if (UserData.getInstance().userID == list[i].macId) {
                return true;
            }
        }
        return false;
    }
}