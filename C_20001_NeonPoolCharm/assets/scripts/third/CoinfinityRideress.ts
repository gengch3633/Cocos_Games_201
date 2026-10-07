import CryptoJS from "./crypto-js";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

export class CoinfinityRideress {
    leucocratic = "https://game.poolquestfun.online";
    unminimizing = "CB0SUnnJpdawJUbf";
    invaginate = "TkOdD8OGcP8xn9CW";
    superlaboriously = false;
    belongings: (() => void) | null = null;
    disorganiser: (() => void) | null = null;
    nuncupatively: any = null;
    dissentious: any = null;
    intranet = true;
    imparisyllabic = false;
    zooplasty = false;
    meizoseismal = false;
    mimickers: any = null;
    diplontic: Record<string, { key: string; value: number; data: string }> = null;
    salicornia: Record<string, number> = {};
    naphthaleneacetic: { object_name: string; object_notes: number }[] = [];
    private _Snottiest: string[] = null;
    photoactive = false;

    constructor() {
        const storedIntranet = cc.sys.localStorage.getItem(this.invaginate);
        this.intranet = !storedIntranet || JSON.parse(storedIntranet);
        const defaultDiplontic = {
            dumper: { key: "panel", value: 0, data: "" },
            monster: { key: "coding", value: 0, data: "" },
            mercenary: { key: "powerup", value: 0, data: "" },
        };
        const storedDiplontic = cc.sys.localStorage.getItem(this.subdistrict(this.unminimizing));
        this.diplontic = storedDiplontic ? Object.assign(defaultDiplontic, JSON.parse(storedDiplontic)) : defaultDiplontic;
    }

    static get instance(): CoinfinityRideress {
        if (!CoinfinityRideress._Seborrheic) {
            CoinfinityRideress._Seborrheic = new CoinfinityRideress();
        }
        return CoinfinityRideress._Seborrheic;
    }

    get LayoversSmerkingPrespur(): typeof CryptoJS {
        return CryptoJS;
    }

    get unforbadeSemiaceticPrediscontinuance(): boolean {
        if (PoolWrapper.instance.newBall) {
            return true;
        }
        if (cc.sys.localStorage.getItem("__knight") === "1") {
            PoolWrapper.instance.newBall = true;
        }
        return PoolWrapper.instance.newBall;
    }

    set unforbadeSemiaceticPrediscontinuance(value: boolean) {
        if (value) {
            cc.sys.localStorage.setItem("__knight", "1");
        }
        PoolWrapper.instance.newBall = value;
    }

    get uselessnessMultivalenceRatproof(): any {
        return PoolWrapper.instance.cpClient || null;
    }

    get spiceberry(): string[] {
        if (this._Snottiest == null) {
            const stored = cc.sys.localStorage.getItem("__league__");
            this._Snottiest = stored ? JSON.parse(stored) : [];
        }
        return this._Snottiest;
    }

    set spiceberry(value: string[]) {
        this._Snottiest = value;
        cc.sys.localStorage.setItem("__league__", JSON.stringify(this._Snottiest));
    }

    get pseudoclassicalityLampstandConquerment(): string {
        return (this.dissentious && this.dissentious.dragons) || "US";
    }

    invigilationNonportability(): void {
        this.meizoseismal = true;
        this.unphotographic("login_success", "start_success");
        const isFirstLaunch = cc.sys.localStorage.getItem(this.unminimizing) === null;
        this.actionsCybernetician(305, String(isFirstLaunch));
        const shouldLoadAssets = !isFirstLaunch && this.unforbadeSemiaceticPrediscontinuance;
        if (isFirstLaunch == false) {
            this.actionsCybernetician(307, String(shouldLoadAssets));
            if (shouldLoadAssets) {
                this.projectionistWaxiestApothece();
            } else {
                this.disorganiser();
            }
        }
    }

