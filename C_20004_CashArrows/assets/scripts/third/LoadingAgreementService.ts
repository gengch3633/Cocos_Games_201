export default class LoadingAgreementService {
    private agreementStateKey: string = "argreement_state";

    public shouldShowAgreement(): boolean {
        return 0 === Number(this.localStorageGetItem(this.agreementStateKey, "0"));
    }

    public markAgreementAccepted(): void {
        this.localStorageSetItem(this.agreementStateKey, "1");
    }

    public getAgreementState(): number {
        return Number(this.localStorageGetItem(this.agreementStateKey, "0"));
    }

    private localStorageGetItem(key: string, defaultValue: string = ""): string {
        const value = cc.sys.localStorage.getItem(key);
        return value == null ? defaultValue : value;
    }

    private localStorageSetItem(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
    }
}