const { ccclass, property } = cc._decorator;

import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import ResMgr from "./ResMgr";
import CountryAssetService from "./CountryAssetService";

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

    _requestVersion: any;
    _cachedMapText: any;
    _cachedMap: any;

    onLoad() {
        this.targetSprite || (this.targetSprite = this.node.getComponent(cc.Sprite));
        this._requestVersion = 0;
        this._cachedMapText = null;
        this._cachedMap = {};
        this.bindLanguageEvent();
        this.refreshOnLoad && this.refreshSprite();
    }

    onDestroy() {
        this.unbindLanguageEvent();
    }

    onValidate() {
        this.refreshSprite();
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged() {
        this.refreshOnLanguageChanged && this.refreshSprite();
    }

    setCountryCode(e: any) {
        this.countryCode = String(e || " ").toUpperCase();
        this.refreshSprite();
    }

    refreshSprite() {
        if (this.targetSprite && this.targetSprite.isValid) {
            (" number " != typeof this._requestVersion || isNaN(this._requestVersion)) && (this._requestVersion = 0);
            var e = this.getSpritePath();
            if (e) {
                var t = ++this._requestVersion, i = this.getDefaultSpritePath();
                this.loadSpriteWithFallback(e, i, t);
            }
        }
    }

    getSpritePath() {
        var e = this.getTargetCountry(), t = this.getImageNamePath(e);
        if (t) return t;
        var i = this.getRuleMap();
        return CountryAssetService.resolvePath(i, e, this.fallbackPath) || (this.assetKey ? CountryAssetService.getAssetPath(this.assetKey, e, this.fallbackPath) : String(this.fallbackPath || " ").trim());
    }

    getTargetCountry() {
        return CountryAssetService.normalizeCountry(this.countryCode) || CountryAssetService.getCurrentCountry();
    }

    getRuleMap() {
        var e = String(this.pathMapText || " ").trim();
        if (!e) return {};
        if (e === this._cachedMapText && this._cachedMap) return this._cachedMap;
        this._cachedMapText = e;
        this._cachedMap = CountryAssetService.parseRuleMapText(e);
        return this._cachedMap;
    }

    getImageNamePath(e: any) {
        var t = String(this.imageName || " ").trim();
        return t ? CountryAssetService.getPathByImageName(t, e) : " ";
    }

    getDefaultSpritePath() {
        var e = String(this.imageName || " ").trim();
        if (e) return CountryAssetService.getPathByImageName(e, " ID ");
        var t = String(this.fallbackPath || " ").trim();
        return t ? CountryAssetService.resolvePath({}, " ID ", t) : " ";
    }

    loadSpriteWithFallback(e: any, t: any, i: any) {
        var n = this;
        ResMgr.getInstance().loadRes(e, cc.SpriteFrame, this, this.bundleName).then(function(frame: any) {
            i === n._requestVersion && n.targetSprite && n.targetSprite.isValid && frame && (n.targetSprite.spriteFrame = frame);
        }).catch(function(a: any) {
            t && t !== e ? n.loadFallbackSprite(t, i, a) : cc.warn("[CountrySprite] loadRes failed: ", e, n.bundleName, a);
        });
    }

    loadFallbackSprite(e: any, t: any, i: any) {
        var n = this;
        ResMgr.getInstance().loadRes(e, cc.SpriteFrame, this, this.bundleName).then(function(frame: any) {
            t === n._requestVersion && n.targetSprite && n.targetSprite.isValid && frame && (n.targetSprite.spriteFrame = frame);
        }).catch(function(err: any) {
            cc.warn("[CountrySprite] loadRes failed: ", e, n.bundleName, i || err);
        });
    }
}