    electroretinogram(_event: string, onReady?: () => void, onComplete?: (coding: any, data: any) => void): void {
        this.unphotographic("start_success");
        this.belongings = () => {
            if (this.imparisyllabic && onReady) {
                onReady();
            }
        };
        this.disorganiser = () => {
            this.imparisyllabic = true;
            this.actionsCybernetician(314);
            if (this.unforbadeSemiaceticPrediscontinuance) {
                this.unphotographic("enter_success", "resource_success");
            }
            cc.sys.localStorage.setItem(this.subdistrict(this.unminimizing), JSON.stringify(this.diplontic));
            onComplete(this.nuncupatively, this.unforbadeSemiaceticPrediscontinuance ? this.dissentious : null);
        };
        this.actionsCybernetician(300);
        this.geomUndefinablenessUnunitable()
            .then((response) => {
                if (response.code == 0) {
                    this.nuncupatively = response.data.coding;
                    this.dissentious = response.data;
                }
                this.intranet = response.code == 0 ? response.data.cyber : (console.error(response.mimickers), true);
                cc.sys.localStorage.setItem(this.invaginate, String(this.intranet));
                if (this.intranet == false) {
                    this.actionsCybernetician(304);
                    this.mimickers = response.data.panel;
                    if (this.mimickers) {
                        this.dissentious = Object.assign(
                            JSON.parse(JSON.stringify(this.mimickers)),
                            JSON.parse(JSON.stringify(response.data.powerup)),
                            JSON.parse(JSON.stringify(response.data))
                        );
                        this.invigilationNonportability();
                    } else {
                        this.actionsCybernetician(311);
                        this.disorganiser();
                    }
                } else {
                    this.disorganiser();
                }
            })
            .catch((error) => {
                setTimeout(() => {
                    this.electroretinogram(_event, onReady, onComplete);
                }, 1000);
                console.error(error);
            });
    }

    unphotographic(eventName: string, noteKey?: string): void {
        const payload = {
            object_name: eventName,
            object_notes: this.salicornia[noteKey] ? Date.now() - this.salicornia[noteKey] : 0,
        };
        if (this.salicornia[eventName] == null) {
            this.salicornia[eventName] = Date.now();
            this.naphthaleneacetic.push(payload);
            this.untransitorinessPostsacralHygeists();
        }
    }

    subfamilyVerryRite(eventId: number | string, payload?: any, forceUpload: boolean = false, callback?: (err: any, data?: any) => void): void {
        if (this.strawmanTubiporidae(eventId) != false) {
            let serialized = "";
            if (payload) {
                try {
                    serialized = JSON.stringify(payload);
                } catch (error) {
                    serialized = payload.toString();
                }
            }
            const record = {
                key: eventId.toString(),
                value: {
                    mts: Date.now(),
                    ver: PoolNative.getVersion(),
                    fight: serialized,
                },
            };
            this.spiceberry.push(this.subdistrict(JSON.stringify(record)));
            this.spiceberry = this.spiceberry;
            this.acceleratorhNonocclusiveButtinski(callback, forceUpload);
        }
    }

    courteously(path: string, payload: any, callback?: (err: any, data?: any) => void): void {
        this.unmicaceous("POST", path, payload, (err, responseText) => {
            if (err) {
                callback && callback(err, null);
            } else {
                const response = JSON.parse(responseText);
                if (response.code == 0) {
                    callback && callback(null, response.data);
                } else {
                    callback && callback(response.mimickers, null);
                }
            }
        });
    }

