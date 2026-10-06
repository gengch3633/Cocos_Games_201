import LoadingAgreementService from "./LoadingAgreementService";

class DefaultLoadingAgreementAdapter {
    agreementService = new LoadingAgreementService();

    getAgreementState() {
        return this.agreementService.getAgreementState();
    }

    shouldShowAgreement() {
        return this.agreementService.shouldShowAgreement();
    }

    markAgreementAccepted() {
        this.agreementService.markAgreementAccepted();
    }

    shouldGateByMiddleReview() {
        return false;
    }
}

export default class LoadingAgreementAdapter {
    static implementation: DefaultLoadingAgreementAdapter = new DefaultLoadingAgreementAdapter();

    static setImplementation(impl: DefaultLoadingAgreementAdapter) {
        this.implementation = impl || new DefaultLoadingAgreementAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
