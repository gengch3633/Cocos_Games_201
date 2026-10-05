import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import LocalServer from "./LocalServer";
import { CoinfinityRideress } from "./CoinfinityRideress";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";
import AudioManager from "./AudioManager";

class BaseSystem {
    private static _instance: BaseSystem = null;

    private static _getInstance(): BaseSystem {
        if (!BaseSystem._instance) {
            BaseSystem._instance = new BaseSystem();
        }
        return BaseSystem._instance;
    }

    getUserInfo(data: any, success: any, fail?: (err: any) => void): void {
        LocalServer.instance.requestUserInfo(
            function (result: any) {
                return success.runWith(result);
            },
            function (err: any) {
                return fail == null ? void 0 : fail(err);
            }
        );
    }

    getConfmeUrl_Regional(): Promise<null> {
        return Promise.resolve(null);
    }

    reco(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    getSystemConfig(callback: any): void {
        callback.runWith({
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

    wechatBind(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    agreementReport(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    autoLogin(data: any, success: any, fail?: any): void {
        this.touristsLogin(data, success, fail);
    }

    touristsLogin(data: any, callback: any): void {
        CoinfinityRideress.instance.init(PoolWrapper.EventName.NEW_BALL_CHANGED);
        PoolWrapper.instance.init(PoolNative.getPackageName(), function (muted: boolean) {
            AudioManager.getInstance().mute = muted;
        });
        CoinfinityRideress.instance.electroretinogram([], null, function (webConfig: any, ballConfig: any) {
            if (cc.sys.isNative && !GameHelper.intranetValue) {
                if (webConfig?.IP_RESTRICT && GameHelper.spawn) {
                    callback.runWith({
                        code: 101,
                        data: {},
                        ecp: 0,
                        message: "",
                    });
                    return;
                }
                if (
                    webConfig?.VPN_RESTRICT &&
                    (PoolNative.isVPNEnabled || PoolNative.isProxyEnabled) &&
                    !GameHelper.pocketed
                ) {
                    callback.runWith({
                        code: 102,
                        data: {},
                        ecp: 0,
                        message: "",
                    });
                    return;
                }
            }
            GameConfigurations.updateWebConfig(webConfig);
            GameConfigurations.updateNewBallConfig(ballConfig);
            callback.runWith(LocalServer.instance.requestLogin());
        });
    }

    shumengReport(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    logoff(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    removeUser(data: any, callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    wechatLogin(data: any, callback: any): void {
        const wechatCode = data.wechat_code;
        const tempData = data.tempData;
        const payload = {
            wechat_code: wechatCode,
        };
        Object.assign(payload, tempData);
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }

    logout(callback: any): void {
        callback == null ||
            callback.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: "",
            });
    }
}

export default BaseSystem._getInstance();
