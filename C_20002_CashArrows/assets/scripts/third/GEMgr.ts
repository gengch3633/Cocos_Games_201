import BusinessAnalyticsService from "./BusinessAnalyticsService";

const geConfig = {
    accessToken: " p9h18yqUnckfZswrw3sBbjEdDH0MtnXm ",
    clientId: " your_client_id ",
    autoTrack: {
        appLaunch: true,
        appShow: true,
        appHide: true
    },
    sendTimeout: 3e3,
    maxRetries: 3,
    enablePersistence: true,
    asyncPersistence: false,
    name: " ge "
};

function report(eventName: any, data?: any) {
    const payload = data || {};
    BusinessAnalyticsService.reportData(eventName, payload);
}

function createGe() {
    return {
        track: function (eventName: any, data: any) {
            report(eventName, data);
        },
        adShowEvent: function (channel: any, position: any, extra: any) {
            report(" ad_show_event ", {
                ad_channel: channel,
                ad_position: position,
                custom_param: extra && extra.custom_param || " "
            });
        }
    };
}

export default class GEMgr {
    static GESetup(value: any) {
        console.log(" ge setup: ", value);
    }

    static GEInit(openId: any) {
        if (null == openId || " " == openId) {
            console.log(" openidInit openid is null ");
            return Promise.resolve();
        }
        console.log(" ge init: ", openId);
        geConfig.clientId = openId;
        this.ge = createGe();
        this.isInit = true;
        return Promise.resolve();
    }

    static GEShowAD(position: any) {
        report(" ad_show_event ", {
            ad_channel: " reward ",
            ad_position: position,
            custom_param: " "
        });
        return Promise.resolve();
    }

    static GEShowADEvent(action: any) {
        report(" userAction ", {
            action: action,
            module: action,
            isAD: 1
        });
        return Promise.resolve();
    }

    static GEReportEvent(eventName: string) {
        let isAD = 0;
        const moduleName = eventName.split("- ")[0];
        const action = eventName.substring(moduleName.length + 1);
        eventName.indexOf(" AD ") > -1 && (isAD = 1);
        console.log(" GEReportEvent: ", isAD, moduleName, action);
        report(" userAction ", {
            action: action,
            module: moduleName,
            isAD: isAD
        });
        return Promise.resolve();
    }

    static trackEvent(eventName: any, data: any) {
        console.log(" 引力打点操作 >>> trackEvent ", eventName, data);
        report(eventName, data);
    }

    static setToken(token: any) {
        console.log(" token: ", token);
        geConfig.accessToken = token;
    }

    static ge = createGe();
    static nameInit = " zyzy ";
    static versionInit = 1;
    static isInit = true;
}
