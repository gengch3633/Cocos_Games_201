import AudioPlay from "./AudioPlay";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UiPageAnalyticsService from "./UiPageAnalyticsService";

const { ccclass } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {
    audioPlay: AudioPlay = null;

    onLoad(): void {
        this.audioPlay = this.node.getComponent(AudioPlay);
        UiPageAnalyticsService.trackEnter("home_page");
    }

    onDestroy(): void {
        UiPageAnalyticsService.trackLeave("home_page");
    }

    async example(): Promise<void> {
    }

    OnClickStart(): void {
        UIMgr.getInstance().show(UIDefine.gameView);
    }
}
