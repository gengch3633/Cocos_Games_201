class DefaultLoadingBaseFlowAdapter {
    startFlow(deps: any) {
        deps.onLoginReady();
    }
}

export default class LoadingBaseFlowAdapter {
    static implementation: DefaultLoadingBaseFlowAdapter = new DefaultLoadingBaseFlowAdapter();

    static setImplementation(impl: DefaultLoadingBaseFlowAdapter) {
        this.implementation = impl || new DefaultLoadingBaseFlowAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
