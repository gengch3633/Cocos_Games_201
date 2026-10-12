import "./UserData";
import AdManager from "./AdManager";
import ArrowRewardService from "./ArrowRewardService";
import ArrowSettleRewardView from "./arrowSettleRewardView";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";
import ResMgr from "./ResMgr";
import Tips from "./Tips";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserInfoService from "./UserInfoService";

const { ccclass, property } = cc._decorator;

interface ITaskData {
    id: string;
    status: number;
    ifDaily: boolean;
    claimTaskType: string;
    desc: string;
    taskType: string;
    reward: number;
    taskReward: number;
    showAmount: number;
    finishedNum: number;
    taskNum: number;
    taskTargetNum: number | null;
    raw: any;
}

interface ITaskItemRefs {
    rewardLabel: cc.Label | null;
    descLabel: cc.Label | null;
    rewardIconSprite: cc.Sprite | null;
    progressBg: cc.Node | null;
    progressFill: cc.Node | null;
    progressLabel: cc.Label | null;
    btnNode: cc.Node | null;
    btnLabel: cc.Label | null;
    btnOutline: cc.LabelOutline | null;
    btnSprite: cc.Sprite | null;
    btnComp: cc.Button | null;
}

type ITaskItemNode = cc.Node & {
    _taskData?: any;
    _taskItemRefs?: ITaskItemRefs;
};

interface IClaimParams {
    businessType: string;
    taskType: string;
    taskId: string;
    fallbackOnAdFail?: boolean;
}

@ccclass
export default class arrowTaskPopupView extends cc.Component {

    currentTab: string = "daily";
    rawTaskList: any[] = [];
    rawDailyTaskList: any[] = [];
    rawCareerTaskList: any[] = [];
    dailyTaskList: ITaskData[] = [];
    careerTaskList: ITaskData[] = [];
    taskItemPrefab: cc.Prefab = null;
    taskItemPool: cc.NodePool = new cc.NodePool();
    activeTaskNodes: ITaskItemNode[] = [];
    isLoading: boolean = false;
    isTaskClaiming: boolean = false;

    btnGoSpriteFrame: cc.SpriteFrame = null;
    btnClaimSpriteFrame: cc.SpriteFrame = null;
    btnFinishSpriteFrame: cc.SpriteFrame = null;
    titleBgSpriteFrame: cc.SpriteFrame = null;
    rewardIconSpriteFrame: cc.SpriteFrame = null;
    rewardIconReqVersion: number = 0;

    dailyInfoClaimableCount: number = 0;
    careerInfoClaimableCount: number = 0;
    hasRequestedDailyTask: boolean = false;
    hasRequestedCareerTask: boolean = false;
    isDailyLoading: boolean = false;
    isCareerLoading: boolean = false;
    loadingVisibleCount: number = 0;

    maskNode: cc.Node = null;
    panelNode: cc.Node = null;
    btnClose: cc.Node = null;
    titleBgNode: cc.Node = null;
    titleBgSprite: cc.Sprite = null;
    lblTitle: cc.Label = null;
    scrollViewNode: cc.Node = null;
    scrollView: cc.ScrollView = null;
    scrollViewView: cc.Node = null;
    scrollContent: cc.Node = null;
    btnTabDaily: cc.Node = null;
    btnTabCareer: cc.Node = null;
    tabRootNode: cc.Node = null;
    lblTabDaily: cc.Label = null;
    lblTabCareer: cc.Label = null;
    lblTabHeader: cc.Label = null;
    tabDailyActiveBg: cc.Node = null;
    tabDailyInactiveBg: cc.Node = null;
    tabCareerActiveBg: cc.Node = null;
    tabCareerInactiveBg: cc.Node = null;
    tabDailyRedPoint: cc.Node = null;
    tabCareerRedPoint: cc.Node = null;

    onLoad(): void {
        this.bindNodes();
        this.preloadButtonSpriteFrames();
        this.loadRewardIconSpriteFrame();
        this.bindEvents();
        this.bindLanguageEvent();
        this.initClaimableCountsFromInfo();
        this.refreshStaticTexts();
        this.loadTaskItemPrefab();
        this.ensureTabTaskRequested(this.currentTab);
    }

    onDestroy(): void {
        this.clearRequestLoading();
        this.unbindLanguageEvent();
        this.unbindEvents();
        this.recycleAllTaskNodes();
        if (this.taskItemPool) {
            this.taskItemPool.clear();
        }
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshStaticTexts();
        this.loadRewardIconSpriteFrame();
        this.renderActiveTab();
    }

    bindNodes(): void {
        this.maskNode = this.findNodeDeep(this.node, "mask");
        this.panelNode = this.findNodeDeep(this.node, "block_panel");
        this.btnClose = this.findNodeDeep(this.node, "btn_close");
        this.titleBgNode = this.findNodeDeep(this.node, "lbl_title");
        this.titleBgSprite = this.titleBgNode ? this.titleBgNode.getComponent(cc.Sprite) : null;
        this.lblTitle = this.findLabelDeep(this.node, "lbl_title_text") || this.findLabelDeep(this.node, "lbl_title");
        this.scrollViewNode = this.findNodeDeep(this.node, "scroll_view");
        this.scrollView = this.scrollViewNode ? this.scrollViewNode.getComponent(cc.ScrollView) : null;
        this.scrollViewView = this.findNodeDeep(this.scrollViewNode, "view");
        this.scrollContent = this.findNodeDeep(this.scrollViewNode, "content");
        this.btnTabDaily = this.findNodeDeep(this.node, "btn_tab_daily");
        this.btnTabCareer = this.findNodeDeep(this.node, "btn_tab_career");
        this.tabRootNode = this.findNodeDeep(this.node, "tab_root");
        this.lblTabDaily = this.findLabelDeep(this.node, "lbl_tab_daily");
        this.lblTabCareer = this.findLabelDeep(this.node, "lbl_tab_career");
        this.lblTabHeader = this.findLabelDeep(this.node, "lbl_tab_header");
        this.tabDailyActiveBg = this.findNodeDeep(this.btnTabDaily, "img_tab_daily_active");
        this.tabDailyInactiveBg = this.findNodeDeep(this.btnTabDaily, "img_tab_daily_inactive");
        this.tabCareerActiveBg = this.findNodeDeep(this.btnTabCareer, "img_tab_career_active");
        this.tabCareerInactiveBg = this.findNodeDeep(this.btnTabCareer, "img_tab_career_inactive");
        this.tabDailyRedPoint = this.findNodeDeep(this.btnTabDaily, "tab_daily_red_point");
        this.tabCareerRedPoint = this.findNodeDeep(this.btnTabCareer, "tab_career_red_point");
    }

