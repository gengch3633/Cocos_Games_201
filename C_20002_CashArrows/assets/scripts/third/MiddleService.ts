import { MiddleReqType } from "./MiddleReqType";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";

export default class MiddleService {
    static paramData(type: MiddleReqType): Record<string, unknown> {
        const country = this.resolveCountry();
        const query = this.commonUrl(country);
        switch (type) {
            case MiddleReqType.SDKEvent:
                return {
                    refer: ClientDataStore.referrer_url || "",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query,
                    ds: ClientDataStore.ds,
                };

            case MiddleReqType.Regional:
                return {
                    oaid: ClientDataStore.oaid || "",
                    referrer_url: ClientDataStore.referrer_url || "",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query,
                    ds: ClientDataStore.ds,
                };

            case MiddleReqType.ADCONFIG:
            default:
                return {
                    query,
                    ds: ClientDataStore.ds,
                };
        }
    }

    static commonUrl(country: string): string {
        let query = "user_id=" + (ClientDataStore.user_id || "");
        query += "&yid=" + (ClientDataStore.yid || "");
        if (ClientDataStore.commonUrlStr) {
            query += "&" + ClientDataStore.commonUrlStr;
        }
        return query + "&country=" + country + "&cy=" + country;
    }

    static resolveCountry(): string {
        return (MiddleHelper.localCountry && MiddleHelper.localCountry()) || ClientDataStore.local_country || "IN";
    }
}
