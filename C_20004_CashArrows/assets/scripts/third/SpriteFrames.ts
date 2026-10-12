const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu("UI/Cocos/SpriteFrames")
export default class SpriteFrames extends cc.Component {
    @property([cc.SpriteFrame])
    public frames: cc.SpriteFrame[] = [];

    private _sprite: cc.Sprite = null;

    public get sprite(): cc.Sprite {
        if (!this._sprite) {
            this._sprite = this.getComponent(cc.Sprite);
        }
        return this._sprite;
    }

    public setFrame(name: string): void {
        const frame = this.frames.find(f => f.name === name);
        if (frame) {
            this.sprite.spriteFrame = frame;
        }
    }

    public setFrameByIndex(index: number): void {
        if (index >= this.frames.length) {
            index = this.frames.length - 1;
        }
        if (index >= 0) {
            this.sprite.spriteFrame = this.frames[index];
        }
    }

    public getFrameIndex(): number {
        return this.frames.findIndex(f => this.sprite.spriteFrame === f);
    }

    public getFrame(): cc.SpriteFrame | undefined {
        return this.frames.find(f => this.sprite.spriteFrame === f);
    }
}