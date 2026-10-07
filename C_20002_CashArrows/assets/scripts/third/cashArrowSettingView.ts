import AudioMgr from "./AudioMgr";
import ClientDataStore from "./ClientDataStore";
import ContactUsService from "./ContactUsService";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import PlayerDataStore from "./PlayerDataStore";
import UIMgr from "./UIMgr";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

@ccclass
export default class CashArrowSettingView extends cc.Component {
    private _panel: cc.Node | null = null;
    private _soundBg: cc.Node | null = null;
    private _soundKnob: cc.Node | null = null;
    private _soundMark: cc.Node | null = null;
    private _vibrateBg: cc.Node | null = null;
    private _vibrateKnob: cc.Node | null = null;
    private _vibrateMark: cc.Node | null = null;
    private _btnRestart: cc.Node | null = null;
    private _contactArea: cc.Node | null = null;
    private _lblPrivacy: cc.Node | null = null;
    private _lblUid: cc.Node | null = null;
    private _lblVersion: cc.Node | null = null;
    private _lblTitle: cc.Node | null = null;
    private _lblContactUs: cc.Node | null = null;
    private _lblSound: cc.Node | null = null;
    private _lblVibrate: cc.Node | null = null;
    private _lblRestart: cc.Node | null = null;

    onLoad(): void {
        this._cacheNodes();
        this._registerEvents();
        this._bindLanguageEvent();
    }

    start(): void {
        this._showAni();
        this._initSoundUI();
        this._initVibrateUI();
        this._refreshTexts();
    }

