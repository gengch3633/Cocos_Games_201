import CurrencyFormatService from "./CurrencyFormatService";

let MiddleHelper: {
    getRegionalState?: () => { country?: string };
} | null = null;

try {
    const helperModule = require("./MiddleHelper");
    MiddleHelper = helperModule && helperModule.default ? helperModule.default : helperModule;
} catch {
    MiddleHelper = null;
}

const COUNTRY_REGION_MAP: Record<string, string> = {
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
    NG: "MEA",
};

const BASE_TEXTURE_PATH = "texture/gameing/country";
const DEFAULT_COUNTRY = "in";

function getRegionalCountry(): string {
    if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
        return "";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return String((state && state.country) || "")
            .trim()
            .toUpperCase();
    } catch {
        return "";
    }
}

function isSimpleFileName(name: string): boolean {
    return !!name && name.indexOf("/") === -1 && name.indexOf("\\") === -1;
}

function toLower(value: string): string {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function buildCountryImagePath(countryCode: string, imageName: string): string {
    if (!imageName) {
        return "";
    }
    const country = String(countryCode || "")
        .trim()
        .toUpperCase();
    if (country && country !== "DEFAULT" && country !== "FALLBACK") {
        if (country.indexOf("REGION_") === 0) {
            return BASE_TEXTURE_PATH + "/region_" + toLower(country.replace("REGION_", "")) + "/" + imageName;
        }
        return BASE_TEXTURE_PATH + "/" + toLower(country) + "/" + imageName;
    }
    return BASE_TEXTURE_PATH + "/" + DEFAULT_COUNTRY + "/" + imageName;
}

const CountryAssetService = {
    _assetRules: {} as Record<string, Record<string, string>>,

    normalizeCountry(country: string): string {
        return String(country || "")
            .trim()
            .toUpperCase();
    },

    normalizeRuleMap(ruleMap: Record<string, string> | null | undefined): Record<string, string> {
        if (!ruleMap || typeof ruleMap !== "object") {
            return {};
        }
        const normalized: Record<string, string> = {};
        for (const key in ruleMap) {
            if (Object.prototype.hasOwnProperty.call(ruleMap, key)) {
                const country = String(key || "")
                    .trim()
                    .toUpperCase();
                if (country) {
                    const value = String(ruleMap[key] || "").trim();
                    if (value) {
                        normalized[country] = value;
                    }
                }
            }
        }
        return normalized;
    },

    getCurrentCountry(): string {
        return this.normalizeCountry(getRegionalCountry() || CurrencyFormatService.getCurrentCountry()) || "IN";
    },

    getCountryRegion(country?: string): string {
        const normalized = this.normalizeCountry(country || this.getCurrentCountry());
        return COUNTRY_REGION_MAP[normalized] || "";
    },

    setAssetRules(assetKey: string, ruleMap: Record<string, string>): void {
        const key = String(assetKey || "").trim();
        if (key) {
            this._assetRules[key] = this.normalizeRuleMap(ruleMap);
        }
    },

    getAssetRules(assetKey: string): Record<string, string> | null {
        const key = String(assetKey || "").trim();
        return (key && this._assetRules[key]) || null;
    },

    parseRuleMapText(text: string): Record<string, string> {
        const trimmed = String(text || "").trim();
        if (!trimmed) {
            return {};
        }
        try {
            return this.normalizeRuleMap(JSON.parse(trimmed));
        } catch (error) {
            cc.warn("[CountryAssetService] parseRuleMapText failed:", trimmed, error);
            return {};
        }
    },

    resolvePath(ruleMap: Record<string, string>, country?: string, fallbackPath?: string): string {
        const rules = this.normalizeRuleMap(ruleMap);
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        let assetName = "";
        let matchedKey = "";

        if (normalizedCountry && rules[normalizedCountry]) {
            assetName = rules[normalizedCountry];
            matchedKey = normalizedCountry;
        } else if (region && rules["REGION_" + region]) {
            assetName = rules["REGION_" + region];
            matchedKey = "REGION_" + region;
        } else if (rules.DEFAULT) {
            assetName = rules.DEFAULT;
            matchedKey = "DEFAULT";
        } else {
            assetName = String(fallbackPath || "").trim();
            matchedKey = "FALLBACK";
        }

        if (!isSimpleFileName(assetName)) {
            return assetName;
        }
        if (matchedKey !== "DEFAULT" && matchedKey !== "FALLBACK" && matchedKey) {
            if (matchedKey.indexOf("REGION_") === 0) {
                return BASE_TEXTURE_PATH + "/region_" + toLower(matchedKey.replace("REGION_", "")) + "/" + assetName;
            }
            return BASE_TEXTURE_PATH + "/" + toLower(matchedKey) + "/" + assetName;
        }
        return BASE_TEXTURE_PATH + "/" + DEFAULT_COUNTRY + "/" + assetName;
    },

    getAssetPath(assetKey: string, country?: string, fallbackPath?: string): string {
        const rules = this.getAssetRules(assetKey);
        return this.resolvePath(rules || {}, country, fallbackPath);
    },

    getPathByImageName(imageName: string, country?: string): string {
        const name = String(imageName || "").trim();
        if (!name) {
            return "";
        }
        if (!isSimpleFileName(name)) {
            return name;
        }
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        return buildCountryImagePath(normalizedCountry || (region ? "REGION_" + region : "DEFAULT"), name);
    },
};

export default CountryAssetService;
