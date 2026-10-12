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

    public static get(node: cc.Node): AudioPlay {
        if (!node.isValid) return null;
        let comp = node.getComponent(AudioPlay);
        if (!comp) {
            comp = node.addComponent(AudioPlay);
        }
        return comp;
    }

    public async playEffect(name: string, bundle?: string, volume: number = 1, loop: boolean = false): Promise<number> {
        if (!name) return -1;
        let clip = this.clips.find(c => c.name === name);
        if (!clip) {
            clip = await this.loadClip(name, bundle);
            if (clip) {
                if (this.clips.findIndex(c => c.name === name) < 0) {
                    this.clips.push(clip);
                }
            } else {
                return -1;
            }
        }
        return this.play(clip, volume, loop);
    }

    public async play(clip: cc.AudioClip, volume: number = 1, loop: boolean = false): Promise<number> {
        const id = await AudioMgr.getInstance().playEffect(clip, volume, loop);
        this.effIds.push(id);
        if (!loop) {
            const duration = AudioMgr.getInstance().getDuration(id);
            this.scheduleOnce(() => {
                const index = this.effIds.indexOf(id);
                if (index >= 0) {
                    this.effIds.splice(index, 1);
                }
            }, duration);
        }
        return id;
    }

    public async playMusic(name: string, bundle: string = null): Promise<number> {
        if (!name) return -1;
        let clip = this.clips.find(c => c.name === name);
        if (clip) {
            this.stopMusic();
            this.musicId = await AudioMgr.getInstance().playMusic(clip);
            return this.musicId;
        } else {
            clip = await this.loadClip(name, bundle);
            if (clip) {
                if (this.clips.findIndex(c => c.name === name) < 0) {
                    this.clips.push(clip);
                }
                this.stopMusic();
                this.musicId = await AudioMgr.getInstance().playMusic(clip);
                return this.musicId;
            }
            return -1;
        }
    }

    public async loadClip(name: string, bundle: string = null): Promise<cc.AudioClip> {
        if (!name.includes("/")) {
            name = "audio/" + name;
        }
        if (!bundle) {
            bundle = this.bundle;
        }
        return await ResMgr.getInstance().getKeeper(this, true).loadRes(name, cc.AudioClip, bundle);
    }

    public stopAllEff(): void {
        this.effIds.forEach(id => this.stop(id));
    }

    public stop(id: number): void {
        cc.audioEngine.stopEffect(id);
    }

    public stopMusic(): void {
        this.stop(this.musicId);
    }
}