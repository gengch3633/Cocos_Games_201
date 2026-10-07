class DefaultLoadingBaseFlowAdapter {
    startFlow(flow: any): void {
        flow.onLoginReady();
    }
}

export default class LoadingBaseFlowAdapter {
    static implementation: DefaultLoadingBaseFlowAdapter = new DefaultLoadingBaseFlowAdapter();

    static setImplementation(impl: DefaultLoadingBaseFlowAdapter): void {
        this.implementation = impl || new DefaultLoadingBaseFlowAdapter();
    }

    static getImplementation(): DefaultLoadingBaseFlowAdapter {
        return this.implementation;
    }
}
