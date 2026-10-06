import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import * as LanguageService from "./LanguageService";
import ResMgr from "./ResMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nSprite extends cc.Component {
    @property({
        tooltip: "i18n key whose value is sprite path",
    })
    i18nKey = "";

    @property({
        tooltip: "fallback sprite path when key missing or empty",
    })
    fallbackPath = "";

    @property({
        tooltip: "bundle name for sprite loading",
    })
    bundleName = "ui";

    @property(cc.Sprite)
    targetSprite: cc.Sprite | null = null;

    _requestVersion = 0;

    onLoad(): void {
        this.targetSprite = this.targetSprite || this.node.getComponent(cc.Sprite);
        this._requestVersion = 0;
        this.bindLanguageEvent();
        this.refreshSprite();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshSprite();
    }

    setI18nKey(key: string, fallbackPath?: string, bundleName?: string): void {
        this.i18nKey = key || "";
        if (fallbackPath !== undefined) {
            this.fallbackPath = fallbackPath || "";
        }
        if (bundleName !== undefined) {
            this.bundleName = bundleName || "ui";
        }
        this.refreshSprite();
    }

    getSpritePath(): string {
        const key = String(this.i18nKey || "").trim();
        if (!key) {
            return String(this.fallbackPath || "").trim();
        }
        const translated = LanguageService.t(key, [], "");
        return String(translated || "").trim() || String(this.fallbackPath || "").trim();
    }

    refreshSprite(): void {
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
            .then((spriteFrame) => {
                if (requestVersion === this._requestVersion && this.targetSprite && this.targetSprite.isValid && spriteFrame) {
                    this.targetSprite.spriteFrame = spriteFrame;
                }
            })
            .catch((error) => {
                cc.warn("[I18nSprite] loadRes failed:", path, this.bundleName, error);
            });
    }
}
