const { ccclass, property } = cc._decorator;

@ccclass
export default class PaymentItem extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spriteFrames: cc.SpriteFrame[] = [];

    set paymentID(id: number) {
        const frame = this.spriteFrames[id - 101];
        if (frame) {
            this.node.active = true;
            this.sprite.spriteFrame = frame;
        } else {
            this.node.active = false;
            this.sprite.spriteFrame = null;
        }
    }
}
