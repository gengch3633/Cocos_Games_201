import ResMgr from "./ResMgr";
import Singleton from "./Singleton";
import UserAudioData from "./UserAudioData";

interface AudioGlobalOption {
    click: {
        success: string;
        fail: string;
        bundleName: string;
    };
    bundleName: string;
    effMaxRepeat: number;
}

const DEFAULT_OPTION: AudioGlobalOption = {
    click: {
        success: "audio/click_common",
        fail: "audio/click_error",
        bundleName: "cocos-module-common"
    },
    bundleName: "common",
    effMaxRepeat: 10
};

export default class AudioMgr extends Singleton {
    public option: AudioGlobalOption = DEFAULT_OPTION;
    private idMap: Map<cc.AudioClip, number[]> = new Map<cc.AudioClip, number[]>();
    public musicMute: boolean = UserAudioData.getInstance().musicMute;
    public effectMute: boolean = UserAudioData.getInstance().effectMute;

    public constructor() {
        super();
        this.option = DEFAULT_OPTION;
        this.idMap = new Map();
    }

    public setGlobalOption(option: Partial<AudioGlobalOption>): void {
        this.option = Object.assign(DEFAULT_OPTION, option);
    }

    public async playEffect(clip: cc.AudioClip | string, bundleName?: string, loop?: boolean, forceBundleName?: string): Promise<number> {
        if (!clip) {
            return -1;
        }
        let audioClip: cc.AudioClip = null;
        let maxRepeat = this.option.effMaxRepeat;
        let isLoop = false;
        try {
            if (clip instanceof cc.AudioClip) {
                audioClip = clip;
                if (typeof bundleName === "number") {
                    maxRepeat = bundleName;
                }
                if (typeof loop === "boolean") {
                    isLoop = loop;
                }
            } else {
                const bundle = typeof bundleName === "string" ? bundleName : this.option.bundleName;
                maxRepeat = typeof loop === "number" ? loop : maxRepeat;
                isLoop = typeof forceBundleName === "boolean" ? forceBundleName : isLoop;
                audioClip = await ResMgr.getInstance().loadRes(clip as string, cc.AudioClip, null, bundle);
            }
            return audioClip ? this.handlePlayEffect(audioClip, maxRepeat, isLoop) : -1;
        } catch (e) {
            console.error(e, clip, bundleName, loop, forceBundleName);
            return -1;
        }
    }

    private handlePlayEffect(clip: cc.AudioClip, maxRepeat: number, loop: boolean): number {
        const self = this;
        const ids = this.idMap.get(clip) || [];
        if (ids.length >= maxRepeat) {
            return ids[0];
        }
        const audioId = cc.audioEngine.playEffect(clip, loop);
        ids.push(audioId);
        this.idMap.set(clip, ids);
        cc.audioEngine.setFinishCallback(audioId, function (): void {
            const list = self.idMap.get(clip);
            if (list && !(list.length <= 0)) {
                const index = list.indexOf(audioId);
                if (index > -1) {
                    list.splice(index, 1);
                }
                if (0 === list.length) {
                    self.idMap.delete(clip);
                }
            }
        });
        return audioId;
    }

    public async playClickEff(isSuccess: boolean = true): Promise<number> {
        const path = isSuccess ? this.option.click.success : this.option.click.fail;
        return path ? this.playEffect(path, this.option.click.bundleName) : -1;
    }

    public async playMusic(clip: cc.AudioClip | string, bundleName?: any, loop: boolean = true): Promise<number> {
        if (!clip) {
            return -1;
        }
        let shouldLoop = typeof bundleName !== "boolean" || bundleName;
        let audioClip: cc.AudioClip = null;
        try {
            if (clip instanceof cc.AudioClip) {
                audioClip = clip;
                shouldLoop = typeof bundleName === "boolean" ? bundleName : shouldLoop;
            } else {
                const bundle = typeof bundleName === "string" ? bundleName : this.option.bundleName;
                audioClip = await ResMgr.getInstance().loadRes(clip as string, cc.AudioClip, null, bundle);
            }
            if (!audioClip) {
                console.error("AudioMgr.playMusic: clip is null", clip, bundleName, loop);
                return -1;
            }
            return cc.audioEngine.playMusic(audioClip, shouldLoop);
        } catch (e) {
            console.error(e);
            return -1;
        }
    }

    public get musicMuteValue(): boolean {
        return UserAudioData.getInstance().musicMute;
    }

    public set musicMuteValue(value: boolean) {
        UserAudioData.getInstance().musicMute = value;
        cc.audioEngine.setMusicVolume(value ? 0 : 1);
    }

    public get effectMuteValue(): boolean {
        return UserAudioData.getInstance().effectMute;
    }

    public set effectMuteValue(value: boolean) {
        UserAudioData.getInstance().effectMute = value;
        cc.audioEngine.setEffectsVolume(value ? 0 : 1);
    }

    public pauseMusic(): void {
        cc.audioEngine.pauseMusic();
    }

    public resumeMusic(): void {
        cc.audioEngine.resumeMusic();
    }

    public stopAllEffects(): void {
        cc.audioEngine.stopAllEffects();
        this.idMap.clear();
    }

    public stopEffect(audioId: number): void {
        const self = this;
        cc.audioEngine.stopEffect(audioId);
        this.idMap.forEach(function (ids: number[], clip: cc.AudioClip): void {
            const index = ids.indexOf(audioId);
            if (!(index < 0)) {
                ids.splice(index, 1);
                if (0 === ids.length) {
                    self.idMap.delete(clip);
                }
            }
        });
    }

    public getTime(audioId: number): number {
        return cc.audioEngine.getCurrentTime(audioId);
    }

    public getDuration(audioId: number): number {
        return cc.audioEngine.getDuration(audioId);
    }

    public getState(audioId: number): number {
        return cc.audioEngine.getState(audioId);
    }
}