import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import ConfigMgr from "./ConfigMgr";
import I18nPreviewTables from "./I18nPreviewTables";
import CurrencyFormatService from "./CurrencyFormatService";

const COUNTRY_TO_LOCALE: Record<string, string> = {
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
    VN: "en-US",
};

const LOCALE_TO_COUNTRY: Record<string, string> = {
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
    "bn-BD": "BD",
};

const LanguageService = {
    _lang: "zh-CN",
    _editorTableCache: null as Record<string, Record<string, unknown>> | null,

    init(): string {
        this._lang = "zh-CN";
        this.applyCountryAndLanguage(this.mapLocaleToCountry(this._lang), true);
        this.saveLanguage(this._lang);
        return this._lang;
    },

    mapSystemLanguageToLocale(language: string): string {
        const value = String(language || "").toLowerCase();
        if (value.indexOf("zh") === 0) return "zh-CN";
        if (value.indexOf("id") === 0) return "id-ID";
        if (value.indexOf("pt-pt") === 0) return "pt-PT";
        if (value.indexOf("pt") === 0) return "pt-BR";
        if (value.indexOf("es") === 0) return "es-ES";
        if (value.indexOf("de") === 0) return "de-DE";
        if (value.indexOf("it") === 0) return "it-IT";
        if (value.indexOf("ru") === 0) return "ru-RU";
        if (value.indexOf("ja") === 0) return "ja-JP";
        if (value.indexOf("bn") === 0) return "bn-BD";
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
        return (
            locale === "en-US" ||
            locale === "zh-CN" ||
            locale === "id-ID" ||
            locale === "pt-BR" ||
            locale === "pt-PT" ||
            locale === "es-ES" ||
            locale === "de-DE" ||
            locale === "it-IT" ||
            locale === "ru-RU" ||
            locale === "ja-JP" ||
            locale === "bn-BD"
        );
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
            GlobalEventMgr.getInstance().emit(gameEvent.languageChanged, locale);
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
        } catch {
            // ignore
        }
    },

    getLangData(locale?: string): Record<string, unknown> {
        const lang = locale || this.getCurrentLanguage();
        const tableName = this.getTableName(lang);
        const config = ConfigMgr.getInstance().getOne({
            TabName: tableName,
        });
        if (config && typeof config === "object") {
            return config as Record<string, unknown>;
        }
        return this.getEditorLangData(lang);
    },

    getEditorLangData(locale: string): Record<string, unknown> {
        const normalized = this.normalizeLocale(locale);
        if (!this._editorTableCache) {
            this._editorTableCache = {};
        }
        if (this._editorTableCache[normalized]) {
            return this._editorTableCache[normalized];
        }
        const tables = (I18nPreviewTables as Record<string, Record<string, unknown>>) || {};
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

    t(key: string, args?: unknown[], fallback?: string): string {
        return this.tWithLanguage(this.getCurrentLanguage(), key, args, fallback);
    },

    tWithLanguage(locale: string, key: string, args?: unknown[], fallback?: string): string {
        const normalized = this.normalizeLocale(locale);
        let value = this.resolve(this.getLangData(normalized), key);
        if (value == null) {
            value = this.resolve(this.getLangData("zh-CN"), key);
        }
        if (value == null) {
            value = fallback || key;
        }
        return this.interpolate(String(value), args || []);
    },

    resolve(data: Record<string, unknown> | null | undefined, key: string): unknown {
        if (!data || !key) {
            return undefined;
        }
        if (data[key] !== undefined) {
            return data[key];
        }
        const parts = String(key).split(".");
        let current: unknown = data;
        for (let i = 0; i < parts.length; i++) {
            if ((current as Record<string, unknown>)[parts[i]] === undefined) {
                return undefined;
            }
            current = (current as Record<string, unknown>)[parts[i]];
        }
        return current;
    },

    interpolate(text: string, args: unknown[]): string {
        let result = text;
        for (let i = 0; i < args.length; i++) {
            result = result.replace(new RegExp("%\\{" + i + "\\}", "g"), String(args[i]));
        }
        return result;
    },

    formatNumber(value: number, group?: string): string {
        const separator = group || ",";
        return Math.max(0, Math.floor(value || 0))
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    },

    getCurrencyLabel(amount?: unknown): string {
        return CurrencyFormatService.getCurrencySymbol() || String(amount || "");
    },

    formatCurrency(amount?: number, rawAmount?: number): string {
        const value = arguments.length > 1 ? rawAmount : amount;
        return CurrencyFormatService.formatCurrency(value);
    },

    formatCurrencyBarrage(amount?: number, rawAmount?: number): string {
        const value = arguments.length > 1 ? rawAmount : amount;
        return CurrencyFormatService.formatCurrencyInteger(value);
    },
};

