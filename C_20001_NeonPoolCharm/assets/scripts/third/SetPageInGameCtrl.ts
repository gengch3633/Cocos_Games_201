import { AudioManager, DEFAULT_BGM_NAME } from "./AudioManager";
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
    ui: SetPageInGame = null;
    _animType = null;
    _touchControl = null;
    _hasPeneLock = null;
    _hasBlack = null;
    _hasTouchLock = null;
    _exitCB: () => void = null;
    _debugFlag = 0;
    _debugScheduleFunc: () => void = null;

    static prefabUrl = "SetPageInGame";
    static className = "SetPageInGameCtrl";

    onDisable(): void {
        super.onDisable();
        this._exitCB = null;
    }

    _clickTitle(): void {
        if (Debugger.isDebugMode) {
            this.hide();
            PageMgr.showPage("DebugPage");
        } else if (GameConfigurations.debugCode.length > 0) {
            if (6 == ++this._debugFlag) {
                this._debugFlag = 0;
                this._stopDebugSchedule();
                this.hide();
                PageMgr.showPage("DebugCodePage");
            } else {
                this._startDebugSchedule();
            }
        }
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.SCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(SetPageInGame);
    }

    clickMoreGame(): void {
        const moreGameURLs = GameConfigurations.moreGameURLsArray;
        PageMgr.showPage("MoreGamePage", {
            url: moreGameURLs[Math.floor(Math.random() * moreGameURLs.length)]?.link_url ?? "",
        });
    }

    musicTouch(): void {
        if (AudioManager.getInstance().getMusicState()) {
            AudioManager.getInstance().closeBg();
            AudioManager.getInstance().pauseMusic(DEFAULT_BGM_NAME, true);
        } else {
            AudioManager.getInstance().openBg();
            AudioManager.getInstance().playMusic(DEFAULT_BGM_NAME, true, true);
        }
    }

    addButtonListen(): void {
        (Debugger.isDebugMode || GameConfigurations.debugCode.length > 0) &&
            UiManager.addButtonListen(this.ui.titleLabel, this._clickTitle, this, void 0, void 0, void 0, cc.Button.Transition.NONE);
        UiManager.addButtonListen(this.ui.btn_close, this.clickClose, this);
        UiManager.addButtonListen(this.ui.btn_sound, this.clickSound, this);
        UiManager.addButtonListen(this.ui.btn_shake, this.clickShake, this);
        UiManager.addButtonListen(this.ui.btn_music, this.clickMusic, this);
        UiManager.addButtonListen(this.ui.btn_quit, this.clickQuit, this);
        UiManager.addButtonListen(this.ui.btn_more_game, this.clickMoreGame, this);
        UiManager.addButtonListen(this.ui.policy, this.clickPolicy, this);
    }

    audioTouch(): void {
        AudioManager.getInstance().getAudioState()
            ? AudioManager.getInstance().closeAudio()
            : AudioManager.getInstance().openAudio();
    }

    _init(options?: { exitCB?: () => void }): void {
        this._exitCB = options ? options.exitCB : null;
        this.ui.icon_on.active = AudioManager.getInstance().getMusicState();
        this.ui.icon_off.active = !this.ui.icon_on.active;
        this.ui.icon_sound_on.active = AudioManager.getInstance().getAudioState();
        this.ui.icon_sound_off.active = !this.ui.icon_sound_on.active;
        this.ui.icon_shake_on.active = AudioManager.getInstance().getVibratorState();
        this.ui.icon_shake_off.active = !this.ui.icon_shake_on.active;
        const showQuit = !!this._exitCB;
        this.ui.btn_quit.active = showQuit;
        this.ui.btn_more_game.active = GameConfigurations.moreGameURLsArray.length > 0;
    }

    clickSound(): void {
        this.audioTouch();
        this.ui.icon_sound_on.active = AudioManager.getInstance().getAudioState();
        this.ui.icon_sound_off.active = !this.ui.icon_sound_on.active;
    }

    start(): void {
    }

    clickClose(): void {
        this.hide();
    }

    _stopDebugSchedule(): void {
        if (this._debugScheduleFunc) {
            this.unschedule(this._debugScheduleFunc);
            this._debugScheduleFunc = null;
        }
    }

    clckReplayBtn(): void {
        this._exitCB && this._exitCB();
        this.clickClose();
    }

    _startDebugSchedule(): void {
        this._stopDebugSchedule();
        this.scheduleOnce(
            (this._debugScheduleFunc = () => {
                this._debugFlag = 0;
            }),
            1
        );
    }

    clickPolicy(): void {
        PoolNative.openURL(GameConfigurations.PRIVACY_POLICY);
    }

    clickMusic(): void {
        this.musicTouch();
        this.ui.icon_on.active = AudioManager.getInstance().getMusicState();
        this.ui.icon_off.active = !this.ui.icon_on.active;
    }

    clickShake(): void {
        AudioManager.getInstance().getVibratorState()
            ? AudioManager.getInstance().closeVibrator()
            : AudioManager.getInstance().openVibrator();
        this.ui.icon_shake_on.active = AudioManager.getInstance().getVibratorState();
        this.ui.icon_shake_off.active = !this.ui.icon_shake_on.active;
    }

    clickQuit(): void {
        this._exitCB && this._exitCB();
        this.clickClose();
    }
}
