const { ccclass, property } = cc._decorator;

enum AutoHeadDir {
    isTop = 0,
    isBottom = 1,
}

@ccclass("AutoHeadType2")
class AutoHeadType2 {

    @property({
        type: cc.Enum(AutoHeadDir)
    })
    type = AutoHeadDir.isTop;

    @property()
    num: number = 65;
}

@ccclass
export default class isAutoHead extends cc.Component {

    @property([AutoHeadType2])
    autoDatas: AutoHeadType2[] = [{
        type: AutoHeadDir.isTop,
        num: 65
    }];

    onLoad() {
        if (cc.winSize.width / cc.winSize.height < .56) {
            for (let e = 0, list = this.autoDatas; e < list.length; e++) {
                let a = list[e];
                if (0 == a.type) {
                    this.node.getComponent(cc.Widget).top = this.node.getComponent(cc.Widget).top + a.num;
                }
                if (1 == a.type) {
                    this.node.getComponent(cc.Widget).bottom = this.node.getComponent(cc.Widget).bottom + a.num;
                }
            }
        }
    }
}
