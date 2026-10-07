import { UIParams } from "./UIParams";
import ArrowRewardService from "./ArrowRewardService";
import AudioMgr from "./AudioMgr";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import CountryAssetService from "./CountryAssetService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr, { bundleName, gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const ArrowSettleRewardView = cc.Class({
extends: cc.Component,
properties: {
skeletonDataRed: {
default: null,
type: sp.SkeletonData,
tooltip: " 印尼(ID) 及兜底使用的 Skeleton ： _res/ main/ Skeleton/ red/ red.json "
},
skeletonDataGreen: {
default: null,
type: sp.SkeletonData,
tooltip: " 美国(US) 使用的 Skeleton ： _res/ main/ Skeleton/ green/ green.json "
},
skeletonDataYellow: {
default: null,
type: sp.SkeletonData,
tooltip: " JP/ AR/ PE/ CO 使用的 Skeleton ： _res/ main/ Skeleton/ yellow/ yellow.json "
},
skeletonDataBlue: {
default: null,
type: sp.SkeletonData,
tooltip: " BR/ PH/ MX/ VN/ MY 使用的 Skeleton ： _res/ main/ Skeleton/ blue/ blue.json "
}
},
onLoad: function() {
this.entryData = null;
this.settleData = {};
this.popupMode = f;
this.isLevelPassed = !0;
this.winLevel = 1;
this.onCloseCb = null;
this.onTaskClaimCb = null;
this.showForceVideo = !1;
this.isNewReward = !1;
this.taskType = " ";
this.taskId = " ";
this.doubleRewardAmount = 0;
this.levelSwitchRewardAmount = 0;
this.taskShowAmount = 0;
this.taskRewardAmount = 0;
this.isClaiming = !1;
this.claimGuardTimer = null;
this.isReady = !1;
this._settleCloseEventEmitted = !1;
this._lastClickTime = 0;
this._levelPassReported = !1;
this._buttonLockUntil = 0;
this._buttonLockTimer = null;
this.bindNodes();
this.bindEvents();
GlobalEventMgr.getInstance().emit(gameEvent.settleRewardOpen);
},
start: function() {
var e = UIParams.parse(this.node, 0, null) || {};
this.entryData && 0 !== Object.keys(this.entryData).length || (this.entryData = e);
this.applyEntryData();
this.applySkeletonByCountry();
this.playEnterAnim();
this.isReady = !0;
},
onDestroy: function() {
this.clearClaimGuardTimer();
this.clearButtonLockTimer();
this.unbindEvents();
this.emitSettleRewardCloseOnce();
},
setEntryData: function(e) {
this.entryData = e || {};
this.isReady && this.applyEntryData();
},
bindNodes: function() {
this.nodeContent = this.findChildByNameDeep(this.node, " content ");
var e = this.findChildByNameDeep(this.node, " animation ");
this.skeletonComp = e ? e.getComponent(sp.Skeleton) : null;
this.lblAmount = this.findLabelByName(" txt_amount ");
this.lblClaim = this.findLabelByName(" lbl_claim ");
this.lblClaimX2 = this.findLabelByName(" lbl_claimx2 ");
this.lblNextLevel = this.findLabelByName(" lbl_next_level ");
this.lblTitle = this.findLabelByName(" title ");
this.titleSpriteNode = this.findChildByNameDeep(this.node, " title_successful ");
this.btnClaimNode = this.findChildByNameDeep(this.node, " btn_claim ");
this.btnClaim = this.btnClaimNode && this.btnClaimNode.getComponent(cc.Button);
this.btnClaimX2Node = this.findChildByNameDeep(this.node, " btn_claimx2 ");
this.btnClaimX2 = this.btnClaimX2Node && this.btnClaimX2Node.getComponent(cc.Button);
this.btnNextNode = this.findChildByNameDeep(this.node, " btn_next_level ");
this.btnNext = this.btnNextNode && this.btnNextNode.getComponent(cc.Button);
this.defaultClaimText = this.lblClaim ? this.lblClaim.string : " 领取奖励 ";
this.defaultClaimX2Text = this.lblClaimX2 ? this.lblClaimX2.string : " CLAIMx2 ";
this.defaultNextLevelText = this.lblNextLevel ? this.lblNextLevel.string : " Next Level ";
this.defaultTitleSpriteVisible = !this.titleSpriteNode || this.titleSpriteNode.active;
},
bindEvents: function() {
if (this.btnClaimNode) {
this.btnClaimNode.on(cc.Node.EventType.TOUCH_END, this.onClickClaim, this);
this.btnClaimNode.on(" click ", this.onClickClaim, this);
}
if (this.btnClaimX2Node) {
this.btnClaimX2Node.on(cc.Node.EventType.TOUCH_END, this.onClickClaimX2, this);
this.btnClaimX2Node.on(" click ", this.onClickClaimX2, this);
}
if (this.btnNextNode) {
this.btnNextNode.on(cc.Node.EventType.TOUCH_END, this.onClickNextLevel, this);
this.btnNextNode.on(" click ", this.onClickNextLevel, this);
}
console.log(_ + " bindEvents done claimBtn = " + !!this.btnClaimX2Node + " nextBtn = " + !!this.btnNextNode);
},
unbindEvents: function() {
if (this.btnClaimNode) {
this.btnClaimNode.off(cc.Node.EventType.TOUCH_END, this.onClickClaim, this);
this.btnClaimNode.off(" click ", this.onClickClaim, this);
}
if (this.btnClaimX2Node) {
this.btnClaimX2Node.off(cc.Node.EventType.TOUCH_END, this.onClickClaimX2, this);
this.btnClaimX2Node.off(" click ", this.onClickClaimX2, this);
}
if (this.btnNextNode) {
this.btnNextNode.off(cc.Node.EventType.TOUCH_END, this.onClickNextLevel, this);
this.btnNextNode.off(" click ", this.onClickNextLevel, this);
}
},
applyEntryData: function() {
var e = this.entryData || {};
this.settleData = e.settleData || {};
this.popupMode = " task " === e.popupMode ? " task " : f;
this.isLevelPassed = " task " !== this.popupMode && !1 !== e.isLevelPassed;
this.winLevel = e.winLevel > 0 ? e.winLevel : UserData.getInstance().level;
this.onCloseCb = " function " == typeof e.onClose ? e.onClose : null;
this.onTaskClaimCb = " function " == typeof e.onTaskClaim ? e.onTaskClaim : null;
this.showForceVideo = void 0 !== e.showForceVideo ? !!e.showForceVideo : !(!this.settleData || !this.settleData.show_force_video);
var t = e.isNew;
void 0 === t && (t = e.is_new);
void 0 === t && this.settleData && (t = this.settleData.is_new);
var i, n = " string " == typeof t ? t.trim().toLowerCase() : t;
this.isNewReward = this.popupMode === f && (!0 === t || " true " === n || " 1 " === n || 1 === Number(t || 0));
this.taskType = (i = e.taskType || e.task_type || this.settleData && this.settleData.task_type,
" ltv " === String(i || " ").toLowerCase() ? " ltv " : " ");
this.taskId = String(e.taskId || e.task_id || this.settleData && this.settleData.task_id || " ");
this.levelSwitchRewardAmount = this.safeNum(e.switchReward, this.safeNum(e.switch_reward, this.safeNum(this.settleData && this.settleData.switch_reward, 0)));
this.doubleRewardAmount = this.safeNum(e.doubleReward, this.safeNum(e.double_reward, this.safeNum(this.settleData && this.settleData.double_reward, this.levelSwitchRewardAmount)));
this.popupMode === f && this.doubleRewardAmount <= 0 && this.levelSwitchRewardAmount > 0 && (this.doubleRewardAmount = this.levelSwitchRewardAmount);
this.taskShowAmount = this.safeNum(e.showAmount, this.safeNum(this.settleData && this.settleData.switch_reward, 0));
this.taskRewardAmount = this.safeNum(e.taskReward, this.safeNum(this.settleData && this.settleData.task_reward, this.taskShowAmount));
this.updateAmountLabel();
this.refreshStaticTexts();
this.refreshButtonVisibility();
this.refreshButtonsEnabled();
if (!this._levelPassReported && this.popupMode === f && this.isLevelPassed) {
this._levelPassReported = !0;
try {
BusinessAnalyticsService.reportData(" lvNode ", {
level: this.winLevel,
win: 1
});
} catch (e) {}
}
console.log(_ + " applyEntryData mode = " + this.popupMode + " isLevelPassed = " + this.isLevelPassed + " isNewReward = " + this.isNewReward + " showForceVideo = " + this.showForceVideo + " taskType = " + this.taskType + " taskId = " + this.taskId);
},
updateAmountLabel: function() {
if (this.lblAmount) {
var e = " task " === this.popupMode ? this.taskShowAmount : this.doubleRewardAmount;
this.lblAmount.string = "+ " + this.formatMoney(e);
}
},
refreshStaticTexts: function() {
var e = " task " === this.popupMode;
this.titleSpriteNode && (this.titleSpriteNode.active = !1);
if (this.lblTitle) {
var t = this.getTitleI18nConfig();
this.lblTitle.node.active = !0;
this.lblTitle.string = this.i18n(t.key, [], t.fallback);
}
this.lblClaim && (this.lblClaim.string = this.i18n(" key_arrow_reward_claim ", [], this.defaultClaimText || " Claim reward "));
this.lblClaimX2 && (this.lblClaimX2.string = this.i18n(" key_task_reward_claim_x2 ", [], this.defaultClaimX2Text || " Watch Ad to Claim "));
this.lblNextLevel && (this.lblNextLevel.string = e ? this.i18n(" key_task_reward_only_claim ", [ this.formatMoney(this.taskRewardAmount) ], " Claim only " + this.formatMoney(this.taskRewardAmount)) : this.i18n(" key_result_only_claim ", [ this.formatMoney(this.levelSwitchRewardAmount) ], " Claim only " + this.formatMoney(this.levelSwitchRewardAmount)));
},
getTitleI18nConfig: function() {
return " task " === this.popupMode ? {
key: " key_task_reward_popup_title ",
fallback: " Task Reward "
} : this.isLevelPassed ? {
key: " key_arrow_settle_title_success ",
fallback: " Success "
} : {
key: " key_arrow_settle_title_congrats ",
fallback: " Congratulations "
};
},
isClickThrottled: function() {
var e = Date.now();
if (e - this._lastClickTime < 500) return !0;
this._lastClickTime = e;
return !1;
},
isButtonLocked: function() {
return this._buttonLockUntil > 0 && Date.now() < this._buttonLockUntil;
},
lockButtonsFor: function(e) {
var t = this, i = Math.max(0, Number(e) || 0);
this._buttonLockUntil = Date.now() + i;
this.clearButtonLockTimer();
this._buttonLockTimer = setTimeout(function() {
t._buttonLockTimer = null;
t._buttonLockUntil = 0;
}, i);
},
clearButtonLockTimer: function() {
if (this._buttonLockTimer) {
clearTimeout(this._buttonLockTimer);
this._buttonLockTimer = null;
}
},
onClickClaim: function() {
if (!this.isButtonLocked() && !this.isClickThrottled()) {
this.lockButtonsFor(500);
var e = !!this.showForceVideo;
if (this.beginClaim(" claim ", !e)) {
var t = this, i = {
showForceVideo: this.showForceVideo,
businessType: " arrow "
};
console.log(_ + " 点击 Claim mode = " + this.popupMode + " isNewReward = " + this.isNewReward + " showForceVideo = " + this.showForceVideo);
console.log(_ + "[过关接口][请求] claimNormal(Claim) ctx = " + JSON.stringify(i));
e && p(this.popupMode, this.isLevelPassed, !0);
ArrowRewardService.claimNormal(i, function(e, n) {
t.endClaim();
console.log(_ + "[过关接口][返回] claimNormal(Claim) success = " + !!e + " req = " + JSON.stringify(i) + " res = " + JSON.stringify(n || {}));
if (e) {
t.emitRewardClaimed(n, t.levelSwitchRewardAmount);
t.finishAndClose();
} else {
console.warn(_ + " Claim 失败 ， 跳过奖励继续流程并关闭弹窗 ");
t.finishAndClose();
}
});
}
}
},
onClickClaimX2: function() {
if (!this.isButtonLocked() && !this.isClickThrottled()) {
this.lockButtonsFor(500);
if (this.beginClaim(" claim_x2 ", !1)) {
var e = this;
if (" task " === this.popupMode) {
try {
BusinessAnalyticsService.reportData(" ad_show ", {
scene: " task ",
level: UserData.getInstance().level
});
} catch (e) {}
if (this.onTaskClaimCb) {
this.handleTaskClaim(!0);
return;
}
}
var t = " task " === this.popupMode ? {
businessType: " task ",
taskType: this.taskType,
taskId: this.taskId
} : {
businessType: " arrow "
};
this.popupMode === f && (t.fallbackOnAdFail = !1);
console.log(_ + " 点击 CLAIMx2 mode = " + this.popupMode);
console.log(_ + "[过关接口][请求] claimDouble(CLAIMx2) ctx = " + JSON.stringify(t));
p(this.popupMode, this.isLevelPassed, !1);
ArrowRewardService.claimDouble(t, function(i, n) {
e.endClaim();
console.log(_ + "[过关接口][返回] claimDouble(CLAIMx2) success = " + !!i + " req = " + JSON.stringify(t) + " res = " + JSON.stringify(n || {}));
if (i) {
e.emitRewardClaimed(n, e.doubleRewardAmount);
e.finishAndClose();
} else console.warn(_ + " CLAIMx2 失败 ， 不关闭弹窗 ");
});
}
}
},
onClickNextLevel: function() {
if (!this.isButtonLocked() && !this.isClickThrottled()) {
this.lockButtonsFor(500);
var e = !(" task " === this.popupMode && this.onTaskClaimCb || !this.showForceVideo);
if (this.beginClaim(" next_level ", !e)) {
var t = this;
if (" task " === this.popupMode && this.onTaskClaimCb) this.handleTaskClaim(!1); else {
var i = " task " === this.popupMode ? {
showForceVideo: this.showForceVideo,
businessType: " task ",
taskType: this.taskType,
taskId: this.taskId
} : {
showForceVideo: this.showForceVideo,
businessType: " arrow "
};
console.log(_ + " 点击 Next Level mode = " + this.popupMode + " showForceVideo = " + this.showForceVideo);
console.log(_ + "[过关接口][请求] claimNormal(NextLevel) ctx = " + JSON.stringify(i));
e && p(this.popupMode, this.isLevelPassed, !0);
ArrowRewardService.claimNormal(i, function(e, n) {
t.endClaim();
console.log(_ + "[过关接口][返回] claimNormal(NextLevel) success = " + !!e + " req = " + JSON.stringify(i) + " res = " + JSON.stringify(n || {}));
if (e) {
t.emitRewardClaimed(n, t.levelSwitchRewardAmount);
t.finishAndClose();
} else {
console.warn(_ + " Next Level 失败 ， 跳过奖励继续流程并关闭弹窗 ");
t.finishAndClose();
}
});
}
}
}
},
handleTaskClaim: function(e) {
var t = this, i = {
isDouble: !!e,
businessType: " task ",
taskType: this.taskType,
taskId: this.taskId,
claimAmount: e ? this.taskShowAmount : this.taskRewardAmount
}, n = !1, a = function(e) {
if (!n) {
n = !0;
t.endClaim();
!1 !== e ? t.finishAndClose() : console.warn(_ + " handleTaskClaim 失败 ， 不关闭弹窗 ");
}
};
try {
if (this.onTaskClaimCb.length >= 2) {
this.onTaskClaimCb(i, a);
return;
}
var o = this.onTaskClaimCb(i);
if (o && " function " == typeof o.then) {
o.then(function(e) {
a(!1 !== e);
}).catch(function() {
a(!1);
});
return;
}
a(!1 !== o);
} catch (e) {
console.warn(_ + " handleTaskClaim 异常 ", e);
a(!1);
}
},
beginClaim: function(e, t) {
if (this.isClaiming) return !1;
this.isClaiming = !0;
this.refreshButtonsEnabled();
!1 !== t ? this.setClaimGuardTimer(e) : this.clearClaimGuardTimer();
return !0;
},
endClaim: function() {
this.isClaiming = !1;
this.clearClaimGuardTimer();
this.refreshButtonsEnabled();
},
setClaimGuardTimer: function(e) {
var t = this;
this.clearClaimGuardTimer();
this.claimGuardTimer = setTimeout(function() {
t.claimGuardTimer = null;
if (t.isValid && t.isClaiming) {
console.warn(_ + " 领取超时自动解锁 from = " + e);
t.endClaim();
}
}, 15e3);
},
clearClaimGuardTimer: function() {
if (this.claimGuardTimer) {
clearTimeout(this.claimGuardTimer);
this.claimGuardTimer = null;
}
},
refreshButtonsEnabled: function() {
var e = !this.isClaiming;
this.btnClaim && (this.btnClaim.interactable = e);
this.btnClaimX2 && (this.btnClaimX2.interactable = e);
this.btnNext && (this.btnNext.interactable = e);
},
refreshButtonVisibility: function() {
var e = this.popupMode === f && this.isNewReward;
this.btnClaimNode && (this.btnClaimNode.active = e);
this.btnClaimX2Node && (this.btnClaimX2Node.active = !e);
this.btnNextNode && (this.btnNextNode.active = !e);
},
emitRewardClaimed: function(e, t) {
if (this.popupMode === f) {
var i = this.resolveClaimRewardAmount(e, t);
if (null === i || i <= 0) {
var n = this.safeNum(this.settleData && this.settleData.switch_reward, 0);
n <= 0 && (n = this.safeNum(this.settleData && this.settleData.double_reward, 0));
if (n > 0) {
console.log(_ + " emitRewardClaimed: 使用 settleData 兜底 switch_reward = " + n);
i = n;
}
}
if (null === i || i <= 0) console.warn(_ + " emitRewardClaimed: rewardAmount 无效 resData = " + JSON.stringify(e || {}) + " fallbackAmount = " + t); else {
console.log(_ + " emitRewardClaimed: reward_amount = " + i + " fallback = " + t);
GlobalEventMgr.getInstance().emit(gameEvent.arrowRewardClaimed, {
reward_amount: i
});
}
}
},
resolveClaimRewardAmount: function(e, t) {
for (var i = e || {}, n = [ " cash_reward ", " reward_amount ", " ad_reward_amount ", " reward ", " claim_reward ", " task_reward ", " switch_reward ", " double_reward " ], a = 0; a < n.length; a++) {
var o = this.parseRewardValue(i[n[a]]);
if (null !== o && o > 0) return o;
}
var r = this.parseRewardValue(t);
return null !== r && r > 0 ? r : null;
},
parseRewardValue: function(e) {
if (null == e) return null;
var t = e;
if (" string " == typeof t && !(t = t.replace(/,/g, " ").trim()).length) return null;
var i = Number(t);
return isFinite(i) ? Math.max(0, Math.floor(i)) : null;
},
applySkeletonByCountry: function() {
if (this.skeletonComp && this.skeletonComp.isValid) {
var e = CountryAssetService.getCurrentCountry ? CountryAssetService.getCurrentCountry() : " ", t = g[e] || " red ", i = {
red: this.skeletonDataRed,
green: this.skeletonDataGreen,
yellow: this.skeletonDataYellow,
blue: this.skeletonDataBlue
}[t] || this.skeletonDataRed;
if (i) {
this.skeletonComp.skeletonData = i;
this.skeletonComp.setAnimation(0, " 1 ", !0);
console.log(_ + " applySkeletonByCountry country = " + e + " skeleton = " + t);
} else console.warn(_ + " applySkeletonByCountry: skeletonData[" + t + "] 未赋值 ， 请在预制体编辑器中绑定 ");
}
},
playEnterAnim: function() {
if (this.nodeContent) {
this.nodeContent.stopAllActions();
this.nodeContent.opacity = 0;
this.nodeContent.y = 90;
this.isLevelPassed ? AudioMgr.getInstance().playEffect(" audio/ level_complete ", bundleName.ui) : AudioMgr.getInstance().playEffect(" audio/ coin_collect ", bundleName.game);
cc.tween(this.nodeContent).to(.3, {
y: 0,
opacity: 255
}, {
easing: " backOut "
}).start();
}
},
finishAndClose: function() {
var e = this, t = this.winLevel + 1;
console.log(_ + " finishAndClose mode = " + this.popupMode + " isLevelPassed = " + this.isLevelPassed);
cc.tween(this.node).to(.2, {
opacity: 0
}).call(function() {
if (e.popupMode === f && e.isLevelPassed) {
UserData.getInstance().level = t;
GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
} else if (" function " == typeof e.onCloseCb) try {
e.onCloseCb();
} catch (e) {}
e.emitSettleRewardCloseOnce();
UIMgr.getInstance().hide(e.node);
}).start();
},
emitSettleRewardCloseOnce: function() {
if (!this._settleCloseEventEmitted) {
this._settleCloseEventEmitted = !0;
GlobalEventMgr.getInstance().emit(gameEvent.settleRewardClose);
}
},
findLabelByName: function(e) {
var t = this.findChildByNameDeep(this.node, e);
return t && t.getComponent(cc.Label) || null;
},
findChildByNameDeep: function(e, t) {
if (!e || !t) return null;
if (e.name === t) return e;
for (var i = 0; i < e.childrenCount; i++) {
var n = this.findChildByNameDeep(e.children[i], t);
if (n) return n;
}
return null;
},
safeNum: function(e, t) {
var i = e;
" string " == typeof i && (i = i.replace(/,/g, " ").trim());
var n = Number(i);
return isNaN(n) ? t : Math.max(0, Math.floor(n));
},
formatMoney: function(e) {
return LanguageService.formatCurrency(Math.max(0, Math.floor(e || 0)));
},
i18n: function(e, t, i) {
return LanguageService.t(e, t || [], i);
}
});

export default ArrowSettleRewardView;
