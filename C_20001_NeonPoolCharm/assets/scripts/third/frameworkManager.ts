import HotUpdate from "./HotUpdate";
import { GAME_NAME } from "./SystemConfig";
import PageMgr from "./PageMgr";
import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import SdkHelper from "./SdkHelper";

class FrameworkManager {
    private static _interface: FrameworkManager = null;

    error(...args: unknown[]): void {
        if (!HotUpdate.getInstance().isOnlineRelease()) {
            if (cc.sys.isNative) {
                try {
                    console.error(GAME_NAME, JSON.stringify(args));
                } catch (err) {
                    console.error(GAME_NAME, err);
                }
            } else {
                console.error(GAME_NAME, args);
            }
        }
    }

    httpErr(response: unknown): void {
        this.log(response);
        SdkHelper.showToast(i18n.t("network_toast"));
        SdkHelper.reportData("httpErr", {
            response: JSON.stringify(response),
        });
    }

    reconnectFai(): void {
        PageMgr.hidePage("LoadingPage");
    }

    log(...args: unknown[]): void {
        if (cc.sys.isNative) {
            try {
                console.log(GAME_NAME, JSON.stringify(args));
            } catch (err) {
                console.error(GAME_NAME, err);
            }
        } else {
            console.log(GAME_NAME, args);
        }
    }

    private static _getInterface(): FrameworkManager {
        if (!FrameworkManager._interface) {
            FrameworkManager._interface = new FrameworkManager();
        }
        return FrameworkManager._interface;
    }

    reconnectSuc(): void {
        PageMgr.hidePage("LoadingPage");
        EventMgr.trigger(GameEventType.CLOSE_RECONNECT);
    }
}

export default FrameworkManager._getInterface();
