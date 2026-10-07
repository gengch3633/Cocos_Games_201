import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import { BUSINESS_REQUEST_DESCRIPTORS } from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";

const requestDescriptor = new RequestDescriptor(BUSINESS_REQUEST_DESCRIPTORS);

class SystemDataStoreImpl {
    gameName: string = BUSINESS_COMMON_CONFIG.gameName;
    encrypt: number = 1;
    new_user: number = 0;
    _languageType: string = BUSINESS_COMMON_CONFIG.defaultLanguage;

    setLanguageType(languageType: string): void {
        this._languageType = languageType;
    }

    getLanguageType(): string {
        return this._languageType;
    }

    init_config(config: any): void {
        const isEncrypt = config.is_encrypt;
        const rawNewUser = config.new_user;
        this.encrypt = isEncrypt || 0;
        const newUser = rawNewUser != null ? rawNewUser : config.is_new;
        this.new_user = newUser ? 1 : 0;
        console.log(
            "[SystemDataStore] init_config: new_user="+ this.new_user +" raw_new_user="+ rawNewUser +" raw_is_new=" + config.is_new
        );
    }

    getCDNUrl(): string {
        return BUSINESS_COMMON_CONFIG.cdnUrl;
    }

    getServerReleaseUrl(): string {
        return BUSINESS_COMMON_CONFIG.serverDomainPrefix;
    }

    get_request_url(): string {
        return this.getServerReleaseUrl();
    }

    get_version_url(): string {
        return this.getServerReleaseUrl() + requestDescriptor.getUri("HotUpdate");
    }

    is_new_user(): boolean {
        return this.new_user === 1;
    }
}

export default new SystemDataStoreImpl();
