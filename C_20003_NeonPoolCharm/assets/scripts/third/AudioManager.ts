import EngineUtil from "./EngineUtil";
import SdkHelper from "./SdkHelper";

const { ccclass } = cc._decorator;

export const DEFAULT_BGM_NAME = "pool_1bgm";

@ccclass
export default class AudioManager extends cc.Component {

    vibratorOpen = 0;
    bgOpen = 0;
    effectOpen = 0;
    _bgAudios: any = {};
    _effectAudio: any = {};
    _effectAudioisPlayArray: any = {};
    _nativeAudio: Map<any, any> = new Map();

    static _instance: AudioManager = null;

    getAudioState() {
        return 1 == this.effectOpen;
    }

    getMusicState() {
        return 1 == this.bgOpen;
    }

    closeVibrator() {
        EngineUtil.localStorageSetItem("vibratorOpen", "0");
        this.vibratorOpen = 0;
    }

    openBg() {
        EngineUtil.localStorageSetItem("bg_audio", "1");
        this.bgOpen = 1;
    }

    resumeMusic(name, isMusic) {
        if (isMusic = 0 != isMusic) {
            if (0 == this.bgOpen) {
                return;
            }
            cc.audioEngine.resumeMusic();
        } else {
            if (0 == this.effectOpen) {
                return;
            }
            cc.audioEngine.resume(this._effectAudio[name]);
        }
    }

    closeAudio() {
        EngineUtil.localStorageSetItem("effect_audio", "0");
        this.effectOpen = 0;
    }

    stopMusic(name, isMusic) {
        if (isMusic = 0 != isMusic) {
            cc.audioEngine.stopMusic();
        } else if (this._effectAudio.hasOwnProperty(name)) {
            cc.audioEngine.stop(this._effectAudio[name]);
        } else {
            console.warn(name, "cant stop");
        }
    }

    init() {
        this._effectAudioisPlayArray = {};
        this.bgOpen = Number(EngineUtil.localStorageGetItem("bg_audio", "1"));
        this.effectOpen = Number(EngineUtil.localStorageGetItem("effect_audio", "1"));
        this.vibratorOpen = Number(EngineUtil.localStorageGetItem("vibratorOpen", "1"));
    }

    closeBg() {
        EngineUtil.localStorageSetItem("bg_audio", "0");
        this.bgOpen = 0;
    }

    getVibratorState() {
        return 1 == this.vibratorOpen;
    }

    setBgmVolume(volume) {
        if (this._bgAudios.bgm) {
            cc.audioEngine.setVolume(this._bgAudios.bgm, volume || .2);
        }
    }

    playMusic(name, loop = false, isMusic = false, callback?, volume?) {
        isMusic = 0 != isMusic;
        if ((0 != this.effectOpen || isMusic) && (0 != this.bgOpen || !isMusic)) {
            loop = 0 != loop;
            const path = "sound/" + name;
            const self = this;
            cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
                if (err) {
                    cc.error(err.message || err);
                } else if (isMusic) {
                    self._bgAudios[name] = cc.audioEngine.playMusic(clip, loop);
                    cc.audioEngine.setVolume(self._bgAudios[name], volume || 1);
                    if (callback) {
                        callback(self._bgAudios[name]);
                    }
                } else {
                    self._effectAudioisPlayArray["isPlay_" + name] = true;
                    const duration = clip.duration;
                    self.scheduleOnce(function () {
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

    openVibrator() {
        EngineUtil.localStorageSetItem("vibratorOpen", "1");
        this.vibratorOpen = 1;
    }

    isMusicPlaying() {
        return cc.audioEngine.isMusicPlaying();
    }

    playNativeMusic(name) {
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

    openAudio() {
        EngineUtil.localStorageSetItem("effect_audio", "1");
        this.effectOpen = 1;
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new AudioManager();
        }
        return this._instance;
    }

    pauseMusic(name, isMusic) {
        if (isMusic = 0 != isMusic) {
            cc.audioEngine.pauseMusic();
        } else if (this._effectAudio.hasOwnProperty(name)) {
            cc.audioEngine.pause(this._effectAudio[name]);
        } else {
            console.warn(name, "cant pause");
        }
    }

    playUIClick() {
        this.playMusic("pool_ui_click");
    }

    initNativeUrl() {
        const self = this;
        cc.resources.loadDir("sound/native", cc.AudioClip, function (err, clips) {
            if (err) {
                console.log(err.name, err.message, err.stack);
            } else {
                clips.forEach(function (clip) {
                    cc.log("name:" + clip.name + "    ");
                    const uuid = cc.assetManager.utils.getUuidFromURL(clip.nativeUrl);
                    const url = cc.assetManager.utils.getUrlWithUuid(uuid, {
                        isNative: true,
                        nativeExt: ".mp3"
                    });
                    self._nativeAudio.set(clip.name, url);
                });
            }
        });
    }

    isPlaying(name) {
        return this._effectAudioisPlayArray["isPlay_" + name];
    }

    set mute(value) {
        const volume = true === value ? 0 : 1;
        cc.audioEngine.setMusicVolume(volume);
        cc.audioEngine.setEffectsVolume(volume);
    }
}
