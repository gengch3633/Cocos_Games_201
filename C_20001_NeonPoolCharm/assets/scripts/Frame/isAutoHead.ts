const { ccclass, property } = cc._decorator;

enum AutoHeadType {
    isTop = 0,
    isBottom = 1,
}

@ccclass("AutoHeadType2")
class AutoHeadType2 {
    @property({ type: cc.Enum(AutoHeadType) })
    type: AutoHeadType = AutoHeadType.isTop;

    @property()
    num: number = 65;
}

@ccclass
export default class isAutoHead extends cc.Component {
    @property([AutoHeadType2])
    autoDatas: AutoHeadType2[] = [{ type: AutoHeadType.isTop, num: 65 }];

    onLoad(): void {
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            for (const data of this.autoDatas) {
                const widget = this.node.getComponent(cc.Widget);
                if (data.type === AutoHeadType.isTop) {
                    widget.top = widget.top + data.num;
                } else if (data.type === AutoHeadType.isBottom) {
                    widget.bottom = widget.bottom + data.num;
                }
            }
        }
    }
}
