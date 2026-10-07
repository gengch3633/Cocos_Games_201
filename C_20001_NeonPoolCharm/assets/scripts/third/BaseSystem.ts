import AudioManager from "./AudioManager";
import { CoinfinityRideress } from "./CoinfinityRideress";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import LocalServer from "./LocalServer";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

class BaseSystem {
    getUserInfo(data: any, handler: any, onError?: (err: any) => void): void {
        LocalServer.instance.requestUserInfo(
            (result: any) => handler.runWith(result),
            (err: any) => onError?.(err)
        );
    }

    getConfmeUrl_Regional(): Promise<null> {
        return Promise.resolve(null);
    }

    reco(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    getSystemConfig(handler: any): void {
        handler.runWith({
            code: 1,
            data: {
                activate: true,
                is_encrypt: false,
                is_reviewer: false,
                new_user: 0,
                position: "Turkey",
            },
            ecp: 0,
            message: "",
        });
    }

    static _getInstance(): BaseSystem {
        if (!BaseSystem._instance) {
            BaseSystem._instance = new BaseSystem();
        }
        return BaseSystem._instance;
    }

    wechatBind(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    agreementReport(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    autoLogin(data: any, handler: any, onError?: any): void {
        this.touristsLogin(data, handler, onError);
    }

    touristsLogin(data: any, handler: any, onError?: any): void {
        CoinfinityRideress.instance.init(PoolWrapper.EventName.NEW_BALL_CHANGED);
        PoolWrapper.instance.init(PoolNative.getPackageName(), (muted: boolean) => {
            AudioManager.getInstance().mute = muted;
        });
        CoinfinityRideress.instance.electroretinogram([], null, (config: any, ballConfig: any) => {
            if (cc.sys.isNative && !GameHelper.intranetValue) {
                if (config?.IP_RESTRICT && GameHelper.spawn) {
                    handler.runWith({ code: 101, data: {}, ecp: 0, message: "" });
                    return;
                }
                if (config?.VPN_RESTRICT && (PoolNative.isVPNEnabled || PoolNative.isProxyEnabled) && !GameHelper.pocketed) {
                    handler.runWith({ code: 102, data: {}, ecp: 0, message: "" });
                    return;
                }
            }
            GameConfigurations.updateWebConfig(config);
            GameConfigurations.updateNewBallConfig(ballConfig);
            handler.runWith(LocalServer.instance.requestLogin());
        });
    }

    shumengReport(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    logoff(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    removeUser(data: any, handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    wechatLogin(data: any, handler: any): void {
        const payload = {
            wechat_code: data.wechat_code,
        };
        Object.assign(payload, data.tempData);
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    logout(handler: any): void {
        handler?.runWith({ code: 1, data: {}, ecp: 0, message: "" });
    }

    private static _instance: BaseSystem = null;
}

export default BaseSystem._getInstance();
