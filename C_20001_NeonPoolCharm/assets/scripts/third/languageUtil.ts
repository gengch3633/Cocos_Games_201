import { Default_Language, languages } from "./SystemConfig";
import GlobalDataMgr from "./GlobalDataMgr";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";

declare const i18n: {
    init(lang: string): void;
    languages: Record<string, Record<string, string>>;
};

class languageUtil {
    private static _instance: languageUtil = null;

    static getInstance(): languageUtil {
        if (!languageUtil._instance) {
            languageUtil._instance = new languageUtil();
        }
        return languageUtil._instance;
    }

    updateSpriteFrameByPath(
        path: string,
        sprite: cc.Sprite = null,
        callback: ((frame: cc.SpriteFrame) => void) = null
    ): void {
        cc.loader.loadRes(path, cc.SpriteFrame, (err, frame: cc.SpriteFrame) => {
            if (err) {
                cc.error(err.message || err);
            } else if (frame instanceof cc.SpriteFrame) {
                if (sprite && cc.isValid(sprite)) {
                    sprite.spriteFrame = frame;
                }
                if (callback) {
                    callback(frame);
                }
            }
        });
    }

    init(): void {
        let country = SdkHelper.getCurrentCountry();
        if (country == null || languages[String(country)] == null) {
            country = Default_Language;
        }
        GlobalDataMgr.setCurrentLang(country);
        SdkHelper.reportData("cocos_country_set", {
            country,
        });
    }

    updateLabelByLang(label: cc.Label, key: string, options?: Record<string, unknown>): void {
        GlobalDataMgr.isSpecialFont();
        if (cc.isValid(label)) {
            label.string = i18n.t(key, options);
        }
    }

    loadLanguage(): void {
        if (languages[String(GlobalDataMgr.curLanguage)]) {
            EngineUtil.loadResourceAsset("config/language")
                .then((asset: cc.JsonAsset) => {
                    if (asset) {
                        const json = asset.json;
                        if (json) {
                            window.i18n.languages[GlobalDataMgr.isUsingForeignResources()] =
                                json[GlobalDataMgr.isUsingForeignResources()];
                            i18n.init(GlobalDataMgr.isUsingForeignResources());
                        }
                    }
                })
                .catch((err) => {
                    console.log("err====", err);
                });
        }
    }

    isDynamicUpdate(): boolean {
        return GlobalDataMgr.i18nEdition();
    }

    updateSpriteByLang(node: cc.Node, path: string): void {
        if (cc.isValid(node)) {
            const resPath = "i18n/" + GlobalDataMgr.isUsingForeignResources() + "/" + path;
            cc.loader.loadRes(resPath, cc.SpriteFrame, (err, frame: cc.SpriteFrame) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (frame instanceof cc.SpriteFrame && node && node.getComponent(cc.Sprite)) {
                    node.getComponent(cc.Sprite).spriteFrame = frame;
                }
            });
        }
    }
}

export default languageUtil.getInstance();
