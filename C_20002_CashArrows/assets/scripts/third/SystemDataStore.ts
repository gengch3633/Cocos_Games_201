// @ts-nocheck
import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";

const requestDescriptor = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);

const SystemDataStore = new (class {
    gameName = BUSINESS_COMMON_CONFIG.gameName;
    encrypt = 1;
    new_user = 0;
    _languageType = BUSINESS_COMMON_CONFIG.defaultLanguage;

    setLanguageType(languageType) {
        this._languageType = languageType;
    }

    getLanguageType() {
        return this._languageType;
    }

    init_config(config) {
        const isEncrypt = config.is_encrypt;
        const newUser = config.new_user;
        this.encrypt = isEncrypt || 0;
        const normalizedNewUser = newUser != null ? newUser : config.is_new;
        this.new_user = normalizedNewUser ? 1 : 0;
        console.log(
            "[SystemDataStore] init_config: new_user=" +
                this.new_user +
                " raw_new_user=" +
                newUser +
                " raw_is_new=" +
                config.is_new,
        );
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
        return this.getServerReleaseUrl() + requestDescriptor.getUri("HotUpdate");
    }

    is_new_user() {
        return this.new_user === 1;
    }
})();

export default SystemDataStore;
