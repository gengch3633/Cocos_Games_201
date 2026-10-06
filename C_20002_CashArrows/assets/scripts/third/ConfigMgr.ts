import { bundleName } from "./InterfaceMgr";
import { GametimeConfig } from "./ConfigDefine";
import UserData from "./UserData";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import EncryptXOR from "./EncryptXOR";
import URL from "./URL";

const LoadState: any = {};
LoadState[LoadState.None = 0] = " None ";
LoadState[LoadState.Done = 1] = " Done ";

export default class ConfigMgr extends Singleton {
    game_knzmx: any = " tt_knzmx ";
    game_hystz: any = " tt_hystz ";
    game_wnzzl: any = " wx_wnzzl ";
    game_kyzmw: any = " wx_kyzmw ";
    gameName: any = " wx_wnzzl ";
    lk_oss: any = " https:// lkgame.mrkzx.cn/ ";
    dataMap: Map<any, any> = new Map();
    levelMap: Map<any, any> = new Map();
    mackList: any = null;
    loadState: any = LoadState.None;

    loadAll(e: any, t: any = " config ", i: any = "/ json ") {
        var a = this;
        return new Promise(function(s) {
            if (a.loadState != LoadState.Done) {
                var l = 0, c = URL.isHttpUrl(e), d = async function(t: any, i: any) {
                    var o = a;
                    try {
                        var n = 0;
                        while (n < 3) {
                            await cc.assetManager.loadRemote(URL.parse(e, t + (i ? ".txt " : ".json? t = " + Date.now())), function(e: any, n: any) {
                                if (i) {
                                    var a = EncryptXOR.getInstance().decrypt(n.msg);
                                    n = JSON.parse(a);
                                } else n = n.json;
                                o.dataMap.set(t, n);
                            });
                            n++;
                        }
                        f();
                    } catch (a) {
                        console.error(" load local " + t + " error ", a);
                        s(false);
                    }
                }, _ = function(e: any, t: any) {
                    try {
                        var i = false;
                        if (t instanceof cc.TextAsset) {
                            var n = EncryptXOR.getInstance().decrypt(t.text);
                            a.dataMap.set(e, JSON.parse(n));
                            i = true;
                        } else a.dataMap.set(e, t.json);
                        t.decRef();
                        var o = 0 === String(e || " ").indexOf(" i18n_ ");
                        c && !o ? d(e, i) : f();
                    } catch (t) {
                        console.error(" load local " + e + " error ", t);
                        s(false);
                    }
                }, f = function() {
                    if (--l <= 0) {
                        a.loadState = LoadState.Done;
                        s(true);
                    }
                };
                ResMgr.getInstance().getBundle(t).then(function(e: any) {
                    l += 2;
                    e.loadDir(i, cc.TextAsset, function(e: any, t: any) {
                        l--;
                        if (e) console.error(e); else {
                            l += t.length;
                            t.forEach(function(e: any) {
                                return _(e.name, e);
                            });
                        }
                    });
                    e.loadDir(i, cc.JsonAsset, function(e: any, t: any) {
                        l--;
                        if (e) console.error(e); else {
                            l += t.length;
                            t.forEach(function(e: any) {
                                return _(e.name, e);
                            });
                        }
                    });
                });
            } else s(true);
        });
    }

    getOne(e: any) {
        var t = e.TabName;
        return this.dataMap.get(t);
    }

    getById(e: any, t: any, i: any = " id ") {
        var n = this.find(e, function(e: any) {
            return e[i] == t;
        });
        n || console.error(" 配置表 " + e.TabName + " 中没有找到 " + String(i) + " = " + t + " 的数据 ");
        return n;
    }

    getAll(e: any) {
        var t = e.TabName;
        return this.dataMap.get(t);
    }

    find(e: any, t: any) {
        var i: any;
        return null === (i = this.getAll(e)) || void 0 === i ? void 0 : i.find(t);
    }

    filter(e: any, t: any) {
        var i: any;
        return null === (i = this.getAll(e)) || void 0 === i ? void 0 : i.filter(t);
    }

    forEach(e: any, t: any) {
        var i: any;
        null === (i = this.getAll(e)) || void 0 === i || i.forEach(t);
    }

