import DB from "./DB";
import BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass("game_hall")
export default class GameHall extends cc.Component {
    @property(cc.Prefab)
    ui_setting_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    ui_reward_prefab: cc.Prefab = null;

    @property(cc.Prefab)
    ui_author_prefab: cc.Prefab = null;

    updateCoin(): void {
        this.updateInfo(DB.userInfo.coin);
    }

    showAuthor(callback: (authorized: boolean) => void): void {
        cc.instantiate(this.ui_author_prefab).getComponent("game_UI_author").show(this, callback);
    }

    updateInfo(coin?: number): void {
        const coinNode = cc.find("node_coin", this.node);
        coin = coin || DB.userInfo.coin;
        cc.find("label_coin", coinNode).getComponent(cc.Label).string = "" + coin;
    }

    updateRecIcon(): void {
        console.log("updateRecIcon in hall", BallLogicMgr.is_record);
    }

    showTip(text: string): void {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(text);
    }

    checkTTState(): void {
    }

    onLoad(): void {
        BallLogicMgr.resetInHall();
        cc.find("game_name", this.node).opacity = 0;
        cc.find("button_infinity", this.node).on("click", () => {
            BallLogicMgr.gotoTable_freeMode_useCacheIdx(true);
        });
        cc.find("button_edit", this.node).on("click", () => {
            DB.checkAuthorize((authorized, _data) => {
                console.log("checkAuthorize btn edit return", authorized, _data);
                if (authorized) {
                    BallLogicMgr.gotoInfoList();
                } else {
                    this.showAuthor((ok) => {
                        ok && BallLogicMgr.gotoInfoList();
                    });
                }
            });
        });
        cc.find("button_setting", this.node).on("click", () => {
            cc.instantiate(this.ui_setting_prefab).getComponent("game_UI_settting").show(this.node);
        });
        cc.find("button_login", this.node).on("click", () => {
        });
        this.updateInfo();
        BallLogicMgr.playBgMusic();
    }

    loadFModeConfig(): void {
        cc.loader.loadRes("temp_file/level_confi", cc.JsonAsset, () => {
        });
    }
}