    bindEvents(): void {
        if (this.maskNode) {
            this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.btnClose) {
            this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.panelNode) {
            this.panelNode.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
            this.panelNode.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        }
        if (this.btnTabDaily) {
            this.btnTabDaily.on(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
        }
        if (this.btnTabCareer) {
            this.btnTabCareer.on(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
        }
    }

    unbindEvents(): void {
        if (this.maskNode) {
            this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.btnClose) {
            this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.panelNode) {
            this.panelNode.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
            this.panelNode.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        }
        if (this.btnTabDaily) {
            this.btnTabDaily.off(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
        }
        if (this.btnTabCareer) {
            this.btnTabCareer.off(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
        }
    }

    onTouchInsidePanel(event: cc.Event.EventTouch): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    }

    refreshStaticTexts(): void {
        this.ensureTitleBackground();
        this.setLabelText(this.lblTitle, this.i18n("key_task_popup_title", null, "Task"));
        this.setLabelText(this.lblTabDaily, this.i18n("key_task_tab_daily", null, "Daily task"));
        this.setLabelText(this.lblTabCareer, this.i18n("key_task_tab_career", null, "Career task"));
        this.refreshTabVisual();
    }

    preloadButtonSpriteFrames(): void {
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_go_bg", cc.SpriteFrame, this, "ui").then((frame: cc.SpriteFrame) => {
            if (frame) {
                this.btnGoSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_claim_bg", cc.SpriteFrame, this, "ui").then((frame: cc.SpriteFrame) => {
            if (frame) {
                this.btnClaimSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_finish", cc.SpriteFrame, this, "ui").then((frame: cc.SpriteFrame) => {
            if (frame) {
                this.btnFinishSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_popup_title_bg", cc.SpriteFrame, this, "ui").then((frame: cc.SpriteFrame) => {
            if (frame) {
                this.titleBgSpriteFrame = frame;
                this.ensureTitleBackground();
            }
        });
    }

    loadRewardIconSpriteFrame(): void {
        const primaryPath = CountryAssetService.getPathByImageName("money_arrow_icon");
        const fallbackPath = CountryAssetService.getPathByImageName("money_arrow_icon", "ID");
        const requestVersion = ++this.rewardIconReqVersion;
        const applyFrame = (frame: cc.SpriteFrame) => {
            if (frame && requestVersion === this.rewardIconReqVersion && cc.isValid(this.node)) {
                this.rewardIconSpriteFrame = frame;
                this.applyRewardIconToActiveItems();
            }
        };
        ResMgr.getInstance().loadRes(primaryPath, cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
            if (frame) {
                applyFrame(frame);
            } else if (fallbackPath && fallbackPath !== primaryPath) {
                ResMgr.getInstance().loadRes(fallbackPath, cc.SpriteFrame, this, "game").then((fallbackFrame: cc.SpriteFrame) => {
                    if (fallbackFrame) {
                        applyFrame(fallbackFrame);
                    } else {
                        cc.warn("[arrowTaskPopupView] load reward icon fallback failed:", fallbackPath);
                    }
                });
            } else {
                cc.warn("[arrowTaskPopupView] load reward icon failed:", primaryPath);
            }
        });
    }

    applyRewardIconToActiveItems(): void {
        if (!this.rewardIconSpriteFrame || !this.activeTaskNodes) {
            return;
        }
        for (let i = 0; i < this.activeTaskNodes.length; i++) {
            const node = this.activeTaskNodes[i];
            if (node && node.isValid) {
                const refs = node._taskItemRefs;
                const iconSprite = refs && refs.rewardIconSprite;
                if (iconSprite && cc.isValid(iconSprite)) {
                    iconSprite.spriteFrame = this.rewardIconSpriteFrame;
                }
            }
        }
    }

    ensureTitleBackground(): void {
        if (!this.titleBgSprite) {
            return;
        }
        this.titleBgSprite.enabled = true;
        if (this.titleBgSpriteFrame) {
            this.titleBgSprite.spriteFrame = this.titleBgSpriteFrame;
        }
        if (this.titleBgNode) {
            this.titleBgNode.opacity = 255;
        }
    }

    loadTaskItemPrefab(): void {
        ResMgr.getInstance().loadRes("prefab/arrowTaskItem", cc.Prefab, this, "ui").then((prefab: cc.Prefab) => {
            if (prefab) {
                this.taskItemPrefab = prefab;
                this.renderActiveTab();
            } else {
                cc.warn("[arrowTaskPopupView] load item prefab failed");
            }
        });
    }

    requestTaskInfo(): void {
        this.requestTaskInfoForTab(this.currentTab, true);
    }

    ensureTabTaskRequested(tab: string): void {
        this.requestTaskInfoForTab(tab, false);
    }

    normalizeTabName(tab: string): string {
        return tab === "career" ? "career" : "daily";
    }

    getTaskTypeByTab(tab: string): string {
        return this.normalizeTabName(tab) === "career" ? "ltv" : "";
    }

    isTabRequested(tab: string): boolean {
        return this.normalizeTabName(tab) === "career" ? !!this.hasRequestedCareerTask : !!this.hasRequestedDailyTask;
    }

    setTabRequested(tab: string, requested: boolean): void {
        if (this.normalizeTabName(tab) !== "career") {
            this.hasRequestedDailyTask = !!requested;
        } else {
            this.hasRequestedCareerTask = !!requested;
        }
    }

    isTabLoading(tab: string): boolean {
        return this.normalizeTabName(tab) === "career" ? !!this.isCareerLoading : !!this.isDailyLoading;
    }

    setTabLoading(tab: string, loading: boolean): void {
        if (this.normalizeTabName(tab) !== "career") {
            this.isDailyLoading = !!loading;
        } else {
            this.isCareerLoading = !!loading;
        }
    }

    parseClaimableCount(value: any): number {
        const num = Number(value);
        if (!isFinite(num) || num < 0) {
            return 0;
        }
        return Math.floor(num);
    }

    initClaimableCountsFromInfo(): void {
        this.dailyInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.task_point_num);
        this.careerInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.ltv_task_point_num);
    }

    updateClaimableCountsFromInfoData(data: any): void {
        if (!data) {
            return;
        }
        if (void 0 !== data.task_point_num) {
            this.dailyInfoClaimableCount = this.parseClaimableCount(data.task_point_num);
            PlayerDataStore.task_point_num = this.dailyInfoClaimableCount;
        }
        if (void 0 !== data.ltv_task_point_num) {
            this.careerInfoClaimableCount = this.parseClaimableCount(data.ltv_task_point_num);
            PlayerDataStore.ltv_task_point_num = this.careerInfoClaimableCount;
        }
    }

    countClaimableTaskNum(list: any[]): number {
        if (!Array.isArray(list)) {
            return 0;
        }
        let count = 0;
        for (let i = 0; i < list.length; i++) {
            const task = list[i] || {};
            if (this.parseTaskStatus(task.status) === 1) {
                count += 1;
            }
        }
        return count;
    }

    resolveCurrentClaimableCount(tab: string): number {
        if (this.normalizeTabName(tab) === "career") {
            return this.hasRequestedCareerTask
                ? this.countClaimableTaskNum(this.careerTaskList)
                : this.parseClaimableCount(this.careerInfoClaimableCount);
        }
        return this.hasRequestedDailyTask
            ? this.countClaimableTaskNum(this.dailyTaskList)
            : this.parseClaimableCount(this.dailyInfoClaimableCount);
    }

    syncTaskRedDotToGameView(): void {
        const dailyCount = this.resolveCurrentClaimableCount("daily");
        const careerCount = this.resolveCurrentClaimableCount("career");
        this.dailyInfoClaimableCount = dailyCount;
        this.careerInfoClaimableCount = careerCount;
        PlayerDataStore.task_point_num = dailyCount;
        PlayerDataStore.ltv_task_point_num = careerCount;
        try {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, {
                task_point_num: dailyCount,
                ltv_task_point_num: careerCount
            });
        } catch (err) {
            cc.warn("[arrowTaskPopupView] syncTaskRedDotToGameView emit failed:", err);
        }
    }

