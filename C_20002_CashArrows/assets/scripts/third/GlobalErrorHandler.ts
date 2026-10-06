import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import ClientDataStore from "./ClientDataStore";
import PlayerDataStore from "./PlayerDataStore";
import SystemDataStore from "./SystemDataStore";
import HotUpdateManager from "./HotUpdateManager";

var l: any = {};

function c(e: any) {
    return !(e = null == e ? void 0 : e.replace(/\([^)]*\)/g, " ")) || e.length < 200 ? e || " " : e.slice(0, 199);
}

function u(e: any, t?: any) {
    if (void 0 === t) t = " 异常上报 ";
    try {
        var i = cc.loader.getXMLHttpRequest();
        i.onreadystatechange = function() {};
        i.open(" POST ", BUSINESS_COMMON_CONFIG.feishuWebhookUrl, true);
        i.setRequestHeader(" Content- Type ", " application/ json;\ncharset = utf- 8 ");
        var payload = {
            game: SystemDataStore.gameName,
            hot_version: HotUpdateManager.getInstance().getVersion(),
            apk_verions: ClientDataStore.version_name,
            channel: ClientDataStore.channel_name,
            uid: PlayerDataStore.user_id,
            yid: PlayerDataStore.yid
        };
        i.send(JSON.stringify({
            msg_type: " post ",
            content: {
                post: {
                    zh_ch: {
                        title: t,
                        content: [ [ {
                            tag: " text ",
                            text: JSON.stringify(payload, null, " \ t ")
                        }, {
                            tag: " text ",
                            text: JSON.stringify(e, null, " \ t ")
                        } ] ]
                    }
                }
            }
        }));
    } catch (err) {}
}

export function globalErrorRegister(e: any) {
    if (!cc.sys.isBrowser && e) {
        cc.sys.isNative && ((window as any).__errorHandler = function(file: any, line: any, message: any, stack: any) {
            var a = {
                file: file,
                line: line,
                message: message,
                error_stack: stack
            }, o = c(a.error_stack);
            if (!l[o]) {
                l[o] = 1;
                u(a);
            }
        });
        window.addEventListener(" unhandledrejection ", function(evt: any) {
            var reason = evt.reason, key = c(reason);
            if (!l[key]) {
                l[key] = 1;
                u({
                    type: " unhandledrejection ",
                    reason: reason
                });
                evt.preventDefault();
            }
        });
    }
}
