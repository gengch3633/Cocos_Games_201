export default class LoadingAgreementService {
    agreementStateKey = "argreement_state";

    shouldShowAgreement() {
        return 0 === Number(this.localStorageGetItem(this.agreementStateKey, "0"));
    }

    markAgreementAccepted() {
        this.localStorageSetItem(this.agreementStateKey, "1");
    }

    getAgreementState() {
        return Number(this.localStorageGetItem(this.agreementStateKey, "0"));
    }

    localStorageGetItem(key: string, defaultValue: string = "") {
        var value = cc.sys.localStorage.getItem(key);
        return null == value ? defaultValue : value;
    }

    localStorageSetItem(key: string, value: string) {
        cc.sys.localStorage.setItem(key, value);
    }
}
