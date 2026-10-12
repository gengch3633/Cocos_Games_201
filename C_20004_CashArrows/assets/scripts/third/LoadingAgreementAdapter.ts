import LoadingAgreementService from "./LoadingAgreementService";

export interface ILoadingAgreementAdapter {
    getAgreementState(): any;
    shouldShowAgreement(): any;
    markAgreementAccepted(): void;
    shouldGateByMiddleReview(): boolean;
}

class LoadingAgreementAdapterImpl implements ILoadingAgreementAdapter {
    public agreementService: LoadingAgreementService;

    public constructor() {
        this.agreementService = new LoadingAgreementService();
    }

    public getAgreementState(): any {
        return this.agreementService.getAgreementState();
    }

    public shouldShowAgreement(): any {
        return this.agreementService.shouldShowAgreement();
    }

    public markAgreementAccepted(): void {
        this.agreementService.markAgreementAccepted();
    }

    public shouldGateByMiddleReview(): boolean {
        return false;
    }
}

export default class LoadingAgreementAdapter {
    public static implementation: ILoadingAgreementAdapter = new LoadingAgreementAdapterImpl();

    public static setImplementation(implementation?: ILoadingAgreementAdapter | null): void {
        this.implementation = implementation || new LoadingAgreementAdapterImpl();
    }

    public static getImplementation(): ILoadingAgreementAdapter {
        return this.implementation;
    }
}