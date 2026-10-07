class DefaultLoadingHotUpdateAdapter {
    start(context: any): void {
        context.report("page_loading_No_HP");
        context.report("page_loading_finishInit");
        context.onFinish();
    }
}

export default class LoadingHotUpdateAdapter {
    static implementation: DefaultLoadingHotUpdateAdapter = new DefaultLoadingHotUpdateAdapter();

    static setImplementation(impl: DefaultLoadingHotUpdateAdapter): void {
        this.implementation = impl || new DefaultLoadingHotUpdateAdapter();
    }

    static getImplementation(): DefaultLoadingHotUpdateAdapter {
        return this.implementation;
    }
}
