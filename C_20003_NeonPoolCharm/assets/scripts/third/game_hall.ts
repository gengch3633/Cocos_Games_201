import BallLogicMgr from "./BallLogicMgr";
import DB from "./DB";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game_hall extends cc.Component {
    @property(cc.Prefab)
    ui_setting_prefab = null;

    @property(cc.Prefab)
    ui_reward_prefab = null;

    @property(cc.Prefab)
    ui_author_prefab = null;

    updateCoin() {
        this.updateInfo(DB.userInfo.coin);
    }

    showAuthor(e) {
        cc.instantiate(this.ui_author_prefab).getComponent("game_UI_author").show(this, e);
    }

    updateInfo(e) {
        const t = cc.find("node_coin", this.node);
        e = e || DB.userInfo.coin;
        cc.find("label_coin", t).getComponent(cc.Label).string = e;
    }

    updateRecIcon() {
        console.log("updateRecIcon in hall", BallLogicMgr.is_record);
    }

    showTip(e) {
        cc.find("node_floatTip", this.node).getComponent("FloatTipComp").show(e);
    }

    checkTTState() {}

    onLoad() {
        const e = this;
        BallLogicMgr.resetInHall();
        cc.find("game_name", this.node).opacity = 0;
        cc.find("button_infinity", this.node).on("click", function () {
            BallLogicMgr.gotoTable_freeMode_useCacheIdx(true);
        });
        cc.find("button_edit", this.node).on("click", function () {
            DB.checkAuthorize(function (t, o) {
                console.log("checkAuthorize btn edit return", t, o);
                t ? BallLogicMgr.gotoInfoList() : e.showAuthor(function (e) {
                    e && BallLogicMgr.gotoInfoList();
                });
            });
        });
        cc.find("button_setting", this.node).on("click", function () {
            cc.instantiate(e.ui_setting_prefab).getComponent("game_UI_settting").show(e.node);
        });
        cc.find("button_login", this.node).on("click", function () {});
        this.updateInfo();
        BallLogicMgr.playBgMusic();
    }

    loadFModeConfig() {
        cc.loader.loadRes("temp_file/level_confi", cc.JsonAsset, function () {});
    }
}
