import ConfigMgr from "./ConfigMgr";
import CurrencyFormatService from "./CurrencyFormatService";
import GlobalEventMgr from "./GlobalEventMgr";
import I18nPreviewTables from "./I18nPreviewTables";
import InterfaceMgr from "./InterfaceMgr";

declare const GameGlobal: any;

const COUNTRY_TO_LOCALE: { [country: string]: string } = {
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

const LOCALE_TO_COUNTRY: { [locale: string]: string } = {
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

const SUPPORTED_LANGUAGES: string[] = [
    "zh-CN",
    "en-US",
    "id-ID",
    "pt-BR",
    "pt-PT",
    "es-ES",
    "de-DE",
    "it-IT",
    "ru-RU",
    "ja-JP",
    "bn-BD"
];

const SUPPORTED_COUNTRIES: string[] = [
    "CN", "US", "ID", "BR", "PT", "ES", "MX", "AR", "DE", "IT",
    "RU", "JP", "MY", "SA", "ZA", "EG", "PH", "IN", "KE", "PK",
    "NG", "VN", "CO", "PE", "BD"
];

interface I18nTool {
    setLang(lang: string): string;
    setCountry(country: string): string;
    current(): { locale: string; country: string; sample: string };
    list(): { locales: string[]; countries: string[] };
    preview(value?: number): { [country: string]: string };
}

class LanguageService {
    private _lang: string = "zh-CN";
    private _editorTableCache: { [locale: string]: any } | null = null;

    public init(): string {
        this._lang = "zh-CN";
        this.applyCountryAndLanguage(this.mapLocaleToCountry(this._lang), true);
        this.saveLanguage(this._lang);
        return this._lang;
    }

    public mapSystemLanguageToLocale(language: string): string {
        const lang = String(language || "").toLowerCase();
        if (lang.indexOf("zh") === 0) return "zh-CN";
        if (lang.indexOf("id") === 0) return "id-ID";
        if (lang.indexOf("pt-pt") === 0) return "pt-PT";
        if (lang.indexOf("pt") === 0) return "pt-BR";
        if (lang.indexOf("es") === 0) return "es-ES";
        if (lang.indexOf("de") === 0) return "de-DE";
        if (lang.indexOf("it") === 0) return "it-IT";
        if (lang.indexOf("ru") === 0) return "ru-RU";
        if (lang.indexOf("ja") === 0) return "ja-JP";
        if (lang.indexOf("bn") === 0) return "bn-BD";
        return "en-US";
    }

    public mapCountryToLocale(country: string): string {
        const code = String(country || "").toUpperCase();
        return COUNTRY_TO_LOCALE[code] || "en-US";
    }

    public mapLocaleToCountry(locale: string): string {
        const normalized = this.normalizeLocale(locale || this.getCurrentLanguage());
        return LOCALE_TO_COUNTRY[normalized] || "IN";
    }

    public hasLanguage(lang: string): boolean {
        return lang === "en-US"
            || lang === "zh-CN"
            || lang === "id-ID"
            || lang === "pt-BR"
            || lang === "pt-PT"
            || lang === "es-ES"
            || lang === "de-DE"
            || lang === "it-IT"
            || lang === "ru-RU"
            || lang === "ja-JP"
            || lang === "bn-BD";
    }

    public getCurrentLanguage(): string {
        return this._lang || "zh-CN";
    }

    public setLanguage(lang: string, silent?: boolean): string {
        if (!this.hasLanguage(lang)) {
            lang = "zh-CN";
        }
        const country = this.mapLocaleToCountry(lang);
        CurrencyFormatService.setCountry(country);
        if (lang === this._lang) {
            return this._lang;
        }
        this._lang = lang;
        this.saveLanguage(lang);
        if (!silent) {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.languageChanged, lang);
        }
        return this._lang;
    }

    public applyCountryAndLanguage(country: string, silent?: boolean): string {
        let code = String(country || "").toUpperCase();
        if (!code) {
            code = "IN";
        }
        CurrencyFormatService.setCountry(code);
        const locale = this.mapCountryToLocale(code);
        const result = this.setLanguage(locale, silent);
        CurrencyFormatService.setCountry(code);
        return result;
    }

    public setByCountryCode(country: string, silent?: boolean): string {
        return this.applyCountryAndLanguage(country, silent);
    }

    public saveLanguage(lang: string): void {
        try {
            cc.sys.localStorage.setItem("APP_LANGUAGE_LOCALE", lang);
        } catch (e) {
            // ignore storage failures
        }
    }

    public getLangData(locale?: string): any {
        const lang = locale || this.getCurrentLanguage();
        const tableName = this.getTableName(lang);
        const data = ConfigMgr.getInstance().getOne({ TabName: tableName });
        return data && typeof data === "object" ? data : this.getEditorLangData(lang);
    }

    public getEditorLangData(locale: string): any {
        const lang = this.normalizeLocale(locale);
        if (!this._editorTableCache) {
            this._editorTableCache = {};
        }
        if (this._editorTableCache[lang]) {
            return this._editorTableCache[lang];
        }
        const tables: any = I18nPreviewTables || {};
        const table = tables[lang] || tables["zh-CN"] || null;
        this._editorTableCache[lang] = table || {};
        return this._editorTableCache[lang];
    }

    public normalizeLocale(locale: string): string {
        return this.hasLanguage(locale) ? locale : "zh-CN";
    }

    public getTableName(locale: string): string {
        return "i18n_" + String(locale || "zh-CN").replace(/-/g, "_");
    }

    public t(key: string, params?: any[], fallback?: string): string {
        return this.tWithLanguage(this.getCurrentLanguage(), key, params, fallback);
    }

    public tWithLanguage(lang: string, key: string, params?: any[], fallback?: string): string {
        const locale = this.normalizeLocale(lang);
        let value = this.resolve(this.getLangData(locale), key);
        if (value == null) {
            value = this.resolve(this.getLangData("zh-CN"), key);
        }
        if (value == null) {
            value = fallback || key;
        }
        return this.interpolate(String(value), params || []);
    }

    public resolve(table: any, key: string): any {
        if (!table || !key) {
            return undefined;
        }
        if (table[key] !== undefined) {
            return table[key];
        }
        const segments = String(key).split(".");
        let current: any = table;
        for (let i = 0; i < segments.length; i++) {
            if (current[segments[i]] === undefined) {
                return undefined;
            }
            current = current[segments[i]];
        }
        return current;
    }

    public interpolate(text: string, params: any[]): string {
        let result = text;
        for (let i = 0; i < params.length; i++) {
            result = result.replace(new RegExp("%\\{" + i + "\\}", "g"), params[i]);
        }
        return result;
    }

    public formatNumber(value: number, separator?: string): string {
        const sep = separator || ",";
        return Math.max(0, Math.floor(value || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    }

    public getCurrencyLabel(currency?: string): string {
        return CurrencyFormatService.getCurrencySymbol() || String(currency || "");
    }

    public formatCurrency(amount: number, overrideAmount?: number): string {
        const target = overrideAmount !== undefined ? overrideAmount : amount;
        return CurrencyFormatService.formatCurrency(target);
    }

    public formatCurrencyBarrage(amount: number, overrideAmount?: number): string {
        const target = overrideAmount !== undefined ? overrideAmount : amount;
        return CurrencyFormatService.formatCurrencyInteger(target);
    }
}

const languageService = new LanguageService();

function createI18nTool(): I18nTool {
    return {
        setLang(lang: string): string {
            return languageService.setLanguage(lang);
        },
        setCountry(country: string): string {
            return languageService.applyCountryAndLanguage(country);
        },
        current(): { locale: string; country: string; sample: string } {
            const locale = languageService.getCurrentLanguage();
            return {
                locale,
                country: languageService.mapLocaleToCountry(locale),
                sample: CurrencyFormatService.formatCurrency(12345)
            };
        },
        list(): { locales: string[]; countries: string[] } {
            return {
                locales: SUPPORTED_LANGUAGES,
                countries: SUPPORTED_COUNTRIES
            };
        },
        preview(value?: number): { [country: string]: string } {
            const amount = Number(value || 12345);
            const result: { [country: string]: string } = {};
            for (let i = 0; i < SUPPORTED_COUNTRIES.length; i++) {
                const country = SUPPORTED_COUNTRIES[i];
                CurrencyFormatService.setCountry(country);
                result[country] = CurrencyFormatService.formatCurrency(amount);
            }
            CurrencyFormatService.setCountry(
                languageService.mapLocaleToCountry(languageService.getCurrentLanguage())
            );
            return result;
        }
    };
}

function exposeI18nToGlobal(target: any, tool: I18nTool): void {
    if (!target) {
        return;
    }
    try {
        target.i18n = tool;
    } catch (e) {
        // ignore
    }
}

const i18nTool = createI18nTool();

exposeI18nToGlobal(typeof window !== "undefined" ? window : undefined, i18nTool);
exposeI18nToGlobal(typeof globalThis !== "undefined" ? (globalThis as any) : undefined, i18nTool);
exposeI18nToGlobal(typeof self !== "undefined" ? self : undefined, i18nTool);
exposeI18nToGlobal(typeof cc !== "undefined" ? cc : undefined, i18nTool);
exposeI18nToGlobal(typeof GameGlobal !== "undefined" ? GameGlobal : undefined, i18nTool);

export default languageService;