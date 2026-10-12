import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";
import { MiddleReqType } from "./MiddleReqType";

export default class MiddleService {
    public static paramData(type: MiddleReqType): any {
        const country = this.resolveCountry();
        const query = this.commonUrl(country);

        switch (type) {
            case MiddleReqType.SDKEvent:
                return {
                    refer: ClientDataStore.referrer_url || "",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query,
                    ds: ClientDataStore.ds
                };
            case MiddleReqType.Regional:
                return {
                    oaid: ClientDataStore.oaid || "",
                    referrer_url: ClientDataStore.referrer_url || "",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query,
                    ds: ClientDataStore.ds
                };
            case MiddleReqType.ADCONFIG:
            default:
                return {
                    query,
                    ds: ClientDataStore.ds
                };
        }
    }

    public static commonUrl(country: string): string {
        let url = "user_id=" + (ClientDataStore.user_id || "");
        url += "&yid=" + (ClientDataStore.yid || "");
        if (ClientDataStore.commonUrlStr) {
            url += "&" + ClientDataStore.commonUrlStr;
        }
        url += "&country=" + country;
        return url + "&cy=" + country;
    }

    public static resolveCountry(): string {
        return (MiddleHelper.localCountry && MiddleHelper.localCountry()) || ClientDataStore.local_country || "IN";
    }
}