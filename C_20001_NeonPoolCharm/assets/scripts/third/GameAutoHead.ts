const { ccclass, property } = cc._decorator;

enum GameAutoHeadType {
    isTop = 0,
    isBottom = 1,
}

@ccclass("GameAutoHeadType")
class GameAutoHeadData {
    @property({ type: cc.Enum(GameAutoHeadType) })
    type = GameAutoHeadType.isTop;

    @property()
    num = 65;
}

@ccclass
export default class GameAutoHead extends cc.Component {
    @property([GameAutoHeadData])
    autoDatas: GameAutoHeadData[] = [{ type: GameAutoHeadType.isTop, num: 65 }];

    onLoad(): void {
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            for (const data of this.autoDatas) {
                const widget = this.node.getComponent(cc.Widget);
                if (data.type == GameAutoHeadType.isTop) {
                    widget.top = widget.top + data.num;
                }
                if (data.type == GameAutoHeadType.isBottom) {
                    widget.bottom = widget.bottom + data.num;
                }
            }
        }
    }
}
