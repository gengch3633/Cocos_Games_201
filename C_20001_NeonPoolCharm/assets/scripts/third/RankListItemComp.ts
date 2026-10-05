const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListItemComp extends cc.Component {
    @property()
    idx = 0;

    shop: { showTip: (msg: string) => void } = null;

    update(): void {}

    setData(): void {}

    clear(): void {}

    onDestroy(): void {
        this.clear();
    }

    onEnable(): void {}

    showTip(msg: string): void {
        this.shop.showTip(msg);
    }

    onLoad(): void {
        this.idx = this.idx || 0;
    }
}