export default LanguageService;

export function t(key: string, args?: unknown[], fallback?: string): string {
    return LanguageService.t(key, args, fallback);
}

export function init(): string {
    return LanguageService.init();
}

export function setLanguage(locale: string, silent?: boolean): string {
    return LanguageService.setLanguage(locale, silent);
}

export function getCurrentLanguage(): string {
    return LanguageService.getCurrentLanguage();
}

const SUPPORTED_LOCALES = ["zh-CN", "en-US", "id-ID", "pt-BR", "pt-PT", "es-ES", "de-DE", "it-IT", "ru-RU", "ja-JP", "bn-BD"];
const SUPPORTED_COUNTRIES = ["CN", "US", "ID", "BR", "PT", "ES", "MX", "AR", "DE", "IT", "RU", "JP", "MY", "SA", "ZA", "EG", "PH", "IN", "KE", "PK", "NG", "VN", "CO", "PE", "BD"];

const windowI18n = {
    setLang(locale: string): string {
        return LanguageService.setLanguage(locale);
    },
    setCountry(country: string): string {
        return LanguageService.applyCountryAndLanguage(country);
    },
    current(): { locale: string; country: string; sample: string } {
        const locale = LanguageService.getCurrentLanguage();
        return {
            locale,
            country: LanguageService.mapLocaleToCountry(locale),
            sample: CurrencyFormatService.formatCurrency(12345),
        };
    },
    list(): { locales: string[]; countries: string[] } {
        return {
            locales: SUPPORTED_LOCALES,
            countries: SUPPORTED_COUNTRIES,
        };
    },
    preview(amount?: number): Record<string, string> {
        const value = Number(amount || 12345);
        const result: Record<string, string> = {};
        for (let i = 0; i < SUPPORTED_COUNTRIES.length; i++) {
            const country = SUPPORTED_COUNTRIES[i];
            CurrencyFormatService.setCountry(country);
            result[country] = CurrencyFormatService.formatCurrency(value);
        }
        CurrencyFormatService.setCountry(LanguageService.mapLocaleToCountry(LanguageService.getCurrentLanguage()));
        return result;
    },
};

try {
    if (typeof window !== "undefined") {
        (window as Window & { i18n?: typeof windowI18n }).i18n = windowI18n;
    }
} catch {
    // ignore
}
try {
    if (typeof globalThis !== "undefined") {
        (globalThis as typeof globalThis & { i18n?: typeof windowI18n }).i18n = windowI18n;
    }
} catch {
    // ignore
}
try {
    if (typeof self !== "undefined") {
        (self as typeof self & { i18n?: typeof windowI18n }).i18n = windowI18n;
    }
} catch {
    // ignore
}
try {
    if (typeof cc !== "undefined") {
        (cc as typeof cc & { i18n?: typeof windowI18n }).i18n = windowI18n;
    }
} catch {
    // ignore
}
try {
    if (typeof GameGlobal !== "undefined") {
        (GameGlobal as { i18n?: typeof windowI18n }).i18n = windowI18n;
    }
} catch {
    // ignore
}
