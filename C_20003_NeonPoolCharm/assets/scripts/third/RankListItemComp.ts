const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListItemComp extends cc.Component {
    @property
    idx = 0;

    update() {}

    setData() {}

    clear() {}

    onDestroy() {
        this.clear();
    }

    onEnable() {}

    showTip(e) {
        (this as any).shop.showTip(e);
    }

    onLoad() {
        this.idx = this.idx || 0;
    }
}
