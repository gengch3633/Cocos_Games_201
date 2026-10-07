const { ccclass, property } = cc._decorator;

enum GameAutoHeadTypeEnum {
    isTop = 0,
    isBottom = 1,
}

@ccclass("GameAutoHeadType")
class GameAutoHeadType {
    @property({ type: cc.Enum(GameAutoHeadTypeEnum) })
    type = GameAutoHeadTypeEnum.isTop;

    @property()
    num = 65;
}

@ccclass
export default class GameAutoHead extends cc.Component {
    @property([GameAutoHeadType])
    autoDatas = [{ type: GameAutoHeadTypeEnum.isTop, num: 65 }];

    onLoad(): void {
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            for (const o of this.autoDatas) {
                if (o.type == 0) {
                    this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + o.num;
                }
                if (o.type == 1) {
                    this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + o.num;
                }
            }
        }
    }
}
