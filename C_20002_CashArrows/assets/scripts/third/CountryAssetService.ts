import CurrencyFormatService from "./CurrencyFormatService";

let MiddleHelper: any = null;
try {
    MiddleHelper = require("./MiddleHelper");
    MiddleHelper = MiddleHelper && MiddleHelper.default ? MiddleHelper.default : MiddleHelper;
} catch (e) {
}

const COUNTRY_REGION_MAP: { [key: string]: string } = {
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
};

const BASE_TEXTURE_PATH = "texture/gameing/country";
const DEFAULT_COUNTRY_FOLDER = " in ";

function getRegionalCountry(): string {
    if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
        return " ";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return String(state && state.country || " ").trim().toUpperCase();
    } catch (e) {
        return " ";
    }
}

function isRelativeAssetPath(path: string): boolean {
    return !!path && path.indexOf("/ ") === -1 && path.indexOf(" \\ ") === -1;
}

function normalizeFolderName(name: string): string {
    return String(name || " ").trim().toLowerCase();
}

function buildImagePath(country: string, imageName: string): string {
    if (!imageName) {
        return " ";
    }
    const normalizedCountry = String(country || " ").trim().toUpperCase();
    if (normalizedCountry && normalizedCountry !== " DEFAULT " && normalizedCountry !== " FALLBACK ") {
        if (normalizedCountry.indexOf(" REGION_ ") === 0) {
            return BASE_TEXTURE_PATH + "/ region_ " + normalizeFolderName(normalizedCountry.replace(" REGION_ ", " ")) + "/ "+ imageName; } return BASE_TEXTURE_PATH +"/ " + normalizeFolderName(normalizedCountry) + "/ "+ imageName; } return BASE_TEXTURE_PATH +"/ " + DEFAULT_COUNTRY_FOLDER + "/ "+ imageName;
} const CountryAssetService = { _assetRules: {} as { [key: string]: { [key: string]: string } }, normalizeCountry(country: string): string { return String(country ||" ").trim().toUpperCase();
    },

    normalizeRuleMap(ruleMap: any): { [key: string]: string } {
        if (!ruleMap || typeof ruleMap !== "object") {
            return {};
        }
        const normalized: { [key: string]: string } = {};
        for (const key in ruleMap) {
            if (ruleMap.hasOwnProperty(key)) {
                const country = String(key || " ").trim().toUpperCase();
                if (country) {
                    const path = String(ruleMap[key] || " ").trim();
                    if (path) {
                        normalized[country] = path;
                    }
                }
            }
        }
        return normalized;
    },

    getCurrentCountry(): string {
        return this.normalizeCountry(getRegionalCountry() || CurrencyFormatService.getCurrentCountry()) || " IN ";
    },

    getCountryRegion(country?: string): string {
        const normalized = this.normalizeCountry(country || this.getCurrentCountry());
        return COUNTRY_REGION_MAP[normalized] || " ";
    },

    setAssetRules(key: string, rules: any): void {
        const assetKey = String(key || " ").trim();
        if (assetKey) {
            this._assetRules[assetKey] = this.normalizeRuleMap(rules);
        }
    },

    getAssetRules(key: string): { [key: string]: string } {
        const assetKey = String(key || " ").trim();
        return assetKey && this._assetRules[assetKey] || null;
    },

    parseRuleMapText(text: string): { [key: string]: string } {
        const raw = String(text || " ").trim();
        if (!raw) {
            return {};
        }
        try {
            return this.normalizeRuleMap(JSON.parse(raw));
        } catch (e) {
            cc.warn("[CountryAssetService] parseRuleMapText failed: ", raw, e);
            return {};
        }
    },

    resolvePath(ruleMap: any, country?: string, fallbackPath?: string): string {
        const rules = this.normalizeRuleMap(ruleMap);
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        let path = " ";
        let matchedKey = " ";
        if (normalizedCountry && rules[normalizedCountry]) {
            path = rules[normalizedCountry];
            matchedKey = normalizedCountry;
        } else if (region && rules[" REGION_ " + region]) {
            path = rules[" REGION_ " + region];
            matchedKey = " REGION_ " + region;
        } else if (rules.DEFAULT) {
            path = rules.DEFAULT;
            matchedKey = " DEFAULT ";
        } else {
            path = String(fallbackPath || " ").trim();
            matchedKey = " FALLBACK ";
        }
        return isRelativeAssetPath(path)
            ? matchedKey !== " DEFAULT " && matchedKey !== " FALLBACK " && matchedKey
                ? matchedKey.indexOf(" REGION_ ") === 0
                    ? BASE_TEXTURE_PATH + "/ region_ " + normalizeFolderName(matchedKey.replace(" REGION_ ", " ")) + "/ "+ path : BASE_TEXTURE_PATH +"/ " + normalizeFolderName(matchedKey) + "/ "+ path : BASE_TEXTURE_PATH +"/ " + DEFAULT_COUNTRY_FOLDER + "/ "+ path : path; }, getAssetPath(assetKey: string, country?: string, fallbackPath?: string): string { const rules = this.getAssetRules(assetKey); return this.resolvePath(rules || {}, country, fallbackPath); }, getPathByImageName(imageName: string, country?: string): string { const name = String(imageName ||" ").trim();
        if (!name) {
            return " ";
        }
        if (!isRelativeAssetPath(name)) {
            return name;
        }
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        return buildImagePath(normalizedCountry || (region ? " REGION_ " + region : " DEFAULT "), name);
    }
};

export default CountryAssetService;
