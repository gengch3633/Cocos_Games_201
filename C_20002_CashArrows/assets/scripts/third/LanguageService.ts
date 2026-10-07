import ConfigMgr from "./ConfigMgr";
import CurrencyFormatService from "./CurrencyFormatService";
import GlobalEventMgr from "./GlobalEventMgr";
import I18nPreviewTables from "./I18nPreviewTables";
import InterfaceMgr from "./InterfaceMgr";

const COUNTRY_TO_LOCALE: { [key: string]: string } = {
    CN: "zh-CN",
    US: "en-US",
    UK: "en-US",
    AU: "en-US",
    CA: "en-US",
    NZ: "en-US",
    ID: "id-ID",
    BR: "pt-BR",
    PT: "pt-PT",
    ES: "es-ES",
    MX: "es-ES",
    AR: "es-ES",
    CL: "es-ES",
    CO: "es-ES",
    PE: "es-ES",
    DE: "de-DE",
    IT: "it-IT",
    RU: "ru-RU",
    JP: "ja-JP",
    BD: "bn-BD",
    MY: "en-US",
    SA: "en-US",
    ZA: "en-US",
    EG: "en-US",
    PH: "en-US",
    IN: "en-US",
    KE: "en-US",
    PK: "en-US",
    NG: "en-US",
    VN: "en-US"
};

const LOCALE_TO_COUNTRY: { [key: string]: string } = {
    "zh-CN": "CN",
    "en-US": "US",
    "id-ID": "ID",
    "pt-BR": "BR",
    "pt-PT": "PT",
    "es-ES": "MX",
    "de-DE": "DE",
    "it-IT": "IT",
    "ru-RU": "RU",
    "ja-JP": "JP",
    "bn-BD": "BD"
};

