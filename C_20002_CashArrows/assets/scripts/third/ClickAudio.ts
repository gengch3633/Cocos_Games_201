import AudioMgr from "./AudioMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickAudio")
export default class ClickAudio extends cc.Component {
    @property(cc.AudioClip)
    successClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    failClip: cc.AudioClip = null;

    @property(cc.Boolean)
    audio: boolean = true;

    static addClickAudio(node: cc.Node): void {
        node.getComponents(cc.Button).concat(node.getComponentsInChildren(cc.Button)).forEach((button) => {
            button.getComponent(ClickAudio) || button.addComponent(ClickAudio);
        });
    }

    onLoad(): void {
        if (this.getComponent(cc.Button)) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
        }
    }

    touchEndHandle(): void {
        if (this.enabled) {
            const button = this.getComponent(cc.Button);
            if (button && (button.node.hasEventListener(cc.Button.EventType.CLICK) || button.clickEvents.length > 0)) {
                this.play(button.interactable);
            }
        }
    }

    play(success: boolean = true): void {
        if (this.audio) {
            const clip = success ? this.successClip : this.failClip;
            if (clip) {
                AudioMgr.getInstance().playEffect(clip);
            } else {
                AudioMgr.getInstance().playClickEff(success);
            }
        }
    }
}
