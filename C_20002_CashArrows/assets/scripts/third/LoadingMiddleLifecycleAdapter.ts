class DefaultLoadingMiddleLifecycleAdapter {
    bindLifecycleHooks(hooks: any): void {
    }

    onBanLog(): void {
    }

    onBackstopLog(): void {
    }

    onEnterGamePrepare(): void {
    }

    onShowUmpPrepare(): void {
    }
}

export default class LoadingMiddleLifecycleAdapter {
    static implementation: DefaultLoadingMiddleLifecycleAdapter = new DefaultLoadingMiddleLifecycleAdapter();

    static setImplementation(impl: DefaultLoadingMiddleLifecycleAdapter): void {
        this.implementation = impl || new DefaultLoadingMiddleLifecycleAdapter();
    }

    static getImplementation(): DefaultLoadingMiddleLifecycleAdapter {
        return this.implementation;
    }
}
