import AudioPlay from "./AudioPlay";
import GameView from "./gameView";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UiPageAnalyticsService from "./UiPageAnalyticsService";

const { ccclass } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {
    audioPlay: AudioPlay | null = null;

    onLoad(): void {
        this.audioPlay = this.node.getComponent(AudioPlay);
        UiPageAnalyticsService.trackEnter("home_page");
    }

    start(): void {
        const embedded = this.node.getChildByName("gameView");
        const hasEmbeddedView =
            !!embedded &&
            embedded.isValid &&
            (embedded.children.length > 0 || !!embedded.getComponent(GameView));
        if (!hasEmbeddedView) {
            console.warn("[Lobby] gameView prefab missing in scene, load via UIMgr");
            UIMgr.getInstance().show(UIDefine.gameView);
        }
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
