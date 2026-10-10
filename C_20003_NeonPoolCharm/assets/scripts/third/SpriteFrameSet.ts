const { ccclass, property } = cc._decorator;

@ccclass
export default class SpriteFrameSet {
    @property
    language = "";

    @property(cc.SpriteFrame)
    spriteFrame = null;
}

export { SpriteFrameSet };
