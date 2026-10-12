import * as BusinessCommonConfig from "./BusinessCommonConfig";
import BusinessRequestDescriptors from "./BusinessRequestDescriptors";
import RequestDescriptor from "./RequestDescriptor";

interface IInitConfig {
    is_encrypt?: number;
    new_user?: number | boolean;
    is_new?: boolean;
}

const requestDescriptor = new RequestDescriptor(BusinessRequestDescriptors.BUSINESS_REQUEST_DESCRIPTORS);

class SystemDataStore {
    public gameName: string;
    public encrypt: number;
    public new_user: number;

    private _languageType: string | number;

    constructor() {
        this.gameName = BusinessCommonConfig.BUSINESS_COMMON_CONFIG.gameName;
        this.encrypt = 1;
        this.new_user = 0;
        this._languageType = BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage;
    }

    public setLanguageType(languageType: string | number): void {
        this._languageType = languageType;
    }

    public getLanguageType(): string | number {
        return this._languageType;
    }

    public init_config(config: IInitConfig): void {
        const isEncrypt = config.is_encrypt;
        const rawNewUser = config.new_user;
        this.encrypt = isEncrypt || 0;
        const newUser = rawNewUser != null ? rawNewUser : config.is_new;
        this.new_user = newUser ? 1 : 0;
        console.log("[SystemDataStore] init_config: new_user=" + this.new_user + " raw_new_user=" + rawNewUser + " raw_is_new=" + config.is_new);
    }

    public getCDNUrl(): string {
        return BusinessCommonConfig.BUSINESS_COMMON_CONFIG.cdnUrl;
    }

    public getServerReleaseUrl(): string {
        return BusinessCommonConfig.BUSINESS_COMMON_CONFIG.serverDomainPrefix;
    }

    public get_request_url(): string {
        return this.getServerReleaseUrl();
    }

    public get_version_url(): string {
        return this.getServerReleaseUrl() + requestDescriptor.getUri("HotUpdate");
    }

    public is_new_user(): boolean {
        return this.new_user === 1;
    }
}

const systemDataStore = new SystemDataStore();

export default systemDataStore;