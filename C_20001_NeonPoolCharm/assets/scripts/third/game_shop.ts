import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass("game_shop")
export default class GameShop extends cc.Component {
    @property(cc.Prefab)
    node_page_item_Prefab: cc.Prefab = null;

    pageItems: cc.Node[] = null;
    pageType: number = null;
    pageIdx: number = null;
    shopConfig: any = null;

    initPageItems(): void {
        this.pageItems = [];
        const pageNode = cc.find("node_page", this.node);
        for (let i = 0; i < 6; i++) {
            const item = cc.instantiate(this.node_page_item_Prefab);
            item.getComponent("ShopListItemComp").idx = i;
            item.getComponent("ShopListItemComp").setShop(this);
            item.parent = pageNode;
            item.x = i % 2 == 0 ? -150 : 150;
            const row = Math.floor(i / 2);
            item.y = -176 - 310 * row;
            this.pageItems.push(item);
        }
    }

    showTip(text: string): void {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(text);
    }

    hideAllItems(): void {
        for (let i = 0; i < 6; i++) {
            this.pageItems[i].opacity = 0;
            this.pageItems[i].getComponent("ShopListItemComp").random_move(false);
        }
    }

    onLoad(): void {
        this.shopConfig = BallLogicMgr.shop_config();
        this.pageItems = [];
        this.pageType = 0;
        console.log("self.pageType = PageType.Ball", this.pageType, 0);
        GlobalConfig.debug_alpha && (this.node.opacity = 25);
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
            this.pageType = 0;
            this.pageIdx = 0;
            this.updatePageItems();
        });
        toggleContainer.getChildByName("toggle2").on("toggle", () => {
            this.pageType = 1;
            this.pageIdx = 0;
            this.updatePageItems();
        });
        toggleContainer.getChildByName("toggle3").on("toggle", () => {
            this.pageType = 2;
            this.pageIdx = 0;
            this.updatePageItems();
        });
        this.pageType = 0;
        this.pageIdx = 0;
        this.updatePageItems();
    }

    callback(): void {
    }

    updateCoin(): void {
        cc.find("node_coin", this.node).getComponent("CoinComp").updateV();
    }

    destroyAllItems(): void {
        for (let i = 0; i < 6; i++) {
            this.pageItems[i].destroy();
        }
    }

    onDestroy(): void {
        this.destroyAllItems();
    }

    update(): void {
    }

    updatePageItems(pageIdx?: number): void {
        if ((pageIdx = pageIdx || 0) < 0) {
            pageIdx = 0;
        } else {
            let pageSize = 6;
            console.log("updatePageItems", this.pageType, this.pageType == 0);
            if (this.pageType == 0) {
                let list = this.shopConfig.balls_more;
                let total = list.length;
                if ((pageIdx + 0) * (pageSize = 6) < total) {
                    this.hideAllItems();
                    for (let i = 0; i < pageSize; i++) {
                        const idx = pageIdx * pageSize + i;
                        if (idx < total) {
                            this.pageItems[i].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[i].opacity = 255;
                            this.pageItems[i].getComponent("ShopListItemComp").random_move(false);
                            this.pageItems[i].getComponent("ShopListItemComp").setupConfig(0, list[idx]);
                        }
                    }
                    this.pageIdx = pageIdx;
                }
            } else if (this.pageType == 1) {
                let list = this.shopConfig.ball_colors;
                let total = list.length;
                if ((pageIdx + 0) * (pageSize = 6) < total) {
                    this.hideAllItems();
                    for (let i = 0; i < pageSize; i++) {
                        const idx = pageIdx * pageSize + i;
                        if (idx < total) {
                            this.pageItems[i].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[i].opacity = 255;
                            this.pageItems[i].getComponent("ShopListItemComp").random_move(true);
                            this.pageItems[i].getComponent("ShopListItemComp").setupConfig(1, list[idx]);
                        }
                    }
                    this.pageIdx = pageIdx;
                }
            } else if (this.pageType == 2) {
                let list = this.shopConfig.ball_particles;
                let total = list.length;
                if ((pageIdx + 0) * (pageSize = 6) < total) {
                    this.hideAllItems();
                    for (let i = 0; i < pageSize; i++) {
                        const idx = pageIdx * pageSize + i;
                        if (idx < total) {
                            this.pageItems[i].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[i].opacity = 255;
                            this.pageItems[i].getComponent("ShopListItemComp").random_move(true);
                            this.pageItems[i].getComponent("ShopListItemComp").setupConfig(2, list[idx]);
                        }
                    }
                    this.pageIdx = pageIdx;
                }
            }
        }
    }
}
