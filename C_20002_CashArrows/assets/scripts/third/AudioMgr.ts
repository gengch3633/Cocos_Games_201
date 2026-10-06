import UserAudioData from "./UserAudioData";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";

const DEFAULT_OPTION = {
    click: {
        success: "audio/click_common",
        fail: "audio/click_error",
        bundleName: "cocos-module-common",
    },
    bundleName: "common",
    effMaxRepeat: 10,
};

type AudioOption = typeof DEFAULT_OPTION;

export default class AudioMgr extends Singleton {
    option: AudioOption = DEFAULT_OPTION;
    idMap = new Map<cc.AudioClip, number[]>();

    setGlobalOption(option: Partial<AudioOption>): void {
        this.option = Object.assign({}, DEFAULT_OPTION, option);
    }

    async playEffect(
        clipOrPath: string | cc.AudioClip,
        bundleOrRepeat?: string | number,
        repeatOrLoop?: number | boolean,
        loop?: boolean,
    ): Promise<number> {
        if (!clipOrPath) {
            return -1;
        }

        try {
            let clip: cc.AudioClip | null = null;
            let maxRepeat = this.option.effMaxRepeat;
            let shouldLoop = false;

            if (clipOrPath instanceof cc.AudioClip) {
                clip = clipOrPath;
                if (typeof bundleOrRepeat === "number") {
                    maxRepeat = bundleOrRepeat;
                }
                if (typeof repeatOrLoop === "boolean") {
                    shouldLoop = repeatOrLoop;
                }
            } else {
                const bundleName = typeof bundleOrRepeat === "string" ? bundleOrRepeat : this.option.bundleName;
                maxRepeat = typeof repeatOrLoop === "number" ? repeatOrLoop : maxRepeat;
                shouldLoop = typeof loop === "boolean" ? loop : false;
                clip = await ResMgr.getInstance().loadRes(clipOrPath, cc.AudioClip, null, bundleName);
            }

            return clip ? this.handlePlayEffect(clip, maxRepeat, shouldLoop) : -1;
        } catch (error) {
            console.error(error, clipOrPath, bundleOrRepeat, repeatOrLoop, loop);
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

    async playClickEff(isSuccess = true): Promise<number> {
        const clipPath = isSuccess ? this.option.click.success : this.option.click.fail;
        return clipPath ? this.playEffect(clipPath, this.option.click.bundleName) : -1;
    }

    async playMusic(
        clipOrPath: string | cc.AudioClip,
        bundleOrLoop?: string | boolean,
        loop = true,
    ): Promise<number> {
        if (!clipOrPath) {
            return -1;
        }

        try {
            let shouldLoop = typeof bundleOrLoop !== "boolean" || bundleOrLoop;
            let clip: cc.AudioClip | null = null;

            if (clipOrPath instanceof cc.AudioClip) {
                clip = clipOrPath;
                if (typeof bundleOrLoop === "boolean") {
                    shouldLoop = bundleOrLoop;
                }
            } else {
                const bundleName = typeof bundleOrLoop === "string" ? bundleOrLoop : this.option.bundleName;
                clip = await ResMgr.getInstance().loadRes(clipOrPath, cc.AudioClip, null, bundleName);
            }

            if (!clip) {
                console.error("AudioMgr.playMusic: clip is null", clipOrPath, bundleOrLoop, loop);
                return -1;
            }
            return cc.audioEngine.playMusic(clip, shouldLoop);
        } catch (error) {
            console.error(error);
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

    getState(audioId: number): number {
        return cc.audioEngine.getState(audioId);
    }
}
