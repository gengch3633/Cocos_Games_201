import ConfigDataSys from "./ConfigDataSys";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import PageMgr from "./PageMgr";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/LevelProgressItemCtr")
export default class LevelProgressItemCtr extends cc.Component {
    @property(cc.Node)
    root = null;

    @property(cc.Node)
    progress_bar = null;

    @property(cc.Node)
    progress_key = null;

    @property(cc.Label)
    progress_label = null;

    @property(cc.Node)
    level_progress_bubble = null;

    @property(cc.Label)
    lp_box_count_label = null;

    @property(cc.Node)
    bg_qipao_ar = null;

    _progressKeyPool = [];
    _curProgressKeys = [];
    _maxCount = 100;
    _progressBarBaseHeight = null;
    _progressKeyPrefab = null;
    _curData = null;

    clearKeys() {
        var e = this;
        this.progress_bar.children.forEach(function (t) {
            t.active = false;
            e._progressKeyPool.indexOf(t) < 0 && e._progressKeyPool.push(t);
        });
    }

    resetData() {
        var e = this;
        this.root.active = true;
        this.clearKeys();
        var t = ConfigDataSys.stage_configMap.get(PlayerDataSys.user_level).progressbar.split("_");
        this._maxCount = Number(t[0]);
        var o = t[1].split(",");
        this._curData = [];
        o.forEach(function (t) {
            var o = Number(t);
            !isNaN(o) && o && e._curData.push(o);
        });
        this._curData.sort(function (e, t) {
            return e > t ? 1 : -1;
        });
        this.initProgressKey(this._curData);
        this.updateStageProgress();
    }

    onEnable() {
        EventMgr.listen(GameEventType.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
    }

    initProgressKey(e) {
        this._curProgressKeys = [];
        for (var t = 0; t < e.length; t++) {
            var o = this.getProgressKey();
            o.active = true;
            this._curProgressKeys.push(o);
        }
        this._progressKeyPool.forEach(function (e) {
            e.active = false;
        });
    }

    addButton() {
        UiManager.addButtonListen(this.bg_qipao_ar, this.onBubbleClicked, this);
    }

    onBubbleClicked() {
        var e = 0;
        this._curData.forEach(function (t) {
            PlayerDataSys.remove_card_count_single >= t && e++;
        });
        var t = PlayerDataSys.level_gift_record.length;
        if (t < this._curData.length && PlayerDataSys.remove_card_count_single >= this._curData[t]) {
            EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "DiamondBoxRewardPage");
            var o = this._curProgressKeys[PlayerDataSys.level_gift_record.length].convertToWorldSpaceAR(cc.Vec2.ZERO);
            PageMgr.showPage("DiamondBoxRewardPage", {
                start_p: o,
                box_count: e - t
            });
        }
    }

    onLoad() {
        this._progressBarBaseHeight = this.progress_bar.height;
        this._progressKeyPrefab = this.progress_key;
        this.addButton();
    }

    updateProgressKey() {
        var e = this,
            t = PlayerDataSys.remove_card_count_single;
        this._curProgressKeys.forEach(function (o, n) {
            if (1 == o.active) {
                var i = e._progressBarBaseHeight - e.progress_bar.height,
                    a = e._progressBarBaseHeight * (e._curData[n] / e._maxCount) - i;
                a = Math.max(0, a);
                if (t >= e._curData[n]) {
                    a = 0;
                    o.active = false;
                }
                o.setPosition(0, a);
            }
        });
    }

    getProgressKey() {
        if (this._progressKeyPool.length > 0) return this._progressKeyPool.pop();
        var e = cc.instantiate(this._progressKeyPrefab);
        e.setParent(this.progress_bar);
        return e;
    }

    updateStageProgress() {
        if (this.root.active) {
            var e = PlayerDataSys.remove_card_count_single;
            if (e >= this._maxCount) {
                this.progress_label.string = "0%";
                this.progress_bar.height = 0;
            } else {
                var t = e / this._maxCount;
                t = 1 - t;
                this.progress_bar.height = this._progressBarBaseHeight * t;
                t = Math.floor(100 * t);
                this.progress_label.string = t + "%";
            }
            this.updateProgressKey();
            this.checkReward();
        }
    }

    onDisable() {
        EventMgr.ignore(GameEventType.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
    }

    checkReward() {
        var e = 0;
        this._curData.forEach(function (t) {
            PlayerDataSys.remove_card_count_single >= t && e++;
        });
        var t = PlayerDataSys.level_gift_record.length;
        if (t < this._curData.length && PlayerDataSys.remove_card_count_single >= this._curData[t]) {
            this.level_progress_bubble.active = true;
            this.lp_box_count_label.getComponent(cc.Label).string = "x" + (e - t);
        } else this.level_progress_bubble.active = false;
    }
}
