import ResMgr from "./ResMgr";
import Singleton from "./Singleton";

declare function require(path: string): any;

function userAudioData(): any {
    return require("./UserAudioData").default;
}

interface AudioClickOption {
    success: string;
    fail: string;
    bundleName: string;
}

interface AudioOption {
    click: AudioClickOption;
    bundleName: string;
    effMaxRepeat: number;
}

const DEFAULT_OPTION: AudioOption = {
    click: {
        success: "audio/click_common",
        fail: "audio/click_error",
        bundleName: "cocos-module-common"
    },
    bundleName: "common",
    effMaxRepeat: 10
};

export default class AudioMgr extends Singleton {
    public option: AudioOption = DEFAULT_OPTION;

    private idMap: Map<cc.AudioClip, number[]> = new Map();

    constructor() {
        super();
        this.musicMute = userAudioData().getInstance().musicMute;
        this.effectMute = userAudioData().getInstance().effectMute;
    }

    public setGlobalOption(option: Partial<AudioOption>): void {
        this.option = Object.assign(DEFAULT_OPTION, option) as AudioOption;
    }

    public async playEffect(clip: cc.AudioClip, repeat?: number, loop?: boolean): Promise<number>;
    public async playEffect(clip: string, bundleName?: string, repeat?: number, loop?: boolean): Promise<number>;
    public async playEffect(
        clip: cc.AudioClip | string,
        bundleNameOrRepeat?: string | number,
        repeatOrLoop?: number | boolean,
        loop?: boolean
    ): Promise<number> {
        if (!clip) return -1;

        let audioClip: cc.AudioClip = null;
        let repeat: number = this.option.effMaxRepeat;
        let shouldLoop = false;

        try {
            if (clip instanceof cc.AudioClip) {
                audioClip = clip;
                if (typeof bundleNameOrRepeat === "number") repeat = bundleNameOrRepeat;
                if (typeof repeatOrLoop === "boolean") shouldLoop = repeatOrLoop;
            } else {
                const bundleName = typeof bundleNameOrRepeat === "string"
                    ? bundleNameOrRepeat
                    : this.option.bundleName;
                if (typeof repeatOrLoop === "number") repeat = repeatOrLoop;
                if (typeof loop === "boolean") shouldLoop = loop;

                audioClip = await ResMgr.getInstance().loadRes(clip, cc.AudioClip, null, bundleName);
            }

            if (audioClip) {
                return this.handlePlayEffect(audioClip, repeat, shouldLoop);
            }
            return -1;
        } catch (err) {
            console.error(err, clip, bundleNameOrRepeat, repeatOrLoop, loop);
            return -1;
        }
    }

    private handlePlayEffect(clip: cc.AudioClip, repeat: number, loop: boolean): number {
        const ids = this.idMap.get(clip) || [];
        if (ids.length >= repeat) return ids[0];

        const audioId = cc.audioEngine.playEffect(clip, loop);
        ids.push(audioId);
        this.idMap.set(clip, ids);

        cc.audioEngine.setFinishCallback(audioId, () => {
            const list = this.idMap.get(clip);
            if (list && list.length > 0) {
                const idx = list.indexOf(audioId);
                if (idx > -1) list.splice(idx, 1);
                if (list.length === 0) this.idMap.delete(clip);
            }
        });

        return audioId;
    }

    public async playClickEff(success: boolean = true): Promise<number> {
        const clip = success ? this.option.click.success : this.option.click.fail;
        return clip ? this.playEffect(clip, this.option.click.bundleName) : -1;
    }

    public async playMusic(clip: cc.AudioClip, loop?: boolean): Promise<number>;
    public async playMusic(clip: string, bundleName?: string, loop?: boolean): Promise<number>;
    public async playMusic(
        clip: cc.AudioClip | string,
        bundleNameOrLoop?: string | boolean,
        loop: boolean = true
    ): Promise<number> {
        if (!clip) return -1;

        let shouldLoop: boolean = typeof bundleNameOrLoop !== "boolean" || bundleNameOrLoop;
        let audioClip: cc.AudioClip = null;

        try {
            if (clip instanceof cc.AudioClip) {
                audioClip = clip;
                if (typeof bundleNameOrLoop === "boolean") shouldLoop = bundleNameOrLoop;
            } else {
                const bundleName = typeof bundleNameOrLoop === "string"
                    ? bundleNameOrLoop
                    : this.option.bundleName;
                audioClip = await ResMgr.getInstance().loadRes(clip, cc.AudioClip, null, bundleName);
            }

            if (audioClip) {
                return cc.audioEngine.playMusic(audioClip, shouldLoop);
            }
            console.error("AudioMgr.playMusic: clip is null", clip, bundleNameOrLoop, loop);
            return -1;
        } catch (err) {
            console.error(err);
            return -1;
        }
    }

    public get musicMute(): boolean {
        return userAudioData().getInstance().musicMute;
    }

    public set musicMute(value: boolean) {
        userAudioData().getInstance().musicMute = value;
        cc.audioEngine.setMusicVolume(value ? 0 : 1);
    }

    public get effectMute(): boolean {
        return userAudioData().getInstance().effectMute;
    }

    public set effectMute(value: boolean) {
        userAudioData().getInstance().effectMute = value;
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
        cc.audioEngine.stopEffect(audioId);
        this.idMap.forEach((ids, clip) => {
            const idx = ids.indexOf(audioId);
            if (idx < 0) return;
            ids.splice(idx, 1);
            if (ids.length === 0) this.idMap.delete(clip);
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