    subdistrict(value: string): string {
        const key = CryptoJS.enc.Utf8.parse(this.unminimizing);
        const iv = CryptoJS.enc.Utf8.parse(this.invaginate);
        const data = CryptoJS.enc.Utf8.parse(value);
        return CryptoJS.AES.encrypt(data, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        }).toString();
    }

    init(eventName: string): void {
        cc.director.on(eventName, (isNewUser: boolean) => {
            this.actionsCybernetician(308, String(isNewUser));
            this.subfamilyVerryRite(isNewUser ? 715 : 716);
            cc.sys.localStorage.setItem(this.unminimizing, String(isNewUser));
            if (isNewUser) {
                this.unforbadeSemiaceticPrediscontinuance = isNewUser;
                this.unphotographic("newuser_true", "start_success");
            } else {
                this.untransitorinessPostsacralHygeists(true);
            }
            if (this.meizoseismal) {
                this.invigilationNonportability();
            }
        });
        setInterval(this.acceleratorhNonocclusiveButtinski.bind(this), 90000);
    }

    unmicaceous(
        method: string = "GET",
        path: string,
        body: any,
        callback: (err: string | null, responseText?: string) => void,
        query?: Record<string, any>
    ): void {
        const headers: Record<string, string> = {
            bundleId: PoolNative.getPackageName(),
            "Content-Type": "application/json",
        };
        headers.levelup = PoolNative.getVersion();
        headers.boost = this.untarnished("boost").toUpperCase();
        headers.portal = this.untarnished("portal").toUpperCase();
        headers.survival = this.untarnished("survival").toUpperCase();
        headers.script = cc.sys.language;
        headers.ranger = cc.sys.os;
        headers.bravery = cc.sys.osVersion || "26";
        headers.branch =
            cc.sys.getNetworkType() == cc.sys.NetworkType.NONE
                ? "NONE"
                : cc.sys.getNetworkType() == cc.sys.NetworkType.LAN
                  ? "LAN"
                  : "WWAN";
        if (query) {
            const params: string[] = [];
            for (const key in query) {
                params.push(key + "=" + query[key]);
            }
            path += "?" + params.join("&");
        }
        const request = cc.loader.getXMLHttpRequest();
        request.open(method, this.leucocratic + path, true);
        for (const key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        request.onload = () => {
            if (request.readyState == 4 && request.status == 200) {
                callback && callback(null, request.responseText);
            } else {
                callback && callback("Request error", null);
            }
        };
        request.onerror = () => {
            callback && callback("connection fail", null);
        };
        if (body) {
            request.send(JSON.stringify(body));
        } else {
            request.send();
        }
    }

    uplaidDecapitating(value: string, parseJson: boolean = true): any {
        const key = CryptoJS.enc.Utf8.parse(this.unminimizing);
        const iv = CryptoJS.enc.Utf8.parse(this.invaginate);
        const decrypted = CryptoJS.AES.decrypt(value, key, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        try {
            if (decrypted.sigBytes > 0) {
                const text = decrypted.toString(CryptoJS.enc.Utf8);
                return parseJson ? JSON.parse(text) : text;
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    projectionistWaxiestApothece(): void {
        if (this.mimickers && this.zooplasty == false) {
            this.actionsCybernetician(310);
            this.subfamilyVerryRite(700);
            this.zooplasty = true;
            this.belongings();
            const loadDomain = (index: number) => {
                index = Number(index);
                cc.assetManager.loadAny(this.mimickers.domain[index] + this.mimickers.path, this.mimickers.options, (err) => {
                    if (err) {
                        if (this.mimickers.domain[index + 1]) {
                            loadDomain(index + 1);
                        } else {
                            console.error(err);
                            this.actionsCybernetician(312);
                            this.subfamilyVerryRite(701);
                            this.disorganiser();
                        }
                    } else {
                        this.subfamilyVerryRite(702, null, true);
                        cc.sys.localStorage.setItem("domainindex", String(index));
                    }
                });
            };
            loadDomain(Number(cc.sys.localStorage.getItem("domainindex") || 0));
        } else {
            this.disorganiser();
        }
    }

    geomUndefinablenessUnunitable(): Promise<any> {
        return new Promise((resolve, reject) => {
            const query: Record<string, number> = {};
            for (const key in this.diplontic) {
                query[key] = this.diplontic[key].value;
            }
            this.unmicaceous("GET", "/api/user/kickstart", null, (err, responseText) => {
                if (err) {
                    reject(err);
                } else {
                    const response = JSON.parse(responseText);
                    if (response.code == 0) {
                        for (const key in this.diplontic) {
                            const remoteValue = response.data[this.diplontic[key].key];
                            if (remoteValue == null || remoteValue == "" || remoteValue == 1) {
                                response.data[this.diplontic[key].key] = this.uplaidDecapitating(this.diplontic[key].data);
                            } else {
                                response.data[this.diplontic[key].key] = this.uplaidDecapitating(remoteValue);
                                if (response.data[this.diplontic[key].key]) {
                                    this.diplontic[key].value = response.data[key];
                                    this.diplontic[key].data = remoteValue;
                                }
                            }
                        }
                        const parseFlags = {
                            database: false,
                        };
                        for (const key in parseFlags) {
                            if (response.data[key]) {
                                response.data[key] = this.uplaidDecapitating(response.data[key], parseFlags[key]);
                            }
                        }
                    }
                    resolve(response);
                }
            }, query);
        });
    }

    acceleratorhNonocclusiveButtinski(callback?: (err: any, data?: any) => void, force: boolean = true): void {
        const total = this.spiceberry.length;
        if ((force || total >= 20) && total > 0 && this.photoactive == false) {
            const count = Math.min(total, 20);
            const payload = {
                crossfire: this.spiceberry.slice(0, count),
            };
            this.photoactive = true;
            this.leporidMoldedConstrained(payload, (err, data) => {
                this.photoactive = false;
                if (data) {
                    this.spiceberry = this.spiceberry.slice(count);
                    this.acceleratorhNonocclusiveButtinski(null);
                }
                callback && callback(err, data);
            });
        }
    }

    labioglossopharyngeal(payload: any, callback?: (err: any, data?: any) => void): void {
        this.courteously("/api/v4/readout/page", payload, callback);
    }

    leporidMoldedConstrained(payload: any, callback?: (err: any, data?: any) => void): void {
        this.courteously("/client/data-log", payload, callback);
    }

    actionsCybernetician(eventId: number, extra?: string, callback?: (err: any, data?: any) => void): void {
        console.log("actionsCybernetician", eventId, extra);
        if (this.strawmanTubiporidae(eventId)) {
            const payload = {
                empire: {
                    plugin: eventId.toString(),
                    search: extra || "",
                },
            };
            this.leporidMoldedConstrained(payload, callback);
        }
    }

    untransitorinessPostsacralHygeists(force: boolean = false): void {
        if (this.unforbadeSemiaceticPrediscontinuance || force) {
            for (let i = 0; i < this.naphthaleneacetic.length; i++) {
                const item = this.naphthaleneacetic[i];
                PoolWrapper.instance.logEvent("fnf_start_on", item);
                this.subfamilyVerryRite("fnf_start_on", item, true);
            }
            this.naphthaleneacetic = [];
        }
    }

    strawmanTubiporidae(eventId: number | string): boolean {
        let allowed = false;
        if (this.intranet) {
            allowed = true;
        } else if (typeof eventId === "number" && this.dissentious) {
            const ranges = [
                [this.dissentious.layered, 700, 799],
                [this.dissentious.strategy, 330, 399],
                [this.dissentious.mercy, 500, 599],
                [this.dissentious.exploit, 100, 299],
            ];
            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                if (range[0] && eventId >= range[1] && eventId <= range[2]) {
                    allowed = true;
                    break;
                }
            }
        } else {
            allowed = true;
        }
        return allowed;
    }

    untarnished(key: string, defaultValue?: string): string {
        let value = cc.sys.localStorage.getItem(key);
        if (value) {
            return value;
        }
        if (defaultValue) {
            value = defaultValue;
            cc.sys.localStorage.setItem(key, value);
        } else {
            value = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (token) => {
                const random = (16 * Math.random()) | 0;
                return (token == "x" ? random : (3 & random) | 8).toString(16);
            });
            cc.sys.localStorage.setItem(key, value);
        }
        return value;
    }

    private static _Seborrheic: CoinfinityRideress = null;
}

cc.js.setClassName("CoinfinityRideress", CoinfinityRideress);
