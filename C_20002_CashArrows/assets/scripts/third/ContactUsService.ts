declare function require(id: string): any;

function resolveModule(t: string): any {
    var i = require(t);
    return i && i.default ? i.default : i;
}

var email = "ashiqeuddin2022@gmail.com",
    subject = "Question from Cash Arrows";

function clientData(): any {
    return resolveModule("../migration-bundle/business-common/data/ClientDataStore");
}

function showAppService(e: any) {
    var t: any,
        i = (t = resolveModule("../migration-bundle/business-common/platform/PlatformBridge")) && "function" == typeof t.getNativeBridge ? t.getNativeBridge() : null;
    i && "function" == typeof i.showAppService ? i.showAppService(e) : cc.sys.openURL(e);
}

function isRegional(): boolean {
    var e = resolveModule("../migration-bundle/business-common/middle/MiddleHelper");
    if (!e) return false;
    if ("function" == typeof e.getRegionalState) {
        var t = e.getRegionalState();
        return !(!t || !t.recogIRE);
    }
    return !!e.recogIRE;
}

function report(e: any, t?: any) {
    var i = resolveModule("../migration-bundle/business-common/report/BusinessAnalyticsService");
    i && i.reportData && i.reportData(e, t || {});
}

function openMail() {
    var e = clientData(),
        t = "------------------------------------\nAppName:Cash Arrows \nVersion:" + (e && e.version_name ? e.version_name : "") + "\nModel:" + (e && e.phone_model ? e.phone_model : "") + "\nDeviceID:" + (e && e.device_id ? e.device_id : "") + "\n------------------------------------",
        i = "mailto:" + email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(t);
    cc.sys.openURL(i);
}

var ContactUsService = {
    openContactUs: function() {
        if (isRegional()) {
            report("click_jump_evaluate_btn");
            openMail();
        } else {
            var e = clientData(),
                t = e && e.local_country ? e.local_country : "",
                i = e && e.device_id ? e.device_id : "",
                n = e && e.os_name ? e.os_name : "",
                a = e && e.box_pkg_name ? e.box_pkg_name : "",
                o = "https://mph.casharrows.com/cahp/ocap/index.html#/casharrows/?cy=" + encodeURIComponent(t) + "&device_id=" + encodeURIComponent(i) + "&platform=" + encodeURIComponent(n) + "&pkg_name=" + encodeURIComponent(a);
            report("p_click_helpcenter", {
                helpUrl: o
            });
            console.log("跳转客服链接:" + o);
            showAppService(o);
        }
    },
    openPrivacy: function() {
        showAppService("https://casharrows.casharrows.com/CashArrows/");
    },
    openByShowAppService: showAppService
};

export default ContactUsService;
