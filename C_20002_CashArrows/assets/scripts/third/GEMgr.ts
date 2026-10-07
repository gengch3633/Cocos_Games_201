import BusinessAnalyticsService from "./BusinessAnalyticsService";

const geConfig = {
    accessToken: "p9h18yqUnckfZswrw3sBbjEdDH0MtnXm",
    clientId: "your_client_id",
    autoTrack: {
        appLaunch: true,
        appShow: true,
        appHide: true,
    },
    sendTimeout: 3e3,
    maxRetries: 3,
    enablePersistence: true,
    asyncPersistence: false,
    name: "ge",
};

function reportEvent(event: string, data?: any): void {
    BusinessAnalyticsService.reportData(event, data || {});
}

function createGeAdapter(): any {
    return {
        track(event: string, data?: any): void {
            reportEvent(event, data);
        },
        adShowEvent(channel: string, position: string, extra?: any): void {
            reportEvent("ad_show_event", {
                ad_channel: channel,
                ad_position: position,
                custom_param: extra?.custom_param || "",
            });
        },
    };
}

export default class GEMgr {
    static ge = createGeAdapter();
    static nameInit = "zyzy";
    static versionInit = 1;
    static isInit = true;

    static GESetup(config: any): void {
        console.log("ge setup:", config);
    }

    static GEInit(openId: string): Promise<void> {
        if (openId == null || openId === "") {
            console.log("openidInit openid is null");
            return Promise.resolve();
        }
        console.log("ge init:", openId);
        geConfig.clientId = openId;
        this.ge = createGeAdapter();
        this.isInit = true;
        return Promise.resolve();
    }

    static GEShowAD(position: string): Promise<void> {
        reportEvent("ad_show_event", {
            ad_channel: "reward",
            ad_position: position,
            custom_param: "",
        });
        return Promise.resolve();
    }

    static GEShowADEvent(action: string): Promise<void> {
        reportEvent("userAction", {
            action: action,
            module: action,
            isAD: 1,
        });
        return Promise.resolve();
    }

    static GEReportEvent(event: string): Promise<void> {
        let isAd = 0;
        const module = event.split("-")[0];
        const action = event.substring(module.length + 1);
        if (event.indexOf("AD") > -1) {
            isAd = 1;
        }
        console.log("GEReportEvent:", isAd, module, action);
        reportEvent("userAction", {
            action: action,
            module: module,
            isAD: isAd,
        });
        return Promise.resolve();
    }

    static trackEvent(event: string, data?: any): void {
        console.log("引力打点操作>>> trackEvent", event, data);
        reportEvent(event, data);
    }

    static setToken(token: string): void {
        console.log("token:", token);
        geConfig.accessToken = token;
    }
}
