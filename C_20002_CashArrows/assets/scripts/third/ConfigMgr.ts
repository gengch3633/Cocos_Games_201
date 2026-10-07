import { GametimeConfig } from "./ConfigDefine";
import EncryptXOR from "./EncryptXOR";
import { bundleName } from "./InterfaceMgr";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import URL from "./URL";
import UserData from "./UserData";

enum LoadState {
    None = 0,
    Done = 1,
}

interface TabConfig {
    TabName: string;
}

export default class ConfigMgr extends Singleton {
    game_knzmx = "tt_knzmx";
    game_hystz = "tt_hystz";
    game_wnzzl = "wx_wnzzl";
    game_kyzmw = "wx_kyzmw";
    gameName = "wx_wnzzl";
    lk_oss = "https://lkgame.mrkzx.cn/";
    dataMap = new Map<string, any>();
    levelMap = new Map<string, any>();
    mackList: any = null;
    loadState = LoadState.None;

    loadAll(url: string, bundle = "config", dir = "/json"): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.loadState === LoadState.Done) {
                resolve(true);
                return;
            }

            let pending = 0;
            const isHttpUrl = URL.isHttpUrl(url);

            const tryLoadRemote = async (name: string, encrypted: boolean): Promise<void> => {
                try {
                    for (let retry = 0; retry < 3; retry++) {
                        const remoteUrl = URL.parse(
                            url,
                            name + (encrypted ? ".txt" : ".json?t=" + Date.now())
                        );
                        await new Promise<void>((res, rej) => {
                            cc.assetManager.loadRemote(remoteUrl, (err, asset: any) => {
                                if (err) {
                                    rej(err);
                                    return;
                                }
                                let data: any;
                                if (encrypted) {
                                    const decrypted = EncryptXOR.getInstance().decrypt(asset.msg);
                                    data = JSON.parse(decrypted);
                                } else {
                                    data = asset.json;
                                }
                                this.dataMap.set(name, data);
                                res();
                            });
                        });
                    }
                    onComplete();
                } catch (err) {
                    console.error("load local " + name + " error", err);
                    resolve(false);
                }
            };

            const onAssetLoaded = (name: string, asset: cc.TextAsset | cc.JsonAsset): void => {
                try {
                    let encrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        this.dataMap.set(name, JSON.parse(decrypted));
                        encrypted = true;
                    } else {
                        this.dataMap.set(name, (asset as cc.JsonAsset).json);
                    }
                    asset.decRef();
                    const isI18n = String(name || "").indexOf("i18n_") === 0;
                    if (isHttpUrl && !isI18n) {
                        tryLoadRemote(name, encrypted);
                    } else {
                        onComplete();
                    }
                } catch (err) {
                    console.error("load local " + name + " error", err);
                    resolve(false);
                }
            };

            const onComplete = (): void => {
                if (--pending <= 0) {
                    this.loadState = LoadState.Done;
                    resolve(true);
                }
            };

            ResMgr.getInstance().getBundle(bundle).then((assetBundle) => {
                pending += 2;
                assetBundle.loadDir(dir, cc.TextAsset, (err, assets) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => onAssetLoaded(asset.name, asset));
                    }
                });
                assetBundle.loadDir(dir, cc.JsonAsset, (err, assets) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => onAssetLoaded(asset.name, asset));
                    }
                });
            });
        });
    }

    getOne(tab: TabConfig): any {
        const tabName = tab.TabName;
        return this.dataMap.get(tabName);
    }

    getById(tab: TabConfig, id: any, key = "id"): any {
        const row = this.find(tab, (item) => item[key] == id);
        if (!row) {
            console.error("配置表 " + tab.TabName + " 中没有找到 " + String(key) + "=" + id + " 的数据");
        }
        return row;
    }

    getAll(tab: TabConfig): any {
        const tabName = tab.TabName;
        return this.dataMap.get(tabName);
    }

    find(tab: TabConfig, predicate: (item: any) => boolean): any {
        return this.getAll(tab)?.find(predicate);
    }

    filter(tab: TabConfig, predicate: (item: any) => boolean): any {
        return this.getAll(tab)?.filter(predicate);
    }

    forEach(tab: TabConfig, callback: (item: any) => void): void {
        this.getAll(tab)?.forEach(callback);
    }

    loadLevel(url: string, bundle = "config", dir = "/game"): Promise<boolean> {
        return new Promise((resolve) => {
            let pending = 0;
            const isHttpUrl = URL.isHttpUrl(url);

            const loadRemoteLevel = (remoteUrl: string, encrypted: boolean): Promise<any> => {
                return new Promise((res) => {
                    cc.assetManager.loadRemote(remoteUrl, (err, asset: any) => {
                        if (err) {
                            console.log(err);
                            res(null);
                        } else {
                            let data: any = null;
                            if (encrypted) {
                                data = JSON.parse(EncryptXOR.getInstance().decrypt(asset.text));
                            } else {
                                data = asset.json;
                            }
                            res(data);
                        }
                    });
                });
            };

            const tryLoadRemote = async (name: string, encrypted: boolean): Promise<void> => {
                try {
                    for (let retry = 0; retry < 3; retry++) {
                        const remoteUrl =
                            URL.parse(url, dir, name + (encrypted ? ".txt" : ".json")) +
                            "?v=" +
                            Date.now();
                        const data = await loadRemoteLevel(remoteUrl, encrypted);
                        if (data) {
                            this.levelMap.set(name, data);
                            break;
                        }
                    }
                    onComplete();
                } catch (err) {
                    console.error("load local " + name + " error", err);
                    resolve(false);
                }
            };

            const onAssetLoaded = (name: string, asset: cc.TextAsset | cc.JsonAsset): void => {
                try {
                    let encrypted = false;
                    if (asset instanceof cc.TextAsset) {
                        const decrypted = EncryptXOR.getInstance().decrypt(asset.text);
                        this.levelMap.set(name, JSON.parse(decrypted));
                        encrypted = true;
                    } else {
                        this.levelMap.set(name, (asset as cc.JsonAsset).json);
                    }
                    asset.decRef();
                    if (isHttpUrl) {
                        tryLoadRemote(name, encrypted);
                    } else {
                        onComplete();
                    }
                } catch (err) {
                    console.error("load local " + name + " error", err);
                    resolve(false);
                }
            };

            const onComplete = (): void => {
                if (--pending <= 0) {
                    resolve(true);
                }
            };

            ResMgr.getInstance().getBundle(bundle).then((assetBundle) => {
                pending += 2;
                assetBundle.loadDir(dir, cc.TextAsset, (err, assets) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => onAssetLoaded(asset.name, asset));
                    }
                });
                assetBundle.loadDir(dir, cc.JsonAsset, (err, assets) => {
                    pending--;
                    if (err) {
                        console.error(err);
                    } else {
                        pending += assets.length;
                        assets.forEach((asset) => onAssetLoaded(asset.name, asset));
                    }
                });
            });
        });
    }

    getTimeInfoByLevel(levelId: number): any {
        return this.find(GametimeConfig, (item) => item.id === levelId);
    }

    getAllLevels(): any[] {
        return Array.from(this.levelMap.values());
    }

    async loadLevelData(levelId: string, remote?: boolean): Promise<boolean> {
        if (this.levelMap.get(levelId) != null) {
            return true;
        }
        return new Promise((resolve, reject) => {
            if (remote) {
                const remoteUrl =
                    this.lk_oss +
                    this.gameName.split("_")[1] +
                    "/level/" +
                    levelId +
                    ".json?t=" +
                    Date.now();
                cc.assetManager.loadRemote(remoteUrl, (err, asset: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("json", asset);
                        this.levelMap.set(levelId, asset.json);
                        resolve(true);
                    }
                });
            } else {
                cc.assetManager.getBundle(bundleName.config).load("game/" + levelId, (err, asset: cc.JsonAsset) => {
                    if (err) {
                        reject(err);
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
            const remoteUrl =
                this.lk_oss +
                this.gameName.split("_")[1] +
                "/systemConfig/maclist.json?t=" +
                Date.now();
            cc.assetManager.loadRemote(remoteUrl, (err, asset: any) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("macList", asset.json);
                    this.mackList = asset.json;
                    resolve(true);
                }
            });
        });
    }

    async getMackList(): Promise<any> {
        if (this.mackList) {
            return this.mackList;
        }
        await this.loadmacList();
        return this.mackList;
    }

    getLevelById(levelId: number): any {
        return this.levelMap.get("level_" + levelId);
    }

    async checkMac(): Promise<boolean> {
        const list = await this.getMackList();
        for (let i = 0; i < list.length; i++) {
            if (UserData.getInstance().userID == list[i].macId) {
                return true;
            }
        }
        return false;
    }
}
