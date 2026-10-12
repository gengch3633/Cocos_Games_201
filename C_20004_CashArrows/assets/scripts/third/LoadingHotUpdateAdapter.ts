interface HotUpdateManager {
    report(eventName: string): void;
    onFinish(): void;
}

class DefaultLoadingHotUpdateAdapter {
    public start(manager: HotUpdateManager): void {
        manager.report("page_loading_No_HP");
        manager.report("page_loading_finishInit");
        manager.onFinish();
    }
}

export default class LoadingHotUpdateAdapter {
    public static implementation: DefaultLoadingHotUpdateAdapter = new DefaultLoadingHotUpdateAdapter();

    public static setImplementation(impl?: DefaultLoadingHotUpdateAdapter): void {
        LoadingHotUpdateAdapter.implementation = impl || new DefaultLoadingHotUpdateAdapter();
    }

    public static getImplementation(): DefaultLoadingHotUpdateAdapter {
        return LoadingHotUpdateAdapter.implementation;
    }
}