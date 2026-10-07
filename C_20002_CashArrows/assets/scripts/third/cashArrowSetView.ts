import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr, { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";

const CashArrowSetView = cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this.selectedOpt = null;
this.channelData = null;
this.channelList = [];
this.selectedChannelIndex = 0;
this.channelInputCache = {};
this.channelCardNodes = [];
this.baseChannelCardNodes = [];
this.extraChannelCardNodes = [];
this.channelCardTemplateNode = null;
this.channelCardBaseSlots = [];
this.channelCardStartX = 0;
this.channelCardStartY = 0;
this.channelCardColumnGap = 320;
this.channelCardRowGap = 140;
this.channelCardColumnCount = 2;
this.channelSelectOverlayOffsetX = 0;
this.channelSelectOverlayOffsetY = 0;
this.channelCardImageVersion = 0;
this.channelCardRemoteFrameCache = {};
this.baseFieldRows = [];
this.extraFieldRows = [];
this.activeFieldRows = [];
this.currentFields = [];
this.initialBindInfo = null;
this.onValidated = null;
this.onClose = null;
this.isSubmitting = !1;
this.selectedChannelIconOffsetX = 0;
this.selectedChannelIconOffsetY = 0;
this.baseFieldRowCount = 0;
this._basePanelHeight = 0;
this._basePanelY = 0;
this._basePanelAnchorY = .5;
this._currentPanelShift = 0;
this._panelWidget = null;
this.baseLabelX = 0;
this.baseLabelY = 0;
this.baseInputX = 0;
this.baseInputY = 0;
this.baseBgX = 0;
this.baseBgY = 0;
this.rowGap = 153;
this.baseSubmitY = 0;
this.bindNodes();
this.bindEvents();
this.bindLanguageEvent();
},
onDestroy: function() {
this.unbindLanguageEvent();
this.unbindEvents();
this.clearExtraChannelCardNodes();
this.clearExtraFieldRows();
this.channelCardImageVersion += 1;
},
bindLanguageEvent: function() {
GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
},
unbindLanguageEvent: function() {
GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
},
onLanguageChanged: function() {
this.refreshUI();
},
setEntryData: function(e) {
if (e) {
this.selectedOpt = e.selectedOpt || null;
this.channelData = e.channelData || null;
this.initialBindInfo = e.initialBindInfo || null;
this.onValidated = " function " == typeof e.onValidated ? e.onValidated : null;
this.onClose = " function " == typeof e.onClose ? e.onClose : null;
this.parseChannelData();
this.seedInitialInputCache();
this.refreshUI();
}
},
parseChannelData: function() {
this.channelList = [];
for (var e = this.extractChannelList(this.channelData), t = 0; t < e.length; t++) {
var i = this.normalizeChannelItem(e[t]);
i && this.channelList.push(i);
}
this.channelList.length <= 0 && !this.channelData ? this.channelList = this.buildDefaultChannels() : this.channelList.length <= 0 && cc.warn("[cashArrowSetView] channel list is empty from api ");
this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex || 0, this.channelList.length - 1));
},
extractChannelList: function(e) {
if (!e) return [];
if (Array.isArray(e)) return e.filter(Boolean);
var t = e.channel_list || e.c_l || e.channels || e.list || [];
if (Array.isArray(t)) return t.filter(Boolean);
if (e.data) {
var i = e.data;
t = i.channel_list || i.c_l || i.channels || i.list || [];
if (Array.isArray(t)) return t.filter(Boolean);
}
return [];
},
normalizeChannelItem: function(e) {
if (!e) return null;
var t = e.channel_pic || e.channel_icon || e.icon || " ";
Array.isArray(t) && (t = t[0] || " ");
t = t ? String(t).trim() : " ";
var i = this.normalizeNeedFields(e);
return {
channel: e.channel || " ",
sub_channel: e.sub_channel || " ",
show_channel: e.show_channel || e.name || " ",
channel_pic: t,
tax_desc: e.tax_desc || " ",
account_type: e.account_type || " ",
need_field: i,
raw: e
};
},
normalizeNeedFields: function(e) {
var t = [], i = e.need_field;
if (Array.isArray(i) && i.length > 0) {
for (var n = 0; n < i.length; n++) {
var a = i[n] || {}, o = a.field_value || a.key || a.name || " ";
o && t.push({
field_value: o,
field_desc: a.field_desc || a.desc || a.label || o,
fail_desc: a.fail_desc || a.field_desc || a.desc || o,
field_value_translate: a.field_value_translate || a.field_desc || o
});
}
if (t.length > 0) return t;
}
var r = e.fields || e.required_fields || [];
if (Array.isArray(r) && r.length > 0) {
for (var s = 0; s < r.length; s++) {
var l = r[s];
l && t.push({
field_value: l,
field_desc: l,
fail_desc: l,
field_value_translate: l
});
}
if (t.length > 0) return t;
}
return this.getDefaultNeedFields(e);
},
getDefaultNeedFields: function(e) {
var t = e.account_label || this.i18n(" key_cash_set_input_account_placeholder ", null, " Please enter your withdrawal account "), i = e.name_label || this.i18n(" key_cash_set_input_username_placeholder ", null, " Please enter your withdrawal username ");
return [ {
field_value: " account ",
field_desc: t,
fail_desc: t,
field_value_translate: " account "
}, {
field_value: " payee_name ",
field_desc: i,
fail_desc: i,
field_value_translate: " name "
} ];
},
buildDefaultChannels: function() {
var e = this.i18n(" key_cash_set_input_account_placeholder ", null, " Please enter your withdrawal account "), t = this.i18n(" key_cash_set_input_username_placeholder ", null, " Please enter your withdrawal username ");
return [ {
channel: " dana ",
sub_channel: " dana ",
show_channel: " DANA ",
account_type: " phone ",
need_field: [ {
field_value: " account ",
field_desc: e,
fail_desc: e,
field_value_translate: " account "
}, {
field_value: " payee_name ",
field_desc: t,
fail_desc: t,
field_value_translate: " name "
} ]
}, {
channel: " ovo ",
sub_channel: " ovo ",
show_channel: " OVO ",
account_type: " phone ",
need_field: [ {
field_value: " account ",
field_desc: e,
fail_desc: e,
field_value_translate: " account "
}, {
field_value: " payee_name ",
field_desc: t,
fail_desc: t,
field_value_translate: " name "
} ]
}, {
channel: " shopee ",
sub_channel: " shopee ",
show_channel: " Shopee ",
account_type: " phone ",
need_field: [ {
field_value: " account ",
field_desc: e,
fail_desc: e,
field_value_translate: " account "
}, {
field_value: " payee_name ",
field_desc: t,
fail_desc: t,
field_value_translate: " name "
} ]
}, {
channel: " gopay ",
sub_channel: " gopay ",
show_channel: " gopay ",
account_type: " phone ",
need_field: [ {
field_value: " account ",
field_desc: e,
fail_desc: e,
field_value_translate: " account "
}, {
field_value: " payee_name ",
field_desc: t,
fail_desc: t,
field_value_translate: " name "
} ]
} ];
},
bindNodes: function() {
this.btnClose = this.findNodeDeep(this.node, " btn_close ");
this.btnSubmit = this.findNodeDeep(this.node, " btn_submit ");
this.panelNode = this.findNodeDeep(this.node, " block_panel ") || this.findNodeDeep(this.node, " panel ");
this.maskNode = this.findNodeDeep(this.node, " mask ");
this.lblTitle = this.findLabelDeep(this.node, " txt_enter_account_details ");
this.lblSelectInfo = this.findLabelDeep(this.node, " txt_select_account_info ");
this.lblInputAccount = this.findLabelDeep(this.node, " txt_input_account ");
this.inputAccountNode = this.findNodeDeep(this.node, " txt_account_value ");
this.lblInputUsername = this.findLabelDeep(this.node, " txt_input_username ");
this.inputUsernameNode = this.findNodeDeep(this.node, " txt_username_value ");
this.lblSubmitBtn = this.findLabelDeep(this.node, " txt_withdraw_btn ");
this.bgInputAccountNode = this.findNodeDeep(this.node, " img_input_account_bg ");
this.bgInputUsernameNode = this.findNodeDeep(this.node, " img_input_username_bg ");
this.editAccount = this.inputAccountNode ? this.inputAccountNode.getComponent(cc.EditBox) : null;
this.editUsername = this.inputUsernameNode ? this.inputUsernameNode.getComponent(cc.EditBox) : null;
this.channelSelectOverlay = this.findNodeDeep(this.node, " img_channel_select_overlay ");
this.channelSelectedIcon = this.findNodeDeep(this.node, " icon_channel_selected ");
this.baseChannelCardNodes = this.collectBaseChannelCardNodes();
this.channelCardNodes = this.baseChannelCardNodes.slice();
this.channelCardTemplateNode = this.baseChannelCardNodes[0] || null;
this.extraChannelCardNodes = [];
this.captureChannelCardLayoutInfo();
for (var e = 0; e < this.channelCardNodes.length; e++) this.cacheChannelCardDefaultSpriteFrame(this.channelCardNodes[e]);
this.channelSelectOverlay && (this.channelSelectOverlay.active = !1);
if (this.channelCardNodes.length > 0) {
if (this.channelSelectedIcon) {
this.selectedChannelIconOffsetX = this.channelSelectedIcon.x - this.channelCardNodes[0].x;
this.selectedChannelIconOffsetY = this.channelSelectedIcon.y - this.channelCardNodes[0].y;
}
if (this.channelSelectOverlay) {
this.channelSelectOverlayOffsetX = this.channelSelectOverlay.x - this.channelCardNodes[0].x;
this.channelSelectOverlayOffsetY = this.channelSelectOverlay.y - this.channelCardNodes[0].y;
}
}
this.baseSubmitY = this.btnSubmit ? this.btnSubmit.y : 0;
this._basePanelHeight = this.panelNode ? this.panelNode.height : 0;
this._basePanelY = this.panelNode ? this.panelNode.y : 0;
this._basePanelAnchorY = this.panelNode && null != this.panelNode.anchorY ? this.panelNode.anchorY : .5;
this._currentPanelShift = 0;
this.buildBaseFieldRows();
},
collectBaseChannelCardNodes: function() {
var e = [], t = this.panelNode || this.node;
if (t) for (var i = 0; i < t.childrenCount; i++) {
var n = t.children[i];
this.getChannelCardOrderIndex(n) >= 0 && e.push(n);
}
if (e.length <= 0) for (var a = [ " btn_channel_0 ", " btn_channel_1 ", " btn_channel_2 ", " btn_channel_3 " ], o = 0; o < a.length; o++) {
var r = this.findNodeDeep(this.node, a[o]);
r && e.push(r);
}
var s = this;
e.sort(function(e, t) {
return s.getChannelCardOrderIndex(e) - s.getChannelCardOrderIndex(t);
});
return e;
},
getChannelCardOrderIndex: function(e) {
if (!e || !e.name) return -1;
var t = /^btn_channel_(\d+)$/.exec(e.name);
return t ? parseInt(t[1], 10) : -1;
},
captureChannelCardLayoutInfo: function() {
this.channelCardBaseSlots = [];
var e = this.baseChannelCardNodes || [];
if (e.length <= 0) {
this.channelCardColumnCount = 1;
this.channelCardStartX = 0;
this.channelCardStartY = 0;
this.channelCardColumnGap = 320;
this.channelCardRowGap = 140;
} else {
for (var t = 0; t < e.length; t++) this.channelCardBaseSlots.push({
x: e[t].x,
y: e[t].y
});
var i = e[0], n = e.length > 1 ? e[1] : e[0], a = e.length > 2 ? e[2] : null;
this.channelCardColumnCount = 2;
this.channelCardStartX = Math.min(i.x, n.x);
this.channelCardStartY = Math.max(i.y, n.y);
this.channelCardColumnGap = Math.abs(n.x - i.x);
this.channelCardRowGap = a ? Math.abs(i.y - a.y) : i.height + 20;
this.channelCardColumnGap <= 1 && (this.channelCardColumnGap = i.width + 20);
this.channelCardRowGap <= 1 && (this.channelCardRowGap = i.height + 20);
}
},
getChannelCardSlot: function(e) {
if (e < this.channelCardBaseSlots.length) return this.channelCardBaseSlots[e];
var t = Math.max(1, this.channelCardColumnCount || 1), i = e % t, n = Math.floor(e / t);
return {
x: this.channelCardStartX + this.channelCardColumnGap * i,
y: this.channelCardStartY - this.channelCardRowGap * n
};
},
cacheChannelCardDefaultSpriteFrame: function(e) {
if (e) {
var t = e.getComponent(cc.Sprite);
t && !e._cashArrowDefaultSpriteFrame && (e._cashArrowDefaultSpriteFrame = t.spriteFrame || null);
}
},
restoreChannelCardDefaultSprite: function(e) {
if (e) {
var t = e.getComponent(cc.Sprite);
if (t) {
this.cacheChannelCardDefaultSpriteFrame(e);
e._cashArrowDefaultSpriteFrame && (t.spriteFrame = e._cashArrowDefaultSpriteFrame);
}
}
},
ensureChannelCardNodeCount: function(e) {
var t = Math.max(0, e || 0);
if (this.channelCardTemplateNode) for (var i = this.panelNode || this.node; this.channelCardNodes.length < t; ) {
var n = this.channelCardNodes.length, a = cc.instantiate(this.channelCardTemplateNode);
a.name = " btn_channel_dynamic_ " + n;
i.addChild(a);
this.cacheChannelCardDefaultSpriteFrame(a);
this.channelCardNodes.push(a);
this.extraChannelCardNodes.push(a);
}
},
clearExtraChannelCardNodes: function() {
for (;this.extraChannelCardNodes.length > 0; ) {
var e = this.extraChannelCardNodes.pop();
if (e) {
e.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
e.destroy();
}
}
this.channelCardNodes = this.baseChannelCardNodes ? this.baseChannelCardNodes.slice() : [];
},
bindChannelCardEvents: function() {
for (var e = 0; e < this.channelCardNodes.length; e++) {
var t = this.channelCardNodes[e];
if (t) {
t.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
t.on(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
}
}
},
unbindChannelCardEvents: function() {
for (var e = 0; e < this.channelCardNodes.length; e++) this.channelCardNodes[e] && this.channelCardNodes[e].off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
},
applyChannelCardImage: function(e, t, i) {
if (e) {
var n = e.getComponent(cc.Sprite);
if (n) {
this.restoreChannelCardDefaultSprite(e);
var a = t && t.channel_pic ? String(t.channel_pic).trim() : " ";
if (a) if (this.channelCardRemoteFrameCache[a]) n.spriteFrame = this.channelCardRemoteFrameCache[a]; else {
var o = this;
this.loadRemoteChannelCardSpriteFrame(a, function(t) {
if (t && i === o.channelCardImageVersion && e.isValid) {
var n = e.getComponent(cc.Sprite);
n && (n.spriteFrame = t);
}
});
}
}
}
},
loadRemoteChannelCardSpriteFrame: function(e, t) {
if (e) {
var i = this;
cc.assetManager.loadRemote(e, function(n, a) {
if (cc.isValid(i) && i.channelCardRemoteFrameCache) if (!n && a) {
var o = null;
a instanceof cc.SpriteFrame ? o = a : a instanceof cc.Texture2D ? o = new cc.SpriteFrame(a) : a._texture instanceof cc.Texture2D && (o = new cc.SpriteFrame(a._texture));
if (o) {
i.channelCardRemoteFrameCache[e] = o;
t && t(o);
} else t && t(null);
} else {
cc.warn("[cashArrowSetView] load channel_pic failed: ", e, n);
t && t(null);
}
});
} else t && t(null);
},
buildBaseFieldRows: function() {
this.baseFieldRows = [];
var e = this.setupFieldRowRefs({
labelNode: this.lblInputAccount ? this.lblInputAccount.node : null,
inputNode: this.inputAccountNode,
bgNode: this.bgInputAccountNode
}), t = this.setupFieldRowRefs({
labelNode: this.lblInputUsername ? this.lblInputUsername.node : null,
inputNode: this.inputUsernameNode,
bgNode: this.bgInputUsernameNode
});
e && this.baseFieldRows.push(e);
t && this.baseFieldRows.push(t);
this.baseFieldRowCount = this.baseFieldRows.length;
if (!(this.baseFieldRowCount <= 0)) {
this.baseLabelX = this.baseFieldRows[0].labelNode ? this.baseFieldRows[0].labelNode.x : 0;
this.baseLabelY = this.baseFieldRows[0].labelNode ? this.baseFieldRows[0].labelNode.y : 0;
this.baseInputX = this.baseFieldRows[0].inputNode ? this.baseFieldRows[0].inputNode.x : 0;
this.baseInputY = this.baseFieldRows[0].inputNode ? this.baseFieldRows[0].inputNode.y : 0;
this.baseBgX = this.baseFieldRows[0].bgNode ? this.baseFieldRows[0].bgNode.x : 0;
this.baseBgY = this.baseFieldRows[0].bgNode ? this.baseFieldRows[0].bgNode.y : this.baseInputY;
if (this.baseFieldRowCount >= 2 && this.baseFieldRows[1].labelNode && this.baseFieldRows[0].labelNode) {
var i = Math.abs(this.baseFieldRows[1].labelNode.y - this.baseFieldRows[0].labelNode.y);
i > 1 && (this.rowGap = i);
}
}
},
setupFieldRowRefs: function(e) {
if (!e || !e.labelNode || !e.inputNode) return null;
e.labelComp = e.labelNode.getComponent(cc.Label);
e.editBox = e.inputNode.getComponent(cc.EditBox);
e.inputLabel = e.inputNode.getComponent(cc.Label);
e.bgSprite = e.bgNode ? e.bgNode.getComponent(cc.Sprite) : null;
if (!e.editBox || !e.labelComp || !e.inputLabel) return null;
e.bgSprite && (e.editBox.background = e.bgSprite);
this.bindFieldRowInputEvents(e);
return e;
},
bindFieldRowInputEvents: function(e) {
if (e && e.bgNode && e.editBox) {
e.bgNode._cashArrowBoundEditBox = e.editBox;
e.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
e.bgNode.on(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
}
},
unbindFieldRowInputEvents: function(e) {
if (e && e.bgNode) {
e.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
e.bgNode._cashArrowBoundEditBox = null;
}
},
createFieldRowFromTemplate: function(e) {
var t = this.baseFieldRows[this.baseFieldRows.length - 1] || this.baseFieldRows[0];
if (!t) return null;
var i = this.panelNode || this.node, n = t.labelNode ? cc.instantiate(t.labelNode) : null, a = t.inputNode ? cc.instantiate(t.inputNode) : null, o = t.bgNode ? cc.instantiate(t.bgNode) : null;
if (o) {
o.name = " img_dynamic_input_bg_ " + e;
i.addChild(o);
o.setSiblingIndex(0);
}
if (n) {
n.name = " txt_dynamic_input_label_ " + e;
i.addChild(n);
}
if (a) {
a.name = " txt_dynamic_input_value_ " + e;
i.addChild(a);
}
return this.setupFieldRowRefs({
labelNode: n,
inputNode: a,
bgNode: o
});
},
bindEvents: function() {
this.btnClose && this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
this.btnSubmit && this.btnSubmit.on(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
this.maskNode && this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
this.panelNode && this.panelNode.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
this.panelNode && this.panelNode.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
this.bindChannelCardEvents();
},
unbindEvents: function() {
this.btnClose && this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
this.btnSubmit && this.btnSubmit.off(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
this.maskNode && this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
this.panelNode && this.panelNode.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
this.panelNode && this.panelNode.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
this.unbindChannelCardEvents();
},
onTouchInsidePanel: function(e) {
e && e.stopPropagation && e.stopPropagation();
},
onClickFieldBackground: function(e) {
e && e.stopPropagation && e.stopPropagation();
var t = e && e.currentTarget, i = t && t._cashArrowBoundEditBox;
i && " function " == typeof i.focus && i.focus();
},
onClickChannelCard: function(e) {
var t = e && e.currentTarget && e.currentTarget._channelCardIndex;
if (" number " == typeof t && !(t < 0 || t >= this.channelList.length) && t !== this.selectedChannelIndex) {
this.saveCurrentInputCache();
this.selectedChannelIndex = t;
this.refreshUI();
}
},
refreshChannelCards: function() {
var e = this.channelList.length;
this.ensureChannelCardNodeCount(e);
this.bindChannelCardEvents();
this.channelCardImageVersion += 1;
var t = this.channelCardImageVersion;
if (e <= 0) {
for (var i = 0; i < this.channelCardNodes.length; i++) if (this.channelCardNodes[i]) {
this.channelCardNodes[i].active = !1;
this.restoreChannelCardDefaultSprite(this.channelCardNodes[i]);
}
this.channelSelectOverlay && (this.channelSelectOverlay.active = !1);
this.channelSelectedIcon && (this.channelSelectedIcon.active = !1);
} else {
this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex, e - 1));
for (var n = this._currentPanelShift || 0, a = 0; a < this.channelCardNodes.length; a++) {
var o = this.channelCardNodes[a];
if (o) {
var r = a < e;
o.active = r;
if (r) {
var s = this.getChannelCardSlot(a);
if (s) {
o.x = s.x;
o.y = s.y + n;
}
o._channelCardIndex = a;
o.opacity = a === this.selectedChannelIndex ? 255 : 180;
this.applyChannelCardImage(o, this.channelList[a], t);
} else {
o._channelCardIndex = -1;
this.restoreChannelCardDefaultSprite(o);
}
}
}
var l = this.channelCardNodes[this.selectedChannelIndex];
if (l && this.channelSelectedIcon) {
this.channelSelectedIcon.active = !0;
this.channelSelectedIcon.x = l.x + this.selectedChannelIconOffsetX;
this.channelSelectedIcon.y = l.y + this.selectedChannelIconOffsetY;
this.channelSelectedIcon.setSiblingIndex(this.channelSelectedIcon.parent.childrenCount - 1);
} else this.channelSelectedIcon && (this.channelSelectedIcon.active = !1);
if (l && this.channelSelectOverlay) {
this.channelSelectOverlay.active = !0;
this.channelSelectOverlay.x = l.x + this.channelSelectOverlayOffsetX;
this.channelSelectOverlay.y = l.y + this.channelSelectOverlayOffsetY;
this.channelSelectOverlay.setSiblingIndex(this.channelSelectOverlay.parent.childrenCount - 1);
this.channelSelectedIcon && this.channelSelectedIcon.active && this.channelSelectedIcon.setSiblingIndex(this.channelSelectOverlay.parent.childrenCount - 1);
} else this.channelSelectOverlay && (this.channelSelectOverlay.active = !1);
}
},
seedInitialInputCache: function() {
if (this.initialBindInfo && !(this.channelList.length <= 0)) for (var e = 0; e < this.channelList.length; e++) {
var t = this.channelList[e];
if ((t.channel || " ") === (this.initialBindInfo.channel || " ") && (t.sub_channel || " ") === (this.initialBindInfo.sub_channel || " ")) {
for (var i = {}, n = t.need_field || [], a = 0; a < n.length; a++) {
var o = n[a];
if (o && o.field_value) {
var r = o.field_value, s = this.initialBindInfo[r];
null == s && (" payee_name " === r || " name " === r ? s = this.initialBindInfo.payee_name || this.initialBindInfo.name || " " : " account " === r && (s = this.initialBindInfo.account || this.initialBindInfo.phone || this.initialBindInfo.email || " "));
i[r] = null == s ? " " : String(s);
}
}
this.channelInputCache[this.getChannelCacheKey(t)] = i;
this.selectedChannelIndex = e;
break;
}
}
},
getCurrentChannel: function() {
return this.channelList[this.selectedChannelIndex] || null;
},
getChannelCacheKey: function(e) {
return e ? [ e.channel || " ", e.sub_channel || " ", e.show_channel || e.name || " " ].join("| ") : " __default__ ";
},
saveCurrentInputCache: function() {
var e = this.getCurrentChannel();
if (e) {
var t = this.collectCurrentInputData(!1);
t && (this.channelInputCache[this.getChannelCacheKey(e)] = t);
}
},
saveInputCacheByData: function(e, t) {
e && t && (this.channelInputCache[this.getChannelCacheKey(e)] = t);
},
restoreInputCache: function(e) {
for (var t = this.channelInputCache[this.getChannelCacheKey(e)] || {}, i = 0; i < this.activeFieldRows.length; i++) {
var n = this.activeFieldRows[i];
if (n && n.editBox && n.field) {
var a = n.field.field_value;
n.editBox.string = t[a] || " ";
}
}
},
clearExtraFieldRows: function() {
for (;this.extraFieldRows.length > 0; ) {
var e = this.extraFieldRows.pop();
this.unbindFieldRowInputEvents(e);
e.labelNode && e.labelNode.destroy();
e.inputNode && e.inputNode.destroy();
e.bgNode && e.bgNode.destroy();
}
},
ensureFieldRowCount: function(e) {
for (var t = Math.max(1, e || 0); this.baseFieldRows.length + this.extraFieldRows.length < t; ) {
var i = this.baseFieldRows.length + this.extraFieldRows.length, n = this.createFieldRowFromTemplate(i);
if (!n) break;
this.extraFieldRows.push(n);
}
for (;this.baseFieldRows.length + this.extraFieldRows.length > t && this.extraFieldRows.length > 0; ) {
var a = this.extraFieldRows.pop();
this.unbindFieldRowInputEvents(a);
a.labelNode && a.labelNode.destroy();
a.inputNode && a.inputNode.destroy();
a.bgNode && a.bgNode.destroy();
}
var o = this.baseFieldRows.concat(this.extraFieldRows);
this.activeFieldRows = [];
for (var r = 0; r < o.length; r++) {
var s = r < t;
o[r].labelNode && (o[r].labelNode.active = s);
o[r].inputNode && (o[r].inputNode.active = s);
o[r].bgNode && (o[r].bgNode.active = s);
s && this.activeFieldRows.push(o[r]);
}
},
updateFieldRows: function(e) {
this.ensureFieldRowCount(this.currentFields.length);
this.adjustPanelForFieldCount(this.activeFieldRows.length);
for (var t = this._currentPanelShift || 0, i = 0; i < this.activeFieldRows.length; i++) {
var n = this.activeFieldRows[i], a = this.currentFields[i];
if (a) {
n.field = a;
if (n.labelNode) {
n.labelNode.x = this.baseLabelX;
n.labelNode.y = this.baseLabelY + t - this.rowGap * i;
}
if (n.inputNode) {
n.inputNode.x = this.baseInputX;
n.inputNode.y = this.baseInputY + t - this.rowGap * i;
}
if (n.bgNode) {
n.bgNode.x = this.baseBgX;
n.bgNode.y = this.baseBgY + t - this.rowGap * i;
}
this.updateFieldRowDisplay(n, a, e);
}
}
var o = this.rowGap * Math.max(0, this.activeFieldRows.length - this.baseFieldRowCount);
this.btnSubmit && (this.btnSubmit.y = this.baseSubmitY + t - o);
},
adjustPanelForFieldCount: function(e) {
if (this.panelNode) {
var t = Math.max(0, e - this.baseFieldRowCount) * this.rowGap, i = this._basePanelHeight + t, n = t * (1 - this._basePanelAnchorY), a = n - (this._currentPanelShift || 0);
if (!(Math.abs(a) < .01 && Math.abs(this.panelNode.height - i) < 1)) {
this._panelWidget || (this._panelWidget = this.panelNode.getComponent(cc.Widget));
this._panelWidget && this._panelWidget.enabled && (this._panelWidget.enabled = !1);
this.panelNode.height = i;
this.panelNode.y = this._basePanelY - n;
if (Math.abs(a) > .01) for (var o = 0; o < this.panelNode.childrenCount; o++) {
var r = this.panelNode.children[o];
r && r.isValid && (r.y += a);
}
this._currentPanelShift = n;
}
}
},
updateFieldRowDisplay: function(e, t, i) {
if (e && t) {
var n = this.resolveFieldLabel(t);
e.labelComp && (e.labelComp.string = n);
if (e.editBox) {
e.editBox.placeholder = n;
this.applyFieldInputMode(e.editBox, t, i);
}
}
},
resolveFieldLabel: function(e) {
return e && (e.field_desc || e.field_value_translate || e.field_value) || " ";
},
applyFieldInputMode: function(e, t, i) {
if (e) {
var n = cc.EditBox && cc.EditBox.InputMode ? cc.EditBox.InputMode : null, a = t && t.field_value ? String(t.field_value).toLowerCase() : " ", o = i && i.account_type;
Array.isArray(o) && (o = o[0]);
o = (o || " ").toString().toLowerCase();
var r = -1 !== a.indexOf(" phone ") || " account " === a && " phone " === o, s = -1 !== a.indexOf(" email ") || " account " === a && " email " === o;
e.inputMode = r ? n && void 0 !== n.PHONE_NUMBER ? n.PHONE_NUMBER : 3 : s ? n && void 0 !== n.EMAIL_ADDR ? n.EMAIL_ADDR : 1 : n && void 0 !== n.SINGLE_LINE ? n.SINGLE_LINE : 6;
}
},
refreshUI: function() {
this.refreshChannelCards();
var e = this.getCurrentChannel();
if (e) {
this.lblTitle && (this.lblTitle.string = e.title || this.i18n(" key_cash_set_title ", null, " Enter Account Details "));
this.lblSelectInfo && (this.lblSelectInfo.string = this.i18n(" key_cash_set_select_account_info ", null, " Select account information "));
this.lblSubmitBtn && (this.lblSubmitBtn.string = this.i18n(" key_cash_set_submit_btn ", null, " Submit "));
this.currentFields = e.need_field && e.need_field.length > 0 ? e.need_field : this.getDefaultNeedFields(e);
this.updateFieldRows(e);
this.restoreInputCache(e);
}
},
collectCurrentInputData: function(e) {
for (var t = {}, i = 0; i < this.activeFieldRows.length; i++) {
var n = this.activeFieldRows[i];
if (n && n.field && n.editBox) {
var a = n.field.field_value, o = n.editBox.string || " ";
o = o.trim();
if (e && !o) {
this.showToast(this.resolveFieldLabel(n.field) || this.i18n(" key_cash_set_required_fields ", null, " Please complete required fields "));
return null;
}
t[a] = o;
}
}
return t;
},
parseCheckInfo: function(e) {
if (!e || !e.data) return {};
var t = e.data.check_info;
if (!t) return {};
if (" string " == typeof t) try {
return JSON.parse(t);
} catch (e) {
cc.warn("[cashArrowSetView] parse check_info failed ", e);
return {};
}
return " object " == typeof t ? t : {};
},
isCheckPass: function(e) {
return !0 === e || 1 === e || " 1 " === e || " true " === e;
},
findFirstFailedField: function(e) {
for (var t = this.currentFields || [], i = 0; i < t.length; i++) {
var n = t[i];
if (n && n.field_value && Object.prototype.hasOwnProperty.call(e, n.field_value) && !this.isCheckPass(e[n.field_value])) return n;
}
return null;
},
onClickSubmit: function() {
if (!this.isSubmitting) {
var e = this, t = this.getCurrentChannel();
if (t) {
var i = this.collectCurrentInputData(!0);
if (i) {
this.isSubmitting = !0;
var s = {
channel: t.channel || " ",
sub_channel: t.sub_channel || " ",
info: i
}, l = LoadingHttpService.verifyWithdrawBindInfo;
if (" function " == typeof l) {
var c = NetErrorPopupService || r, u = function() {
e.isSubmitting = !1;
e.onClickSubmit();
};
l.call(LoadingHttpService, s, Handler.create(e, function(a) {
if (c && c.shouldPop(a)) {
cc.warn("[cashArrowSetView] verifyWithdrawBindInfo force- retry code = ", a && a.code);
e.isSubmitting = !1;
c.showAndRetry(u);
} else {
e.isSubmitting = !1;
if (a && 1 === Number(a.code)) {
var o = e.parseCheckInfo(a), r = e.findFirstFailedField(o);
if (r) e.showToast(r.fail_desc || e.resolveFieldLabel(r) || e.i18n(" key_cash_set_validation_failed ", null, " Validation failed ")); else {
e.saveInputCacheByData(t, i);
var s = e.buildBindInfo(t, i);
e.onValidated && e.onValidated(s);
UIMgr.getInstance().hide(e.node);
}
} else {
cc.warn("[cashArrowSetView] verify failed: ", a && a.message);
e.showToast(a && a.message || e.i18n(" key_cash_set_validation_failed ", null, " Validation failed "));
}
}
}), Handler.create(e, function(t) {
if (c && c.shouldPop(t)) {
cc.warn("[cashArrowSetView] verifyWithdrawBindInfo 网络异常 ， 弹重试窗 err = ", t && t.message);
e.isSubmitting = !1;
c.showAndRetry(u);
} else {
e.isSubmitting = !1;
cc.warn("[cashArrowSetView] verify error: ", t && t.message);
e.showToast(t && t.message || e.i18n(" key_common_network_error ", null, " Network error "));
}
}));
} else {
this.isSubmitting = !1;
cc.warn("[cashArrowSetView] verifyWithdrawBindInfo is undefined ");
this.showToast(this.i18n(" key_common_network_unavailable ", null, " Network unavailable "));
}
}
}
}
},
buildBindInfo: function(e, t) {
var i = {
channel: e.channel || " ",
sub_channel: e.sub_channel || " ",
show_channel: e.show_channel || " ",
need_field: e.need_field || [],
channel_pic: e.channel_pic || " ",
tax_desc: e.tax_desc || " "
};
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (i[n] = t[n]);
!i.payee_name && i.name && (i.payee_name = i.name);
!i.name && i.payee_name && (i.name = i.payee_name);
i.account || (i.account = i.phone || i.email || " ");
i._input_data = t;
return i;
},
i18n: function(e, t, i) {
return LanguageService.t(e, t || [], i);
},
showToast: function(t) {
try {
var i = e(" Tips ");
Tips.show(t);
} catch (e) {
cc.log("[cashArrowSetView] toast: ", t);
}
},
onClickClose: function() {
this.onClose && this.onClose();
UIMgr.getInstance().hide(this.node);
},
findNodeDeep: function(e, t) {
if (!e) return null;
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

export default CashArrowSetView;
