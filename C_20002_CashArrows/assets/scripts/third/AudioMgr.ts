import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UserAudioData from "./UserAudioData";

const defaultOption = {
    click: {
        success: "audio/click_common",
        fail: "audio/click_error",
        bundleName: "cocos-module-common",
    },
    bundleName: "common",
    effMaxRepeat: 10,
};

export default class AudioMgr extends Singleton {
    option = defaultOption;
    idMap = new Map<cc.AudioClip, number[]>();

    constructor() {
        super();
        this.musicMute = UserAudioData.getInstance().musicMute;
        this.effectMute = UserAudioData.getInstance().effectMute;
    }

    setGlobalOption(option: any): void {
        this.option = Object.assign({}, defaultOption, option);
    }

    async playEffect(
        clipOrPath: cc.AudioClip | string,
        bundleOrRepeat?: string | number,
        repeatOrLoop?: number | boolean,
        loop?: boolean
    ): Promise<number> {
        if (!clipOrPath) {
            return -1;
        }
        try {
            let clip: cc.AudioClip | null = null;
            let maxRepeat = this.option.effMaxRepeat;
            let isLoop = false;
            if (clipOrPath instanceof cc.AudioClip) {
                clip = clipOrPath;
                if (typeof bundleOrRepeat === "number") {
                    maxRepeat = bundleOrRepeat;
                }
                if (typeof repeatOrLoop === "boolean") {
                    isLoop = repeatOrLoop;
                }
            } else {
                const bundleName = typeof bundleOrRepeat === "string" ? bundleOrRepeat : this.option.bundleName;
                maxRepeat = typeof repeatOrLoop === "number" ? repeatOrLoop : maxRepeat;
                isLoop = typeof loop === "boolean" ? loop : false;
                clip = await ResMgr.getInstance().loadRes(clipOrPath, cc.AudioClip, null, bundleName);
            }
            return clip ? this.handlePlayEffect(clip, maxRepeat, isLoop) : -1;
        } catch (e) {
            console.error(e, clipOrPath, bundleOrRepeat, repeatOrLoop, loop);
            return -1;
        }
    }

    handlePlayEffect(clip: cc.AudioClip, maxRepeat: number, loop: boolean): number {
        const ids = this.idMap.get(clip) || [];
        if (ids.length >= maxRepeat) {
            return ids[0];
        }
        const audioId = cc.audioEngine.playEffect(clip, loop);
        ids.push(audioId);
        this.idMap.set(clip, ids);
        cc.audioEngine.setFinishCallback(audioId, () => {
            const currentIds = this.idMap.get(clip);
            if (currentIds && currentIds.length > 0) {
                const index = currentIds.indexOf(audioId);
                if (index > -1) {
                    currentIds.splice(index, 1);
                }
                if (currentIds.length === 0) {
                    this.idMap.delete(clip);
                }
            }
        });
        return audioId;
    }

    async playClickEff(success: boolean = true): Promise<number> {
        const path = success ? this.option.click.success : this.option.click.fail;
        return path ? this.playEffect(path, this.option.click.bundleName) : -1;
    }

    async playMusic(
        clipOrPath: cc.AudioClip | string,
        loopOrBundle?: boolean | string,
        _unused?: boolean
    ): Promise<number> {
        let loop = typeof loopOrBundle !== "boolean" || loopOrBundle;
        if (!clipOrPath) {
            return -1;
        }
        try {
            let clip: cc.AudioClip | null = null;
            if (clipOrPath instanceof cc.AudioClip) {
                clip = clipOrPath;
                loop = typeof loopOrBundle === "boolean" ? loopOrBundle : loop;
            } else {
                const bundleName = typeof loopOrBundle === "string" ? loopOrBundle : this.option.bundleName;
                clip = await ResMgr.getInstance().loadRes(clipOrPath, cc.AudioClip, null, bundleName);
            }
            if (clip) {
                return cc.audioEngine.playMusic(clip, loop);
            }
            console.error("AudioMgr.playMusic: clip is null", clipOrPath, loopOrBundle, _unused);
            return -1;
        } catch (e) {
            console.error(e);
            return -1;
        }
    }

    get musicMute(): boolean {
        return UserAudioData.getInstance().musicMute;
    }

    set musicMute(value: boolean) {
        UserAudioData.getInstance().musicMute = value;
        cc.audioEngine.setMusicVolume(value ? 0 : 1);
    }

    get effectMute(): boolean {
        return UserAudioData.getInstance().effectMute;
    }

    set effectMute(value: boolean) {
        UserAudioData.getInstance().effectMute = value;
        cc.audioEngine.setEffectsVolume(value ? 0 : 1);
    }

    pauseMusic(): void {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic(): void {
        cc.audioEngine.resumeMusic();
    }

    stopAllEffects(): void {
        cc.audioEngine.stopAllEffects();
        this.idMap.clear();
    }

    stopEffect(audioId: number): void {
        cc.audioEngine.stopEffect(audioId);
        this.idMap.forEach((ids, clip) => {
            const index = ids.indexOf(audioId);
            if (index >= 0) {
                ids.splice(index, 1);
                if (ids.length === 0) {
                    this.idMap.delete(clip);
                }
            }
        });
    }

    getTime(audioId: number): number {
        return cc.audioEngine.getCurrentTime(audioId);
    }

    getDuration(audioId: number): number {
        return cc.audioEngine.getDuration(audioId);
    }

    getState(audioId: number): cc.audioEngine.AudioState {
        return cc.audioEngine.getState(audioId);
    }
}
