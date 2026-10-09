const { ccclass, property } = cc._decorator;

@ccclass
export default class PaymentItem extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    @property([cc.SpriteFrame])
    spriteFrames: cc.SpriteFrame[] = [];

    public set paymentID(e: number) {
        const t = this.spriteFrames[e - 101];
        if (t) {
            this.node.active = true;
            this.sprite.spriteFrame = t;
        } else {
            this.node.active = false;
            this.sprite.spriteFrame = null;
        }
    }

}