const LanguageService = {
    _lang: "zh-CN",
    _editorTableCache: null as { [key: string]: any },

    init(): string {
        this._lang = "zh-CN";
        this.applyCountryAndLanguage(this.mapLocaleToCountry(this._lang), true);
        this.saveLanguage(this._lang);
        return this._lang;
    },

    mapSystemLanguageToLocale(lang: string): string {
        const lower = String(lang || "").toLowerCase();
        if (lower.indexOf("zh") === 0) return "zh-CN";
        if (lower.indexOf("id") === 0) return "id-ID";
        if (lower.indexOf("pt-pt") === 0) return "pt-PT";
        if (lower.indexOf("pt") === 0) return "pt-BR";
        if (lower.indexOf("es") === 0) return "es-ES";
        if (lower.indexOf("de") === 0) return "de-DE";
        if (lower.indexOf("it") === 0) return "it-IT";
        if (lower.indexOf("ru") === 0) return "ru-RU";
        if (lower.indexOf("ja") === 0) return "ja-JP";
        if (lower.indexOf("bn") === 0) return "bn-BD";
        return "en-US";
    },

    mapCountryToLocale(country: string): string {
        const code = String(country || "").toUpperCase();
        return COUNTRY_TO_LOCALE[code] || "en-US";
    },

    mapLocaleToCountry(locale: string): string {
        const normalized = this.normalizeLocale(locale || this.getCurrentLanguage());
        return LOCALE_TO_COUNTRY[normalized] || "IN";
    },

    hasLanguage(locale: string): boolean {
        return locale === "en-US" || locale === "zh-CN" || locale === "id-ID"|| locale ==="pt-BR" || locale === "pt-PT" || locale === "es-ES"|| locale ==="de-DE" || locale === "it-IT" || locale === "ru-RU"|| locale ==="ja-JP" || locale === "bn-BD";
    },

    getCurrentLanguage(): string {
        return this._lang || "zh-CN";
    },

    setLanguage(locale: string, silent?: boolean): string {
        if (!this.hasLanguage(locale)) {
            locale = "zh-CN";
        }
        const country = this.mapLocaleToCountry(locale);
        CurrencyFormatService.setCountry(country);
        if (locale === this._lang) {
            return this._lang;
        }
        this._lang = locale;
        this.saveLanguage(locale);
        if (!silent) {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.languageChanged, locale);
        }
        return this._lang;
    },

    applyCountryAndLanguage(country: string, silent?: boolean): string {
        let code = String(country || "").toUpperCase();
        if (!code) {
            code = "IN";
        }
        CurrencyFormatService.setCountry(code);
        const locale = this.mapCountryToLocale(code);
        const result = this.setLanguage(locale, silent);
        CurrencyFormatService.setCountry(code);
        return result;
    },

    setByCountryCode(country: string, silent?: boolean): string {
        return this.applyCountryAndLanguage(country, silent);
    },

    saveLanguage(locale: string): void {
        try {
            cc.sys.localStorage.setItem("APP_LANGUAGE_LOCALE", locale);
        } catch (e) { }
    },

    getLangData(locale?: string): any {
        const lang = locale || this.getCurrentLanguage();
        const tableName = this.getTableName(lang);
        const data = ConfigMgr.getInstance().getOne({ TabName: tableName });
        if (data && typeof data === "object") {
            return data;
        }
        return this.getEditorLangData(lang);
    },

    getEditorLangData(locale: string): any {
        const normalized = this.normalizeLocale(locale);
        if (!this._editorTableCache) {
            this._editorTableCache = {};
        }
        if (this._editorTableCache[normalized]) {
            return this._editorTableCache[normalized];
        }
        const tables = (I18nPreviewTables as any).default || I18nPreviewTables || {};
        const data = tables[normalized] || tables["zh-CN"] || null;
        this._editorTableCache[normalized] = data || {};
        return this._editorTableCache[normalized];
    },

    normalizeLocale(locale: string): string {
        return this.hasLanguage(locale) ? locale : "zh-CN";
    },

    getTableName(locale: string): string {
        return "i18n_" + String(locale || "zh-CN").replace(/-/g, "_");
    },

    t(key: string, params?: any[], fallback?: string): string {
        return this.tWithLanguage(this.getCurrentLanguage(), key, params, fallback);
    },

    tWithLanguage(locale: string, key: string, params?: any[], fallback?: string): string {
        const normalized = this.normalizeLocale(locale);
        let value = this.resolve(this.getLangData(normalized), key);
        if (value == null) {
            value = this.resolve(this.getLangData("zh-CN"), key);
        }
        if (value == null) {
            value = fallback || key;
        }
        return this.interpolate(String(value), params || []);
    },

    resolve(data: any, key: string): any {
        if (data && key) {
            if (data[key] !== undefined) {
                return data[key];
            }
            const parts = String(key).split(".");
            let node = data;
            for (let i = 0; i < parts.length; i++) {
                if (node[parts[i]] === undefined) {
                    return undefined;
                }
                node = node[parts[i]];
            }
            return node;
        }
    },

    interpolate(text: string, params: any[]): string {
        let result = text;
        for (let i = 0; i < params.length; i++) {
            result = result.replace(new RegExp("%\\{" + i + "\\}", "g"), params[i]);
        }
        return result;
    },

    formatNumber(value: number, separator?: string): string {
        const sep = separator || ",";
        return Math.max(0, Math.floor(value || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    },

    getCurrencyLabel(fallback?: string): string {
        return CurrencyFormatService.getCurrencySymbol() || String(fallback || "");
    },

    formatCurrency(value?: number, amount?: number): string {
        const val = arguments.length > 1 ? amount : value;
        return CurrencyFormatService.formatCurrency(val);
    },

    formatCurrencyBarrage(value?: number, amount?: number): string {
        const val = arguments.length > 1 ? amount : value;
        return CurrencyFormatService.formatCurrencyInteger(val);
    }
};

export default LanguageService;

(function () {
    const locales = ["zh-CN", "en-US", "id-ID", "pt-BR", "pt-PT", "es-ES", "de-DE", "it-IT", "ru-RU", "ja-JP", "bn-BD"];
    const countries = ["CN", "US", "ID", "BR", "PT", "ES", "MX", "AR", "DE", "IT", "RU", "JP", "MY", "SA", "ZA", "EG", "PH", "IN", "KE", "PK", "NG", "VN", "CO", "PE", "BD"];
    const i18n = {
        setLang(locale: string) {
            return LanguageService.setLanguage(locale);
        },
        setCountry(country: string) {
            return LanguageService.applyCountryAndLanguage(country);
        },
        current() {
            const locale = LanguageService.getCurrentLanguage();
            return {
                locale,
                country: LanguageService.mapLocaleToCountry(locale),
                sample: CurrencyFormatService.formatCurrency(12345)
            };
        },
        list() {
            return { locales, countries };
        },
        preview(amount?: number) {
            const value = Number(amount || 12345);
            const result: { [key: string]: string } = {};
            for (let i = 0; i < countries.length; i++) {
                const country = countries[i];
                CurrencyFormatService.setCountry(country);
                result[country] = CurrencyFormatService.formatCurrency(value);
            }
            CurrencyFormatService.setCountry(LanguageService.mapLocaleToCountry(LanguageService.getCurrentLanguage()));
            return result;
        }
    };
    try {
        if (typeof window !== "undefined") {
            (window as any).i18n = i18n;
        }
    } catch (e) { }
    try {
        if (typeof globalThis !== "undefined") {
            (globalThis as any).i18n = i18n;
        }
    } catch (e) { }
    try {
        if (typeof self !== "undefined") {
            (self as any).i18n = i18n;
        }
    } catch (e) { }
    try {
        if (typeof cc !== "undefined") {
            (cc as any).i18n = i18n;
        }
    } catch (e) { }
    try {
        if (typeof (globalThis as any).GameGlobal !== "undefined") {
            (globalThis as any).GameGlobal.i18n = i18n;
        }
    } catch (e) { }
})();
