const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteFrameSet {
    @property
    language = "";

    @property(cc.SpriteFrame)
    spriteFrame: cc.SpriteFrame = null;
}
