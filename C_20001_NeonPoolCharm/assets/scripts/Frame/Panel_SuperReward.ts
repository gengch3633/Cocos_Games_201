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
        for (const taskConfig of FrameData.FRAME_CONF.SuperRewardTask) {
            if (taskConfig.task_type === taskType
                && !(taskConfig.task_zone.length > 0 && taskConfig.task_zone.findIndex((zone) => zone.toUpperCase() === country) < 0
                    || taskConfig.task_ban.length > 0 && taskConfig.task_ban.findIndex((zone) => zone.toUpperCase() === country) >= 0)) {
                const totalComplete = superReward.totalComplete[taskConfig.task_id] ?? 0;
                const todayComplete = superReward.todayComplete[taskConfig.task_id] ?? 0;
                if (!(totalComplete >= taskConfig.task_total || todayComplete >= taskConfig.task_daily)) {
                    candidates.push(taskConfig);
                    totalWeight += taskConfig.task_wgt;
                }
            }
        }
        let randomWeight = Math.random() * totalWeight;
        for (const taskConfig of candidates) {
            if (randomWeight < taskConfig.task_wgt) {
                FrameSDK.logGameEvent("thepool_task", {
                    object_action: "show", object_name: "task_show", object_notes: "" + taskConfig.task_id
                });
                superReward.currentTask[taskType] = {
                    id: taskConfig.task_id,
                    people: 0,
                    completed: false
                };
                break;
            }
            randomWeight -= taskConfig.task_wgt;
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
            const groupedTasks: { [key: number]: { tasks: any[]; totalWeight: number } } = {};
            for (const taskConfig of FrameData.FRAME_CONF.SuperRewardTask) {
                if (!(taskConfig.task_zone.length > 0 && taskConfig.task_zone.findIndex((zone) => zone.toUpperCase() === country) < 0
                    || taskConfig.task_ban.length > 0 && taskConfig.task_ban.findIndex((zone) => zone.toUpperCase() === country) >= 0
                    || (superReward.totalComplete[taskConfig.task_id] ?? 0) >= taskConfig.task_total)) {
                    groupedTasks[taskConfig.task_type] = groupedTasks[taskConfig.task_type] ?? {
                        tasks: [],
                        totalWeight: 0
                    };
                    groupedTasks[taskConfig.task_type].tasks.push(taskConfig);
                    groupedTasks[taskConfig.task_type].totalWeight += taskConfig.task_wgt;
                }
            }
            for (const taskTypeKey of Object.keys(groupedTasks).sort((a, b) => parseInt(a) - parseInt(b))) {
                const group = groupedTasks[parseInt(taskTypeKey)];
                let randomWeight = Math.random() * group.totalWeight;
                for (const taskConfig of group.tasks) {
                    if (randomWeight < taskConfig.task_wgt) {
                        FrameSDK.logGameEvent("thepool_task", {
                            object_action: "show", object_name: "task_show", object_notes: "" + taskConfig.task_id
                        });
                        superReward.currentTask[parseInt(taskTypeKey)] = {
                            id: taskConfig.task_id,
                            people: 0,
                            completed: false
                        };
                        break;
                    }
                    randomWeight -= taskConfig.task_wgt;
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
        let totalCompleted = 0;
        for (const key in superReward.totalComplete) {
            totalCompleted += superReward.totalComplete[key];
        }
        let progress = Math.max(0, totalCompleted - superReward.extraIndex * config.extraRewardRequirement);
        if (progress < config.extraRewardRequirement) {
            FrameSDK.showToast("skey_149??&value1==" + (config.extraRewardRequirement - progress));
        } else {
            superReward.extraIndex++;
            FrameSDK.addCoin(FrameSDK.randomInt(config.extraRewardRange), 0, 0);
            progress = Math.max(0, totalCompleted - superReward.extraIndex * config.extraRewardRequirement);
            this.progressBar.progress = progress / config.extraRewardRequirement;
            this.progressLabel.string = progress + "/" + config.extraRewardRequirement;
            this.buttonProgressLabel.string = "skey_129??&value1==" + progress + "&value2==" + config.extraRewardRequirement;
        }
    }

    static hasTaskOrReward(): boolean {
        if (!FrameData.saveData.superReward) {
            return false;
        }
        const config = FrameData.FRAME_CONF.SuperRewardConfig;
        const superReward = FrameData.saveData.superReward;
        let totalCompleted = 0;
        for (const key in superReward.totalComplete) {
            totalCompleted += superReward.totalComplete[key];
        }
        if (Math.max(0, totalCompleted - superReward.extraIndex * config.extraRewardRequirement) >= config.extraRewardRequirement) {
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
        this.tipRichText.string = "skey_128??&value1==<color= #FFE956>" + config.extraRewardRequirement + "</c>&value2==" + displayBonus;
        this.maxBonusLabel.string = displayBonus;
        let totalCompleted = 0;
        for (const key in superReward.totalComplete) {
            totalCompleted += superReward.totalComplete[key];
        }
        const progress = Math.max(0, totalCompleted - superReward.extraIndex * config.extraRewardRequirement);
        this.progressBar.progress = progress / config.extraRewardRequirement;
        this.progressLabel.string = progress + "/" + config.extraRewardRequirement;
        this.buttonProgressLabel.string = "skey_129??&value1==" + progress + "&value2==" + config.extraRewardRequirement;
        this.scrollView.content.removeAllChildren();
        const sortedTasks = Object.keys(superReward.currentTask).map((key) => {
            const currentTask = superReward.currentTask[parseInt(key)];
            return FrameData.FRAME_CONF.SuperRewardTask.find((item) => item.task_id === currentTask.id);
        }).sort((a, b) => b.task_coin - a.task_coin);
        const announceNumbers: number[] = [];
        for (let i = 0; i < sortedTasks.length; i++) {
            const taskConfig = sortedTasks[i];
            const currentTask = superReward.currentTask[taskConfig.task_type];
            announceNumbers.push(taskConfig.task_coin);
            let itemNode = this.scrollView.content.children[i];
            if (itemNode) {
                itemNode.active = true;
            } else {
                itemNode = cc.instantiate(this.templateNode);
                itemNode.setParent(this.scrollView.content);
            }
            itemNode.x = 0;
            cc.find("bonus1Label", itemNode).getComponent(cc.Label).string = "" + FrameSDK.convertCoinToStr(taskConfig.task_coin);
            cc.find("qipao/bonus2Label", itemNode).getComponent(cc.Label).string = "" + FrameSDK.convertCoinToStr(taskConfig.task_coin, true);
            const remainingTotal = taskConfig.task_total - (superReward.totalComplete[currentTask.id] ?? 0);
            const todayCount = superReward.todayComplete[currentTask.id] ?? 0;
            cc.find("countRichText", itemNode).getComponent(cc.RichText).string = "skey_130??&value1==" + todayCount + "&value2==" + Math.min(taskConfig.task_daily, remainingTotal + todayCount);
            const claimButton = cc.find("claimButton", itemNode);
            const goButton = cc.find("goButton", itemNode);
            const onButtonClick = () => {
                if (currentTask.completed) {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show", object_name: "task_succ", object_notes: "" + taskConfig.task_id
                    });
                    superReward.todayComplete[taskConfig.task_id] = (superReward.todayComplete[taskConfig.task_id] ?? 0) + 1;
                    superReward.totalComplete[taskConfig.task_id] = (superReward.totalComplete[taskConfig.task_id] ?? 0) + 1;
                    this._refreshTask(taskConfig.task_type);
                    FrameSDK.addCoin(taskConfig.task_coin, 0, 0);
                    this.updateUi();
                } else {
                    FrameSDK.logGameEvent("thepool_task", {
                        object_action: "show", object_name: "task_open", object_notes: "" + taskConfig.task_id
                    });
                    FrameSDK.openWindow("Panel_SuperRewardTask", {
                        taskID: currentTask.id, announceNumbers: announceNumbers, callback: (success: boolean) => {
                            if (success || FrameData.SDK_CONF.NO_VIDEO) {
                                currentTask.completed = true;
                                claimButton.active = true;
                                goButton.active = false;
                            } else {
                                FrameSDK.logGameEvent("thepool_task", {
                                    object_action: "show", object_name: "task_fail", object_notes: "" + taskConfig.task_id
                                });
                            }
                        }
                    });
                }
            };
            claimButton.active = currentTask.completed;
            claimButton.targetOff(this);
            claimButton.on("click", onButtonClick, this);
            goButton.active = !currentTask.completed;
            goButton.targetOff(this);
            goButton.on("click", onButtonClick, this);
            switch (taskConfig.task_rule) {
                case 1:
                    cc.find("tip1RichText", itemNode).getComponent(cc.RichText).string = "skey_132??&value1==<color= #F8FF41>" + (taskConfig.task_time[0] ?? 240) / 60 + "</c>";
                    break;
                case 2:
                    cc.find("tip1RichText", itemNode).getComponent(cc.RichText).string = "skey_133??&value1==<color= #F8FF41>" + (taskConfig.task_time[0] ?? 180) / 60 + "</c>";
                    break;
                case 3:
                    cc.find("tip1RichText", itemNode).getComponent(cc.RichText).string = "skey_134??&value2==<color= #F8FF41>" + ((taskConfig.task_time[0] ?? 180) + (taskConfig.task_time[1] ?? 120)) / 60 + "</c>";
                    break;
                default:
                    cc.find("tip1RichText", itemNode).getComponent(cc.RichText).string = "";
            }
            let people = currentTask.people;
            if (people < config.taskBonusTotal * config.taskPeopleInitRange[0] / 100) {
                people = Math.ceil(config.taskBonusTotal * FrameSDK.randomFloatNum(config.taskPeopleInitRange[0], config.taskPeopleInitRange[1]) / 100);
            } else if (people > config.taskBonusTotal) {
                people = Math.ceil(config.taskBonusTotal * FrameSDK.randomFloatNum(config.taskPeopleLimit, 99) / 100);
            } else if (people < config.taskBonusTotal * config.taskPeopleLimit / 100) {
                people += Math.ceil(config.taskBonusTotal * FrameSDK.randomFloatNum(config.taskPeopleAddRange[0], config.taskPeopleAddRange[1]) / 100);
            }
            people = Math.min(people, config.taskBonusTotal - 10);
            currentTask.people = people;
            cc.find("tip2RichText", itemNode).getComponent(cc.RichText).string = "skey_135??&value1==" + config.taskBonusTotal + "&value2==" + people + "&value3==<color= #69D73C>" + (config.taskBonusTotal - people) + "</c>";
        }
        const contentChildren = this.scrollView.content.children;
        const childCount = contentChildren.length;
        for (let i = sortedTasks.length; i < childCount; i++) {
            contentChildren[i].active = false;
        }
        this.emptyNode.active = sortedTasks.length <= 0;
    }

    static startSuperReward(closeCB?: Function): void {
        if (!FrameSDK.frameData.gameData.noProfitAd && FrameData.FRAME_CONF.superRewardEnabled) {
            if (FrameData.saveData.superReward) {
                FrameSDK.openWindow("Panel_SuperReward", {
                    closeCB: closeCB
                });
            } else if (FrameSDK.frameData.gameData.passLevel >= FrameData.FRAME_CONF.superRewardLevel) {
                FrameSDK.openWindow("Panel_GuideSuperReward", {
                    closeCB: () => {
                        FrameSDK.openWindow("Panel_SuperReward", {
                            closeCB: closeCB
                        });
                    }
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
                currentDate: 0, extraIndex: 0, totalComplete: {},
                todayComplete: {},
                currentTask: {}
            };
        }
        Panel_SuperReward._checkTaskData();
    }
}
