import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicToggleControl extends cc.Component {
    @property(cc.Toggle)
    toggle = null;

    @property(cc.Label)
    label = null;

    @property
    reverse = false;

    setLabel() {
        if (this.label) {
            if (GlobalConfig.setting.music_effect) {
                this.label.getComponent(cc.Label).string = "音乐开";
            } else {
                this.label.getComponent(cc.Label).string = "音乐关";
            }
        }
    }

    callback(toggle) {
        console.log("callback", toggle.isChecked);
        GlobalConfig.music_toggle_set(toggle.isChecked);
        this.setLabel();
        if (toggle.isChecked) {
            BallLogicMgr.playBgMusic();
        } else {
            BallLogicMgr.stopBgMusic();
        }
    }

    onDestroy() {
    }

    onLoad() {
        const checked = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = checked;
        this.setLabel();
        this.toggle.node.on("toggle", this.callback, this);
    }

    reset() {
        const checked = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = checked;
        this.setLabel();
    }
}
