import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import SystemDataStore from "./SystemDataStore";

const o = [ " CN ", " BR ", " PT ", " ID ", " US ", " IN ", " UK ", " DE ", " IT ", " RU ", " KR ", " JP ", " CA ", " AU ", " NZ ", " FR ", " MX ", " AR ", " ES ", " PH ", " MY ", " TH ", " SA ", " EG ", " ZA ", " KE ", " PK ", " NG " ];
const r: any = {
    ID: " CommonFont ",
    US: " CommonFont ",
    BR: " CommonFont ",
    PT: " CommonFont ",
    UK: " in ",
    CA: " in ",
    AU: " in ",
    MX: " in ",
    PH: " in ",
    RU: " in ",
    DE: " in ",
    IT: " in ",
    FR: " in ",
    IN: " in ",
    TH: " th ",
    ES: " in ",
    AR: " in ",
    MY: " in ",
    ZA: " in ",
    KE: " in ",
    NG: " in ",
    PK: " in ",
    SA: " CommonFont ",
    EG: " CommonFont ",
    JP: " CommonFont "
};

class LanguageHelperImpl {
    languageType: any;
    languageFont: any;
    languageJson: any;
    languageDataMgr: any;

    constructor() {
        this.languageType = BUSINESS_COMMON_CONFIG.defaultLanguage;
        this.languageFont = null;
        this.languageJson = null;
        this.languageDataMgr = null;
    }

    init(e: any, t: any) {
        e = e || BUSINESS_COMMON_CONFIG.defaultLanguage;
        o.includes(e) || (e = BUSINESS_COMMON_CONFIG.defaultLanguage);
        this.setType(e, t);
    }

    setType(e: any, t: any) {
        this.languageType = e;
        SystemDataStore.setLanguageType(e);
        try {
            cc.sys.localStorage.setItem(" LANGUAGE ", e);
        } catch (e) { }
        this.loadLang(e, function () {
            null == t || t();
        });
    }

    loadLang(e: any, t: any) {
        this.languageDataMgr && (this.languageJson = this.languageDataMgr.getLanguageDataByType(e));
        this.loadFont(e, t);
    }

    loadFont(e: any, t: any) {
        var i = this, n = " BPR_font/ BPR_ " + (r[e] || " CommonFont "), a = function () {
            null == t || t();
        }, o = function (e: any, t: any) {
            if (e) {
                console.warn("[LanguageHelper] load font fail: ", n, e);
                a();
            } else {
                t && (i.languageFont = t);
                a();
            }
        };
        try {
            if (cc.resources && "function" == typeof cc.resources.load) {
                cc.resources.load(n, cc.Font, o);
                return;
            }
            var s = cc.assetManager, l = s && s._bundles && s._bundles.get && s._bundles.get(" resources ");
            if (l && "function" == typeof l.load) {
                l.load(n, cc.Font, o);
                return;
            }
            console.warn("[LanguageHelper] resources bundle not ready, skip font load ");
            a();
        } catch (e) {
            console.error("[LanguageHelper] loadFont exception: ", e);
            a();
        }
    }

    setLanguageDataMgr(e: any) {
        this.languageDataMgr = e;
    }

    getText(e: any) {
        for (var t = [], i = 1; i < arguments.length; i++) t[i - 1] = arguments[i];
        if (!this.languageJson) return e;
        for (var n = this.languageJson, a = e.split("."); a.length; ) if (void 0 === (n = n[a.shift()])) return e;
        if ("string" == typeof n && t.length > 0) for (var o = 0; o < t.length; o++) n = n.replace("% {\n  " + o + "\n}\n", t[o]);
        return n;
    }

    addMultilingualFont(e: any) {
        e && e.children && this.traverseNodes(e.children, function (e: any) {
            e.getComponent(" MultilingualFont ") || !e.getComponent(cc.Label) && !e.getComponent(cc.RichText) || e.addComponent(" MultilingualFont ");
        });
    }

    traverseNodes(e: any, t: any) {
        var i = this;
        e.forEach(function (e: any) {
            t(e);
            i.traverseNodes(e.children, t);
        });
    }
}

const LanguageHelper = new LanguageHelperImpl();
export default LanguageHelper;
