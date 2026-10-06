import { getCryptoJS } from "./cryptoUtil";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

interface DiplonticEntry {
    key: string;
    value: number;
    data: string;
}

interface DiplonticData {
    dumper: DiplonticEntry;
    monster: DiplonticEntry;
    mercenary: DiplonticEntry;
}

export class CoinfinityRideress {
    private static _Seborrheic: CoinfinityRideress = null;

    leucocratic = "https://game.poolquestfun.online";
    unminimizing = "CB0SUnnJpdawJUbf";
    invaginate = "TkOdD8OGcP8xn9CW";
    superlaboriously = false;
    belongings: (() => void) = null;
    disorganiser: (() => void) = null;
    nuncupatively: any = null;
    dissentious: any = null;
    intranet = true;
    imparisyllabic = false;
    zooplasty = false;
    meizoseismal = false;
    mimickers: any = null;
    diplontic: DiplonticData = null;
    salicornia: Record<string, number> = {};
    naphthaleneacetic: Array<{ object_name: string; object_notes: number }> = [];
    private _Snottiest: string[] = null;
    photoactive = false;

    constructor() {
        const storedIntranet = cc.sys.localStorage.getItem(this.invaginate);
        this.intranet = !storedIntranet || JSON.parse(storedIntranet);
        const defaultDiplontic: DiplonticData = {
            dumper: { key: "panel", value: 0, data: "" },
            monster: { key: "coding", value: 0, data: "" },
            mercenary: { key: "powerup", value: 0, data: "" },
        };
        const storedDiplontic = cc.sys.localStorage.getItem(this.subdistrict(this.unminimizing));
        this.diplontic = storedDiplontic
            ? Object.assign(defaultDiplontic, JSON.parse(storedDiplontic))
            : defaultDiplontic;
    }

    static get instance(): CoinfinityRideress {
        return CoinfinityRideress._Seborrheic || (CoinfinityRideress._Seborrheic = new CoinfinityRideress());
    }

    get LayoversSmerkingPrespur(): any {
        return getCryptoJS();
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
        const isNewUser = cc.sys.localStorage.getItem(this.unminimizing) === null;
        this.actionsCybernetician(305, String(isNewUser));
        const shouldLoadRemote = !isNewUser && this.unforbadeSemiaceticPrediscontinuance;
        if (isNewUser == false) {
            this.actionsCybernetician(307, String(shouldLoadRemote));
            if (shouldLoadRemote) {
                this.projectionistWaxiestApothece();
            } else {
                this.disorganiser();
            }
        }
    }

