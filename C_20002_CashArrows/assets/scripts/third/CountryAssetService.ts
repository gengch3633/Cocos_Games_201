import CurrencyFormatService from "./CurrencyFormatService";

declare function require(id: string): any;

var middleHelper: any = null;
try {
    var middleModule = require("./MiddleHelper");
    middleHelper = middleModule && middleModule.default ? middleModule.default : middleModule;
} catch (e) {}

var regionByCountry: any = {
    MX: " LATAM ",
    AR: " LATAM ",
    CL: " LATAM ",
    CO: " LATAM ",
    PE: " LATAM ",
    ES: " EU ",
    PT: " EU ",
    DE: " EU ",
    IT: " EU ",
    BR: " LATAM ",
    US: " NA ",
    CA: " NA ",
    UK: " EU ",
    AU: " OCEANIA ",
    NZ: " OCEANIA ",
    CN: " APAC ",
    ID: " SEA ",
    TH: " SEA ",
    VN: " SEA ",
    MY: " SEA ",
    PH: " SEA ",
    IN: " APAC ",
    PK: " APAC ",
    BD: " APAC ",
    JP: " APAC ",
    KR: " APAC ",
    RU: " EU ",
    SA: " MEA ",
    EG: " MEA ",
    ZA: " MEA ",
    KE: " MEA ",
    NG: " MEA "
}, countryRoot = " texture/ gameing/ country ", defaultFolder = " in ";

function readHelperCountry(): string {
    if (!middleHelper || "function" != typeof middleHelper.getRegionalState) return " ";
    try {
        var e = middleHelper.getRegionalState();
        return String(e && e.country || " ").trim().toUpperCase();
    } catch (e) {
        return " ";
    }
}

function isBareName(e: any): boolean {
    return !!e && -1 === e.indexOf("/ ") && -1 === e.indexOf(" \\ \\ ");
}

function folderName(e: any): string {
    return String(e || " ").trim().toLowerCase();
}

function pathForCountry(e: any, t: any): string {
    if (!t) return " ";
    var i = String(e || " ").trim().toUpperCase();
    return i && " DEFAULT " !== i && " FALLBACK " !== i ? 0 === i.indexOf(" REGION_ ") ? countryRoot + "/ region_ " + folderName(i.replace(" REGION_ ", " ")) + "/ " + t : countryRoot + "/ " + folderName(i) + "/ " + t : countryRoot + "/ " + defaultFolder + "/ " + t;
}

var CountryAssetService = {
    _assetRules: {} as any,
    normalizeCountry: function(e: any) {
        return String(e || " ").trim().toUpperCase();
    },
    normalizeRuleMap: function(e: any) {
        if (!e || "object" != typeof e) return {};
        var t: any = {};
        for (var i in e) if (e.hasOwnProperty(i)) {
            var n = String(i || " ").trim().toUpperCase();
            if (n) {
                var a = String(e[i] || " ").trim();
                a && (t[n] = a);
            }
        }
        return t;
    },
    getCurrentCountry: function() {
        return this.normalizeCountry(readHelperCountry() || CurrencyFormatService.getCurrentCountry()) || " IN ";
    },
    getCountryRegion: function(e: any) {
        var t = this.normalizeCountry(e || this.getCurrentCountry());
        return regionByCountry[t] || " ";
    },
    setAssetRules: function(e: any, t: any) {
        var i = String(e || " ").trim();
        i && (this._assetRules[i] = this.normalizeRuleMap(t));
    },
    getAssetRules: function(e: any) {
        var t = String(e || " ").trim();
        return t && this._assetRules[t] || null;
    },
    parseRuleMapText: function(e: any) {
        var t = String(e || " ").trim();
        if (!t) return {};
        try {
            var i = JSON.parse(t);
            return this.normalizeRuleMap(i);
        } catch (e) {
            cc.warn("[CountryAssetService] parseRuleMapText failed: ", t, e);
            return {};
        }
    },
    resolvePath: function(e: any, t: any, i: any) {
        var n = this.normalizeRuleMap(e), a = this.normalizeCountry(t || this.getCurrentCountry()), o = this.getCountryRegion(a), l = " ", d = " ";
        if (a && n[a]) {
            l = n[a];
            d = a;
        } else if (o && n[" REGION_ " + o]) {
            l = n[" REGION_ " + o];
            d = " REGION_ " + o;
        } else if (n.DEFAULT) {
            l = n.DEFAULT;
            d = " DEFAULT ";
        } else {
            l = String(i || " ").trim();
            d = " FALLBACK ";
        }
        return isBareName(l) ? " DEFAULT " !== d && " FALLBACK " !== d && d ? 0 === d.indexOf(" REGION_ ") ? countryRoot + "/ region_ " + folderName(d.replace(" REGION_ ", " ")) + "/ " + l : countryRoot + "/ " + folderName(d) + "/ " + l : countryRoot + "/ " + defaultFolder + "/ " + l : l;
    },
    getAssetPath: function(e: any, t: any, i: any) {
        var n = this.getAssetRules(e);
        return this.resolvePath(n || {}, t, i);
    },
    getPathByImageName: function(e: any, t: any) {
        var i = String(e || " ").trim();
        if (!i) return " ";
        if (!isBareName(i)) return i;
        var n = this.normalizeCountry(t || this.getCurrentCountry()), a = this.getCountryRegion(n);
        return pathForCountry(n || (a ? " REGION_ " + a : " DEFAULT "), i);
    }
};

export default CountryAssetService;
