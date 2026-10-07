import CurrencyFormatService from "./CurrencyFormatService";

let MiddleHelper: any = null;
try {
    const mod = require("./MiddleHelper");
    MiddleHelper = mod && mod.default ? mod.default : mod;
} catch (e) {
}

const REGION_MAP: { [key: string]: string } = {
    MX: "LATAM", AR: "LATAM", CL: "LATAM", CO: "LATAM", PE: "LATAM",
    ES: "EU", PT: "EU", DE: "EU", IT: "EU", BR: "LATAM",
    US: "NA", CA: "NA", UK: "EU", AU: "OCEANIA", NZ: "OCEANIA",
    CN: "APAC", ID: "SEA", TH: "SEA", VN: "SEA", MY: "SEA", PH: "SEA",
    IN: "APAC", PK: "APAC", BD: "APAC", JP: "APAC", KR: "APAC",
    RU: "EU", SA: "MEA", EG: "MEA", ZA: "MEA", KE: "MEA", NG: "MEA",
};

const BASE_TEXTURE_PATH = "texture/gameing/country";
const DEFAULT_COUNTRY = "in";

function readRegionalCountry(): string {
    if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
        return "";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return String(state && state.country || "").trim().toUpperCase();
    } catch (e) {
        return "";
    }
}

function isSimpleFileName(name: string): boolean {
    return !!name && name.indexOf("/") === -1 && name.indexOf("\\") === -1;
}

function toLower(value: string): string {
    return String(value || "").trim().toLowerCase();
}

function buildPathByCountry(country: string, fileName: string): string {
    if (!fileName) {
        return "";
    }
    const normalized = String(country || "").trim().toUpperCase();
    if (normalized && normalized !== "DEFAULT" && normalized !== "FALLBACK") {
        if (normalized.indexOf("REGION_") === 0) {
            return BASE_TEXTURE_PATH + "/region_" + toLower(normalized.replace("REGION_", "")) + "/" + fileName;
        }
        return BASE_TEXTURE_PATH + "/" + toLower(normalized) + "/" + fileName;
    }
    return BASE_TEXTURE_PATH + "/" + DEFAULT_COUNTRY + "/" + fileName;
}

const CountryAssetService = {
    _assetRules: {} as { [key: string]: { [key: string]: string } },

    normalizeCountry(country: string): string {
        return String(country || "").trim().toUpperCase();
    },

    normalizeRuleMap(map: any): { [key: string]: string } {
        if (!map || typeof map !== "object") {
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

    getCurrentCountry(): string {
        return this.normalizeCountry(readRegionalCountry() || CurrencyFormatService.getCurrentCountry()) || "IN";
    },

    getCountryRegion(country?: string): string {
        const normalized = this.normalizeCountry(country || this.getCurrentCountry());
        return REGION_MAP[normalized] || "";
    },

    setAssetRules(assetKey: string, rules: any): void {
        const key = String(assetKey || "").trim();
        if (key) {
            this._assetRules[key] = this.normalizeRuleMap(rules);
        }
    },

    getAssetRules(assetKey: string): { [key: string]: string } | null {
        const key = String(assetKey || "").trim();
        return key && this._assetRules[key] || null;
    },

    parseRuleMapText(text: string): { [key: string]: string } {
        const trimmed = String(text || "").trim();
        if (!trimmed) {
            return {};
        }
        try {
            const parsed = JSON.parse(trimmed);
            return this.normalizeRuleMap(parsed);
        } catch (e) {
            cc.warn("[CountryAssetService] parseRuleMapText failed:", trimmed, e);
            return {};
        }
    },

    resolvePath(ruleMap: any, country?: string, fallback?: string): string {
        const rules = this.normalizeRuleMap(ruleMap);
        const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
        const region = this.getCountryRegion(normalizedCountry);
        let fileName = "";
        let matchedKey = "";
        if (normalizedCountry && rules[normalizedCountry]) {
            fileName = rules[normalizedCountry];
            matchedKey = normalizedCountry;
        } else if (region && rules["REGION_" + region]) {
            fileName = rules["REGION_" + region];
            matchedKey = "REGION_" + region;
        } else if (rules.DEFAULT) {
            fileName = rules.DEFAULT;
            matchedKey = "DEFAULT";
        } else {
            fileName = String(fallback || "").trim();
            matchedKey = "FALLBACK";
        }
        if (isSimpleFileName(fileName)) {
            if (matchedKey !== "DEFAULT" && matchedKey !== "FALLBACK" && matchedKey) {
                if (matchedKey.indexOf("REGION_") === 0) {
                    return BASE_TEXTURE_PATH + "/region_" + toLower(matchedKey.replace("REGION_", "")) + "/" + fileName;
                }
                return BASE_TEXTURE_PATH + "/" + toLower(matchedKey) + "/" + fileName;
            }
            return BASE_TEXTURE_PATH + "/" + DEFAULT_COUNTRY + "/" + fileName;
        }
        return fileName;
    },

    getAssetPath(assetKey: string, country?: string, fallback?: string): string {
        const rules = this.getAssetRules(assetKey);
        return this.resolvePath(rules || {}, country, fallback);
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
        return buildPathByCountry(normalizedCountry || (region ? "REGION_" + region : "DEFAULT"), name);
    },
};

export default CountryAssetService;
