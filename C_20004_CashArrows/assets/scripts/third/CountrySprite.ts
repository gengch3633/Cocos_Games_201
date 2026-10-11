import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CountrySprite extends cc.Component {
    @property({ tooltip: "single image name entry, e.g. money_mood_icon" })
    public imageName: string = "";

    @property({ tooltip: "optional global asset rule key in CountryAssetService" })
    public assetKey: string = "";

    @property({ tooltip: 'deprecated: JSON map, e.g. {"ID":"..."}' })
    public pathMapText: string = "";

    @property({ tooltip: "force country code, empty means current country" })
    public countryCode: string = "";

    @property({ tooltip: "fallback sprite path when map has no match" })
    public fallbackPath: string = "";

    @property({ tooltip: "bundle name for sprite loading" })
    public bundleName: string = "ui";

    @property
    public refreshOnLoad: boolean = true;

    @property({ tooltip: "use this event as a general refresh trigger" })
    public refreshOnLanguageChanged: boolean = true;

    @property(cc.Sprite)
    public targetSprite: cc.Sprite = null;

    private _requestVersion: number = 0;
    private _cachedMapText: string = null;
    private _cachedMap: { [key: string]: string } = {};

    protected onLoad(): void {
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

    protected onDestroy(): void {
        this.unbindLanguageEvent();
    }

    protected onValidate(): void {
        this.refreshSprite();
    }

    private bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private onLanguageChanged(): void {
        if (this.refreshOnLanguageChanged) {
            this.refreshSprite();
        }
    }

    public setCountryCode(code: string): void {
        this.countryCode = String(code || "").toUpperCase();
        this.refreshSprite();
    }

    public refreshSprite(): void {
        if (this.targetSprite && this.targetSprite.isValid) {
            if ("number" != typeof this._requestVersion || isNaN(this._requestVersion)) {
                this._requestVersion = 0;
            }
            const path = this.getSpritePath();
            if (path) {
                const version = ++this._requestVersion;
                const defaultPath = this.getDefaultSpritePath();
                this.loadSpriteWithFallback(path, defaultPath, version);
            }
        }
    }

    private getSpritePath(): string {
        const country = this.getTargetCountry();
        const imagePath = this.getImageNamePath(country);
        if (imagePath) {
            return imagePath;
        }
        const ruleMap = this.getRuleMap();
        return CountryAssetService.resolvePath(ruleMap, country, this.fallbackPath) || (this.assetKey ? CountryAssetService.getAssetPath(this.assetKey, country, this.fallbackPath) : String(this.fallbackPath || "").trim());
    }

    private getTargetCountry(): string {
        return CountryAssetService.normalizeCountry(this.countryCode) || CountryAssetService.getCurrentCountry();
    }

    private getRuleMap(): { [key: string]: string } {
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

    private getImageNamePath(country: string): string {
        const name = String(this.imageName || "").trim();
        return name ? CountryAssetService.getPathByImageName(name, country) : "";
    }

    private getDefaultSpritePath(): string {
        const name = String(this.imageName || "").trim();
        if (name) {
            return CountryAssetService.getPathByImageName(name, "ID");
        }
        const fallback = String(this.fallbackPath || "").trim();
        return fallback ? CountryAssetService.resolvePath({}, "ID", fallback) : "";
    }

    private loadSpriteWithFallback(path: string, fallbackPath: string, version: number): void {
        const self = this;
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then(function (spriteFrame: cc.SpriteFrame) {
            if (version === self._requestVersion && self.targetSprite && self.targetSprite.isValid && spriteFrame) {
                self.targetSprite.spriteFrame = spriteFrame;
            }
        }).catch(function (err: any) {
            if (fallbackPath && fallbackPath !== path) {
                self.loadFallbackSprite(fallbackPath, version, err);
            } else {
                cc.warn("[CountrySprite] loadRes failed:", path, self.bundleName, err);
            }
        });
    }

    private loadFallbackSprite(path: string, version: number, originalError: any): void {
        const self = this;
        ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then(function (spriteFrame: cc.SpriteFrame) {
            if (version === self._requestVersion && self.targetSprite && self.targetSprite.isValid && spriteFrame) {
                self.targetSprite.spriteFrame = spriteFrame;
            }
        }).catch(function (err: any) {
            cc.warn("[CountrySprite] loadRes failed:", path, self.bundleName, originalError || err);
        });
    }
}