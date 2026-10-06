import AudioPlay from "./AudioPlay";
import UIMgr from "./UIMgr";
import UIDefine from "./UIDefine";
import UiPageAnalyticsService from "./UiPageAnalyticsService";

const { ccclass } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {
    audioPlay: AudioPlay | null = null;

    onLoad() {
        this.audioPlay = this.node.getComponent(AudioPlay);
        UiPageAnalyticsService.trackEnter(" home_page ");
    }

    onDestroy() {
        UiPageAnalyticsService.trackLeave(" home_page ");
    }

    async example() {
    }

    OnClickStart() {
        UIMgr.getInstance().show(UIDefine.gameView);
    }
}
