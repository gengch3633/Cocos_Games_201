const { ccclass, property } = cc._decorator;

@ccclass
export default class RankListItemComp extends cc.Component {
    @property
    idx = 0;

    shop: any = null;

    update(): void {
    }

    setData(): void {
    }

    clear(): void {
    }

    onDestroy(): void {
        this.clear();
    }

    onEnable(): void {
    }

    showTip(e: any): void {
        this.shop.showTip(e);
    }

    onLoad(): void {
        this.idx = this.idx || 0;
    }
}
