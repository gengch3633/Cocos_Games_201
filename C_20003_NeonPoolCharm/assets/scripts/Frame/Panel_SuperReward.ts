import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_SuperReward extends cc.Component {

    @property(cc.Node)
    panel_window: cc.Node = null;

    @property(cc.RichText)
    tipRichText: cc.RichText = null;

    @property(cc.Label)
    maxBonusLabel: cc.Label = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Label)
    progressLabel: cc.Label = null;

    @property(cc.Label)
    buttonProgressLabel: cc.Label = null;

    @property(cc.Node)
    emptyNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    templateNode: cc.Node = null;

    _close_target: cc.Node = null;

    viewData: any = null;

    hideTime: number = 0;

    public static coinTarget: cc.Node = null;

    _refreshTask(e: any): void {
        const o = FrameData.saveData.superReward;
        delete o.currentTask[e];
        const n = FrameData.myCountry.toUpperCase();
        const i = [];
        let s = 0;
        const u = FrameData.FRAME_CONF.SuperRewardTask;
        for (let l = 0; l < u.length; l++) {
            const _ = u[l];
            if (_.task_type === e && !(_.task_zone.length > 0 && _.task_zone.findIndex(function (zone) {
                return zone.toUpperCase() === n;
            }) < 0 || _.task_ban.length > 0 && _.task_ban.findIndex(function (zone) {
                return zone.toUpperCase() === n;
            }) >= 0)) {
                const totalValue = o.totalComplete[_.task_id];
                const todayValue = o.todayComplete[_.task_id];
                const d = totalValue != null ? totalValue : 0;
                const p = todayValue != null ? todayValue : 0;
                if (!(d >= _.task_total || p >= _.task_daily)) {
                    i.push(_);
                    s += _.task_wgt;
                }
            }
        }
        let h = Math.random() * s;
        const f = i;
        for (let m = 0; m < f.length; m++) {
            const _ = f[m];
            if (h < _.task_wgt) {
                FrameSDK.logGameEvent("thepool_task", {
                    object_action: "show",
                    object_name: "task_show",
                    object_notes: "" + _.task_id
                });
                o.currentTask[e] = {
                    id: _.task_id,
                    people: 0,
                    completed: false
                };
                break;
            }
            h -= _.task_wgt;
        }
    }

    public static _checkTaskData(): void {
        const a = FrameData.saveData.superReward;
        const o = FrameSDK.getDateDay(FrameSDK.now);
        if (a && !(a.currentDate >= o)) {
            a.currentDate = o;
            a.todayComplete = {};
            a.currentTask = {};
            const n = FrameData.myCountry.toUpperCase();
            const i: any = {};
            const l = FrameData.FRAME_CONF.SuperRewardTask;
            for (let s = 0; s < l.length; s++) {
                const v = l[s];
                let completeValue;
                if (!(v.task_zone.length > 0 && v.task_zone.findIndex(function (zone) {
                    return zone.toUpperCase() === n;
                }) < 0 || v.task_ban.length > 0 && v.task_ban.findIndex(function (zone) {
                    return zone.toUpperCase() === n;
                }) >= 0 || ((completeValue = a.totalComplete[v.task_id]) != null ? completeValue : 0) >= v.task_total)) {
                    const existing = i[v.task_type];
                    i[v.task_type] = existing != null ? existing : {
                        tasks: [],
                        totalWeight: 0
                    };
                    i[v.task_type].tasks.push(v);
                    i[v.task_type].totalWeight += v.task_wgt;
                }
            }
            const d = Object.keys(i).sort(function (e, t) {
                return parseInt(e) - parseInt(t);
            });
            for (let u = 0; u < d.length; u++) {
                const p = d[u];
                const h = i[parseInt(p)];
                let m = Math.random() * h.totalWeight;
                const _ = h.tasks;
                for (let f = 0; f < _.length; f++) {
                    const v = _[f];
                    if (m < v.task_wgt) {
                        FrameSDK.logGameEvent("thepool_task", {
                            object_action: "show",
                            object_name: "task_show",
                            object_notes: "" + v.task_id
                        });
                        a.currentTask[parseInt(p)] = {
                            id: v.task_id,
                            people: 0,
                            completed: false
                        };
                        break;
                    }
                    m -= v.task_wgt;
                }
            }
        }
    }

    onDisable(): void {
        cc.director.emit("UPDATA_SUPER_REWARD");
        const e = this.viewData;
        const closeCB = e.closeCB;
        if (closeCB) {
            closeCB.call(e);
        }
    }

    onClaimButtonClick(): void {
        const e = FrameData.FRAME_CONF.SuperRewardConfig;
        const t = FrameData.saveData.superReward;
        let a = 0;
        for (const o in t.totalComplete) {
            a += t.totalComplete[o];
        }
        let n = Math.max(0, a - t.extraIndex * e.extraRewardRequirement);
        if (n < e.extraRewardRequirement) {
            FrameSDK.showToast("skey_149??&value1==" + (e.extraRewardRequirement - n));
        } else {
            ++t.extraIndex;
            FrameSDK.addCoin(FrameSDK.randomInt(e.extraRewardRange), 0, 0);
            n = Math.max(0, a - t.extraIndex * e.extraRewardRequirement);
            this.progressBar.progress = n / e.extraRewardRequirement;
            this.progressLabel.string = n + "/" + e.extraRewardRequirement;
            this.buttonProgressLabel.string = "skey_129??&value1==" + n + "&value2==" + e.extraRewardRequirement;
        }
    }

    public static hasTaskOrReward(): boolean {
        if (!FrameData.saveData.superReward) {
            return false;
        }
        const e = FrameData.FRAME_CONF.SuperRewardConfig;
        const t = FrameData.saveData.superReward;
        let a = 0;
        for (const o in t.totalComplete) {
            a += t.totalComplete[o];
        }
        if (Math.max(0, a - t.extraIndex * e.extraRewardRequirement) >= e.extraRewardRequirement) {
            return true;
        }
        this._checkTaskData();
        for (const o in t.currentTask) {
            if (t.currentTask[o] != null) {
                return true;
            }
        }
        return false;
    }

    close(): void {
        if (Date.now() - this.hideTime <= 300) {
            console.log("wait!!!，return");
        } else {
            this.hideTime = Date.now();
            FrameSDK.closeEffect(this, null);
        }
    }

    updateUi(): void {
        const s = this;
        const l = FrameData.FRAME_CONF.SuperRewardConfig;
        const u = FrameData.saveData.superReward;
        const d = FrameSDK.convertCoinToStr(l.extraRewardDisplay);
        this.tipRichText.string = "skey_128??&value1==<color= #FFE956>" + l.extraRewardRequirement + "</c>&value2==" + d;
        this.maxBonusLabel.string = d;
        let p = 0;
        for (const h in u.totalComplete) {
            p += u.totalComplete[h];
        }
        const m = Math.max(0, p - u.extraIndex * l.extraRewardRequirement);
        this.progressBar.progress = m / l.extraRewardRequirement;
        this.progressLabel.string = m + "/" + l.extraRewardRequirement;
        this.buttonProgressLabel.string = "skey_129??&value1==" + m + "&value2==" + l.extraRewardRequirement;
        this.scrollView.content.removeAllChildren();
        const f = Object.keys(u.currentTask).map(function (e) {
            const t = u.currentTask[parseInt(e)];
            return FrameData.FRAME_CONF.SuperRewardTask.find(function (task) {
                return task.task_id === t.id;
            });
        }).sort(function (e, t) {
            return t.task_coin - e.task_coin;
        });
        const announceNumbers = [];
        const y = this;
        for (let g = 0; g < f.length; g++) {
            const task = f[g];
            const h = u.currentTask[task.task_type];
            announceNumbers.push(task.task_coin);
            let row = y.scrollView.content.children[g];
            if (row) {
                row.active = true;
            } else {
                row = cc.instantiate(y.templateNode);
                row.setParent(y.scrollView.content);
            }
            row.x = 0;
            cc.find("bonus1Label", row).getComponent(cc.Label).string = "" + FrameSDK.convertCoinToStr(task.task_coin);
            cc.find("qipao/bonus2Label", row).getComponent(cc.Label).string = "" + FrameSDK.convertCoinToStr(task.task_coin, true);
            const totalValue = u.totalComplete[h.id];
            const todayValue = u.todayComplete[h.id];
            const remain = task.task_total - (totalValue != null ? totalValue : 0);
            const today = todayValue != null ? todayValue : 0;
            cc.find("countRichText", row).getComponent(cc.RichText).string = "skey_130??&value1==" + today + "&value2==" + Math.min(task.task_daily, remain + today);
            const D = cc.find("claimButton", row);
            const F = cc.find("goButton", row);
            const b = function () {
                if (h.completed) {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show",
                        object_name: "task_succ",
                        object_notes: "" + task.task_id
                    });
                    const todayCount = u.todayComplete[task.task_id];
                    const totalCount = u.totalComplete[task.task_id];
                    u.todayComplete[task.task_id] = (todayCount != null ? todayCount : 0) + 1;
                    u.totalComplete[task.task_id] = (totalCount != null ? totalCount : 0) + 1;
                    s._refreshTask(task.task_type);
                    FrameSDK.addCoin(task.task_coin, 0, 0);
                    s.updateUi();
                } else {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show",
                        object_name: "task_open",
                        object_notes: "" + task.task_id
                    });
                    FrameSDK.openWindow("Panel_SuperRewardTask", {
                        taskID: h.id,
                        announceNumbers: announceNumbers,
                        callback: function (success) {
                            if (success || FrameData.SDK_CONF.NO_VIDEO) {
                                h.completed = true;
                                D.active = true;
                                F.active = false;
                            } else {
                                FrameSDK.logGameEvent("thepool_task", {
                                    object_action: "show",
                                    object_name: "task_fail",
                                    object_notes: "" + task.task_id
                                });
                            }
                        }
                    });
                }
            };
            D.active = h.completed;
            D.targetOff(y);
            D.on("click", b, y);
            F.active = !h.completed;
            F.targetOff(y);
            F.on("click", b, y);
            switch (task.task_rule) {
                case 1: {
                    const time1 = task.task_time[0];
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string = "skey_132??&value1==<color= #F8FF41>" + (time1 != null ? time1 : 240) / 60 + "</c>";
                    break;
                }
                case 2: {
                    const time2 = task.task_time[0];
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string = "skey_133??&value1==<color= #F8FF41>" + (time2 != null ? time2 : 180) / 60 + "</c>";
                    break;
                }
                case 3: {
                    const time3a = task.task_time[0];
                    const time3b = task.task_time[1];
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string = "skey_134??&value2==<color= #F8FF41>" + ((time3a != null ? time3a : 180) + (time3b != null ? time3b : 120)) / 60 + "</c>";
                    break;
                }
                default:
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string = "";
            }
            let C = h.people;
            if (C < l.taskBonusTotal * l.taskPeopleInitRange[0] / 100) {
                C = Math.ceil(l.taskBonusTotal * FrameSDK.randomFloatNum(l.taskPeopleInitRange[0], l.taskPeopleInitRange[1]) / 100);
            } else if (C > l.taskBonusTotal) {
                C = Math.ceil(l.taskBonusTotal * FrameSDK.randomFloatNum(l.taskPeopleLimit, 99) / 100);
            } else if (C < l.taskBonusTotal * l.taskPeopleLimit / 100) {
                C += Math.ceil(l.taskBonusTotal * FrameSDK.randomFloatNum(l.taskPeopleAddRange[0], l.taskPeopleAddRange[1]) / 100);
            }
            C = Math.min(C, l.taskBonusTotal - 10);
            h.people = C;
            cc.find("tip2RichText", row).getComponent(cc.RichText).string = "skey_135??&value1==" + l.taskBonusTotal + "&value2==" + C + "&value3==<color= #69D73C>" + (l.taskBonusTotal - C) + "</c>";
        }
        const children = this.scrollView.content.children;
        const childCount = children.length;
        for (let g = f.length; g < childCount; g++) {
            children[g].active = false;
        }
        this.emptyNode.active = f.length <= 0;
    }

    public static startSuperReward(e?: any): void {
        if (!FrameSDK.frameData.gameData.noProfitAd && FrameData.FRAME_CONF.superRewardEnabled) {
            if (FrameData.saveData.superReward) {
                FrameSDK.openWindow("Panel_SuperReward", {
                    closeCB: e
                });
            } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel) {
                FrameSDK.openWindow("Panel_GuideSuperReward", {
                    closeCB: function () {
                        FrameSDK.openWindow("Panel_SuperReward", {
                            closeCB: e
                        });
                    }
                });
            } else if (e) {
                e();
            }
        } else if (e) {
            e();
        }
    }

    onEnable(): void {
        this.panel_window.width = cc.winSize.width;
        this.panel_window.height = cc.winSize.height;
        if (cc.winSize.width / cc.winSize.height < 0.56) {
            this.panel_window.height = cc.winSize.height - 70;
            this.panel_window.y = -35;
        } else {
            this.panel_window.y = 0;
        }
        FrameSDK.openEffect(this);
        FrameSDK.playEffect("page_show");
        cc.director.emit("UPDATA_SUPER_REWARD");
        this.updateUi();
    }

    onLoad(): void {
        this._close_target = Panel_SuperReward.coinTarget;
        if (!FrameData.saveData.superReward) {
            FrameData.saveData.superReward = {
                currentDate: 0,
                extraIndex: 0,
                totalComplete: {},
                todayComplete: {},
                currentTask: {}
            };
        }
        Panel_SuperReward._checkTaskData();
    }

}
