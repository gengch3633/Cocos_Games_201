import PageMgr from "./PageMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/LevelProgressItemCtr")
export default class LevelProgressItemCtr extends cc.Component {
    @property(cc.Node)
    root: cc.Node = null;

    @property(cc.Node)
    progress_bar: cc.Node = null;

    @property(cc.Node)
    progress_key: cc.Node = null;

    @property(cc.Label)
    progress_label: cc.Label = null;

    @property(cc.Node)
    level_progress_bubble: cc.Node = null;

    @property(cc.Label)
    lp_box_count_label: cc.Label = null;

    @property(cc.Node)
    bg_qipao_ar: cc.Node = null;

    private _progressKeyPool: cc.Node[] = [];
    private _curProgressKeys: cc.Node[] = [];
    private _maxCount = 100;
    private _progressBarBaseHeight: number = null;
    private _progressKeyPrefab: cc.Node = null;
    private _curData: number[] = null;

    clearKeys(): void {
        this.progress_bar.children.forEach((child) => {
            child.active = false;
            if (this._progressKeyPool.indexOf(child) < 0) {
                this._progressKeyPool.push(child);
            }
        });
    }

    resetData(): void {
        this.root.active = true;
        this.clearKeys();
        const parts = ConfigDataSys.stage_configMap.get(PlayerDataSys.user_level).progressbar.split("_");
        this._maxCount = Number(parts[0]);
        const thresholds = parts[1].split(",");
        this._curData = [];
        thresholds.forEach((item: any) => {
            const value = Number(item);
            if (!isNaN(value) && value) {
                this._curData.push(value);
            }
        });
        this._curData.sort((a, b) => (a > b ? 1 : -1));
        this.initProgressKey(this._curData);
        this.updateStageProgress();
    }

    onEnable(): void {
        EventMgr.listen(GameEventType.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
    }

    initProgressKey(data: number[]): void {
        this._curProgressKeys = [];
        for (let i = 0; i < data.length; i++) {
            const key = this.getProgressKey();
            key.active = true;
            this._curProgressKeys.push(key);
        }
        this._progressKeyPool.forEach((node) => {
            node.active = false;
        });
    }

    addButton(): void {
        UiManager.addButtonListen(this.bg_qipao_ar, this.onBubbleClicked, this);
    }

    onBubbleClicked(): void {
        let claimableCount = 0;
        this._curData.forEach((threshold) => {
            if (PlayerDataSys.remove_card_count_single >= threshold) {
                claimableCount++;
            }
        });
        const claimedCount = PlayerDataSys.level_gift_record.length;
        if (
            claimedCount < this._curData.length &&
            PlayerDataSys.remove_card_count_single >= this._curData[claimedCount]
        ) {
            EventMgr.trigger(GameEventType.SHOW_MAIN_UI_TOUCH_BLOCK, "DiamondBoxRewardPage");
            const startPos = this._curProgressKeys[PlayerDataSys.level_gift_record.length].convertToWorldSpaceAR(
                cc.Vec2.ZERO
            );
            PageMgr.showPage("DiamondBoxRewardPage", {
                start_p: startPos,
                box_count: claimableCount - claimedCount,
            });
        }
    }

    onLoad(): void {
        this._progressBarBaseHeight = this.progress_bar.height;
        this._progressKeyPrefab = this.progress_key;
        this.addButton();
    }

    updateProgressKey(): void {
        const progress = PlayerDataSys.remove_card_count_single;
        this._curProgressKeys.forEach((node, index) => {
            if (node.active) {
                const heightDiff = this._progressBarBaseHeight - this.progress_bar.height;
                let y = this._progressBarBaseHeight * (this._curData[index] / this._maxCount) - heightDiff;
                y = Math.max(0, y);
                if (progress >= this._curData[index]) {
                    y = 0;
                    node.active = false;
                }
                node.setPosition(0, y);
            }
        });
    }

    getProgressKey(): cc.Node {
        if (this._progressKeyPool.length > 0) {
            return this._progressKeyPool.pop();
        }
        const node = cc.instantiate(this._progressKeyPrefab);
        node.setParent(this.progress_bar);
        return node;
    }

    updateStageProgress(): void {
        if (this.root.active) {
            const progress = PlayerDataSys.remove_card_count_single;
            if (progress >= this._maxCount) {
                this.progress_label.string = "0%";
                this.progress_bar.height = 0;
            } else {
                let ratio = progress / this._maxCount;
                ratio = 1 - ratio;
                this.progress_bar.height = this._progressBarBaseHeight * ratio;
                ratio = Math.floor(100 * ratio);
                this.progress_label.string = ratio + "%";
            }
            this.updateProgressKey();
            this.checkReward();
        }
    }

    onDisable(): void {
        EventMgr.ignore(GameEventType.ON_UPDATE_LEVEL_PROGRESS, this.updateStageProgress, this);
    }

    checkReward(): void {
        let claimableCount = 0;
        this._curData.forEach((threshold) => {
            if (PlayerDataSys.remove_card_count_single >= threshold) {
                claimableCount++;
            }
        });
        const claimedCount = PlayerDataSys.level_gift_record.length;
        if (
            claimedCount < this._curData.length &&
            PlayerDataSys.remove_card_count_single >= this._curData[claimedCount]
        ) {
            this.level_progress_bubble.active = true;
            this.lp_box_count_label.getComponent(cc.Label).string = "x" + (claimableCount - claimedCount);
        } else {
            this.level_progress_bubble.active = false;
        }
    }
}
