import AudioMgr from "./AudioMgr";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/AudioPlay")
export default class AudioPlay extends cc.Component {
    @property([cc.AudioClip])
    public clips: cc.AudioClip[] = [];

    @property
    public bundle: string = null;

    private effIds: number[] = [];
    private musicId: number = -1;

    public static get(target: cc.Node): AudioPlay {
        if (!target.isValid) {
            return null;
        }
        return target.getComponent(AudioPlay) || target.addComponent(AudioPlay);
    }

    public async playEffect(name: string, bundle?: string, maxRepeat: number = 1, loop: boolean = false): Promise<number> {
        if (!name) {
            return -1;
        }
        let clip = this.clips.find(function (item: cc.AudioClip): boolean {
            return item.name == name;
        });
        if (clip) {
            return this.play(clip, maxRepeat, loop);
        }
        clip = await this.loadClip(name, bundle);
        if (!clip) {
            return -1;
        }
        if (this.clips.findIndex(function (item: cc.AudioClip): boolean {
            return item.name == name;
        }) < 0) {
            this.clips.push(clip);
        }
        return this.play(clip, maxRepeat, loop);
    }

    private async play(clip: cc.AudioClip, maxRepeat: number = 1, loop: boolean = false): Promise<number> {
        const self = this;
        const audioId = await AudioMgr.getInstance().playEffect(clip, maxRepeat, loop);
        this.effIds.push(audioId);
        if (!loop) {
            const duration = AudioMgr.getInstance().getDuration(audioId);
            this.scheduleOnce(function (): void {
                const index = self.effIds.indexOf(audioId);
                if (index >= 0) {
                    self.effIds.splice(index, 1);
                }
            }, duration);
        }
        return audioId;
    }

    public async playMusic(name: string, bundle: string = null): Promise<number> {
        if (!name) {
            return -1;
        }
        let clip = this.clips.find(function (item: cc.AudioClip): boolean {
            return item.name == name;
        });
        if (clip) {
            this.stopMusic();
            this.musicId = await AudioMgr.getInstance().playMusic(clip);
            return this.musicId;
        }
        clip = await this.loadClip(name, bundle);
        if (!clip) {
            return -1;
        }
        if (this.clips.findIndex(function (item: cc.AudioClip): boolean {
            return item.name == name;
        }) < 0) {
            this.clips.push(clip);
        }
        this.stopMusic();
        this.musicId = await AudioMgr.getInstance().playMusic(clip);
        return this.musicId;
    }

    private async loadClip(name: string, bundle: string = null): Promise<cc.AudioClip> {
        if (!name.includes("/")) {
            name = "audio/" + name;
        }
        if (!bundle) {
            bundle = this.bundle;
        }
        return await ResMgr.getInstance().getKeeper(this, true).loadRes(name, cc.AudioClip, bundle);
    }

    public stopAllEff(): void {
        const self = this;
        this.effIds.forEach(function (audioId: number): void {
            self.stop(audioId);
        });
    }

    public stop(audioId: number): void {
        cc.audioEngine.stopEffect(audioId);
    }

    public stopMusic(): void {
        this.stop(this.musicId);
    }
}