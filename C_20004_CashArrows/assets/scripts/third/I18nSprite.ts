import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nSprite extends cc.Component {

    @property({ tooltip: "i18n key whose value is sprite path" })
    public i18nKey: string = "";

    @property({ tooltip: "fallback sprite path when key missing or empty" })
    public fallbackPath: string = "";

    @property({ tooltip: "bundle name for sprite loading" })
    public bundleName: string = "ui";

    @property({ type: cc.Sprite, tooltip: "target sprite to refresh" })
    public targetSprite: cc.Sprite = null;

    private _requestVersion: number = 0;

    protected onLoad(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.node.getComponent(cc.Sprite);
        }
        this._requestVersion = 0;
        this.bindLanguageEvent();
        this.refreshSprite();
    }

    protected onDestroy(): void {
        this.unbindLanguageEvent();
    }

    private bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private onLanguageChanged(): void {
        this.refreshSprite();
    }

    public setI18nKey(key: string, fallbackPath?: string, bundleName?: string): void {
        this.i18nKey = key || "";
        if (fallbackPath !== undefined) {
            this.fallbackPath = fallbackPath || "";
        }
        if (bundleName !== undefined) {
            this.bundleName = bundleName || "ui";
        }
        this.refreshSprite();
    }

    public getSpritePath(): string {
        const key = String(this.i18nKey || "").trim();
        if (!key) {
            return String(this.fallbackPath || "").trim();
        }
        const path = LanguageService.t(key, [], "");
        return String(path || "").trim() || String(this.fallbackPath || "").trim();
    }

    public refreshSprite(): void {
        if (!this.targetSprite || !this.targetSprite.isValid) {
            return;
        }
        const path = this.getSpritePath();
        if (!path) {
            return;
        }
        const requestVersion = ++this._requestVersion;
        ResMgr.getInstance()
            .loadRes(path, cc.SpriteFrame, this, this.bundleName)
            .then((spriteFrame: cc.SpriteFrame) => {
                if (requestVersion === this._requestVersion
                    && this.targetSprite
                    && this.targetSprite.isValid
                    && spriteFrame) {
                    this.targetSprite.spriteFrame = spriteFrame;
                }
            })
            .catch((err: any) => {
                cc.warn("[I18nSprite] loadRes failed:", path, this.bundleName, err);
            });
    }
}