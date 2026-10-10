import BallLogicMgr from "./BallLogicMgr";
import GameMgr from "./GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableEditListItemControl extends cc.Component {
    @property
    idx = 0;

    publictableInfo = null;

    onEnable() {}

    setData(e) {
        this.publictableInfo = e;
        cc.find("label_id", this.node).getComponent(cc.Label).string = e.tableID;
    }

    onLoad() {
        this.idx = this.idx || 0;
        const t = this;
        cc.find("button", this.node).on("click", function () {
            t.publictableInfo && -1 == t.publictableInfo.tableID && GameMgr.local_remove(GameMgr.LSKEY_EditingTableInfo);
        });
        cc.find("button_play", this.node).on("click", function () {
            if (t.publictableInfo) if (-1 == t.publictableInfo.tableID) {
                BallLogicMgr.editingTableInfo = t.publictableInfo.tableInfo;
                cc.director.loadScene("game_table_editor");
            } else BallLogicMgr.clickTableEditListItem_challenge(t.publictableInfo);
        });
    }

    update() {}
}
