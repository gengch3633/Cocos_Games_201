export interface LoadingHotUpdateContext {
    report(event: string, data?: Record<string, unknown>): unknown;
    onUpdateProgress?(progress: unknown): void;
    onFinish(): void;
}

class DefaultLoadingHotUpdateAdapter {
    start(context: LoadingHotUpdateContext): void {
        context.report("page_loading_No_HP");
        context.report("page_loading_finishInit");
        context.onFinish();
    }
}

export default class LoadingHotUpdateAdapter {
    static implementation: DefaultLoadingHotUpdateAdapter = new DefaultLoadingHotUpdateAdapter();

    static setImplementation(impl?: DefaultLoadingHotUpdateAdapter): void {
        this.implementation = impl || new DefaultLoadingHotUpdateAdapter();
    }

    static getImplementation(): DefaultLoadingHotUpdateAdapter {
        return this.implementation;
    }
}
