import AudioMgr from "./AudioMgr";

const { ccclass, property, menu, requireComponent } = cc._decorator;

enum VoiceType {
    None = 0,
    Clip = 1,
    Url = 2,
}

@ccclass
@requireComponent(cc.Label)
@menu("UI/Cocos/TypeWriter")
export default class TypeWriter extends cc.Component {
    static EventType = {
        Complete: "TypeWriter_Complete",
    };

    _label: cc.Label | null = null;

    @property({
        tooltip: "每个字出现的间隔",
    })
    interval = 0.25;

    @property({
        type: cc.Enum(VoiceType),
    })
    voiceType = VoiceType.None;

    @property({
        type: cc.AudioClip,
        tooltip: "绑定的语音",
        visible(this: TypeWriter) {
            return this.voiceType !== VoiceType.None;
        },
    })
    voiceClip: cc.AudioClip | null = null;

    @property({
        tooltip: "绑定的语音资源包名",
        visible(this: TypeWriter) {
            return this.voiceType === VoiceType.Url;
        },
    })
    voiceBundleName = "";

    @property({
        tooltip: "绑定的语音资源路径",
        visible(this: TypeWriter) {
            return this.voiceType === VoiceType.Url;
        },
    })
    voiceUrl = "";

    strArr: string[] = [];
    _audioId = 0;

    get label(): cc.Label {
        if (!this._label) {
            this._label = this.getComponent(cc.Label);
        }
        return this._label!;
    }

    get isCompleted(): boolean {
        return (this.strArr?.length ?? 0) <= 0;
    }

    get audioId(): number {
        return this._audioId;
    }

    show(text?: string, voice?: cc.AudioClip | string, bundleName?: string): void {
        text = text || this.label.string;
        if (!text) {
            console.warn("TypeWriter: str is empty");
            return;
        }
        this.strArr = text.split("") ?? [];
        this.unscheduleAllCallbacks();
        this.label.string = "";
        if (voice) {
            if (typeof voice === "string") {
                this.voiceType = VoiceType.Url;
                this.voiceUrl = voice;
                this.voiceBundleName = bundleName || "";
            } else {
                this.voiceType = VoiceType.Clip;
                this.voiceClip = voice;
            }
        }
        if (this.voiceType !== VoiceType.None) {
            if (this.voiceType === VoiceType.Clip && this.voiceClip) {
                AudioMgr.getInstance().playEffect(this.voiceClip).then((audioId) => {
                    this._audioId = audioId;
                    if (this.isCompleted) {
                        AudioMgr.getInstance().stopEffect(audioId);
                    }
                });
            } else if (this.voiceType === VoiceType.Url && this.voiceUrl) {
                AudioMgr.getInstance().playEffect(this.voiceUrl, this.voiceBundleName).then((audioId) => {
                    this._audioId = audioId;
                    if (this.isCompleted) {
                        AudioMgr.getInstance().stopEffect(audioId);
                    }
                });
            }
        }
        this.showWord();
    }

    showAll(): void {
        if (!this.isCompleted) {
            this.unscheduleAllCallbacks();
            this.label.string += this.strArr.join("");
            this.strArr.length = 0;
            AudioMgr.getInstance().stopEffect(this._audioId);
            this.node.emit(TypeWriter.EventType.Complete);
        }
    }

    showWord(): void {
        if (this.strArr.length <= 0) {
            this.node.emit(TypeWriter.EventType.Complete);
            return;
        }
        this.scheduleOnce(() => this.showWord(), this.interval);
        this.label.string += this.strArr.shift();
    }

    onDisable(): void {
        AudioMgr.getInstance().stopEffect(this._audioId);
    }
}