    requestTaskInfoForTab(tab: string, force: boolean): void {
        tab = this.normalizeTabName(tab);
        if ((!force && this.isTabRequested(tab)) || this.isTabLoading(tab)) {
            return;
        }
        this.setTabLoading(tab, true);
        this.showRequestLoading();
        const taskType = this.getTaskTypeByTab(tab);
        const netErrorPopup: any = NetErrorPopupService;
        const retry = () => {
            this.setTabLoading(tab, false);
            this.hideRequestLoading();
            this.requestTaskInfoForTab(tab, true);
        };
        this.requestTaskInfoByType(taskType, (res: any) => {
            if (netErrorPopup && netErrorPopup.shouldPop(res)) {
                this.hideRequestLoading();
                this.setTabLoading(tab, false);
                cc.warn("[arrowTaskPopupView] getTaskInfo force-retry code=", res && res.code, "taskType=", taskType || "daily");
                netErrorPopup.showAndRetry(retry);
            } else {
                this.hideRequestLoading();
                this.setTabLoading(tab, false);
                if (this.node && this.node.isValid) {
                    if (res && Number(res.code) === 1) {
                        this.assignRawTaskListByType(taskType, this.extractTaskList(res));
                        this.updateClaimableCountsFromInfoData(res.data || {});
                        this.setTabRequested(tab, true);
                        this.regroupTaskList();
                        this.refreshTabVisual();
                        if (this.currentTab === tab) {
                            this.renderTaskList(this.getActiveTaskList());
                        }
                        this.syncTaskRedDotToGameView();
                    } else {
                        cc.warn("[arrowTaskPopupView] getTaskInfo failed:", res && res.message, "taskType=", taskType || "daily");
                        this.assignRawTaskListByType(taskType, []);
                        this.setTabRequested(tab, false);
                        this.regroupTaskList();
                        this.refreshTabVisual();
                        if (this.currentTab === tab) {
                            this.renderTaskList(this.getActiveTaskList());
                        }
                    }
                }
            }
        }, (err: any) => {
            if (netErrorPopup && netErrorPopup.shouldPop(err)) {
                this.hideRequestLoading();
                this.setTabLoading(tab, false);
                cc.warn("[arrowTaskPopupView] getTaskInfo 网络异常，弹重试窗 err=", err && err.message, "taskType=", taskType || "daily");
                netErrorPopup.showAndRetry(retry);
            } else {
                this.hideRequestLoading();
                this.setTabLoading(tab, false);
                if (this.node && this.node.isValid) {
                    cc.warn("[arrowTaskPopupView] getTaskInfo error:", err && err.message, "taskType=", taskType || "daily");
                    this.assignRawTaskListByType(taskType, []);
                    this.setTabRequested(tab, false);
                    this.regroupTaskList();
                    this.refreshTabVisual();
                    if (this.currentTab === tab) {
                        this.renderTaskList(this.getActiveTaskList());
                    }
                }
            }
        });
    }