    electroretinogram(_unused: unknown[], onReady: (() => void) = null, callback: (webConfig: any, ballConfig: any) => void): void {
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
            callback(
                this.nuncupatively,
                this.unforbadeSemiaceticPrediscontinuance ? this.dissentious : null
            );
        };
        this.actionsCybernetician(300);
        this.geomUndefinablenessUnunitable()
            .then((response: any) => {
                if (response.code == 0) {
                    this.nuncupatively = response.data.coding;
                    this.dissentious = response.data;
                }
                this.intranet =
                    response.code == 0
                        ? response.data.cyber
                        : (console.error(response.mimickers), true);
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
                console.error(error);
                if (cc.sys.isBrowser || this.intranet) {
                    this.disorganiser();
                    return;
                }
                setTimeout(() => {
                    this.electroretinogram(_unused, onReady, callback);
                }, 1000);
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

    subfamilyVerryRite(
        eventId: number | string,
        payload?: unknown,
        force = false,
        callback?: (error: unknown, result: unknown) => void
    ): void {
        if (this.strawmanTubiporidae(eventId) != false) {
            let payloadStr = "";
            if (payload) {
                try {
                    payloadStr = JSON.stringify(payload);
                } catch (_error) {
                    payloadStr = String(payload);
                }
            }
            const record = {
                key: eventId.toString(),
                value: {
                    mts: Date.now(),
                    ver: PoolNative.getVersion(),
                    fight: payloadStr,
                },
            };
            this.spiceberry.push(this.subdistrict(JSON.stringify(record)));
            this.spiceberry = this.spiceberry;
            this.acceleratorhNonocclusiveButtinski(callback, force);
        }
    }

    courteously(path: string, body: unknown, callback: (error: unknown, data: unknown) => void): void {
        this.unmicaceous("POST", path, body, (error, responseText) => {
            if (error) {
                callback && callback(error, null);
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
        const CryptoJS = getCryptoJS();
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
        cc.director.on(eventName, (value: boolean) => {
            this.actionsCybernetician(308, String(value));
            this.subfamilyVerryRite(value ? 715 : 716);
            cc.sys.localStorage.setItem(this.unminimizing, String(value));
            if (value) {
                this.unforbadeSemiaceticPrediscontinuance = value;
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
        method = "GET",
        path: string,
        body: unknown,
        callback: (error: string | null, responseText: string | null) => void,
        query?: Record<string, string>
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
        const xhr = cc.loader.getXMLHttpRequest();
        xhr.open(method, this.leucocratic + path, true);
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback && callback(null, xhr.responseText);
            } else {
                callback && callback("Request error", null);
            }
        };
        xhr.onerror = () => {
            callback && callback("connection fail", null);
        };
        body ? xhr.send(JSON.stringify(body)) : xhr.send();
    }

    uplaidDecapitating(value: string, parseJson = true): any {
        const CryptoJS = getCryptoJS();
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
        } catch (_error) {
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
                cc.assetManager.loadAny(
                    this.mimickers.domain[index] + this.mimickers.path,
                    this.mimickers.options,
                    (error) => {
                        if (error) {
                            if (this.mimickers.domain[index + 1]) {
                                loadDomain(index + 1);
                            } else {
                                console.error(error);
                                this.actionsCybernetician(312);
                                this.subfamilyVerryRite(701);
                                this.disorganiser();
                            }
                        } else {
                            this.subfamilyVerryRite(702, null, true);
                            cc.sys.localStorage.setItem("domainindex", String(index));
                        }
                    }
                );
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
                query[key] = this.diplontic[key as keyof DiplonticData].value;
            }
            this.unmicaceous("GET", "/api/user/kickstart", null, (error, responseText) => {
                if (error) {
                    reject(error);
                } else {
                    const response = JSON.parse(responseText);
                    if (response.code == 0) {
                        for (const key in this.diplontic) {
                            const entry = this.diplontic[key as keyof DiplonticData];
                            const remoteValue = response.data[entry.key];
                            if (remoteValue == null || remoteValue == "" || remoteValue == 1) {
                                response.data[entry.key] = this.uplaidDecapitating(entry.data);
                            } else {
                                response.data[entry.key] = this.uplaidDecapitating(remoteValue);
                                if (response.data[entry.key]) {
                                    entry.value = response.data[key];
                                    entry.data = remoteValue;
                                }
                            }
                        }
                        const parseFlags: Record<string, boolean> = { database: false };
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

    acceleratorhNonocclusiveButtinski(
        callback?: (error: unknown, result: unknown) => void,
        force = true
    ): void {
        const total = this.spiceberry.length;
        if ((force || total >= 20) && total > 0 && this.photoactive == false) {
            const batchSize = Math.min(total, 20);
            const body = {
                crossfire: this.spiceberry.slice(0, batchSize),
            };
            this.photoactive = true;
            this.leporidMoldedConstrained(body, (error, result) => {
                this.photoactive = false;
                if (result) {
                    this.spiceberry = this.spiceberry.slice(batchSize);
                    this.acceleratorhNonocclusiveButtinski(null);
                }
                callback && callback(error, result);
            });
        }
    }

    labioglossopharyngeal(body: unknown, callback: (error: unknown, data: unknown) => void): void {
        this.courteously("/api/v4/readout/page", body, callback);
    }

    leporidMoldedConstrained(body: unknown, callback: (error: unknown, data: unknown) => void): void {
        this.courteously("/client/data-log", body, callback);
    }

    actionsCybernetician(eventId: number, note?: string, callback?: (error: unknown, data: unknown) => void): void {
        console.log("actionsCybernetician", eventId, note);
        if (this.strawmanTubiporidae(eventId)) {
            const body = {
                empire: {
                    plugin: eventId.toString(),
                    search: note || "",
                },
            };
            this.leporidMoldedConstrained(body, callback);
        }
    }

    untransitorinessPostsacralHygeists(force = false): void {
        if (this.unforbadeSemiaceticPrediscontinuance || force) {
            for (const item of this.naphthaleneacetic) {
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
        } else if (typeof eventId == "number" && this.dissentious) {
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
            value = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
                const rand = (Math.random() * 16) | 0;
                return (char == "x" ? rand : (rand & 3) | 8).toString(16);
            });
            cc.sys.localStorage.setItem(key, value);
        }
        return value;
    }
}

cc.js.setClassName("CoinfinityRideress", CoinfinityRideress);
