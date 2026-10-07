const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu("UI/Cocos/SpriteFrames")
export default class SpriteFrames extends cc.Component {
    _sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];

    get sprite(): cc.Sprite {
        if (!this._sprite) {
            this._sprite = this.getComponent(cc.Sprite);
        }
        return this._sprite;
    }

    setFrame(name: string): void {
        const frame = this.frames.find((item) => item.name === name);
        if (frame) {
            this.sprite.spriteFrame = frame;
        }
    }

    setFrameByIndex(index: number): void {
        if (index >= this.frames.length) {
            index = this.frames.length - 1;
        }
        if (index < 0) {
            return;
        }
        this.sprite.spriteFrame = this.frames[index];
    }

    getFrameIndex(): number {
        return this.frames.findIndex((frame) => this.sprite.spriteFrame === frame);
    }

    getFrame(): cc.SpriteFrame {
        return this.frames.find((frame) => this.sprite.spriteFrame === frame);
    }
}