    showRequestLoading(): void {
        this.loadingVisibleCount += 1;
        const uiMgr: any = UIMgr.getInstance();
        if (uiMgr && uiMgr.showWatingUI) {
            uiMgr.showWatingUI();
        }
    }

    hideRequestLoading(): void {
        if (this.loadingVisibleCount <= 0) {
            return;
        }
        this.loadingVisibleCount -= 1;
        const uiMgr: any = UIMgr.getInstance();
        if (uiMgr && uiMgr.hideWatingUI) {
            uiMgr.hideWatingUI();
        }
    }

    clearRequestLoading(): void {
        while (this.loadingVisibleCount > 0) {
            this.hideRequestLoading();
        }
    }

    requestTaskInfoByType(taskType: string, onSuccess: (res: any) => void, onError: (err: any) => void): void {
        const service: any = LoadingHttpService;
        if (service.getTaskInfo) {
            service.getTaskInfo(taskType || "", Handler.create(this, (res: any) => {
                if (onSuccess) {
                    onSuccess(res);
                }
            }), Handler.create(this, (err: any) => {
                if (onError) {
                    onError(err);
                }
            }));
        } else if (onError) {
            onError({ message: "getTaskInfo is unavailable" });
        }
    }

    assignRawTaskListByType(taskType: string, list: any[]): void {
        list = Array.isArray(list) ? list : [];
        if (taskType !== "ltv") {
            this.rawDailyTaskList = list;
            this.rawTaskList = list;
        } else {
            this.rawCareerTaskList = list;
        }
    }

    extractTaskList(res: any): any[] {
        if (!res) {
            return [];
        }
        const data = res.data || {};
        let list = data.task_list || [];
        if (!Array.isArray(list) && data.data) {
            list = data.data.task_list || [];
        }
        return Array.isArray(list) ? list : [];
    }

    regroupTaskList(): void {
        const dailyList: ITaskData[] = [];
        const careerList: ITaskData[] = [];
        let index = 0;
        if (this.hasRequestedDailyTask || this.hasRequestedCareerTask) {
            index = this.appendNormalizedTaskList(dailyList, careerList, this.rawDailyTaskList, true, index);
            this.appendNormalizedTaskList(dailyList, careerList, this.rawCareerTaskList, false, index);
        } else {
            this.appendNormalizedTaskList(dailyList, careerList, this.rawTaskList, undefined, index);
        }
        this.dailyTaskList = this.sortClaimedToTail(this.dedupeTaskListById(dailyList));
        this.careerTaskList = this.sortClaimedToTail(this.dedupeTaskListById(careerList));
    }

    appendNormalizedTaskList(dailyList: ITaskData[], careerList: ITaskData[], rawList: any[], forceDaily: boolean, startIndex: number): number {
        rawList = Array.isArray(rawList) ? rawList : [];
        let index = Number(startIndex || 0);
        for (let i = 0; i < rawList.length; i++) {
            const task = this.normalizeTask(rawList[i], index, forceDaily);
            index += 1;
            if (task.ifDaily) {
                dailyList.push(task);
            } else {
                careerList.push(task);
            }
        }
        return index;
    }

    dedupeTaskListById(list: any[]): ITaskData[] {
        list = Array.isArray(list) ? list : [];
        const seen: { [id: string]: boolean } = {};
        const result: ITaskData[] = [];
        for (let i = 0; i < list.length; i++) {
            const item = list[i] || {};
            const id = String(item.id || "");
            if (!id || !seen[id]) {
                if (id) {
                    seen[id] = true;
                }
                result.push(item);
            }
        }
        return result;
    }

    normalizeTask(raw: any, index: number, forceDaily?: boolean): ITaskData {
        raw = raw || {};
        let finishedNum = Number(raw.finished_num || 0);
        let targetNum: any = Number(raw.task_num);
        if (!isFinite(targetNum)) {
            targetNum = Number(raw.task_count || raw.count);
        }
        if (!isFinite(targetNum)) {
            targetNum = null;
        }
        let taskNum = targetNum > 0 ? targetNum : 1;
        taskNum = taskNum > 0 ? taskNum : 1;
        if (finishedNum < 0) {
            finishedNum = 0;
        }
        const taskType = this.parseTaskType(raw.task_type || raw.task || raw.type || "");
        let reward: number = this.parseAmount(raw.task_reward);
        if (reward === null) {
            reward = this.parseAmount(raw.reward);
        }
        let showAmount: number = this.parseAmount(raw.show_amount);
        if (showAmount === null) {
            showAmount = this.parseAmount(raw.double_amount);
        }
        if (showAmount === null) {
            showAmount = this.parseAmount(raw.show_reward);
        }
        if (showAmount === null) {
            showAmount = reward;
        }
        if (reward === null) {
            reward = showAmount;
        }
        if (reward === null) {
            reward = 0;
        }
        if (showAmount === null) {
            showAmount = reward;
        }
        const ifDaily = this.parseDailyFlag(raw.if_daily, forceDaily);
        return {
            id: String(raw.id || "task_" + index),
            status: this.parseTaskStatus(raw.status),
            ifDaily: ifDaily,
            claimTaskType: this.resolveClaimTaskType(ifDaily),
            desc: raw.task_desc || raw.desc || raw.title || "",
            taskType: taskType,
            reward: reward,
            taskReward: reward,
            showAmount: showAmount,
            finishedNum: finishedNum,
            taskNum: taskNum,
            taskTargetNum: targetNum,
            raw: raw
        };
    }

