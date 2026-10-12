const { ccclass } = cc._decorator;

@ccclass
export class LoadingMiddleLifecycleAdapterBase {

    public bindLifecycleHooks(): void {
    }

    public onBanLog(): void {
    }

    public onBackstopLog(): void {
    }

    public onEnterGamePrepare(): void {
    }

    public onShowUmpPrepare(): void {
    }
}

@ccclass
export default class LoadingMiddleLifecycleAdapter {

    public static implementation: LoadingMiddleLifecycleAdapterBase = new LoadingMiddleLifecycleAdapterBase();

    public static setImplementation(implementation?: LoadingMiddleLifecycleAdapterBase | null): void {
        LoadingMiddleLifecycleAdapter.implementation = implementation || new LoadingMiddleLifecycleAdapterBase();
    }

    public static getImplementation(): LoadingMiddleLifecycleAdapterBase {
        return LoadingMiddleLifecycleAdapter.implementation;
    }
}