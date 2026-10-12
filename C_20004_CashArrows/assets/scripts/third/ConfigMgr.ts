const { ccclass, property } = cc._decorator;

import * as ConfigDefine from "./ConfigDefine";
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

interface IConfigTable {
    TabName: string;
    [key: string]: any;
}

@ccclass
export default class ConfigMgr extends Singleton {
    public game_knzmx: string = "tt_knzmx";
    public game_hystz: string = "tt_hystz";
    public game_wnzzl: string = "wx_wnzzl";
    public gameName: string = "wx_wnzzl";
    public lk_oss: string = "https://lkgame.mrkzx.cn/";
    public dataMap: Map<string, any> = new Map();
    public levelMap: Map<string, any> = new Map();
    public mackList: any = null;
    public loadState: LoadState = LoadState.None;

    public loadAll(url: string, bundleName: string = "config", dir: string = "/json"): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.loadState == LoadState.Done) {
                resolve(true);
                return;
            }

            let pending = 0;
            const isHttp = URL.isHttpUrl(url);

            const finish = (): void => {
                if (--pending <= 0) {
                    this.loadState = LoadState.Done;
                    resolve(true);
                }
            };

            const loadRemoteData = async (name: string, decrypt: boolean): Promise<void> => {
                try {
                    for (let i = 0; i < 3; i++) {
                        await new Promise<void>((resolveLoad) => {
                            const remoteUrl = URL.parse(url, name + (decrypt ? ".txt" : ".json?t=" + Date.now()));
                            cc.assetManager.loadRemote(remoteUrl, (err: any, asset: any) => {
                                try {
                                    if (err) {
                                        console.error(err);
                                    } else {
                                        if (decrypt) {
                                            const text = EncryptXOR.getInstance().decrypt(asset.msg);
                                            asset = JSON.parse(text);
                                        } else {
                                            asset = asset.json;
                                        }
                                        this.dataMap.set(name, asset);
                                    }
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    resolveLoad();
                                }
                            });
                        });
                    }
                    finish();
                } catch (e) {
                    console.error("load local " + name + " error", e);
                    resolve(false);
                }
            };

            const loadOne = (name: string, asset: any): void => {
                try {
                    let decrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const text = EncryptXOR.getInstance().decrypt(asset.text);
                        this.dataMap.set(name, JSON.parse(text));
                        decrypted = true;
                    } else {
                        this.dataMap.set(name, asset.json);
                    }
                    asset.decRef();
                    const isI18n = String(name || "").indexOf("i18n_") === 0;
                    if (isHttp && !isI18n) {
                        loadRemoteData(name, decrypted);
                    } else {
                        finish();
                    }
                } catch (e) {
                    console.error("load local " + name + " error", e);
                    resolve(false);
                }
            };

            ResMgr.getInstance().getBundle(bundleName).then((bundle: cc.AssetManager.Bundle) => {
                pending += 2;
                bundle.loadDir(dir, cc.TextAsset, (err: any, assets: cc.TextAsset[]) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => loadOne(asset.name, asset));
                    }
                });
                bundle.loadDir(dir, cc.JsonAsset, (err: any, assets: cc.JsonAsset[]) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => loadOne(asset.name, asset));
                    }
                });
            });
        });
    }

    public getOne(table: IConfigTable): any {
        return this.dataMap.get(table.TabName);
    }

    public getById(table: IConfigTable, id: any, key: string = "id"): any {
        const item = this.find(table, (data: any) => data[key] == id);
        if (!item) {
            console.error("配置表 " + table.TabName + " 中没有找到 " + String(key) + "=" + id + " 的数据");
        }
        return item;
    }

    public getAll(table: IConfigTable): any {
        return this.dataMap.get(table.TabName);
    }

    public find(table: IConfigTable, predicate: (value: any, index: number, array: any[]) => boolean): any {
        const list = this.getAll(table);
        return list ? list.find(predicate) : undefined;
    }

    public filter(table: IConfigTable, predicate: (value: any, index: number, array: any[]) => boolean): any[] | undefined {
        const list = this.getAll(table);
        return list ? list.filter(predicate) : undefined;
    }

    public forEach(table: IConfigTable, callback: (value: any, index: number, array: any[]) => void): void {
        const list = this.getAll(table);
        if (list) {
            list.forEach(callback);
        }
    }

    public loadLevel(url: string, bundleName: string = "config", dir: string = "/game"): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let pending = 0;
            const isHttp = URL.isHttpUrl(url);

            const finish = (): void => {
                if (--pending <= 0) {
                    resolve(true);
                }
            };

            const loadRemoteLevelData = async (levelName: string, decrypt: boolean): Promise<void> => {
                try {
                    for (let i = 0; i < 3; i++) {
                        const remoteUrl = URL.parse(url, dir, levelName + (decrypt ? ".txt" : ".json")) + "?v=" + Date.now();
                        const data = await this.loadRemoteAsset(remoteUrl, decrypt);
                        if (data) {
                            this.levelMap.set(levelName, data);
                            break;
                        }
                    }
                    finish();
                } catch (e) {
                    console.error("load local " + levelName + " error", e);
                    resolve(false);
                }
            };

            const loadOne = (name: string, asset: any): void => {
                try {
                    let decrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const text = EncryptXOR.getInstance().decrypt(asset.text);
                        this.levelMap.set(name, JSON.parse(text));
                        decrypted = true;
                    } else {
                        this.levelMap.set(name, asset.json);
                    }
                    asset.decRef();
                    if (isHttp) {
                        loadRemoteLevelData(name, decrypted);
                    } else {
                        finish();
                    }
                } catch (e) {
                    console.error("load local " + name + " error", e);
                    resolve(false);
                }
            };

            ResMgr.getInstance().getBundle(bundleName).then((bundle: cc.AssetManager.Bundle) => {
                pending += 2;
                bundle.loadDir(dir, cc.TextAsset, (err: any, assets: cc.TextAsset[]) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => loadOne(asset.name, asset));
                    }
                });
                bundle.loadDir(dir, cc.JsonAsset, (err: any, assets: cc.JsonAsset[]) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => loadOne(asset.name, asset));
                    }
                });
            });
        });
    }

    public getTimeInfoByLevel(level: number): any {
        return this.find(ConfigDefine.GametimeConfig, (item: any) => item.id === level);
    }

    public getAllLevels(): any[] {
        return Array.from(this.levelMap.values());
    }

    public async loadLevelData(level: string, useRemote?: boolean): Promise<boolean> {
        if (this.levelMap.get(level) != null) {
            return true;
        }
        return new Promise<boolean>((resolve, reject) => {
            if (useRemote) {
                const url = this.lk_oss + this.gameName.split("_")[1] + "/level/" + level + ".json?t=" + Date.now();
                cc.assetManager.loadRemote(url, (err: any, asset: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("json", asset);
                        this.levelMap.set(level, asset.json);
                        resolve(true);
                    }
                });
            } else {
                cc.assetManager.getBundle(InterfaceMgr.bundleName.config).load("game/" + level, (err: any, asset: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.levelMap.set(level, asset.json);
                        console.log("load " + level + " data success");
                        resolve(true);
                    }
                });
            }
        });
    }

    public async loadmacList(): Promise<boolean> {
        const url = this.lk_oss + this.gameName.split("_")[1] + "/systemConfig/maclist.json?t=" + Date.now();
        const asset: any = await new Promise<any>((resolve, reject) => {
            cc.assetManager.loadRemote(url, (err: any, asset: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
        console.log("macList", asset.json);
        this.mackList = asset.json;
        return true;
    }

    public async getMackList(): Promise<any> {
        if (this.mackList) {
            return this.mackList;
        }
        await this.loadmacList();
        return this.mackList;
    }

    public getLevelById(level: number | string): any {
        return this.levelMap.get("level_" + level);
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

    private loadRemoteAsset(url: string, decrypt: boolean): Promise<any> {
        return new Promise<any>((resolve) => {
            cc.assetManager.loadRemote(url, (err: any, asset: any) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    try {
                        let data: any = null;
                        if (decrypt) {
                            data = JSON.parse(EncryptXOR.getInstance().decrypt(asset.text));
                        } else {
                            data = asset.json;
                        }
                        resolve(data);
                    } catch (e) {
                        console.log(e);
                        resolve(null);
                    }
                }
            });
        });
    }
}