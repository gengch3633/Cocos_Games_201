import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import { t } from "./LanguageService";
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
    bundleName: string = " ui ";

    @property(cc.Sprite)
    targetSprite: cc.Sprite = null;

    _requestVersion: number;

    onLoad() {
        this.targetSprite || (this.targetSprite = this.node.getComponent(cc.Sprite));
        this._requestVersion = 0;
        this.bindLanguageEvent();
        this.refreshSprite();
    }

    onDestroy() {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged() {
        this.refreshSprite();
    }

    setI18nKey(e: any, fallback: any, bundle: any) {
        this.i18nKey = e || " ";
        void 0 !== fallback && (this.fallbackPath = fallback || " ");
        void 0 !== bundle && (this.bundleName = bundle || " ui ");
        this.refreshSprite();
    }

    getSpritePath() {
        var e = String(this.i18nKey || " ").trim();
        if (!e) return String(this.fallbackPath || " ").trim();
        var translated = t(e, [], " ");
        return String(translated || " ").trim() || String(this.fallbackPath || " ").trim();
    }

    refreshSprite() {
        var e = this;
        if (this.targetSprite && this.targetSprite.isValid) {
            var path = this.getSpritePath();
            if (path) {
                var version = ++this._requestVersion;
                ResMgr.getInstance().loadRes(path, cc.SpriteFrame, this, this.bundleName).then(function(frame: any) {
                    version === e._requestVersion && e.targetSprite && e.targetSprite.isValid && frame && (e.targetSprite.spriteFrame = frame);
                }).catch(function(err: any) {
                    cc.warn("[I18nSprite] loadRes failed: ", path, e.bundleName, err);
                });
            }
        }
    }
}
