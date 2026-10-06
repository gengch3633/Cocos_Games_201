// @ts-nocheck
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import * as LanguageService from "./LanguageService";
import AudioMgr from "./AudioMgr";
import GEMgr from "./GEMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import MultiPlatform from "./MultiPlatform";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import UIParams from "./UIParams";
import UserData from "./UserData";

var n = __extends, a = __awaiter, o = __generator, r = __decorate;
var s = AudioMgr, l = GlobalEventMgr, c = (MultiPlatform, Tips), u = UIMgr, d = GEMgr, h = InterfaceMgr, p = UIParams, _ = UserData, f = LanguageService, g = BusinessAnalyticsService, m = cc._decorator, y = m.ccclass, v = m.property, b = m.menu, w = function(e) {
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.sp_result = null;
t.node_nextani = null;
t.txt_curlevel = null;
t.txt_nextlevel = null;
t.entryData = null;
t.passRewardData = null;
t.isLoadingPass = !1;
t.isClaiming = !1;
t.hasClaimed = !1;
t.winLevel = 1;
t.btnMain = null;
t.btnOnly = null;
t.lblOnly = null;
t.lblReward = null;
t.lblMain = null;
t.lblTitle = null;
t.nodeAdIcon = null;
t.nodeRewardCard = null;
t.nodeMoneyIcon = null;
return t;
}
n(t, e);
t.prototype.start = function() {
this.entryData = p.UIParams.parse(this.node, 0, null) || this.entryData || {};
this.entryData.level > 0 && (this.winLevel = this.entryData.level);
this.winLevel = this.entryData.level > 0 ? this.entryData.level : _.default.getInstance().level;
this.showAni();
this.bindDynamicNodes();
this.applySuccessStyle();
this.refreshRewardTexts({
baseReward: 500,
adReward: 1e3,
forceWatchAd: !1
});
d.default.trackEvent("lvNode", {
level: this.winLevel,
win: 1
});
cc.sys.isBrowser || d.default.ge.track("userAction", {
action: "游戏胜利",
module: "关卡" + this.winLevel,
isAD: 0
}, new Date());
this.loadPassReward();
};
t.prototype.setEntryData = function(e) {
this.entryData = e || {};
this.entryData.level > 0 && (this.winLevel = this.entryData.level);
this.loadPassReward();
};
t.prototype.OnClickNext = function() {
this.onClickMainClaim();
};
t.prototype.OnClickShare = function() {
this.onClickOnlyClaim();
};
t.prototype.onClickMainClaim = function() {
return a(this, void 0, Promise, function() {
return o(this, function(e) {
switch (e.label) {
case 0:
if (this.isClaiming || this.hasClaimed) return [ 2 ];
this.isClaiming = !0;
this.refreshButtonsState();
try {
var t = this.passRewardData && this.passRewardData.forceWatchAd ? "pass_force" : "pass_active";
g.default.reportData("ad_show", {
scene: t,
level: this.winLevel
});
} catch (e) {}
e.label = 1;

case 1:
e.trys.push([ 1, 4, 5, 6 ]);
return [ 4, this.simulateWatchAd() ];

case 2:
if (!e.sent()) {
c.default.show(this.i18n("key_result_tip_watch_full"));
return [ 2 ];
}
return [ 4, this.onClaimSuccess() ];

case 3:
e.sent();
return [ 3, 6 ];

case 4:
e.sent();
c.default.show(this.i18n("key_result_tip_ad_error"));
return [ 3, 6 ];

case 5:
this.isClaiming = !1;
this.refreshButtonsState();
return [ 7 ];

case 6:
return [ 2 ];
}
});
});
};
t.prototype.onClickOnlyClaim = function() {
return a(this, void 0, Promise, function() {
return o(this, function(e) {
switch (e.label) {
case 0:
return this.isClaiming || this.hasClaimed ? [ 2 ] : [ 2, this.claimOnlyReward() ];
}
});
});
};
t.prototype.claimOnlyReward = function() {
return a(this, void 0, Promise, function() {
return o(this, function(e) {
switch (e.label) {
case 0:
this.isClaiming = !0;
this.refreshButtonsState();
e.label = 1;

case 1:
e.trys.push([ 1, 3, 4, 5 ]);
return [ 4, this.onClaimSuccess() ];

case 2:
e.sent();
return [ 3, 5 ];

case 3:
e.sent();
c.default.show(this.i18n("key_result_tip_claim_error"));
return [ 3, 5 ];

case 4:
this.isClaiming = !1;
this.refreshButtonsState();
return [ 7 ];

case 5:
return [ 2 ];
}
});
});
};
t.prototype.simulateWatchAd = function() {
return a(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, new Promise(function(e) {
u.default.getInstance().showWatingUI();
setTimeout(function() {
u.default.getInstance().hideWatingUI();
c.default.show(this.i18n("key_result_tip_ad_done"));
e(!0);
}, 900);
}) ];
});
});
};
t.prototype.loadPassReward = function() {
return a(this, void 0, Promise, function() {
var e;
return o(this, function(t) {
switch (t.label) {
case 0:
if (this.isLoadingPass || this.hasClaimed) return [ 2 ];
this.isLoadingPass = !0;
this.refreshButtonsState();
t.label = 1;

case 1:
t.trys.push([ 1, 4, 5, 6 ]);
return [ 4, this.requestPassReward() ];

case 2:
e = t.sent();
this.passRewardData = this.normalizePassRewardData(e);
return [ 4, this.refreshRewardTexts(this.passRewardData) ];

case 3:
t.sent();
return [ 3, 6 ];

case 4:
t.sent();
this.passRewardData = this.normalizePassRewardData(null);
this.refreshRewardTexts(this.passRewardData);
c.default.show(this.i18n("key_result_tip_reward_load_fail"));
return [ 3, 6 ];

case 5:
this.isLoadingPass = !1;
this.refreshButtonsState();
return [ 7 ];

case 6:
return [ 2 ];
}
});
});
};
t.prototype.requestPassReward = function() {
return a(this, void 0, Promise, function() {
var e, t;
return o(this, function(i) {
switch (i.label) {
case 0:
e = this.entryData || {};
t = {
level: this.winLevel
};
return "function" != typeof e.requestPassReward ? [ 3, 2 ] : [ 4, e.requestPassReward(t) ];

case 1:
return [ 2, i.sent() ];

case 2:
return [ 2, {
reward_amount: this.safeNum(e.mockRewardAmount, 500),
ad_reward_amount: this.safeNum(e.mockAdRewardAmount, 1e3),
force_watch_ad: !!e.mockForceWatchAd,
settlement_id: e.mockSettlementId || ""
} ];
}
});
});
};
t.prototype.requestWatchAdReward = function() {
return a(this, void 0, Promise, function() {
var e, t, i, n;
return o(this, function(a) {
switch (a.label) {
case 0:
e = this.entryData || {};
t = this.passRewardData || {};
i = {
level: this.winLevel,
settlement_id: t.settlementId || "",
reward_amount: t.adReward || 0
};
return "function" != typeof e.requestWatchAdReward ? [ 3, 2 ] : [ 4, e.requestWatchAdReward(i) ];

case 1:
return [ 2, !!(n = a.sent()) || void 0 === n ];

case 2:
return [ 2, !0 ];
}
});
});
};
t.prototype.requestClaimReward = function() {
return a(this, void 0, Promise, function() {
var e, t, i, n;
return o(this, function(a) {
switch (a.label) {
case 0:
e = this.entryData || {};
t = this.passRewardData || {};
i = {
level: this.winLevel,
settlement_id: t.settlementId || "",
reward_amount: t.baseReward || 0
};
return "function" != typeof e.requestClaimReward ? [ 3, 2 ] : [ 4, e.requestClaimReward(i) ];

case 1:
return [ 2, !!(n = a.sent()) || void 0 === n ];

case 2:
return [ 2, !0 ];
}
});
});
};
t.prototype.onClaimSuccess = function() {
return a(this, void 0, Promise, function() {
return o(this, function() {
if (this.hasClaimed) return [ 2 ];
this.hasClaimed = !0;
_.default.getInstance().level = this.winLevel + 1;
this.ShowNextAni();
return [ 2 ];
});
});
};
t.prototype.normalizePassRewardData = function(e) {
var t = this.unwrapData(e), i = this.safeNum(this.pickField(t, [ "reward_amount", "reward", "base_reward", "amount" ]), 500), n = this.safeNum(this.pickField(t, [ "ad_reward_amount", "ad_reward", "video_reward", "double_reward" ]), 2 * i), a = !!this.pickField(t, [ "force_watch_ad", "force_ad", "must_watch_ad" ]);
return {
settlementId: this.pickField(t, [ "settlement_id", "pass_id", "reward_id" ]) || "",
baseReward: i,
adReward: Math.max(i, n),
forceWatchAd: a
};
};
t.prototype.unwrapData = function(e) {
for (var t = e, i = 0; t && "object" == typeof t && i < 4 && void 0 !== t.data; ) {
t = t.data;
i++;
}
return t || {};
};
t.prototype.pickField = function(e, t) {
if (e) for (var i = 0; i < t.length; i++) {
var n = t[i];
if (void 0 !== e[n]) return e[n];
}
};
t.prototype.safeNum = function(e, t) {
var i = Number(e);
return isNaN(i) ? t : Math.max(0, Math.floor(i));
};
t.prototype.bindDynamicNodes = function() {
var e = this.node.getChildByNambg;
if (e) {
this.btnMain = e.getChildByNambtn_nextlevel;
this.btnOnly = e.getChildByNambtn_share;
this.nodeRewardCard = e.getChildByNamreward_card;
var t = e.getChildByNamtitle;
this.lblTitle = t ? t.getComponent(cc.Label) : null;
this.lblTitle && (this.lblTitle.string = this.i18n("key_result_title_congrats"));
if (!this.nodeRewardCard) {
this.nodeRewardCard = new cc.Nodreward_card;
this.nodeRewardCard.parent = e;
this.nodeRewardCard.setPosition(0, 45);
this.nodeRewardCard.setContentSize(260, 290);
this.nodeRewardCard.addComponent(cc.Sprite);
}
this.nodeMoneyIcon = this.nodeRewardCard.getChildByNammoney_icon;
if (!this.nodeMoneyIcon) {
this.nodeMoneyIcon = new cc.Nodmoney_icon;
this.nodeMoneyIcon.parent = this.nodeRewardCard;
this.nodeMoneyIcon.setPosition(0, 40);
this.nodeMoneyIcon.addComponent(cc.Sprite);
}
var i = this.nodeRewardCard.getChildByNamreward_amount;
if (i) this.lblReward = i.getComponent(cc.Label) || i.addComponent(cc.Label); else {
(i = new cc.Nodreward_amount).parent = this.nodeRewardCard;
i.setPosition(0, -78);
this.lblReward = i.addComponent(cc.Label);
this.lblReward.fontSize = 52;
this.lblReward.lineHeight = 58;
this.lblReward.enableBold = !0;
}
if (this.btnMain) {
var n = this.btnMain.getChildByNamlbl_main;
if (!n) {
(n = new cc.Nodlbl_main).parent = this.btnMain;
n.setPosition(50, 0);
}
this.lblMain = n.getComponent(cc.Label) || n.addComponent(cc.Label);
this.lblMain.string = this.i18n("key_result_main_claim");
this.lblMain.fontSize = 36;
this.lblMain.lineHeight = 40;
this.lblMain.enableBold = !0;
this.lblMain.node.color = new cc.Color(172, 65, 58);
this.nodeAdIcon = this.btnMain.getChildByNamad_icon;
if (!this.nodeAdIcon) {
this.nodeAdIcon = new cc.Nodad_icon;
this.nodeAdIcon.parent = this.btnMain;
this.nodeAdIcon.setPosition(-150, 0);
this.nodeAdIcon.addComponent(cc.Sprite);
}
}
if (this.btnOnly) {
var a = this.btnOnly.getComponent(cc.Sprite);
a && (a.enabled = !1);
var o = this.btnOnly.getChildByNamlbl_only_claim;
o || ((o = new cc.Nodlbl_only_claim).parent = this.btnOnly);
o.setPosition(0, 0);
this.lblOnly = o.getComponent(cc.Label) || o.addComponent(cc.Label);
this.lblOnly.fontSize = 28;
this.lblOnly.lineHeight = 32;
this.lblOnly.string = "";
this.lblOnly.node.color = new cc.Color(238, 226, 205);
}
}
};
t.prototype.applySuccessStyle = function() {
var e = this.node.getChildByNambg;
if (e) {
var t = e.getComponent(cc.Sprite);
t && cc.assetManager.getBundle(h.bundleName.ui, function(e, i) {
!e && i && i.load("texture/success/success_bg", cc.SpriteFrame, function(e, i) {
!e && i && t && t.isValid && (t.spriteFrame = i);
});
});
var i = e.getChildByNamnextlevel;
i && (i.active = !1);
if (this.btnMain) {
var n = this.btnMain.getComponent(cc.Sprite);
n && cc.assetManager.getBundle(h.bundleName.ui, function(e, t) {
!e && t && t.load("texture/success/dialog_get_btn", cc.SpriteFrame, function(e, t) {
!e && t && n && n.isValid && (n.spriteFrame = t);
});
});
this.nodeAdIcon && cc.assetManager.getBundle(h.bundleName.ui, function(e, t) {
!e && t && t.load("texture/success/dialog_ad_icon", cc.SpriteFrame, function(e, t) {
var i;
!e && t && (null === (i = this.nodeAdIcon) || void 0 === i ? void 0 : i.isValid) && (this.nodeAdIcon.getComponent(cc.Sprite).spriteFrame = t);
}.bind(this));
}.bind(this));
}
if (this.nodeRewardCard) {
var a = this.nodeRewardCard.getComponent(cc.Sprite);
a && cc.assetManager.getBundle(h.bundleName.ui, function(e, t) {
!e && t && t.load("texture/success/dialog_money_bg", cc.SpriteFrame, function(e, t) {
!e && t && a && a.isValid && (a.spriteFrame = t);
});
});
}
}
};
t.prototype.refreshRewardTexts = function(e) {
if (this.lblReward) {
this.lblReward.string = this.i18n("key_result_reward_prefix", [ this.getCurrencyText("RP", e.adReward || 0) ]);
this.lblReward.node.color = new cc.Color(241, 221, 141);
}
if (this.lblOnly) {
var t = this.i18n("key_result_only_claim", [ this.getCurrencyText("RP", e.baseReward || 0) ]);
e.forceWatchAd && (t += this.i18n("key_result_watch_ad_suffix"));
this.lblOnly.string = t;
}
};
t.prototype.refreshButtonsState = function() {
var e = !this.isLoadingPass && !this.isClaiming && !this.hasClaimed;
if (this.btnMain) {
var t = this.btnMain.getComponent(cc.Button);
t && (t.interactable = e);
}
if (this.btnOnly) {
var i = this.btnOnly.getComponent(cc.Button);
i && (i.interactable = e);
}
};
t.prototype.formatMoney = function(e) {
return Math.max(0, Math.floor(e || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
t.prototype.getCurrencyText = function(e, t) {
var i = void 0 !== t ? t : e;
return f.formatCurrency(i);
};
t.prototype.i18n = function(e, t, i) {
return f.t(e, t, i);
};
t.prototype.showAni = function() {
var e = this, t = this.node.getChildByNambg;
if (t) {
t.y += 2e3;
t.opacity = 0;
cc.tween(t).by(.3, {
y: -2100
}).by(.3, {
y: 100
}, {
easing: "backOut"
}).union().delay(.1).call(function() {
s.default.getInstance().playEffect("audio/level_complete", h.bundleName.ui);
var i = t.getChildByNamlizi, n = t.getChildByNamlizi2;
i && (i.active = !0);
n && (n.active = !0);
if (e.sp_result && e.sp_result.node) {
e.sp_result.node.active = !0;
e.sp_result.setAnimation(0, "win", !1);
e.sp_result.addAnimation(0, "winidle", !0);
}
}).start();
cc.tween(t).delay(.15).to(.2, {
opacity: 255
}).start();
}
};
t.prototype.ShowNextAni = function() {
var e = this;
if (this.node_nextani && this.txt_curlevel && this.txt_nextlevel) {
this.node_nextani.active = !0;
this.txt_curlevel.string = this.winLevel + "";
this.txt_nextlevel.string = this.winLevel + 1 + "";
cc.tween(this.txt_curlevel.node).by(.5, {
opacity: -255,
y: -60
}).start();
cc.tween(this.txt_nextlevel.node).by(.5, {
opacity: 255,
y: -60
}).delay(1).call(function() {
l.default.getInstance().emit(h.gameEvent.gameNext);
u.default.getInstance().hide(e.node);
}).start();
} else {
l.default.getInstance().emit(h.gameEvent.gameNext);
u.default.getInstance().hide(this.node);
}
};
r([ v(sp.Skeleton) ], t.prototype, "sp_result", void 0);
r([ v(cc.Node) ], t.prototype, "node_nextani", void 0);
r([ v(cc.Label) ], t.prototype, "txt_curlevel", void 0);
r([ v(cc.Label) ], t.prototype, "txt_nextlevel", void 0);
return r([ y, b("业务逻辑/resultView") ], t);
}(cc.Component);
export default  w;
