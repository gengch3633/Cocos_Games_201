import AdManager from "./AdManager";
import ArrowRewardService from "./ArrowRewardService";
import ArrowSettleRewardView from "./arrowSettleRewardView";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr, { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import PlayerDataStore from "./PlayerDataStore";
import ResMgr from "./ResMgr";
import Tips from "./Tips";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserInfoService from "./UserInfoService";

const ArrowTaskPopupView = cc.Class({
  extends: cc.Component, properties: {
  }
, onLoad: function() {
    this.currentTab = "daily";
    this.rawTaskList = [];
    this.rawDailyTaskList = [];
    this.rawCareerTaskList = [];
    this.dailyTaskList = [];
    this.careerTaskList = [];
    this.taskItemPrefab = null;
    this.taskItemPool = new cc.NodePool();
    this.activeTaskNodes = [];
    this.isLoading = ! 1;
    this.isTaskClaiming = ! 1;
    this.btnGoSpriteFrame = null;
    this.btnClaimSpriteFrame = null;
    this.btnFinishSpriteFrame = null;
    this.titleBgSpriteFrame = null;
    this.rewardIconSpriteFrame = null;
    this.rewardIconReqVersion = 0;
    this.dailyInfoClaimableCount = 0;
    this.careerInfoClaimableCount = 0;
    this.hasRequestedDailyTask = ! 1;
    this.hasRequestedCareerTask = ! 1;
    this.isDailyLoading = ! 1;
    this.isCareerLoading = ! 1;
    this.loadingVisibleCount = 0;
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
, onDestroy: function() {
    this.clearRequestLoading();
    this.unbindLanguageEvent();
    this.unbindEvents();
    this.recycleAllTaskNodes();
    this.taskItemPool&& this.taskItemPool.clear();
  }
, bindLanguageEvent: function() {
    GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, unbindLanguageEvent: function() {
    GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, onLanguageChanged: function() {
    this.refreshStaticTexts();
    this.loadRewardIconSpriteFrame();
    this.renderActiveTab();
  }
, bindNodes: function() {
    this.maskNode = this.findNodeDeep(this.node, "mask");
    this.panelNode = this.findNodeDeep(this.node, "block_panel");
    this.btnClose = this.findNodeDeep(this.node, "btn_close");
    this.titleBgNode = this.findNodeDeep(this.node, "lbl_title");
    this.titleBgSprite = this.titleBgNode? this.titleBgNode.getComponent(cc.Sprite): null;
    this.lblTitle = this.findLabelDeep(this.node, "lbl_title_text")|| this.findLabelDeep(this.node, "lbl_title");
    this.scrollViewNode = this.findNodeDeep(this.node, "scroll_view");
    this.scrollView = this.scrollViewNode? this.scrollViewNode.getComponent(cc.ScrollView): null;
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
, bindEvents: function() {
    this.maskNode&& this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.btnClose&& this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.panelNode&& this.panelNode.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
    this.panelNode&& this.panelNode.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
    this.btnTabDaily&& this.btnTabDaily.on(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
    this.btnTabCareer&& this.btnTabCareer.on(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
  }
, unbindEvents: function() {
    this.maskNode&& this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.btnClose&& this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    this.panelNode&& this.panelNode.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
    this.panelNode&& this.panelNode.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
    this.btnTabDaily&& this.btnTabDaily.off(cc.Node.EventType.TOUCH_END, this.onClickTabDaily, this);
    this.btnTabCareer&& this.btnTabCareer.off(cc.Node.EventType.TOUCH_END, this.onClickTabCareer, this);
  }
, onTouchInsidePanel: function(e) {
    e&& e.stopPropagation&& e.stopPropagation();
  }
, refreshStaticTexts: function() {
    this.ensureTitleBackground();
    this.setLabelText(this.lblTitle, this.i18n("key_task_popup_title", null, "Task"));
    this.setLabelText(this.lblTabDaily, this.i18n("key_task_tab_daily", null, "Daily task"));
    this.setLabelText(this.lblTabCareer, this.i18n("key_task_tab_career", null, "Career task"));
    this.refreshTabVisual();
  }
, preloadButtonSpriteFrames: function() {
    var e = this;
    ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_go_bg", cc.SpriteFrame, this, "ui").then(function(t) {
      if(t) {
        e.btnGoSpriteFrame = t;
        e.renderActiveTab();
      }
    }
);
    ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_btn_claim_bg", cc.SpriteFrame, this, "ui").then(function(t) {
      if(t) {
        e.btnClaimSpriteFrame = t;
        e.renderActiveTab();
      }
    }
);
    ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_finish", cc.SpriteFrame, this, "ui").then(function(t) {
      if(t) {
        e.btnFinishSpriteFrame = t;
        e.renderActiveTab();
      }
    }
);
    ResMgr.getInstance().loadRes("texture/arrow_task/arrow_task_popup_title_bg", cc.SpriteFrame, this, "ui").then(function(t) {
      if(t) {
        e.titleBgSpriteFrame = t;
        e.ensureTitleBackground();
      }
    }
);
  }
, loadRewardIconSpriteFrame: function() {
    var e = this, t = CountryAssetService.getPathByImageName("money_arrow_icon"), i = CountryAssetService.getPathByImageName("money_arrow_icon", "ID"), n = ++ this.rewardIconReqVersion, o = function(t) {
      if(t&& n === e.rewardIconReqVersion&& cc.isValid(e.node)) {
        e.rewardIconSpriteFrame = t;
        e.applyRewardIconToActiveItems();
      }
    }
;
    ResMgr.getInstance().loadRes(t, cc.SpriteFrame, this, "game").then(function(n) {
      n? o(n): i&& i !== t? ResMgr.getInstance().loadRes(i, cc.SpriteFrame, e, "game").then(function(e) {
        e? o(e): cc.warn("[arrowTaskPopupView] load reward icon fallback failed:", i);
      }
): cc.warn("[arrowTaskPopupView] load reward icon failed:", t);
    }
);
  }
, applyRewardIconToActiveItems: function() {
    if(this.rewardIconSpriteFrame&& this.activeTaskNodes) for(var e = 0;
    e < this.activeTaskNodes.length;
    e++) {
      var t = this.activeTaskNodes[e];
      if(t&& t.isValid) {
        var i = t._taskItemRefs, n = i&& i.rewardIconSprite;
        n&& cc.isValid(n)&& (n.spriteFrame = this.rewardIconSpriteFrame);
      }
    }
  }
, ensureTitleBackground: function() {
    if(this.titleBgSprite) {
      this.titleBgSprite.enabled = ! 0;
      this.titleBgSpriteFrame&& (this.titleBgSprite.spriteFrame = this.titleBgSpriteFrame);
      this.titleBgNode&& (this.titleBgNode.opacity = 255);
    }
  }
, loadTaskItemPrefab: function() {
    var e = this;
    ResMgr.getInstance().loadRes("prefab/arrowTaskItem", cc.Prefab, this, "ui").then(function(t) {
      if(t) {
        e.taskItemPrefab = t;
        e.renderActiveTab();
      } else cc.warn("[arrowTaskPopupView] load item prefab failed");
    }
);
  }
, requestTaskInfo: function() {
    this.requestTaskInfoForTab(this.currentTab, ! 0);
  }
, ensureTabTaskRequested: function(e) {
    this.requestTaskInfoForTab(e, ! 1);
  }
, normalizeTabName: function(e) {
    return "career" === e? "career": "daily";
  }
, getTaskTypeByTab: function(e) {
    return "career" === this.normalizeTabName(e)? "ltv": "";
  }
, isTabRequested: function(e) {
    return "career" === this.normalizeTabName(e)? ! ! this.hasRequestedCareerTask: ! ! this.hasRequestedDailyTask;
  }
, setTabRequested: function(e, t) {
    "career" !== this.normalizeTabName(e)? this.hasRequestedDailyTask = ! ! t: this.hasRequestedCareerTask = ! ! t;
  }
, isTabLoading: function(e) {
    return "career" === this.normalizeTabName(e)? ! ! this.isCareerLoading: ! ! this.isDailyLoading;
  }
, setTabLoading: function(e, t) {
    "career" !== this.normalizeTabName(e)? this.isDailyLoading = ! ! t: this.isCareerLoading = ! ! t;
  }
, parseClaimableCount: function(e) {
    var t = Number(e);
    return ! isFinite(t)|| t < 0? 0: Math.floor(t);
  }
, initClaimableCountsFromInfo: function() {
    this.dailyInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.task_point_num);
    this.careerInfoClaimableCount = this.parseClaimableCount(PlayerDataStore.ltv_task_point_num);
  }
, updateClaimableCountsFromInfoData: function(e) {
    if(e) {
      if(void 0 !== e.task_point_num) {
        this.dailyInfoClaimableCount = this.parseClaimableCount(e.task_point_num);
        PlayerDataStore.task_point_num = this.dailyInfoClaimableCount;
      }
      if(void 0 !== e.ltv_task_point_num) {
        this.careerInfoClaimableCount = this.parseClaimableCount(e.ltv_task_point_num);
        PlayerDataStore.ltv_task_point_num = this.careerInfoClaimableCount;
      }
    }
  }
, countClaimableTaskNum: function(e) {
    if(! Array.isArray(e)) return 0;
    for(var t = 0, i = 0;
    i < e.length;
    i++) {
      var n = e[i]|| {
      }
;
      1 === this.parseTaskStatus(n.status)&& (t+= 1);
    }
    return t;
  }
, resolveCurrentClaimableCount: function(e) {
    return "career" === this.normalizeTabName(e)? this.hasRequestedCareerTask? this.countClaimableTaskNum(this.careerTaskList): this.parseClaimableCount(this.careerInfoClaimableCount): this.hasRequestedDailyTask? this.countClaimableTaskNum(this.dailyTaskList): this.parseClaimableCount(this.dailyInfoClaimableCount);
  }
, syncTaskRedDotToGameView: function() {
    var e = this.resolveCurrentClaimableCount("daily"), t = this.resolveCurrentClaimableCount("career");
    this.dailyInfoClaimableCount = e;
    this.careerInfoClaimableCount = t;
    PlayerDataStore.task_point_num = e;
    PlayerDataStore.ltv_task_point_num = t;
    try {
      GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, {
        task_point_num: e, ltv_task_point_num: t
      }
);
    } catch(e) {
      cc.warn("[arrowTaskPopupView] syncTaskRedDotToGameView emit failed:", e);
    }
  }
, requestTaskInfoForTab: function(e, t) {
    var i = this;
    e = this.normalizeTabName(e);
    if((t|| ! this.isTabRequested(e))&& ! this.isTabLoading(e)) {
      this.setTabLoading(e, ! 0);
      this.showRequestLoading();
      var n = this.getTaskTypeByTab(e), a = NetErrorPopupService|| m, o = function() {
        i.setTabLoading(e, ! 1);
        i.hideRequestLoading();
        i.requestTaskInfoForTab(e, ! 0);
      }
;
      this.requestTaskInfoByType(n, function(t) {
        if(a&& a.shouldPop(t)) {
          i.hideRequestLoading();
          i.setTabLoading(e, ! 1);
          cc.warn("[arrowTaskPopupView] getTaskInfo force-retry code=", t&& t.code, "taskType=", n|| "daily");
          a.showAndRetry(o);
        } else {
          i.hideRequestLoading();
          i.setTabLoading(e, ! 1);
          if(i.node&& i.node.isValid) if(t&& 1 === Number(t.code)) {
            i.assignRawTaskListByType(n, i.extractTaskList(t));
            i.updateClaimableCountsFromInfoData(t.data|| {
            }
);
            i.setTabRequested(e, ! 0);
            i.regroupTaskList();
            i.refreshTabVisual();
            i.currentTab === e&& i.renderTaskList(i.getActiveTaskList());
            i.syncTaskRedDotToGameView();
          } else {
            cc.warn("[arrowTaskPopupView] getTaskInfo failed:", t&& t.message, "taskType=", n|| "daily");
            i.assignRawTaskListByType(n, []);
            i.setTabRequested(e, ! 1);
            i.regroupTaskList();
            i.refreshTabVisual();
            i.currentTab === e&& i.renderTaskList(i.getActiveTaskList());
          }
        }
      }
, function(t) {
        if(a&& a.shouldPop(t)) {
          i.hideRequestLoading();
          i.setTabLoading(e, ! 1);
          cc.warn("[arrowTaskPopupView] getTaskInfo 网络异常，弹重试窗 err=", t&& t.message, "taskType=", n|| "daily");
          a.showAndRetry(o);
        } else {
          i.hideRequestLoading();
          i.setTabLoading(e, ! 1);
          if(i.node&& i.node.isValid) {
            cc.warn("[arrowTaskPopupView] getTaskInfo error:", t&& t.message, "taskType=", n|| "daily");
            i.assignRawTaskListByType(n, []);
            i.setTabRequested(e, ! 1);
            i.regroupTaskList();
            i.refreshTabVisual();
            i.currentTab === e&& i.renderTaskList(i.getActiveTaskList());
          }
        }
      }
);
    }
  }
, showRequestLoading: function() {
    this.loadingVisibleCount+= 1;
    var e = UIMgr&& UIMgr.getInstance? UIMgr.getInstance(): null;
    e&& e.showWatingUI&& e.showWatingUI();
  }
, hideRequestLoading: function() {
    if(!(this.loadingVisibleCount <= 0)) {
      this.loadingVisibleCount-= 1;
      var e = UIMgr&& UIMgr.getInstance? UIMgr.getInstance(): null;
      e&& e.hideWatingUI&& e.hideWatingUI();
    }
  }
, clearRequestLoading: function() {
    for(;
    this.loadingVisibleCount > 0;
) this.hideRequestLoading();
  }
, requestTaskInfoByType: function(e, t, i) {
    LoadingHttpService.getTaskInfo? LoadingHttpService.getTaskInfo(e|| "", Handler.create(this, function(e) {
      t&& t(e);
    }
), Handler.create(this, function(e) {
      i&& i(e);
    }
)): i&& i({
      message: "getTaskInfo is unavailable"
    }
);
  }
, assignRawTaskListByType: function(e, t) {
    t = Array.isArray(t)? t:[];
    if("ltv" !== e) {
      this.rawDailyTaskList = t;
      this.rawTaskList = t;
    } else this.rawCareerTaskList = t;
  }
, extractTaskList: function(e) {
    if(! e) return[];
    var t = e.data|| {
    }
, i = t.task_list|| [];
! Array.isArray(i)&& t.data&& (i = t.data.task_list|| []);
    return Array.isArray(i)? i:[];
  }
, regroupTaskList: function() {
    var e = [], t = [], i = 0;
    if(this.hasRequestedDailyTask|| this.hasRequestedCareerTask) {
      i = this.appendNormalizedTaskList(e, t, this.rawDailyTaskList, ! 0, i);
      this.appendNormalizedTaskList(e, t, this.rawCareerTaskList, ! 1, i);
    } else this.appendNormalizedTaskList(e, t, this.rawTaskList, void 0, i);
    this.dailyTaskList = this.sortClaimedToTail(this.dedupeTaskListById(e));
    this.careerTaskList = this.sortClaimedToTail(this.dedupeTaskListById(t));
  }
, appendNormalizedTaskList: function(e, t, i, n, a) {
    i = Array.isArray(i)? i:[];
    for(var o = Number(a|| 0), r = 0;
    r < i.length;
    r++) {
      var s = this.normalizeTask(i[r], o, n);
      o+= 1;
      s.ifDaily? e.push(s): t.push(s);
    }
    return o;
  }
, dedupeTaskListById: function(e) {
    e = Array.isArray(e)? e:[];
    for(var t = {
    }
, i = [], n = 0;
    n < e.length;
    n++) {
      var a = e[n]|| {
      }
, o = String(a.id|| "");
      if(! o|| ! t[o]) {
        o&& (t[o] = ! 0);
        i.push(a);
      }
    }
    return i;
  }
, normalizeTask: function(e, t, i) {
    e = e|| {
    }
;
    var n = Number(e.finished_num|| 0), a = Number(e.task_num);
    isFinite(a)|| (a = Number(e.task_count|| e.count));
    isFinite(a)|| (a = null);
    var o = a > 0? a: 1;
    o = o > 0? o: 1;
    n < 0&& (n = 0);
    var r = this.parseTaskType(e.task_type|| e.task|| e.type|| ""), s = this.parseAmount(e.task_reward);
    null === s&& (s = this.parseAmount(e.reward));
    var l = this.parseAmount(e.show_amount);
    null === l&& (l = this.parseAmount(e.double_amount));
    null === l&& (l = this.parseAmount(e.show_reward));
    null === l&& (l = s);
    null === s&& (s = l);
    null === s&& (s = 0);
    null === l&& (l = s);
    var c = this.parseDailyFlag(e.if_daily, i);
    return {
      id: String(e.id|| "task_"+ t), status: this.parseTaskStatus(e.status), ifDaily: c, claimTaskType: this.resolveClaimTaskType(c), desc: e.task_desc|| e.desc|| e.title|| "", taskType: r, reward: s, taskReward: s, showAmount: l, finishedNum: n, taskNum: o, taskTargetNum: a, raw: e
    }
;
  }
, parseDailyFlag: function(e, t) {
    return null == e|| "" === e? void 0 !== t&& ! ! t: ! 0 === e|| 1 === e|| "1" === e|| "true" === e;
  }
, resolveClaimTaskType: function(e) {
    return e? "": "ltv";
  }
, parseTaskStatus: function(e) {
    var t = Number(e);
    return 1 === t? 1: 2 === t? 2: 0;
  }
, parseAmount: function(e) {
    var t = Number(e);
    return isFinite(t)?(t = Math.floor(t)) < 0? 0: t: null;
  }
, parseTaskType: function(e) {
    var t = String(e|| "").toLowerCase();
    return(t = t.replace(/\s+/g, ""))? "daily_login" === t|| "signin" === t|| "sign" === t|| "login" === t? "login": "pass_level" === t|| "clear_level" === t|| "passlevel" === t|| "clearlevel" === t|| "level" === t? "level": "watch_ad" === t|| "watchad" === t|| "watch_video" === t|| "watchvideo" === t|| "video" === t|| "ads" === t|| "ad" === t? "ad": t: "";
  }
, sortClaimedToTail: function(e) {
    for(var t = [], i = [], n = 0;
    n < e.length;
    n++) 2 === e[n].status? i.push(e[n]): t.push(e[n]);
    return t.concat(i);
  }
, onClickTabDaily: function() {
    this.switchTab("daily");
  }
, onClickTabCareer: function() {
    this.switchTab("career");
  }
, switchTab: function(e) {
    if(this.currentTab !== e) {
      this.currentTab = e;
      this.renderActiveTab();
      this.ensureTabTaskRequested(e);
    } else this.ensureTabTaskRequested(e);
  }
, getActiveTaskList: function() {
    return "daily" === this.currentTab? this.dailyTaskList: this.careerTaskList;
  }
, renderActiveTab: function() {
    this.refreshTabVisual();
    this.renderTaskList(this.getActiveTaskList());
  }
, refreshTabVisual: function() {
    var e = "daily" === this.currentTab;
    this.setTabState(this.btnTabDaily, this.lblTabDaily, this.tabDailyActiveBg, this.tabDailyInactiveBg, e);
    this.setTabState(this.btnTabCareer, this.lblTabCareer, this.tabCareerActiveBg, this.tabCareerInactiveBg, ! e);
    this.refreshTabRedPoints();
    this.syncTabLayerOrder(e);
    this.setLabelText(this.lblTabHeader, e? this.i18n("key_task_tab_daily", null, "Daily task"): this.i18n("key_task_tab_career", null, "Career task"));
  }
, hasClaimableTask: function(e) {
    if(! Array.isArray(e)|| e.length <= 0) return ! 1;
    for(var t = 0;
    t < e.length;
    t++) {
      var i = e[t]|| {
      }
;
      if(1 === this.parseTaskStatus(i.status)) return ! 0;
    }
    return ! 1;
  }
, refreshTabRedPoints: function() {
    var e = this.hasRequestedDailyTask? this.hasClaimableTask(this.dailyTaskList): this.dailyInfoClaimableCount > 0, t = this.hasRequestedCareerTask? this.hasClaimableTask(this.careerTaskList): this.careerInfoClaimableCount > 0;
    this.tabDailyRedPoint&& (this.tabDailyRedPoint.active = e);
    this.tabCareerRedPoint&& (this.tabCareerRedPoint.active = t);
  }
, setTabState: function(e, t, i, n, a) {
    i&& (i.active = ! ! a);
    n&& (n.active = ! a);
    e&& (e.color = cc.Color.WHITE);
    t&& (t.node.color = cc.Color.WHITE);
  }
, syncTabLayerOrder: function(e) {
    if(this.btnTabDaily&& this.btnTabCareer) if(e) {
      this.btnTabCareer.setSiblingIndex(0);
      this.btnTabDaily.setSiblingIndex(1);
    } else {
      this.btnTabDaily.setSiblingIndex(0);
      this.btnTabCareer.setSiblingIndex(1);
    }
  }
, renderTaskList: function(e) {
    e = Array.isArray(e)? e:[];
    this.recycleAllTaskNodes();
    if(this.taskItemPrefab&& this.scrollContent&& this.scrollViewView) {
      e.length <= 0&& this.setLabelText(this.lblTabHeader, this.i18n("key_task_empty", null, "No tasks yet"));
      for(var t = 0;
      t < e.length;
      t++) {
        var i = this.acquireTaskNode();
        if(i) {
          i.parent = this.scrollContent;
          i.active = ! 0;
          i.y = - 102.5- 179* t;
          i.x = 0;
          this.bindTaskItem(i, e[t]);
          this.activeTaskNodes.push(i);
        }
      }
      this.refreshContentSize(e.length, 155);
      this.scrollView&& this.scrollView.scrollToTop(0);
    }
  }
, acquireTaskNode: function() {
    return this.taskItemPool&& this.taskItemPool.size() > 0? this.taskItemPool.get(): this.taskItemPrefab? cc.instantiate(this.taskItemPrefab): null;
  }
, recycleAllTaskNodes: function() {
    for(;
    this.activeTaskNodes.length > 0;
) {
      var e = this.activeTaskNodes.pop();
      if(e&& e.isValid) {
        var t = e._taskItemRefs;
        if(t&& t.btnNode) {
          t.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
          t.btnNode._taskData = null;
        }
        this.taskItemPool.put(e);
      }
    }
  }
, bindTaskItem: function(e, t) {
    var i = this.getTaskItemRefs(e);
    if(i) {
      i.rewardLabel&& (i.rewardLabel.string = this.formatCurrency(null != t.showAmount? t.showAmount: t.reward));
      i.rewardIconSprite&& this.rewardIconSpriteFrame&& (i.rewardIconSprite.spriteFrame = this.rewardIconSpriteFrame);
      var n = this.buildTaskDesc(t);
      i.descLabel&& (i.descLabel.string = n);
      this.refreshTaskProgress(t, i);
      this.refreshTaskButton(t, i);
    }
  }
, buildTaskDesc: function(e) {
    e = e|| {
    }
;
    var t = this.parseTaskType(e.taskType|| ""), i = e.taskTargetNum;
    null != i&& "" !== i|| (i = Number(e.taskNum|| 1));
    i = Number(i);
    isFinite(i)|| (i = Number(e.taskNum|| 1));
    i < 0&& (i = 0);
    return "login" === t? this.i18n("key_task_desc_login", null, "Daily login"): "level" === t? this.i18n("key_task_desc_level", [i], "Clear %{0} levels"): "ad" === t? this.i18n("key_task_desc_ad", [i], "Watch %{0} ads"): e.desc|| this.i18n("key_task_desc_fallback", [e.taskType|| "-", e.finishedNum, e.taskNum], "Task %{0}: %{1}/%{2}");
  }
, getTaskItemRefs: function(e) {
    if(! e) return null;
    if(e._taskItemRefs) return e._taskItemRefs;
    var t = this.findNodeDeep(e, "icon_reward"), i = {
      rewardLabel: this.findLabelDeep(e, "lbl_reward"), descLabel: this.findLabelDeep(e, "lbl_desc"), rewardIconSprite: t? t.getComponent(cc.Sprite): null, progressBg: this.findNodeDeep(e, "progress_bg"), progressFill: this.findNodeDeep(e, "progress_fill"), progressLabel: this.findLabelDeep(e, "lbl_progress"), btnNode: this.findNodeDeep(e, "btn_claim"), btnLabel: this.findLabelDeep(e, "lbl_btn"), btnOutline: null, btnSprite: null, btnComp: null
    }
;
    i.btnComp = i.btnNode? i.btnNode.getComponent(cc.Button): null;
    i.btnSprite = i.btnNode? i.btnNode.getComponent(cc.Sprite): null;
    i.btnOutline = i.btnLabel? i.btnLabel.node.getComponent(cc.LabelOutline): null;
    e._taskItemRefs = i;
    return i;
  }
, refreshTaskProgress: function(e, t) {
    var i = Math.max(1, Number(e.taskNum|| 1)), n = Number(e.finishedNum|| 0);
    n < 0&& (n = 0);
    n > i&& (n = i);
    var a = n/ i;
    if(t.progressBg&& t.progressFill) {
      t.progressFill.width = t.progressBg.width* a;
      t.progressFill.x = - t.progressBg.width/ 2;
    }
    t.progressLabel&& (t.progressLabel.string = this.i18n("key_task_progress", [n, i], n+ "/"+ i));
  }
, refreshTaskButton: function(e, t) {
    if(t.btnNode) {
      t.btnNode.off(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
      t.btnNode._taskData = e;
      var i = this.parseTaskStatus(e.status);
      if(0 !== i) if(1 !== i) {
        t.btnLabel&& (t.btnLabel.string = this.i18n("key_task_btn_claimed", null, "Claimed"));
        if(t.btnComp) {
          t.btnComp.enableAutoGrayEffect = ! 1;
          t.btnComp.interactable = ! 1;
        }
        t.btnSprite&& (this.btnFinishSpriteFrame? t.btnSprite.spriteFrame = this.btnFinishSpriteFrame: this.btnClaimSpriteFrame&& (t.btnSprite.spriteFrame = this.btnClaimSpriteFrame));
        t.btnLabel&& t.btnLabel.node&& (t.btnLabel.node.color = cc.Color.WHITE);
        this.setLabelOutlineColor(t.btnOutline, new cc.Color(83, 83, 83, 255));
        t.btnNode.color = cc.Color.WHITE;
      } else {
        t.btnLabel&& (t.btnLabel.string = this.i18n("key_task_btn_claim", null, "Claim"));
        if(t.btnComp) {
          t.btnComp.enableAutoGrayEffect = ! 0;
          t.btnComp.interactable = ! 0;
        }
        t.btnSprite&& this.btnClaimSpriteFrame&& (t.btnSprite.spriteFrame = this.btnClaimSpriteFrame);
        t.btnLabel&& t.btnLabel.node&& (t.btnLabel.node.color = cc.Color.WHITE);
        this.setLabelOutlineColor(t.btnOutline, new cc.Color(44, 86, 11, 255));
        t.btnNode.color = cc.Color.WHITE;
        t.btnNode.on(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
      } else {
        t.btnLabel&& (t.btnLabel.string = this.i18n("key_task_btn_unfinished", null, "Unfinished"));
        if(t.btnComp) {
          t.btnComp.enableAutoGrayEffect = ! 0;
          t.btnComp.interactable = ! 0;
        }
        t.btnSprite&& this.btnGoSpriteFrame&& (t.btnSprite.spriteFrame = this.btnGoSpriteFrame);
        t.btnLabel&& t.btnLabel.node&& (t.btnLabel.node.color = cc.Color.WHITE);
        this.setLabelOutlineColor(t.btnOutline, new cc.Color(202, 72, 26, 255));
        t.btnNode.color = cc.Color.WHITE;
        t.btnNode.on(cc.Node.EventType.TOUCH_END, this.onClickTaskButton, this);
      }
    }
  }
, setLabelOutlineColor: function(e, t) {
    if(e) {
      e.color = t|| cc.Color.WHITE;
      e.width = 2;
    }
  }
, onClickTaskButton: function(e) {
    e&& e.stopPropagation&& e.stopPropagation();
    var t = e&& e.currentTarget;
    if(t) {
      var i = t._taskData;
      if(i) {
        var n = this.parseTaskStatus(i.status);
        0 !== n? 1 === n&& this.showTaskRewardPopup(i, ! 0): this.onClickClose();
      }
    }
  }
, showTaskRewardPopup: function(t, i) {
    var a = this;
    if(t) {
      var o = this.parseAmount(t.showAmount), r = this.parseAmount(t.taskReward);
      null === o&& (o = 0);
      null === r&& (r = o);
      i&& a.onClickClose();
      UIMgr.getInstance().show(UIDefine.arrowSettleRewardView).then(function(i) {
        if(i&& i.isValid) {
          var l = i.getComponent(ArrowSettleRewardView);
          l || (l = i.addComponent(ArrowSettleRewardView));
          l && l.setEntryData && l.setEntryData({
            popupMode: "task",
            isLevelPassed: !1,
            taskId: t.id || "",
            showAmount: o,
            taskReward: r,
            onTaskClaim: function(e, i) {
              a.submitTaskClaim(t, e, i);
            }
          });
        }
      });
}
},
submitTaskClaim: function(e, t, i) {
var n = this;
i = " function " == typeof i ? i : function() {};
var a = t || {}, o = String(a.taskId || e && e.id || " "), r = String(a.taskType || e && e.claimTaskType || " ");
if (o) if (this.isTaskClaiming) i(!1); else {
this.isTaskClaiming = !0;
this.requestTaskReward(o, r, !!a.isDouble, function(t) {
n.isTaskClaiming = !1;
if (t) {
if (e) {
e.status = 2;
e.raw && (e.raw.status = 2);
}
if (n.node && n.node.isValid) {
n.regroupTaskList();
n.renderActiveTab();
n.syncTaskRedDotToGameView();
n.requestTaskInfo();
} else {
n.syncTaskRedDotToGameView();
try {
var a = f && UserInfoService ? UserInfoService : f;
if (a && " function " == typeof a.getInstance) {
var o = a.getInstance();
o && " function " == typeof o.fetch && o.fetch();
}
} catch (e) {
cc.warn("[arrowTaskPopupView] UserInfoService.fetch after claim failed: ", e);
}
}
i(!0);
} else i(!1);
});
} else {
this.showToast(this.i18n(" key_result_tip_claim_error ", null, " Claim failed.Please try again later "));
i(!1);
}
},
playTaskRewardVideo: function(e, t) {
var i = u && AdManager && AdManager.getInstance ? AdManager.getInstance() : null;
i && " function " == typeof i.playNormalVideoAd ? i.playNormalVideoAd({
ad_type: " reward_video ",
force_video: !1
}, function(n) {
if (!n || void 0 === n.compensationQualifyMark || n.compensationQualifyMark) {
var a = i.cpm_data || {};
e && e({
video_type: " reward_video ",
task_id: " ",
force_type: " false ",
source: a.source || " ",
unitId: a.unitId || " ",
cpm: a.cpm || 0
});
} else t && t(n);
}, function(e) {
cc.warn("[arrowTaskPopupView] task reward video failed: ", e && e.message || e);
t && t(e);
}, this.i18n(" key_tip_reward_video_play_fail ", null, " Rewarded video failed to play, please try again ")) : e && e({
video_type: " reward_video ",
task_id: " ",
force_type: " false "
});
},
requestTaskReward: function(e, t, i, n) {
var a = this, o = {
businessType: " task ",
taskType: t || " ",
taskId: e || " "
}, r = function(e, t) {
if (e) {
try {
BusinessAnalyticsService.reportData(" task_claim ", {
task_id: o.taskId || " ",
task_type: o.taskType || " ",
is_double: i ? 1 : 0
});
} catch (e) {}
a.applyTaskRewardResult(t || {});
n && n(!0);
} else {
cc.warn("[arrowTaskPopupView] claim task reward failed: ", " taskId = ", o.taskId, " taskType = ", o.taskType, " isDouble = ", !!i);
a.showToast(a.i18n(" key_result_tip_claim_error ", null, " Claim failed.Please try again later "));
n && n(!1);
}
};
if (i) {
o.fallbackOnAdFail = !1;
ArrowRewardService.claimDouble(o, r);
} else ArrowRewardService.claimNormal(o, r);
},
applyTaskRewardResult: function(e) {
if (e) {
this.node && this.node.isValid && this.refreshTabVisual();
var t = {};
void 0 !== e.cash_balance && (t.cash_balance = e.cash_balance);
void 0 !== e.bubble_balance && (t.bubble_balance = e.bubble_balance);
void 0 !== e.user_level && (t.user_level = e.user_level);
void 0 !== e.hint_prop_count && (t.hint_prop_count = e.hint_prop_count);
void 0 !== e.guideline_prop_count && (t.guideline_prop_count = e.guideline_prop_count);
void 0 !== e.task_point_num && (t.task_point_num = e.task_point_num);
void 0 !== e.ltv_task_point_num && (t.ltv_task_point_num = e.ltv_task_point_num);
void 0 !== e.sign_in && (t.sign_in = e.sign_in);
try {
GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, t);
} catch (e) {
cc.warn("[arrowTaskPopupView] emit userInfoUpdated failed: ", e);
}
}
},
refreshContentSize: function(e, t) {
if (this.scrollContent && this.scrollViewView) {
var i = e > 0 ? e * t + 24 * Math.max(0, e - 1) + 180 : this.scrollViewView.height;
this.scrollContent.height = Math.max(this.scrollViewView.height, i);
this.scrollContent.y = this.scrollViewView.height / 2;
}
},
showEmpty: function() {},
onClickClose: function() {
this.syncTaskRedDotToGameView();
UIMgr.getInstance().hide(this.node);
},
formatCurrency: function(e) {
return LanguageService.formatCurrency(e);
},
i18n: function(e, t, i) {
return LanguageService.t(e, t || [], i);
},
setLabelText: function(e, t) {
e && (e.string = t || " ");
},
showToast: function(t) {
try {
Tips.show(t);
} catch (e) {
cc.log("[arrowTaskPopupView] toast: ", t);
}
},
findNodeDeep: function(e, t) {
if (!e || !t) return null;
if (e.name === t) return e;
for (var i = 0; i < e.childrenCount; i++) {
var n = this.findNodeDeep(e.children[i], t);
if (n) return n;
}
return null;
},
findLabelDeep: function(e, t) {
var i = this.findNodeDeep(e, t);
return i && i.getComponent(cc.Label) || null;
}
});

export default ArrowTaskPopupView;
