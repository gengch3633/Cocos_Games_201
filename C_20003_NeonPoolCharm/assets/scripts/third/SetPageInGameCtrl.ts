import AudioManager, { DEFAULT_BGM_NAME } from "./AudioManager";
import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import { Debugger } from "./Debugger";
import { GameConfigurations } from "./GameConfigurations";
import PageMgr from "./PageMgr";
import { PoolNative } from "./PoolNative";
import SetPageInGame from "./SetPageInGame";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/SetPageInGameCtrl")
export default class SetPageInGameCtrl extends BasePageCtrl {
    ui = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _exitCB = null;
    _debugFlag = 0;
    _debugScheduleFunc = null;

    static prefabUrl = "SetPageInGame";
    static className = "SetPageInGameCtrl";

    onDisable() {
        super.onDisable();
        this._exitCB = null;
    }

    _clickTitle() {
        if (Debugger.isDebugMode) {
            this.hide();
            PageMgr.showPage("DebugPage");
        } else if (GameConfigurations.debugCode.length > 0) if (6 == ++this._debugFlag) {
            this._debugFlag = 0;
            this._stopDebugSchedule();
            this.hide();
            PageMgr.showPage("DebugCodePage");
        } else this._startDebugSchedule();
    }

    onLoad() {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    onUILoad() {
        this.ui = this.node.addComponent(SetPageInGame);
    }

    clickMoreGame() {
        const o = GameConfigurations.moreGameURLsArray;
        const e = o[Math.floor(Math.random() * o.length)];
        const t = null === e || undefined === e ? undefined : e.link_url;
        PageMgr.showPage("MoreGamePage", {
            url: null !== t && undefined !== t ? t : ""
        });
    }

    musicTouch() {
        if (AudioManager.getInstance().getMusicState()) {
            AudioManager.getInstance().closeBg();
            AudioManager.getInstance().pauseMusic(DEFAULT_BGM_NAME, true);
        } else {
            AudioManager.getInstance().openBg();
            AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
        }
    }

    addButtonListen() {
        (Debugger.isDebugMode || GameConfigurations.debugCode.length > 0) && UiManager.addButtonListen(this.ui.titleLabel, this._clickTitle, this, undefined, undefined, undefined, cc.Button.Transition.NONE);
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn_sound, this.clickSound, this);
        UiManager.addButtonListen(this.ui.btn_shake, this.clickShake, this);
        UiManager.addButtonListen(this.ui.btn_music, this.clickMusic, this);
        UiManager.addButtonListen(this.ui.btn_quit, this.clickQuit, this);
        UiManager.addButtonListen(this.ui.btn_more_game, this.clickMoreGame, this);
        UiManager.addButtonListen(this.ui.policy, this.clickPolicy, this);
    }

    audioTouch() {
        AudioManager.getInstance().getAudioState() ? AudioManager.getInstance().closeAudio() : AudioManager.getInstance().openAudio();
    }

    _init(e) {
        this._exitCB = e ? e.exitCB : null;
        this.ui.icon_on.active = AudioManager.getInstance().getMusicState();
        this.ui.icon_off.active = !this.ui.icon_on.active;
        this.ui.icon_sound_on.active = AudioManager.getInstance().getAudioState();
        this.ui.icon_sound_off.active = !this.ui.icon_sound_on.active;
        this.ui.icon_shake_on.active = AudioManager.getInstance().getVibratorState();
        this.ui.icon_shake_off.active = !this.ui.icon_shake_on.active;
        const t = !!this._exitCB;
        this.ui.btn_quit.active = t;
        this.ui.btn_more_game.active = GameConfigurations.moreGameURLsArray.length > 0;
    }

    clickSound() {
        this.audioTouch();
        this.ui.icon_sound_on.active = AudioManager.getInstance().getAudioState();
        this.ui.icon_sound_off.active = !this.ui.icon_sound_on.active;
    }

    start() {}

    clickClose() {
        this.hide();
    }

    _stopDebugSchedule() {
        if (this._debugScheduleFunc) {
            this.unschedule(this._debugScheduleFunc);
            this._debugScheduleFunc = null;
        }
    }

    clckReplayBtn() {
        this._exitCB && this._exitCB();
        this.clickClose();
    }

    _startDebugSchedule() {
        const e = this;
        this._stopDebugSchedule();
        this.scheduleOnce(this._debugScheduleFunc = function () {
            return e._debugFlag = 0;
        }, 1);
    }

    clickPolicy() {
        PoolNative.openURL(GameConfigurations.PRIVACY_POLICY);
    }

    clickMusic() {
        this.musicTouch();
        this.ui.icon_on.active = AudioManager.getInstance().getMusicState();
        this.ui.icon_off.active = !this.ui.icon_on.active;
    }

    clickShake() {
        AudioManager.getInstance().getVibratorState() ? AudioManager.getInstance().closeVibrator() : AudioManager.getInstance().openVibrator();
        this.ui.icon_shake_on.active = AudioManager.getInstance().getVibratorState();
        this.ui.icon_shake_off.active = !this.ui.icon_shake_on.active;
    }

    clickQuit() {
        this._exitCB && this._exitCB();
        this.clickClose();
    }
}
