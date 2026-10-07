import AudioMgr from "./AudioMgr";
import ClientDataStore from "./ClientDataStore";
import ContactUsService from "./ContactUsService";
import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr, { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import PlayerDataStore from "./PlayerDataStore";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const CashArrowSettingView = cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {
this._cacheNodes();
this._registerEvents();
this._bindLanguageEvent();
},
start: function() {
this._showAni();
this._initSoundUI();
this._initVibrateUI();
this._refreshTexts();
},
_findDeep: function(e, t) {
if (!e || !e.isValid) return null;
if (e.name === t) return e;
for (var i = e.children || [], n = 0; n < i.length; n++) {
var a = this._findDeep(i[n], t);
if (a) return a;
}
return null;
},
_cacheNodes: function() {
var e = cc.find("block_panel", this.node);
this._panel = e;
this._soundBg = this._findDeep(e, "btn_channel_0");
this._soundKnob = this._findDeep(e, "sound_toggle_knob");
this._soundMark = this._findDeep(e, "sound_toggle_mark");
this._vibrateBg = this._findDeep(e, "img_channel_select_overlay");
this._vibrateKnob = this._findDeep(e, "vibrate_toggle_knob");
this._vibrateMark = this._findDeep(e, "vibrate_toggle_mark");
this._btnRestart = this._findDeep(e, "btn_submit");
this._contactArea = this._findDeep(e, "img_input_account_bg");
this._lblPrivacy = this._findDeep(e, "lbl_privacy_new");
this._lblUid = this._findDeep(e, "txt_select_account_info");
this._lblVersion = this._findDeep(e, "lbl_version_new");
this._lblTitle = this._findDeep(e, "txt_enter_account_details");
this._lblContactUs = this._findDeep(e, "lbl_contact_us_new");
this._lblSound = this._findDeep(e, "lbl_sound_new");
this._lblVibrate = this._findDeep(e, "lbl_vibrate_new");
this._lblRestart = this._findDeep(e, "txt_withdraw_btn");
},
_bindLanguageEvent: function() {
GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._onLanguageChanged, this);
},
_unbindLanguageEvent: function() {
GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._onLanguageChanged, this);
},
_onLanguageChanged: function() {
this._refreshTexts();
},
_setLabelString: function(e, t) {
if (e) {
var i = e.getComponent(cc.Label);
i && (i.string = t);
}
},
_refreshTexts: function() {
this._setLabelString(this._lblTitle, LanguageService.t("key_setting_title"));
this._setLabelString(this._lblContactUs, LanguageService.t("key_setting_contact_us"));
this._setLabelString(this._lblSound, LanguageService.t("key_setting_sound"));
this._setLabelString(this._lblVibrate, LanguageService.t("key_setting_vibrate"));
this._setLabelString(this._lblRestart, LanguageService.t("key_setting_restart"));
this._setLabelString(this._lblPrivacy, LanguageService.t("key_setting_privacy"));
this._initUID();
this._initVersion();
},
_registerEvents: function() {
for (var e = [ this._soundBg, this._soundKnob, this._soundMark ], t = 0; t < e.length; t++) e[t] && e[t].on(cc.Node.EventType.TOUCH_END, this._onToggleSound, this);
for (var i = [ this._vibrateBg, this._vibrateKnob, this._vibrateMark ], n = 0; n < i.length; n++) i[n] && i[n].on(cc.Node.EventType.TOUCH_END, this._onToggleVibrate, this);
this._btnRestart && this._btnRestart.on(cc.Node.EventType.TOUCH_END, this._onClickRestart, this);
this._contactArea && this._contactArea.on(cc.Node.EventType.TOUCH_END, this._onClickContactUs, this);
this._lblPrivacy && this._lblPrivacy.on(cc.Node.EventType.TOUCH_END, this._onClickPrivacy, this);
},
_initSoundUI: function() {
var e = AudioMgr.getInstance().effectMute;
this._applySoundState(!e);
},
_initVibrateUI: function() {
var e = UserData.getInstance().shake;
this._applyVibrateState(e);
},
_initUID: function() {
if (this._lblUid) {
var e = r && ClientDataStore ? ClientDataStore : null, t = e && e.user_id ? String(e.user_id) : "";
if (!t) {
var i = PlayerDataStore || o, n = UserData.getInstance();
i && i.user_id ? t = String(i.user_id) : i && i.yid && "yid_read_failed" !== i.yid && "yid_read_fail" !== i.yid ? t = String(i.yid) : n.userID ? t = String(n.userID) : n.openId && (t = String(n.openId));
}
var s = this._lblUid.getComponent(cc.Label);
s && (s.string = LanguageService.t("key_setting_user_id", [ t ]));
}
},
_initVersion: function() {
if (this._lblVersion) {
var e = r && ClientDataStore ? ClientDataStore : r, t = e && e.version_name ? e.version_name : "1.0.0", i = this._lblVersion.getComponent(cc.Label);
i && (i.string = LanguageService.t("key_setting_version", [ t ]));
}
},
_applySoundState: function(e) {
this._soundKnob && (this._soundKnob.x = e ? 192.5 : 133.5);
this._soundMark && (this._soundMark.x = e ? 192.5 : 133.5);
},
_applyVibrateState: function(e) {
this._vibrateKnob && (this._vibrateKnob.x = e ? 188 : 130);
this._vibrateMark && (this._vibrateMark.x = e ? 188 : 130);
},
_onToggleSound: function() {
var e = AudioMgr.getInstance();
e.effectMute = !e.effectMute;
this._applySoundState(!e.effectMute);
},
_onToggleVibrate: function() {
var e = UserData.getInstance();
e.shake = !e.shake;
this._applyVibrateState(e.shake);
},
_onClickRestart: function() {
GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
UIMgr.getInstance().hide(this.node);
},
_onClickContactUs: function() {
d.openContactUs();
},
_onClickPrivacy: function() {
d.openPrivacy();
},
_showAni: function() {
var e = this._panel;
if (e) {
e.y += 2e3;
e.opacity = 0;
cc.tween(e).by(.3, {
y: -2100
}).by(.3, {
y: 100
}, {
easing: "backOut"
}).union().start();
cc.tween(e).delay(.15).to(.2, {
opacity: 255
}).start();
}
},
onDestroy: function() {
this._unbindLanguageEvent();
GlobalEventMgr.getInstance().emit(gameEvent.closeSet);
}
});

export default CashArrowSettingView;
