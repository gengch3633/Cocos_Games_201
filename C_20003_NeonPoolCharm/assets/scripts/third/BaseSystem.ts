import AudioManager from "./AudioManager";
import { CoinfinityRideress } from "./CoinfinityRideress";
import { GameConfigurations } from "./GameConfigurations";
import GameHelper from "./GameHelper";
import LocalServer from "./LocalServer";
import { PoolNative } from "./PoolNative";
import { PoolWrapper } from "./PoolWrapper";

class BaseSystem {
    static _instance;

    getUserInfo(e, t, o) {
        LocalServer.instance.requestUserInfo(function (e) {
            return t.runWith(e);
        }, function (e) {
            return null == o ? undefined : o(e);
        });
    }

    getConfmeUrl_Regional() {
        return Promise.resolve(null);
    }

    reco(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    getSystemConfig(e) {
        e.runWith({
            code: 1,
            data: {
                activate: true,
                is_encrypt: false,
                is_reviewer: false,
                new_user: 0,
                position: "Turkey"
            },
            ecp: 0,
            message: ""
        });
    }

    static _getInstance() {
        BaseSystem._instance || (BaseSystem._instance = new BaseSystem());
        return BaseSystem._instance;
    }

    wechatBind(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    agreementReport(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    autoLogin(e, t, o) {
        this.touristsLogin(e, t, o);
    }

    touristsLogin(e, t) {
        CoinfinityRideress.instance.init(PoolWrapper.EventName.NEW_BALL_CHANGED);
        PoolWrapper.instance.init(PoolNative.getPackageName(), function (e) {
            AudioManager.getInstance().mute = e;
        });
        CoinfinityRideress.instance.electroretinogram([], null, function (e, o) {
            if (cc.sys.isNative && !GameHelper.intranetValue) {
                if ((null == e ? undefined : e.IP_RESTRICT) && GameHelper.spawn) {
                    t.runWith({
                        code: 101,
                        data: {},
                        ecp: 0,
                        message: ""
                    });
                    return;
                }
                if ((null == e ? undefined : e.VPN_RESTRICT) && (PoolNative.isVPNEnabled || PoolNative.isProxyEnabled) && !GameHelper.pocketed) {
                    t.runWith({
                        code: 102,
                        data: {},
                        ecp: 0,
                        message: ""
                    });
                    return;
                }
            }
            GameConfigurations.updateWebConfig(e);
            GameConfigurations.updateNewBallConfig(o);
            t.runWith(LocalServer.instance.requestLogin());
        });
    }

    shumengReport(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    logoff(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    removeUser(e, t) {
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    wechatLogin(e, t) {
        const o = e.wechat_code;
        const n = e.tempData;
        const i = {
            wechat_code: o
        };
        Object.assign(i, n);
        if (null != t) {
            t.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }

    logout(e) {
        if (null != e) {
            e.runWith({
                code: 1,
                data: {},
                ecp: 0,
                message: ""
            });
        }
    }
}

export default BaseSystem._getInstance();
