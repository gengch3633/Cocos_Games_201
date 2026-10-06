let MiddleHelper: {
    getRegionalState?: () => { country?: string };
} | null = null;

try {
    const helperModule = require("./MiddleHelper");
    MiddleHelper = helperModule && helperModule.default ? helperModule.default : helperModule;
} catch {
    MiddleHelper = null;
}

interface CurrencyRule {
    symbol: string;
    group: string;
    decimal: string;
    decimals: number;
    unit: number;
    noSpace: boolean;
}

const CURRENCY_RULES: Record<string, CurrencyRule> = {
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
    NG: { symbol: "₦", group: ",", decimal: ".", decimals: 0, unit: 1, noSpace: true },
};

function normalizeCountry(country: string): string {
    return String(country || "").toUpperCase();
}

function getRegionalCountry(): string {
    if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
        return "";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return normalizeCountry(state && state.country ? state.country : "");
    } catch {
        return "";
    }
}

function inferCountryFromLanguage(): string {
    const language = cc && cc.sys ? cc.sys.language : "";
    const lower = String(language || "").toLowerCase();
    if (lower.indexOf("zh") === 0) return "CN";
    if (lower.indexOf("id") === 0) return "ID";
    if (lower.indexOf("pt-pt") === 0) return "PT";
    if (lower.indexOf("pt") === 0) return "BR";
    if (lower.indexOf("es") === 0) return "MX";
    if (lower.indexOf("ja") === 0) return "JP";
    if (lower.indexOf("ko") === 0) return "KR";
    if (lower.indexOf("ru") === 0) return "RU";
    if (lower.indexOf("th") === 0) return "TH";
    if (lower.indexOf("vi") === 0) return "VN";
    if (lower.indexOf("de") === 0) return "DE";
    if (lower.indexOf("it") === 0) return "IT";
    if (lower.indexOf("bn") === 0) return "BD";
    return "IN";
}

const CurrencyFormatService = {
    _country: "",

    setCountry(country: string): string {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return "";
        }
        this._country = normalized;
        try {
            cc.sys.localStorage.setItem("APP_COUNTRY_CODE", normalized);
        } catch {
            // ignore
        }
        return this._country;
    },

    getCurrentCountry(): string {
        const regionalCountry = getRegionalCountry();
        if (regionalCountry) {
            this._country = regionalCountry;
            return regionalCountry;
        }

        let country = normalizeCountry(this._country);
        if (country) {
            return country;
        }

        try {
            country = normalizeCountry(cc.sys.localStorage.getItem("APP_COUNTRY_CODE") || "");
            if (country) {
                this._country = country;
                return country;
            }
            country = normalizeCountry(cc.sys.localStorage.getItem("MB_CACHE_ATTR_COUNTRY") || "");
            if (country) {
                this._country = country;
                return country;
            }
        } catch {
            // ignore
        }

        country = inferCountryFromLanguage();
        this._country = country;
        return country;
    },

    getRule(country?: string): CurrencyRule {
        const normalized = normalizeCountry(country || this.getCurrentCountry());
        return CURRENCY_RULES[normalized] || CURRENCY_RULES.IN;
    },

    getRealMoney(amount: number, country?: string): number {
        const rule = this.getRule(country);
        let value = Number(amount || 0);
        if (isNaN(value)) {
            value = 0;
        }
        return value / (rule.unit || 100);
    },

    formatNumber(amount: number, country?: string): string {
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
    },

    getCurrencySymbol(country?: string): string {
        return this.getRule(country).symbol || "";
    },

    formatCurrency(amount?: number, rawAmount?: number): string {
        const value = arguments.length > 1 ? rawAmount : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value as number, country);
        const formatted = this.formatNumber(realMoney, country);
        const symbol = rule.symbol || "";
        return symbol ? (rule.noSpace ? symbol + formatted : symbol + " " + formatted) : formatted;
    },

    formatCurrencyInteger(amount?: number, rawAmount?: number): string {
        const value = arguments.length > 1 ? rawAmount : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value as number, country);
        const integerValue = Math.max(0, Math.floor(Number(realMoney) || 0));
        const group = rule.group || ",";
        const formatted = String(integerValue).replace(/\B(?=(\d{3})+(?!\d))/g, group);
        const symbol = rule.symbol || "";
        return symbol ? (rule.noSpace ? symbol + formatted : symbol + " " + formatted) : formatted;
    },
};

export default CurrencyFormatService;
