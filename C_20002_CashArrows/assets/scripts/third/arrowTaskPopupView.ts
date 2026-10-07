import AdManager from "./AdManager";
import ArrowRewardService from "./ArrowRewardService";
import ArrowSettleRewardView from "./arrowSettleRewardView";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";
import ResMgr from "./ResMgr";
import Tips from "./Tips";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserInfoService from "./UserInfoService";

const { ccclass } = cc._decorator;

interface TaskItemRefs {
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

@ccclass
export default class ArrowTaskPopupView extends cc.Component {
    currentTab = "daily";
    rawTaskList: any[] = [];
    rawDailyTaskList: any[] = [];
    rawCareerTaskList: any[] = [];
    dailyTaskList: any[] = [];
    careerTaskList: any[] = [];
    taskItemPrefab: cc.Prefab | null = null;
    taskItemPool = new cc.NodePool();
    activeTaskNodes: cc.Node[] = [];
    isLoading = false;
    isTaskClaiming = false;
    btnGoSpriteFrame: cc.SpriteFrame | null = null;
    btnClaimSpriteFrame: cc.SpriteFrame | null = null;
    btnFinishSpriteFrame: cc.SpriteFrame | null = null;
    titleBgSpriteFrame: cc.SpriteFrame | null = null;
    rewardIconSpriteFrame: cc.SpriteFrame | null = null;
    rewardIconReqVersion = 0;
    dailyInfoClaimableCount = 0;
    careerInfoClaimableCount = 0;
    hasRequestedDailyTask = false;
    hasRequestedCareerTask = false;
    isDailyLoading = false;
    isCareerLoading = false;
    loadingVisibleCount = 0;

