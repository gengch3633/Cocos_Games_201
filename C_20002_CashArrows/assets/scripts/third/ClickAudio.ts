import AudioMgr from "./AudioMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("UI/Cocos/Btn/ClickAudio")
export default class ClickAudio extends cc.Component {
    @property(cc.AudioClip)
    successClip: cc.AudioClip | null = null;

    @property(cc.AudioClip)
    failClip: cc.AudioClip | null = null;

    @property(cc.Boolean)
    audio = true;

    static addClickAudio(root: cc.Node): void {
        root.getComponents(cc.Button)
            .concat(root.getComponentsInChildren(cc.Button))
            .forEach((button) => {
                if (!button.getComponent(ClickAudio)) {
                    button.addComponent(ClickAudio);
                }
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
            if (button &&
                (button.node.hasEventListener(cc.Button.EventType.CLICK) || button.clickEvents.length > 0)) {
                this.play(button.interactable);
            }
        }
    }

    play(interactable: boolean = true): void {
        if (this.audio) {
            const clip = interactable ? this.successClip : this.failClip;
            if (clip) {
                AudioMgr.getInstance().playEffect(clip);
            } else {
                AudioMgr.getInstance().playClickEff(interactable);
            }
        }
    }
}
