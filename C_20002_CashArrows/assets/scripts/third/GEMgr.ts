import BusinessAnalyticsService from "./BusinessAnalyticsService";

const geConfig = {
    accessToken: "p9h18yqUnckfZswrw3sBbjEdDH0MtnXm",
    clientId: "your_client_id",
    autoTrack: {
        appLaunch: true,
        appShow: true,
        appHide: true,
    },
    sendTimeout: 3000,
    maxRetries: 3,
    enablePersistence: true,
    asyncPersistence: false,
    name: "ge",
};

function reportData(event: string, data?: Record<string, unknown>): void {
    BusinessAnalyticsService.reportData(event, data || {});
}

function createGeStub() {
    return {
        track(event: string, data?: Record<string, unknown>): void {
            reportData(event, data);
        },
        adShowEvent(adChannel: string, adPosition: string, extra?: { custom_param?: string }): void {
            reportData("ad_show_event", {
                ad_channel: adChannel,
                ad_position: adPosition,
                custom_param: (extra && extra.custom_param) || "",
            });
        },
    };
}

export default class GEMgr {
    static ge = createGeStub();
    static nameInit = "zyzy";
    static versionInit = 1;
    static isInit = true;

    static GESetup(config: unknown): void {
        console.log("ge setup:", config);
    }

    static GEInit(openId: string): Promise<void> {
        if (openId == null || openId === "") {
            console.log("openidInit openid is null");
            return Promise.resolve();
        }
        console.log("ge init:", openId);
        geConfig.clientId = openId;
        this.ge = createGeStub();
        this.isInit = true;
        return Promise.resolve();
    }

    static GEShowAD(position: string): Promise<void> {
        reportData("ad_show_event", {
            ad_channel: "reward",
            ad_position: position,
            custom_param: "",
        });
        return Promise.resolve();
    }

    static GEShowADEvent(action: string): Promise<void> {
        reportData("userAction", {
            action,
            module: action,
            isAD: 1,
        });
        return Promise.resolve();
    }

    static GEReportEvent(eventName: string): Promise<void> {
        let isAd = 0;
        const moduleName = eventName.split("-")[0];
        const action = eventName.substring(moduleName.length + 1);
        if (eventName.indexOf("AD") > -1) {
            isAd = 1;
        }
        console.log("GEReportEvent:", isAd, moduleName, action);
        reportData("userAction", {
            action,
            module: moduleName,
            isAD: isAd,
        });
        return Promise.resolve();
    }

    static trackEvent(event: string, data?: Record<string, unknown>): void {
        console.log("引力打点操作>>> trackEvent", event, data);
        reportData(event, data);
    }

    static setToken(token: string): void {
        console.log("token:", token);
        geConfig.accessToken = token;
    }
}
