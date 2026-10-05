import * as GlobalConfig from "./GlobalConfig";
import * as BallLogicMgr from "./BallLogicMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicToggleControl extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property()
    reverse = false;

    setLabel(): void {
        if (this.label) {
            this.label.getComponent(cc.Label).string = GlobalConfig.setting.music_effect
                ? "音乐开"
                : "音乐关";
        }
    }

    callback(toggle: cc.Toggle): void {
        console.log("callback", toggle.isChecked);
        GlobalConfig.music_toggle_set(toggle.isChecked);
        this.setLabel();
        if (toggle.isChecked) {
            BallLogicMgr.playBgMusic();
        } else {
            BallLogicMgr.stopBgMusic();
        }
    }

    onDestroy(): void {}

    onLoad(): void {
        const checked = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = checked;
        this.setLabel();
        this.toggle.node.on("toggle", this.callback, this);
    }

    reset(): void {
        const checked = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = checked;
        this.setLabel();
    }
}
