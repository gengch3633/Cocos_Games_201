import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Task extends cc.Component {
    static coinTarget: cc.Node = null;

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.ScrollView)
    scrollview: cc.ScrollView = null;

    @property(cc.Label)
    totalBonusLabel: cc.Label = null;

    @property(cc.Label)
    tips: cc.Label = null;

    @property(cc.Node)
    node_content: cc.Node = null;

    _close_target: cc.Node = null;
    _scrollViewDesignHeight: number = 0;
    viewData: any = null;

    static startTask(closeCB?: () => void): void {
        if (FrameData.saveData.lvAwardinfo) {
            FrameSDK.openWindow("Panel_Task", { closeCB });
        } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            FrameSDK.openWindow("Panel_ActivityGuide", {
                type: 1,
                logoType: "levelReward",
                dtime: 2.5,
                text: "skey_072",
                closeCB: () => {
                    FrameSDK.openWindow("Panel_Task", { closeCB });
                },
            });
        } else {
            closeCB?.();
        }
    }

    @CLICKLOCK()
    onBtnEvent(_event: cc.Event, customData: string): void {
        FrameSDK.logGameEvent("thepool_game_act", { object_action: "show", object_name: "lvrew_get" });
        FrameData.saveData.lvAwardinfo.push(Number(customData));
        let bonus = FrameData.getCoinOutNum("free");
        for (const task of FrameData.FRAME_CONF.TaskConfig) {
            if (task.task_id.toString() == customData) {
                bonus = task.task_num;
                break;
            }
        }
        FrameSDK.addCoin(bonus, 0, 0);
        this.onTouchClose();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        this.updateUi();
    }

    static isTaskFinish(): boolean {
        if (FrameData.saveData.lvAwardinfo) {
            const pending = FrameData.FRAME_CONF.TaskConfig.filter(
                (task) => FrameData.saveData.lvAwardinfo.indexOf(task.task_id) == -1
            );
            for (const task of pending) {
                if (FrameSDK.frameData.gameData.passLevel >= task.task_lv) {
                    return true;
                }
            }
        }
        return false;
    }

    onTouchClose(): void {
        cc.director.emit("UPDATA_TASK");
        FrameSDK.closeEffect(this, null);
    }

    static openTask(closeCB?: () => void): void {
        if (FrameData.saveData.lvAwardinfo == null && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            Panel_Task.startTask(closeCB);
        }
    }

    onLoad(): void {
        this._close_target = Panel_Task.coinTarget;
        this._scrollViewDesignHeight = this.scrollview.node.height;
        if (FrameData.saveData.lvAwardinfo == null) {
            FrameData.saveData.lvAwardinfo = [];
            FrameSDK.logGameEvent("thepool_game_act", { object_action: "show", object_name: "lvrew_start" }, true);
        }
    }

    updateUi(): void {
        const tasks = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.TaskConfig)).reverse();
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let scrollTarget: number = null;
        let totalBonus = 0;
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            totalBonus += task.task_num;
            const row = this.node_content.children[i] ?? cc.instantiate(this.node_content.children[0]);
            row.parent = this.node_content;
            const box = cc.find("box", row);
            cc.find("label_lv", row).getComponent(cc.Label).string = task.task_lv.toString();
            cc.find("label_coin", box).getComponent(cc.Label).string = "x" + FrameSDK.convertCoinToStr(task.task_num);
            const button = row.getComponent(cc.Button);
            button.interactable =
                passLevel >= task.task_lv && FrameData.saveData.lvAwardinfo.indexOf(task.task_id) == -1;
            button.clickEvents[0].customEventData = task.task_id.toString();
            if (scrollTarget === null) {
                if (button.interactable) {
                    scrollTarget = i;
                } else if (passLevel >= task.task_lv) {
                    scrollTarget = i;
                }
            }
            const topLight = cc.find("toplight_taiq", box);
            const light = cc.find("light", box);
            const mask = cc.find("mengban", box);
            const load = cc.find("load1", row);
            const lvRing = cc.find("lvhuang", row);
            if (passLevel >= task.task_lv) {
                load.active = true;
                lvRing.active = true;
                if (button.interactable) {
                    topLight.active = true;
                    light.active = true;
                    mask.active = false;
                } else {
                    topLight.active = false;
                    light.active = false;
                    mask.active = true;
                }
            } else {
                topLight.active = false;
                light.active = true;
                mask.active = false;
                load.active = false;
                lvRing.active = false;
            }
            box.stopAllActions();
            box.x = 0;
            if (topLight.active || task.task_lv - passLevel == 1) {
                cc.tween(box)
                    .to(0.5, { x: 10 }, { easing: "sineInOut" })
                    .to(0.5, { x: -10 }, { easing: "sineInOut" })
                    .union()
                    .repeatForever()
                    .start();
            }
        }
        this.totalBonusLabel.string = "x" + FrameSDK.convertCoinToStr(totalBonus);
        this.tips.string = "skey_071??&value1==" + FrameSDK.convertCoinToStr(totalBonus);
        this.scheduleOnce(() => {
            const offset =
                (cc.winSize.height - cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height) /
                2;
            this.scrollview.node.setContentSize(this.scrollview.node.width, this.scrollview.node.height + offset);
            this.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();
            if (scrollTarget != null) {
                const maxOffset = this.scrollview.getMaxScrollOffset();
                maxOffset.y = maxOffset.y * (scrollTarget / (tasks.length - 1));
                this.scrollview.scrollToOffset(maxOffset, 2);
            } else {
                this.scrollview.scrollToBottom(2);
            }
        });
    }

    onDisable(): void {
        this.node_content.children.forEach((child) => {
            child.active = false;
        });
        this.viewData?.closeCB?.();
    }
}
