import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

declare function require(name: string): any;

const CryptoJS = require("crypto-js");

export class CoinfinityRideress {
    leucocratic = "https://game.poolquestfun.online";
    unminimizing = "CB0SUnnJpdawJUbf";
    invaginate = "TkOdD8OGcP8xn9CW";
    superlaboriously = false;
    belongings = null;
    disorganiser = null;
    nuncupatively = null;
    dissentious = null;
    intranet: any = true;
    imparisyllabic = false;
    zooplasty: any = false;
    meizoseismal = false;
    mimickers = null;
    diplontic = null;
    salicornia = {};
    naphthaleneacetic = [];
    _Snottiest = null;
    photoactive: any = false;

    static _Seborrheic = null;

    constructor() {
        this.intranet = cc.sys.localStorage.getItem(this.invaginate);
        this.intranet = !this.intranet || JSON.parse(this.intranet);
        const template = {
            dumper: {
                key: "panel",
                value: 0,
                data: ""
            },
            monster: {
                key: "coding",
                value: 0,
                data: ""
            },
            mercenary: {
                key: "powerup",
                value: 0,
                data: ""
            }
        };
        this.diplontic = cc.sys.localStorage.getItem(this.subdistrict(this.unminimizing));
        this.diplontic = this.diplontic ? Object.assign(template, JSON.parse(this.diplontic)) : template;
    }

    static get instance() {
        return CoinfinityRideress._Seborrheic || (CoinfinityRideress._Seborrheic = new CoinfinityRideress());
    }

    get LayoversSmerkingPrespur() {
        return CryptoJS;
    }

    get unforbadeSemiaceticPrediscontinuance() {
        if (PoolWrapper.instance.newBall) {
            return true;
        }
        if ("1" === cc.sys.localStorage.getItem("__knight")) {
            PoolWrapper.instance.newBall = true;
        }
        return PoolWrapper.instance.newBall;
    }

    set unforbadeSemiaceticPrediscontinuance(value) {
        if (value) {
            cc.sys.localStorage.setItem("__knight", "1");
        }
        PoolWrapper.instance.newBall = value;
    }

    get uselessnessMultivalenceRatproof() {
        return PoolWrapper.instance.cpClient || null;
    }

    get spiceberry() {
        if (null == this._Snottiest) {
            this._Snottiest = cc.sys.localStorage.getItem("__league__");
            this._Snottiest = this._Snottiest ? JSON.parse(this._Snottiest) : [];
        }
        return this._Snottiest;
    }

    set spiceberry(value) {
        this._Snottiest = value;
        cc.sys.localStorage.setItem("__league__", JSON.stringify(this._Snottiest));
    }

    get pseudoclassicalityLampstandConquerment() {
        return this.dissentious && this.dissentious.dragons || "US";
    }

    invigilationNonportability() {
        this.meizoseismal = true;
        this.unphotographic("login_success", "start_success");
        const missing: any = null === cc.sys.localStorage.getItem(this.unminimizing);
        this.actionsCybernetician(305, String(missing));
        const ready = !missing && this.unforbadeSemiaceticPrediscontinuance;
        if (0 == missing) {
            this.actionsCybernetician(307, String(ready));
            if (ready) {
                this.projectionistWaxiestApothece();
            } else {
                this.disorganiser();
            }
        }
    }

    electroretinogram(arg, onBelongings, onDone) {
        const self = this;
        this.unphotographic("start_success");
        this.belongings = function () {
            if (self.imparisyllabic && onBelongings) {
                onBelongings();
            }
        };
        this.disorganiser = function () {
            self.imparisyllabic = true;
            self.actionsCybernetician(314);
            if (self.unforbadeSemiaceticPrediscontinuance) {
                self.unphotographic("enter_success", "resource_success");
            }
            cc.sys.localStorage.setItem(self.subdistrict(self.unminimizing), JSON.stringify(self.diplontic));
            onDone(self.nuncupatively, self.unforbadeSemiaceticPrediscontinuance ? self.dissentious : null);
        };
        this.actionsCybernetician(300);
        this.geomUndefinablenessUnunitable().then(function (result: any) {
            if (0 == result.code) {
                self.nuncupatively = result.data.coding;
                self.dissentious = result.data;
            }
            self.intranet = 0 == result.code ? result.data.cyber : (console.error(result.mimickers), true);
            cc.sys.localStorage.setItem(self.invaginate, self.intranet);
            if (0 == self.intranet) {
                self.actionsCybernetician(304);
                self.mimickers = result.data.panel;
                if (self.mimickers) {
                    self.dissentious = Object.assign(JSON.parse(JSON.stringify(self.mimickers)), JSON.parse(JSON.stringify(result.data.powerup)), JSON.parse(JSON.stringify(result.data)));
                    self.invigilationNonportability();
                } else {
                    self.actionsCybernetician(311);
                    self.disorganiser();
                }
            } else {
                self.disorganiser();
            }
        }).catch(function (err) {
            setTimeout(function () {
                self.electroretinogram(arg, onBelongings, onDone);
            }, 1e3);
            console.error(err);
        });
    }

