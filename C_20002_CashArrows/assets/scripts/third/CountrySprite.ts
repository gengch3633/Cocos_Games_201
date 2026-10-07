import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CountrySprite extends cc.Component {
    @property({
        tooltip: " single image name entry, e.g.money_mood_icon "
    })
    imageName: string = " ";

    @property({
        tooltip: " optional global asset rule key in CountryAssetService "
    })
    assetKey: string = " ";

    @property({
        tooltip: 'deprecated: JSON map, e.g. {" ID ":"..."}'
    })
    pathMapText: string = " ";

    @property({
        tooltip: " force country code, empty means current country "
    })
    countryCode: string = " ";

    @property({
        tooltip: " fallback sprite path when map has no match "
    })
    fallbackPath: string = " ";

    @property({
        tooltip: " bundle name for sprite loading "
    })
    bundleName: string = " ui ";

    @property
    refreshOnLoad: boolean = true;

    @property({
        tooltip: " use this event as a general refresh trigger "
    })
    refreshOnLanguageChanged: boolean = true;

    @property({
        type: cc.Sprite
    })
    targetSprite: cc.Sprite = null;

    private _requestVersion: number = 0;
    private _cachedMapText: string = null;
    private _cachedMap: { [key: string]: string } = {};

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
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        if (this.refreshOnLanguageChanged) {
            this.refreshSprite();
        }
    }

    setCountryCode(country: string): void {
        this.countryCode = String(country || " ").toUpperCase();
        this.refreshSprite();
    }

    refreshSprite(): void {
        if (this.targetSprite && this.targetSprite.isValid) {
            if (typeof this._requestVersion !== "number" || isNaN(this._requestVersion)) {
                this._requestVersion = 0;
            }
            const path = this.getSpritePath();
            if (path) {
                const requestVersion = ++this._requestVersion;
                const fallbackPath = this.getDefaultSpritePath();
                this.loadSpriteWithFallback(path, fallbackPath, requestVersion);
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
        return CountryAssetService.resolvePath(ruleMap, country, this.fallbackPath)
            || (this.assetKey ? CountryAssetService.getAssetPath(this.assetKey, country, this.fallbackPath) : String(this.fallbackPath || " ").trim());
    }

    getTargetCountry(): string {
        return CountryAssetService.normalizeCountry(this.countryCode) || CountryAssetService.getCurrentCountry();
    }

    getRuleMap(): { [key: string]: string } {
        const text = String(this.pathMapText || " ").trim();
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
        const name = String(this.imageName || " ").trim();
        return name ? CountryAssetService.getPathByImageName(name, country) : " ";
    }

    getDefaultSpritePath(): string {
        const name = String(this.imageName || " ").trim();
        if (name) {
            return CountryAssetService.getPathByImageName(name, " ID ");
        }
        const fallback = String(this.fallbackPath || " ").trim();
        return fallback ? CountryAssetService.resolvePath({}, " ID ", fallback) : " ";
    }

    loadSpriteWithFallback(path: string, fallbackPath: string, requestVersion: number): void {
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then((spriteFrame) => {
            if (requestVersion === this._requestVersion && this.targetSprite && this.targetSprite.isValid && spriteFrame) {
                this.targetSprite.spriteFrame = spriteFrame;
            }
        }).catch((error) => {
            if (fallbackPath && fallbackPath !== path) {
                this.loadFallbackSprite(fallbackPath, requestVersion, error);
            } else {
                cc.warn("[CountrySprite] loadRes failed: ", path, this.bundleName, error);
            }
        });
    }

    loadFallbackSprite(path: string, requestVersion: number, originalError?: any): void {
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then((spriteFrame) => {
            if (requestVersion === this._requestVersion && this.targetSprite && this.targetSprite.isValid && spriteFrame) {
                this.targetSprite.spriteFrame = spriteFrame;
            }
        }).catch((error) => {
            cc.warn("[CountrySprite] loadRes failed: ", path, this.bundleName, originalError || error);
        });
    }
}
