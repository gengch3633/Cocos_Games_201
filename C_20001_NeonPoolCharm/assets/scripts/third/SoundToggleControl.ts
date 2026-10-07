import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundToggleControl extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    reverse = false;

    callback(toggle: cc.Toggle): void {
        console.log("callback", toggle.isChecked);
        GlobalConfig.sound_toggle_set(toggle.isChecked);
        this.setLabel();
    }

    onLoad(): void {
        const isChecked = GlobalConfig.sound_toggle_get();
        this.toggle.isChecked = isChecked;
        this.setLabel();
        this.toggle.node.on("toggle", this.callback, this);
    }

    onDestroy(): void {
    }

    reset(): void {
        const isChecked = GlobalConfig.sound_toggle_get();
        this.toggle.isChecked = isChecked;
        this.setLabel();
    }

    setLabel(): void {
        this.label &&
            (GlobalConfig.setting.sound_effect
                ? (this.label.getComponent(cc.Label).string = "音效开")
                : (this.label.getComponent(cc.Label).string = "音效关"));
    }
}
