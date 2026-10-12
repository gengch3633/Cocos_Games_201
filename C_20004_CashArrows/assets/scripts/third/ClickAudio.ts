import AudioMgr from "./AudioMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickAudio")
export default class ClickAudio extends cc.Component {

    @property(cc.AudioClip)
    public successClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    public failClip: cc.AudioClip = null;

    @property(cc.Boolean)
    public audio: boolean = true;

    public static addClickAudio(node: cc.Node): void {
        node.getComponents(cc.Button)
            .concat(node.getComponentsInChildren(cc.Button))
            .forEach((btn: cc.Button) => {
                return btn.getComponent(ClickAudio) ?? btn.addComponent(ClickAudio);
            });
    }

    protected onLoad(): void {
        if (this.getComponent(cc.Button)) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        }
    }

    protected touchEndHandle(): void {
        if (!this.enabled) {
            return;
        }
        const button = this.getComponent(cc.Button);
        if (button && (button.node.hasEventListener(cc.Button.EventType.CLICK) || button.clickEvents.length > 0)) {
            this.play(button.interactable);
        }
    }

    public play(interactable: boolean = true): void {
        if (!this.audio) {
            return;
        }
        const clip = interactable ? this.successClip : this.failClip;
        if (clip) {
            AudioMgr.getInstance().playEffect(clip);
        } else {
            AudioMgr.getInstance().playClickEff(interactable);
        }
    }
}