import { Default_Language, languages } from "./SystemConfig";
import GlobalDataMgr from "./GlobalDataMgr";
import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";

class LanguageUtil {
    private static _instance: LanguageUtil = null;

    updateSpriteFrameByPath(path: string, sprite: cc.Sprite = null, callback: (frame: cc.SpriteFrame) => void = null): void {
        cc.loader.loadRes(path, cc.SpriteFrame, (err, frame) => {
            if (err) {
                cc.error(err.message || err);
            } else if (frame instanceof cc.SpriteFrame) {
                sprite && cc.isValid(sprite) && (sprite.spriteFrame = frame);
                callback && callback(frame);
            }
        });
    }

    init(): void {
        let country = SdkHelper.getCurrentCountry();
        if (country == null || languages[String(country)] == null) {
            country = Default_Language;
        }
        GlobalDataMgr.setCurrentLang(country);
        SdkHelper.reportData("cocos_country_set", { country });
    }

    updateLabelByLang(label: cc.Label, key: string, params?: any): void {
        GlobalDataMgr.isSpecialFont();
        cc.isValid(label) && (label.string = (window as any).i18n.t(key, params));
    }

    loadLanguage(): void {
        if (languages[String(GlobalDataMgr.curLanguage)]) {
            EngineUtil.loadResourceAsset("config/language").then((asset) => {
                if (asset) {
                    const json = asset.json;
                    if (json) {
                        (window as any).i18n.languages[GlobalDataMgr.isUsingForeignResources()] = json[GlobalDataMgr.isUsingForeignResources()];
                        (window as any).i18n.init(GlobalDataMgr.isUsingForeignResources());
                    }
                }
            }).catch((err) => {
                console.log("err====", err);
            });
        }
    }

    isDynamicUpdate(): boolean {
        return GlobalDataMgr.i18nEdition();
    }

    updateSpriteByLang(node: cc.Node, name: string): void {
        if (cc.isValid(node)) {
            const path = "i18n/" + GlobalDataMgr.isUsingForeignResources() + "/" + name;
            cc.loader.loadRes(path, cc.SpriteFrame, (err, frame) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (frame instanceof cc.SpriteFrame && node && node.getComponent(cc.Sprite)) {
                    node.getComponent(cc.Sprite).spriteFrame = frame;
                }
            });
        }
    }

    static getInstance(): LanguageUtil {
        if (!this._instance) {
            this._instance = new LanguageUtil();
        }
        return this._instance;
    }
}

export default LanguageUtil.getInstance();
