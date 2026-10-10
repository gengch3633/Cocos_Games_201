import EventMgr from "./EventMgr";
import GameEventType from "./GameEventType";
import HotUpdate from "./HotUpdate";
import PageMgr from "./PageMgr";
import SdkHelper from "./SdkHelper";
import { GAME_NAME } from "./SystemConfig";

declare const i18n: any;

class frameworkManager {
    error(...e) {
        if (!HotUpdate.getInstance().isOnlineRelease()) {
            if (cc.sys.isNative) {
                try {
                    console.error(GAME_NAME, JSON.stringify(e));
                } catch (e) {
                    console.error(GAME_NAME, e);
                }
            } else console.error(GAME_NAME, e);
        }
    }

    httpErr(e) {
        this.log(e);
        SdkHelper.showToast(i18n.t("network_toast"));
        SdkHelper.reportData("httpErr", {
            response: JSON.stringify(e)
        });
    }

    reconnectFai() {
        PageMgr.hidePage("LoadingPage");
    }

    log(...e) {
        if (cc.sys.isNative) {
            try {
                console.log(GAME_NAME, JSON.stringify(e));
            } catch (e) {
                console.error(GAME_NAME, e);
            }
        } else console.log(GAME_NAME, e);
    }

    static _getInterface() {
        frameworkManager._interface || (frameworkManager._interface = new frameworkManager());
        return frameworkManager._interface;
    }

    reconnectSuc() {
        PageMgr.hidePage("LoadingPage");
        EventMgr.trigger(GameEventType.CLOSE_RECONNECT);
    }

    static _interface = null;
}

export default frameworkManager._getInterface();
