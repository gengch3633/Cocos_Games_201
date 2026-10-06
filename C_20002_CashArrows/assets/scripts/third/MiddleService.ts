import { MiddleReqType } from "./MiddleReqType";
import ClientDataStore from "./ClientDataStore";
import MiddleHelper from "./MiddleHelper";

export default class MiddleService {
    static paramData(reqType: MiddleReqType) {
        var country = this.resolveCountry();
        var query = this.commonUrl(country);
        switch (reqType) {
            case MiddleReqType.SDKEvent:
                return {
                    refer: ClientDataStore.referrer_url || " ",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query: query,
                    ds: ClientDataStore.ds
                };

            case MiddleReqType.Regional:
                return {
                    oaid: ClientDataStore.oaid || " ",
                    referrer_url: ClientDataStore.referrer_url || " ",
                    referrer_timestamp_server: ClientDataStore.referrer_timestamp_server || 0,
                    install_timestamp_server: ClientDataStore.install_timestamp_server || 0,
                    query: query,
                    ds: ClientDataStore.ds
                };

            case MiddleReqType.ADCONFIG:
            default:
                return {
                    query: query,
                    ds: ClientDataStore.ds
                };
        }
    }

    static commonUrl(country: string) {
        var url = " user_id = " + (ClientDataStore.user_id || " ");
        url += "& yid = " + (ClientDataStore.yid || " ");
        ClientDataStore.commonUrlStr && (url += "& " + ClientDataStore.commonUrlStr);
        return (url += "& country = " + country) + "& cy = " + country;
    }

    static resolveCountry() {
        return MiddleHelper.localCountry && MiddleHelper.localCountry() || ClientDataStore.local_country || " IN ";
    }
}
