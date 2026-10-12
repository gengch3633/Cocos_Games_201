import * as BusinessAnalyticsServiceModule from "./BusinessAnalyticsService";
import * as ClientDataStoreModule from "./ClientDataStore";
import * as MiddleHelperModule from "./MiddleHelper";
import * as PlatformBridgeModule from "./PlatformBridge";

/**
 * 兼容 CommonJS / ES Module 两种导出形态：
 * 模块若带有 default 则取 default，否则取模块本体。
 */
function interop<T = any>(mod: any): T {
    return (mod && mod.default ? mod.default : mod) as T;
}

const BusinessAnalyticsService: any = interop(BusinessAnalyticsServiceModule);
const ClientDataStore: any = interop(ClientDataStoreModule);
const MiddleHelper: any = interop(MiddleHelperModule);
const PlatformBridge: any = interop(PlatformBridgeModule);

const CONTACT_EMAIL: string = "ashiqeuddin2022@gmail.com";
const EMAIL_SUBJECT: string = "Question from Cash Arrows";

interface IRegionalState {
    recogIRE?: boolean;
}

interface IContactUsService {
    openContactUs(): void;
    openPrivacy(): void;
    openByShowAppService(url: string): void;
}

function getClientDataStore(): any {
    return ClientDataStore;
}

/**
 * 优先走原生桥接的 showAppService，否则回退到系统浏览器。
 */
function openUrl(url: string): void {
    const bridgeModule: any = PlatformBridge;
    const bridge: any =
        bridgeModule && typeof bridgeModule.getNativeBridge === "function"
            ? bridgeModule.getNativeBridge()
            : null;

    if (bridge && typeof bridge.showAppService === "function") {
        bridge.showAppService(url);
    } else {
        cc.sys.openURL(url);
    }
}

/**
 * 判断当前地区是否命中 IRE（影响跳转客服还是跳转评价/邮件）。
 */
function isRegionalRecognized(): boolean {
    const middleware: any = MiddleHelper;
    if (!middleware) {
        return false;
    }

    if (typeof middleware.getRegionalState === "function") {
        const state: IRegionalState = middleware.getRegionalState();
        return !!(state && state.recogIRE);
    }

    return !!middleware.recogIRE;
}

function reportEvent(eventName: string, params?: Record<string, any>): void {
    const analytics: any = BusinessAnalyticsService;
    if (analytics && analytics.reportData) {
        analytics.reportData(eventName, params || {});
    }
}

/**
 * 拼接设备信息正文并唤起系统邮件客户端。
 */
function sendFeedbackMail(): void {
    const store: any = getClientDataStore();
    const body: string =
        "------------------------------------\nAppName:Cash Arrows \nVersion:" +
        (store && store.version_name ? store.version_name : "") +
        "\nModel:" +
        (store && store.phone_model ? store.phone_model : "") +
        "\nDeviceID:" +
        (store && store.device_id ? store.device_id : "") +
        "\n------------------------------------";

    const url: string =
        "mailto:" +
        CONTACT_EMAIL +
        "?subject=" +
        encodeURIComponent(EMAIL_SUBJECT) +
        "&body=" +
        encodeURIComponent(body);

    cc.sys.openURL(url);
}

const ContactUsService: IContactUsService = {
    openContactUs(): void {
        if (isRegionalRecognized()) {
            reportEvent("click_jump_evaluate_btn");
            sendFeedbackMail();
        } else {
            const store: any = getClientDataStore();
            const country: string = store && store.local_country ? store.local_country : "";
            const deviceId: string = store && store.device_id ? store.device_id : "";
            const osName: string = store && store.os_name ? store.os_name : "";
            const pkgName: string = store && store.box_pkg_name ? store.box_pkg_name : "";

            const helpUrl: string =
                "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" +
                encodeURIComponent(country) +
                "&device_id=" +
                encodeURIComponent(deviceId) +
                "&platform=" +
                encodeURIComponent(osName) +
                "&pkg_name=" +
                encodeURIComponent(pkgName);

            reportEvent("p_click_helpcenter", { helpUrl });
            console.log("跳转客服链接:" + helpUrl);
            openUrl(helpUrl);
        }
    },

    openPrivacy(): void {
        openUrl("https://casharrows.casharrows.com/CashArrows/");
    },

    openByShowAppService: openUrl
};

export default ContactUsService;