    unphotographic(name, noteKey?) {
        const record = {
            object_name: name,
            object_notes: this.salicornia[noteKey] ? Date.now() - this.salicornia[noteKey] : 0
        };
        if (null == this.salicornia[name]) {
            this.salicornia[name] = Date.now();
            this.naphthaleneacetic.push(record);
            this.untransitorinessPostsacralHygeists();
        }
    }

    subfamilyVerryRite(key, data?, flush?, callback?) {
        if (undefined === flush) {
            flush = false;
        }
        if (this.strawmanTubiporidae(key)) {
            let text = "";
            if (data) {
                try {
                    text = JSON.stringify(data);
                } catch (err) {
                    text = data.toString();
                }
            }
            const record: any = {
                key: key.toString(),
                value: {
                    mts: Date.now(),
                    ver: PoolNative.getVersion()
                }
            };
            record.value.fight = text;
            this.spiceberry.push(this.subdistrict(JSON.stringify(record)));
            this.spiceberry = this.spiceberry;
            this.acceleratorhNonocclusiveButtinski(callback, flush);
        }
    }

    courteously(url, body, callback) {
        this.unmicaceous("POST", url, body, function (err, text) {
            if (err) {
                if (callback) {
                    callback(err, null);
                }
            } else if (0 == (text = JSON.parse(text)).code) {
                if (callback) {
                    callback(null, text.data);
                }
            } else if (callback) {
                callback(text.mimickers, null);
            }
        });
    }

    subdistrict(text) {
        const key = CryptoJS.enc.Utf8.parse(this.unminimizing);
        const iv = CryptoJS.enc.Utf8.parse(this.invaginate);
        const data = CryptoJS.enc.Utf8.parse(text);
        return CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
    }

    init(eventName) {
        const self = this;
        cc.director.on(eventName, function (value) {
            self.actionsCybernetician(308, String(value));
            self.subfamilyVerryRite(value ? 715 : 716);
            cc.sys.localStorage.setItem(self.unminimizing, value);
            if (value) {
                self.unforbadeSemiaceticPrediscontinuance = value;
                self.unphotographic("newuser_true", "start_success");
            } else {
                self.untransitorinessPostsacralHygeists(true);
            }
            if (self.meizoseismal) {
                self.invigilationNonportability();
            }
        });
        setInterval(this.acceleratorhNonocclusiveButtinski.bind(this), 9e4);
    }

