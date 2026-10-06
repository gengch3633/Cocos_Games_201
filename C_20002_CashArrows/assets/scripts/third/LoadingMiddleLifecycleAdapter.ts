export interface LoadingLifecycleHooks {
    onBan?(): void;
    onBackstop?(): void;
    onEnterGame?(): void;
    onShowUmp?(data?: unknown): void;
}

class DefaultLoadingMiddleLifecycleAdapter {
    bindLifecycleHooks(_hooks: LoadingLifecycleHooks): void {}

    onBanLog(): void {}

    onBackstopLog(): void {}

    onEnterGamePrepare(): void {}

    onShowUmpPrepare(): void {}
}

export default class LoadingMiddleLifecycleAdapter {
    static implementation: DefaultLoadingMiddleLifecycleAdapter = new DefaultLoadingMiddleLifecycleAdapter();

    static setImplementation(impl?: DefaultLoadingMiddleLifecycleAdapter): void {
        this.implementation = impl || new DefaultLoadingMiddleLifecycleAdapter();
    }

    static getImplementation(): DefaultLoadingMiddleLifecycleAdapter {
        return this.implementation;
    }
}