    private maskNode: cc.Node | null = null;
    private panelNode: cc.Node | null = null;
    private btnClose: cc.Node | null = null;
    private titleBgNode: cc.Node | null = null;
    private titleBgSprite: cc.Sprite | null = null;
    private lblTitle: cc.Label | null = null;
    private scrollViewNode: cc.Node | null = null;
    private scrollView: cc.ScrollView | null = null;
    private scrollViewView: cc.Node | null = null;
    private scrollContent: cc.Node | null = null;
    private btnTabDaily: cc.Node | null = null;
    private btnTabCareer: cc.Node | null = null;
    private tabRootNode: cc.Node | null = null;
    private lblTabDaily: cc.Label | null = null;
    private lblTabCareer: cc.Label | null = null;
    private lblTabHeader: cc.Label | null = null;
    private tabDailyActiveBg: cc.Node | null = null;
    private tabDailyInactiveBg: cc.Node | null = null;
    private tabCareerActiveBg: cc.Node | null = null;
    private tabCareerInactiveBg: cc.Node | null = null;
    private tabDailyRedPoint: cc.Node | null = null;
    private tabCareerRedPoint: cc.Node | null = null;

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
        this.taskItemPool?.clear();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
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
        this.maskNode?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnClose?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.panelNode?.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
        this.panelNode?.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        this.btnTabDaily?.on(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
        this.btnTabCareer?.on(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
    }

    unbindEvents(): void {
        this.maskNode?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnClose?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.panelNode?.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
        this.panelNode?.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        this.btnTabDaily?.off(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
        this.btnTabCareer?.off(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
    }

    onTouchInsidePanel(event: cc.Event.EventTouch): void {
        event?.stopPropagation?.();
    }

    refreshStaticTexts(): void {
        this.ensureTitleBackground();
        this.setLabelText(this.lblTitle, this.i18n("key_task_popup_title", null, "Task"));
        this.setLabelText(this.lblTabDaily, this.i18n("key_task_tab_daily", null, "Daily task"));
        this.setLabelText(this.lblTabCareer, this.i18n("key_task_tab_career", null, "Career task"));
        this.refreshTabVisual();
    }

    preloadButtonSpriteFrames(): void {
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_go_bg", cc.SpriteFrame, this, "ui").then((frame) => {
            if (frame) {
                this.btnGoSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_claim_bg", cc.SpriteFrame, this, "ui").then((frame) => {
            if (frame) {
                this.btnClaimSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_finish", cc.SpriteFrame, this, "ui").then((frame) => {
            if (frame) {
                this.btnFinishSpriteFrame = frame;
                this.renderActiveTab();
            }
        });
        ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_popup_title_bg", cc.SpriteFrame, this, "ui").then((frame) => {
            if (frame) {
                this.titleBgSpriteFrame = frame;
                this.ensureTitleBackground();
            }
        });
    }

    loadRewardIconSpriteFrame(): void {
        const primaryPath = CountryAssetService.getPathByImageName("money_arrow_icon");
        const fallbackPath = CountryAssetService.getPathByImageName("money_arrow_icon", "ID");
        const version = ++this.rewardIconReqVersion;
        const applyFrame = (frame: cc.SpriteFrame) => {
            if (frame && version === this.rewardIconReqVersion && cc.isValid(this.node)) {
                this.rewardIconSpriteFrame = frame;
                this.applyRewardIconToActiveItems();
            }
        };
        ResMgr.getInstance().loadRes(primaryPath, cc.SpriteFrame, this, "game").then((frame) => {
            if (frame) {
                applyFrame(frame);
            } else if (fallbackPath && fallbackPath !== primaryPath) {
                ResMgr.getInstance().loadRes(fallbackPath, cc.SpriteFrame, this, "game").then((fallbackFrame) => {
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
                const refs = (node as any)._taskItemRefs as TaskItemRefs;
                const sprite = refs && refs.rewardIconSprite;
                if (sprite && cc.isValid(sprite)) {
                    sprite.spriteFrame = this.rewardIconSpriteFrame;
                }
            }
        }
    }

    ensureTitleBackground(): void {
        if (this.titleBgSprite) {
            this.titleBgSprite.enabled = true;
            if (this.titleBgSpriteFrame) {
                this.titleBgSprite.spriteFrame = this.titleBgSpriteFrame;
            }
            if (this.titleBgNode) {
                this.titleBgNode.opacity = 255;
            }
        }
    }

    loadTaskItemPrefab(): void {
        ResMgr.getInstance().loadRes("prefab/arrowTaskItem", cc.Prefab, this, "ui").then((prefab) => {
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

    setTabRequested(tab: string, value: boolean): void {
        if (this.normalizeTabName(tab) !== "career") {
            this.hasRequestedDailyTask = !!value;
        } else {
            this.hasRequestedCareerTask = !!value;
        }
    }

    isTabLoading(tab: string): boolean {
        return this.normalizeTabName(tab) === "career" ? !!this.isCareerLoading : !!this.isDailyLoading;
    }

    setTabLoading(tab: string, value: boolean): void {
        if (this.normalizeTabName(tab) !== "career") {
            this.isDailyLoading = !!value;
        } else {
            this.isCareerLoading = !!value;
        }
    }

    parseClaimableCount(value: any): number {
        const num = Number(value);
        return !isFinite(num) || num < 0 ? 0 : Math.floor(num);
    }

    initClaimableCountsFromInfo(): void {
        this.dailyInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.task_point_num);
        this.careerInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.ltv_task_point_num);
    }

    updateClaimableCountsFromInfoData(data: any): void {
        if (!data) {
            return;
        }
        if (data.task_point_num !== undefined) {
            this.dailyInfoClaimableCount = this.parseClaimableCount(data.task_point_num);
            PlayerDataStore.task_point_num = this.dailyInfoClaimableCount;
        }
        if (data.ltv_task_point_num !== undefined) {
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
            if (this.parseTaskStatus(list[i]?.status) === 1) {
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
            GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, {
                task_point_num: dailyCount,
                ltv_task_point_num: careerCount,
            });
        } catch (err) {
            cc.warn("[arrowTaskPopupView] syncTaskRedDotToGameView emit failed:", err);
        }
    }

    requestTaskInfoForTab(tab: string, force: boolean): void {
        tab = this.normalizeTabName(tab);
        if ((force || !this.isTabRequested(tab)) && !this.isTabLoading(tab)) {
            this.setTabLoading(tab, true);
            this.showRequestLoading();
            const taskType = this.getTaskTypeByTab(tab);
            const retry = () => {
                this.setTabLoading(tab, false);
                this.hideRequestLoading();
                this.requestTaskInfoForTab(tab, true);
            };
            this.requestTaskInfoByType(
                taskType,
                (res) => {
                    if (NetErrorPopupService.shouldPop(res)) {
                        this.hideRequestLoading();
                        this.setTabLoading(tab, false);
                        cc.warn("[arrowTaskPopupView] getTaskInfo force-retry code=", res && res.code, "taskType=", taskType || "daily");
                        NetErrorPopupService.showAndRetry(retry);
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
                },
                (err) => {
                    if (NetErrorPopupService.shouldPop(err)) {
                        this.hideRequestLoading();
                        this.setTabLoading(tab, false);
                        cc.warn("[arrowTaskPopupView] getTaskInfo 网络异常，弹重试窗 err=", err && err.message, "taskType=", taskType || "daily");
                        NetErrorPopupService.showAndRetry(retry);
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
                }
            );
        }
    }

    showRequestLoading(): void {
        this.loadingVisibleCount += 1;
        const uiMgr = UIMgr.getInstance();
        uiMgr?.showWatingUI?.();
    }

    hideRequestLoading(): void {
        if (this.loadingVisibleCount <= 0) {
            return;
        }
        this.loadingVisibleCount -= 1;
        const uiMgr = UIMgr.getInstance();
        uiMgr?.hideWatingUI?.();
    }

    clearRequestLoading(): void {
        while (this.loadingVisibleCount > 0) {
            this.hideRequestLoading();
        }
    }

    requestTaskInfoByType(taskType: string, onSuccess: (res: any) => void, onFail: (err: any) => void): void {
        if (LoadingHttpService.getTaskInfo) {
            LoadingHttpService.getTaskInfo(
                taskType || "",
                Handler.create(this, (res: any) => onSuccess?.(res)),
                Handler.create(this, (err: any) => onFail?.(err))
            );
        } else {
            onFail?.({ message: "getTaskInfo is unavailable" });
        }
    }

    assignRawTaskListByType(taskType: string, list: any[]): void {
        const tasks = Array.isArray(list) ? list : [];
        if (taskType !== "ltv") {
            this.rawDailyTaskList = tasks;
            this.rawTaskList = tasks;
        } else {
            this.rawCareerTaskList = tasks;
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
        const daily: any[] = [];
        const career: any[] = [];
        let order = 0;
        if (this.hasRequestedDailyTask || this.hasRequestedCareerTask) {
            order = this.appendNormalizedTaskList(daily, career, this.rawDailyTaskList, true, order);
            this.appendNormalizedTaskList(daily, career, this.rawCareerTaskList, false, order);
        } else {
            this.appendNormalizedTaskList(daily, career, this.rawTaskList, undefined, order);
        }
        this.dailyTaskList = this.sortClaimedToTail(this.dedupeTaskListById(daily));
        this.careerTaskList = this.sortClaimedToTail(this.dedupeTaskListById(career));
    }

    appendNormalizedTaskList(dailyOut: any[], careerOut: any[], source: any[], isDailyHint: boolean | undefined, startOrder: number): number {
        const list = Array.isArray(source) ? source : [];
        let order = Number(startOrder || 0);
        for (let i = 0; i < list.length; i++) {
            const task = this.normalizeTask(list[i], order, isDailyHint);
            order += 1;
            if (task.ifDaily) {
                dailyOut.push(task);
            } else {
                careerOut.push(task);
            }
        }
        return order;
    }

    dedupeTaskListById(list: any[]): any[] {
        const seen: { [id: string]: boolean } = {};
        const result: any[] = [];
        const source = Array.isArray(list) ? list : [];
        for (let i = 0; i < source.length; i++) {
            const task = source[i] || {};
            const id = String(task.id || "");
            if (!id || !seen[id]) {
                if (id) {
                    seen[id] = true;
                }
                result.push(task);
            }
        }
        return result;
    }

    normalizeTask(raw: any, order: number, isDailyHint: boolean | undefined): any {
        raw = raw || {};
        let finished = Number(raw.finished_num || 0);
        let target = Number(raw.task_num);
        if (!isFinite(target)) {
            target = Number(raw.task_count || raw.count);
        }
        if (!isFinite(target)) {
            target = null as any;
        }
        let taskNum = target > 0 ? target : 1;
        taskNum = taskNum > 0 ? taskNum : 1;
        if (finished < 0) {
            finished = 0;
        }
        const taskType = this.parseTaskType(raw.task_type || raw.task || raw.type || "");
        let reward = this.parseAmount(raw.task_reward);
        if (reward === null) {
            reward = this.parseAmount(raw.reward);
        }
        let showAmount = this.parseAmount(raw.show_amount);
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
        const ifDaily = this.parseDailyFlag(raw.if_daily, isDailyHint);
        return {
            id: String(raw.id || "task_" + order),
            status: this.parseTaskStatus(raw.status),
            ifDaily,
            claimTaskType: this.resolveClaimTaskType(ifDaily),
            desc: raw.task_desc || raw.desc || raw.title || "",
            taskType,
            reward,
            taskReward: reward,
            showAmount,
            finishedNum: finished,
            taskNum,
            taskTargetNum: target,
            raw,
        };
    }

    parseDailyFlag(value: any, fallback: boolean | undefined): boolean {
        if (value == null || value === "") {
            return fallback !== undefined && !!fallback;
        }
        return value === true || value === 1 || value === "1" || value === "true";
    }

    resolveClaimTaskType(isDaily: boolean): string {
        return isDaily ? "" : "ltv";
    }

    parseTaskStatus(value: any): number {
        const num = Number(value);
        return num === 1 ? 1 : num === 2 ? 2 : 0;
    }

    parseAmount(value: any): number | null {
        const num = Number(value);
        if (!isFinite(num)) {
            return null;
        }
        const floored = Math.floor(num);
        return floored < 0 ? 0 : floored;
    }

    parseTaskType(value: string): string {
        let type = String(value || "").toLowerCase().replace(/\s+/g, "");
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

    sortClaimedToTail(list: any[]): any[] {
        const active: any[] = [];
        const claimed: any[] = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].status === 2) {
                claimed.push(list[i]);
            } else {
                active.push(list[i]);
            }
        }
        return active.concat(claimed);
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

    getActiveTaskList(): any[] {
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
        this.setLabelText(
            this.lblTabHeader,
            isDaily
                ? this.i18n("key_task_tab_daily", null, "Daily task")
                : this.i18n("key_task_tab_career", null, "Career task")
        );
    }

    hasClaimableTask(list: any[]): boolean {
        if (!Array.isArray(list) || list.length <= 0) {
            return false;
        }
        for (let i = 0; i < list.length; i++) {
            if (this.parseTaskStatus(list[i]?.status) === 1) {
                return true;
            }
        }
        return false;
    }

    refreshTabRedPoints(): void {
        const dailyHas = this.hasRequestedDailyTask
            ? this.hasClaimableTask(this.dailyTaskList)
            : this.dailyInfoClaimableCount > 0;
        const careerHas = this.hasRequestedCareerTask
            ? this.hasClaimableTask(this.careerTaskList)
            : this.careerInfoClaimableCount > 0;
        if (this.tabDailyRedPoint) {
            this.tabDailyRedPoint.active = dailyHas;
        }
        if (this.tabCareerRedPoint) {
            this.tabCareerRedPoint.active = careerHas;
        }
    }

    setTabState(
        btn: cc.Node | null,
        label: cc.Label | null,
        activeBg: cc.Node | null,
        inactiveBg: cc.Node | null,
        isActive: boolean
    ): void {
        if (activeBg) {
            activeBg.active = !!isActive;
        }
        if (inactiveBg) {
            inactiveBg.active = !isActive;
        }
        if (btn) {
            btn.color = cc.Color.WHITE;
        }
        if (label) {
            label.node.color = cc.Color.WHITE;
        }
    }

    syncTabLayerOrder(isDailyActive: boolean): void {
        if (!this.btnTabDaily || !this.btnTabCareer) {
            return;
        }
        if (isDailyActive) {
            this.btnTabCareer.setSiblingIndex(0);
            this.btnTabDaily.setSiblingIndex(1);
        } else {
            this.btnTabDaily.setSiblingIndex(0);
            this.btnTabCareer.setSiblingIndex(1);
        }
    }

    renderTaskList(list: any[]): void {
        list = Array.isArray(list) ? list : [];
        this.recycleAllTaskNodes();
        if (this.taskItemPrefab && this.scrollContent && this.scrollViewView) {
            if (list.length <= 0) {
                this.setLabelText(this.lblTabHeader, this.i18n("key_task_empty", null, "No tasks yet"));
            }
            for (let i = 0; i < list.length; i++) {
                const node = this.acquireTaskNode();
                if (node) {
                    node.parent = this.scrollContent;
                    node.active = true;
                    node.y = -102.5 - 179 * i;
                    node.x = 0;
                    this.bindTaskItem(node, list[i]);
                    this.activeTaskNodes.push(node);
                }
            }
            this.refreshContentSize(list.length, 155);
            this.scrollView?.scrollToTop(0);
        }
    }

    acquireTaskNode(): cc.Node | null {
        if (this.taskItemPool && this.taskItemPool.size() > 0) {
            return this.taskItemPool.get();
        }
        return this.taskItemPrefab ? cc.instantiate(this.taskItemPrefab) : null;
    }

    recycleAllTaskNodes(): void {
        while (this.activeTaskNodes.length > 0) {
            const node = this.activeTaskNodes.pop();
            if (node && node.isValid) {
                const refs = (node as any)._taskItemRefs as TaskItemRefs;
                if (refs && refs.btnNode) {
                    refs.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
                    (refs.btnNode as any)._taskData = null;
                }
                this.taskItemPool.put(node);
            }
        }
    }

    bindTaskItem(node: cc.Node, task: any): void {
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
        if (refs.descLabel) {
            refs.descLabel.string = this.buildTaskDesc(task);
        }
        this.refreshTaskProgress(task, refs);
        this.refreshTaskButton(task, refs);
    }

    buildTaskDesc(task: any): string {
        task = task || {};
        const type = this.parseTaskType(task.taskType || "");
        let target = task.taskTargetNum;
        if (target == null || target === "") {
            target = Number(task.taskNum || 1);
        }
        target = Number(target);
        if (!isFinite(target)) {
            target = Number(task.taskNum || 1);
        }
        if (target < 0) {
            target = 0;
        }
        if (type === "login") {
            return this.i18n("key_task_desc_login", null, "Daily login");
        }
        if (type === "level") {
            return this.i18n("key_task_desc_level", [target], "Clear %{0} levels");
        }
        if (type === "ad") {
            return this.i18n("key_task_desc_ad", [target], "Watch %{0} ads");
        }
        return task.desc || this.i18n("key_task_desc_fallback", [task.taskType || "-", task.finishedNum, task.taskNum], "Task %{0}: %{1}/%{2}");
    }

    getTaskItemRefs(node: cc.Node): TaskItemRefs | null {
        if (!node) {
            return null;
        }
        if ((node as any)._taskItemRefs) {
            return (node as any)._taskItemRefs;
        }
        const iconNode = this.findNodeDeep(node, "icon_reward");
        const refs: TaskItemRefs = {
            rewardLabel: this.findLabelDeep(node, "lbl_reward"),
            descLabel: this.findLabelDeep(node, "lbl_desc"),
            rewardIconSprite: iconNode ? iconNode.getComponent(cc.Sprite) : null,
            progressBg: this.findNodeDeep(node, "progress_bg"),
            progressFill: this.findNodeDeep(node, "progress_fill"),
            progressLabel: this.findLabelDeep(node, "lbl_progress"),
            btnNode: this.findNodeDeep(node, "btn_claim"),
            btnLabel: this.findLabelDeep(node, "lbl_btn"),
            btnOutline: null,
            btnSprite: null,
            btnComp: null,
        };
        refs.btnComp = refs.btnNode ? refs.btnNode.getComponent(cc.Button) : null;
        refs.btnSprite = refs.btnNode ? refs.btnNode.getComponent(cc.Sprite) : null;
        refs.btnOutline = refs.btnLabel ? refs.btnLabel.node.getComponent(cc.LabelOutline) : null;
        (node as any)._taskItemRefs = refs;
        return refs;
    }

    refreshTaskProgress(task: any, refs: TaskItemRefs): void {
        const total = Math.max(1, Number(task.taskNum || 1));
        let finished = Number(task.finishedNum || 0);
        if (finished < 0) {
            finished = 0;
        }
        if (finished > total) {
            finished = total;
        }
        const ratio = finished / total;
        if (refs.progressBg && refs.progressFill) {
            refs.progressFill.width = refs.progressBg.width * ratio;
            refs.progressFill.x = -refs.progressBg.width / 2;
        }
        if (refs.progressLabel) {
            refs.progressLabel.string = this.i18n("key_task_progress", [finished, total], finished + "/" + total);
        }
    }

    refreshTaskButton(task: any, refs: TaskItemRefs): void {
        if (!refs.btnNode) {
            return;
        }
        refs.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
        (refs.btnNode as any)._taskData = task;
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
            if (refs.btnLabel?.node) {
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
            if (refs.btnLabel?.node) {
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
                refs.btnSprite.spriteFrame = this.btnFinishSpriteFrame || this.btnClaimSpriteFrame || refs.btnSprite.spriteFrame;
            }
            if (refs.btnLabel?.node) {
                refs.btnLabel.node.color = cc.Color.WHITE;
            }
            this.setLabelOutlineColor(refs.btnOutline, new cc.Color(83, 83, 83, 255));
            refs.btnNode.color = cc.Color.WHITE;
        }
    }

    setLabelOutlineColor(outline: cc.LabelOutline | null, color: cc.Color): void {
        if (outline) {
            outline.color = color || cc.Color.WHITE;
            outline.width = 2;
        }
    }

    onClickTaskButton(event: cc.Event.EventTouch): void {
        event?.stopPropagation?.();
        const target = event?.currentTarget as cc.Node;
        if (target) {
            const task = (target as any)._taskData;
            if (task) {
                const status = this.parseTaskStatus(task.status);
                if (status === 0) {
                    this.onClickClose();
                } else if (status === 1) {
                    this.showTaskRewardPopup(task, true);
                }
            }
        }
    }

    showTaskRewardPopup(task: any, closeSelf: boolean): void {
        if (!task) {
            return;
        }
        let showAmount = this.parseAmount(task.showAmount);
        let taskReward = this.parseAmount(task.taskReward);
        if (showAmount === null) {
            showAmount = 0;
        }
        if (taskReward === null) {
            taskReward = showAmount;
        }
        if (closeSelf) {
            this.onClickClose();
        }
        UIMgr.getInstance().show(UIDefine.arrowSettleRewardView).then((node) => {
            if (node && node.isValid) {
                let comp = node.getComponent(ArrowSettleRewardView);
                if (!comp) {
                    comp = node.addComponent(ArrowSettleRewardView);
                }
                comp?.setEntryData?.({
                    popupMode: "task",
                    isLevelPassed: false,
                    taskId: task.id || "",
                    showAmount,
                    taskReward,
                    onTaskClaim: (ctx: any, done?: (ok?: boolean) => void) => {
                        this.submitTaskClaim(task, ctx, done);
                    },
                });
            }
        });
    }

    submitTaskClaim(task: any, ctx: any, done?: (ok?: boolean) => void): void {
        const callback = typeof done === "function" ? done : () => { };
        const payload = ctx || {};
        const taskId = String(payload.taskId || (task && task.id) || "");
        const taskType = String(payload.taskType || (task && task.claimTaskType) || "");
        if (!taskId) {
            this.showToast(this.i18n("key_result_tip_claim_error", null, "Claim failed. Please try again later"));
            callback(false);
            return;
        }
        if (this.isTaskClaiming) {
            callback(false);
            return;
        }
        this.isTaskClaiming = true;
        this.requestTaskReward(taskId, taskType, !!payload.isDouble, (success) => {
            this.isTaskClaiming = false;
            if (success) {
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
                        const service = UserInfoService;
                        if (service && typeof service.getInstance === "function") {
                            const instance = service.getInstance();
                            instance?.fetch?.();
                        }
                    } catch (err) {
                        cc.warn("[arrowTaskPopupView] UserInfoService.fetch after claim failed:", err);
                    }
                }
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    playTaskRewardVideo(onSuccess: (data: any) => void, onFail: (err: any) => void): void {
        const adMgr = AdManager.getInstance();
        if (adMgr && typeof adMgr.playNormalVideoAd === "function") {
            adMgr.playNormalVideoAd(
                { ad_type: "reward_video", force_video: false },
                (result: any) => {
                    if (!result || result.compensationQualifyMark === undefined || result.compensationQualifyMark) {
                        const cpmData = adMgr.cpm_data || {};
                        onSuccess?.({
                            video_type: "reward_video",
                            task_id: "",
                            force_type: "false",
                            source: cpmData.source || "",
                            unitId: cpmData.unitId || "",
                            cpm: cpmData.cpm || 0,
                        });
                    } else {
                        onFail?.(result);
                    }
                },
                (err: any) => {
                    cc.warn("[arrowTaskPopupView] task reward video failed:", err?.message || err);
                    onFail?.(err);
                },
                this.i18n("key_tip_reward_video_play_fail", null, "Rewarded video failed to play, please try again")
            );
        } else {
            onSuccess?.({ video_type: "reward_video", task_id: "", force_type: "false" });
        }
    }

    requestTaskReward(taskId: string, taskType: string, isDouble: boolean, callback: (success: boolean) => void): void {
        const ctx = { businessType: "task", taskType: taskType || "", taskId: taskId || "" };
        const finish = (success: boolean, data?: any) => {
            if (success) {
                try {
                    BusinessAnalyticsService.reportData("task_claim", {
                        task_id: ctx.taskId || "",
                        task_type: ctx.taskType || "",
                        is_double: isDouble ? 1 : 0,
                    });
                } catch (e) {
                }
                this.applyTaskRewardResult(data || {});
                callback(true);
            } else {
                cc.warn("[arrowTaskPopupView] claim task reward failed:", "taskId=", ctx.taskId, "taskType=", ctx.taskType, "isDouble=", !!isDouble);
                this.showToast(this.i18n("key_result_tip_claim_error", null, "Claim failed. Please try again later"));
                callback(false);
            }
        };
        if (isDouble) {
            ArrowRewardService.claimDouble({ ...ctx, fallbackOnAdFail: false }, finish);
        } else {
            ArrowRewardService.claimNormal(ctx, finish);
        }
    }

    applyTaskRewardResult(data: any): void {
        if (!data) {
            return;
        }
        if (this.node && this.node.isValid) {
            this.refreshTabVisual();
        }
        const payload: any = {};
        if (data.cash_balance !== undefined) {
            payload.cash_balance = data.cash_balance;
        }
        if (data.bubble_balance !== undefined) {
            payload.bubble_balance = data.bubble_balance;
        }
        if (data.user_level !== undefined) {
            payload.user_level = data.user_level;
        }
        if (data.hint_prop_count !== undefined) {
            payload.hint_prop_count = data.hint_prop_count;
        }
        if (data.guideline_prop_count !== undefined) {
            payload.guideline_prop_count = data.guideline_prop_count;
        }
        if (data.task_point_num !== undefined) {
            payload.task_point_num = data.task_point_num;
        }
        if (data.ltv_task_point_num !== undefined) {
            payload.ltv_task_point_num = data.ltv_task_point_num;
        }
        if (data.sign_in !== undefined) {
            payload.sign_in = data.sign_in;
        }
        try {
            GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, payload);
        } catch (err) {
            cc.warn("[arrowTaskPopupView] emit userInfoUpdated failed:", err);
        }
    }

    refreshContentSize(count: number, itemHeight: number): void {
        if (this.scrollContent && this.scrollViewView) {
            const height = count > 0
                ? count * itemHeight + 24 * Math.max(0, count - 1) + 180
                : this.scrollViewView.height;
            this.scrollContent.height = Math.max(this.scrollViewView.height, height);
            this.scrollContent.y = this.scrollViewView.height / 2;
        }
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

    i18n(key: string, params: any, fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    setLabelText(label: cc.Label | null, text: string): void {
        if (label) {
            label.string = text || "";
        }
    }

    showToast(message: string): void {
        try {
            Tips.show(message);
        } catch (e) {
            cc.log("[arrowTaskPopupView] toast:", message);
        }
    }

    findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node || !name) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findNodeDeep(node.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    findLabelDeep(node: cc.Node, name: string): cc.Label | null {
        const found = this.findNodeDeep(node, name);
        return found ? found.getComponent(cc.Label) : null;
    }
}