    unmicaceous(method, url, body, callback, query?) {
        if (undefined === method) {
            method = "GET";
        }
        const headers: any = {
            bundleId: PoolNative.getPackageName(),
            "Content-Type": "application/json"
        };
        headers.levelup = PoolNative.getVersion();
        headers.boost = this.untarnished("boost").toUpperCase();
        headers.portal = this.untarnished("portal").toUpperCase();
        headers.survival = this.untarnished("survival").toUpperCase();
        headers.script = cc.sys.language;
        headers.ranger = cc.sys.os;
        headers.bravery = cc.sys.osVersion || "26";
        headers.branch = cc.sys.getNetworkType() == cc.sys.NetworkType.NONE ? "NONE" : cc.sys.getNetworkType() == cc.sys.NetworkType.LAN ? "LAN" : "WWAN";
        if (query) {
            const parts = [];
            for (const key in query) {
                parts.push(key + "=" + query[key]);
            }
            url += "?" + parts.join("&");
        }
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.open(method, this.leucocratic + url, true);
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
        xhr.onload = function () {
            if (4 == xhr.readyState && 200 == xhr.status) {
                if (callback) {
                    callback(null, xhr.responseText);
                }
            } else if (callback) {
                callback("Request error", null);
            }
        };
        xhr.onerror = function () {
            if (callback) {
                callback("connection fail", null);
            }
        };
        if (body) {
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    }

    uplaidDecapitating(cipher, asJson?) {
        if (undefined === asJson) {
            asJson = true;
        }
        const key = CryptoJS.enc.Utf8.parse(this.unminimizing);
        const iv = CryptoJS.enc.Utf8.parse(this.invaginate);
        const decrypted = CryptoJS.AES.decrypt(cipher, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        try {
            if (decrypted.sigBytes > 0) {
                const text = decrypted.toString(CryptoJS.enc.Utf8);
                return asJson ? JSON.parse(text) : text;
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    projectionistWaxiestApothece() {
        const self = this;
        if (this.mimickers && 0 == this.zooplasty) {
            this.actionsCybernetician(310);
            this.subfamilyVerryRite(700);
            this.zooplasty = true;
            this.belongings();
            const loadDomain = function (index) {
                index = Number(index);
                cc.assetManager.loadAny(self.mimickers.domain[index] + self.mimickers.path, self.mimickers.options, function (err) {
                    if (err) {
                        if (self.mimickers.domain[index + 1]) {
                            loadDomain(index + 1);
                        } else {
                            console.error(err);
                            self.actionsCybernetician(312);
                            self.subfamilyVerryRite(701);
                            self.disorganiser();
                        }
                    } else {
                        self.subfamilyVerryRite(702, null, true);
                        cc.sys.localStorage.setItem("domainindex", index);
                    }
                });
            };
            loadDomain(cc.sys.localStorage.getItem("domainindex") || 0);
        } else {
            this.disorganiser();
        }
    }

    geomUndefinablenessUnunitable() {
        const self = this;
        return new Promise<any>(function (resolve, reject) {
            const query = {};
            for (const key in self.diplontic) {
                query[key] = self.diplontic[key].value;
            }
            self.unmicaceous("GET", "/api/user/kickstart", null, function (err, text) {
                if (err) {
                    reject(err);
                } else {
                    const result = JSON.parse(text);
                    if (0 == result.code) {
                        for (const key in self.diplontic) {
                            const remote = result.data[self.diplontic[key].key];
                            if (null == remote || "" == remote || 1 == remote) {
                                result.data[self.diplontic[key].key] = self.uplaidDecapitating(self.diplontic[key].data);
                            } else {
                                result.data[self.diplontic[key].key] = self.uplaidDecapitating(remote);
                                if (result.data[self.diplontic[key].key]) {
                                    self.diplontic[key].value = result.data[key];
                                    self.diplontic[key].data = remote;
                                }
                            }
                        }
                        const flags = {
                            database: false
                        };
                        for (const key in flags) {
                            if (result.data[key]) {
                                result.data[key] = self.uplaidDecapitating(result.data[key], flags[key]);
                            }
                        }
                    }
                    resolve(result);
                }
            }, query);
        });
    }

    acceleratorhNonocclusiveButtinski(callback?, flush?) {
        const self = this;
        if (undefined === flush) {
            flush = true;
        }
        const count = this.spiceberry.length;
        if ((flush || count >= 20) && count > 0 && 0 == this.photoactive) {
            const size = Math.min(count, 20);
            const body: any = {};
            body.crossfire = this.spiceberry.slice(0, size);
            this.photoactive = true;
            this.leporidMoldedConstrained(body, function (err, data) {
                self.photoactive = false;
                if (data) {
                    self.spiceberry = self.spiceberry.slice(size);
                    self.acceleratorhNonocclusiveButtinski(null);
                }
                if (callback) {
                    callback(err, data);
                }
            });
        }
    }

    labioglossopharyngeal(body, callback) {
        this.courteously("/api/v4/readout/page", body, callback);
    }

    leporidMoldedConstrained(body, callback) {
        this.courteously("/client/data-log", body, callback);
    }

    actionsCybernetician(code, search?, callback?) {
        console.log("actionsCybernetician", code, search);
        if (this.strawmanTubiporidae(code)) {
            const body: any = {
                empire: {}
            };
            body.empire.plugin = code.toString();
            body.empire.search = search || "";
            this.leporidMoldedConstrained(body, callback);
        }
    }

    untransitorinessPostsacralHygeists(force?) {
        if (undefined === force) {
            force = false;
        }
        if (this.unforbadeSemiaceticPrediscontinuance || force) {
            for (let i = 0, list = this.naphthaleneacetic; i < list.length; i++) {
                const record = list[i];
                PoolWrapper.instance.logEvent("fnf_start_on", record);
                this.subfamilyVerryRite("fnf_start_on", record, true);
            }
            this.naphthaleneacetic = [];
        }
    }

    strawmanTubiporidae(code) {
        let allowed = false;
        if (this.intranet) {
            allowed = true;
        } else if ("number" == typeof code && this.dissentious) {
            const ranges = [[this.dissentious.layered, 700, 799], [this.dissentious.strategy, 330, 399], [this.dissentious.mercy, 500, 599], [this.dissentious.exploit, 100, 299]];
            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                if (range[0] && code >= range[1] && code <= range[2]) {
                    allowed = true;
                    break;
                }
            }
        } else {
            allowed = true;
        }
        return allowed;
    }

    untarnished(key, preset?) {
        let value = cc.sys.localStorage.getItem(key);
        if (value) {
            return value;
        }
        if (preset) {
            value = preset;
            cc.sys.localStorage.setItem(key, value);
        } else {
            value = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (token) {
                const rand = 16 * Math.random() | 0;
                return ("x" == token ? rand : 3 & rand | 8).toString(16);
            });
            cc.sys.localStorage.setItem(key, value);
        }
        return value;
    }
}

cc.js.setClassName("CoinfinityRideress", CoinfinityRideress);
