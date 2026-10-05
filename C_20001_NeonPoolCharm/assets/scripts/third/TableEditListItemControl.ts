import * as BallLogicMgr from "./BallLogicMgr";
import * as GameMgr from "./GameMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TableEditListItemControl extends cc.Component {
    @property()
    idx = 0;

    publictableInfo: { tableID: number; tableInfo: unknown } = null;

    onEnable(): void {}

    setData(data: { tableID: number; tableInfo: unknown }): void {
        this.publictableInfo = data;
        cc.find("label_id", this.node).getComponent(cc.Label).string = String(data.tableID);
    }

    onLoad(): void {
        this.idx = this.idx || 0;
        const self = this;
        cc.find("button", this.node).on("click", () => {
            if (self.publictableInfo && self.publictableInfo.tableID == -1) {
                GameMgr.local_remove(GameMgr.LSKEY_EditingTableInfo);
            }
        });
        cc.find("button_play", this.node).on("click", () => {
            if (!self.publictableInfo) {
                return;
            }
            if (self.publictableInfo.tableID == -1) {
                BallLogicMgr.editingTableInfo = self.publictableInfo.tableInfo;
                cc.director.loadScene("game_table_editor");
            } else {
                BallLogicMgr.clickTableEditListItem_challenge(self.publictableInfo);
            }
        });
    }

    update(): void {}
}
