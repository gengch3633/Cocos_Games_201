import AudioMgr from "./AudioMgr";
import ResMgr from "./ResMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ AudioPlay ")
export default class AudioPlay extends cc.Component {
    @property([ cc.AudioClip ])
    clips: cc.AudioClip[] = [];

    @property
    bundle: any = null;

    effIds: number[] = [];
    musicId: number = -1;

    static get(e: cc.Node): AudioPlay {
        var t;
        return e.isValid ? null !== (t = e.getComponent(AudioPlay)) && void 0 !== t ? t : e.addComponent(AudioPlay) : null;
    }

    async playEffect(e: any, t?: any, i: number = 1, n: boolean = false): Promise<any> {
        var a;
        if (!e) return -1;
        a = this.clips.find(function (t) {
            return t.name == e;
        });
        if (a) return this.play(a, i, n);
        a = await this.loadClip(e, t);
        if (a) {
            this.clips.findIndex(function (t) {
                return t.name == e;
            }) < 0 && this.clips.push(a);
            return this.play(a, i, n);
        }
        return -1;
    }

    async play(e: any, t: number = 1, i: boolean = false): Promise<any> {
        var n, a, o = this;
        n = await AudioMgr.getInstance().playEffect(e, t, i);
        this.effIds.push(n);
        if (!i) {
            a = AudioMgr.getInstance().getDuration(n);
            this.scheduleOnce(function () {
                var e = o.effIds.indexOf(n);
                e >= 0 && o.effIds.splice(e, 1);
            }, a);
        }
        return n;
    }

    async playMusic(e: any, t: any = null): Promise<any> {
        var i, n, a;
        if (!e) return -1;
        i = this.clips.find(function (t) {
            return t.name == e;
        });
        if (i) {
            this.stopMusic();
            n = this;
            n.musicId = await AudioMgr.getInstance().playMusic(i);
            return this.musicId;
        }
        i = await this.loadClip(e, t);
        if (!i) return -1;
        this.clips.findIndex(function (t) {
            return t.name == e;
        }) < 0 && this.clips.push(i);
        this.stopMusic();
        a = this;
        a.musicId = await AudioMgr.getInstance().playMusic(i);
        return this.musicId;
    }

    async loadClip(e: string, t: any = null): Promise<any> {
        e.includes("/ ") || (e = " audio/ " + e);
        t || (t = this.bundle);
        return await ResMgr.getInstance().getKeeper(this, true).loadRes(e, cc.AudioClip, t);
    }

    stopAllEff() {
        var e = this;
        this.effIds.forEach(function (t) {
            return e.stop(t);
        });
    }

    stop(e: number) {
        cc.audioEngine.stopEffect(e);
    }

    stopMusic() {
        this.stop(this.musicId);
    }
}
