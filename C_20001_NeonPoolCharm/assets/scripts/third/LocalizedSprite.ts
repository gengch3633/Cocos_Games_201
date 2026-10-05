import SpriteFrameSet from "./SpriteFrameSet";

const { ccclass, executeInEditMode, inspector, menu, property } = cc._decorator;

@ccclass
@executeInEditMode
@inspector("packages://i18n/inspector/localized-sprite.js")
@menu("i18n/LocalizedSprite")
export default class LocalizedSprite extends cc.Component {
    @property({ type: SpriteFrameSet })
    spriteFrameSet: SpriteFrameSet[] = [];

    sprite: cc.Sprite = null;

    updateSprite(lang: string): void {
        if (this.sprite) {
            let frame = this.getSpriteFrameByLang(lang);
            if (!frame && this.spriteFrameSet[0]) {
                frame = this.spriteFrameSet[0].spriteFrame;
            }
            this.sprite.spriteFrame = frame;
        } else {
            cc.error("Failed to update localized sprite, sprite component is invalid!");
        }
    }

    getSpriteFrameByLang(lang: string): cc.SpriteFrame {
        for (let i = 0; i < this.spriteFrameSet.length; ++i) {
            if (this.spriteFrameSet[i].language === lang) {
                return this.spriteFrameSet[i].spriteFrame;
            }
        }
    }

    fetchRender(): void {
        const sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.i18n.curLang);
        }
    }

    onLoad(): void {
        this.fetchRender();
    }
}
