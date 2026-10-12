import CurrencyFormatService from "./CurrencyFormatService";
import MiddleHelper from "./MiddleHelper";

type RuleMap = { [key: string]: string };
type AssetRules = { [key: string]: RuleMap };

interface ICountryAssetService {
  _assetRules: AssetRules;
  normalizeCountry(country: string): string;
  normalizeRuleMap(input: any): RuleMap;
  getCurrentCountry(): string;
  getCountryRegion(country?: string): string;
  setAssetRules(key: string, rules: any): void;
  getAssetRules(key: string): RuleMap | null;
  parseRuleMapText(text: string): RuleMap;
  resolvePath(ruleMap: any, country?: string, fallback?: string): string;
  getAssetPath(key: string, country?: string, fallback?: string): string;
  getPathByImageName(imageName: string, country?: string): string;
}

const COUNTRY_REGION_MAP: { [key: string]: string } = {
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

const COUNTRY_ASSET_ROOT = "texture/gameing/country";
const DEFAULT_FOLDER = "in";

function getRegionalCountry(): string {
  if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") return "";
  try {
    const state = MiddleHelper.getRegionalState();
    return String(state && state.country || "").trim().toUpperCase();
  } catch (e) {
    return "";
  }
}

function isValidSimpleName(name: string): boolean {
  return !!name && name.indexOf("/") === -1 && name.indexOf("\\") === -1;
}

function toLowerCase(value: string): string {
  return String(value || "").trim().toLowerCase();
}

function buildCountryAssetPath(ruleKey: string, assetName: string): string {
  if (!assetName) return "";
  const normalizedKey = String(ruleKey || "").trim().toUpperCase();
  if (normalizedKey && normalizedKey !== "DEFAULT" && normalizedKey !== "FALLBACK") {
    if (normalizedKey.indexOf("REGION_") === 0) {
      return COUNTRY_ASSET_ROOT + "/region_" + toLowerCase(normalizedKey.replace("REGION_", "")) + "/" + assetName;
    }
    return COUNTRY_ASSET_ROOT + "/" + toLowerCase(normalizedKey) + "/" + assetName;
  }
  return COUNTRY_ASSET_ROOT + "/" + DEFAULT_FOLDER + "/" + assetName;
}

const CountryAssetService: ICountryAssetService = {
  _assetRules: {},
  normalizeCountry(country: string): string {
    return String(country || "").trim().toUpperCase();
  },
  normalizeRuleMap(input: any): RuleMap {
    if (!input || typeof input !== "object") return {};
    const result: RuleMap = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        const normalizedKey = String(key || "").trim().toUpperCase();
        if (normalizedKey) {
          const value = String(input[key] || "").trim();
          if (value) {
            result[normalizedKey] = value;
          }
        }
      }
    }
    return result;
  },
  getCurrentCountry(): string {
    return this.normalizeCountry(getRegionalCountry() || CurrencyFormatService.getCurrentCountry()) || "IN";
  },
  getCountryRegion(country?: string): string {
    const normalized = this.normalizeCountry(country || this.getCurrentCountry());
    return COUNTRY_REGION_MAP[normalized] || "";
  },
  setAssetRules(key: string, rules: any): void {
    const normalizedKey = String(key || "").trim();
    if (normalizedKey) {
      this._assetRules[normalizedKey] = this.normalizeRuleMap(rules);
    }
  },
  getAssetRules(key: string): RuleMap | null {
    const normalizedKey = String(key || "").trim();
    return (normalizedKey && this._assetRules[normalizedKey]) || null;
  },
  parseRuleMapText(text: string): RuleMap {
    const normalizedText = String(text || "").trim();
    if (!normalizedText) return {};
    try {
      const parsed = JSON.parse(normalizedText);
      return this.normalizeRuleMap(parsed);
    } catch (e) {
      cc.warn("[CountryAssetService] parseRuleMapText failed:", normalizedText, e);
      return {};
    }
  },
  resolvePath(ruleMap: any, country?: string, fallback?: string): string {
    const normalizedRuleMap = this.normalizeRuleMap(ruleMap);
    const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
    const region = this.getCountryRegion(normalizedCountry);
    let assetName = "";
    let ruleKey = "";
    if (normalizedCountry && normalizedRuleMap[normalizedCountry]) {
      assetName = normalizedRuleMap[normalizedCountry];
      ruleKey = normalizedCountry;
    } else if (region && normalizedRuleMap["REGION_" + region]) {
      assetName = normalizedRuleMap["REGION_" + region];
      ruleKey = "REGION_" + region;
    } else if (normalizedRuleMap.DEFAULT) {
      assetName = normalizedRuleMap.DEFAULT;
      ruleKey = "DEFAULT";
    } else {
      assetName = String(fallback || "").trim();
      ruleKey = "FALLBACK";
    }
    if (isValidSimpleName(assetName)) {
      if (ruleKey !== "DEFAULT" && ruleKey !== "FALLBACK" && ruleKey) {
        if (ruleKey.indexOf("REGION_") === 0) {
          return COUNTRY_ASSET_ROOT + "/region_" + toLowerCase(ruleKey.replace("REGION_", "")) + "/" + assetName;
        }
        return COUNTRY_ASSET_ROOT + "/" + toLowerCase(ruleKey) + "/" + assetName;
      }
      return COUNTRY_ASSET_ROOT + "/" + DEFAULT_FOLDER + "/" + assetName;
    }
    return assetName;
  },
  getAssetPath(key: string, country?: string, fallback?: string): string {
    const rules = this.getAssetRules(key);
    return this.resolvePath(rules || {}, country, fallback);
  },
  getPathByImageName(imageName: string, country?: string): string {
    const normalizedImageName = String(imageName || "").trim();
    if (!normalizedImageName) return "";
    if (!isValidSimpleName(normalizedImageName)) return normalizedImageName;
    const normalizedCountry = this.normalizeCountry(country || this.getCurrentCountry());
    const region = this.getCountryRegion(normalizedCountry);
    return buildCountryAssetPath(normalizedCountry || (region ? "REGION_" + region : "DEFAULT"), normalizedImageName);
  }
};

export default CountryAssetService;