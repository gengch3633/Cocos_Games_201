import LoadingAgreementService from "./LoadingAgreementService";

class LoadingAgreementAdapterImpl {
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
    static implementation: LoadingAgreementAdapterImpl = new LoadingAgreementAdapterImpl();

    static setImplementation(impl?: LoadingAgreementAdapterImpl): void {
        this.implementation = impl || new LoadingAgreementAdapterImpl();
    }

    static getImplementation(): LoadingAgreementAdapterImpl {
        return this.implementation;
    }
}
