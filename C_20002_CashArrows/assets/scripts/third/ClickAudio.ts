import AudioMgr from "./AudioMgr";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu(" UI/ Cocos/ Btn/ ClickAudio ")
export default class ClickAudio extends cc.Component {
    @property(cc.AudioClip)
    successClip: cc.AudioClip = null;

    @property(cc.AudioClip)
    failClip: cc.AudioClip = null;

    @property(cc.Boolean)
    audio: boolean = true;

    static addClickAudio(e: cc.Node) {
        e.getComponents(cc.Button).concat(e.getComponentsInChildren(cc.Button)).forEach(function (e) {
            var t;
            return null !== (t = e.getComponent(ClickAudio)) && void 0 !== t ? t : e.addComponent(ClickAudio);
        });
    }

    onLoad() {
        this.getComponent(cc.Button) && this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndHandle, this);
    }

    touchEndHandle() {
        if (this.enabled) {
            var e = this.getComponent(cc.Button);
            e && (e.node.hasEventListener(cc.Button.EventType.CLICK) || e.clickEvents.length > 0) && this.play(e.interactable);
        }
    }

    play(e: boolean = true) {
        if (this.audio) {
            var t = e ? this.successClip : this.failClip;
            t ? AudioMgr.getInstance().playEffect(t) : AudioMgr.getInstance().playClickEff(e);
        }
    }
}
