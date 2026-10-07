import AudioMgr from "./AudioMgr";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/AudioPlay")
export default class AudioPlay extends cc.Component {
    @property([cc.AudioClip])
    clips: cc.AudioClip[] = [];

    @property
    bundle: string = null;

    effIds: number[] = [];
    musicId: number = -1;

    static get(node: cc.Node): AudioPlay {
        if (!node.isValid) {
            return null;
        }
        return node.getComponent(AudioPlay) || node.addComponent(AudioPlay);
    }

    async playEffect(name: string, bundle?: string, repeat: number = 1, loop: boolean = false): Promise<number> {
        if (!name) {
            return -1;
        }
        let clip = this.clips.find((item) => item.name == name);
        if (clip) {
            return this.play(clip, repeat, loop);
        }
        clip = await this.loadClip(name, bundle);
        if (clip) {
            if (this.clips.findIndex((item) => item.name == name) < 0) {
                this.clips.push(clip);
            }
            return this.play(clip, repeat, loop);
        }
        return -1;
    }

    async play(clip: cc.AudioClip, repeat: number = 1, loop: boolean = false): Promise<number> {
        const audioId = await AudioMgr.getInstance().playEffect(clip, repeat, loop);
        this.effIds.push(audioId);
        if (!loop) {
            const duration = AudioMgr.getInstance().getDuration(audioId);
            this.scheduleOnce(() => {
                const index = this.effIds.indexOf(audioId);
                if (index >= 0) {
                    this.effIds.splice(index, 1);
                }
            }, duration);
        }
        return audioId;
    }

    async playMusic(name: string, bundle: string = null): Promise<number> {
        if (!name) {
            return -1;
        }
        let clip = this.clips.find((item) => item.name == name);
        if (clip) {
            this.stopMusic();
            this.musicId = await AudioMgr.getInstance().playMusic(clip);
            return this.musicId;
        }
        clip = await this.loadClip(name, bundle);
        if (clip) {
            if (this.clips.findIndex((item) => item.name == name) < 0) {
                this.clips.push(clip);
            }
            this.stopMusic();
            this.musicId = await AudioMgr.getInstance().playMusic(clip);
            return this.musicId;
        }
        return -1;
    }

    async loadClip(name: string, bundle: string = null): Promise<cc.AudioClip> {
        if (!name.includes("/")) {
            name = "audio/" + name;
        }
        if (!bundle) {
            bundle = this.bundle;
        }
        return ResMgr.getInstance().getKeeper(this, true).loadRes(name, cc.AudioClip, bundle);
    }

    stopAllEff(): void {
        this.effIds.forEach((id) => this.stop(id));
    }

    stop(audioId: number): void {
        cc.audioEngine.stopEffect(audioId);
    }

    stopMusic(): void {
        this.stop(this.musicId);
    }
}
