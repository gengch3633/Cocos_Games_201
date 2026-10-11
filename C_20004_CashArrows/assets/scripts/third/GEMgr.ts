import BusinessAnalyticsService from "./BusinessAnalyticsService";

const geConfig = {
    accessToken: "p9h18yqUnckfZswrw3sBbjEdDH0MtnXm",
    clientId: "your_client_id",
    autoTrack: {
        appLaunch: true,
        appShow: true,
        appHide: true
    },
    sendTimeout: 3000,
    maxRetries: 3,
    enablePersistence: true,
    asyncPersistence: false,
    name: "ge"
};

function reportTrack(eventName: string, data: any): void {
    const params = data || {};
    BusinessAnalyticsService.reportData(eventName, params);
}

function createTracker() {
    return {
        track: function (eventName: string, data: any): void {
            reportTrack(eventName, data);
        },
        adShowEvent: function (channel: string, position: string, extra: any): void {
            reportTrack("ad_show_event", {
                ad_channel: channel,
                ad_position: position,
                custom_param: (extra && extra.custom_param) || ""
            });
        }
    };
}

export default class GEMgr {
    public static ge: any = createTracker();
    public static nameInit: string = "zyzy";
    public static versionInit: number = 1;
    public static isInit: boolean = true;

    public static GESetup(config: any): void {
        console.log("ge setup:", config);
    }

    public static GEInit(clientId: any): Promise<void> {
        if (clientId == null || clientId === "") {
            console.log("openidInit openid is null");
            return Promise.resolve();
        }
        console.log("ge init:", clientId);
        geConfig.clientId = clientId;
        this.ge = createTracker();
        this.isInit = true;
        return Promise.resolve();
    }

    public static GEShowAD(position: string): Promise<void> {
        reportTrack("ad_show_event", {
            ad_channel: "reward",
            ad_position: position,
            custom_param: ""
        });
        return Promise.resolve();
    }

    public static GEShowADEvent(action: string): Promise<void> {
        reportTrack("userAction", {
            action: action,
            module: action,
            isAD: 1
        });
        return Promise.resolve();
    }

    public static GEReportEvent(eventName: string): Promise<void> {
        let isAD = 0;
        const module = eventName.split("-")[0];
        const action = eventName.substring(module.length + 1);
        if (eventName.indexOf("AD") > -1) {
            isAD = 1;
        }
        console.log("GEReportEvent:", isAD, module, action);
        reportTrack("userAction", {
            action: action,
            module: module,
            isAD: isAD
        });
        return Promise.resolve();
    }

    public static trackEvent(eventName: string, data: any): void {
        console.log("引力打点操作>>> trackEvent", eventName, data);
        reportTrack(eventName, data);
    }

    public static setToken(token: string): void {
        console.log("token:", token);
        geConfig.accessToken = token;
    }
}