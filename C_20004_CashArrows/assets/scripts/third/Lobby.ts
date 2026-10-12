import AudioPlay from "./AudioPlay";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UiPageAnalyticsService from "./UiPageAnalyticsService.js";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {
    private audioPlay: AudioPlay | null = null;

    protected onLoad(): void {
        this.audioPlay = this.node.getComponent(AudioPlay);
        UiPageAnalyticsService.trackEnter("home_page");
    }

    protected onDestroy(): void {
        UiPageAnalyticsService.trackLeave("home_page");
    }

    public async example(): Promise<void> {
    }

    public OnClickStart(): void {
        UIMgr.getInstance().show(UIDefine.gameView);
    }
}