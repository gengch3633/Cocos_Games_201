import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

const u: any = {
    Free: 0,
    GK: 1
};

@ccclass
export default class game_rank extends cc.Component {
    @property(cc.Prefab)
    node_page_item_Prefab = null;

    pageItems = null;

    pageType = null;

    pageIdx = null;

    callback() {}

    onLoad() {
        const e = this;
        this.pageItems = [];
        this.pageType = u.Ball;
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
            e.pageType = u.Free;
            e.pageIdx = 0;
            e.updatePageItems();
        });
        t.getChildByName("toggle2").on("toggle", function () {
            e.pageType = u.GK;
            e.pageIdx = 0;
            e.updatePageItems();
        });
        this.pageType = u.Free;
        this.pageIdx = 0;
        this.updatePageItems();
    }

    hideAllItems() {}

    showTip(e) {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
    }

    initPageItems() {
        this.pageItems = [];
        const e = cc.find("node_page", this.node);
        for (let t = 0; t < 8; t++) {
            const o = cc.instantiate(this.node_page_item_Prefab);
            o.getComponent("RankListItemComp").idx = t;
            o.parent = e;
            o.y = -50 - 105 * t;
            this.pageItems.push(o);
        }
    }

    destroyAllItems() {
        for (let e = 0; e < 6; e++) this.pageItems[e].destroy();
    }

    update() {}

    updatePageItems(e) {
        (e = e || 0) < 0 && (e = 0);
    }

    onDestroy() {
        this.destroyAllItems();
    }
}
