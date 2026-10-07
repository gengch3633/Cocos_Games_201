export interface LoadingHotUpdateContext {
    report: (event: string, data?: any) => void;
    onUpdateProgress: (current: number, total: number) => void;
    onFinish: () => void;
}

class LoadingHotUpdateAdapterImpl {
    start(ctx: LoadingHotUpdateContext): void {
        ctx.report("page_loading_No_HP");
        ctx.report("page_loading_finishInit");
        ctx.onFinish();
    }
}

export default class LoadingHotUpdateAdapter {
    static implementation: LoadingHotUpdateAdapterImpl = new LoadingHotUpdateAdapterImpl();

    static setImplementation(impl?: LoadingHotUpdateAdapterImpl): void {
        this.implementation = impl || new LoadingHotUpdateAdapterImpl();
    }

    static getImplementation(): LoadingHotUpdateAdapterImpl {
        return this.implementation;
    }
}
