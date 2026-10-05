import SdkHelper from "./SdkHelper";
import EngineUtil from "./EngineUtil";

export const DEFAULT_BGM_NAME = "pool_1bgm";

const { ccclass } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {
    static _instance: AudioManager = null;

    vibratorOpen: number = 0;
    bgOpen: number = 0;
    effectOpen: number = 0;
    _bgAudios: Record<string, number> = {};
    _effectAudio: Record<string, number> = {};
    _effectAudioisPlayArray: Record<string, boolean> = {};
    _nativeAudio: Map<string, string> = new Map();

    static getInstance(): AudioManager {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }
        return AudioManager._instance;
    }

    getAudioState(): boolean {
        return this.effectOpen == 1;
    }

    getMusicState(): boolean {
        return this.bgOpen == 1;
    }

    closeVibrator(): void {
        EngineUtil.localStorageSetItem("vibratorOpen", "0");
        this.vibratorOpen = 0;
    }

    openBg(): void {
        EngineUtil.localStorageSetItem("bg_audio", "1");
        this.bgOpen = 1;
    }

    resumeMusic(e: string, t: boolean): void {
        t = t != false;
        if (t) {
            if (this.bgOpen == 0) {
                return;
            }
            cc.audioEngine.resumeMusic();
        } else {
            if (this.effectOpen == 0) {
                return;
            }
            cc.audioEngine.resume(this._effectAudio[e]);
        }
    }

    closeAudio(): void {
        EngineUtil.localStorageSetItem("effect_audio", "0");
        this.effectOpen = 0;
    }

    stopMusic(e: string, t: boolean): void {
        t = t != false;
        if (t) {
            cc.audioEngine.stopMusic();
        } else if (this._effectAudio.hasOwnProperty(e)) {
            cc.audioEngine.stop(this._effectAudio[e]);
        } else {
            console.warn(e, "cant stop");
        }
    }

    init(): void {
        this._effectAudioisPlayArray = {};
        this.bgOpen = Number(EngineUtil.localStorageGetItem("bg_audio", "1"));
        this.effectOpen = Number(EngineUtil.localStorageGetItem("effect_audio", "1"));
        this.vibratorOpen = Number(EngineUtil.localStorageGetItem("vibratorOpen", "1"));
    }

    closeBg(): void {
        EngineUtil.localStorageSetItem("bg_audio", "0");
        this.bgOpen = 0;
    }

    getVibratorState(): boolean {
        return this.vibratorOpen == 1;
    }

    setBgmVolume(e?: number): void {
        if (this._bgAudios.bgm) {
            cc.audioEngine.setVolume(this._bgAudios.bgm, e || 0.2);
        }
    }

    playMusic(e: string, t: boolean = false, o: boolean = false, n?: (id: number) => void, i?: number): void {
        o = o != false;
        if ((this.effectOpen != 0 || o) && (this.bgOpen != 0 || !o)) {
            t = t != false;
            const a = "sound/" + e;
            cc.loader.loadRes(a, cc.AudioClip, (err: Error, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (o) {
                    this._bgAudios[e] = cc.audioEngine.playMusic(clip, t);
                    cc.audioEngine.setVolume(this._bgAudios[e], i || 1);
                    n && n(this._bgAudios[e]);
                } else {
                    this._effectAudioisPlayArray["isPlay_" + e] = true;
                    const s = clip.duration;
                    this.scheduleOnce(() => {
                        this._effectAudioisPlayArray["isPlay_" + e] = false;
                    }, s);
                    this._effectAudio[e] = cc.audioEngine.playEffect(clip, t);
                    n && n(this._effectAudio[e]);
                }
            });
        }
    }

    openVibrator(): void {
        EngineUtil.localStorageSetItem("vibratorOpen", "1");
        this.vibratorOpen = 1;
    }

    isMusicPlaying(): boolean {
        return cc.audioEngine.isMusicPlaying();
    }

    playNativeMusic(e: string): void {
        cc.log("playNativeAudio:>>" + e);
        if (cc.sys.isNative) {
            const t = this._nativeAudio.get(e);
            if (t) {
                SdkHelper.playNativeAudio(t);
            }
        } else {
            this.playMusic("native/" + e);
        }
    }

    openAudio(): void {
        EngineUtil.localStorageSetItem("effect_audio", "1");
        this.effectOpen = 1;
    }

    pauseMusic(e: string, t: boolean): void {
        t = t != false;
        if (t) {
            cc.audioEngine.pauseMusic();
        } else if (this._effectAudio.hasOwnProperty(e)) {
            cc.audioEngine.pause(this._effectAudio[e]);
        } else {
            console.warn(e, "cant pause");
        }
    }

    playUIClick(): void {
        this.playMusic("pool_ui_click");
    }

    initNativeUrl(): void {
        cc.resources.loadDir("sound/native", cc.AudioClip, (err: Error, clips: cc.AudioClip[]) => {
            if (err) {
                console.log(err.name, err.message, err.stack);
            } else {
                clips.forEach((clip) => {
                    cc.log("name:" + clip.name + "    ");
                    const uuid = cc.assetManager.utils.getUuidFromURL(clip.nativeUrl);
                    const url = cc.assetManager.utils.getUrlWithUuid(uuid, {
                        isNative: true,
                        nativeExt: ".mp3",
                    });
                    this._nativeAudio.set(clip.name, url);
                });
            }
        });
    }

    isPlaying(e: string): boolean {
        return this._effectAudioisPlayArray["isPlay_" + e];
    }

    set mute(e: boolean) {
        const t = e === true ? 0 : 1;
        cc.audioEngine.setMusicVolume(t);
        cc.audioEngine.setEffectsVolume(t);
    }
}
