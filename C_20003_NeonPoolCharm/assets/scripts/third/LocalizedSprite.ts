import { SpriteFrameSet } from "./SpriteFrameSet";

const { ccclass, executeInEditMode, inspector, menu, property } = cc._decorator;

@ccclass
@executeInEditMode()
@inspector("packages://i18n/inspector/localized-sprite.js")
@menu("i18n/LocalizedSprite")
export default class LocalizedSprite extends cc.Component {
    @property({
        type: SpriteFrameSet
    })
    spriteFrameSet = [];

    sprite = null;

    updateSprite(e) {
        if (this.sprite) {
            let t = this.getSpriteFrameByLang(e);
            !t && this.spriteFrameSet[0] && (t = this.spriteFrameSet[0].spriteFrame);
            this.sprite.spriteFrame = t;
        } else cc.error("Failed to update localized sprite, sprite component is invalid!");
    }

    getSpriteFrameByLang(e) {
        for (let t = 0; t < this.spriteFrameSet.length; ++t) if (this.spriteFrameSet[t].language === e) return this.spriteFrameSet[t].spriteFrame;
    }

    fetchRender() {
        const e = this.getComponent(cc.Sprite);
        if (e) {
            this.sprite = e;
            this.updateSprite((window as any).i18n.curLang);
        }
    }

    onLoad() {
        this.fetchRender();
    }
}
