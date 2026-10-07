import BallLogicMgr from "./BallLogicMgr";
import GlobalConfig from "./GlobalConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicToggleControl extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    reverse = false;

    setLabel(): void {
        this.label &&
            (GlobalConfig.setting.music_effect
                ? (this.label.getComponent(cc.Label).string = "音乐开")
                : (this.label.getComponent(cc.Label).string = "音乐关"));
    }

    callback(e: cc.Toggle): void {
        console.log("callback", e.isChecked);
        GlobalConfig.music_toggle_set(e.isChecked);
        this.setLabel();
        e.isChecked ? BallLogicMgr.playBgMusic() : BallLogicMgr.stopBgMusic();
    }

    onDestroy(): void {}

    onLoad(): void {
        const e = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = e;
        this.setLabel();
        this.toggle.node.on("toggle", this.callback, this);
    }

    reset(): void {
        const e = GlobalConfig.music_toggle_get();
        this.toggle.isChecked = e;
        this.setLabel();
    }
}
