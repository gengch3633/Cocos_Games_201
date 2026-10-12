import AudioMgr from "./AudioMgr";

const { ccclass, property, menu, requireComponent } = cc._decorator;

enum VoiceType {
    None = 0,
    Clip = 1,
    Url = 2
}

@ccclass
@requireComponent(cc.Label)
@menu("UI/Cocos/TypeWriter")
export default class TypeWriter extends cc.Component {

    public static EventType = {
        Complete: "TypeWriter_Complete"
    };

    @property({
        tooltip: "每个字出现的间隔"
    })
    public interval: number = 0.25;

    @property({
        type: cc.Enum(VoiceType)
    })
    public voiceType: VoiceType = VoiceType.None;

    @property({
        type: cc.AudioClip,
        tooltip: "绑定的语音",
        visible: function (this: TypeWriter) {
            return this.voiceType !== VoiceType.None;
        }
    })
    public voiceClip: cc.AudioClip = null;

    @property({
        tooltip: "绑定的语音资源包名",
        visible: function (this: TypeWriter) {
            return this.voiceType === VoiceType.Url;
        }
    })
    public voiceBundleName: string = "";

    @property({
        tooltip: "绑定的语音资源路径",
        visible: function (this: TypeWriter) {
            return this.voiceType === VoiceType.Url;
        }
    })
    public voiceUrl: string = "";

    public strArr: string[] = [];

    private _label: cc.Label = null;

    private _audioId: number = 0;

    public get label(): cc.Label {
        if (!this._label) {
            this._label = this.getComponent(cc.Label);
        }
        return this._label;
    }

    public get isCompleted(): boolean {
        return (this.strArr ? this.strArr.length : 0) <= 0;
    }

    public get audioId(): number {
        return this._audioId;
    }

    public show(str?: string, voice?: cc.AudioClip | string, bundleName: string = ""): void {
        str = str || this.label.string;
        if (!str) {
            console.warn("TypeWriter: str is empty");
            return;
        }

        this.strArr = str ? str.split("") : [];
        this.unscheduleAllCallbacks();
        this.label.string = "";

        if (voice) {
            if (typeof voice === "string") {
                this.voiceType = VoiceType.Url;
                this.voiceUrl = voice;
                this.voiceBundleName = bundleName;
            } else {
                this.voiceType = VoiceType.Clip;
                this.voiceClip = voice;
            }
        }

        if (this.voiceType !== VoiceType.None) {
            if (this.voiceType === VoiceType.Clip && this.voiceClip) {
                AudioMgr.getInstance().playEffect(this.voiceClip).then((id: number) => {
                    this._audioId = id;
                    if (this.isCompleted) {
                        AudioMgr.getInstance().stopEffect(id);
                    }
                });
            } else if (this.voiceType === VoiceType.Url && this.voiceUrl) {
                AudioMgr.getInstance().playEffect(this.voiceUrl, this.voiceBundleName).then((id: number) => {
                    this._audioId = id;
                    if (this.isCompleted) {
                        AudioMgr.getInstance().stopEffect(id);
                    }
                });
            }
        }

        this.showWord();
    }

    public showAll(): void {
        if (this.isCompleted) {
            return;
        }
        this.unscheduleAllCallbacks();
        this.label.string += this.strArr.join("");
        this.strArr.length = 0;
        AudioMgr.getInstance().stopEffect(this._audioId);
        this.node.emit(TypeWriter.EventType.Complete);
    }

    public showWord(): void {
        if (this.strArr.length <= 0) {
            this.node.emit(TypeWriter.EventType.Complete);
            return;
        }
        this.scheduleOnce(() => {
            this.showWord();
        }, this.interval);
        this.label.string += this.strArr.shift();
    }

    protected onDisable(): void {
        AudioMgr.getInstance().stopEffect(this._audioId);
    }
}