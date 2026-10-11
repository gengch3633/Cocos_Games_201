import CurrencyFormatService from "./CurrencyFormatService";

let MiddleHelper: any = null;
try {
    const mod = require("MiddleHelper.js");
    MiddleHelper = mod && mod.default ? mod.default : mod;
} catch (e) { }

const COUNTRY_REGION: { [key: string]: string } = {
    MX: "LATAM",
    AR: "LATAM",
    CL: "LATAM",
    CO: "LATAM",
    PE: "LATAM",
    ES: "EU",
    PT: "EU",
    DE: "EU",
    IT: "EU",
    BR: "LATAM",
    US: "NA",
    CA: "NA",
    UK: "EU",
    AU: "OCEANIA",
    NZ: "OCEANIA",
    CN: "APAC",
    ID: "SEA",
    TH: "SEA",
    VN: "SEA",
    MY: "SEA",
    PH: "SEA",
    IN: "APAC",
    PK: "APAC",
    BD: "APAC",
    JP: "APAC",
    KR: "APAC",
    RU: "EU",
    SA: "MEA",
    EG: "MEA",
    ZA: "MEA",
    KE: "MEA",
    NG: "MEA"
};
const COUNTRY_TEXTURE_ROOT = "texture/gameing/country";
const DEFAULT_COUNTRY_DIR = "in";

function getRegionalCountry(): string {
    if (!MiddleHelper || "function" != typeof MiddleHelper.getRegionalState) {
        return "";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return String((state && state.country) || "").trim().toUpperCase();
    } catch (e) {
        return "";
    }
}

function isPlainAssetName(name: any): boolean {
    return !!name && -1 === name.indexOf("/") && -1 === name.indexOf("\\");
}

function normalizeText(value: any): string {
    return String(value || "").trim().toLowerCase();
}

function buildCountryAssetPath(countryKey: string, imageName: string): string {
    if (!imageName) {
        return "";
    }
    const key = String(countryKey || "").trim().toUpperCase();
    if (key && "DEFAULT" !== key && "FALLBACK" !== key) {
        if (0 === key.indexOf("REGION_")) {
            return COUNTRY_TEXTURE_ROOT + "/region_" + normalizeText(key.replace("REGION_", "")) + "/" + imageName;
        }
        return COUNTRY_TEXTURE_ROOT + "/" + normalizeText(key) + "/" + imageName;
    }
    return COUNTRY_TEXTURE_ROOT + "/" + DEFAULT_COUNTRY_DIR + "/" + imageName;
}

const CountryAssetService = {
    _assetRules: {} as { [key: string]: { [key: string]: string } },

    normalizeCountry: function (country: any): string {
        return String(country || "").trim().toUpperCase();
    },

    normalizeRuleMap: function (map: any): { [key: string]: string } {
        if (!map || "object" != typeof map) {
            return {};
        }
        const result: { [key: string]: string } = {};
        for (const key in map) {
            if (map.hasOwnProperty(key)) {
                const normalizedKey = String(key || "").trim().toUpperCase();
                if (normalizedKey) {
                    const value = String(map[key] || "").trim();
                    if (value) {
                        result[normalizedKey] = value;
                    }
                }
            }
        }
        return result;
    },

    getCurrentCountry: function (): string {
        return this.normalizeCountry(getRegionalCountry() || CurrencyFormatService.getCurrentCountry()) || "IN";
    },

    getCountryRegion: function (country: any): string {
        const key = this.normalizeCountry(country || this.getCurrentCountry());
        return COUNTRY_REGION[key] || "";
    },

    setAssetRules: function (name: string, rules: any): void {
        const key = String(name || "").trim();
        if (key) {
            this._assetRules[key] = this.normalizeRuleMap(rules);
        }
    },

    getAssetRules: function (name: string): { [key: string]: string } | null {
        const key = String(name || "").trim();
        return (key && this._assetRules[key]) || null;
    },

    parseRuleMapText: function (text: string): { [key: string]: string } {
        const str = String(text || "").trim();
        if (!str) {
            return {};
        }
        try {
            const parsed = JSON.parse(str);
            return this.normalizeRuleMap(parsed);
        } catch (e) {
            cc.warn("[CountryAssetService] parseRuleMapText failed:", str, e);
            return {};
        }
    },

    resolvePath: function (ruleMap: any, country: any, fallback: string): string {
        const rules = this.normalizeRuleMap(ruleMap);
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        let assetName = "";
        let keyLabel = "";
        if (normalizedCountry && rules[normalizedCountry]) {
            assetName = rules[normalizedCountry];
            keyLabel = normalizedCountry;
        } else if (region && rules["REGION_" + region]) {
            assetName = rules["REGION_" + region];
            keyLabel = "REGION_" + region;
        } else if (rules.DEFAULT) {
            assetName = rules.DEFAULT;
            keyLabel = "DEFAULT";
        } else {
            assetName = String(fallback || "").trim();
            keyLabel = "FALLBACK";
        }
        if (isPlainAssetName(assetName)) {
            if ("DEFAULT" !== keyLabel && "FALLBACK" !== keyLabel && keyLabel) {
                if (0 === keyLabel.indexOf("REGION_")) {
                    return COUNTRY_TEXTURE_ROOT + "/region_" + normalizeText(keyLabel.replace("REGION_", "")) + "/" + assetName;
                }
                return COUNTRY_TEXTURE_ROOT + "/" + normalizeText(keyLabel) + "/" + assetName;
            }
            return COUNTRY_TEXTURE_ROOT + "/" + DEFAULT_COUNTRY_DIR + "/" + assetName;
        }
        return assetName;
    },

    getAssetPath: function (name: string, country: any, fallback: string): string {
        const rules = this.getAssetRules(name);
        return this.resolvePath(rules || {}, country, fallback);
    },

    getPathByImageName: function (imageName: string, country: any): string {
        const name = String(imageName || "").trim();
        if (!name) {
            return "";
        }
        if (!isPlainAssetName(name)) {
            return name;
        }
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        return buildCountryAssetPath(normalizedCountry || (region ? "REGION_" + region : "DEFAULT"), name);
    }
};

export default CountryAssetService;