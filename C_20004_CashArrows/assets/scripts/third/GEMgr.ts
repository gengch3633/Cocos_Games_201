import BusinessAnalyticsService from "./BusinessAnalyticsService";

interface GEConfig {
  accessToken: string;
  clientId: string;
  autoTrack: {
    appLaunch: boolean;
    appShow: boolean;
    appHide: boolean;
  };
  sendTimeout: number;
  maxRetries: number;
  enablePersistence: boolean;
  asyncPersistence: boolean;
  name: string;
}

interface GEReporter {
  track(eventName: string, params?: any): void;
  adShowEvent(adChannel: string, adPosition: string, extra?: any): void;
}

const geConfig: GEConfig = {
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

function report(eventName: string, params?: any): void {
  const data = params || {};
  BusinessAnalyticsService.reportData(eventName, data);
}

function createReporter(): GEReporter {
  return {
    track: function(eventName: string, params?: any): void {
      report(eventName, params);
    },
    adShowEvent: function(adChannel: string, adPosition: string, extra?: any): void {
      report("ad_show_event", {
        ad_channel: adChannel,
        ad_position: adPosition,
        custom_param: (extra && extra.custom_param) || ""
      });
    }
  };
}

export default class GEMgr {
  public static ge: GEReporter = createReporter();
  public static nameInit: string = "zyzy";
  public static versionInit: number = 1;
  public static isInit: boolean = true;

  public static GESetup(openid: string): void {
    console.log("ge setup:", openid);
  }

  public static GEInit(openid: string | null | undefined): Promise<void> {
    if (openid == null || openid === "") {
      console.log("openidInit openid is null");
      return Promise.resolve();
    }
    console.log("ge init:", openid);
    geConfig.clientId = openid;
    GEMgr.ge = createReporter();
    GEMgr.isInit = true;
    return Promise.resolve();
  }

  public static GEShowAD(adPosition: string): Promise<void> {
    report("ad_show_event", {
      ad_channel: "reward",
      ad_position: adPosition,
      custom_param: ""
    });
    return Promise.resolve();
  }

  public static GEShowADEvent(action: string): Promise<void> {
    report("userAction", {
      action: action,
      module: action,
      isAD: 1
    });
    return Promise.resolve();
  }

  public static GEReportEvent(event: string): Promise<void> {
    let isAD = 0;
    const module = event.split("-")[0];
    const action = event.substring(module.length + 1);
    if (event.indexOf("AD") > -1) {
      isAD = 1;
    }
    console.log("GEReportEvent:", isAD, module, action);
    report("userAction", {
      action: action,
      module: module,
      isAD: isAD
    });
    return Promise.resolve();
  }

  public static trackEvent(eventName: string, params?: any): void {
    console.log("引力打点操作>>> trackEvent", eventName, params);
    report(eventName, params);
  }

  public static setToken(token: string): void {
    console.log("token:", token);
    geConfig.accessToken = token;
  }
}