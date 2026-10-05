const { ccclass, property } = cc._decorator;

@ccclass
export default class UIScrollPage extends cc.Component {
    @property()
    maxPage = 0;

    @property(cc.SpriteFrame)
    selectSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    unSelectSprite: cc.SpriteFrame = null;

    currentIndex = 0;
    spArr: cc.Sprite[] = [];

    scrollTo(index: number): void {
        const prev = this.spArr[this.currentIndex];
        if (prev) {
            prev.spriteFrame = this.unSelectSprite;
        }
        this.currentIndex = index;
        const current = this.spArr[this.currentIndex];
        if (current) {
            current.spriteFrame = this.selectSprite;
        }
    }

    setMaxPage(count: number): void {
        this.maxPage = count;
        for (let i = 0; i < count; i++) {
            const node = new cc.Node();
            const sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.unSelectSprite;
            this.node.addChild(node);
            this.spArr.push(sprite);
        }
        this.scrollTo(0);
    }

    onLoad(): void {
        this.node.removeAllChildren();
    }
}
