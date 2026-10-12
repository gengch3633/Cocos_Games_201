import MiddleHelper from "./MiddleHelper";

interface CurrencyRule {
    symbol: string;
    group: string;
    decimal: string;
    decimals: number;
    unit: number;
    noSpace: boolean;
}

const CURRENCY_RULES: { [code: string]: CurrencyRule } = {
    CN: { symbol: "¥", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    BR: { symbol: "R$", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    ID: { symbol: "Rp", group: ".", decimal: ",", decimals: 0, unit: 1, noSpace: true },
    US: { symbol: "$", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    JP: { symbol: "¥", group: ",", decimal: ".", decimals: 0, unit: 1, noSpace: true },
    KR: { symbol: "₩", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    RU: { symbol: "₽", group: " ", decimal: ",", decimals: 2, unit: 100, noSpace: false },
    MX: { symbol: "$", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    CO: { symbol: "$", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    AR: { symbol: "AR$", group: ".", decimal: ",", decimals: 0, unit: 1, noSpace: true },
    PE: { symbol: "S/", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    ES: { symbol: "€", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    VN: { symbol: "₫", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    TH: { symbol: "฿", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    IN: { symbol: "₹", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PH: { symbol: "₱", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    MY: { symbol: "RM", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PT: { symbol: "€", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    DE: { symbol: "€", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    IT: { symbol: "€", group: ".", decimal: ",", decimals: 2, unit: 100, noSpace: true },
    SA: { symbol: "SAR ", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    ZA: { symbol: "R", group: " ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    EG: { symbol: "E£", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    KE: { symbol: "KSh ", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PK: { symbol: "Rs ", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    BD: { symbol: "৳ ", group: ",", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    NG: { symbol: "₦", group: ",", decimal: ".", decimals: 0, unit: 1, noSpace: true }
};

const COUNTRY_STORAGE_KEY = "APP_COUNTRY_CODE";
const ATTR_COUNTRY_STORAGE_KEY = "MB_CACHE_ATTR_COUNTRY";

function normalizeCountry(code: any): string {
    return String(code || "").toUpperCase();
}

function querySystemCountry(): string {
    const helper: any = MiddleHelper;
    if (!helper || typeof helper.getRegionalState !== "function") {
        return "";
    }
    try {
        const state = helper.getRegionalState();
        return normalizeCountry(state && state.country);
    } catch (err) {
        return "";
    }
}

function detectCountryFromLanguage(): string {
    const lang = cc && cc.sys ? cc.sys.language : "";
    const lowerLang = String(lang || "").toLowerCase();
    if (lowerLang.indexOf("zh") === 0) return "CN";
    if (lowerLang.indexOf("id") === 0) return "ID";
    if (lowerLang.indexOf("pt-pt") === 0) return "PT";
    if (lowerLang.indexOf("pt") === 0) return "BR";
    if (lowerLang.indexOf("es") === 0) return "MX";
    if (lowerLang.indexOf("ja") === 0) return "JP";
    if (lowerLang.indexOf("ko") === 0) return "KR";
    if (lowerLang.indexOf("ru") === 0) return "RU";
    if (lowerLang.indexOf("th") === 0) return "TH";
    if (lowerLang.indexOf("vi") === 0) return "VN";
    if (lowerLang.indexOf("de") === 0) return "DE";
    if (lowerLang.indexOf("it") === 0) return "IT";
    if (lowerLang.indexOf("bn") === 0) return "BD";
    return "IN";
}

class CurrencyFormatService {
    private _country: string = "";

    public setCountry(country: string): string {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return "";
        }
        this._country = normalized;
        try {
            cc.sys.localStorage.setItem(COUNTRY_STORAGE_KEY, normalized);
        } catch (err) {
            /* ignore storage errors */
        }
        return this._country;
    }

    public getCurrentCountry(): string {
        const systemCountry = querySystemCountry();
        if (systemCountry) {
            this._country = systemCountry;
            return systemCountry;
        }

        let country = normalizeCountry(this._country);
        if (country) {
            return country;
        }

        try {
            country = normalizeCountry(cc.sys.localStorage.getItem(COUNTRY_STORAGE_KEY));
            if (country) {
                this._country = country;
                return country;
            }
            country = normalizeCountry(cc.sys.localStorage.getItem(ATTR_COUNTRY_STORAGE_KEY));
            if (country) {
                this._country = country;
                return country;
            }
        } catch (err) {
            /* ignore storage errors */
        }

        country = detectCountryFromLanguage();
        this._country = country;
        return country;
    }

    public getRule(country?: string): CurrencyRule {
        const code = normalizeCountry(country || this.getCurrentCountry());
        return CURRENCY_RULES[code] || CURRENCY_RULES.IN;
    }

    public getRealMoney(amount: any, country?: string): number {
        const rule = this.getRule(country);
        let value = Number(amount || 0);
        if (isNaN(value)) {
            value = 0;
        }
        return value / (rule.unit || 100);
    }

    public formatNumber(amount: any, country?: string): string {
        const rule = this.getRule(country);
        let value = Number(amount || 0);
        if (isNaN(value)) {
            value = 0;
        }
        const parts = value.toFixed(rule.decimals).split(".");
        let integerPart = parts[0];
        const decimalPart = parts.length > 1 ? parts[1] : "";
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, rule.group);
        return rule.decimals <= 0 ? integerPart : integerPart + rule.decimal + decimalPart;
    }

    public getCurrencySymbol(country?: string): string {
        return this.getRule(country).symbol || "";
    }

    public formatCurrency(amount: any, ...rest: any[]): string {
        const value = rest.length > 0 ? rest[0] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value, country);
        const formatted = this.formatNumber(realMoney, country);
        const symbol = rule.symbol || "";
        if (!symbol) {
            return formatted;
        }
        return rule.noSpace ? symbol + formatted : symbol + " " + formatted;
    }

    public formatCurrencyInteger(amount: any, ...rest: any[]): string {
        const value = rest.length > 0 ? rest[0] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value, country);
        const intValue = Math.max(0, Math.floor(Number(realMoney) || 0));
        const group = rule.group || ",";
        const formatted = String(intValue).replace(/\B(?=(\d{3})+(?!\d))/g, group);
        const symbol = rule.symbol || "";
        if (!symbol) {
            return formatted;
        }
        return rule.noSpace ? symbol + formatted : symbol + " " + formatted;
    }
}

const currencyFormatService = new CurrencyFormatService();

export default currencyFormatService;