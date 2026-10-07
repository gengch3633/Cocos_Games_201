import EngineUtil from "./EngineUtil";
import SdkHelper from "./SdkHelper";

const { ccclass } = cc._decorator;

export const DEFAULT_BGM_NAME = "pool_1bgm";

@ccclass
export class AudioManager extends cc.Component {
    vibratorOpen: number = 0;
    bgOpen: number = 0;
    effectOpen: number = 0;
    _bgAudios: Record<string, number> = {};
    _effectAudio: Record<string, number> = {};
    _effectAudioisPlayArray: Record<string, boolean> = {};
    _nativeAudio: Map<string, string> = new Map();

    static _instance: AudioManager = null;

    static getInstance(): AudioManager {
        if (!this._instance) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    getAudioState(): boolean {
        return this.effectOpen === 1;
    }

    getMusicState(): boolean {
        return this.bgOpen === 1;
    }

    closeVibrator(): void {
        EngineUtil.localStorageSetItem("vibratorOpen", "0");
        this.vibratorOpen = 0;
    }

    openBg(): void {
        EngineUtil.localStorageSetItem("bg_audio", "1");
        this.bgOpen = 1;
    }

    resumeMusic(name: string, isBgm: boolean): void {
        isBgm = isBgm !== false;
        if (isBgm) {
            if (this.bgOpen === 0) {
                return;
            }
            cc.audioEngine.resumeMusic();
        } else {
            if (this.effectOpen === 0) {
                return;
            }
            cc.audioEngine.resume(this._effectAudio[name]);
        }
    }

    closeAudio(): void {
        EngineUtil.localStorageSetItem("effect_audio", "0");
        this.effectOpen = 0;
    }

    stopMusic(name: string, isBgm: boolean): void {
        isBgm = isBgm !== false;
        if (isBgm) {
            cc.audioEngine.stopMusic();
        } else if (this._effectAudio.hasOwnProperty(name)) {
            cc.audioEngine.stop(this._effectAudio[name]);
        } else {
            console.warn(name, "cant stop");
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
        return this.vibratorOpen === 1;
    }

    setBgmVolume(volume?: number): void {
        if (this._bgAudios.bgm) {
            cc.audioEngine.setVolume(this._bgAudios.bgm, volume || 0.2);
        }
    }

    playMusic(
        name: string,
        loop: boolean = false,
        isBgm: boolean = false,
        callback?: (id: number) => void,
        volume?: number
    ): void {
        isBgm = isBgm !== false;
        if ((this.effectOpen !== 0 || isBgm) && (this.bgOpen !== 0 || !isBgm)) {
            loop = loop !== false;
            const path = "sound/" + name;
            const self = this;
            cc.loader.loadRes(path, cc.AudioClip, (err, clip: cc.AudioClip) => {
                if (err) {
                    cc.error(err.message || err);
                } else if (isBgm) {
                    self._bgAudios[name] = cc.audioEngine.playMusic(clip, loop);
                    cc.audioEngine.setVolume(self._bgAudios[name], volume || 1);
                    if (callback) {
                        callback(self._bgAudios[name]);
                    }
                } else {
                    self._effectAudioisPlayArray["isPlay_" + name] = true;
                    const duration = clip.duration;
                    self.scheduleOnce(() => {
                        self._effectAudioisPlayArray["isPlay_" + name] = false;
                    }, duration);
                    self._effectAudio[name] = cc.audioEngine.playEffect(clip, loop);
                    if (callback) {
                        callback(self._effectAudio[name]);
                    }
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

    playNativeMusic(name: string): void {
        cc.log("playNativeAudio:>>" + name);
        if (cc.sys.isNative) {
            const url = this._nativeAudio.get(name);
            if (url) {
                SdkHelper.playNativeAudio(url);
            }
        } else {
            this.playMusic("native/" + name);
        }
    }

    openAudio(): void {
        EngineUtil.localStorageSetItem("effect_audio", "1");
        this.effectOpen = 1;
    }

    pauseMusic(name: string, isBgm: boolean): void {
        isBgm = isBgm !== false;
        if (isBgm) {
            cc.audioEngine.pauseMusic();
        } else if (this._effectAudio.hasOwnProperty(name)) {
            cc.audioEngine.pause(this._effectAudio[name]);
        } else {
            console.warn(name, "cant pause");
        }
    }

    playUIClick(): void {
        this.playMusic("pool_ui_click");
    }

    initNativeUrl(): void {
        cc.resources.loadDir("sound/native", cc.AudioClip, (err, clips: cc.AudioClip[]) => {
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

    isPlaying(name: string): boolean {
        return this._effectAudioisPlayArray["isPlay_" + name];
    }

    set mute(value: boolean) {
        const vol = value === true ? 0 : 1;
        cc.audioEngine.setMusicVolume(vol);
        cc.audioEngine.setEffectsVolume(vol);
    }
}

export default AudioManager;
