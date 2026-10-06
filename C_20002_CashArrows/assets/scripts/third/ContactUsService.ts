import ClientDataStore from "./ClientDataStore";
import PlatformBridge from "./PlatformBridge";
import MiddleHelper from "./MiddleHelper";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

const SUPPORT_EMAIL = "ashiqeuddin2022@gmail.com";
const EMAIL_SUBJECT = "Question from Cash Arrows";

function reportData(event: string, data?: Record<string, unknown>): void {
    BusinessAnalyticsService.reportData(event, data || {});
}

function openByShowAppService(url: string): void {
    const bridge = PlatformBridge.getNativeBridge() as { showAppService?(url: string): void } | null;
    if (bridge && typeof bridge.showAppService === "function") {
        bridge.showAppService(url);
    } else {
        cc.sys.openURL(url);
    }
}

function isRegionalReviewEnabled(): boolean {
    if (!MiddleHelper) {
        return false;
    }
    if (typeof MiddleHelper.getRegionalState === "function") {
        const state = MiddleHelper.getRegionalState();
        return !!(state && state.recogIRE);
    }
    return !!MiddleHelper.recogIRE;
}

function openMailto(): void {
    const store = ClientDataStore;
    const body =
        "------------------------------------\nAppName:Cash Arrows \nVersion:" +
        (store && store.version_name ? store.version_name : "") +
        "\nModel:" +
        (store && store.phone_model ? store.phone_model : "") +
        "\nDeviceID:" +
        (store && store.device_id ? store.device_id : "") +
        "\n------------------------------------";
    const url = "mailto:" + SUPPORT_EMAIL + "?subject=" + encodeURIComponent(EMAIL_SUBJECT) + "&body=" + encodeURIComponent(body);
    cc.sys.openURL(url);
}

const ContactUsService = {
    openContactUs(): void {
        if (isRegionalReviewEnabled()) {
            reportData("click_jump_evaluate_btn");
            openMailto();
            return;
        }

        const store = ClientDataStore;
        const country = store && store.local_country ? store.local_country : "";
        const deviceId = store && store.device_id ? store.device_id : "";
        const platform = store && store.os_name ? store.os_name : "";
        const pkgName = store && store.box_pkg_name ? store.box_pkg_name : "";
        const helpUrl =
            "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" +
            encodeURIComponent(country) +
            "&device_id=" +
            encodeURIComponent(deviceId) +
            "&platform=" +
            encodeURIComponent(platform) +
            "&pkg_name=" +
            encodeURIComponent(pkgName);

        reportData("p_click_helpcenter", { helpUrl });
        console.log("跳转客服链接:" + helpUrl);
        openByShowAppService(helpUrl);
    },

    openPrivacy(): void {
        openByShowAppService("https://casharrows.casharrows.com/CashArrows/");
    },

    openByShowAppService,
};

export default ContactUsService;