    parseDailyFlag(flag: any, defaultDaily?: boolean): boolean {
        if (flag === null || flag === undefined || flag === "") {
            return defaultDaily !== undefined ? !!defaultDaily : false;
        }
        return flag === true || flag === 1 || flag === "1" || flag === "true";
    }

    resolveClaimTaskType(ifDaily: boolean): string {
        return ifDaily ? "" : "ltv";
    }

    parseTaskStatus(status: any): number {
        const value = Number(status);
        if (value === 1) {
            return 1;
        }
        if (value === 2) {
            return 2;
        }
        return 0;
    }

    parseAmount(value: any): number {
        let num = Number(value);
        if (!isFinite(num)) {
            return null;
        }
        num = Math.floor(num);
        return num < 0 ? 0 : num;
    }

    parseTaskType(rawType: string): string {
        let type = String(rawType || "").toLowerCase();
        type = type.replace(/\s+/g, "");
        if (!type) {
            return "";
        }
        if (type === "daily_login" || type === "signin" || type === "sign" || type === "login") {
            return "login";
        }
        if (type === "pass_level" || type === "clear_level" || type === "passlevel" || type === "clearlevel" || type === "level") {
            return "level";
        }
        if (type === "watch_ad" || type === "watchad" || type === "watch_video" || type === "watchvideo" || type === "video" || type === "ads" || type === "ad") {
            return "ad";
        }
        return type;
    }

