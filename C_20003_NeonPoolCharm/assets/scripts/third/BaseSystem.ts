import ApiLog from "./ApiLog";
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
        LocalServer.instance.requestUserInfo(function (res) {
            ApiLog.response("getUserInfo", e, res);
            return t.runWith(res);
        }, function (e) {
            return null == o ? undefined : o(e);
        });
    }

    getConfmeUrl_Regional() {
        ApiLog.response("getConfmeUrl_Regional", null, null);
        return Promise.resolve(null);
    }

    reco(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("reco", e, res);
            t.runWith(res);
        }
    }

    getSystemConfig(e) {
        const res = {
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
        };
        ApiLog.response("getSystemConfig", null, res);
        e.runWith(res);
    }

    static _getInstance() {
        BaseSystem._instance || (BaseSystem._instance = new BaseSystem());
        return BaseSystem._instance;
    }

    wechatBind(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("wechatBind", e, res);
            t.runWith(res);
        }
    }

    agreementReport(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("agreementReport", e, res);
            t.runWith(res);
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
                    const res = { code: 101, data: {}, ecp: 0, message: "" };
                    ApiLog.response("touristsLogin [IP_RESTRICT 拦截]", null, res);
                    t.runWith(res);
                    return;
                }
                if ((null == e ? undefined : e.VPN_RESTRICT) && (PoolNative.isVPNEnabled || PoolNative.isProxyEnabled) && !GameHelper.pocketed) {
                    const res = { code: 102, data: {}, ecp: 0, message: "" };
                    ApiLog.response("touristsLogin [VPN_RESTRICT 拦截]", null, res);
                    t.runWith(res);
                    return;
                }
            }
            GameConfigurations.updateWebConfig(e);
            GameConfigurations.updateNewBallConfig(o);
            const loginRes = LocalServer.instance.requestLogin();
            ApiLog.response("touristsLogin", null, loginRes);
            t.runWith(loginRes);
        });
    }

    shumengReport(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("shumengReport", e, res);
            t.runWith(res);
        }
    }

    logoff(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("logoff", e, res);
            t.runWith(res);
        }
    }

    removeUser(e, t) {
        if (null != t) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("removeUser", e, res);
            t.runWith(res);
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
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("wechatLogin", e, res);
            t.runWith(res);
        }
    }

    logout(e) {
        if (null != e) {
            const res = { code: 1, data: {}, ecp: 0, message: "" };
            ApiLog.response("logout", null, res);
            e.runWith(res);
        }
    }
}

export default BaseSystem._getInstance();
