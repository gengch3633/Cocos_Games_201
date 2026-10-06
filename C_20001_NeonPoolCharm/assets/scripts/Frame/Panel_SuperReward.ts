import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Panel_SuperReward extends cc.Component {
    static coinTarget: cc.Node = null;

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

    _refreshTask(taskType: number): void {
        const superReward = FrameData.saveData.superReward;
        delete superReward.currentTask[taskType];
        const country = FrameData.myCountry.toUpperCase();
        const candidates: any[] = [];
        let totalWeight = 0;
        for (const task of FrameData.FRAME_CONF.SuperRewardTask) {
            if (
                task.task_type === taskType &&
                !(
                    (task.task_zone.length > 0 &&
                        task.task_zone.findIndex((zone: string) => zone.toUpperCase() === country) < 0) ||
                    (task.task_ban.length > 0 && task.task_ban.findIndex((zone: string) => zone.toUpperCase() === country) >= 0)
                )
            ) {
                const totalComplete = superReward.totalComplete[task.task_id] ?? 0;
                const todayComplete = superReward.todayComplete[task.task_id] ?? 0;
                if (!(totalComplete >= task.task_total || todayComplete >= task.task_daily)) {
                    candidates.push(task);
                    totalWeight += task.task_wgt;
                }
            }
        }
        let randomWeight = Math.random() * totalWeight;
        for (const task of candidates) {
            if (randomWeight < task.task_wgt) {
                FrameSDK.logGameEvent("thepool_task", {
                    object_action: "show",
                    object_name: "task_show",
                    object_notes: "" + task.task_id,
                });
                superReward.currentTask[taskType] = { id: task.task_id, people: 0, completed: false };
                break;
            }
            randomWeight -= task.task_wgt;
        }
    }

    static _checkTaskData(): void {
        const superReward = FrameData.saveData.superReward;
        const today = FrameSDK.getDateDay(FrameSDK.now);
        if (superReward && !(superReward.currentDate >= today)) {
            superReward.currentDate = today;
            superReward.todayComplete = {};
            superReward.currentTask = {};
            const country = FrameData.myCountry.toUpperCase();
            const grouped: { [key: number]: { tasks: any[]; totalWeight: number } } = {};
            for (const task of FrameData.FRAME_CONF.SuperRewardTask) {
                if (
                    (task.task_zone.length > 0 && task.task_zone.findIndex((zone: string) => zone.toUpperCase() === country) < 0) ||
                    (task.task_ban.length > 0 && task.task_ban.findIndex((zone: string) => zone.toUpperCase() === country) >= 0) ||
                    (superReward.totalComplete[task.task_id] ?? 0) >= task.task_total
                ) {
                    continue;
                }
                grouped[task.task_type] = grouped[task.task_type] ?? { tasks: [], totalWeight: 0 };
                grouped[task.task_type].tasks.push(task);
                grouped[task.task_type].totalWeight += task.task_wgt;
            }
            for (const typeKey of Object.keys(grouped)
                .map(Number)
                .sort((a, b) => a - b)) {
                const group = grouped[typeKey];
                let randomWeight = Math.random() * group.totalWeight;
                for (const task of group.tasks) {
                    if (randomWeight < task.task_wgt) {
                        FrameSDK.logGameEvent("thepool_task", {
                            object_action: "show",
                            object_name: "task_show",
                            object_notes: "" + task.task_id,
                        });
                        superReward.currentTask[typeKey] = { id: task.task_id, people: 0, completed: false };
                        break;
                    }
                    randomWeight -= task.task_wgt;
                }
            }
        }
    }

    onDisable(): void {
        cc.director.emit("UPDATA_SUPER_REWARD");
        this.viewData?.closeCB?.();
    }

    onClaimButtonClick(): void {
        const config = FrameData.FRAME_CONF.SuperRewardConfig;
        const superReward = FrameData.saveData.superReward;
        let totalComplete = 0;
        for (const key in superReward.totalComplete) {
            totalComplete += superReward.totalComplete[key];
        }
        let progress = Math.max(0, totalComplete - superReward.extraIndex * config.extraRewardRequirement);
        if (progress < config.extraRewardRequirement) {
            FrameSDK.showToast("skey_149??&value1==" + (config.extraRewardRequirement - progress));
        } else {
            superReward.extraIndex++;
            FrameSDK.addCoin(FrameSDK.randomInt(config.extraRewardRange), 0, 0);
            progress = Math.max(0, totalComplete - superReward.extraIndex * config.extraRewardRequirement);
            this.progressBar.progress = progress / config.extraRewardRequirement;
            this.progressLabel.string = progress + "/" + config.extraRewardRequirement;
            this.buttonProgressLabel.string =
                "skey_129??&value1==" + progress + "&value2==" + config.extraRewardRequirement;
        }
    }

    static hasTaskOrReward(): boolean {
        if (!FrameData.saveData.superReward) return false;
        const config = FrameData.FRAME_CONF.SuperRewardConfig;
        const superReward = FrameData.saveData.superReward;
        let totalComplete = 0;
        for (const key in superReward.totalComplete) {
            totalComplete += superReward.totalComplete[key];
        }
        if (Math.max(0, totalComplete - superReward.extraIndex * config.extraRewardRequirement) >= config.extraRewardRequirement) {
            return true;
        }
        Panel_SuperReward._checkTaskData();
        for (const key in superReward.currentTask) {
            if (superReward.currentTask[key] != null) {
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
        const config = FrameData.FRAME_CONF.SuperRewardConfig;
        const superReward = FrameData.saveData.superReward;
        const displayBonus = FrameSDK.convertCoinToStr(config.extraRewardDisplay);
        this.tipRichText.string =
            "skey_128??&value1==<color= #FFE956>" + config.extraRewardRequirement + "</c>&value2==" + displayBonus;
        this.maxBonusLabel.string = displayBonus;
        let totalComplete = 0;
        for (const key in superReward.totalComplete) {
            totalComplete += superReward.totalComplete[key];
        }
        const progress = Math.max(0, totalComplete - superReward.extraIndex * config.extraRewardRequirement);
        this.progressBar.progress = progress / config.extraRewardRequirement;
        this.progressLabel.string = progress + "/" + config.extraRewardRequirement;
        this.buttonProgressLabel.string =
            "skey_129??&value1==" + progress + "&value2==" + config.extraRewardRequirement;
        this.scrollView.content.removeAllChildren();
        const tasks = Object.keys(superReward.currentTask)
            .map((key) => {
                const current = superReward.currentTask[parseInt(key)];
                return FrameData.FRAME_CONF.SuperRewardTask.find((item: any) => item.task_id === current.id);
            })
            .sort((a, b) => b.task_coin - a.task_coin);
        const announceNumbers: number[] = [];
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            const current = superReward.currentTask[task.task_type];
            announceNumbers.push(task.task_coin);
            let row = this.scrollView.content.children[i];
            if (row) {
                row.active = true;
            } else {
                row = cc.instantiate(this.templateNode);
                row.setParent(this.scrollView.content);
            }
            row.x = 0;
            cc.find("bonus1Label", row).getComponent(cc.Label).string = "" + FrameSDK.convertCoinToStr(task.task_coin);
            cc.find("qipao/bonus2Label", row).getComponent(cc.Label).string =
                "" + FrameSDK.convertCoinToStr(task.task_coin, true);
            const remainingTotal = task.task_total - (superReward.totalComplete[current.id] ?? 0);
            const todayCount = superReward.todayComplete[current.id] ?? 0;
            cc.find("countRichText", row).getComponent(cc.RichText).string =
                "skey_130??&value1==" + todayCount + "&value2==" + Math.min(task.task_daily, remainingTotal + todayCount);
            const claimButton = cc.find("claimButton", row);
            const goButton = cc.find("goButton", row);
            const onClick = () => {
                if (current.completed) {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show",
                        object_name: "task_succ",
                        object_notes: "" + task.task_id,
                    });
                    superReward.todayComplete[task.task_id] = (superReward.todayComplete[task.task_id] ?? 0) + 1;
                    superReward.totalComplete[task.task_id] = (superReward.totalComplete[task.task_id] ?? 0) + 1;
                    this._refreshTask(task.task_type);
                    FrameSDK.addCoin(task.task_coin, 0, 0);
                    this.updateUi();
                } else {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show",
                        object_name: "task_open",
                        object_notes: "" + task.task_id,
                    });
                    FrameSDK.openWindow("Panel_SuperRewardTask", {
                        taskID: current.id,
                        announceNumbers,
                        callback: (success: boolean) => {
                            if (success || FrameData.SDK_CONF.NO_VIDEO) {
                                current.completed = true;
                                claimButton.active = true;
                                goButton.active = false;
                            } else {
                                FrameSDK.logGameEvent("thepool_task", {
                                    object_action: "show",
                                    object_name: "task_fail",
                                    object_notes: "" + task.task_id,
                                });
                            }
                        },
                    });
                }
            };
            claimButton.active = current.completed;
            claimButton.targetOff(this);
            claimButton.on("click", onClick, this);
            goButton.active = !current.completed;
            goButton.targetOff(this);
            goButton.on("click", onClick, this);
            switch (task.task_rule) {
                case 1:
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string =
                        "skey_132??&value1==<color= #F8FF41>" + (task.task_time[0] ?? 240) / 60 + "</c>";
                    break;
                case 2:
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string =
                        "skey_133??&value1==<color= #F8FF41>" + (task.task_time[0] ?? 180) / 60 + "</c>";
                    break;
                case 3:
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string =
                        "skey_134??&value2==<color= #F8FF41>" +
                        ((task.task_time[0] ?? 180) + (task.task_time[1] ?? 120)) / 60 +
                        "</c>";
                    break;
                default:
                    cc.find("tip1RichText", row).getComponent(cc.RichText).string = "";
            }
            let people = current.people;
            if (people < config.taskBonusTotal * config.taskPeopleInitRange[0] / 100) {
                people = Math.ceil(
                    config.taskBonusTotal *
                        FrameSDK.randomFloatNum(config.taskPeopleInitRange[0], config.taskPeopleInitRange[1]) /
                        100
                );
            } else if (people > config.taskBonusTotal) {
                people = Math.ceil(
                    config.taskBonusTotal * FrameSDK.randomFloatNum(config.taskPeopleLimit, 99) / 100
                );
            } else if (people < (config.taskBonusTotal * config.taskPeopleLimit) / 100) {
                people += Math.ceil(
                    config.taskBonusTotal *
                        FrameSDK.randomFloatNum(config.taskPeopleAddRange[0], config.taskPeopleAddRange[1]) /
                        100
                );
            }
            people = Math.min(people, config.taskBonusTotal - 10);
            current.people = people;
            cc.find("tip2RichText", row).getComponent(cc.RichText).string =
                "skey_135??&value1==" +
                config.taskBonusTotal +
                "&value2==" +
                people +
                "&value3==<color= #69D73C>" +
                (config.taskBonusTotal - people) +
                "</c>";
        }
        const children = this.scrollView.content.children;
        for (let i = tasks.length; i < children.length; i++) {
            children[i].active = false;
        }
        this.emptyNode.active = tasks.length <= 0;
    }

    static startSuperReward(closeCB?: () => void): void {
        if (!FrameSDK.frameData.gameData.noProfitAd && FrameData.FRAME_CONF.superRewardEnabled) {
            if (FrameData.saveData.superReward) {
                FrameSDK.openWindow("Panel_SuperReward", { closeCB });
            } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel) {
                FrameSDK.openWindow("Panel_GuideSuperReward", {
                    closeCB: () => {
                        FrameSDK.openWindow("Panel_SuperReward", { closeCB });
                    },
                });
            } else {
                closeCB?.();
            }
        } else {
            closeCB?.();
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
                currentTask: {},
            };
        }
        Panel_SuperReward._checkTaskData();
    }
}
