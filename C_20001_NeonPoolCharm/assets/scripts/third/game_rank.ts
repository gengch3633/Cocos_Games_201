import * as BallLogicMgr from "./BallLogicMgr";

const PageType = {
    Free: 0,
    GK: 1,
};

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_rank extends cc.Component {
    @property(cc.Prefab)
    node_page_item_Prefab: cc.Prefab = null;

    pageItems: cc.Node[] = null;
    pageType: number = null;
    pageIdx: number = null;

    callback(): void {}

    onLoad(): void {
        this.pageItems = [];
        this.pageType = (PageType as any).Ball;
        this.initPageItems();
        this.hideAllItems();
        cc.find("button_prev", this.node).on("click", () => {
            this.updatePageItems(this.pageIdx - 1);
        });
        cc.find("button_next", this.node).on("click", () => {
            this.updatePageItems(this.pageIdx + 1);
        });
        cc.find("button_back", this.node).on("click", () => {
            BallLogicMgr.gotoHall();
        });
        const toggleContainer = cc.find("toggleContainer", this.node);
        toggleContainer.getChildByName("toggle1").on("toggle", () => {
            this.pageType = PageType.Free;
            this.pageIdx = 0;
            this.updatePageItems();
        });
        toggleContainer.getChildByName("toggle2").on("toggle", () => {
            this.pageType = PageType.GK;
            this.pageIdx = 0;
            this.updatePageItems();
        });
        this.pageType = PageType.Free;
        this.pageIdx = 0;
        this.updatePageItems();
    }

    hideAllItems(): void {}

    showTip(msg: string): void {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(msg);
    }

    initPageItems(): void {
        this.pageItems = [];
        const pageNode = cc.find("node_page", this.node);
        for (let i = 0; i < 8; i++) {
            const item = cc.instantiate(this.node_page_item_Prefab);
            item.getComponent("RankListItemComp").idx = i;
            item.parent = pageNode;
            item.y = -50 - 105 * i;
            this.pageItems.push(item);
        }
    }

    destroyAllItems(): void {
        for (let i = 0; i < 6; i++) {
            this.pageItems[i].destroy();
        }
    }

    update(): void {}

    updatePageItems(pageIdx?: number): void {
        pageIdx = pageIdx || 0;
        if (pageIdx < 0) {
            pageIdx = 0;
        }
    }

    onDestroy(): void {
        this.destroyAllItems();
    }
}
