import AudioMgr from "./AudioMgr";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/AudioPlay")
export default class AudioPlay extends cc.Component {
    @property([cc.AudioClip])
    clips: cc.AudioClip[] = [];

    @property
    bundle: string | null = null;

    effIds: number[] = [];
    musicId = -1;

    static get(node: cc.Node): AudioPlay | null {
        if (!node.isValid) {
            return null;
        }
        return node.getComponent(AudioPlay) || node.addComponent(AudioPlay);
    }

    async playEffect(name: string, bundle?: string, repeat = 1, loop = false): Promise<number> {
        if (!name) {
            return -1;
        }

        let clip = this.clips.find((item) => item.name === name);
        if (clip) {
            return this.play(clip, repeat, loop);
        }

        clip = await this.loadClip(name, bundle);
        if (!clip) {
            return -1;
        }
        if (this.clips.findIndex((item) => item.name === name) < 0) {
            this.clips.push(clip);
        }
        return this.play(clip, repeat, loop);
    }

    async play(clip: cc.AudioClip, repeat = 1, loop = false): Promise<number> {
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

    async playMusic(name: string, bundle: string | null = null): Promise<number> {
        if (!name) {
            return -1;
        }

        let clip = this.clips.find((item) => item.name === name);
        if (clip) {
            this.stopMusic();
            this.musicId = await AudioMgr.getInstance().playMusic(clip);
            return this.musicId;
        }

        clip = await this.loadClip(name, bundle);
        if (!clip) {
            return -1;
        }
        if (this.clips.findIndex((item) => item.name === name) < 0) {
            this.clips.push(clip);
        }
        this.stopMusic();
        this.musicId = await AudioMgr.getInstance().playMusic(clip);
        return this.musicId;
    }

    async loadClip(name: string, bundle: string | null = null): Promise<cc.AudioClip | null> {
        let path = name;
        if (!path.includes("/")) {
            path = "audio/" + path;
        }
        const bundleName = bundle || this.bundle;
        return ResMgr.getInstance().getKeeper(this, true).loadRes(path, cc.AudioClip, bundleName);
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
