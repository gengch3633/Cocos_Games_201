import BusinessAnalyticsService from "./BusinessAnalyticsService";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import PlatformBridge from "./PlatformBridge";

const CONTACT_EMAIL = "ashiqeuddin2022@gmail.com";
const CONTACT_SUBJECT = "Question from Cash Arrows";

function openByShowAppService(url: string): void {
    const bridge = typeof PlatformBridge.getNativeBridge === "function" ? PlatformBridge.getNativeBridge() : null;
    if (bridge && typeof bridge.showAppService === "function") {
        bridge.showAppService(url);
    } else {
        cc.sys.openURL(url);
    }
}

function shouldUseMailto(): boolean {
    if (!MiddleHelper) {
        return false;
    }
    if (typeof MiddleHelper.getRegionalState === "function") {
        const state = MiddleHelper.getRegionalState();
        return !!(state && state.recogIRE);
    }
    return !!MiddleHelper.recogIRE;
}

function reportAnalytics(event: string, data?: any): void {
    BusinessAnalyticsService.reportData(event, data || {});
}

function openMailContact(): void {
    const store = ClientDataStore;
    const body = "------------------------------------\nAppName:Cash Arrows \nVersion:" + (store && store.version_name ? store.version_name : "") + "\nModel:" + (store && store.phone_model ? store.phone_model : "") + "\nDeviceID:" + (store && store.device_id ? store.device_id : "") + "\n------------------------------------";
    const mailUrl = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(CONTACT_SUBJECT) + "&body=" + encodeURIComponent(body);
    cc.sys.openURL(mailUrl);
}

const ContactUsService = {
    openContactUs(): void {
        if (shouldUseMailto()) {
            reportAnalytics("click_jump_evaluate_btn");
            openMailContact();
        } else {
            const store = ClientDataStore;
            const country = store && store.local_country ? store.local_country : "";
            const deviceId = store && store.device_id ? store.device_id : "";
            const platform = store && store.os_name ? store.os_name : "";
            const pkgName = store && store.box_pkg_name ? store.box_pkg_name : "";
            const helpUrl = "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" + encodeURIComponent(country) + "&device_id=" + encodeURIComponent(deviceId) + "&platform=" + encodeURIComponent(platform) + "&pkg_name=" + encodeURIComponent(pkgName);
            reportAnalytics("p_click_helpcenter", {
                helpUrl: helpUrl
            });
            console.log("跳转客服链接:" + helpUrl);
            openByShowAppService(helpUrl);
        }
    },

    openPrivacy(): void {
        openByShowAppService("https://casharrows.casharrows.com/CashArrows/");
    },

    openByShowAppService: openByShowAppService
};

export default ContactUsService;
