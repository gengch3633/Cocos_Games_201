import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nSprite extends cc.Component {
    @property({
        tooltip: " i18n key whose value is sprite path "
    })
    i18nKey: string = " ";

    @property({
        tooltip: " fallback sprite path when key missing or empty "
    })
    fallbackPath: string = " ";

    @property({
        tooltip: " bundle name for sprite loading "
    })
    bundleName: string = "ui";

    @property({
        type: cc.Sprite
    })
    targetSprite: cc.Sprite = null;

    private _requestVersion: number = 0;

    onLoad(): void {
        if (!this.targetSprite) {
            this.targetSprite = this.node.getComponent(cc.Sprite);
        }
        this._requestVersion = 0;
        this.bindLanguageEvent();
        this.refreshSprite();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshSprite();
    }

    setI18nKey(key: string, fallback?: string, bundle?: string): void {
        this.i18nKey = key || " ";
        if (fallback !== undefined) {
            this.fallbackPath = fallback || " ";
        }
        if (bundle !== undefined) {
            this.bundleName = bundle || "ui";
        }
        this.refreshSprite();
    }

    getSpritePath(): string {
        const key = String(this.i18nKey || " ").trim();
        if (!key) {
            return String(this.fallbackPath || " ").trim();
        }
        const translated = LanguageService.t(key, [], " ");
        return String(translated || " ").trim() || String(this.fallbackPath || " ").trim();
    }

    refreshSprite(): void {
        if (this.targetSprite && this.targetSprite.isValid) {
            const path = this.getSpritePath();
            if (path) {
                const requestVersion = ++this._requestVersion;
                ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then((spriteFrame) => {
                    if (requestVersion === this._requestVersion && this.targetSprite && this.targetSprite.isValid && spriteFrame) {
                        this.targetSprite.spriteFrame = spriteFrame;
                    }
                }).catch((error) => {
                    cc.warn("[I18nSprite] loadRes failed: ", path, this.bundleName, error);
                });
            }
        }
    }
}
