export interface LoadingBaseFlowContext {
    report: (event: string, data?: any) => void;
    onLoginReady: () => void;
    onShowWxLogin: () => void;
}

class LoadingBaseFlowAdapterImpl {
    startFlow(ctx: LoadingBaseFlowContext): void {
        ctx.onLoginReady();
    }
}

export default class LoadingBaseFlowAdapter {
    static implementation: LoadingBaseFlowAdapterImpl = new LoadingBaseFlowAdapterImpl();

    static setImplementation(impl?: LoadingBaseFlowAdapterImpl): void {
        this.implementation = impl || new LoadingBaseFlowAdapterImpl();
    }

    static getImplementation(): LoadingBaseFlowAdapterImpl {
        return this.implementation;
    }
}
