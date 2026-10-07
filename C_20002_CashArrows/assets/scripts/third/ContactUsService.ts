const SUPPORT_EMAIL = "ashiqeuddin2022@gmail.com";
const EMAIL_SUBJECT = "Question from Cash Arrows";

function loadModule<T = any>(path: string): T | null {
    try {
        const mod = require(path);
        return mod && mod.default ? mod.default : mod;
    } catch (e) {
        return null;
    }
}

function getClientDataStore(): any {
    return loadModule("../migration-bundle/business-common/data/ClientDataStore");
}

function openByShowAppService(url: string): void {
    const platform = loadModule("../migration-bundle/business-common/platform/PlatformBridge");
    const bridge = platform && typeof platform.getNativeBridge === "function" ? platform.getNativeBridge() : null;
    if (bridge && typeof bridge.showAppService === "function") {
        bridge.showAppService(url);
    } else {
        cc.sys.openURL(url);
    }
}

function isRegionalEmailMode(): boolean {
    const helper = loadModule("../migration-bundle/business-common/middle/MiddleHelper");
    if (!helper) {
        return false;
    }
    if (typeof helper.getRegionalState === "function") {
        const state = helper.getRegionalState();
        return !!(state && state.recogIRE);
    }
    return !!helper.recogIRE;
}

function reportEvent(event: string, data?: any): void {
    const analytics = loadModule("../migration-bundle/business-common/report/BusinessAnalyticsService");
    analytics?.reportData?.(event, data || {});
}

function openMailtoSupport(): void {
    const client = getClientDataStore();
    const body = "------------------------------------\nAppName:Cash Arrows \nVersion:" +
        (client && client.version_name ? client.version_name : "") +
        "\nModel:" + (client && client.phone_model ? client.phone_model : "") +
        "\nDeviceID:" + (client && client.device_id ? client.device_id : "") +
        "\n------------------------------------";
    const url = "mailto:" + SUPPORT_EMAIL +
        "?subject=" + encodeURIComponent(EMAIL_SUBJECT) +
        "&body=" + encodeURIComponent(body);
    cc.sys.openURL(url);
}

const ContactUsService = {
    openContactUs(): void {
        if (isRegionalEmailMode()) {
            reportEvent("click_jump_evaluate_btn");
            openMailtoSupport();
        } else {
            const client = getClientDataStore();
            const country = client && client.local_country ? client.local_country : "";
            const deviceId = client && client.device_id ? client.device_id : "";
            const platform = client && client.os_name ? client.os_name : "";
            const packageName = client && client.box_pkg_name ? client.box_pkg_name : "";
            const helpUrl = "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" +
                encodeURIComponent(country) +
                "&device_id=" + encodeURIComponent(deviceId) +
                "&platform=" + encodeURIComponent(platform) +
                "&pkg_name=" + encodeURIComponent(packageName);
            reportEvent("p_click_helpcenter", { helpUrl: helpUrl });
            console.log("跳转客服链接:" + helpUrl);
            openByShowAppService(helpUrl);
        }
    },

    openPrivacy(): void {
        openByShowAppService("https://casharrows.casharrows.com/CashArrows/");
    },

    openByShowAppService,
};

export default ContactUsService;
