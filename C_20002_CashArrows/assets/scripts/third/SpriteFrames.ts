const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu("UI/Cocos/SpriteFrames")
export default class SpriteFrames extends cc.Component {
    _sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];

    get sprite() {
        this._sprite || (this._sprite = this.getComponent(cc.Sprite));
        return this._sprite;
    }

    setFrame(e: string) {
        var t = this.frames.find(function (t) {
            return t.name == e;
        });
        t && (this.sprite.spriteFrame = t);
    }

    setFrameByIndex(e: number) {
        e >= this.frames.length && (e = this.frames.length - 1);
        e < 0 || (this.sprite.spriteFrame = this.frames[e]);
    }

    getFrameIndex() {
        var e = this;
        return this.frames.findIndex(function (t) {
            return e.sprite.spriteFrame == t;
        });
    }

    getFrame() {
        var e = this;
        return this.frames.find(function (t) {
            return e.sprite.spriteFrame == t;
        });
    }
}
