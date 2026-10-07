let MiddleHelper: any = null;
try {
    const moduleRef = require("./MiddleHelper");
    MiddleHelper = moduleRef && moduleRef.default ? moduleRef.default : moduleRef;
} catch (e) {
}

const CURRENCY_RULES: { [key: string]: any } = {
    CN: { symbol: " ¥ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    BR: { symbol: " R$ ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    ID: { symbol: " Rp ", group: ".", decimal: ", ", decimals: 0, unit: 1, noSpace: true },
    US: { symbol: " $ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    JP: { symbol: " ¥ ", group: ", ", decimal: ".", decimals: 0, unit: 1, noSpace: true },
    KR: { symbol: " ₩ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    RU: { symbol: " ₽ ", group: " ", decimal: ", ", decimals: 2, unit: 100, noSpace: false },
    MX: { symbol: " $ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    CO: { symbol: " $ ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    AR: { symbol: " AR$ ", group: ".", decimal: ", ", decimals: 0, unit: 1, noSpace: true },
    PE: { symbol: " S/ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    ES: { symbol: " € ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    VN: { symbol: " ₫ ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    TH: { symbol: " ฿ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    IN: { symbol: " ₹ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PH: { symbol: " ₱ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    MY: { symbol: " RM ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PT: { symbol: " € ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    DE: { symbol: " € ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    IT: { symbol: " € ", group: ".", decimal: ", ", decimals: 2, unit: 100, noSpace: true },
    SA: { symbol: " SAR ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    ZA: { symbol: " R ", group: " ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    EG: { symbol: " E £ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    KE: { symbol: " KSh ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    PK: { symbol: " Rs ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    BD: { symbol: " ৳ ", group: ", ", decimal: ".", decimals: 2, unit: 100, noSpace: true },
    NG: { symbol: " ₦ ", group: ", ", decimal: ".", decimals: 0, unit: 1, noSpace: true }
};

function normalizeCountry(country: string): string {
    return String(country || " ").toUpperCase();
}

function getRegionalCountry(): string {
    if (!MiddleHelper || typeof MiddleHelper.getRegionalState !== "function") {
        return " ";
    }
    try {
        const state = MiddleHelper.getRegionalState();
        return normalizeCountry(state && state.country);
    } catch (e) {
        return " ";
    }
}

function inferCountryFromLanguage(language: string): string {
    const normalized = String(language || " ").toLowerCase();
    if (normalized.indexOf(" zh ") === 0) return " CN ";
    if (normalized.indexOf(" id ") === 0) return " ID ";
    if (normalized.indexOf(" pt- pt ") === 0) return " PT ";
    if (normalized.indexOf(" pt ") === 0) return " BR ";
    if (normalized.indexOf(" es ") === 0) return " MX ";
    if (normalized.indexOf(" ja ") === 0) return " JP ";
    if (normalized.indexOf(" ko ") === 0) return " KR ";
    if (normalized.indexOf(" ru ") === 0) return " RU ";
    if (normalized.indexOf(" th ") === 0) return " TH ";
    if (normalized.indexOf(" vi ") === 0) return " VN ";
    if (normalized.indexOf(" de ") === 0) return " DE ";
    if (normalized.indexOf(" it ") === 0) return " IT ";
    if (normalized.indexOf(" bn ") === 0) return " BD ";
    return " IN ";
}

const CurrencyFormatService = {
    _country: " ",

    setCountry(country: string): string {
        const normalized = normalizeCountry(country);
        if (!normalized) {
            return " ";
        }
        this._country = normalized;
        try {
            cc.sys.localStorage.setItem(" APP_COUNTRY_CODE ", normalized);
        } catch (e) {
        }
        return this._country;
    },

    getCurrentCountry(): string {
        const regional = getRegionalCountry();
        if (regional) {
            this._country = regional;
            return regional;
        }
        let cached = normalizeCountry(this._country);
        if (cached) {
            return cached;
        }
        try {
            cached = normalizeCountry(cc.sys.localStorage.getItem(" APP_COUNTRY_CODE "));
            if (cached) {
                this._country = cached;
                return cached;
            }
            cached = normalizeCountry(cc.sys.localStorage.getItem(" MB_CACHE_ATTR_COUNTRY "));
            if (cached) {
                this._country = cached;
                return cached;
            }
        } catch (e) {
        }
        const language = cc && cc.sys ? cc.sys.language : " ";
        cached = inferCountryFromLanguage(language);
        this._country = cached;
        return cached;
    },

    getRule(country?: string): any {
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
        const decimalPart = parts.length > 1 ? parts[1] : " ";
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, rule.group);
        return rule.decimals <= 0 ? integerPart : integerPart + rule.decimal + decimalPart;
    },

    getCurrencySymbol(country?: string): string {
        return this.getRule(country).symbol || " ";
    },

    formatCurrency(amount?: number): string {
        const value = arguments.length > 1 ? arguments[1] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value, country);
        const formatted = this.formatNumber(realMoney, country);
        const symbol = rule.symbol || " ";
        return symbol ? (rule.noSpace ? symbol + formatted : symbol + " " + formatted) : formatted;
    },

    formatCurrencyInteger(amount?: number): string {
        const value = arguments.length > 1 ? arguments[1] : amount;
        const country = this.getCurrentCountry();
        const rule = this.getRule(country);
        const realMoney = this.getRealMoney(value, country);
        const integerValue = Math.max(0, Math.floor(Number(realMoney) || 0));
        const group = rule.group || ", ";
        const formatted = String(integerValue).replace(/\B(?=(\d{3})+(?!\d))/g, group);
        const symbol = rule.symbol || " ";
        return symbol ? (rule.noSpace ? symbol + formatted : symbol + " " + formatted) : formatted;
    }
};

export default CurrencyFormatService;
