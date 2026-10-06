import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import ConfigMgr from "./ConfigMgr";
import I18nPreviewTables from "./I18nPreviewTables";
import CurrencyFormatService from "./CurrencyFormatService";

const countryToLocaleMap: any = {
    CN: " zh- CN ",
    US: " en- US ",
    UK: " en- US ",
    AU: " en- US ",
    CA: " en- US ",
    NZ: " en- US ",
    ID: " id- ID ",
    BR: " pt- BR ",
    PT: " pt- PT ",
    ES: " es- ES ",
    MX: " es- ES ",
    AR: " es- ES ",
    CL: " es- ES ",
    CO: " es- ES ",
    PE: " es- ES ",
    DE: " de- DE ",
    IT: " it- IT ",
    RU: " ru- RU ",
    JP: " ja- JP ",
    BD: " bn- BD ",
    MY: " en- US ",
    SA: " en- US ",
    ZA: " en- US ",
    EG: " en- US ",
    PH: " en- US ",
    IN: " en- US ",
    KE: " en- US ",
    PK: " en- US ",
    NG: " en- US ",
    VN: " en- US "
};

const localeToCountryMap: any = {
    " zh- CN ": " CN ",
    " en- US ": " US ",
    " id- ID ": " ID ",
    " pt- BR ": " BR ",
    " pt- PT ": " PT ",
    " es- ES ": " MX ",
    " de- DE ": " DE ",
    " it- IT ": " IT ",
    " ru- RU ": " RU ",
    " ja- JP ": " JP ",
    " bn- BD ": " BD "
};