    loadLevel(e: any, t: any = " config ", i: any = "/ game ") {
        var n = this;
        return new Promise(function(a) {
            var s = 0, l = URL.isHttpUrl(e), c = async function(t: any, s: any) {
                var f = n;
                try {
                    var loadRemoteJson = function(e: any, t: any) {
                        return new Promise(function(i) {
                            cc.assetManager.loadRemote(e, function(e: any, n: any) {
                                if (e) {
                                    console.log(e);
                                    i(null);
                                } else {
                                    var a = null;
                                    if (t) {
                                        var o = n;
                                        a = JSON.parse(EncryptXOR.getInstance().decrypt(o.text));
                                    } else a = (o = n).json;
                                    i(a);
                                }
                            });
                        });
                    };
                    var attempt = 0;
                    while (attempt < 3) {
                        var remoteUrl = URL.parse(e, i, t + (s ? ".txt " : ".json ")) + "? v = " + Date.now();
                        var loaded = await loadRemoteJson(remoteUrl, s);
                        if (loaded) {
                            f.levelMap.set(t, loaded);
                            break;
                        }
                        attempt++;
                    }
                    finish();
                } catch (d) {
                    console.error(" load local " + t + " error ", d);
                    a(false);
                }
            }, d = function(e: any, t: any) {
                try {
                    var encrypted = false;
                    if (t instanceof cc.TextAsset) {
                        var o = EncryptXOR.getInstance().decrypt(t.text);
                        n.levelMap.set(e, JSON.parse(o));
                        encrypted = true;
                    } else n.levelMap.set(e, t.json);
                    t.decRef();
                    l ? c(e, encrypted) : finish();
                } catch (t) {
                    console.error(" load local " + e + " error ", t);
                    a(false);
                }
            }, finish = function() {
                --s <= 0 && a(true);
            };
            ResMgr.getInstance().getBundle(t).then(function(bundle: any) {
                s += 2;
                bundle.loadDir(i, cc.TextAsset, function(err: any, assets: any) {
                    s--;
                    if (err) console.error(err); else {
                        s += assets.length;
                        assets.forEach(function(asset: any) {
                            return d(asset.name, asset);
                        });
                    }
                });
                bundle.loadDir(i, cc.JsonAsset, function(err: any, assets: any) {
                    s--;
                    if (err) console.error(err); else {
                        s += assets.length;
                        assets.forEach(function(asset: any) {
                            return d(asset.name, asset);
                        });
                    }
                });
            });
        });
    }

    getTimeInfoByLevel(e: any) {
        return this.find(GametimeConfig, function(t: any) {
            return t.id === e;
        });
    }

    getAllLevels() {
        return Array.from(this.levelMap.values());
    }

    async loadLevelData(e: any, t: any) {
        var i = this;
        if (null != this.levelMap.get(e)) return true;
        return new Promise(function(n, a) {
            if (t) {
                var o = i.lk_oss + i.gameName.split(" _ ")[1] + "/ level/ " + e + ".json? t = " + Date.now();
                cc.assetManager.loadRemote(o, function(t: any, o: any) {
                    if (t) a(t); else {
                        console.log(" json ", o);
                        i.levelMap.set(e, o.json);
                        n(true);
                    }
                });
            } else cc.assetManager.getBundle(bundleName.config).load(" game/ " + e, function(t: any, o: any) {
                if (t) a(t); else {
                    i.levelMap.set(e, o.json);
                    console.log(" load " + e + " data success ");
                    n(true);
                }
            });
        });
    }

    async loadmacList() {
        var e = this;
        return new Promise(function(t, i) {
            var n = e.lk_oss + e.gameName.split(" _ ")[1] + "/ systemConfig/ maclist.json? t = " + Date.now();
            cc.assetManager.loadRemote(n, function(n: any, a: any) {
                if (n) i(n); else {
                    console.log(" macList ", a.json);
                    e.mackList = a.json;
                    t(true);
                }
            });
        });
    }

    async getMackList() {
        var e = this;
        return new Promise(function(t, i) {
            e.mackList ? t(e.mackList) : e.loadmacList().then(function() {
                t(e.mackList);
            }).catch(function(e) {
                i(e);
            });
        });
    }

    async checkMac() {
        var e: any, t: number;
        e = await this.getMackList();
        for (t = 0; t < e.length; t++) if (UserData.getInstance().userID == e[t].macId) return true;
        return false;
    }

    getLevelById(e: any) {
        return this.levelMap.get(" level_ " + e);
    }
}
