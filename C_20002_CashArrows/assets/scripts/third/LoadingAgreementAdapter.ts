import LoadingAgreementService from "./LoadingAgreementService";

class DefaultLoadingAgreementAdapter {
    agreementService = new LoadingAgreementService();

    getAgreementState(): number {
        return this.agreementService.getAgreementState();
    }

    shouldShowAgreement(): boolean {
        return this.agreementService.shouldShowAgreement();
    }

    markAgreementAccepted(): void {
        this.agreementService.markAgreementAccepted();
    }

    shouldGateByMiddleReview(): boolean {
        return false;
    }
}

export default class LoadingAgreementAdapter {
    static implementation: DefaultLoadingAgreementAdapter = new DefaultLoadingAgreementAdapter();

    static setImplementation(impl: DefaultLoadingAgreementAdapter): void {
        this.implementation = impl || new DefaultLoadingAgreementAdapter();
    }

    static getImplementation(): DefaultLoadingAgreementAdapter {
        return this.implementation;
    }
}
