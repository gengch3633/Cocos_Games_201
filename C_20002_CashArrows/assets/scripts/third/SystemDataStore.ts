import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";

const o = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);

class SystemDataStore {
    gameName: any = BUSINESS_COMMON_CONFIG.gameName;
    encrypt: number = 1;
    new_user: number = 0;
    _languageType: any = BUSINESS_COMMON_CONFIG.defaultLanguage;

    setLanguageType(e: any) {
        this._languageType = e;
    }

    getLanguageType() {
        return this._languageType;
    }

    init_config(e: any) {
        var t = e.is_encrypt, i = e.new_user;
        this.encrypt = t || 0;
        var n = null != i ? i : e.is_new;
        this.new_user = n ? 1 : 0;
        console.log("[SystemDataStore] init_config: new_user = " + this.new_user + " raw_new_user = " + i + " raw_is_new = " + e.is_new);
    }

    getCDNUrl() {
        return BUSINESS_COMMON_CONFIG.cdnUrl;
    }

    getServerReleaseUrl() {
        return BUSINESS_COMMON_CONFIG.serverDomainPrefix;
    }

    get_request_url() {
        return this.getServerReleaseUrl();
    }

    get_version_url() {
        return this.getServerReleaseUrl() + o.getUri(" HotUpdate ");
    }

    is_new_user() {
        return 1 === this.new_user;
    }
}

export default new SystemDataStore();
