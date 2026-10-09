import { CLICKLOCK } from "./CLICKLOCK";
import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_Task extends cc.Component {

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

    public static coinTarget: cc.Node = null;

    public static startTask(e?: any): void {
        if (FrameData.saveData.lvAwardinfo) {
            FrameSDK.openWindow("Panel_Task", {
                closeCB: e
            });
        } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            FrameSDK.openWindow("Panel_ActivityGuide", {
                type: 1,
                logoType: "levelReward",
                dtime: 2.5,
                text: "skey_072",
                closeCB: function () {
                    FrameSDK.openWindow("Panel_Task", {
                        closeCB: e
                    });
                }
            });
        } else if (e) {
            e();
        }
    }

    @CLICKLOCK()
    onBtnEvent(e: any, t: any): void {
        FrameSDK.logGameEvent("thepool_game_act", {
            object_action: "show",
            object_name: "lvrew_get"
        });
        FrameData.saveData.lvAwardinfo.push(Number(t));
        let a = FrameData.getCoinOutNum("free");
        const n = FrameData.FRAME_CONF.TaskConfig;
        for (let o = 0; o < n.length; o++) {
            const i = n[o];
            if (i.task_id.toString() == t) {
                a = i.task_num;
                break;
            }
        }
        FrameSDK.addCoin(a, 0, 0);
        this.onTouchClose();
    }

    onEnable(): void {
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        this.updateUi();
    }

    public static isTaskFinish(): boolean {
        if (FrameData.saveData.lvAwardinfo) {
            const e = FrameData.FRAME_CONF.TaskConfig.filter(function (task) {
                return -1 == FrameData.saveData.lvAwardinfo.indexOf(task.task_id);
            });
            for (let t = 0; t < e.length; t++) {
                if (FrameSDK.frameData.gameData.passLevel >= e[t].task_lv) {
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

    public static openTask(e: any): void {
        if (FrameData.saveData.lvAwardinfo == null && FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.taskLevel) {
            Panel_Task.startTask(e);
        }
    }

    onLoad(): void {
        this._close_target = Panel_Task.coinTarget;
        this._scrollViewDesignHeight = this.scrollview.node.height;
        if (FrameData.saveData.lvAwardinfo == null) {
            FrameData.saveData.lvAwardinfo = [];
            FrameSDK.logGameEvent("thepool_game_act", {
                object_action: "show",
                object_name: "lvrew_start"
            }, true);
        }
    }

    updateUi(): void {
        const self = this;
        const a = JSON.parse(JSON.stringify(FrameData.FRAME_CONF.TaskConfig)).reverse();
        const o = FrameSDK.frameData.gameData.passLevel;
        let n = null;
        let i = 0;
        for (let r = 0; r < a.length; r++) {
            const l = a[r];
            i += l.task_num;
            const child = this.node_content.children[r];
            const u = child != null ? child : cc.instantiate(this.node_content.children[0]);
            u.parent = this.node_content;
            const d = cc.find("box", u);
            cc.find("label_lv", u).getComponent(cc.Label).string = l.task_lv.toString();
            cc.find("label_coin", d).getComponent(cc.Label).string = "x" + FrameSDK.convertCoinToStr(l.task_num);
            const p = u.getComponent(cc.Button);
            p.interactable = o >= l.task_lv && -1 == FrameData.saveData.lvAwardinfo.indexOf(l.task_id);
            p.clickEvents[0].customEventData = l.task_id.toString();
            if (n === null) {
                if (p.interactable) {
                    n = r;
                } else if (o >= l.task_lv) {
                    n = r;
                }
            }
            const h = cc.find("toplight_taiq", d);
            const m = cc.find("light", d);
            const f = cc.find("mengban", d);
            const _ = cc.find("load1", u);
            const v = cc.find("lvhuang", u);
            if (o >= l.task_lv) {
                _.active = true;
                v.active = true;
                if (p.interactable) {
                    h.active = true;
                    m.active = true;
                    f.active = false;
                } else {
                    h.active = false;
                    m.active = false;
                    f.active = true;
                }
            } else {
                h.active = false;
                m.active = true;
                f.active = false;
                _.active = false;
                v.active = false;
            }
            d.stopAllActions();
            d.x = 0;
            if (h.active || l.task_lv - o == 1) {
                cc.tween(d).to(0.5, {
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
        this.totalBonusLabel.string = "x" + FrameSDK.convertCoinToStr(i);
        this.tips.string = "skey_071??&value1==" + FrameSDK.convertCoinToStr(i);
        this.scheduleOnce(function () {
            const extra = (cc.winSize.height - cc.director.getScene().getComponentInChildren(cc.Canvas).designResolution.height) / 2;
            self.scrollview.node.setContentSize(self.scrollview.node.width, self.scrollview.node.height + extra);
            self.scrollview.node.getComponentInChildren(cc.Widget).updateAlignment();
            if (n != null) {
                const offset = self.scrollview.getMaxScrollOffset();
                offset.y = offset.y * (n / (a.length - 1));
                self.scrollview.scrollToOffset(offset, 2);
            } else {
                self.scrollview.scrollToBottom(2);
            }
        });
    }

    onDisable(): void {
        this.node_content.children.forEach(function (e) {
            e.active = false;
        });
        const e = this.viewData;
        const closeCB = e.closeCB;
        if (closeCB) {
            closeCB.call(e);
        }
    }

}
