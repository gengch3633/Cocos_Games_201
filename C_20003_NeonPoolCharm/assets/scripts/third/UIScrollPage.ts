const { ccclass, property } = cc._decorator;

@ccclass
export default class UIScrollPage extends cc.Component {
    @property
    maxPage = 0;

    @property(cc.SpriteFrame)
    selectSprite = null;

    @property(cc.SpriteFrame)
    unSelectSprite = null;

    currentIndex = 0;

    spArr = [];

    scrollTo(e) {
        const t = this.spArr[this.currentIndex];
        t && (t.spriteFrame = this.unSelectSprite);
        this.currentIndex = e;
        const o = this.spArr[this.currentIndex];
        o && (o.spriteFrame = this.selectSprite);
    }

    setMaxPage(e) {
        this.maxPage = e;
        for (let t = 0; t < e; t++) {
            const o = new cc.Node();
            const n = o.addComponent(cc.Sprite);
            n.spriteFrame = this.unSelectSprite;
            this.node.addChild(o);
            this.spArr.push(n);
        }
        this.scrollTo(0);
    }

    onLoad() {
        this.node.removeAllChildren();
    }
}
