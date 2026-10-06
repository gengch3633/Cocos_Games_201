class DefaultLoadingHotUpdateAdapter {
    start(deps: any) {
        deps.report("page_loading_No_HP");
        deps.report("page_loading_finishInit");
        deps.onFinish();
    }
}

export default class LoadingHotUpdateAdapter {
    static implementation: DefaultLoadingHotUpdateAdapter = new DefaultLoadingHotUpdateAdapter();

    static setImplementation(impl: DefaultLoadingHotUpdateAdapter) {
        this.implementation = impl || new DefaultLoadingHotUpdateAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