    sortClaimedToTail(list: ITaskData[]): ITaskData[] {
        const normal: ITaskData[] = [];
        const claimed: ITaskData[] = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === 2) {
                claimed.push(list[i]);
            } else {
                normal.push(list[i]);
            }
        }
        return normal.concat(claimed);
    }

    onClickTabDaily(): void {
        this.switchTab("daily");
    }

    onClickTabCareer(): void {
        this.switchTab("career");
    }

    switchTab(tab: string): void {
        if (this.currentTab !== tab) {
            this.currentTab = tab;
            this.renderActiveTab();
            this.ensureTabTaskRequested(tab);
        } else {
            this.ensureTabTaskRequested(tab);
        }
    }

    getActiveTaskList(): ITaskData[] {
        return this.currentTab === "daily" ? this.dailyTaskList : this.careerTaskList;
    }

    renderActiveTab(): void {
        this.refreshTabVisual();
        this.renderTaskList(this.getActiveTaskList());
    }

    refreshTabVisual(): void {
        const isDaily = this.currentTab === "daily";
        this.setTabState(this.btnTabDaily, this.lblTabDaily, this.tabDailyActiveBg, this.tabDailyInactiveBg, isDaily);
        this.setTabState(this.btnTabCareer, this.lblTabCareer, this.tabCareerActiveBg, this.tabCareerInactiveBg, !isDaily);
        this.refreshTabRedPoints();
        this.syncTabLayerOrder(isDaily);
        this.setLabelText(this.lblTabHeader, isDaily
            ? this.i18n("key_task_tab_daily", null, "Daily task")
            : this.i18n("key_task_tab_career", null, "Career task"));
    }

    hasClaimableTask(list: any[]): boolean {
        if (!Array.isArray(list) || list.length <= 0) {
            return false;
        }
        for (let i = 0; i < list.length; i++) {
            const task = list[i] || {};
            if (this.parseTaskStatus(task.status) === 1) {
                return true;
            }
        }
        return false;
    }

    refreshTabRedPoints(): void {
        const dailyHasRedPoint = this.hasRequestedDailyTask
            ? this.hasClaimableTask(this.dailyTaskList)
            : this.dailyInfoClaimableCount > 0;
        const careerHasRedPoint = this.hasRequestedCareerTask
            ? this.hasClaimableTask(this.careerTaskList)
            : this.careerInfoClaimableCount > 0;
        if (this.tabDailyRedPoint) {
            this.tabDailyRedPoint.active = dailyHasRedPoint;
        }
        if (this.tabCareerRedPoint) {
            this.tabCareerRedPoint.active = careerHasRedPoint;
        }
    }

    setTabState(btn: cc.Node, label: cc.Label, activeBg: cc.Node, inactiveBg: cc.Node, active: boolean): void {
        if (activeBg) {
            activeBg.active = !!active;
        }
        if (inactiveBg) {
            inactiveBg.active = !active;
        }
        if (btn) {
            btn.color = cc.Color.WHITE;
        }
        if (label) {
            label.node.color = cc.Color.WHITE;
        }
    }

    syncTabLayerOrder(isDaily: boolean): void {
        if (!this.btnTabDaily || !this.btnTabCareer) {
            return;
        }
        if (isDaily) {
            this.btnTabCareer.setSiblingIndex(0);
            this.btnTabDaily.setSiblingIndex(1);
        } else {
            this.btnTabDaily.setSiblingIndex(0);
            this.btnTabCareer.setSiblingIndex(1);
        }
    }

    renderTaskList(list: ITaskData[]): void {
        list = Array.isArray(list) ? list : [];
        this.recycleAllTaskNodes();
        if (!this.taskItemPrefab || !this.scrollContent || !this.scrollViewView) {
            return;
        }
        if (list.length <= 0) {
            this.setLabelText(this.lblTabHeader, this.i18n("key_task_empty", null, "No tasks yet"));
        }
        for (let index = 0; index < list.length; index++) {
            const node = this.acquireTaskNode();
            if (node) {
                node.parent = this.scrollContent;
                node.active = true;
                node.y = -102.5 - 179 * index;
                node.x = 0;
                this.bindTaskItem(node, list[index]);
                this.activeTaskNodes.push(node);
            }
        }
        this.refreshContentSize(list.length, 155);
        if (this.scrollView) {
            this.scrollView.scrollToTop(0);
        }
    }

    acquireTaskNode(): ITaskItemNode {
        if (this.taskItemPool && this.taskItemPool.size() > 0) {
            return this.taskItemPool.get() as ITaskItemNode;
        }
        if (this.taskItemPrefab) {
            return cc.instantiate(this.taskItemPrefab) as ITaskItemNode;
        }
        return null;
    }

    recycleAllTaskNodes(): void {
        while (this.activeTaskNodes.length > 0) {
            const node = this.activeTaskNodes.pop();
            if (node && node.isValid) {
                const refs = node._taskItemRefs;
                if (refs && refs.btnNode) {
                    refs.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
                    (refs.btnNode as ITaskItemNode)._taskData = null;
                }
                this.taskItemPool.put(node);
            }
        }
    }

    bindTaskItem(node: ITaskItemNode, task: ITaskData): void {
        const refs = this.getTaskItemRefs(node);
        if (!refs) {
            return;
        }
        if (refs.rewardLabel) {
            refs.rewardLabel.string = this.formatCurrency(task.showAmount != null ? task.showAmount : task.reward);
        }
        if (refs.rewardIconSprite && this.rewardIconSpriteFrame) {
            refs.rewardIconSprite.spriteFrame = this.rewardIconSpriteFrame;
        }
        const desc = this.buildTaskDesc(task);
        if (refs.descLabel) {
            refs.descLabel.string = desc;
        }
        this.refreshTaskProgress(task, refs);
        this.refreshTaskButton(task, refs);
    }

    buildTaskDesc(task: ITaskData): string {
        task = task || ({} as ITaskData);
        const taskType = this.parseTaskType(task.taskType || "");
        let targetNum: any = task.taskTargetNum;
        if (targetNum == null || targetNum === "") {
            targetNum = Number(task.taskNum || 1);
        }
        targetNum = Number(targetNum);
        if (!isFinite(targetNum)) {
            targetNum = Number(task.taskNum || 1);
        }
        if (targetNum < 0) {
            targetNum = 0;
        }
        if (taskType === "login") {
            return this.i18n("key_task_desc_login", null, "Daily login");
        }
        if (taskType === "level") {
            return this.i18n("key_task_desc_level", [targetNum], "Clear %{0} levels");
        }
        if (taskType === "ad") {
            return this.i18n("key_task_desc_ad", [targetNum], "Watch %{0} ads");
        }
        return task.desc || this.i18n("key_task_desc_fallback", [task.taskType || "-", task.finishedNum, task.taskNum], "Task %{0}: %{1}/%{2}");
    }

    getTaskItemRefs(node: ITaskItemNode): ITaskItemRefs {
        if (!node) {
            return null;
        }
        if (node._taskItemRefs) {
            return node._taskItemRefs;
        }
        const rewardIconNode = this.findNodeDeep(node, "icon_reward");
        const refs: ITaskItemRefs = {
            rewardLabel: this.findLabelDeep(node, "lbl_reward"),
            descLabel: this.findLabelDeep(node, "lbl_desc"),
            rewardIconSprite: rewardIconNode ? rewardIconNode.getComponent(cc.Sprite) : null,
            progressBg: this.findNodeDeep(node, "progress_bg"),
            progressFill: this.findNodeDeep(node, "progress_fill"),
            progressLabel: this.findLabelDeep(node, "lbl_progress"),
            btnNode: this.findNodeDeep(node, "btn_claim"),
            btnLabel: this.findLabelDeep(node, "lbl_btn"),
            btnOutline: null,
            btnSprite: null,
            btnComp: null
        };
        refs.btnComp = refs.btnNode ? refs.btnNode.getComponent(cc.Button) : null;
        refs.btnSprite = refs.btnNode ? refs.btnNode.getComponent(cc.Sprite) : null;
        refs.btnOutline = refs.btnLabel ? refs.btnLabel.node.getComponent(cc.LabelOutline) : null;
        node._taskItemRefs = refs;
        return refs;
    }

    refreshTaskProgress(task: ITaskData, refs: ITaskItemRefs): void {
        const total = Math.max(1, Number(task.taskNum || 1));
        let finished = Number(task.finishedNum || 0);
        if (finished < 0) {
            finished = 0;
        }
        if (finished > total) {
            finished = total;
        }
        const percent = finished / total;
        if (refs.progressBg && refs.progressFill) {
            refs.progressFill.width = refs.progressBg.width * percent;
            refs.progressFill.x = -refs.progressBg.width / 2;
        }
        if (refs.progressLabel) {
            refs.progressLabel.string = this.i18n("key_task_progress", [finished, total], finished + "/" + total);
        }
    }

    refreshTaskButton(task: ITaskData, refs: ITaskItemRefs): void {
        if (!refs.btnNode) {
            return;
        }
        refs.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
        (refs.btnNode as ITaskItemNode)._taskData = task;
        const status = this.parseTaskStatus(task.status);
        if (status === 0) {
            if (refs.btnLabel) {
                refs.btnLabel.string = this.i18n("key_task_btn_unfinished", null, "Unfinished");
            }
            if (refs.btnComp) {
                refs.btnComp.enableAutoGrayEffect = true;
                refs.btnComp.interactable = true;
            }
            if (refs.btnSprite && this.btnGoSpriteFrame) {
                refs.btnSprite.spriteFrame = this.btnGoSpriteFrame;
            }
            if (refs.btnLabel && refs.btnLabel.node) {
                refs.btnLabel.node.color = cc.Color.WHITE;
            }
            this.setLabelOutlineColor(refs.btnOutline, new cc.Color(202, 72, 26, 255));
            refs.btnNode.color = cc.Color.WHITE;
            refs.btnNode.on(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
        } else if (status === 1) {
            if (refs.btnLabel) {
                refs.btnLabel.string = this.i18n("key_task_btn_claim", null, "Claim");
            }
            if (refs.btnComp) {
                refs.btnComp.enableAutoGrayEffect = true;
                refs.btnComp.interactable = true;
            }
            if (refs.btnSprite && this.btnClaimSpriteFrame) {
                refs.btnSprite.spriteFrame = this.btnClaimSpriteFrame;
            }
            if (refs.btnLabel && refs.btnLabel.node) {
                refs.btnLabel.node.color = cc.Color.WHITE;
            }
            this.setLabelOutlineColor(refs.btnOutline, new cc.Color(44, 86, 11, 255));
            refs.btnNode.color = cc.Color.WHITE;
            refs.btnNode.on(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
        } else {
            if (refs.btnLabel) {
                refs.btnLabel.string = this.i18n("key_task_btn_claimed", null, "Claimed");
            }
            if (refs.btnComp) {
                refs.btnComp.enableAutoGrayEffect = false;
                refs.btnComp.interactable = false;
            }
            if (refs.btnSprite) {
                if (this.btnFinishSpriteFrame) {
                    refs.btnSprite.spriteFrame = this.btnFinishSpriteFrame;
                } else if (this.btnClaimSpriteFrame) {
                    refs.btnSprite.spriteFrame = this.btnClaimSpriteFrame;
                }
            }
            if (refs.btnLabel && refs.btnLabel.node) {
                refs.btnLabel.node.color = cc.Color.WHITE;
            }
            this.setLabelOutlineColor(refs.btnOutline, new cc.Color(83, 83, 83, 255));
            refs.btnNode.color = cc.Color.WHITE;
        }
    }

    setLabelOutlineColor(outline: cc.LabelOutline, color: cc.Color): void {
        if (!outline) {
            return;
        }
        outline.color = color || cc.Color.WHITE;
        outline.width = 2;
    }

    onClickTaskButton(event: cc.Event.EventTouch): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        const target = event && (event.currentTarget as ITaskItemNode);
        if (!target) {
            return;
        }
        const task = target._taskData;
        if (!task) {
            return;
        }
        const status = this.parseTaskStatus(task.status);
        if (status === 0) {
            this.onClickClose();
        } else if (status === 1) {
            this.showTaskRewardPopup(task, true);
        }
    }

    showTaskRewardPopup(task: ITaskData, closeBeforeShow: boolean): void {
        if (!task) {
            return;
        }
        let showAmount: number = this.parseAmount(task.showAmount);
        let taskReward: number = this.parseAmount(task.taskReward);
        if (showAmount === null) {
            showAmount = 0;
        }
        if (taskReward === null) {
            taskReward = showAmount;
        }
        if (closeBeforeShow) {
            this.onClickClose();
        }
        UIMgr.getInstance().show(UIDefine.arrowSettleRewardView).then((node: cc.Node) => {
            if (node && node.isValid) {
                let comp: any = node.getComponent(ArrowSettleRewardView);
                if (!comp) {
                    comp = node.addComponent(ArrowSettleRewardView);
                }
                if (comp && comp.setEntryData) {
                    comp.setEntryData({
                        popupMode: "task",
                        isLevelPassed: false,
                        taskId: task.id || "",
                        showAmount: showAmount,
                        taskReward: taskReward,
                        onTaskClaim: (claimParams: any, callback: (ok: boolean) => void) => {
                            this.submitTaskClaim(task, claimParams, callback);
                        }
                    });
                }
            }
        });
    }

    submitTaskClaim(task: ITaskData, claimParams: any, callback?: (ok: boolean) => void): void {
        const done: (ok: boolean) => void = typeof callback === "function" ? callback : function () { };
        const params = claimParams || {};
        const taskId = String(params.taskId || (task && task.id) || "");
        const taskType = String(params.taskType || (task && task.claimTaskType) || "");
        if (!taskId) {
            this.showToast(this.i18n("key_result_tip_claim_error", null, "Claim failed. Please try again later"));
            done(false);
            return;
        }
        if (this.isTaskClaiming) {
            done(false);
            return;
        }
        this.isTaskClaiming = true;
        this.requestTaskReward(taskId, taskType, !!params.isDouble, (ok: boolean) => {
            this.isTaskClaiming = false;
            if (ok) {
                if (task) {
                    task.status = 2;
                    if (task.raw) {
                        task.raw.status = 2;
                    }
                }
                if (this.node && this.node.isValid) {
                    this.regroupTaskList();
                    this.renderActiveTab();
                    this.syncTaskRedDotToGameView();
                    this.requestTaskInfo();
                } else {
                    this.syncTaskRedDotToGameView();
                    try {
                        const service: any = UserInfoService.getInstance();
                        if (service && typeof service.fetch === "function") {
                            service.fetch();
                        }
                    } catch (err) {
                        cc.warn("[arrowTaskPopupView] UserInfoService.fetch after claim failed:", err);
                    }
                }
                done(true);
            } else {
                done(false);
            }
        });
    }

    playTaskRewardVideo(onSuccess: (info: any) => void, onFail: (err: any) => void): void {
        const adManagerModule: any = AdManager;
        const adManager: any = adManagerModule && adManagerModule.getInstance ? adManagerModule.getInstance() : null;
        if (adManager && typeof adManager.playNormalVideoAd === "function") {
            adManager.playNormalVideoAd({
                ad_type: "reward_video",
                force_video: false
            }, (result: any) => {
                if (!result || void 0 === result.compensationQualifyMark || result.compensationQualifyMark) {
                    const cpmData = adManager.cpm_data || {};
                    if (onSuccess) {
                        onSuccess({
                            video_type: "reward_video",
                            task_id: "",
                            force_type: "false",
                            source: cpmData.source || "",
                            unitId: cpmData.unitId || "",
                            cpm: cpmData.cpm || 0
                        });
                    }
                } else if (onFail) {
                    onFail(result);
                }
            }, (err: any) => {
                cc.warn("[arrowTaskPopupView] task reward video failed:", (err && err.message) || err);
                if (onFail) {
                    onFail(err);
                }
            }, this.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again"));
        } else if (onSuccess) {
            onSuccess({
                video_type: "reward_video",
                task_id: "",
                force_type: "false"
            });
        }
    }

    requestTaskReward(taskId: string, taskType: string, isDouble: boolean, callback: (ok: boolean) => void): void {
        const claimParams: IClaimParams = {
            businessType: "task",
            taskType: taskType || "",
            taskId: taskId || ""
        };
        const onResult = (ok: boolean, data: any) => {
            if (ok) {
                try {
                    BusinessAnalyticsService.reportData("task_claim", {
                        task_id: claimParams.taskId || "",
                        task_type: claimParams.taskType || "",
                        is_double: isDouble ? 1 : 0
                    });
                } catch (err) {
                }
                this.applyTaskRewardResult(data || {});
                if (callback) {
                    callback(true);
                }
            } else {
                cc.warn("[arrowTaskPopupView] claim task reward failed:", "taskId=", claimParams.taskId, "taskType=", claimParams.taskType, "isDouble=", !!isDouble);
                this.showToast(this.i18n("key_result_tip_claim_error", null, "Claim failed. Please try again later"));
                if (callback) {
                    callback(false);
                }
            }
        };
        if (isDouble) {
            claimParams.fallbackOnAdFail = false;
            ArrowRewardService.claimDouble(claimParams, onResult);
        } else {
            ArrowRewardService.claimNormal(claimParams, onResult);
        }
    }

    applyTaskRewardResult(data: any): void {
        if (!data) {
            return;
        }
        if (this.node && this.node.isValid) {
            this.refreshTabVisual();
        }
        const update: any = {};
        if (void 0 !== data.cash_balance) {
            update.cash_balance = data.cash_balance;
        }
        if (void 0 !== data.bubble_balance) {
            update.bubble_balance = data.bubble_balance;
        }
        if (void 0 !== data.user_level) {
            update.user_level = data.user_level;
        }
        if (void 0 !== data.hint_prop_count) {
            update.hint_prop_count = data.hint_prop_count;
        }
        if (void 0 !== data.guideline_prop_count) {
            update.guideline_prop_count = data.guideline_prop_count;
        }
        if (void 0 !== data.task_point_num) {
            update.task_point_num = data.task_point_num;
        }
        if (void 0 !== data.ltv_task_point_num) {
            update.ltv_task_point_num = data.ltv_task_point_num;
        }
        if (void 0 !== data.sign_in) {
            update.sign_in = data.sign_in;
        }
        try {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, update);
        } catch (err) {
            cc.warn("[arrowTaskPopupView] emit userInfoUpdated failed:", err);
        }
    }

    refreshContentSize(count: number, itemHeight: number): void {
        if (!this.scrollContent || !this.scrollViewView) {
            return;
        }
        const contentHeight = count > 0
            ? count * itemHeight + 24 * Math.max(0, count - 1) + 180
            : this.scrollViewView.height;
        this.scrollContent.height = Math.max(this.scrollViewView.height, contentHeight);
        this.scrollContent.y = this.scrollViewView.height / 2;
    }

    showEmpty(): void {
    }

    onClickClose(): void {
        this.syncTaskRedDotToGameView();
        UIMgr.getInstance().hide(this.node);
    }

    formatCurrency(value: number): string {
        return LanguageService.formatCurrency(value);
    }

    i18n(key: string, params: any[], fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    setLabelText(label: cc.Label, text: string): void {
        if (label) {
            label.string = text || "";
        }
    }

    showToast(message: string): void {
        try {
            const tips: any = Tips;
            if (tips && typeof tips.show === "function") {
                tips.show(message);
            }
        } catch (err) {
            cc.log("[arrowTaskPopupView] toast:", message);
        }
    }

    findNodeDeep(root: cc.Node, name: string): cc.Node {
        if (!root || !name) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.childrenCount; i++) {
            const found = this.findNodeDeep(root.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    findLabelDeep(root: cc.Node, name: string): cc.Label {
        const node = this.findNodeDeep(root, name);
        return (node && node.getComponent(cc.Label)) || null;
    }
}