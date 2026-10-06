export interface LoadingBaseFlowContext {
    report(event: string, data?: Record<string, unknown>): unknown;
    onLoginReady(): void;
    onShowWxLogin?(): void;
}

class DefaultLoadingBaseFlowAdapter {
    startFlow(context: LoadingBaseFlowContext): void {
        context.onLoginReady();
    }
}

export default class LoadingBaseFlowAdapter {
    static implementation: DefaultLoadingBaseFlowAdapter = new DefaultLoadingBaseFlowAdapter();

    static setImplementation(impl?: DefaultLoadingBaseFlowAdapter): void {
        this.implementation = impl || new DefaultLoadingBaseFlowAdapter();
    }

    static getImplementation(): DefaultLoadingBaseFlowAdapter {
        return this.implementation;
    }
}
