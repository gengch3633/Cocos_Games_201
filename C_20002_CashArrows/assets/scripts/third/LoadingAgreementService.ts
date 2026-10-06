export default class LoadingAgreementService {
    agreementStateKey = "argreement_state";

    shouldShowAgreement(): boolean {
        return Number(this.localStorageGetItem(this.agreementStateKey, "0")) === 0;
    }

    markAgreementAccepted(): void {
        this.localStorageSetItem(this.agreementStateKey, "1");
    }

    getAgreementState(): number {
        return Number(this.localStorageGetItem(this.agreementStateKey, "0"));
    }

    localStorageGetItem(key: string, fallback = ""): string {
        const value = cc.sys.localStorage.getItem(key);
        return value == null ? fallback : value;
    }

    localStorageSetItem(key: string, value: string): void {
        cc.sys.localStorage.setItem(key, value);
    }
}
