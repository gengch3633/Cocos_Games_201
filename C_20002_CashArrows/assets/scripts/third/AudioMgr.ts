import UserAudioData from "./UserAudioData";
import ResMgr from "./ResMgr";
import Singleton from "./Singleton";

const c = {
    click: {
        success: " audio/ click_common ",
        fail: " audio/ click_error ",
        bundleName: " cocos- module- common "
    },
    bundleName: " common ",
    effMaxRepeat: 10
};

export default class AudioMgr extends Singleton {
    option: any;
    idMap: Map<any, any>;
    musicMute: any;
    effectMute: any;

    constructor() {
        super();
        this.option = c;
        this.idMap = new Map();
        this.musicMute = UserAudioData.getInstance().musicMute;
        this.effectMute = UserAudioData.getInstance().effectMute;
    }

    setGlobalOption(e: any) {
        e = Object.assign(c, e);
        this.option = e;
    }

    async playEffect(e: any, t?: any, i?: any, n?: any): Promise<any> {
        if (!e) return -1;
        var a: any = null;
        var r = this.option.effMaxRepeat;
        var l = false;
        try {
            if (e instanceof cc.AudioClip) {
                a = e;
                " number " == typeof t && (r = t);
                " boolean " == typeof i && (l = i);
            } else {
                var bundle = " string " == typeof t ? t : this.option.bundleName;
                r = " number " == typeof i ? i : r;
                l = " boolean " == typeof n ? n : l;
                a = await ResMgr.getInstance().loadRes(e, cc.AudioClip, null, bundle);
            }
            return a ? this.handlePlayEffect(a, r, l) : -1;
        } catch (u) {
            console.error(u, e, t, i, n);
            return -1;
        }
    }

    handlePlayEffect(e: any, t: number, i: boolean) {
        var n = this, a = this.idMap.get(e) || [];
        if (a.length >= t) return a[0];
        var o = cc.audioEngine.playEffect(e, i);
        a.push(o);
        this.idMap.set(e, a);
        cc.audioEngine.setFinishCallback(o, function () {
            var t = n.idMap.get(e);
            if (t && !(t.length <= 0)) {
                var i = t.indexOf(o);
                i > -1 && t.splice(i, 1);
                0 === t.length && n.idMap.delete(e);
            }
        });
        return o;
    }

    async playClickEff(e: boolean = true): Promise<any> {
        var t;
        return (t = e ? this.option.click.success : this.option.click.fail) ? this.playEffect(t, this.option.click.bundleName) : -1;
    }

    async playMusic(e: any, t?: any, i: boolean = true): Promise<any> {
        if (!e) return -1;
        var n: any = " boolean " != typeof t || t;
        var a: any = null;
        try {
            if (e instanceof cc.AudioClip) {
                a = e;
                n = " boolean " == typeof t ? t : n;
            } else {
                var r = " string " == typeof t ? t : this.option.bundleName;
                a = await ResMgr.getInstance().loadRes(e, cc.AudioClip, null, r);
            }
            return a ? cc.audioEngine.playMusic(a, n) : (console.error(" AudioMgr.playMusic: clip is null ", e, t, i), -1);
        } catch (l) {
            console.error(l);
            return -1;
        }
    }

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    }

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    }

    stopAllEffects() {
        cc.audioEngine.stopAllEffects();
        this.idMap.clear();
    }

    stopEffect(e: number) {
        var t = this;
        cc.audioEngine.stopEffect(e);
        this.idMap.forEach(function (i: any, n: any) {
            var a = i.indexOf(e);
            if (!(a < 0)) {
                i.splice(a, 1);
                0 === i.length && t.idMap.delete(n);
            }
        });
    }

    getTime(e: number) {
        return cc.audioEngine.getCurrentTime(e);
    }

    getDuration(e: number) {
        return cc.audioEngine.getDuration(e);
    }

    getState(e: number) {
        return cc.audioEngine.getState(e);
    }
}

Object.defineProperty(AudioMgr.prototype, " musicMute ", {
    get: function () {
        return UserAudioData.getInstance().musicMute;
    },
    set: function (e: any) {
        UserAudioData.getInstance().musicMute = e;
        cc.audioEngine.setMusicVolume(e ? 0 : 1);
    },
    enumerable: false,
    configurable: true
});
Object.defineProperty(AudioMgr.prototype, " effectMute ", {
    get: function () {
        return UserAudioData.getInstance().effectMute;
    },
    set: function (e: any) {
        UserAudioData.getInstance().effectMute = e;
        cc.audioEngine.setEffectsVolume(e ? 0 : 1);
    },
    enumerable: false,
    configurable: true
});
