import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import HotUpdate from "./HotUpdate";
import PageMgr from "./PageMgr";
import SdkHelper from "./SdkHelper";
import { GAME_NAME } from "./SystemConfig";

class FrameworkManager {
    static _interface: FrameworkManager = null;

    error(...args: any[]): void {
        if (!HotUpdate.getInstance().isOnlineRelease()) {
            if (cc.sys.isNative) {
                try {
                    console.error(GAME_NAME, JSON.stringify(args));
                } catch (e) {
                    console.error(GAME_NAME, e);
                }
            } else {
                console.error(GAME_NAME, args);
            }
        }
    }

    httpErr(e: any): void {
        this.log(e);
        SdkHelper.showToast(i18n.t("network_toast"));
        SdkHelper.reportData("httpErr", {
            response: JSON.stringify(e),
        });
    }

    reconnectFai(): void {
        PageMgr.hidePage("LoadingPage");
    }

    log(...args: any[]): void {
        if (cc.sys.isNative) {
            try {
                console.log(GAME_NAME, JSON.stringify(args));
            } catch (e) {
                console.error(GAME_NAME, e);
            }
        } else {
            console.log(GAME_NAME, args);
        }
    }

    static _getInterface(): FrameworkManager {
        FrameworkManager._interface || (FrameworkManager._interface = new FrameworkManager());
        return FrameworkManager._interface;
    }

    reconnectSuc(): void {
        PageMgr.hidePage("LoadingPage");
        EventMgr.trigger(GameEventType.CLOSE_RECONNECT);
    }
}

export default FrameworkManager._getInterface();
