import AudioMgr from "./AudioMgr";

const { ccclass, property, menu, requireComponent } = cc._decorator;

enum VoiceType {
    None = 0,
    Clip = 1,
    Url = 2
}

@ccclass
@requireComponent(cc.Label)
@menu(" UI/ Cocos/ TypeWriter ")
export default class TypeWriter extends cc.Component {
    _label: cc.Label = null;

    @property({
        tooltip: " 每个字出现的间隔 "
    })
    interval = .25;

    @property({
        type: cc.Enum(VoiceType)
    })
    voiceType = VoiceType.None;

    @property({
        type: cc.AudioClip,
        tooltip: " 绑定的语音 ",
        visible() {
            return this.voiceType !== VoiceType.None;
        }
    })
    voiceClip: cc.AudioClip = null;

    @property({
        tooltip: " 绑定的语音资源包名 ",
        visible() {
            return this.voiceType === VoiceType.Url;
        }
    })
    voiceBundleName: string = " ";

    @property({
        tooltip: " 绑定的语音资源路径 ",
        visible() {
            return this.voiceType === VoiceType.Url;
        }
    })
    voiceUrl: string = " ";

    strArr: string[] = [];
    _audioId = 0;

    static EventType = {
        Complete: " TypeWriter_Complete "
    };

    get label(): cc.Label {
        this._label || (this._label = this.getComponent(cc.Label));
        return this._label;
    }

    get isCompleted(): boolean {
        var arr, len;
        return (null !== (len = null === (arr = null == this ? void 0 : this.strArr) || void 0 === arr ? void 0 : arr.length) && void 0 !== len ? len : 0) <= 0;
    }

    get audioId() {
        return this._audioId;
    }

    show(str?: string, voice?: any, bundleName?: string) {
        var parts, self = this;
        if (str = str || this.label.string) {
            this.strArr = null !== (parts = null == str ? void 0 : str.split(" ")) && void 0 !== parts ? parts : [];
            this.unscheduleAllCallbacks();
            this.label.string = " ";
            voice && ("string" == typeof voice ? (this.voiceType = VoiceType.Url, this.voiceUrl = voice, this.voiceBundleName = bundleName) : (this.voiceType = VoiceType.Clip, this.voiceClip = voice));
            this.voiceType !== VoiceType.None && (this.voiceType === VoiceType.Clip && this.voiceClip ? AudioMgr.getInstance().playEffect(this.voiceClip).then(function (id) {
                self._audioId = id;
                self.isCompleted && AudioMgr.getInstance().stopEffect(id);
            }) : this.voiceType === VoiceType.Url && this.voiceUrl && AudioMgr.getInstance().playEffect(this.voiceUrl, this.voiceBundleName).then(function (id) {
                self._audioId = id;
                self.isCompleted && AudioMgr.getInstance().stopEffect(id);
            }));
            this.showWord();
        } else {
            console.warn(" TypeWriter: str is empty ");
        }
    }

    showAll() {
        if (!this.isCompleted) {
            this.unscheduleAllCallbacks();
            this.label.string += this.strArr.join(" ");
            this.strArr.length = 0;
            AudioMgr.getInstance().stopEffect(this._audioId);
            this.node.emit(TypeWriter.EventType.Complete);
        }
    }

    showWord() {
        var self = this;
        if (this.strArr.length <= 0) {
            this.node.emit(TypeWriter.EventType.Complete);
        } else {
            this.scheduleOnce(function () {
                return self.showWord();
            }, this.interval);
            this.label.string += this.strArr.shift();
        }
    }

    onDisable() {
        AudioMgr.getInstance().stopEffect(this._audioId);
    }
}
