import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_shop extends cc.Component {
    @property(cc.Prefab)
    node_page_item_Prefab = null;

    pageItems = null;

    pageType = null;

    pageIdx = null;

    shopConfig = null;

    initPageItems() {
        this.pageItems = [];
        const e = cc.find("node_page", this.node);
        for (let t = 0; t < 6; t++) {
            const o = cc.instantiate(this.node_page_item_Prefab);
            o.getComponent("ShopListItemComp").idx = t;
            o.getComponent("ShopListItemComp").setShop(this);
            o.parent = e;
            o.x = t % 2 == 0 ? -150 : 150;
            const n = Math.floor(t / 2);
            o.y = -176 - 310 * n;
            this.pageItems.push(o);
        }
    }

    showTip(e) {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
    }

    hideAllItems() {
        for (let e = 0; e < 6; e++) {
            this.pageItems[e].opacity = 0;
            this.pageItems[e].getComponent("ShopListItemComp").random_move(false);
        }
    }

    onLoad() {
        const e = this;
        e.shopConfig = BallLogicMgr.shop_config();
        this.pageItems = [];
        this.pageType = 0;
        console.log("self.pageType = PageType.Ball", this.pageType, 0);
        GlobalConfig.debug_alpha && (this.node.opacity = 25);
        this.initPageItems();
        this.hideAllItems();
        cc.find("button_prev", this.node).on("click", function () {
            e.updatePageItems(e.pageIdx - 1);
        });
        cc.find("button_next", this.node).on("click", function () {
            e.updatePageItems(e.pageIdx + 1);
        });
        cc.find("button_back", this.node).on("click", function () {
            BallLogicMgr.gotoHall();
        });
        const t = cc.find("toggleContainer", this.node);
        t.getChildByName("toggle1").on("toggle", function () {
            e.pageType = 0;
            e.pageIdx = 0;
            e.updatePageItems();
        });
        t.getChildByName("toggle2").on("toggle", function () {
            e.pageType = 1;
            e.pageIdx = 0;
            e.updatePageItems();
        });
        t.getChildByName("toggle3").on("toggle", function () {
            e.pageType = 2;
            e.pageIdx = 0;
            e.updatePageItems();
        });
        this.pageType = 0;
        this.pageIdx = 0;
        this.updatePageItems();
    }

    callback() {}

    updateCoin() {
        cc.find("node_coin", this.node).getComponent("CoinComp").updateV();
    }

    destroyAllItems() {
        for (let e = 0; e < 6; e++) this.pageItems[e].destroy();
    }

    onDestroy() {
        this.destroyAllItems();
    }

    update() {}

    updatePageItems(e) {
        if ((e = e || 0) < 0) e = 0;
        else {
            let t = 6;
            let n;
            let i;
            console.log("updatePageItems", this.pageType, 0 == this.pageType);
            if (0 == this.pageType) {
                if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.balls_more).length)) {
                    this.hideAllItems();
                    for (let o = 0; o < t; o++) {
                        let a;
                        if ((a = e * t + o) < i) {
                            this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[o].opacity = 255;
                            this.pageItems[o].getComponent("ShopListItemComp").random_move(false);
                            this.pageItems[o].getComponent("ShopListItemComp").setupConfig(0, n[a]);
                        }
                    }
                    this.pageIdx = e;
                }
            } else if (1 == this.pageType) {
                if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.ball_colors).length)) {
                    this.hideAllItems();
                    for (let o = 0; o < t; o++) {
                        let a;
                        if ((a = e * t + o) < i) {
                            this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[o].opacity = 255;
                            this.pageItems[o].getComponent("ShopListItemComp").random_move(true);
                            this.pageItems[o].getComponent("ShopListItemComp").setupConfig(1, n[a]);
                        }
                    }
                    this.pageIdx = e;
                }
            } else if (2 == this.pageType) {
                if ((e + 0) * (t = 6) < (i = (n = this.shopConfig.ball_particles).length)) {
                    this.hideAllItems();
                    for (let o = 0; o < t; o++) {
                        let a;
                        if ((a = e * t + o) < i) {
                            this.pageItems[o].getComponent("ShopListItemComp").setAsEditing(false);
                            this.pageItems[o].opacity = 255;
                            this.pageItems[o].getComponent("ShopListItemComp").random_move(true);
                            this.pageItems[o].getComponent("ShopListItemComp").setupConfig(2, n[a]);
                        }
                    }
                    this.pageIdx = e;
                }
            }
        }
    }
}
