let MiddleHelper: any = null;
try {
    const mod = require("MiddleHelper.js");
    MiddleHelper = mod && mod.default ? mod.default : mod;
} catch (e) { }

interface CurrencyRule {
    symbol: string;
    group: string;
    decimal: string;
    decimals: number;
    unit: number;
    noSpace: boolean;
}

const RULES: { [key: string]: CurrencyRule } = {
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

function normalizeCountry(country: any): string {
    return String(country || "").toUpperCase();
}

function getRegionalCountry(): string {
    if (!MiddleHelper || "function" != typeof MiddleHelper.getRegionalState) {
        return "";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return normalizeCountry(state && state.country);
    } catch (e) {
        return "";
    }
}

function detectLanguageCountry(): string {
    const lang = cc && cc.sys ? cc.sys.language : "";
    const lower = String(lang || "").toLowerCase();
    if (0 === lower.indexOf("zh")) return "CN";
    if (0 === lower.indexOf("id")) return "ID";
    if (0 === lower.indexOf("pt-pt")) return "PT";
    if (0 === lower.indexOf("pt")) return "BR";
    if (0 === lower.indexOf("es")) return "MX";
    if (0 === lower.indexOf("ja")) return "JP";
    if (0 === lower.indexOf("ko")) return "KR";
    if (0 === lower.indexOf("ru")) return "RU";
    if (0 === lower.indexOf("th")) return "TH";
    if (0 === lower.indexOf("vi")) return "VN";
    if (0 === lower.indexOf("de")) return "DE";
    if (0 === lower.indexOf("it")) return "IT";
    if (0 === lower.indexOf("bn")) return "BD";
    return "IN";
}

const CurrencyFormatService = {
    _country: "",

    setCountry: function (country: any): string {
        const code = normalizeCountry(country);
        if (!code) {
            return "";
        }
        this._country = code;
        try {
            cc.sys.localStorage.setItem("APP_COUNTRY_CODE", code);
        } catch (e) { }
        return this._country;
    },

    getCurrentCountry: function (): string {
        const regional = getRegionalCountry();
        if (regional) {
            this._country = regional;
            return regional;
        }
        let code = normalizeCountry(this._country);
        if (code) {
            return code;
        }
        try {
            code = normalizeCountry(cc.sys.localStorage.getItem("APP_COUNTRY_CODE"));
            if (code) {
                this._country = code;
                return code;
            }
            code = normalizeCountry(cc.sys.localStorage.getItem("MB_CACHE_ATTR_COUNTRY"));
            if (code) {
                this._country = code;
                return code;
            }
        } catch (e) { }
        code = detectLanguageCountry();
        this._country = code;
        return code;
    },

    getRule: function (country: any): CurrencyRule {
        const code = normalizeCountry(country || this.getCurrentCountry());
        return RULES[code] || RULES.IN;
    },

    getRealMoney: function (amount: any, country: any): number {
        const rule = this.getRule(country);
        let value = Number(amount || 0);
        if (isNaN(value)) {
            value = 0;
        }
        return value / (rule.unit || 100);
    },

    formatNumber: function (amount: any, country: any): string {
        const rule = this.getRule(country);
        let value = Number(amount || 0);
        if (isNaN(value)) {
            value = 0;
        }
        const parts = value.toFixed(rule.decimals).split(".");
        let intPart = parts[0];
        const decPart = parts.length > 1 ? parts[1] : "";
        intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, rule.group);
        return rule.decimals <= 0 ? intPart : intPart + rule.decimal + decPart;
    },

    getCurrencySymbol: function (country: any): string {
        return this.getRule(country).symbol || "";
    },

    formatCurrency: function (amount: any, ...args: any[]): string {
        const rawValue = args.length > 0 ? args[0] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(rawValue, country);
        const formatted = this.formatNumber(realMoney, country);
        const symbol = rule.symbol || "";
        if (!symbol) {
            return formatted;
        }
        return rule.noSpace ? symbol + formatted : symbol + " " + formatted;
    },

    formatCurrencyInteger: function (amount: any, ...args: any[]): string {
        const rawValue = args.length > 0 ? args[0] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(rawValue, country);
        const value = Math.max(0, Math.floor(Number(realMoney) || 0));
        const group = rule.group || ",";
        const grouped = String(value).replace(/\B(?=(\d{3})+(?!\d))/g, group);
        const symbol = rule.symbol || "";
        if (!symbol) {
            return grouped;
        }
        return rule.noSpace ? symbol + grouped : symbol + " " + grouped;
    }
};

export default CurrencyFormatService;