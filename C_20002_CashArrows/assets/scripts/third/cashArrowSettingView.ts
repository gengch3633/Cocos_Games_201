import AudioMgr from "./AudioMgr";
import UserData from "./UserData";
import PlayerDataStore from "./PlayerDataStore";
import ClientDataStore from "./ClientDataStore";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import UIMgr from "./UIMgr";
import LanguageService from "./LanguageService";
import ContactUsService from "./ContactUsService";

const { ccclass } = cc._decorator;

@ccclass
export default class cashArrowSettingView extends cc.Component {
    _panel: cc.Node = null;
    _soundBg: cc.Node = null;
    _soundKnob: cc.Node = null;
    _soundMark: cc.Node = null;
    _vibrateBg: cc.Node = null;
    _vibrateKnob: cc.Node = null;
    _vibrateMark: cc.Node = null;
    _btnRestart: cc.Node = null;
    _contactArea: cc.Node = null;
    _lblPrivacy: cc.Node = null;
    _lblUid: cc.Node = null;
    _lblVersion: cc.Node = null;
    _lblTitle: cc.Node = null;
    _lblContactUs: cc.Node = null;
    _lblSound: cc.Node = null;
    _lblVibrate: cc.Node = null;
    _lblRestart: cc.Node = null;

    onLoad() {
        this._cacheNodes();
        this._registerEvents();
        this._bindLanguageEvent();
    }

    start() {
        this._showAni();
        this._initSoundUI();
        this._initVibrateUI();
        this._refreshTexts();
    }

    _findDeep(e: cc.Node, t: string) {
        if (!e || !e.isValid) return null;
        if (e.name === t) return e;
        for (var i = e.children || [], n = 0; n < i.length; n++) {
            var a = this._findDeep(i[n], t);
            if (a) return a;
        }
        return null;
    }

    _cacheNodes() {
        var e = cc.find(" block_panel ", this.node);
        this._panel = e;
        this._soundBg = this._findDeep(e, " btn_channel_0 ");
        this._soundKnob = this._findDeep(e, " sound_toggle_knob ");
        this._soundMark = this._findDeep(e, " sound_toggle_mark ");
        this._vibrateBg = this._findDeep(e, " img_channel_select_overlay ");
        this._vibrateKnob = this._findDeep(e, " vibrate_toggle_knob ");
        this._vibrateMark = this._findDeep(e, " vibrate_toggle_mark ");
        this._btnRestart = this._findDeep(e, " btn_submit ");
        this._contactArea = this._findDeep(e, " img_input_account_bg ");
        this._lblPrivacy = this._findDeep(e, " lbl_privacy_new ");
        this._lblUid = this._findDeep(e, " txt_select_account_info ");
        this._lblVersion = this._findDeep(e, " lbl_version_new ");
        this._lblTitle = this._findDeep(e, " txt_enter_account_details ");
        this._lblContactUs = this._findDeep(e, " lbl_contact_us_new ");
        this._lblSound = this._findDeep(e, " lbl_sound_new ");
        this._lblVibrate = this._findDeep(e, " lbl_vibrate_new ");
        this._lblRestart = this._findDeep(e, " txt_withdraw_btn ");
    }

    _bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    _unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    _onLanguageChanged() {
        this._refreshTexts();
    }

    _setLabelString(e: cc.Node, t: string) {
        if (e) {
            var i = e.getComponent(cc.Label);
            i && (i.string = t);
        }
    }

    _refreshTexts() {
        this._setLabelString(this._lblTitle, LanguageService.t(" key_setting_title "));
        this._setLabelString(this._lblContactUs, LanguageService.t(" key_setting_contact_us "));
        this._setLabelString(this._lblSound, LanguageService.t(" key_setting_sound "));
        this._setLabelString(this._lblVibrate, LanguageService.t(" key_setting_vibrate "));
        this._setLabelString(this._lblRestart, LanguageService.t(" key_setting_restart "));
        this._setLabelString(this._lblPrivacy, LanguageService.t(" key_setting_privacy "));
        this._initUID();
        this._initVersion();
    }

    _registerEvents() {
        for (var e = [this._soundBg, this._soundKnob, this._soundMark], t = 0; t < e.length; t++) e[t] && e[t].on(cc.Node.EventType.TOUCH_END, this._onToggleSound, this);
        for (var i = [this._vibrateBg, this._vibrateKnob, this._vibrateMark], n = 0; n < i.length; n++) i[n] && i[n].on(cc.Node.EventType.TOUCH_END, this._onToggleVibrate, this);
        this._btnRestart && this._btnRestart.on(cc.Node.EventType.TOUCH_END, this._onClickRestart, this);
        this._contactArea && this._contactArea.on(cc.Node.EventType.TOUCH_END, this._onClickContactUs, this);
        this._lblPrivacy && this._lblPrivacy.on(cc.Node.EventType.TOUCH_END, this._onClickPrivacy, this);
    }

    _initSoundUI() {
        var e = AudioMgr.getInstance().effectMute;
        this._applySoundState(!e);
    }

    _initVibrateUI() {
        var e = UserData.getInstance().shake;
        this._applyVibrateState(e);
    }

    _initUID() {
        if (this._lblUid) {
            var e = ClientDataStore || null, t = e && e.user_id ? String(e.user_id) : " ";
            if (!t) {
                var i = PlayerDataStore, n = UserData.getInstance();
                i && i.user_id ? t = String(i.user_id) : i && i.yid && " yid_read_failed " !== i.yid && " yid_read_fail " !== i.yid ? t = String(i.yid) : n.userID ? t = String(n.userID) : n.openId && (t = String(n.openId));
            }
            var s = this._lblUid.getComponent(cc.Label);
            s && (s.string = LanguageService.t(" key_setting_user_id ", [t]));
        }
    }

    _initVersion() {
        if (this._lblVersion) {
            var e = ClientDataStore || ClientDataStore, t = e && e.version_name ? e.version_name : " 1.0.0 ", i = this._lblVersion.getComponent(cc.Label);
            i && (i.string = LanguageService.t(" key_setting_version ", [t]));
        }
    }

    _applySoundState(e: boolean) {
        this._soundKnob && (this._soundKnob.x = e ? 192.5 : 133.5);
        this._soundMark && (this._soundMark.x = e ? 192.5 : 133.5);
    }

    _applyVibrateState(e: boolean) {
        this._vibrateKnob && (this._vibrateKnob.x = e ? 188 : 130);
        this._vibrateMark && (this._vibrateMark.x = e ? 188 : 130);
    }

    _onToggleSound() {
        var e = AudioMgr.getInstance();
        e.effectMute = !e.effectMute;
        this._applySoundState(!e.effectMute);
    }

    _onToggleVibrate() {
        var e = UserData.getInstance();
        e.shake = !e.shake;
        this._applyVibrateState(e.shake);
    }

    _onClickRestart() {
        GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    _onClickContactUs() {
        ContactUsService.openContactUs();
    }

    _onClickPrivacy() {
        ContactUsService.openPrivacy();
    }

    _showAni() {
        var e = this._panel;
        if (e) {
            e.y += 2e3;
            e.opacity = 0;
            cc.tween(e).by(.3, {
                y: -2100
            }).by(.3, {
                y: 100
            }, {
                easing: " backOut "
            }).union().start();
            cc.tween(e).delay(.15).to(.2, {
                opacity: 255
            }).start();
        }
    }

    onDestroy() {
        this._unbindLanguageEvent();
        GlobalEventMgr.getInstance().emit(gameEvent.closeSet);
    }
}