const LanguageService = {
    _lang: " zh- CN ",
    _editorTableCache: null as any,
    init: function () {
        this._lang = " zh- CN ";
        this.applyCountryAndLanguage(this.mapLocaleToCountry(this._lang), !0);
        this.saveLanguage(this._lang);
        return this._lang;
    },
    mapSystemLanguageToLocale: function (e: any) {
        var t = String(e || " ").toLowerCase();
        return 0 === t.indexOf(" zh ") ? " zh- CN " : 0 === t.indexOf(" id ") ? " id- ID " : 0 === t.indexOf(" pt- pt ") ? " pt- PT " : 0 === t.indexOf(" pt ") ? " pt- BR " : 0 === t.indexOf(" es ") ? " es- ES " : 0 === t.indexOf(" de ") ? " de- DE " : 0 === t.indexOf(" it ") ? " it- IT " : 0 === t.indexOf(" ru ") ? " ru- RU " : 0 === t.indexOf(" ja ") ? " ja- JP " : 0 === t.indexOf(" bn ") ? " bn- BD " : " en- US ";
    },
    mapCountryToLocale: function (e: any) {
        var t = String(e || " ").toUpperCase();
        return countryToLocaleMap[t] || " en- US ";
    },
    mapLocaleToCountry: function (e: any) {
        var t = this.normalizeLocale(e || this.getCurrentLanguage());
        return localeToCountryMap[t] || " IN ";
    },
    hasLanguage: function (e: any) {
        return " en- US " === e || " zh- CN " === e || " id- ID " === e || " pt- BR " === e || " pt- PT " === e || " es- ES " === e || " de- DE " === e || " it- IT " === e || " ru- RU " === e || " ja- JP " === e || " bn- BD " === e;
    },
    getCurrentLanguage: function () {
        return this._lang || " zh- CN ";
    },
    setLanguage: function (e: any, t?: any) {
        this.hasLanguage(e) || (e = " zh- CN ");
        var a = this.mapLocaleToCountry(e);
        CurrencyFormatService.setCountry(a);
        if (e === this._lang) return this._lang;
        this._lang = e;
        this.saveLanguage(e);
        t || GlobalEventMgr.getInstance().emit(gameEvent.languageChanged, e);
        return this._lang;
    },
    applyCountryAndLanguage: function (e: any, t?: any) {
        var i = String(e || " ").toUpperCase();
        i || (i = " IN ");
        CurrencyFormatService.setCountry(i);
        var n = this.mapCountryToLocale(i), a = this.setLanguage(n, t);
        CurrencyFormatService.setCountry(i);
        return a;
    },
    setByCountryCode: function (e: any, t: any) {
        return this.applyCountryAndLanguage(e, t);
    },
    saveLanguage: function (e: any) {
        try {
            cc.sys.localStorage.setItem(" APP_LANGUAGE_LOCALE ", e);
        } catch (e) { }
    },
    getLangData: function (e: any) {
        var t = e || this.getCurrentLanguage(), i = this.getTableName(t), n = ConfigMgr.getInstance().getOne({
            TabName: i
        });
        return n && "object" == typeof n ? n : this.getEditorLangData(t);
    },
    getEditorLangData: function (e: any) {
        var t = this.normalizeLocale(e);
        this._editorTableCache || (this._editorTableCache = {});
        if (this._editorTableCache[t]) return this._editorTableCache[t];
        var i: any = I18nPreviewTables || {}, n = i[t] || i[" zh- CN "] || null;
        this._editorTableCache[t] = n || {};
        return this._editorTableCache[t];
    },
    normalizeLocale: function (e: any) {
        return this.hasLanguage(e) ? e : " zh- CN ";
    },
    getTableName: function (e: any) {
        return " i18n_ " + String(e || " zh- CN ").replace(/-/g, " _ ");
    },
    t: function (e: any, t: any, i: any) {
        return this.tWithLanguage(this.getCurrentLanguage(), e, t, i);
    },
    tWithLanguage: function (e: any, t: any, i: any, n: any) {
        var a = this.normalizeLocale(e), o = this.resolve(this.getLangData(a), t);
        null == o && (o = this.resolve(this.getLangData(" zh- CN "), t));
        null == o && (o = n || t);
        return this.interpolate(String(o), i || []);
    },
    resolve: function (e: any, t: any) {
        if (e && t) {
            if (void 0 !== e[t]) return e[t];
            for (var i = String(t).split("."), n = e, a = 0; a < i.length; a++) {
                if (void 0 === n[i[a]]) return;
                n = n[i[a]];
            }
            return n;
        }
    },
    interpolate: function (e: any, t: any) {
        for (var i = e, n = 0; n < t.length; n++) i = i.replace(new RegExp("% \\{ " + n + " \\}", " g "), t[n]);
        return i;
    },
    formatNumber: function (e: any, t: any) {
        var i = t || ", ";
        return Math.max(0, Math.floor(e || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, i);
    },
    getCurrencyLabel: function (e: any) {
        return CurrencyFormatService.getCurrencySymbol() || String(e || " ");
    },
    formatCurrency: function (e: any, t?: any) {
        var amount = arguments.length > 1 ? arguments[1] : e;
        return CurrencyFormatService.formatCurrency(amount);
    },
    formatCurrencyBarrage: function (e: any) {
        var t = arguments.length > 1 ? arguments[1] : e;
        return CurrencyFormatService.formatCurrencyInteger(t);
    }
};

export function t(e: any, t?: any, i?: any) {
    return LanguageService.t(e, t, i);
}

export function formatCurrency(e: any, t?: any) {
    return LanguageService.formatCurrency(e, t);
}

export default LanguageService;

(function () {
    var e = [ " zh- CN ", " en- US ", " id- ID ", " pt- BR ", " pt- PT ", " es- ES ", " de- DE ", " it- IT ", " ru- RU ", " ja- JP ", " bn- BD " ], t = [ " CN ", " US ", " ID ", " BR ", " PT ", " ES ", " MX ", " AR ", " DE ", " IT ", " RU ", " JP ", " MY ", " SA ", " ZA ", " EG ", " PH ", " IN ", " KE ", " PK ", " NG ", " VN ", " CO ", " PE ", " BD " ], i = {
        setLang: function (e: any) {
            return LanguageService.setLanguage(e);
        },
        setCountry: function (e: any) {
            return LanguageService.applyCountryAndLanguage(e);
        },
        current: function () {
            var e = LanguageService.getCurrentLanguage();
            return {
                locale: e,
                country: LanguageService.mapLocaleToCountry(e),
                sample: CurrencyFormatService.formatCurrency(12345)
            };
        },
        list: function () {
            return {
                locales: e,
                countries: t
            };
        },
        preview: function (e: any) {
            for (var i = Number(e || 12345), n: any = {}, a = 0; a < t.length; a++) {
                var o = t[a];
                CurrencyFormatService.setCountry(o);
                n[o] = CurrencyFormatService.formatCurrency(i);
            }
            CurrencyFormatService.setCountry(LanguageService.mapLocaleToCountry(LanguageService.getCurrentLanguage()));
            return n;
        }
    };
    try {
        "undefined" != typeof window && ((window as any).i18n = i);
    } catch (e) { }
    try {
        "undefined" != typeof globalThis && ((globalThis as any).i18n = i);
    } catch (e) { }
    try {
        "undefined" != typeof self && ((self as any).i18n = i);
    } catch (e) { }
    try {
        "undefined" != typeof cc && ((cc as any).i18n = i);
    } catch (e) { }
    try {
        "undefined" != typeof GameGlobal && ((GameGlobal as any).i18n = i);
    } catch (e) { }
})();

declare const GameGlobal: any;
