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

    static startTask(closeCB?: Function): void {
        if (FrameData.saveData.lvAwardinfo) {
            FrameSDK.openWindow("Panel_Task", {
                closeCB: closeCB
            });
        } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            FrameSDK.openWindow("Panel_ActivityGuide", {
                type: 1, logoType: "levelReward", dtime: 2.5, text: "skey_072", closeCB: () => {
                    FrameSDK.openWindow("Panel_Task", {
                        closeCB: closeCB
                    });
                }
            });
        } else {
            closeCB?.();
        }
    }

    @CLICKLOCK()
    onBtnEvent(_event: cc.Event, customData: string): void {
        FrameSDK.logGameEvent("thepool_game_act", {
            object_action: "show", object_name: "lvrew_get"
        });
        FrameData.saveData.lvAwardinfo.push(Number(customData));
        let rewardAmount = FrameData.getCoinOutNum("free");
        for (const taskConfig of FrameData.FRAME_CONF.TaskConfig) {
            if (taskConfig.task_id.toString() == customData) {
                rewardAmount = taskConfig.task_num;
                break;
            }
        }
        FrameSDK.addCoin(rewardAmount, 0, 0);
        this.onTouchClose();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        this.updateUi();
    }

    static isTaskFinish(): boolean {
        if (FrameData.saveData.lvAwardinfo) {
            const pendingTasks = FrameData.FRAME_CONF.TaskConfig.filter((taskConfig) => {
                return FrameData.saveData.lvAwardinfo.indexOf(taskConfig.task_id) == -1;
            });
            for (let i = 0; i < pendingTasks.length; i++) {
                if (FrameSDK.frameData.gameData.passLevel >= pendingTasks[i].task_lv) {
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

    static openTask(closeCB?: Function): void {
        if (FrameData.saveData.lvAwardinfo == null && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            Panel_Task.startTask(closeCB);
        }
    }

    onLoad(): void {
        this._close_target = Panel_Task.coinTarget;
        this._scrollViewDesignHeight = this.scrollview.node.height;
        if (FrameData.saveData.lvAwardinfo == null) {
            FrameData.saveData.lvAwardinfo = [];
            FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show", object_name: "lvrew_start"
            }, true);
        }
    }

    updateUi(): void {
        const taskList = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.TaskConfig)).reverse();
        const passLevel = FrameSDK.frameData.gameData.passLevel;
        let scrollTargetIndex: number = null;
        let totalBonus = 0;
        for (let i = 0; i < taskList.length; i++) {
            const taskConfig = taskList[i];
            totalBonus += taskConfig.task_num;
            const itemNode = this.node_content.children[i] ?? cc.instantiate(this.node_content.children[0]);
            itemNode.parent = this.node_content;
            const boxNode = cc.find("box", itemNode);
            cc.find("label_lv", itemNode).getComponent(cc.Label).string = taskConfig.task_lv.toString();
            cc.find("label_coin", boxNode).getComponent(cc.Label).string = "x" + FrameSDK.convertCoinToStr(taskConfig.task_num);
            const button = itemNode.getComponent(cc.Button);
            button.interactable = passLevel >= taskConfig.task_lv && FrameData.saveData.lvAwardinfo.indexOf(taskConfig.task_id) == -1;
            button.clickEvents[0].customEventData = taskConfig.task_id.toString();
            if (scrollTargetIndex === null) {
                if (button.interactable) {
                    scrollTargetIndex = i;
                } else if (passLevel >= taskConfig.task_lv) {
                    scrollTargetIndex = i;
                }
            }
            const topLight = cc.find("toplight_taiq", boxNode);
            const light = cc.find("light", boxNode);
            const mask = cc.find("mengban", boxNode);
            const loadNode = cc.find("load1", itemNode);
            const levelBadge = cc.find("lvhuang", itemNode);
            if (passLevel >= taskConfig.task_lv) {
                loadNode.active = true;
                levelBadge.active = true;
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
                loadNode.active = false;
                levelBadge.active = false;
            }
            boxNode.stopAllActions();
            boxNode.x = 0;
            if (topLight.active || taskConfig.task_lv - passLevel == 1) {
                cc.tween(boxNode).to(0.5, {
                    x: 10
                }, {
                    easing: "sineInOut"
                }).to(0.5, {
                    x: -10
                }, {
                    easing: "sineInOut"
                }).union().repeatForever().start();
            }
        }
        this.totalBonusLabel.string = "x" + FrameSDK.convertCoinToStr(totalBonus);
        this.tips.string = "skey_071??&value1==" + FrameSDK.convertCoinToStr(totalBonus);
        this.scheduleOnce(() => {
            const heightOffset = (cc.winSize.height - cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height) / 2;
            this.scrollview.node.setContentSize(this.scrollview.node.width, this.scrollview.node.height + heightOffset);
            this.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();
            if (scrollTargetIndex != null) {
                const maxOffset = this.scrollview.getMaxScrollOffset();
                maxOffset.y = maxOffset.y * (scrollTargetIndex / (taskList.length - 1));
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
