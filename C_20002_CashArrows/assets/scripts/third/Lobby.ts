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
        this.scheduleOnce(() => {
            this.enterGameView();
        }, 0);
    }

    enterGameView(): void {
        const uiMgr = UIMgr.getInstance();
        if (uiMgr.isShow(UIDefine.gameView)) {
            return;
        }
        console.log("[Lobby] auto open gameView");
        uiMgr.show(UIDefine.gameView);
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