    private _findDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node || !node.isValid) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        const children = node.children || [];
        for (let i = 0; i < children.length; i++) {
            const found = this._findDeep(children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    private _cacheNodes(): void {
        const panel = cc.find("block_panel", this.node);
        this._panel = panel;
        this._soundBg = this._findDeep(panel, "btn_channel_0");
        this._soundKnob = this._findDeep(panel, "sound_toggle_knob");
        this._soundMark = this._findDeep(panel, "sound_toggle_mark");
        this._vibrateBg = this._findDeep(panel, "img_channel_select_overlay");
        this._vibrateKnob = this._findDeep(panel, "vibrate_toggle_knob");
        this._vibrateMark = this._findDeep(panel, "vibrate_toggle_mark");
        this._btnRestart = this._findDeep(panel, "btn_submit");
        this._contactArea = this._findDeep(panel, "img_input_account_bg");
        this._lblPrivacy = this._findDeep(panel, "lbl_privacy_new");
        this._lblUid = this._findDeep(panel, "txt_select_account_info");
        this._lblVersion = this._findDeep(panel, "lbl_version_new");
        this._lblTitle = this._findDeep(panel, "txt_enter_account_details");
        this._lblContactUs = this._findDeep(panel, "lbl_contact_us_new");
        this._lblSound = this._findDeep(panel, "lbl_sound_new");
        this._lblVibrate = this._findDeep(panel, "lbl_vibrate_new");
        this._lblRestart = this._findDeep(panel, "txt_withdraw_btn");
    }

    private _bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    private _unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this._onLanguageChanged, this);
    }

    private _onLanguageChanged(): void {
        this._refreshTexts();
    }

    private _setLabelString(node: cc.Node | null, text: string): void {
        if (node) {
            const label = node.getComponent(cc.Label);
            if (label) {
                label.string = text;
            }
        }
    }

    private _refreshTexts(): void {
        this._setLabelString(this._lblTitle, LanguageService.t("key_setting_title"));
        this._setLabelString(this._lblContactUs, LanguageService.t("key_setting_contact_us"));
        this._setLabelString(this._lblSound, LanguageService.t("key_setting_sound"));
        this._setLabelString(this._lblVibrate, LanguageService.t("key_setting_vibrate"));
        this._setLabelString(this._lblRestart, LanguageService.t("key_setting_restart"));
        this._setLabelString(this._lblPrivacy, LanguageService.t("key_setting_privacy"));
        this._initUID();
        this._initVersion();
    }

    private _registerEvents(): void {
        const soundNodes = [this._soundBg, this._soundKnob, this._soundMark];
        for (let i = 0; i < soundNodes.length; i++) {
            soundNodes[i]?.on(cc.Node.EventType.TOUCH_END, this._onToggleSound, this);
        }
        const vibrateNodes = [this._vibrateBg, this._vibrateKnob, this._vibrateMark];
        for (let j = 0; j < vibrateNodes.length; j++) {
            vibrateNodes[j]?.on(cc.Node.EventType.TOUCH_END, this._onToggleVibrate, this);
        }
        this._btnRestart?.on(cc.Node.EventType.TOUCH_END, this._onClickRestart, this);
        this._contactArea?.on(cc.Node.EventType.TOUCH_END, this._onClickContactUs, this);
        this._lblPrivacy?.on(cc.Node.EventType.TOUCH_END, this._onClickPrivacy, this);
    }

    private _initSoundUI(): void {
        const muted = AudioMgr.getInstance().effectMute;
        this._applySoundState(!muted);
    }

    private _initVibrateUI(): void {
        const shake = UserData.getInstance().shake;
        this._applyVibrateState(shake);
    }

    private _initUID(): void {
        if (this._lblUid) {
            let uid = ClientDataStore?.user_id ? String(ClientDataStore.user_id) : "";
            if (!uid) {
                const playerStore = PlayerDataStore;
                const userData = UserData.getInstance();
                if (playerStore?.user_id) {
                    uid = String(playerStore.user_id);
                } else if (playerStore?.yid && playerStore.yid !== "yid_read_failed" && playerStore.yid !== "yid_read_fail") {
                    uid = String(playerStore.yid);
                } else if (userData.userID) {
                    uid = String(userData.userID);
                } else if (userData.openId) {
                    uid = String(userData.openId);
                }
            }
            const label = this._lblUid.getComponent(cc.Label);
            if (label) {
                label.string = LanguageService.t("key_setting_user_id", [uid]);
            }
        }
    }

    private _initVersion(): void {
        if (this._lblVersion) {
            const version = ClientDataStore?.version_name ? ClientDataStore.version_name : "1.0.0";
            const label = this._lblVersion.getComponent(cc.Label);
            if (label) {
                label.string = LanguageService.t("key_setting_version", [version]);
            }
        }
    }

    private _applySoundState(on: boolean): void {
        if (this._soundKnob) {
            this._soundKnob.x = on ? 192.5 : 133.5;
        }
        if (this._soundMark) {
            this._soundMark.x = on ? 192.5 : 133.5;
        }
    }

    private _applyVibrateState(on: boolean): void {
        if (this._vibrateKnob) {
            this._vibrateKnob.x = on ? 188 : 130;
        }
        if (this._vibrateMark) {
            this._vibrateMark.x = on ? 188 : 130;
        }
    }

    private _onToggleSound(): void {
        const audio = AudioMgr.getInstance();
        audio.effectMute = !audio.effectMute;
        this._applySoundState(!audio.effectMute);
    }

    private _onToggleVibrate(): void {
        const userData = UserData.getInstance();
        userData.shake = !userData.shake;
        this._applyVibrateState(userData.shake);
    }

    private _onClickRestart(): void {
        GlobalEventMgr.getInstance().emit(gameEvent.gameRestart);
        UIMgr.getInstance().hide(this.node);
    }

    private _onClickContactUs(): void {
        ContactUsService.openContactUs();
    }

    private _onClickPrivacy(): void {
        ContactUsService.openPrivacy();
    }

    private _showAni(): void {
        const panel = this._panel;
        if (panel) {
            panel.y += 2000;
            panel.opacity = 0;
            cc.tween(panel)
                .by(0.3, { y: -2100 })
                .by(0.3, { y: 100 }, { easing: "backOut" })
                .union()
                .start();
            cc.tween(panel).delay(0.15).to(0.2, { opacity: 255 }).start();
        }
    }

    onDestroy(): void {
        this._unbindLanguageEvent();
        GlobalEventMgr.getInstance().emit(gameEvent.closeSet);
    }
}
