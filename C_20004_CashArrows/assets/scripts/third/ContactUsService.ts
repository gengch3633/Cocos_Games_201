const CONTACT_EMAIL = "ashiqeuddin2022@gmail.com";
const EMAIL_SUBJECT = "Question from Cash Arrows";

function resolveModule(modulePath: string): any {
    const mod = require(modulePath);
    return mod && mod.default ? mod.default : mod;
}

function getClientDataStore(): any {
    return resolveModule("../migration-bundle/business-common/data/ClientDataStore");
}

function showAppService(url: string): void {
    const bridgeModule = resolveModule("../migration-bundle/business-common/platform/PlatformBridge");
    const bridge = bridgeModule && "function" == typeof bridgeModule.getNativeBridge ? bridgeModule.getNativeBridge() : null;
    if (bridge && "function" == typeof bridge.showAppService) {
        bridge.showAppService(url);
    } else {
        cc.sys.openURL(url);
    }
}

function isRegionalSupport(): boolean {
    const middleHelper = resolveModule("../migration-bundle/business-common/middle/MiddleHelper");
    if (!middleHelper) {
        return false;
    }
    if ("function" == typeof middleHelper.getRegionalState) {
        const state = middleHelper.getRegionalState();
        return !!(state && state.recogIRE);
    }
    return !!middleHelper.recogIRE;
}

function reportAnalytics(eventName: string, data?: any): void {
    const analyticsService = resolveModule("../migration-bundle/business-common/report/BusinessAnalyticsService");
    if (analyticsService && analyticsService.reportData) {
        analyticsService.reportData(eventName, data || {});
    }
}

function openEmailClient(): void {
    const store = getClientDataStore();
    const body = "------------------------------------\nAppName:Cash Arrows \nVersion:" + (store && store.version_name ? store.version_name : "") + "\nModel:" + (store && store.phone_model ? store.phone_model : "") + "\nDeviceID:" + (store && store.device_id ? store.device_id : "") + "\n------------------------------------";
    const url = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(EMAIL_SUBJECT) + "&body=" + encodeURIComponent(body);
    cc.sys.openURL(url);
}

const ContactUsService = {
    openContactUs: function (): void {
        if (isRegionalSupport()) {
            reportAnalytics("click_jump_evaluate_btn");
            openEmailClient();
        } else {
            const store = getClientDataStore();
            const country = store && store.local_country ? store.local_country : "";
            const deviceId = store && store.device_id ? store.device_id : "";
            const osName = store && store.os_name ? store.os_name : "";
            const pkgName = store && store.box_pkg_name ? store.box_pkg_name : "";
            const helpUrl = "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" + encodeURIComponent(country) + "&device_id=" + encodeURIComponent(deviceId) + "&platform=" + encodeURIComponent(osName) + "&pkg_name=" + encodeURIComponent(pkgName);
            reportAnalytics("p_click_helpcenter", {
                helpUrl: helpUrl
            });
            console.log("跳转客服链接:" + helpUrl);
            showAppService(helpUrl);
        }
    },

    openPrivacy: function (): void {
        showAppService("https://casharrows.casharrows.com/CashArrows/");
    },

    openByShowAppService: showAppService
};

export default ContactUsService;