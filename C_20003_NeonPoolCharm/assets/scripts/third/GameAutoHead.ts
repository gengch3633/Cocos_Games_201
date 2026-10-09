const { ccclass, property } = cc._decorator;

enum GameAutoHeadEnum {
    isTop = 0,
    isBottom = 1
}

@ccclass("GameAutoHeadType")
class GameAutoHeadType {
    @property({
        type: cc.Enum(GameAutoHeadEnum)
    })
    type = GameAutoHeadEnum.isTop;

    @property()
    num = 65;
}

@ccclass
export default class GameAutoHead extends cc.Component {

    @property([GameAutoHeadType])
    autoDatas = [{
        type: GameAutoHeadEnum.isTop,
        num: 65
    }];

    onLoad() {
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            for (let i = 0; i < this.autoDatas.length; i++) {
                const data = this.autoDatas[i];
                if (0 == data.type) {
                    this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + data.num;
                }
                if (1 == data.type) {
                    this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + data.num;
                }
            }
        }
    }
}
