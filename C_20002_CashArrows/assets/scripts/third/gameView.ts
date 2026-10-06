// @ts-nocheck
import AdManager from "./AdManager";
import Handler from "./Handler";
import PlayerDataStore from "./PlayerDataStore";
import LoadingHttpService from "./LoadingHttpService";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import AudioMgr from "./AudioMgr";
import ConfigDefine from "./ConfigDefine";
import ConfigMgr from "./ConfigMgr";
import FlyRewardAnimMgr from "./FlyRewardAnimMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import MultiPlatform from "./MultiPlatform";
import NetErrorPopupService from "./NetErrorPopupService";
import NewbieGuideFlow from "./NewbieGuideFlow";
import NodePoolMgr from "./NodePoolMgr";
import NumberUtils from "./NumberUtils";
import Random from "./Random";
import ResMgr from "./ResMgr";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import UserInfoService from "./UserInfoService";
import game from "./game";
import BarrageDataService from "./BarrageDataService";
import CountryAssetService from "./CountryAssetService";
import * as LanguageService from "./LanguageService";
import withMoodView from "./withMoodView";

const { __extends, __decorate } = cc;
const n = __extends;
const a = __decorate;
const { __awaiter, __generator } = cc;
var o = AudioMgr, r = ConfigMgr, s = GlobalEventMgr, l = (MultiPlatform, 
ResMgr), c = UIMgr, u = NumberUtils, d = Random, h = InterfaceMgr, p = ConfigDefine, _ = UserData, f = UIDefine, g = AdManager, m = BusinessAnalyticsService, y = BarrageDataService, v = LanguageService, b = CountryAssetService, w = NewbieGuideFlow, k = withMoodView, S = game, C = NodePoolMgr, T = PlayerDataStore, N = LoadingHttpService, I = Handler, A = FlyRewardAnimMgr, R = UserInfoService, P = NetErrorPopupService, E = cc._decorator, M = E.ccclass, L = E.property, D = E.menu, x = function(t) {
function i() {
var e = null !== t && t.apply(this, arguments) || this;
e.node_tishi = null;
e.node_checksize = null;
e.node_mask = null;
e.layer_top = null;
e.layer_mid = null;
e.layer_bottom = null;
e.img_life = null;
e.txt_levelnum = null;
e.txt_time = null;
e.txt_lastnum = null;
e.node_blue = null;
e.node_red = null;
e.node_yichu = null;
e.node_diaozhuan = null;
e.node_taskRedPoint = null;
e.node_rewardNum = null;
e.lbl_rewardNumText = null;
e.node_rewardNumIcon = null;
e.sp_rewardNumIcon = null;
e.slider = null;
e.sp_slderbg = null;
e.node_fuzhuad = null;
e.node_fuzhustate = null;
e.node_game = null;
e.showTime = !0;
e.forceDisableCountdown = !0;
e.num_life = 3;
e.num_total_snake = 0;
e.num_current_snake = 0;
e.data_levelinfo = null;
e.num_normalScale = 0;
e.bool_isStop = !0;
e.num_gametime = 0;
e.snake_errorID = [];
e.bool_cantouchAd = !0;
e.bool_hasFuzhuline = !1;
e.num_fuzhulineClearLimit = 10;
e.num_fuzhulineRemainClear = 0;
e.taskPointNum = 0;
e.ltvTaskPointNum = 0;
e.rewardNumShowDuration = 2;
e.rewardNumFlyDelay = 1.5;
e.rewardNumFadeInDuration = .3;
e.rewardNumFadeOutDuration = .35;
e._onUserInfoUpdatedHandler = null;
e._onArrowRewardClaimedHandler = null;
e._pendingTopBalanceAfterFly = null;
e._hasPendingTopBalanceAfterFly = !1;
e._rewardNumFlyAmount = 0;
e.bool_isRestart = !1;
e.num_rellyLevel = 0;
e._eliminateCounter = 0;
e._totalEliminated = 0;
e._mistakeCount = 0;
e._retryCount = 0;
e._hintUsedCount = 0;
e._reviveCount = 0;
e._levelStartTs = 0;
e._barragesPaused = !1;
e.dsj = 0;
e.node_hardsp = null;
e.node_topBalanceNav = null;
e.node_balanceContainer = null;
e.node_withdrawBtn = null;
e.node_bubbleContainer = null;
e.lbl_balanceText = null;
e.rich_bubbleText = null;
e.node_bigBarragePanel = null;
e.rich_bigBarrageText = null;
e.topBarrageRows = [];
e.topBarrageData = [];
e.topBarrageMinDuration = 8;
e.topBarrageMaxDuration = 11;
e.topBarrageStayDuration = 4;
e.topBarrageScrollDuration = .4;
e._topBarrageNextItem = null;
e._topBarrageNextIcon = null;
e._topBarrageNextLabel = null;
e._topBarrageCurItem = null;
e._topBarrageCurIcon = null;
e._topBarrageCurLabel = null;
e._topBarrageArrowFrames = [];
e._topBarrageArrowReqVersion = 0;
e.topBarrageGap = 12;
e.topBarrageFontSize = 21;
e.topBarrageLineHeight = 25;
e.topBarrageNormalColor = "#2A438A";
e.topBarrageHighlightColor = "#FF3C3C";
e.topMoneyArrowImageName = "money_arrow_icon";
e.topMoneyArrowReqVersion = 0;
e.bigTopBarrageShown = !1;
e.bigTopBarrageMinDelay = 15;
e.bigTopBarrageMaxDelay = 25;
e.bigTopBarrageStayDuration = 3;
e.bigTopBarrageSlideDuration = .35;
e.bigTopBarrageHiddenOffset = 220;
e.bigTopBarrageBaseY = 0;
e.data_topBalanceMock = null;
e.currentBigBarrageData = null;
e.i18nGroup = null;
e.i18nBubbleLabelComp = null;
e.topBubbleBaseFontSize = 20;
e.topBubbleBaseLineHeight = 24;
e.topBubbleMinFontSize = 16;
e.topBubbleMaxFontSize = 24;
e.topBubbleMaxLines = 2;
e.topBubbleMinScale = .9;
e.topBubbleFitPaddingRatio = .9;
e.topBubbleFitWidth = 308;
e.topBubbleFitHeight = 44;
e.designReviewResolution = "750x1334";
e.enableLegacyTopWidgetRuntimeOverride = !1;
e.enableTopBubbleAutoFit = !1;
e.enableTopBarrageDynamicLayout = !0;
e.enableBigTopBarrageSlideY = !0;
e.enableTopBottomFadeAnimation = !0;
e.enableRuntimeWidgetRealign = !0;
e.enableTopBindingFallbackAutoAssign = !1;
e.enableBottomRuntimeLayoutLock = !1;
e.bottomRuntimeLockY = -628;
e.enableTopRuntimeLayoutLock = !1;
e.topRuntimeLockY = 555.45;
e.lifeHeartNodes = null;
e.lifeHeartFullFrame = null;
e.lifeHeartEmptyFrame = null;
e._sfVb = null;
e._sfOff = null;
e.newbieGuideBannerPlaying = !1;
e.newbieGuidePendingLevelPassSettleClose = !1;
e.node_step3GuideTip = null;
e.lbl_step3GuideTip = null;
e.node_step7GuideBanner = null;
e.node_step7GuideBannerBg = null;
e.node_step7GuideBannerDim = null;
e.lbl_step7GuideTextBack = null;
e.lbl_step7GuideTextFront = null;
e.lbl_guideLevel1Tip = null;
e.lbl_guideLevel2Tip = null;
e.lbl_txtLevel = null;
return e;
}
n(i, t);
i.prototype.start = function() {
var e = this;
if (this.forceDisableCountdown) {
this.showTime = !1;
this.num_gametime = 0;
this.bool_countdownStarted = !1;
}
this.getNewbieGuideFlow().bootstrap();
this.preload();
this.ensureRuntimeNodeRefs();
this.setGuideOverlayActive("guide_1", !1);
this.setStep3GuideTipActive(!1);
this.setStep7GuideBannerActive(!1);
this.refreshGuideLevelTipsI18n();
this.initTaskEntryRedPoint();
this.initRewardNumDisplay();
this.initTopBalanceBubbleNav();
this._initFlyMoneyIconFrame();
this.initFuzhulineConfig();
this.initTishiBtnstate();
this.EventAdd();
this.num_rellyLevel = this.getRellyLevel();
this._resetLevelBehaviorStats();
c.default.getInstance().showWatingUI();
this.InitNodepool().then(function() {
if (e.isViewAlive()) {
var t = T.default.arrow_level;
console.log("[LevelVerify] start: 即将加载 level_" + e.num_rellyLevel + ".json | 显示第" + (t && t.arrow_level_id || "?") + "关 | level_index=" + (t && t.level_index || "未配置") + " | arrow_count(服务器)=" + (t && t.arrow_count || "?"));
r.default.getInstance().loadLevelData("level_" + e.num_rellyLevel, !1).then(function() {
if (e.isViewAlive()) {
e.data_levelinfo = r.default.getInstance().getLevelById(e.num_rellyLevel);
e._eliminateCounter = 0;
var t = e.data_levelinfo && e.data_levelinfo.Arrows ? e.data_levelinfo.Arrows.length : "加载失败";
console.log("[LevelVerify] start 加载完成: level_" + e.num_rellyLevel + ".json | 本地实际箭头数=" + t + " | 服务器下发 arrow_count=" + (T.default.arrow_level.arrow_count || "?") + (String(t) !== String(T.default.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配，请检查 level_index 是否正确" : " ✅ 箭头数匹配"));
console.log("[ArrowLevel] start: 关卡=" + e.num_rellyLevel + " big_reward_trigger=" + e._getBigRewardTriggerCount() + " tail_clearance=" + (T.default.arrow_level.tail_clearance || 5) + " arrow_count=" + T.default.arrow_level.arrow_count + " eliminate_reward=" + T.default.arrow_level.eliminate_reward + " life_count=" + T.default.arrow_level.life_count);
e.ShowGame();
e.fontAni();
}
});
}
});
};
i.prototype.applyBottomRuntimeLayoutLock = function() {};
i.prototype.applyTopRuntimeLayoutLock = function() {};
i.prototype.applyBigBarrageVisualClamp = function() {};
i.prototype.ensureLifeHeartNodes = function() {
if (this.lifeHeartNodes && 3 === this.lifeHeartNodes.length) return !0;
var e = this.findChildByNameDeep(this.node, "bg_life");
if (!e) return !1;
var t = e.getChildByNamheart_1 || e.getChildByNamimg_life, i = e.getChildByNamheart_2, n = e.getChildByNamheart_3;
if (!t || !i || !n) return !1;
this.lifeHeartNodes = [ t, i, n ];
var a = t.getComponent(cc.Sprite), o = n.getComponent(cc.Sprite);
this.lifeHeartFullFrame = a && a.spriteFrame || null;
this.lifeHeartEmptyFrame = o && o.spriteFrame || null;
return !0;
};
i.prototype.refreshLifeHearts = function() {
if (this.ensureLifeHeartNodes()) for (var e = 0; e < this.lifeHeartNodes.length; e++) {
var t = this.lifeHeartNodes[e];
if (t && t.isValid) {
var i = t.getComponent(cc.Sprite);
i && (e < this.num_life ? this.lifeHeartFullFrame && (i.spriteFrame = this.lifeHeartFullFrame) : this.lifeHeartEmptyFrame && (i.spriteFrame = this.lifeHeartEmptyFrame));
}
}
};
i.prototype.initTopBalanceBubbleNav = function() {
var e = this.node && this.node._prefab && this.node._prefab.asset;
console.log("[top_nav] runtime prefab", {
hasPrefabAsset: !!e,
uuid: e && e._uuid || "",
name: e && e.name || ""
});
this.hideLegacyTopWidgets();
if (this.bindTopBalanceNodesFromPrefab()) {
this.i18nGroup = this.node.getComponent("I18nGroup");
if (!this.i18nGroup) {
this.i18nGroup = this.node.addComponent("I18nGroup");
this.i18nGroup && (this.i18nGroup.refreshOnLanguageChanged = !0);
}
this.ensureTopBubbleI18nLabel();
this.initTopBalanceMockData();
this.refreshTopBalanceUI();
this.bindTopBalanceOpenEvent();
this.startTopBalanceMockUpdate();
this.initTopBarrage();
this.refreshTopMoneyArrowIcons();
this.loadTopBarrageArrowImages();
this.initBigTopBarrageTrigger();
} else console.warn("[top_nav] 绑定失败");
};
i.prototype._initFlyMoneyIconFrame = function() {
var e = this, t = b.getPathByImageNammoney_arrow_icon;
l.default.getInstance().loadRes(t, cc.SpriteFrame, this, "game").then(function(i) {
if (i) e._flyMoneyIconFrame = i; else {
var n = b.getPathByImageName("money_arrow_icon", "ID");
n && n !== t && l.default.getInstance().loadRes(n, cc.SpriteFrame, e, "game").then(function(t) {
t && (e._flyMoneyIconFrame = t);
});
}
});
};
i.prototype._getBalanceIconNode = function() {
if (!this.node_balanceContainer || !this.node_balanceContainer.isValid) return null;
var e = this.findChildByNameDeep(this.node_balanceContainer, "icon");
return e && e.isValid ? e : this.node_balanceContainer;
};
i.prototype.playFlyMoneyAnim = function(e, t, i) {
var n = this.node;
if (n && n.isValid && this._flyMoneyIconFrame) {
var a = this._getBalanceIconNode();
if (a) {
var o = A.getWorldPos(a);
if (o) {
var r = n.convertToNodeSpaceAR(o), s = t ? A.formatRewardText(t) : "";
A.playFlyAnim({
iconFrame: this._flyMoneyIconFrame,
startPos: cc.v2(0, 0),
endPos: r,
parentNode: n,
count: e || 5,
startScale: .15,
endScale: .5,
targetIconNode: a,
rewardText: s,
onAllArrived: i,
sfx: "audio/coin_collect",
sfxBundle: h.bundleName.game
});
} else i && i();
} else i && i();
} else i && i();
};
i.prototype.initFuzhulineConfig = function() {
var t = 10;
try {
var i = PlayerDataStore, n = Number(i && i.default && i.default.guideline_eliminate_num || 0);
if (n > 0) {
t = n;
console.log("[fuzhuline] clear limit from userinfo guideline_eliminate_num =", t);
} else {
var a = r.default.getInstance().getOne(p.ConstantConfig) || {}, o = Number(a.fuzhuline_clear_limit || a.fuzhuxian_clear_limit || a.help_line_clear_limit || a.help_line_limit || 0);
o > 0 && (t = Math.floor(o));
console.log("[fuzhuline] clear limit from ConstantConfig =", t);
}
} catch (e) {
console.warn("[fuzhuline] read config failed, use default", e);
}
this.num_fuzhulineClearLimit = Math.max(1, t);
console.log("[fuzhuline] final clear limit =", this.num_fuzhulineClearLimit);
};
i.prototype.findChildNodeByName = function(e, t) {
if (!e || !t) return null;
if (e.name === t) return e;
for (var i = e.children || [], n = 0; n < i.length; n++) {
var a = this.findChildNodeByName(i[n], t);
if (a) return a;
}
return null;
};
i.prototype.resolveGuideNodeByName = function(e) {
if (!this.node || !e) return null;
var t = [ e ];
"guide_level1" === e || "guide_level_1" === e || "guide_Level_1" === e ? t = [ "guide_level1", "guide_level_1", "guide_Level_1" ] : "guide_level2" !== e && "guide_level_2" !== e && "guide_Level_2" !== e || (t = [ "guide_level2", "guide_level_2", "guide_Level_2" ]);
for (var i = 0; i < t.length; i++) {
var n = this.findChildByNameDeep(this.node, t[i]);
if (n) return n;
}
return null;
};
i.prototype.resolveGuideTipLabel = function(e) {
var t = this.resolveGuideNodeByName(e);
if (!t) return null;
var i = t.getChildByName("文本2");
i || (i = this.findChildByNameDeep(t, "文本2"));
return i ? i.getComponent(cc.Label) : null;
};
i.prototype.ensureRuntimeNodeRefs = function() {
this.node_checksize && this.node_checksize.isValid || (this.node_checksize = cc.find("sizeCheck", this.node) || this.findChildNodeByName(this.node, "sizeCheck"));
this.node_mask && this.node_mask.isValid || (this.node_mask = cc.find("sizeCheck/mask", this.node) || this.findChildNodeByName(this.node, "mask"));
this.node_tishi && this.node_tishi.isValid || (this.node_tishi = cc.find("bottom/btn_tip", this.node) || this.findChildNodeByName(this.node, "btn_tip"));
this.node_taskRedPoint && this.node_taskRedPoint.isValid || (this.node_taskRedPoint = cc.find("top/task_red", this.node) || this.findChildNodeByName(this.node, "task_red"));
this.node_step3GuideTip && this.node_step3GuideTip.isValid || (this.node_step3GuideTip = this.findChildByNameDeep(this.node, "guide_step3_tip"));
!cc.isValid(this.lbl_step3GuideTip) && this.node_step3GuideTip && this.node_step3GuideTip.isValid && (this.lbl_step3GuideTip = this.node_step3GuideTip.getComponent(cc.Label));
this.node_step7GuideBanner && this.node_step7GuideBanner.isValid || (this.node_step7GuideBanner = this.findChildByNameDeep(this.node, "guide_step7_banner"));
this.node_step7GuideBannerBg && this.node_step7GuideBannerBg.isValid || (this.node_step7GuideBannerBg = this.findChildByNameDeep(this.node, "guide_step7_bg"));
this.node_step7GuideBannerDim && this.node_step7GuideBannerDim.isValid || (this.node_step7GuideBannerDim = this.findChildByNameDeep(this.node, "guide_step7_dim"));
if (!cc.isValid(this.lbl_step7GuideTextBack)) {
var e = this.findChildByNameDeep(this.node, "guide_step7_text_back");
this.lbl_step7GuideTextBack = e ? e.getComponent(cc.Label) : null;
}
if (!cc.isValid(this.lbl_step7GuideTextFront)) {
var t = this.findChildByNameDeep(this.node, "guide_step7_text_front");
this.lbl_step7GuideTextFront = t ? t.getComponent(cc.Label) : null;
}
if (!cc.isValid(this.lbl_txtLevel)) {
var i = this.findChildByNameDeep(this.node, "txt_level");
this.lbl_txtLevel = i ? i.getComponent(cc.Label) : null;
}
if (!cc.isValid(this.lbl_withdrawText)) {
var n = this.findChildByNameDeep(this.node, "withdraw_text");
this.lbl_withdrawText = n ? n.getComponent(cc.Label) : null;
}
cc.isValid(this.lbl_guideLevel1Tip) || (this.lbl_guideLevel1Tip = this.resolveGuideTipLabel("guide_level1"));
cc.isValid(this.lbl_guideLevel2Tip) || (this.lbl_guideLevel2Tip = this.resolveGuideTipLabel("guide_level2"));
if (!this.txt_lastnum) {
var a = this.findChildNodeByName(this.node, "txt_lastnum");
a && (this.txt_lastnum = a.getComponent(cc.Label));
}
this.node_rewardNum && this.node_rewardNum.isValid || (this.node_rewardNum = cc.find("reward_num", this.node) || this.findChildNodeByName(this.node, "reward_num"));
if (!cc.isValid(this.lbl_rewardNumText) && this.node_rewardNum && this.node_rewardNum.isValid) {
var o = cc.find("lbl_text", this.node_rewardNum) || this.findChildNodeByName(this.node_rewardNum, "lbl_text");
this.lbl_rewardNumText = o ? o.getComponent(cc.Label) : null;
}
this.node_rewardNumIcon && this.node_rewardNumIcon.isValid || !this.node_rewardNum || !this.node_rewardNum.isValid || (this.node_rewardNumIcon = cc.find("icon", this.node_rewardNum) || this.findChildNodeByName(this.node_rewardNum, "icon"));
!cc.isValid(this.sp_rewardNumIcon) && this.node_rewardNumIcon && this.node_rewardNumIcon.isValid && (this.sp_rewardNumIcon = this.node_rewardNumIcon.getComponent(cc.Sprite));
};
i.prototype.setGuideNodeActive = function(e, t) {
this.ensureRuntimeNodeRefs();
if (this.node_checksize) {
var i = this.node_checksize.getChildByName(e);
i || "guide_level1" !== e && "guide_level_1" !== e && "guide_Level_1" !== e || (i = this.node_checksize.getChildByNamguide_level1 || this.node_checksize.getChildByNamguide_level_1 || this.node_checksize.getChildByNamguide_Level_1);
i || "guide_level2" !== e && "guide_level_2" !== e && "guide_Level_2" !== e || (i = this.node_checksize.getChildByNamguide_level2 || this.node_checksize.getChildByNamguide_level_2 || this.node_checksize.getChildByNamguide_Level_2);
i || (i = this.resolveGuideNodeByName(e));
i && (i.active = t);
}
};
i.prototype.setGuideOverlayActive = function(e, t) {
var i = this.findChildByNameDeep(this.node, e);
i && (i.active = !!t);
};
i.prototype.isViewAlive = function() {
return !!(this && cc.isValid(this) && this.node && cc.isValid(this.node));
};
i.prototype.bindTopBalanceOpenEvent = function() {
if (this.node_balanceContainer) {
this.node_balanceContainer.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
this.node_balanceContainer.on(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
if (this.node_withdrawBtn) {
this.node_withdrawBtn.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
this.node_withdrawBtn.on(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
}
}
};
i.prototype.openWithMoodView = function() {
var e = this.getNewbieGuideFlow();
if (e && this.advanceNewbieGuideStep(e.STEP_TOP_BALANCE)) {
this.setGuideOverlayActive("guide_1", !1);
this.setStep3GuideTipActive(!1);
}
this.bool_isStop = !0;
var t = this;
c.default.getInstance().show(f.default.withMoodView).then(function(e) {
if (t.isViewAlive() && e && e.isValid) {
var i = k.default || k, n = e.getComponent(i);
n || (n = e.addComponent(i));
n && n.setEntryData && n.setEntryData({
cash_balance: t.data_topBalanceMock && t.data_topBalanceMock.cash_balance || 0,
user_level: t.data_topBalanceMock && t.data_topBalanceMock.user_level || 1
});
}
});
};
i.prototype.hideLegacyTopWidgets = function() {
var e = this.layer_top || this.findChildByNameDeep(this.node, "top");
if (e) {
var t = e.getChildByNamtime;
t && (t.active = this.isCountdownEnabled());
if (this.enableLegacyTopWidgetRuntimeOverride) {
var i = e.getChildByNambtn_cebian;
i && (i.active = !1);
var n = e.getChildByNambtn_adddesktop;
n && (n.active = !1);
}
}
};
i.prototype.isCountdownEnabled = function() {
return !this.forceDisableCountdown && !!this.showTime;
};
i.prototype.applyCountdownUIState = function() {
var e = this.isCountdownEnabled();
this.txt_time && this.txt_time.node && (this.txt_time.node.active = e);
var t = this.layer_top || this.findChildByNameDeep(this.node, "top");
if (t) {
var i = t.getChildByNamtime || this.findChildByNameDeep(t, "time");
i && (i.active = e);
}
};
i.prototype.bindTopBalanceNodesFromPrefab = function() {
var e = [], t = [], i = [], n = !!this.enableTopBindingFallbackAutoAssign, a = this.layer_top || this.findChildByNameDeep(this.node, "top"), o = this.findChildByNameLike(this.node, "top_balance"), r = this.findChildByNameLike(this.node, "nav_left"), s = this.findChildByNameLike(this.node, "nav_right"), l = this.findChildByNameLike(this.node, "money_text") || this.findChildByNameLike(this.node, "txt_balance") || this.findChildByNameLike(this.node, "money"), c = this.findChildByNameLike(this.node, "pop_text") || this.findChildByNameLike(this.node, "txt_bubble") || this.findChildByNameLike(this.node, "pop"), u = this.findChildByNameDeep(this.node, "big_barrage_panel"), d = this.findChildByNameDeep(this.node, "big_barrage_label");
if (!this.node_topBalanceNav && o) if (n) {
this.node_topBalanceNav = o;
t.push("node_topBalanceNav<=top_balance_nav");
} else i.push("node_topBalanceNav<=top_balance_nav");
if (!this.node_balanceContainer && r) if (n) {
this.node_balanceContainer = r;
t.push("node_balanceContainer<=nav_left_bg");
} else i.push("node_balanceContainer<=nav_left_bg");
if (!this.node_withdrawBtn) {
var h = this.findChildByNameDeep(this.node, "withdraw_btn");
if (h) {
this.node_withdrawBtn = h;
t.push("node_withdrawBtn<=withdraw_btn");
}
}
if (!this.node_bubbleContainer && s) if (n) {
this.node_bubbleContainer = s;
t.push("node_bubbleContainer<=nav_right_bg");
} else i.push("node_bubbleContainer<=nav_right_bg");
if (!this.lbl_balanceText && l) if (n) {
this.lbl_balanceText = l.getComponent(cc.Label);
this.lbl_balanceText && t.push("lbl_balanceText<=money_text");
} else i.push("lbl_balanceText<=money_text");
if (!this.rich_bubbleText && c) if (n) {
this.rich_bubbleText = c.getComponent(cc.RichText);
this.rich_bubbleText && t.push("rich_bubbleText<=pop_text");
} else i.push("rich_bubbleText<=pop_text");
if (!this.node_bigBarragePanel && u) if (n) {
this.node_bigBarragePanel = u;
t.push("node_bigBarragePanel<=big_barrage_panel");
} else i.push("node_bigBarragePanel<=big_barrage_panel");
if (!this.rich_bigBarrageText && d) if (n) {
this.rich_bigBarrageText = d.getComponent(cc.RichText);
this.rich_bigBarrageText && t.push("rich_bigBarrageText<=big_barrage_label");
} else i.push("rich_bigBarrageText<=big_barrage_label");
var p = a ? a.children.map(function(e) {
return e.name;
}).join(",") : "";
console.log("[top_nav] inspector refs", {
layerTopRef: !!this.layer_top,
topNavRef: !!this.node_topBalanceNav,
leftRef: !!this.node_balanceContainer,
rightRef: !!this.node_bubbleContainer,
moneyRef: !!this.lbl_balanceText,
popRef: !!this.rich_bubbleText
});
console.log("[top_nav] top node check", {
topFound: !!a,
topChildren: p,
topNavByChildName: !(!a || !a.getChildByNamtop_balance_nav)
});
this.node_topBalanceNav || e.push("node_topBalanceNav(cc.Node) -> top_balance_nav");
this.node_balanceContainer || e.push("node_balanceContainer(cc.Node) -> nav_left_bg");
this.node_bubbleContainer || e.push("node_bubbleContainer(cc.Node) -> nav_right_bg");
this.lbl_balanceText || e.push("lbl_balanceText(cc.Label) -> money_text");
this.rich_bubbleText || e.push("rich_bubbleText(cc.RichText) -> pop_text");
this.node_bigBarragePanel || e.push("node_bigBarragePanel(cc.Node) -> big_barrage_panel");
this.rich_bigBarrageText || e.push("rich_bigBarrageText(cc.RichText) -> big_barrage_label");
e.length > 0 && console.warn("[top_nav] 缺少预制体绑定:", e.join(" | "));
console.log("[top_nav] locate", {
topNode: !!this.layer_top,
navRoot: !!this.node_topBalanceNav,
leftNode: !!this.node_balanceContainer,
rightNode: !!this.node_bubbleContainer,
moneyNode: !!this.lbl_balanceText,
popNode: !!this.rich_bubbleText,
moneyLabel: !!this.lbl_balanceText,
popRich: !!this.rich_bubbleText,
bigPanel: !!this.node_bigBarragePanel,
bigText: !!this.rich_bigBarrageText,
fallbackCount: t.length,
fallbackMode: n ? "auto-assign" : "warn-only"
});
t.length > 0 && console.warn("[top_nav] 使用 fallback 自动绑定:", t.join(" | "));
i.length > 0 && console.warn("[top_nav] fallback仅告警(未自动赋值):", i.join(" | "));
return 0 === e.length;
};
i.prototype.initTopBarrage = function() {
this.topBarrageRows = this.collectTopBarrageRows();
if (this.topBarrageRows && !(this.topBarrageRows.length <= 0)) {
this._initVerticalBarrage();
this.loadTopBarrageData();
}
};
i.prototype._initVerticalBarrage = function() {
var e = this.topBarrageRows[0];
if (e) {
this._topBarrageCurItem = e.item;
this._topBarrageCurIcon = e.icon;
this._topBarrageCurLabel = e.label;
e.item.y = 0;
var t = e.nextItem && e.nextItem.isValid ? e.nextItem : this.findChildByNameDeep(e.track, "barrage_item_next");
if (t) {
this._topBarrageNextItem = t;
this._topBarrageNextItem.y = -(e.track.height || t.height || 54);
this._topBarrageNextIcon = e.nextIcon && e.nextIcon.isValid ? e.nextIcon : t.children[0] || null;
var i = e.nextLabelNode && e.nextLabelNode.isValid ? e.nextLabelNode : t.children[1] || null;
this._topBarrageNextLabel = e.nextLabel && e.nextLabel.node && e.nextLabel.node.isValid ? e.nextLabel : i ? this.ensureTopBarrageRichText(i) : null;
} else {
var n = cc.instantiate(e.item);
n.name = "barrage_item_next";
n.parent = e.track;
n.y = -e.track.height;
this._topBarrageNextItem = n;
this._topBarrageNextIcon = n.children[0] || null;
var a = n.children[1] || null;
this._topBarrageNextLabel = a ? this.ensureTopBarrageRichText(a) : null;
}
}
};
i.prototype.initBigTopBarrageTrigger = function() {
if (this.node_bigBarragePanel && !this.bigTopBarrageShown) {
this.bigTopBarrageBaseY = this.node_bigBarragePanel.y;
this.node_bigBarragePanel.y = this.enableBigTopBarrageSlideY ? this.getBigTopBarrageHiddenY() : this.bigTopBarrageBaseY;
this.node_bigBarragePanel.active = !1;
this.rich_bigBarrageText && this.rich_bigBarrageText.node && (this.rich_bigBarrageText.node.active = !0);
var e = Math.max(1, this.bigTopBarrageMinDelay || 15), t = e + (Math.max(e, this.bigTopBarrageMaxDelay || 25) - e) * Math.random();
this.scheduleOnce(this.tryPlayBigTopBarrage, t);
}
};
i.prototype.tryPlayBigTopBarrage = function() {
if (!this.bigTopBarrageShown && this.node_bigBarragePanel && this.rich_bigBarrageText) {
var e = y.takeOne();
e && this.playBigTopBarrage(e);
}
};
i.prototype.pickRandomTopBarrageItem = function(e) {
return !e || e.length <= 0 ? null : e[Math.floor(Math.random() * e.length)] || e[0];
};
i.prototype.playBigTopBarrage = function(e) {
if (this.node_bigBarragePanel && this.rich_bigBarrageText && e) {
this.currentBigBarrageData = e;
this.bigTopBarrageShown = !0;
this.node_bigBarragePanel.stopAllActions();
this.node_bigBarragePanel.active = !0;
this.node_bigBarragePanel.opacity = 0;
var t = this.bigTopBarrageBaseY || this.node_bigBarragePanel.y || 0, i = this.enableBigTopBarrageSlideY ? this.getBigTopBarrageHiddenY() : t;
this.node_bigBarragePanel.y = i;
this.rich_bigBarrageText.node.active = !0;
this.rich_bigBarrageText.string = this.getBigTopBarrageRichText(e);
this.applyRandomArrowIcon(this.findChildByNameDeep(this.node_bigBarragePanel, "icon_barrage"));
this.refreshTopBarrageLabelLayout(this.rich_bigBarrageText);
var n = cc.spawn(cc.moveTo(this.bigTopBarrageSlideDuration, this.node_bigBarragePanel.x, t).easing(cc.easeSineOut()), cc.fadeTo(this.bigTopBarrageSlideDuration, 255)), a = cc.delayTime(this.bigTopBarrageStayDuration || 3), o = cc.spawn(cc.moveTo(this.bigTopBarrageSlideDuration, this.node_bigBarragePanel.x, i).easing(cc.easeSineIn()), cc.fadeTo(this.bigTopBarrageSlideDuration, 0)), r = cc.callFunc(function() {
this.node_bigBarragePanel.active = !1;
this.node_bigBarragePanel.y = i;
}, this);
this.node_bigBarragePanel.runAction(cc.sequence(n, a, o, r));
}
};
i.prototype.getBigTopBarrageHiddenY = function() {
if (!this.node_bigBarragePanel) return this.bigTopBarrageBaseY || 0;
var e = this.node_bigBarragePanel.height || 0, t = this.bigTopBarrageHiddenOffset || 220;
return (this.bigTopBarrageBaseY || 0) + e + t;
};
i.prototype.collectTopBarrageRows = function() {
for (var e = [], t = 0; t < 1; t++) {
var i = this.findChildByNameDeep(this.node, "barrage_track_" + t), n = this.findChildByNameDeep(this.node, "barrage_item_" + t), a = this.findChildByNameDeep(this.node, "icon_barrage_" + t), o = this.findChildByNameDeep(this.node, "lbl_barrage_" + t), r = i ? this.findChildByNameDeep(i, "barrage_item_next") : null, s = r ? this.findChildByNameDeep(r, "icon_barrage_next") : null;
s || (s = r && r.children[0] || null);
var l = r ? this.findChildByNameDeep(r, "lbl_barrage_next") : null;
l || (l = r && r.children[1] || null);
if (i && !n && (a || o)) {
console.warn("[top_barrage] prefab missing barrage_item_" + t + ", fallback create runtime node");
(n = new cc.Node("barrage_item_" + t)).parent = i;
n.setContentSize(i.getContentSize());
n.setPosition(0, 0);
a && (a.parent = n);
o && (o.parent = n);
}
var c = this.ensureTopBarrageRichText(o), u = this.ensureTopBarrageRichText(l);
i && (!r || !s || !u) && console.warn("[top_barrage] prefab missing next item structure, fallback clone at runtime");
i && n && a && c && e.push({
rowIndex: t,
track: i,
item: n,
icon: a,
label: c,
nextItem: r,
nextIcon: s,
nextLabelNode: l,
nextLabel: u,
playIndex: t,
currentPlainText: ""
});
}
return e;
};
i.prototype.collectTopMoneyArrowIconNodes = function() {
var e = [], t = function(t) {
!t || !t.isValid || e.indexOf(t) >= 0 || e.push(t);
};
this.node_balanceContainer && this.node_balanceContainer.isValid && t(this.findChildByNameDeep(this.node_balanceContainer, "icon"));
this.node_rewardNumIcon && this.node_rewardNumIcon.isValid && t(this.node_rewardNumIcon);
t(this.findChildByNameDeep(this.node, "icon_barrage"));
for (var i = 0; i < this.topBarrageRows.length; i++) {
var n = this.topBarrageRows[i];
n && 0 === n.rowIndex || n && n.icon && t(n.icon);
}
return e;
};
i.prototype.refreshTopMoneyArrowIcons = function() {
var e = this, t = this.collectTopMoneyArrowIconNodes();
if (t && !(t.length <= 0)) {
var i = this.topMoneyArrowImageName || "money_arrow_icon", n = ++this.topMoneyArrowReqVersion, a = b.getPathByImageName(i), o = b.getPathByImageName(i, "ID"), r = function(i) {
if (n === e.topMoneyArrowReqVersion && i) for (var a = 0; a < t.length; a++) {
var o = t[a];
if (o && o.isValid) {
var r = o.getComponent(cc.Sprite);
r && (r.spriteFrame = i);
}
}
};
l.default.getInstance().loadRes(a, cc.SpriteFrame, this, "game").then(function(t) {
t ? r(t) : o && o !== a ? l.default.getInstance().loadRes(o, cc.SpriteFrame, e, "game").then(function(e) {
e ? r(e) : cc.warn("[gameView] load money_arrow_icon fallback failed:", o);
}) : cc.warn("[gameView] load money_arrow_icon failed:", a);
});
}
};
i.prototype.ensureTopBarrageRichText = function(e) {
if (!e) return null;
var t = e.getComponent(cc.Label), i = e.getComponent(cc.RichText);
t && (t.enabled = !1);
if (i) {
i.lineHeight || (i.lineHeight = this.topBarrageLineHeight);
i.fontSize || (i.fontSize = this.topBarrageFontSize);
} else {
(i = e.addComponent(cc.RichText)).maxWidth = 0;
i.lineHeight = this.topBarrageLineHeight;
i.fontSize = this.topBarrageFontSize;
}
i.string || (i.string = "");
return i;
};
i.prototype.loadTopBarrageData = function() {
y.ensureStarted();
this.startTopBarrageRows();
};
i.prototype.startTopBarrageRows = function() {
if (!this._barragesPaused) for (var e = 0; e < this.topBarrageRows.length; e++) this.playTopBarrageByRow(e);
};
i.prototype.stopTopBarrageRows = function() {
for (var e = 0; e < this.topBarrageRows.length; e++) {
var t = this.topBarrageRows[e];
t && t.item && t.item.stopAllActions();
if (t && t._retryTimer) {
clearTimeout(t._retryTimer);
t._retryTimer = null;
}
}
this._topBarrageCurItem && this._topBarrageCurItem.stopAllActions();
this._topBarrageNextItem && this._topBarrageNextItem.stopAllActions();
};
i.prototype.playTopBarrageByRow = function(e) {
if (!this._barragesPaused) {
var t = this, i = this.topBarrageRows[e];
if (i && i.track) {
var n = this._topBarrageCurItem, a = this._topBarrageCurLabel;
if (n && a) {
n.stopAllActions();
this._topBarrageNextItem && this._topBarrageNextItem.stopAllActions();
if (i._retryTimer) {
clearTimeout(i._retryTimer);
i._retryTimer = null;
}
var o = y.takeOne();
if (o) {
i.currentPlainText = this.getTopBarragePlainText(o);
a.string = this.getTopBarrageRichText(o);
this.enableTopBarrageDynamicLayout && this.refreshTopBarrageLabelLayout(a);
this._alignBarrageIconToLabel(this._topBarrageCurIcon, a, i.currentPlainText);
n.x = 0;
n.y = 0;
this._scheduleNextBarrageScroll(e);
} else {
i.currentPlainText = this.i18n("key_common_barrage_empty");
a.string = "<color=" + this.topBarrageNormalColor + ">" + this.i18n("key_common_barrage_empty") + "</color>";
this.enableTopBarrageDynamicLayout && this.refreshTopBarrageLabelLayout(a);
this._alignBarrageIconToLabel(this._topBarrageCurIcon, a, i.currentPlainText);
n.x = 0;
n.y = 0;
i._retryTimer = setTimeout(function() {
i._retryTimer = null;
t.playTopBarrageByRow(e);
}, 2e3);
}
}
}
}
};
i.prototype._scheduleNextBarrageScroll = function(e) {
if (!this._barragesPaused) {
var t = this;
if (this.topBarrageRows[e]) {
var i = this._topBarrageCurItem;
if (i) {
var n = this.topBarrageStayDuration || 4, a = cc.delayTime(n), o = cc.callFunc(function() {
t._doBarrageScrollUp(e);
});
i.runAction(cc.sequence(a, o));
}
}
}
};
i.prototype._doBarrageScrollUp = function(e) {
if (!this._barragesPaused) {
var t = this, i = this.topBarrageRows[e];
if (i && i.track) {
var n = this._topBarrageCurItem, a = this._topBarrageNextItem, o = this._topBarrageNextLabel;
if (n && a && o) {
var r = y.takeOne(), s = this.i18n("key_common_barrage_empty"), l = r ? this.getTopBarragePlainText(r) : s;
o.string = r ? this.getTopBarrageRichText(r) : "<color=" + this.topBarrageNormalColor + ">" + s + "</color>";
this.applyRandomArrowIcon(this._topBarrageNextIcon);
this.enableTopBarrageDynamicLayout && this.refreshTopBarrageLabelLayout(o);
this._alignBarrageIconToLabel(this._topBarrageNextIcon, o, l);
var c = i.track.height || 34, u = this.topBarrageScrollDuration || .4;
a.x = 0;
a.y = -c;
n.stopAllActions();
a.stopAllActions();
var d = cc.moveBy(u, 0, c).easing(cc.easeSineInOut()), h = cc.moveBy(u, 0, c).easing(cc.easeSineInOut()), p = cc.callFunc(function() {
var i = t._topBarrageCurItem, n = t._topBarrageCurIcon, a = t._topBarrageCurLabel;
t._topBarrageCurItem = t._topBarrageNextItem;
t._topBarrageCurIcon = t._topBarrageNextIcon;
t._topBarrageCurLabel = t._topBarrageNextLabel;
t._topBarrageNextItem = i;
t._topBarrageNextIcon = n;
t._topBarrageNextLabel = a;
t._topBarrageCurItem.y = 0;
t._topBarrageNextItem.y = -c;
t._scheduleNextBarrageScroll(e);
});
a.runAction(h);
n.runAction(cc.sequence(d, p));
} else this.playTopBarrageByRow(e);
}
}
};
i.prototype.getTopBarrageDuration = function() {
var e = this.topBarrageMinDuration || 8, t = this.topBarrageMaxDuration || 11;
if (t < e) {
var i = e;
e = t;
t = i;
}
return e + (t - e) * Math.random();
};
i.prototype.layoutTopBarrageRow = function(e) {
if (e && e.item && e.icon && e.label) {
var t = e.icon.width || 0, i = this.getTopBarrageLabelWidth(e), n = t + this.topBarrageGap + i;
e.item.width = n;
e.icon.x = -n / 2 + t / 2;
e.label.node.x = e.icon.x + t / 2 + this.topBarrageGap + i / 2;
}
};
i.prototype._alignBarrageIconToLabel = function(e, t, i) {
if (e && e.isValid && t && t.node && t.node.isValid) {
var n = e.width || 0, a = t.node, o = a.width || 0;
o <= 0 && i && (o = Math.ceil(.58 * (this.topBarrageFontSize || 22) * String(i).length));
if (!(o <= 0)) {
var r = this.topBarrageGap || 0;
e.x = a.x - o / 2 - r - n / 2;
}
}
};
i.prototype.getTopBarragePlainText = function(e) {
if (!e) return "";
var t = e.name || this.i18n("key_common_user_default"), i = void 0 !== e.amount ? this.getBarrageCurrencyText("RP", e.amount) : "";
return !i && e.text ? e.text : this.i18n("key_game_top_barrage_plain", [ t, i ]);
};
i.prototype.getTopBarrageRichText = function(e) {
var t = this.topBarrageNormalColor, i = this.topBarrageHighlightColor;
if (!e) return "<color=" + t + ">" + this.i18n("key_common_barrage_empty") + "</color>";
var n = e.name || this.i18n("key_common_user_default"), a = void 0 !== e.amount ? this.getBarrageCurrencyText("RP", e.amount) : "";
if (!a && e.text) return "<color=" + t + ">" + e.text + "</color>";
var o = this.i18n("key_game_top_barrage_plain", [ "", "" ]).split("");
if (o.length < 2) return "<color=" + t + ">" + this.i18n("key_game_top_barrage_plain", [ n, a ]) + "</color>";
var r = o[1].split(""), s = "<color=" + t + ">" + o[0] + n + r[0] + "</color><color=" + i + ">" + a + "</color>";
r[1] && (s += "<color=" + t + ">" + r[1] + "</color>");
return s;
};
i.prototype.getBigTopBarrageRichText = function(e) {
if (!e) return "<color=#FFFFFF>" + this.i18n("key_common_barrage_empty") + "</color>";
var t = e.name || this.i18n("key_common_user_default"), i = void 0 !== e.amount ? this.getBarrageCurrencyText("RP", e.amount) : "";
if (!i && e.text) return "<color=#FFFFFF>" + e.text + "</color>";
var n = this.i18n("key_barrage_success_plain", [ "", "" ]).split("");
if (n.length < 2) return "<color=#FFFFFF>" + this.i18n("key_barrage_success_plain", [ t, i ]) + "</color>";
var a = n[1].split(""), o = "<color=#FFFFFF>" + n[0] + t + a[0] + "</color><color=#FF0000>" + i + "</color>";
a[1] && (o += "<color=#FFFFFF>" + a[1] + "</color>");
return o;
};
i.prototype.loadTopBarrageArrowImages = function() {
var e = this, t = ++this._topBarrageArrowReqVersion, i = [ "with_arrow_1", "with_arrow_2", "with_arrow_3", "with_arrow_4" ], n = i.map(function(e) {
return b.getPathByImageName(e);
}), a = new Array(i.length), o = i.length;
function r() {
if (!(--o > 0) && t === e._topBarrageArrowReqVersion) {
e._topBarrageArrowFrames = a.filter(function(e) {
return !!e;
});
if (e._topBarrageArrowFrames.length) {
e.applyRandomArrowIcon(e._topBarrageCurIcon);
e.applyRandomArrowIcon(e._topBarrageNextIcon);
e.applyRandomArrowIcon(e.node_bigBarragePanel && e.findChildByNameDeep(e.node_bigBarragePanel, "icon_barrage"));
} else cc.warn("[gameView] with_arrow images all failed to load");
}
}
n.forEach(function(t, i) {
l.default.getInstance().loadRes(t, cc.SpriteFrame, e, "game").then(function(e) {
a[i] = e || null;
r();
});
});
};
i.prototype.applyRandomArrowIcon = function(e) {
var t = this._topBarrageArrowFrames;
if (t && t.length && e && e.isValid) {
var i = e.getComponent(cc.Sprite);
i && (i.spriteFrame = t[Math.floor(Math.random() * t.length)]);
}
};
i.prototype.refreshTopBarrageLabelLayout = function(e) {
if (this.enableTopBarrageDynamicLayout && e) {
e._forceUpdateRenderData && e._forceUpdateRenderData(!0);
e.node && e.node.getContentSize && e.node.setContentSize(e.node.getContentSize());
}
};
i.prototype.getTopBarrageLabelWidth = function(e) {
if (!e || !e.label || !e.label.node) return 0;
var t = e.label.node.width || 0;
if (t > 0) return t;
if (e.currentPlainText) {
var i = Math.ceil(.58 * this.topBarrageFontSize * e.currentPlainText.length);
if (i > 0) return i;
}
var n = (e.track && e.track.width || 0) - (e.icon && e.icon.width || 0) - this.topBarrageGap - 8;
return n > 80 ? n : 80;
};
i.prototype.findChildByNameDeep = function(e, t) {
if (!e) return null;
if (e.name == t) return e;
for (var i = 0; i < e.childrenCount; i++) {
var n = this.findChildByNameDeep(e.children[i], t);
if (n) return n;
}
return null;
};
i.prototype.findChildByNameLike = function(e, t) {
if (!e || !t) return null;
var i = t.toLowerCase();
if (e.name && e.name.toLowerCase().indexOf(i) >= 0) return e;
for (var n = 0; n < e.childrenCount; n++) {
var a = this.findChildByNameLike(e.children[n], t);
if (a) return a;
}
return null;
};
i.prototype.normalizeTaskPointNum = function(e) {
var t = Number(e);
return !isFinite(t) || t < 0 ? 0 : Math.floor(t);
};
i.prototype.updateTaskPointNum = function(e, t) {
this.taskPointNum = this.normalizeTaskPointNum(e);
this.ltvTaskPointNum = this.normalizeTaskPointNum(t);
T.default.task_point_num = this.taskPointNum;
T.default.ltv_task_point_num = this.ltvTaskPointNum;
this.refreshTaskEntryRedPoint();
};
i.prototype.refreshTaskEntryRedPoint = function() {
this.ensureRuntimeNodeRefs();
this.node_taskRedPoint && this.node_taskRedPoint.isValid && (this.node_taskRedPoint.active = this.taskPointNum > 0 || this.ltvTaskPointNum > 0);
};
i.prototype.initTaskEntryRedPoint = function() {
this.taskPointNum = this.normalizeTaskPointNum(T.default.task_point_num);
this.ltvTaskPointNum = this.normalizeTaskPointNum(T.default.ltv_task_point_num);
this.refreshTaskEntryRedPoint();
};
i.prototype.initRewardNumDisplay = function() {
this.ensureRuntimeNodeRefs();
console.log("[reward_num] init node=" + !!this.node_rewardNum + " label=" + !!this.lbl_rewardNumText);
this.hideRewardNumDisplay();
};
i.prototype.onArrowRewardClaimed = function(e) {
try {
console.log("[reward_num] onArrowRewardClaimed data=" + JSON.stringify(e || {}) + " hasParse=" + (this && typeof this.parseRewardNumValue));
var t = this.parseRewardNumValue(e && e.reward_amount);
console.log("[reward_num] onArrowRewardClaimed parsed=" + t);
if (null === t || t <= 0) {
console.warn("[reward_num] onArrowRewardClaimed: reward_amount 无效或<=0 skip, parsed=" + t);
return;
}
this.showRewardNumDisplay(t);
} catch (e) {
console.error("[reward_num] onArrowRewardClaimed exception", e);
}
};
i.prototype.parseRewardNumValue = function(e) {
if (null == e) return null;
var t = e;
if ("string" == typeof t && !(t = t.replace(/,/g, "").trim()).length) return null;
var i = Number(t);
return isFinite(i) ? Math.max(0, Math.floor(i)) : null;
};
i.prototype.canDelayTopBalanceUpdateForFly = function(e) {
if (!(e > 0)) return !1;
this.ensureRuntimeNodeRefs();
return !!(this.node && this.node.isValid && this.node_rewardNum && this.node_rewardNum.isValid && this.node_rewardNumIcon && this.node_rewardNumIcon.isValid && this._getBalanceIconNode() && (this.sp_rewardNumIcon && this.sp_rewardNumIcon.spriteFrame || this._flyMoneyIconFrame));
};
i.prototype.queueTopBalanceAfterFly = function(e) {
if (!this.data_topBalanceMock) return !1;
var t = Number(e);
if (!isFinite(t)) return !1;
this._pendingTopBalanceAfterFly = Math.max(0, t);
this._hasPendingTopBalanceAfterFly = !0;
this.unschedule(this.flushPendingTopBalanceAfterFly);
var i = Math.max(0, this.rewardNumFlyDelay || 2.5) + 2;
this.scheduleOnce(this.flushPendingTopBalanceAfterFly, i);
return !0;
};
i.prototype.clearPendingTopBalanceAfterFly = function() {
this._pendingTopBalanceAfterFly = null;
this._hasPendingTopBalanceAfterFly = !1;
this.unschedule(this.flushPendingTopBalanceAfterFly);
};
i.prototype.flushPendingTopBalanceAfterFly = function() {
if (this._hasPendingTopBalanceAfterFly) {
var e = Number(this._pendingTopBalanceAfterFly);
this.clearPendingTopBalanceAfterFly();
if (isFinite(e)) {
this.updateTopBalance(e);
this.refreshTopBalanceUI();
}
}
};
i.prototype.showRewardNumDisplay = function(e) {
this.ensureRuntimeNodeRefs();
if (this.node_rewardNum && this.node_rewardNum.isValid) {
var t = Number(e);
(!isFinite(t) || t < 0) && (t = 0);
if (t <= 0) {
console.warn("[reward_num] showRewardNumDisplay: 金额<=0 skip, rewardAmount=" + e);
this._rewardNumFlyAmount = 0;
this.unschedule(this.playRewardNumRedPacketFlyAnim);
this.hideRewardNumDisplay();
} else {
this._rewardNumFlyAmount = Math.floor(t);
var i = "";
if (cc.isValid(this.lbl_rewardNumText)) {
i = "+" + this.getCurrencyText("RP", this._rewardNumFlyAmount);
this.lbl_rewardNumText.string = i;
} else console.warn("[reward_num] showRewardNumDisplay: lbl_text 组件不存在");
console.log("[reward_num] show amount=" + e + " text=" + i + " activeBefore=" + this.node_rewardNum.active);
this.node_rewardNum.parent && this.node_rewardNum.parent.isValid && this.node_rewardNum.setSiblingIndex(this.node_rewardNum.parent.childrenCount - 1);
cc.Tween.stopAllByTarget(this.node_rewardNum);
this.node_rewardNum.active = !0;
var n = Math.max(0, this.rewardNumFadeInDuration || 0);
this.node_rewardNum.opacity = n > 0 ? 0 : 255;
n > 0 && cc.tween(this.node_rewardNum).to(n, {
opacity: 255
}, {
easing: "sineOut"
}).start();
var a = Math.max(0, this.rewardNumFlyDelay || 2.5);
console.log("[reward_num] show done active=" + this.node_rewardNum.active + " sibling=" + this.node_rewardNum.getSiblingIndex());
console.log("[NewbieGuide] showRewardNumDisplay: 调度飞钱动画 delay=" + a + "s step=" + this.getNewbieGuideStep());
this.unschedule(this.playRewardNumRedPacketFlyAnim);
this.scheduleOnce(this.playRewardNumRedPacketFlyAnim, a);
this.unschedule(this.hideRewardNumDisplay);
this.scheduleOnce(this.hideRewardNumDisplay, Math.max(0, this.rewardNumShowDuration || 3));
}
} else console.warn("[reward_num] showRewardNumDisplay: reward_num 节点不存在");
};
i.prototype.playRewardNumRedPacketFlyAnim = function() {
this.ensureRuntimeNodeRefs();
var e = this, t = this.node, i = function(t) {
console.log("[NewbieGuide] finishFly: reason=" + (t || "flyAnimComplete"));
e.flushPendingTopBalanceAfterFly();
e.tryAdvanceStep3AfterRewardFly();
};
if (t && t.isValid) if (this.node_rewardNum && this.node_rewardNum.isValid && this.node_rewardNum.active) if (this.node_rewardNumIcon && this.node_rewardNumIcon.isValid) {
var n = this._getBalanceIconNode();
if (n) {
var a = A.getWorldPos(this.node_rewardNumIcon), o = A.getWorldPos(n);
if (a && o) {
var r = this._flyMoneyIconFrame || this.sp_rewardNumIcon && this.sp_rewardNumIcon.spriteFrame;
if (r) {
var s = "";
this._rewardNumFlyAmount > 0 && (s = A.formatRewardText(this._rewardNumFlyAmount));
A.playFlyAnim({
iconFrame: r,
startPos: t.convertToNodeSpaceAR(a),
endPos: t.convertToNodeSpaceAR(o),
parentNode: t,
count: 10,
launchInterval: .1,
startScale: 1,
endScale: .5,
targetIconNode: n,
rewardText: s,
onAllArrived: function() {
e._rewardNumFlyAmount = 0;
i();
},
sfx: "audio/coin_collect",
sfxBundle: h.bundleName.game
});
} else i();
} else i();
} else i();
} else i("rewardNumIcon无效"); else {
console.log("[NewbieGuide] playFlyAnim跳过: rewardNum=" + !!this.node_rewardNum + " valid=" + !(!this.node_rewardNum || !this.node_rewardNum.isValid) + " active=" + !(!this.node_rewardNum || !this.node_rewardNum.active));
i("rewardNum无效或隐藏");
} else i("parentNode无效");
};
i.prototype.hideRewardNumDisplay = function() {
this.unschedule(this.playRewardNumRedPacketFlyAnim);
if (this.node_rewardNum && this.node_rewardNum.isValid) {
this.node_rewardNum.active && console.log("[reward_num] hide");
cc.Tween.stopAllByTarget(this.node_rewardNum);
var e = Math.max(0, this.rewardNumFadeOutDuration || 0);
if (e <= 0 || !this.node_rewardNum.active) {
this.node_rewardNum.opacity = 0;
this.node_rewardNum.active = !1;
return;
}
var t = this.node_rewardNum;
cc.tween(t).to(e, {
opacity: 0
}, {
easing: "sineOut"
}).call(function() {
t && t.isValid && (t.active = !1);
}).start();
}
};
i.prototype.onUserInfoUpdated = function(e) {
var t = null;
try {
if (null !== (t = this.parseRewardNumValue(e && e.cash_reward)) && t > 0) {
console.log("[reward_num] onUserInfoUpdated cash_reward=" + t);
this.showRewardNumDisplay(t);
} else 0 === t && console.log("[reward_num] onUserInfoUpdated cash_reward=0 skip fly anim");
} catch (e) {
console.error("[reward_num] onUserInfoUpdated exception", e);
}
if (!e || void 0 === e.task_point_num && void 0 === e.ltv_task_point_num) this.refreshTaskEntryRedPoint(); else {
var i = void 0 !== e.task_point_num ? e.task_point_num : this.taskPointNum, n = void 0 !== e.ltv_task_point_num ? e.ltv_task_point_num : this.ltvTaskPointNum;
this.updateTaskPointNum(i, n);
}
if (e && this.data_topBalanceMock) {
if (!(void 0 === e.cash_balance || this.canDelayTopBalanceUpdateForFly(t) && this.queueTopBalanceAfterFly(e.cash_balance))) {
this.clearPendingTopBalanceAfterFly();
this.updateTopBalance(Number(e.cash_balance));
}
void 0 !== e.bubble_balance && (this.data_topBalanceMock.bubble_balance = e.bubble_balance);
void 0 !== e.user_level && (this.data_topBalanceMock.user_level = e.user_level);
void 0 !== e.extract_money && (this.data_topBalanceMock.money = e.extract_money);
void 0 !== e.bubble_status && (this.data_topBalanceMock.bubble_status = e.bubble_status);
void 0 !== e.levels_passed_count && (this.data_topBalanceMock.levels_passed_count = e.levels_passed_count);
void 0 !== e.current_extract_levels_passed_count && (this.data_topBalanceMock.current_extract_levels_passed_count = e.current_extract_levels_passed_count);
void 0 !== e.levels_passed_limit && (this.data_topBalanceMock.levels_passed_limit = e.levels_passed_limit);
void 0 !== e.sign_in_days && (this.data_topBalanceMock.sign_in_days = e.sign_in_days);
void 0 !== e.sign_in_limit && (this.data_topBalanceMock.sign_in_limit = e.sign_in_limit);
void 0 !== e.extract_user_level && (this.data_topBalanceMock.user_level = e.extract_user_level);
void 0 !== e.level_limit && (this.data_topBalanceMock.level_limit = e.level_limit);
this.refreshTopBalanceUI();
this.initTishiBtnstate();
this.initFuzhuBtnstate();
}
};
i.prototype.pauseBarrage = function() {
if (!this._barragesPaused) {
console.log("[barrage] pause");
this._barragesPaused = !0;
this.stopTopBarrageRows();
for (var e = 0; e < this.topBarrageRows.length; e++) {
var t = this.topBarrageRows[e];
if (t && t.track) {
t.track.stopAllActions();
cc.tween(t.track).to(.3, {
opacity: 0
}).call(function() {
this.active = !1;
}.bind(t.track)).start();
}
}
if (this.node_bigBarragePanel) {
this.node_bigBarragePanel.stopAllActions();
cc.tween(this.node_bigBarragePanel).to(.3, {
opacity: 0
}).call(function() {
this.active = !1;
}.bind(this.node_bigBarragePanel)).start();
}
}
};
i.prototype.resumeBarrage = function() {
if (this._barragesPaused) {
console.log("[barrage] resume");
this._barragesPaused = !1;
for (var e = 0; e < this.topBarrageRows.length; e++) {
var t = this.topBarrageRows[e];
if (t && t.track) {
t.track.active = !0;
t.track.opacity = 0;
cc.tween(t.track).delay(.5).to(.5, {
opacity: 255
}).start();
}
}
this.startTopBarrageRows();
}
};
i.prototype.onSettleRewardOpen = function() {
this.pauseBarrage();
};
i.prototype.onSettleRewardClose = function() {
this.resumeBarrage();
var e = this, t = this.getNewbieGuideFlow(), i = this.getNewbieGuideStep();
console.log("[NewbieGuide] onSettleRewardClose: currentStep=" + i + " STEP_SETTLE=" + (t && t.STEP_SETTLE_LEVEL1));
if (t && this.isNewbieGuideStep(t.STEP_SETTLE_LEVEL1)) {
console.log("[NewbieGuide] onSettleRewardClose: 步骤=2，启动4s兜底定时器");
this.scheduleOnce(function() {
if (e.isViewAlive()) {
var t = e.getNewbieGuideFlow(), i = e.getNewbieGuideStep();
console.log("[NewbieGuide] onSettleRewardClose 兜底触发: currentStep=" + i + " STEP_SETTLE=" + (t && t.STEP_SETTLE_LEVEL1));
if (t && e.isNewbieGuideStep(t.STEP_SETTLE_LEVEL1)) {
console.log("[NewbieGuide] onSettleRewardClose: 兜底推进引导 step2→step3");
e.newbieGuidePendingLevelPassSettleClose = !1;
e.advanceNewbieGuideStep(t.STEP_SETTLE_LEVEL1);
e.refreshNewbieGuideState();
} else console.log("[NewbieGuide] onSettleRewardClose 兜底: 步骤已推进到" + i + "，跳过");
}
}, 4);
}
this.refreshNewbieGuideState();
};
i.prototype.tryAdvanceStep3AfterRewardFly = function() {
var e = this.getNewbieGuideFlow(), t = this.getNewbieGuideStep();
console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: 进入 currentStep=" + t + " flow=" + !!e);
if (!e) return !1;
if (!this.isNewbieGuideStep(e.STEP_SETTLE_LEVEL1)) {
console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: 跳过，当前步骤=" + t + " 不是STEP_SETTLE_LEVEL1=" + e.STEP_SETTLE_LEVEL1);
return !1;
}
this.newbieGuidePendingLevelPassSettleClose = !1;
var i = this.advanceNewbieGuideStep(e.STEP_SETTLE_LEVEL1);
console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: advanceResult=" + i + " newStep=" + this.getNewbieGuideStep());
this.refreshNewbieGuideState();
return !0;
};
i.prototype.initTopBalanceMockData = function() {
var e = _.default.getInstance();
this.data_topBalanceMock = {
cash_balance: e.cash_balance || 0,
money: e.extract_money || 0,
bubble_status: e.bubble_status || 0,
levels_passed_count: e.levels_passed_count || 0,
current_extract_levels_passed_count: e.current_extract_levels_passed_count || 0,
levels_passed_limit: e.levels_passed_limit || 0,
sign_in_days: e.sign_in_days || 0,
sign_in_limit: e.sign_in_limit || 7,
user_level: e.extract_user_level || 0,
level_limit: e.level_limit || 29,
bubble_balance: e.bubble_balance || 0
};
};
i.prototype.startTopBalanceMockUpdate = function() {};
i.prototype.mockTopBalanceTick = function() {};
i.prototype.updateTopBalance = function(e) {
this.data_topBalanceMock && (this.data_topBalanceMock.cash_balance = Math.max(0, e));
};
i.prototype.refreshTopBalanceUI = function() {
this.lbl_balanceText && (this.lbl_balanceText.string = this.getCurrencyText("RP", this.data_topBalanceMock.cash_balance));
var e = this.getTopBubbleI18nPayload();
this.node_bubbleContainer && (this.node_bubbleContainer.active = !0);
this.rich_bubbleText && this.rich_bubbleText.node && (this.rich_bubbleText.node.active = !0);
this.applyTopBubbleI18n(e);
};
i.prototype.ensureTopBubbleI18nLabel = function() {
if (this.rich_bubbleText && this.rich_bubbleText.node) {
var e = this.rich_bubbleText.node.getComponent("I18nLabel");
e || (e = this.rich_bubbleText.node.addComponent("I18nLabel"));
if (e) {
e.targetRichText = this.rich_bubbleText;
e.targetLabel = null;
this.i18nBubbleLabelComp = e;
this.initTopBubbleAutoFitConfig();
}
}
};
i.prototype.initTopBubbleAutoFitConfig = function() {
if (this.rich_bubbleText) {
this.topBubbleBaseFontSize = Math.max(1, this.rich_bubbleText.fontSize || this.topBubbleBaseFontSize || 20);
this.topBubbleBaseLineHeight = Math.max(1, this.rich_bubbleText.lineHeight || this.topBubbleBaseLineHeight || this.topBubbleBaseFontSize);
}
};
i.prototype.scheduleTopBubbleAutoFit = function() {
if (this.enableTopBubbleAutoFit) if (this.rich_bubbleText && this.rich_bubbleText.node) {
console.log("[top_bubble_fit] schedule", {
text: this.rich_bubbleText.string,
fontSize: this.rich_bubbleText.fontSize,
lineHeight: this.rich_bubbleText.lineHeight
});
this.unschedule(this.fitTopBubbleRichText);
this.unschedule(this.fitTopBubbleRichTextDeferred);
this.scheduleOnce(this.fitTopBubbleRichText, 0);
this.scheduleOnce(this.fitTopBubbleRichTextDeferred, .05);
} else console.log("[top_bubble_fit] skip schedule: rich text missing");
};
i.prototype.fitTopBubbleRichTextDeferred = function() {
this.enableTopBubbleAutoFit && this.fitTopBubbleRichText();
};
i.prototype.getTopBubbleRenderedSize = function() {
if (!this.rich_bubbleText) return cc.size(0, 0);
var e = this.rich_bubbleText.node ? this.rich_bubbleText.node.children : null;
if (e && e.length > 0) {
for (var t = Number.POSITIVE_INFINITY, i = Number.POSITIVE_INFINITY, n = Number.NEGATIVE_INFINITY, a = Number.NEGATIVE_INFINITY, o = 0; o < e.length; o++) {
var r = e[o];
if (r) {
var s = r.getBoundingBox();
t = Math.min(t, s.x);
i = Math.min(i, s.y);
n = Math.max(n, s.x + s.width);
a = Math.max(a, s.y + s.height);
}
}
if (isFinite(t) && isFinite(i) && isFinite(n) && isFinite(a)) return cc.size(Math.max(0, n - t), Math.max(0, a - i));
}
if (this.rich_bubbleText._labelWidth > 0 && this.rich_bubbleText._labelHeight > 0) return cc.size(this.rich_bubbleText._labelWidth, this.rich_bubbleText._labelHeight);
var l = this.rich_bubbleText._labelSegments;
if (!l || l.length <= 0) return this.rich_bubbleText.node.getContentSize();
for (var c = Number.POSITIVE_INFINITY, u = Number.POSITIVE_INFINITY, d = Number.NEGATIVE_INFINITY, h = Number.NEGATIVE_INFINITY, p = 0; p < l.length; p++) {
var _ = l[p];
if (_ && _.node) {
var f = _.node.getBoundingBoxToWorld();
c = Math.min(c, f.x);
u = Math.min(u, f.y);
d = Math.max(d, f.x + f.width);
h = Math.max(h, f.y + f.height);
}
}
return isFinite(c) && isFinite(u) && isFinite(d) && isFinite(h) ? cc.size(Math.max(0, d - c), Math.max(0, h - u)) : this.rich_bubbleText.node.getContentSize();
};
i.prototype.getTopBubbleContainerSize = function() {
if (this.topBubbleFitWidth > 0 && this.topBubbleFitHeight > 0) return cc.size(this.topBubbleFitWidth, this.topBubbleFitHeight);
if (!this.rich_bubbleText || !this.rich_bubbleText.node) return cc.size(0, 0);
var e = this.rich_bubbleText.node, t = e.getContentSize(), i = e.parent, n = e.getComponent(cc.Widget);
if (i && n) {
var a = i.getContentSize(), o = Math.max(0, n.left || 0), r = Math.max(0, n.right || 0), s = Math.max(0, n.top || 0), l = Math.max(0, n.bottom || 0), c = Math.max(1, a.width - o - r), u = Math.max(1, a.height - s - l);
return cc.size(c, u);
}
return t;
};
i.prototype.fitTopBubbleRichText = function() {
if (this.enableTopBubbleAutoFit) if (this.rich_bubbleText && this.rich_bubbleText.node) {
var e = this.rich_bubbleText, t = this.getTopBubbleContainerSize(), i = Math.max(1, this.topBubbleBaseFontSize || e.fontSize || 20);
i = Math.min(i, Math.max(1, this.topBubbleMaxFontSize || 30));
var n = Math.max(1, this.topBubbleBaseLineHeight || e.lineHeight || i), a = Math.min(i, Math.max(8, this.topBubbleMinFontSize || 14)), o = Math.max(1, this.topBubbleMaxLines || 2), r = this.topBubbleFitPaddingRatio || .9, s = t.width * r + 1, l = Math.min(t.height * r + 1, n * o + 1);
e.node && e.node.setScale(1, 1);
e.fontSize = i;
e.lineHeight = n;
e._updateRichText && e._updateRichText();
var c = this.getTopBubbleRenderedSize(), u = 1;
c.width > 0 && c.height > 0 && (u = Math.min(1, s / c.width, l / c.height));
var d = i;
u < 1 && (d = Math.max(a, Math.floor(i * u)));
e.fontSize = d;
e.lineHeight = Math.max(1, Math.round(n * d / i));
e._updateRichText && e._updateRichText();
var h = this.getTopBubbleRenderedSize(), p = 1;
if (h.width > 0 && h.height > 0) {
p = Math.min(1, s / h.width, l / h.height);
p = Math.max(this.topBubbleMinScale || .55, p);
}
e.node && e.node.setScale(p, p);
console.log("[top_bubble_fit] result", {
text: e.string,
containerW: t.width,
containerH: t.height,
preRenderedW: c.width,
preRenderedH: c.height,
fitRatio: u,
renderedW: h.width,
renderedH: h.height,
fitPaddingRatio: r,
maxAllowedW: s,
maxAllowedH: l,
maxLines: o,
baseFont: i,
minFont: a,
targetFont: d,
finalFont: e.fontSize,
finalLineHeight: e.lineHeight,
finalScale: p,
effectiveFont: Math.round(e.fontSize * p * 100) / 100
});
} else console.log("[top_bubble_fit] skip fit: rich text missing");
};
i.prototype.applyTopBubbleI18n = function(e) {
if (this.rich_bubbleText && e) {
console.log("[top_bubble_fit] apply", {
key: e.key,
params: e.params || []
});
if (this.i18nBubbleLabelComp && this.i18nBubbleLabelComp.setI18nKey) {
this.i18nBubbleLabelComp.setI18nKey(e.key, e.params || []);
this.enableTopBubbleAutoFit && this.scheduleTopBubbleAutoFit();
} else {
this.rich_bubbleText.string = this.i18n(e.key, e.params || []);
this.enableTopBubbleAutoFit && this.scheduleTopBubbleAutoFit();
}
} else console.log("[top_bubble_fit] skip apply: payload or rich text missing", {
hasRichText: !!this.rich_bubbleText,
hasPayload: !!e
});
};
i.prototype.advanceTopBubbleStatus = function() {
var e = this.data_topBalanceMock;
if (e) {
for (var t = e.bubble_status, i = 0; i++ < 8; ) {
var n = !1;
if (0 == e.bubble_status) {
if (e.cash_balance >= e.money) {
e.bubble_status = 1;
n = !0;
}
} else if (1 == e.bubble_status) {
if (e.levels_passed_limit > 0 && (e.current_extract_levels_passed_count || 0) >= e.levels_passed_limit) {
e.bubble_status = 2;
n = !0;
}
} else if (2 == e.bubble_status) {
if (e.sign_in_days >= e.sign_in_limit) {
e.bubble_status = 3;
n = !0;
}
} else if (3 == e.bubble_status && e.user_level >= e.level_limit) {
e.bubble_status = 4;
n = !0;
}
if (!n) break;
}
if (e.bubble_status !== t) try {
var a = _.default.getInstance();
a && (a.bubble_status = e.bubble_status);
} catch (e) {
console.warn("[top_bubble] sync UserData.bubble_status failed", e);
}
}
};
i.prototype.getTopBubbleI18nPayload = function() {
var e = this.data_topBalanceMock;
if (!e) return {
key: "key_common_barrage_empty",
params: []
};
this.advanceTopBubbleStatus();
if (0 == e.bubble_status) {
var t = Math.max(0, e.money - e.cash_balance);
return {
key: "key_pop_desc_cash_need",
params: [ this.wrapBubbleNum(this.getCurrencyText("RP", t)), "<color=#00C853>" + this.getCurrencyText("RP", e.money) + "</color>" ]
};
}
if (1 == e.bubble_status) {
var i = Math.max(0, (e.levels_passed_limit || 0) - (e.current_extract_levels_passed_count || 0));
return {
key: i > 0 ? "key_pop_desc_ad_need" : "key_pop_desc_ad_done",
params: i > 0 ? [ this.wrapBubbleNum(i) ] : []
};
}
if (2 == e.bubble_status) {
var n = Math.max(0, e.sign_in_limit - e.sign_in_days);
return {
key: n > 0 ? "key_pop_desc_sign_need" : "key_pop_desc_sign_done",
params: n > 0 ? [ this.wrapBubbleNum(n) ] : []
};
}
if (3 == e.bubble_status) {
var a = Math.max(0, e.level_limit - e.user_level);
return {
key: a > 0 ? "key_pop_desc_level_need" : "key_pop_desc_level_done",
params: a > 0 ? [ this.wrapBubbleNum(a) ] : []
};
}
return {
key: "key_pop_desc_ready",
params: []
};
};
i.prototype.formatTopBalance = function(e) {
return Math.max(0, Math.floor(e)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
i.prototype.getCurrencyText = function(e, t) {
var i = void 0 !== t ? t : e;
return v.formatCurrency(i);
};
i.prototype.getBarrageCurrencyText = function(e, t) {
var i = void 0 !== t ? t : e;
return v.formatCurrencyBarrage(i);
};
i.prototype.i18n = function(e, t, i) {
return v.t(e, t, i);
};
i.prototype._refreshArrowLevelLabel = function() {
this.ensureRuntimeNodeRefs();
if (cc.isValid(this.lbl_txtLevel)) {
var e = T.default.arrow_level && T.default.arrow_level.arrow_level_id;
e || (e = Number(T.default.current_arrow_level_id || 0));
this.lbl_txtLevel.string = v.t("key_common_level_label", [ e || 0 ]);
}
};
i.prototype._refreshWithdrawTextLabel = function() {
this.ensureRuntimeNodeRefs();
cc.isValid(this.lbl_withdrawText) && (this.lbl_withdrawText.string = v.t("key_withdraw_page_title"));
};
i.prototype.getNewbieGuideFlow = function() {
return w.default || w;
};
i.prototype.getNewbieGuideStep = function() {
var e = this.getNewbieGuideFlow();
return e && "function" == typeof e.getStep ? Number(e.getStep() || 0) : 0;
};
i.prototype.isNewbieGuideStep = function(e) {
return this.getNewbieGuideStep() === Number(e || 0);
};
i.prototype.advanceNewbieGuideStep = function(e) {
var t = this.getNewbieGuideFlow();
return !(!t || "function" != typeof t.advanceIfCurrent || !t.advanceIfCurrent(e));
};
i.prototype.isNewbieSettleReward = function(e) {
if (!e) return !1;
var t = e.is_new;
void 0 === t && (t = e.isNew);
var i = "string" == typeof t ? t.trim().toLowerCase() : t;
return !0 === t || "true" === i || "1" === i || 1 === Number(t || 0);
};
i.prototype.refreshStep3GuideTipText = function() {
this.ensureRuntimeNodeRefs();
this.lbl_step3GuideTip && (this.lbl_step3GuideTip.string = this.i18n("key_newbie_guide_step3", [], "查看余额，点击提现"));
};
i.prototype.setStep3GuideTipActive = function(e) {
this.ensureRuntimeNodeRefs();
if (this.node_step3GuideTip && this.node_step3GuideTip.isValid) {
e && this.refreshStep3GuideTipText();
this.node_step3GuideTip.active = !!e;
}
};
i.prototype.refreshGuideLevelTipsI18n = function() {
this.ensureRuntimeNodeRefs();
this.lbl_guideLevel1Tip && (this.lbl_guideLevel1Tip.string = this.i18n("key_newbie_guide_step1", [], "点击消除箭头"));
this.lbl_guideLevel2Tip && (this.lbl_guideLevel2Tip.string = this.i18n("key_newbie_guide_step8", [], "手指外拨进行缩放"));
};
i.prototype.refreshStep7GuideBannerText = function(e) {
this.ensureRuntimeNodeRefs();
var t = e;
"string" != typeof t && (t = this.i18n("key_newbie_guide_step7_banner", [], "过关即可获得现金奖励，过关越多奖励越多"));
if (t = String(t || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")) {
this.lbl_step7GuideTextBack && (this.lbl_step7GuideTextBack.string = t);
this.lbl_step7GuideTextFront && (this.lbl_step7GuideTextFront.string = t);
}
};
i.prototype.setStep7GuideBannerActive = function(e) {
this.ensureRuntimeNodeRefs();
if (this.node_step7GuideBanner && this.node_step7GuideBanner.isValid) {
if (e) {
this.refreshStep7GuideBannerText();
this.node_step7GuideBanner.opacity = 255;
} else {
this.node_step7GuideBanner.stopAllActions();
if (this.node_step7GuideBannerBg) {
cc.Tween && cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(this.node_step7GuideBannerBg);
this.node_step7GuideBannerBg.x = 0;
}
if (this.node_step7GuideBannerDim) {
cc.Tween && cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(this.node_step7GuideBannerDim);
this.node_step7GuideBannerDim.opacity = 0;
}
}
this.node_step7GuideBanner.active = !!e;
}
};
i.prototype.playNewbieGuideBanner = function(e, t) {
this.ensureRuntimeNodeRefs();
var i = this.node_step7GuideBanner;
if (i && i.isValid) {
this.bigTopBarrageShown = !0;
var n = this.node_step7GuideBannerBg, a = this.node_step7GuideBannerDim;
i.stopAllActions();
n && cc.Tween && cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(n);
a && cc.Tween && cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(a);
a && (a.opacity = 0);
i.active = !0;
i.opacity = 255;
this.refreshStep7GuideBannerText(e);
var o = Math.max(.2, this.bigTopBarrageSlideDuration || .35), r = Math.max(.45, 1.6 * (this.bigTopBarrageSlideDuration || .35)), s = this.bigTopBarrageStayDuration || 3, l = (i.width || 750) + (n ? n.width : 720) / 2;
if (n) {
n.x = -l;
cc.tween(n).to(r, {
x: 0
}, {
easing: "backOut"
}).delay(s).to(r, {
x: l
}, {
easing: "backIn"
}).call(function() {
i.active = !1;
n.x = 0;
a && (a.opacity = 0);
t && t();
}).start();
} else {
i.opacity = 0;
cc.tween(i).to(o, {
opacity: 255
}).delay(s).to(o, {
opacity: 0
}).call(function() {
i.active = !1;
i.opacity = 255;
t && t();
}).start();
}
} else t && t();
};
i.prototype.tryShowStep7NewbieBanner = function() {
var e = this.getNewbieGuideFlow();
if (e && this.isNewbieGuideStep(e.STEP_HOME_BANNER) && !this.newbieGuideBannerPlaying) {
this.newbieGuideBannerPlaying = !0;
var t = this.i18n("key_newbie_guide_step7_banner", [], "过关即可获得现金奖励，过关越多奖励越多"), i = this;
this.playNewbieGuideBanner(t, function() {
i.newbieGuideBannerPlaying = !1;
i.advanceNewbieGuideStep(e.STEP_HOME_BANNER);
i._level2ZoomGuideDismissed || 2 != Number(_.default.getInstance().level || 1) || i.setGuideNodeActive("guide_level2", !0);
});
}
};
i.prototype.refreshNewbieGuideState = function() {
var e = this.getNewbieGuideFlow();
if (!e || e.isDone && e.isDone()) {
this.setGuideOverlayActive("guide_1", !1);
this.setStep3GuideTipActive(!1);
this.setStep7GuideBannerActive(!1);
} else {
var t = this.getNewbieGuideStep();
console.log("[NewbieGuide] refreshNewbieGuideState: step=" + t + " STEP_TOP_BALANCE=" + e.STEP_TOP_BALANCE);
if (t === e.STEP_TOP_BALANCE) {
var i = this.findChildByNameDeep(this.node, "guide_1");
console.log("[NewbieGuide] step3展示: guide_1节点=" + !!i + " node_step3GuideTip=" + !(!this.node_step3GuideTip || !this.node_step3GuideTip.isValid));
this.setGuideOverlayActive("guide_1", !0);
this.setStep3GuideTipActive(!0);
} else {
this.setGuideOverlayActive("guide_1", !1);
this.setStep3GuideTipActive(!1);
}
t === e.STEP_HOME_BANNER ? this.tryShowStep7NewbieBanner() : this.newbieGuideBannerPlaying || this.setStep7GuideBannerActive(!1);
}
};
i.prototype.wrapBubbleNum = function(e) {
return "<color=#E61A4C>" + e + "</color>";
};
i.prototype._consumeProp = function(t, i) {
var n = this, a = _.default.getInstance();
console.log("[prop] _consumeProp: prop_type=" + t + " hint=" + a.hint_prop_count + " guideline=" + a.guideline_prop_count);
try {
var o = LoadingHttpService, r = Handler, s = o.default, l = r.default;
s.consumeArrowProp({
prop_type: t
}, l.create(null, function(e) {
if (e && e.data) {
var a = _.default.getInstance();
if (void 0 !== e.data.hint_prop_count) {
a.hint_prop_count = e.data.hint_prop_count;
a.num_tipscards = e.data.hint_prop_count;
}
void 0 !== e.data.guideline_prop_count && (a.guideline_prop_count = e.data.guideline_prop_count);
console.log("[prop] _consumeProp success: prop_type=" + t + " hint=" + a.hint_prop_count + " guideline=" + a.guideline_prop_count);
n.initTishiBtnstate();
i && i();
} else console.error("[consumeProp] failed", e);
}), l.create(null, function(e) {
console.error("[consumeProp] error", e);
}));
} catch (e) {
console.error("[consumeProp] exception", e);
}
};
i.prototype._claimPropVideoReward = function(t, i) {
var n = this;
console.log("[prop] _claimPropVideoReward: video_type=" + t);
var a = t;
2 === t || "2" === t ? a = "hint_prop" : 3 !== t && "3" !== t || (a = "guideline_prop");
console.log("[prop] _claimPropVideoReward: video_type=" + t + " request_video_type=" + a);
try {
var o = LoadingHttpService, r = Handler, s = o.default, l = r.default;
s.claimArrowAdReward({
video_type: a
}, l.create(null, function(e) {
if (e && e.data) {
var t = _.default.getInstance();
if (void 0 !== e.data.hint_prop_count) {
t.hint_prop_count = e.data.hint_prop_count;
t.num_tipscards = e.data.hint_prop_count;
}
void 0 !== e.data.guideline_prop_count && (t.guideline_prop_count = e.data.guideline_prop_count);
console.log("[prop] _claimPropVideoReward success: video_type=" + a + " hint=" + t.hint_prop_count + " guideline=" + t.guideline_prop_count);
n.initTishiBtnstate();
n.initFuzhuBtnstate();
}
i && i();
}), l.create(null, function(e) {
console.error("[claimPropVideoReward] error", e);
i && i();
}));
} catch (e) {
console.error("[claimPropVideoReward] exception", e);
i && i();
}
};
i.prototype.getTopBubbleText = function() {
var e = this.getTopBubbleI18nPayload();
return this.i18n(e.key, e.params || []);
};
i.prototype.InitNodepool = function() {
var e = this;
return new Promise(function(t, i) {
var n = cc.assetManager.getBundle(h.bundleName.game), a = [], o = new Promise(function(t, i) {
n.load("prefab/item", function(n, a) {
if (n) {
console.error("加载 prefab/item 失败:", n);
i(n);
} else {
C.default.getInstance().pool_snake.setCloneAsset(a, e.layer_mid);
C.default.getInstance().pool_snake.setInitSize(100);
t();
}
});
});
a.push(o);
var r = new Promise(function(t, i) {
n.load("prefab/item_map", function(n, a) {
if (n) {
console.error("加载 prefab/item_map 失败:", n);
i(n);
} else {
C.default.getInstance().pool_map.setCloneAsset(a, e.layer_mid);
C.default.getInstance().pool_map.setInitSize(100);
t();
}
});
});
a.push(r);
Promise.all(a).then(function() {
console.log("对象池已初始化完成");
t();
}).catch(function(e) {
return i(e);
});
});
};
i.prototype.Init = function() {
console.log("初始化游戏");
if (this.txt_levelnum) {
this.txt_levelnum.useSystemFont = !0;
this.txt_levelnum.font = null;
this.txt_levelnum.fontFamily = "Arial";
this.txt_levelnum.fontSize = 16;
this.txt_levelnum.lineHeight = 20;
this.txt_levelnum.string = v.t("key_common_level_label", [ _.default.getInstance().level ]);
}
this._refreshArrowLevelLabel();
this._refreshWithdrawTextLabel();
this.num_life = T.default.arrow_level.life_count || 3;
this.refreshLifeHearts();
this.applyCountdownUIState();
if (this.isCountdownEnabled()) {
var e = T.default.arrow_level.time_limit || 0;
if (e > 0) this.num_gametime = e; else {
var t = r.default.getInstance().getById(p.GametimeConfig, this.num_rellyLevel);
this.num_gametime = t && t.leveltime ? t.leveltime : 525;
}
this.txt_time.string = u.default.formatSeconds(this.num_gametime);
} else {
this.num_gametime = 0;
this.txt_time.string = this.txt_time.string || "08:45";
}
if (!this.txt_lastnum) {
var i = this.findChildNodeByName(this.node, "txt_lastnum");
i && (this.txt_lastnum = i.getComponent(cc.Label));
}
if (this.txt_lastnum) {
var n = T.default.arrow_level.arrow_count || 0;
this.txt_lastnum.string = this._formatLastnum(n, n);
}
this.slider.progress = 0;
this.sp_slderbg.node.width = 52;
this.bool_cantouchAd = !0;
this.bool_isStop = !1;
this.dsj = 0;
this.bool_countdownStarted = !1;
this._sfVb && this._sfOff || this._cacheSpriteFrames();
if (!this.bool_isRestart) {
this.bool_hasFuzhuline = !1;
this.initFuzhuBtnstate();
}
this.snake_errorID = [];
this.bool_cantouchAd = !0;
this.bool_hasFuzhuline = !1;
this.addMouseWheelSupport();
};
i.prototype.ShowGame = function() {
var e = this;
this.ensureRuntimeNodeRefs();
var t = _.default.getInstance().colorMode, i = this.node.getChildByNambg;
i && (i.color = t ? cc.color(18, 18, 30) : cc.color(255, 255, 255));
var n = _.default.getInstance().level;
m.default.reportData("level_node", {
level: n,
enter_game: 1
});
m.default.reportData("user_action", {
action: "enter_game",
module: "level_" + n,
is_ad: 0
});
this.closeGuide();
this.showGuide();
this.refreshNewbieGuideState();
this.enableRuntimeWidgetRealign && this.node_checksize && this.node_checksize.getComponent(cc.Widget) && this.node_checksize.getComponent(cc.Widget).updateAlignment();
this.node_mask = this.node_mask || this.node_checksize && this.node_checksize.getChildByNammask;
this.enableRuntimeWidgetRealign && this.node_mask && this.node_mask.getComponent(cc.Widget) && this.node_mask.getComponent(cc.Widget).updateAlignment();
n = {
w: (this.node_checksize ? this.node_checksize.width : this.node.width) - 100,
h: (this.node_checksize ? this.node_checksize.height : this.node.height) - 100
};
this.node_game && this.node_game.destroy();
console.log("ShowGame", "ShowGame1");
l.default.getInstance().loadRes("prefab/game", cc.Prefab, null, h.bundleName.game).then(function(t) {
if (e.isViewAlive()) {
console.log("ShowGame", "ShowGame" + t);
c.default.getInstance().hideWatingUI();
e.Init();
e.node_game = cc.instantiate(t);
e.node_mask ? e.node_mask.addChild(e.node_game) : e.node.addChild(e.node_game);
e.node_game.getComponent(S.default).levelInfo = e.data_levelinfo;
var i = {
width: 50 * e.data_levelinfo.XSize,
hight: 50 * e.data_levelinfo.YSize
};
e.adjustGameNodeToRect(e.node_game, n, i);
e.node_game.width = 5e3;
e.node_game.height = 5e3;
e.showStartAni();
e.resumeBarrage();
}
});
};
i.prototype.adjustGameNodeToRect = function(e, t, i) {
var n = t.w / t.h, a = 1;
a = i.width / i.hight > n ? t.w / i.width : t.h / i.hight;
e.x = 0;
e.y = 0;
a > 1 && (a = 1);
e.scale = a;
this.num_normalScale = a;
e.getComponent(S.default) && (e.getComponent(S.default).num_minScale = a);
};
i.prototype.EventAdd = function() {
this._onUserInfoUpdatedHandler || (this._onUserInfoUpdatedHandler = this.onUserInfoUpdated.bind(this));
this._onArrowRewardClaimedHandler || (this._onArrowRewardClaimedHandler = this.onArrowRewardClaimed.bind(this));
s.default.getInstance().on(h.gameEvent.gameFail, this.showLife, this);
s.default.getInstance().on(h.gameEvent.notifySnakeNum, this.showSnakenum, this);
s.default.getInstance().on(h.gameEvent.notifySnakeNumChange, this.chnageSnakeNum, this);
s.default.getInstance().on(h.gameEvent.gameNext, this.showNext, this);
s.default.getInstance().on(h.gameEvent.gameAdFuhuo, this.showFuhuo, this);
s.default.getInstance().on(h.gameEvent.gameRestart, this.showRestart, this);
s.default.getInstance().on(h.gameEvent.notifySnakeTouch, this.closeAdState, this);
s.default.getInstance().on(h.gameEvent.gameScaleChange, this.gameScalechange, this);
s.default.getInstance().on(h.gameEvent.closeSet, this.clsoeSetHandle, this);
s.default.getInstance().on(h.gameEvent.gettipsCard, this.initTishiBtnstate, this);
s.default.getInstance().on(h.gameEvent.snakeTouchSnake, this.ShowError, this);
s.default.getInstance().on(h.gameEvent.fuzhulineState, this.changeFuzhuBtnState, this);
s.default.getInstance().on(h.gameEvent.jumpLevel, this.jumpLevel, this);
s.default.getInstance().on(h.gameEvent.languageChanged, this.onLanguageChanged, this);
s.default.getInstance().on(h.gameEvent.settleRewardOpen, this.onSettleRewardOpen, this);
s.default.getInstance().on(h.gameEvent.settleRewardClose, this.onSettleRewardClose, this);
s.default.getInstance().on(h.gameEvent.levelFailReport, this._reportLevelFail, this);
s.default.getInstance().off(h.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
s.default.getInstance().off(h.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
s.default.getInstance().on(h.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
s.default.getInstance().on(h.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
};
i.prototype.EventRemove = function() {
s.default.getInstance().off(h.gameEvent.gameFail, this.showLife, this);
s.default.getInstance().off(h.gameEvent.notifySnakeNum, this.showSnakenum, this);
s.default.getInstance().off(h.gameEvent.notifySnakeNumChange, this.chnageSnakeNum, this);
s.default.getInstance().off(h.gameEvent.gameNext, this.showNext, this);
s.default.getInstance().off(h.gameEvent.gameAdFuhuo, this.showFuhuo, this);
s.default.getInstance().off(h.gameEvent.gameRestart, this.showRestart, this);
s.default.getInstance().off(h.gameEvent.notifySnakeTouch, this.closeAdState, this);
s.default.getInstance().off(h.gameEvent.gameScaleChange, this.gameScalechange, this);
s.default.getInstance().off(h.gameEvent.closeSet, this.clsoeSetHandle, this);
s.default.getInstance().off(h.gameEvent.gettipsCard, this.initTishiBtnstate, this);
s.default.getInstance().off(h.gameEvent.snakeTouchSnake, this.ShowError, this);
s.default.getInstance().off(h.gameEvent.fuzhulineState, this.changeFuzhuBtnState, this);
s.default.getInstance().off(h.gameEvent.jumpLevel, this.jumpLevel, this);
s.default.getInstance().off(h.gameEvent.languageChanged, this.onLanguageChanged, this);
s.default.getInstance().off(h.gameEvent.settleRewardOpen, this.onSettleRewardOpen, this);
s.default.getInstance().off(h.gameEvent.settleRewardClose, this.onSettleRewardClose, this);
s.default.getInstance().off(h.gameEvent.levelFailReport, this._reportLevelFail, this);
this._onUserInfoUpdatedHandler && s.default.getInstance().off(h.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
this._onArrowRewardClaimedHandler && s.default.getInstance().off(h.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
};
i.prototype.onLanguageChanged = function() {
this.i18nGroup && this.i18nGroup.refreshChildren && this.i18nGroup.refreshChildren();
this.refreshTopBalanceUI();
this._initFlyMoneyIconFrame();
this.refreshTopMoneyArrowIcons();
this.loadTopBarrageArrowImages();
for (var e = 0; e < this.topBarrageRows.length; e++) this.playTopBarrageByRow(e);
this.refreshBigTopBarrageLanguage();
this.refreshGuideLevelTipsI18n();
this.node_step3GuideTip && this.node_step3GuideTip.active && this.refreshStep3GuideTipText();
this.node_step7GuideBanner && this.node_step7GuideBanner.active && this.refreshStep7GuideBannerText();
this._refreshArrowLevelLabel();
this._refreshWithdrawTextLabel();
};
i.prototype.refreshBigTopBarrageLanguage = function() {
if (this.node_bigBarragePanel && this.node_bigBarragePanel.active && this.rich_bigBarrageText && this.currentBigBarrageData) {
this.rich_bigBarrageText.string = this.getBigTopBarrageRichText(this.currentBigBarrageData);
this.refreshTopBarrageLabelLayout(this.rich_bigBarrageText);
}
};
i.prototype.gameScalechange = function(e) {
this.slider.progress = e.scale - this.num_normalScale;
this.sp_slderbg.node.width = 358 * this.slider.progress + 52;
this.closeGuide2();
};
i.prototype.showLife = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
if (-1 == this.snake_errorID.indexOf(e[0])) {
this.snake_errorID.push(e[0]);
this.num_life--;
this._mistakeCount = (this._mistakeCount || 0) + 1;
console.log("[ArrowStats] 失误 mistake_count=" + this._mistakeCount + " 剩余life=" + this.num_life);
this.num_life <= 0 && (this.num_life = 0, this.bool_isStop = !0, c.default.getInstance().show(f.default.cashArrowReviveView));
this.refreshLifeHearts();
}
};
i.prototype.showSnakenum = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
this.num_current_snake = e[0];
this.num_total_snake = e[1];
this.txt_lastnum && (this.txt_lastnum.string = this._formatLastnum(this.num_current_snake, this.num_total_snake));
};
i.prototype.chnageSnakeNum = function(e) {
this.bool_isStop && (this.bool_isStop = !1);
this.isCountdownEnabled() && !this.bool_countdownStarted && (this.bool_countdownStarted = !0);
this.num_current_snake = e || this.num_current_snake - 1;
if (this.num_current_snake < this.num_total_snake) {
this.setGuideNodeActive("guide_level1", !1);
var t = this.getNewbieGuideFlow();
t && this.advanceNewbieGuideStep(t.STEP_ENTRY_LEVEL1);
}
this._eliminateCounter = (this._eliminateCounter || 0) + 1;
this._totalEliminated = (this._totalEliminated || 0) + 1;
if (this.txt_lastnum) {
var i = T.default.arrow_level.arrow_count || 0, n = Math.max(0, i - this._totalEliminated);
this.txt_lastnum.string = this._formatLastnum(n, i);
}
this.consumeFuzhulineCount();
var a = T.default.arrow_level.eliminate_reward || 0;
if (a > 0 && this.data_topBalanceMock) {
var o = this;
this.playFlyMoneyAnim(5, a, function() {
var e = (o.data_topBalanceMock.cash_balance || 0) + a;
o.updateTopBalance(e);
T.default.cash_balance = e;
o.refreshTopBalanceUI();
});
}
var r = this._getBigRewardTriggerCount(), s = Number(T.default.arrow_level.tail_clearance || 5), l = this.num_current_snake || 0;
console.log("[ArrowLevel] 消除计数 _eliminateCounter=" + this._eliminateCounter + "/" + r + " remain=" + l + " tail_clearance=" + s);
if (r > 0 && this._eliminateCounter >= r) {
var u = this._eliminateCounter;
this._eliminateCounter = 0;
if (this.num_current_snake <= 0) console.log("[ArrowLevel] 最后箭头达消除阈值但已通关，跳过消除结算，由通关结算处理"); else if (l <= s) console.log("[ArrowLevel] 剩余箭头(" + l + ")<=tail_clearance(" + s + ")，跳过中途结算，等待过关弹窗"); else {
var d = this;
d.bool_isStop = !0;
d.pauseBarrage();
console.log("[ArrowLevel] 触发消除结算 eliminate_count=" + u);
this._settleArrowReward(!1, u, function(e) {
console.log("[ArrowLevel] 中途结算返回: " + JSON.stringify(e && e.data || null));
if (e && e.data) {
var t = e.data.arrow_level || {}, i = null != e.data.big_reward_trigger ? e.data.big_reward_trigger : t.big_reward_trigger, n = null != e.data.tail_clearance ? e.data.tail_clearance : t.tail_clearance;
console.log("[ArrowLevel] 接口返回 big_reward_trigger=" + i + " tail_clearance=" + n + " 当前值 big_reward_trigger=" + T.default.arrow_level.big_reward_trigger + " tail_clearance=" + T.default.arrow_level.tail_clearance);
null != i && (T.default.arrow_level.big_reward_trigger = Number(i));
null != n && (T.default.arrow_level.tail_clearance = Number(n));
console.log("[ArrowLevel] 更新后 big_reward_trigger=" + T.default.arrow_level.big_reward_trigger + " tail_clearance=" + T.default.arrow_level.tail_clearance);
}
c.default.getInstance().show(f.default.arrowSettleRewardView, {
settleData: e && e.data || {},
isLevelPassed: !1,
onClose: function() {
console.log("[ArrowLevel] 消除结算弹窗关闭，恢复游戏");
d.bool_isStop = !1;
}
});
});
}
}
this.checkWin();
};
i.prototype._formatLastnum = function(e, t) {
var i = String(t).length;
i < 2 && (i = 2);
for (var n = String(e); n.length < i; ) n = "0" + n;
for (var a = String(t); a.length < i; ) a = "0" + a;
console.log("gameview------", n + " / " + a);
return n + "/" + a;
};
i.prototype.consumeFuzhulineCount = function() {
if (this.bool_hasFuzhuline) {
var e = this.node_game && this.node_game.getComponent(S.default);
if (e && e.bool_fuzhulineisOpen) if (this.num_fuzhulineRemainClear <= 0) this.disableFuzhulineByLimit(); else {
this.num_fuzhulineRemainClear -= 1;
console.log("[fuzhuline] consume remain =", this.num_fuzhulineRemainClear);
this.num_fuzhulineRemainClear <= 0 && this.disableFuzhulineByLimit();
}
}
};
i.prototype.disableFuzhulineByLimit = function() {
this.bool_hasFuzhuline = !1;
this.num_fuzhulineRemainClear = 0;
this.initFuzhuBtnstate();
this.forceCloseFuzhuline();
console.log("[fuzhuline] expired, hide after clear limit reached");
};
i.prototype.forceCloseFuzhuline = function() {
var e = this.node_game && this.node_game.getComponent(S.default);
e && e.CloseFuzhuxian && e.CloseFuzhuxian();
};
i.prototype.checkWin = function() {
if (this.num_current_snake <= 0) {
this.bool_isStop = !0;
s.default.getInstance().emit(h.gameEvent.gameWin);
var t = Math.floor(this.data_levelinfo.XSize / 2), i = Math.floor(this.data_levelinfo.YSize / 2), n = .6000000000000001 + .05 * (Math.max(t, i) + 5);
this.pauseBarrage();
if (this.enableTopBottomFadeAnimation) {
cc.tween(this.layer_bottom).to(.5, {
opacity: 0
}).start();
cc.tween(this.layer_top).to(.5, {
opacity: 0
}).start();
}
var a = this;
a._pendingSettleData = null;
var o = !1, r = !1, l = !1, u = null, d = function() {
return {
settleData: a._pendingSettleData || {},
isLevelPassed: !0,
winLevel: _.default.getInstance().level
};
}, p = function() {
if (l && o && u && u.isValid) try {
var t = arrowSettleRewardView, i = t && t.default ? t.default : t, n = u.getComponent(i);
n && n.setEntryData && n.setEntryData(d());
var r = a.getNewbieGuideFlow();
r && a.isNewbieGuideStep(r.STEP_SETTLE_LEVEL1) && a.isNewbieSettleReward(a._pendingSettleData) && (a.newbieGuidePendingLevelPassSettleClose = !0);
console.log("[ArrowLevel] checkWin: 回填结算弹窗 switch_reward=" + (a._pendingSettleData && a._pendingSettleData.switch_reward || 0));
} catch (e) {
console.warn("[ArrowLevel] checkWin: 回填结算弹窗失败", e);
}
}, g = function() {
if (!l && o && r) {
l = !0;
var e = a.getNewbieGuideFlow();
a.newbieGuidePendingLevelPassSettleClose = !!(e && a.isNewbieGuideStep(e.STEP_SETTLE_LEVEL1) && a.isNewbieSettleReward(a._pendingSettleData));
c.default.getInstance().show(f.default.arrowSettleRewardView, d()).then(function(e) {
u = e;
p();
});
}
}, m = Number(this._eliminateCounter || 0);
console.log("[ArrowLevel] checkWin: 通关 level=" + this.num_rellyLevel + " 触发通关结算 eliminate_count=" + m);
this._settleArrowReward(!0, m, function(e) {
a._pendingSettleData = e && e.data || {};
o = !0;
g();
p();
});
this.scheduleOnce(function() {
r = !0;
g();
}, n);
this.scheduleOnce(function() {
if (!l) {
console.warn("[ArrowLevel] checkWin: 结算回包超时，使用已有数据兜底展示弹窗");
o = !0;
r = !0;
g();
}
}, n + 2);
}
};
i.prototype.SliderValueChanged = function(e) {
var t = this.num_normalScale + e.progress, i = t / this.node_game.scale;
this.node_game.x = this.node_game.x * i;
this.node_game.y = this.node_game.y * i;
this.node_game.scale = t;
this.sp_slderbg.node.width = 358 * this.slider.progress + 52;
this.closeGuide2();
};
i.prototype._shouldSkipRewardVideoForDebug = function(e) {
if ("提示" !== e && "辅助线" !== e) return !1;
if (cc && cc.sys && cc.sys.isNative && cc.sys.os !== cc.sys.OS_ANDROID && cc.sys.os !== cc.sys.OS_IOS) return !0;
try {
return "1" === (cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem("arrow_debug_skip_reward_video") : "");
} catch (e) {
return !1;
}
};
i.prototype.playRewardVideoByAdManager = function(e, t, i, n) {
var a = this;
if (this._shouldSkipRewardVideoForDebug(e)) {
console.log("[gameView] playRewardVideoByAdManager: debug skip ad_type=" + e);
t && t();
} else {
var o = g && g.default && g.default.getInstance ? g.default.getInstance() : null;
if (o && "function" == typeof o.playNormalVideoAd) {
n && (this.bool_cantouchAd = !1);
this.bool_isStop = !0;
var r = function(e) {
a.bool_isStop = !1;
n && (a.bool_cantouchAd = !0);
e ? t && t() : i && i();
};
try {
o.playNormalVideoAd({
ad_type: e || "reward_video",
force_video: !1
}, function(e) {
var t = !e || void 0 === e.compensationQualifyMark || !!e.compensationQualifyMark;
r(t);
}, function() {
r(!1);
}, "激励视频播放失败,请重试");
} catch (e) {
console.error("[gameView] playNormalVideoAd failed", e);
r(!1);
}
} else t && t();
}
};
i.prototype.OnClickTips = function() {
var e = this;
console.log("[hint_prop] OnClickTips: num_tipscards=" + _.default.getInstance().num_tipscards);
if (_.default.getInstance().num_tipscards > 0) {
e.node_game.scale = e.num_normalScale;
e._consumeProp(1, function() {
e._hintUsedCount = (e._hintUsedCount || 0) + 1;
console.log("[ArrowStats] 使用提示 hint_used=" + e._hintUsedCount);
s.default.getInstance().emit(h.gameEvent.gameAdTips);
});
} else {
console.log("[hint_prop] OnClickTips: no prop, play ad");
this.playRewardVideoByAdManager("提示", function() {
e._claimPropVideoReward(2, function() {
e.initTishiBtnstate();
console.log("[hint_prop] OnClickTips: ad reward claimed, wait next click to consume prop");
});
});
}
};
i.prototype.OnClickChange = function() {
this.bool_isStop = !0;
c.default.getInstance().show(f.default.cashArrowSettingView);
};
i.prototype.OnClickYichu = function() {
this.bool_cantouchAd && this.playRewardVideoByAdManager("移除", function() {
s.default.getInstance().emit(h.gameEvent.gameAdYichu);
}, null, !0);
};
i.prototype.OnClickFuzhuline = function() {
var e = this, t = _.default.getInstance();
console.log("[guideline_prop] OnClickFuzhuline: hasFuzhuline=" + this.bool_hasFuzhuline + " guideline_count=" + t.guideline_prop_count + " remain=" + this.num_fuzhulineRemainClear);
if (this.bool_hasFuzhuline) {
console.log("[guideline_prop] OnClickFuzhuline: already active, toggle");
s.default.getInstance().emit(h.gameEvent.gameAdFuzhuxian);
} else if (_.default.getInstance().guideline_prop_count > 0) {
console.log("[guideline_prop] OnClickFuzhuline: consume prop");
e._consumeProp(2, function() {
e.bool_hasFuzhuline = !0;
e.num_fuzhulineRemainClear = e.num_fuzhulineClearLimit;
e.initFuzhuBtnstate();
s.default.getInstance().emit(h.gameEvent.gameAdFuzhuxian);
});
} else {
console.log("[guideline_prop] OnClickFuzhuline: no prop, play ad");
this.playRewardVideoByAdManager("辅助线", function() {
e._claimPropVideoReward(3, function() {
e.initFuzhuBtnstate();
console.log("[guideline_prop] OnClickFuzhuline: ad reward claimed, wait next click to consume prop");
});
});
}
};
i.prototype.showRestart = function() {
var e = this;
this.bool_isRestart = !0;
this._resetAttemptBehaviorStats();
this.node_game.destroy();
c.default.getInstance().showWatingUI();
var t = this.bool_hasFuzhuline, i = this.num_fuzhulineRemainClear, n = _.default.getInstance().level;
m.default.reportData("level_node", {
level: n,
restart: 1
});
m.default.reportData("user_action", {
action: "restart_game",
module: "level_" + n,
is_ad: 0
});
r.default.getInstance().loadLevelData("level_" + this.num_rellyLevel, !1).then(function() {
if (e.isViewAlive()) {
e.data_levelinfo = r.default.getInstance().getLevelById(e.num_rellyLevel);
e._eliminateCounter = 0;
e._totalEliminated = 0;
var n = e.data_levelinfo && e.data_levelinfo.Arrows ? e.data_levelinfo.Arrows.length : "加载失败";
console.log("[LevelVerify] showRestart 加载完成: level_" + e.num_rellyLevel + ".json | 本地实际箭头数=" + n);
console.log("[ArrowLevel] showRestart: 重新开始 level=" + e.num_rellyLevel + " 计数器重置 big_reward_trigger=" + e._getBigRewardTriggerCount());
e.ShowGame();
e.num_fuzhulineRemainClear = t ? Math.max(0, i) : 0;
e.initFuzhuBtnstate();
console.log("当前状态:", t, "remain:", e.num_fuzhulineRemainClear);
}
});
};
i.prototype.showNext = function() {
var e = this;
this.node_game.destroy();
c.default.getInstance().showWatingUI();
this.num_rellyLevel = this.getRellyLevel();
this._resetLevelBehaviorStats();
var t = T.default.arrow_level;
console.log("[LevelVerify] showNext: 即将加载 level_" + this.num_rellyLevel + ".json | 显示第" + (t && t.arrow_level_id || "?") + "关 | level_index=" + (t && t.level_index || "未配置"));
r.default.getInstance().loadLevelData("level_" + this.num_rellyLevel, !1).then(function() {
if (e.isViewAlive()) {
e.data_levelinfo = r.default.getInstance().getLevelById(e.num_rellyLevel);
e._eliminateCounter = 0;
e._totalEliminated = 0;
var t = e.data_levelinfo && e.data_levelinfo.Arrows ? e.data_levelinfo.Arrows.length : "加载失败";
console.log("[LevelVerify] showNext 加载完成: level_" + e.num_rellyLevel + ".json | 本地实际箭头数=" + t + " | 服务器 arrow_count=" + (T.default.arrow_level.arrow_count || "?") + (String(t) !== String(T.default.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配" : " ✅ 匹配"));
console.log("[ArrowLevel] showNext: 关卡加载完成 level=" + e.num_rellyLevel + " big_reward_trigger=" + e._getBigRewardTriggerCount());
e.ShowGame();
}
});
};
i.prototype.showFuhuo = function() {
this.bool_isStop = !1;
this.num_life = T.default.arrow_level.life_count || 3;
this._reviveCount = (this._reviveCount || 0) + 1;
console.log("[ArrowStats] 复活 revive_count=" + this._reviveCount);
this.refreshLifeHearts();
};
i.prototype.OnClickSet = function() {
var t = this;
c.default.getInstance().show(f.default.arrowTaskPopupView).then(function(i) {
if (t.isViewAlive() && i && i.isValid) {
var n = arrowTaskPopupView, a = n.default || n, o = i.getComponent(a);
o || (o = i.addComponent(a));
}
});
};
i.prototype.closeAdState = function() {
this.bool_cantouchAd = !0;
};
i.prototype.fontAni = function() {};
i.prototype.showGuide = function() {
var e = this.getNewbieGuideFlow(), t = e && e.isDone && e.isDone(), i = T.default.arrow_level && Number(T.default.arrow_level.arrow_level_id || 0);
1 == _.default.getInstance().level && i <= 1 && !t ? this.setGuideNodeActive("guide_level1", !0) : 2 == _.default.getInstance().level && (this._level2ZoomGuideDismissed ? this.setGuideNodeActive("guide_level2", !1) : this.setGuideNodeActive("guide_level2", !0));
};
i.prototype.closeGuide = function() {
this.setGuideNodeActive("guide_level2", !1);
};
i.prototype.closeGuide2 = function() {
this._level2ZoomGuideDismissed = !0;
this.setGuideNodeActive("guide_level2", !1);
};
i.prototype.clsoeSetHandle = function() {
this.bool_isStop = !1;
this.refreshNewbieGuideState();
};
i.prototype._cacheSpriteFrames = function() {
(this.node_tishi || null === this.node_tishi) && this.ensureRuntimeNodeRefs();
var e = this.node_tishi && this.node_tishi.getChildByNamvb;
if (e) {
var t = e.getComponent(cc.Sprite);
t && t.spriteFrame && (this._sfVb = t.spriteFrame);
}
var i = this;
l.default.getInstance().loadRes("texture/gameing/off", cc.SpriteFrame, this, "game").then(function(e) {
e && (i._sfOff = e);
});
};
i.prototype._applyFuzhuSprite = function(e) {
if (this.node_fuzhuad) {
var t = this.node_fuzhuad.getComponent(cc.Sprite), i = _.default.getInstance().guideline_prop_count || 0;
if (t) {
var n = e || i > 0 ? this._sfVb : this._sfOff;
n && (t.spriteFrame = n);
}
this.node_fuzhuad.active = !0;
if (this.node_fuzhustate) {
this.node_fuzhustate.active = e;
var a = this.node_fuzhustate.getComponent(cc.Sprite);
a && (a.enabled = !e);
}
}
};
i.prototype.initFuzhuBtnstate = function() {
var e = this;
if (this.node_fuzhuad) if (this._sfOff) {
var t = this.node_fuzhuad, i = t.getComponent(cc.Sprite), n = _.default.getInstance().guideline_prop_count || 0, a = t.getChildByNamtxt_fuzhunum;
if (!a) {
var o = (a = new cc.Nodtxt_fuzhunum).addComponent(cc.Label);
o.fontSize = 18;
o.lineHeight = 20;
a.setPosition(0, 0);
t.addChild(a);
}
var r = a.getComponent(cc.Label);
t.active = !0;
if (n > 0) {
i && this._sfVb && (i.spriteFrame = this._sfVb);
r && (r.string = n.toString());
a.active = !0;
a.color = cc.color(255, 255, 255);
} else {
i && this._sfOff && (i.spriteFrame = this._sfOff);
r && (r.string = "");
a.active = !1;
}
this.node_fuzhustate && (this.node_fuzhustate.active = !1);
} else l.default.getInstance().loadRes("texture/gameing/off", cc.SpriteFrame, this, "game").then(function(t) {
if (t) {
e._sfOff = t;
e.initFuzhuBtnstate();
}
});
};
i.prototype.initTishiBtnstate = function() {
this.node_tishi && this.node_tishi.isValid || (this.node_tishi = cc.find("bottom/btn_tip", this.node) || cc.find("btn_tip", this.node));
if (this.node_tishi) {
var e = this.node_tishi.getChildByNamtipscardBG, t = this.node_tishi.getChildByNamvb;
if (e && t) {
var i = e.getChildByNamtxt_tipscardnum, n = i && i.getComponent(cc.Label);
if (n) {
t.active = !0;
var a = t.getComponent(cc.Sprite), o = e.getComponent(cc.Sprite);
if (_.default.getInstance().num_tipscards > 0) {
e.active = !0;
o && (o.enabled = !1);
n.string = _.default.getInstance().num_tipscards.toString();
i.color = cc.color(255, 255, 255);
a && this._sfVb && (a.spriteFrame = this._sfVb);
} else {
e.active = !1;
a && this._sfOff && (a.spriteFrame = this._sfOff);
}
} else console.warn("[tips] txt_tipscardnum label missing");
} else console.warn("[tips] tipscardBG or vb missing");
} else console.warn("[tips] node_tishi not found");
};
i.prototype.update = function(e) {
if (this.isCountdownEnabled() && !this.bool_isStop && this.bool_countdownStarted) {
this.dsj += e;
this.dsj > 1 && (this.dsj = 0, this.num_gametime -= 1, this.txt_time.string = u.default.formatSeconds(this.num_gametime), 
this.num_gametime <= 0 && (this.bool_isStop = !0, this.num_gametime = 0, this.txt_time.string = u.default.formatSeconds(this.num_gametime), 
c.default.getInstance().show(f.default.cashArrowFailView)));
}
};
i.prototype.ShowError = function() {
var e = this;
this.bool_isStop && (this.bool_isStop = !1);
this.node_red.active = !0;
this.node_red.opacity = 0;
cc.tween(this.node_red).to(.2, {
opacity: 255
}).to(.2, {
opacity: 0
}).union().repeat(2).call(function() {
e.node_red.active = !1;
}).start();
};
i.prototype.changeFuzhuBtnState = function() {
this.initFuzhuBtnstate();
};
i.prototype.addMouseWheelSupport = function() {
this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
};
i.prototype.onMouseWheel = function(e) {
var t = e.getScrollY();
console.log("滚轮滚动增量:", t);
var i = 1 + (t > 0 ? .1 : -.1), n = this.node_game.scale * i, a = this.node_game.getComponent(S.default).num_minScale, o = this.node_game.getComponent(S.default).num_minScale + 1, r = Math.min(Math.max(n, a), o), l = r / this.node_game.scale;
this.node_game.x = this.node_game.x * l;
this.node_game.y = this.node_game.y * l;
if (r !== this.node_game.scale) {
this.node_game.scale = r;
s.default.getInstance().emit(h.gameEvent.gameScaleChange, {
scale: this.node_game.scale
});
}
e.stopPropagation();
};
i.prototype.jumpLevel = function() {
var e = this;
this.node_game.destroy();
c.default.getInstance().showWatingUI();
this.num_rellyLevel = this.getRellyLevel();
this._resetLevelBehaviorStats();
var t = T.default.arrow_level;
console.log("[LevelVerify] jumpLevel: 即将加载 level_" + this.num_rellyLevel + ".json | 显示第" + (t && t.arrow_level_id || "?") + "关 | level_index=" + (t && t.level_index || "未配置"));
r.default.getInstance().loadLevelData("level_" + this.num_rellyLevel, !1).then(function() {
if (e.isViewAlive()) {
e.data_levelinfo = r.default.getInstance().getLevelById(e.num_rellyLevel);
e._eliminateCounter = 0;
e._totalEliminated = 0;
var t = e.data_levelinfo && e.data_levelinfo.Arrows ? e.data_levelinfo.Arrows.length : "加载失败";
console.log("[LevelVerify] jumpLevel 加载完成: level_" + e.num_rellyLevel + ".json | 本地实际箭头数=" + t + " | 服务器 arrow_count=" + (T.default.arrow_level.arrow_count || "?") + (String(t) !== String(T.default.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配" : " ✅ 匹配"));
console.log("[ArrowLevel] jumpLevel: 关卡加载完成 level=" + e.num_rellyLevel + " 计数器重置 big_reward_trigger=" + e._getBigRewardTriggerCount());
e.ShowGame();
}
});
};
i.prototype.onDestroy = function() {
this.EventRemove();
this.stopTopBarrageRows();
this.node_balanceContainer && this.node_balanceContainer.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
this.node_withdrawBtn && this.node_withdrawBtn.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
this.unscheduleAllCallbacks();
this.node && cc.Tween.stopAllByTarget(this.node);
this.layer_top && cc.Tween.stopAllByTarget(this.layer_top);
this.layer_bottom && cc.Tween.stopAllByTarget(this.layer_bottom);
this.img_life && this.img_life.node && cc.Tween.stopAllByTarget(this.img_life.node);
this.node_red && cc.Tween.stopAllByTarget(this.node_red);
this.node_diaozhuan && cc.Tween.stopAllByTarget(this.node_diaozhuan);
this.node_yichu && cc.Tween.stopAllByTarget(this.node_yichu);
};
i.prototype.showStartAni = function() {
if (this.enableTopBottomFadeAnimation) {
this.layer_top.opacity = 0;
this.layer_bottom.opacity = 0;
cc.tween(this.layer_bottom).delay(.5).to(1, {
opacity: 255
}).start();
cc.tween(this.layer_top).delay(.5).to(1, {
opacity: 255
}).start();
}
};
i.prototype._getBigRewardTriggerCount = function() {
var e = T.default.arrow_level || {}, t = Number(e.big_reward_trigger || 0);
return t > 0 ? t : 0;
};
i.prototype._resetLevelBehaviorStats = function() {
this._mistakeCount = 0;
this._retryCount = 0;
this._hintUsedCount = 0;
this._reviveCount = 0;
this._levelStartTs = Date.now();
console.log("[ArrowStats] 新关卡，重置行为统计 level=" + this.num_rellyLevel);
};
i.prototype._resetAttemptBehaviorStats = function() {
this._retryCount = (this._retryCount || 0) + 1;
this._mistakeCount = 0;
this._reviveCount = 0;
this._hintUsedCount = 0;
this._levelStartTs = Date.now();
console.log("[ArrowStats] 重开本关，retry_count=" + this._retryCount);
};
i.prototype._buildBehaviorStatsFields = function() {
var e = T.default.arrow_level || {}, t = e.arrow_level_id, i = e.level_index || this.num_rellyLevel || 0, n = Number(this._mistakeCount || 0), a = Number(this._reviveCount || 0), o = this._levelStartTs ? Math.max(0, Math.round((Date.now() - this._levelStartTs) / 1e3)) : 0;
return {
arrow_level_id: t || this.num_rellyLevel,
level_index: Number(i) || 0,
arrow_count: Number(e.arrow_count || 0),
mistake_count: n,
life_used: n,
retry_count: Number(this._retryCount || 0),
hint_used: Number(this._hintUsedCount || 0),
revive_count: a,
duration_sec: o
};
};
i.prototype._reportLevelFail = function() {
var e = this._buildBehaviorStatsFields();
e.level_passed = 0;
e.settle_type = "FAIL";
e.level_fail = 1;
e.clean_win = 0;
try {
m.default.reportData("arrow_settle_behavior", e);
} catch (e) {
console.warn("[ArrowStats] [埋点] arrow_settle_behavior(FAIL) 上报失败", e);
}
console.log("[ArrowLevel] [失败上报] arrowRewardSettle req=" + JSON.stringify(e));
N.default.arrowRewardSettle(e, I.default.create(null, function(e) {
console.log("[ArrowLevel] [失败上报] 返回: " + JSON.stringify(e && e.data || null));
}), I.default.create(null, function(e) {
console.warn("[ArrowLevel] [失败上报] 请求失败", e);
}));
};
i.prototype._settleArrowReward = function(e, t, i) {
var n = 0, a = i;
"function" == typeof t ? a = t : n = Number(t || 0);
var o = this, r = T.default, s = this._buildBehaviorStatsFields();
if (e) {
s.level_passed = 1;
var l = n > 0 ? n : Number(this._eliminateCounter || 0);
l > 0 && (s.eliminate_count = l);
} else {
s.level_passed = 0;
var c = n > 0 ? n : this._getBigRewardTriggerCount();
c <= 0 && (c = Number(r.arrow_level && r.arrow_level.arrow_count || 0));
s.eliminate_count = c;
}
var u = e ? "PASS" : "ELIMINATE";
s.settle_type = u;
s.clean_win = e && 0 === s.life_used && 0 === s.revive_count ? 1 : 0;
try {
m.default.reportData("arrow_settle_behavior", {
settle_type: s.settle_type,
arrow_level_id: s.arrow_level_id,
level_index: s.level_index,
arrow_count: s.arrow_count,
level_passed: s.level_passed,
eliminate_count: s.eliminate_count || 0,
clean_win: s.clean_win,
mistake_count: s.mistake_count,
life_used: s.life_used,
retry_count: s.retry_count,
hint_used: s.hint_used,
revive_count: s.revive_count,
duration_sec: s.duration_sec
});
console.log("[ArrowStats] [埋点] arrow_settle_behavior=" + JSON.stringify(s));
} catch (e) {
console.warn("[ArrowStats] [埋点] arrow_settle_behavior 上报失败", e);
}
var d = P.default || P, h = function() {
o._settleArrowReward.call(o, e, t, i);
};
console.log("[ArrowLevel] _settleArrowReward: 发起结算 type=" + u + " req=" + JSON.stringify(s));
console.log("[ArrowLevel] [结算接口][请求] arrowRewardSettle type=" + u + " req=" + JSON.stringify(s));
N.default.arrowRewardSettle(s, I.default.create(null, function(t) {
if (d && d.shouldPop(t)) {
console.warn("[ArrowLevel] _settleArrowReward force-retry code=" + (t && t.code));
d.showAndRetry(h);
} else {
console.log("[ArrowLevel] [结算接口][返回] arrowRewardSettle type=" + u + " req=" + JSON.stringify(s) + " res=" + JSON.stringify(t && t.data || null));
if (t && t.data) {
var i = t.data.arrow_level && Number(t.data.arrow_level.arrow_level_id || 0);
if (void 0 !== t.data.cash_balance) {
r.cash_balance = Number(t.data.cash_balance);
o.updateTopBalance(Number(t.data.cash_balance));
o.refreshTopBalanceUI();
}
if (e && t.data.arrow_level && i > 0) {
r.updateArrowLevel(t.data.arrow_level);
var n = null != t.data.arrow_level.level_index ? t.data.arrow_level.level_index : t.data.arrow_level.arrow_level_index;
console.log("[LevelVerify] 结算成功，服务端下发下一关: level_id=" + i + " level_index=" + (n || "未配置") + " arrow_count=" + (t.data.arrow_level.arrow_count || "?") + (n ? " → 下一关将加载 level_" + n + ".json" : " ⚠️ 无 level_index，将用 level_id=" + i + " 作为文件索引（旧兼容）"));
o._refreshArrowLevelLabel();
} else t.data.arrow_level && i <= 0 && console.warn("[ArrowLevel] _settleArrowReward: 忽略无效 arrow_level 数据 " + JSON.stringify(t.data.arrow_level));
console.log("[ArrowLevel] _settleArrowReward: 结算成功 switch_reward=" + (t.data.switch_reward || 0) + " cash_balance=" + (t.data.cash_balance || 0) + " show_force_video=" + (t.data.show_force_video || !1) + " next_arrow_level_id=" + (i > 0 ? i : "N/A"));
}
a && a(t);
e && o._refreshUserInfoAfterLevelPass();
}
}), I.default.create(null, function(t) {
console.warn("[ArrowLevel] [结算接口][返回] arrowRewardSettle type=" + u + " FAIL req=" + JSON.stringify(s) + " err=" + JSON.stringify(t));
console.warn("[ArrowLevel] _settleArrowReward: 结算请求失败 err=" + JSON.stringify(t));
var i = t && t.message ? String(t.message) : "", n = e && (i.indexOf("重复通关") >= 0 || i.toLowerCase().indexOf("duplicate") >= 0);
if (!n && d && d.shouldPop(t)) {
console.warn("[ArrowLevel] _settleArrowReward 网络异常，弹重试窗");
d.showAndRetry(h);
} else {
if (n) {
var l = Number(_.default.getInstance().level || 1), c = T.default.arrow_level && Number(T.default.arrow_level.arrow_level_id || 0), p = Math.max(l, (c || o.num_rellyLevel || 0) + 1);
try {
var f = r.arrow_level || {}, g = {};
for (var m in f) g[m] = f[m];
g.arrow_level_id = p;
g.level_index = p;
r.updateArrowLevel ? r.updateArrowLevel(g) : r.arrow_level = g;
console.warn("[ArrowLevel] _settleArrowReward: 命中重复通关兜底，强制推进 arrow_level_id=" + p + " level_index=" + p);
} catch (e) {
console.warn("[ArrowLevel] _settleArrowReward: 重复通关兜底失败", e);
}
}
a && a(null);
}
}));
};
i.prototype._refreshUserInfoAfterLevelPass = function() {
try {
var e = R && R.default ? R.default : R;
if (!e || "function" != typeof e.getInstance) return;
var t = e.getInstance();
t && "function" == typeof t.fetch && t.fetch();
} catch (e) {
console.warn("[ArrowLevel] _refreshUserInfoAfterLevelPass error", e);
}
};
i.prototype.getRellyLevel2 = function() {
return _.default.getInstance().level > r.default.getInstance().getAll(p.GametimeConfig).length ? d.default.range(19, r.default.getInstance().getAll(p.GametimeConfig).length) : _.default.getInstance().level;
};
i.prototype.getRellyLevel = function() {
var e = T.default.arrow_level;
console.log("[LevelVerify] getRellyLevel 入参 arrow_level=" + JSON.stringify({
arrow_level_id: e && e.arrow_level_id,
level_index: e && e.level_index,
arrow_count: e && e.arrow_count
}));
var t = e && e.level_index;
if (t && t > 0) {
console.log("[LevelVerify] getRellyLevel → 使用 level_index=" + t + " (显示第" + (e.arrow_level_id || "?") + "关，加载 level_" + t + ".json)");
return t;
}
var i = e && e.arrow_level_id;
if (i && i > 0) {
console.warn("[LevelVerify] getRellyLevel → level_index 未配置，降级使用 arrow_level_id=" + i + " 加载 level_" + i + ".json（旧兼容模式）");
return i;
}
var n = r.default.getInstance().getAll(p.GametimeConfig).length;
console.log(n);
if (_.default.getInstance().level > n) {
for (var a, o = _.default.getInstance().recentRandomLevels || [], s = [], l = 19; l <= n; l++) o.includes(l) || s.push(l);
a = d.default.range(19, n);
o.unshift(a);
o.length > 7 && o.pop();
_.default.getInstance().recentRandomLevels = o;
console.log("[ArrowLevel] getRellyLevel: 服务端无配置，使用随机关卡=" + (a || 25));
return a || 25;
}
console.log("[ArrowLevel] getRellyLevel: 服务端无配置，使用本地 level=" + _.default.getInstance().level);
return _.default.getInstance().level;
};
i.prototype.preload = function() {
cc.assetManager.loadBundle(h.bundleName.ui, function(e, t) {
if (e) console.error("UI资源包加载失败:", e); else {
t.preloadDir("audio", function(e, t) {
e ? console.error("音频资源预加载失败:", e) : console.log("成功预加载 " + t.length + " 个音频资源");
});
t.preloadDir("prefab", function(e, t) {
e ? console.error("预制体资源预加载失败:", e) : console.log("成功预加载 " + t.length + " 个预制体资源");
});
t.preloadDir("spine", function(e, t) {
e ? console.error("Spine资源预加载失败:", e) : console.log("成功预加载 " + t.length + " 个Spine资源");
});
t.preloadDir("texture", function(e, t) {
e ? console.error("纹理资源预加载失败:", e) : console.log("成功预加载 " + t.length + " 个纹理资源");
});
}
});
};
i.prototype.showHard = function() {
var e = this;
o.default.getInstance().playEffect("audio/difficulty_warning", h.bundleName.game);
this.node_hardsp.active = !0;
this.node_red.active = !0;
this.node_red.opacity = 0;
cc.tween(this.node_red).to(.2, {
opacity: 255
}).to(.2, {
opacity: 0
}).union().repeat(8).call(function() {
e.node_red.active = !1;
}).start();
this.scheduleOnce(function() {
e.node_hardsp.active = !1;
}, 3);
};
i.prototype.onGuideClick = function() {
var e = this.getNewbieGuideFlow();
e && this.isNewbieGuideStep(e.STEP_TOP_BALANCE) ? this.openWithMoodView() : console.log("[Guide] clicked>>>>>>>>>>>>");
};
a([ L ], i.prototype, "showTime", void 0);
a([ L(cc.Node) ], i.prototype, "node_tishi", void 0);
a([ L(cc.Node) ], i.prototype, "node_checksize", void 0);
a([ L(cc.Node) ], i.prototype, "node_mask", void 0);
a([ L(cc.Node) ], i.prototype, "layer_top", void 0);
a([ L(cc.Node) ], i.prototype, "layer_mid", void 0);
a([ L(cc.Node) ], i.prototype, "layer_bottom", void 0);
a([ L(cc.Sprite) ], i.prototype, "img_life", void 0);
a([ L(cc.Label) ], i.prototype, "txt_levelnum", void 0);
a([ L(cc.Label) ], i.prototype, "txt_time", void 0);
a([ L(cc.Label) ], i.prototype, "txt_lastnum", void 0);
a([ L(cc.Node) ], i.prototype, "node_blue", void 0);
a([ L(cc.Node) ], i.prototype, "node_red", void 0);
a([ L(cc.Node) ], i.prototype, "node_yichu", void 0);
a([ L(cc.Node) ], i.prototype, "node_diaozhuan", void 0);
a([ L(cc.Slider) ], i.prototype, "slider", void 0);
a([ L(cc.Sprite) ], i.prototype, "sp_slderbg", void 0);
a([ L(cc.Node) ], i.prototype, "node_fuzhuad", void 0);
a([ L(cc.Node) ], i.prototype, "node_fuzhustate", void 0);
a([ L(cc.Node) ], i.prototype, "node_hardsp", void 0);
a([ L(cc.Node) ], i.prototype, "node_topBalanceNav", void 0);
a([ L(cc.Node) ], i.prototype, "node_balanceContainer", void 0);
a([ L(cc.Node) ], i.prototype, "node_withdrawBtn", void 0);
a([ L(cc.Node) ], i.prototype, "node_bubbleContainer", void 0);
a([ L(cc.Label) ], i.prototype, "lbl_balanceText", void 0);
a([ L(cc.RichText) ], i.prototype, "rich_bubbleText", void 0);
a([ L(cc.Node) ], i.prototype, "node_bigBarragePanel", void 0);
a([ L(cc.RichText) ], i.prototype, "rich_bigBarrageText", void 0);
return a([ M, D("业务逻辑/gameView") ], i);
}(cc.Component);
export default  x;
