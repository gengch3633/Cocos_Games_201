export interface LoadingLifecycleHooks {
    onBan: () => void;
    onBackstop: () => void;
    onEnterGame: () => void;
    onShowUmp: (callback: (agreed: boolean) => void) => void;
}

class LoadingMiddleLifecycleAdapterImpl {
    bindLifecycleHooks(_hooks: LoadingLifecycleHooks): void {}

    onBanLog(): void {}

    onBackstopLog(): void {}

    onEnterGamePrepare(): void {}

    onShowUmpPrepare(): void {}
}

export default class LoadingMiddleLifecycleAdapter {
    static implementation: LoadingMiddleLifecycleAdapterImpl = new LoadingMiddleLifecycleAdapterImpl();

    static setImplementation(impl?: LoadingMiddleLifecycleAdapterImpl): void {
        this.implementation = impl || new LoadingMiddleLifecycleAdapterImpl();
    }

    static getImplementation(): LoadingMiddleLifecycleAdapterImpl {
        return this.implementation;
    }
}
