import EngineUtil from "./EngineUtil";
import GlobalDataMgr from "./GlobalDataMgr";
import SdkHelper from "./SdkHelper";
import { Default_Language, languages } from "./SystemConfig";

declare const i18n: any;

class languageUtil {
    updateSpriteFrameByPath(e, t, o) {
        if (undefined === t) {
            t = null;
        }
        if (undefined === o) {
            o = null;
        }
        cc.loader.loadRes(e, cc.SpriteFrame, function (err, n) {
            if (err) {
                cc.error(err.message || err);
            } else if (n instanceof cc.SpriteFrame) {
                if (t && cc.isValid(t)) {
                    t.spriteFrame = n;
                }
                if (o) {
                    o(n);
                }
            }
        });
    }

    init() {
        let e = SdkHelper.getCurrentCountry();
        if (!(null != e && null != languages[String(e)])) {
            e = Default_Language;
        }
        GlobalDataMgr.setCurrentLang(e);
        SdkHelper.reportData("cocos_country_set", {
            country: e
        });
    }

    updateLabelByLang(e, t, o) {
        GlobalDataMgr.isSpecialFont();
        if (cc.isValid(e)) {
            e.string = i18n.t(t, o);
        }
    }

    loadLanguage() {
        if (languages[String(GlobalDataMgr.curLanguage)]) {
            EngineUtil.loadResourceAsset("config/language").then(function (e) {
                if (e) {
                    const t = e.json;
                    if (t) {
                        (window as any).i18n.languages[GlobalDataMgr.isUsingForeignResources()] = t[GlobalDataMgr.isUsingForeignResources()];
                        i18n.init(GlobalDataMgr.isUsingForeignResources());
                    }
                }
            }).catch(function (e) {
                console.log("err====", e);
            });
        }
    }

    isDynamicUpdate() {
        return GlobalDataMgr.i18nEdition();
    }

    updateSpriteByLang(e, t) {
        if (cc.isValid(e)) {
            const path = "i18n/" + GlobalDataMgr.isUsingForeignResources() + "/" + t;
            cc.loader.loadRes(path, cc.SpriteFrame, function (err, frame) {
                if (err) {
                    cc.error(err.message || err);
                } else if (frame instanceof cc.SpriteFrame && e && e.getComponent(cc.Sprite)) {
                    e.getComponent(cc.Sprite).spriteFrame = frame;
                }
            });
        }
    }

    static getInstance() {
        this._instance || (this._instance = new languageUtil());
        return this._instance;
    }

    static _instance = null;
}

export default languageUtil.getInstance();
