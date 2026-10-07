import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CountrySprite extends cc.Component {
    @property({ tooltip: "single image name entry, e.g. money_mood_icon" })
    imageName = "";

    @property({ tooltip: "optional global asset rule key in CountryAssetService" })
    assetKey = "";

    @property({ tooltip: 'deprecated: JSON map, e.g. {"ID":"..."}' })
    pathMapText = "";

    @property({ tooltip: "force country code, empty means current country" })
    countryCode = "";

    @property({ tooltip: "fallback sprite path when map has no match" })
    fallbackPath = "";

    @property({ tooltip: "bundle name for sprite loading" })
    bundleName = "ui";

    @property
    refreshOnLoad = true;

    @property({ tooltip: "use this event as a general refresh trigger" })
    refreshOnLanguageChanged = true;

    @property({ type: cc.Sprite })
    targetSprite: cc.Sprite | null = null;

    _requestVersion = 0;
    _cachedMapText: string | null = null;
    _cachedMap: { [key: string]: string } = {};

    onLoad(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.node.getComponent(cc.Sprite);
        }
        this._requestVersion = 0;
        this._cachedMapText = null;
        this._cachedMap = {};
        this.bindLanguageEvent();
        if (this.refreshOnLoad) {
            this.refreshSprite();
        }
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    onValidate(): void {
        this.refreshSprite();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        if (this.refreshOnLanguageChanged) {
            this.refreshSprite();
        }
    }

    setCountryCode(country: string): void {
        this.countryCode = String(country || "").toUpperCase();
        this.refreshSprite();
    }

    refreshSprite(): void {
        if (this.targetSprite && this.targetSprite.isValid) {
            if (typeof this._requestVersion !== "number" || isNaN(this._requestVersion)) {
                this._requestVersion = 0;
            }
            const path = this.getSpritePath();
            if (path) {
                const version = ++this._requestVersion;
                const fallback = this.getDefaultSpritePath();
                this.loadSpriteWithFallback(path, fallback, version);
            }
        }
    }

    getSpritePath(): string {
        const country = this.getTargetCountry();
        const imagePath = this.getImageNamePath(country);
        if (imagePath) {
            return imagePath;
        }
        const ruleMap = this.getRuleMap();
        return CountryAssetService.resolvePath(ruleMap, country, this.fallbackPath) ||
            (this.assetKey
                ? CountryAssetService.getAssetPath(this.assetKey, country, this.fallbackPath)
                : String(this.fallbackPath || "").trim());
    }

    getTargetCountry(): string {
        return CountryAssetService.normalizeCountry(this.countryCode) || CountryAssetService.getCurrentCountry();
    }

    getRuleMap(): { [key: string]: string } {
        const text = String(this.pathMapText || "").trim();
        if (!text) {
            return {};
        }
        if (text === this._cachedMapText && this._cachedMap) {
            return this._cachedMap;
        }
        this._cachedMapText = text;
        this._cachedMap = CountryAssetService.parseRuleMapText(text);
        return this._cachedMap;
    }

    getImageNamePath(country: string): string {
        const name = String(this.imageName || "").trim();
        return name ? CountryAssetService.getPathByImageName(name, country) : "";
    }

    getDefaultSpritePath(): string {
        const name = String(this.imageName || "").trim();
        if (name) {
            return CountryAssetService.getPathByImageName(name, "ID");
        }
        const fallback = String(this.fallbackPath || "").trim();
        return fallback ? CountryAssetService.resolvePath({}, "ID", fallback) : "";
    }

    loadSpriteWithFallback(path: string, fallback: string, version: number): void {
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then((frame) => {
            if (version === this._requestVersion && this.targetSprite && this.targetSprite.isValid && frame) {
                this.targetSprite.spriteFrame = frame;
            }
        }).catch((error) => {
            if (fallback && fallback !== path) {
                this.loadFallbackSprite(fallback, version, error);
            } else {
                cc.warn("[CountrySprite] loadRes failed:", path, this.bundleName, error);
            }
        });
    }

    loadFallbackSprite(path: string, version: number, originalError?: any): void {
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then((frame) => {
            if (version === this._requestVersion && this.targetSprite && this.targetSprite.isValid && frame) {
                this.targetSprite.spriteFrame = frame;
            }
        }).catch((error) => {
            cc.warn("[CountrySprite] loadRes failed:", path, this.bundleName, originalError || error);
        });
    }
}
