import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundToggleControl extends cc.Component {
    @property(cc.Toggle)
    toggle = null;

    @property(cc.Label)
    label = null;

    @property
    reverse = false;

    callback(e) {
        console.log("callback", e.isChecked);
        GlobalConfig.sound_toggle_set(e.isChecked);
        this.setLabel();
    }

    onLoad() {
        const e = GlobalConfig.sound_toggle_get();
        this.toggle.isChecked = e;
        this.setLabel();
        this.toggle.node.on("toggle", this.callback, this);
    }

    onDestroy() {}

    reset() {
        const e = GlobalConfig.sound_toggle_get();
        this.toggle.isChecked = e;
        this.setLabel();
    }

    setLabel() {
        this.label && (GlobalConfig.setting.sound_effect ? this.label.getComponent(cc.Label).string = "音效开" : this.label.getComponent(cc.Label).string = "音效关");
    }
}
