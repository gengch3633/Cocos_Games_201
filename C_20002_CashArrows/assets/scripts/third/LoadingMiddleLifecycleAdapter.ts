class DefaultLoadingMiddleLifecycleAdapter {
    bindLifecycleHooks(_hooks?: any) {
    }

    onBanLog() {
    }

    onBackstopLog() {
    }

    onEnterGamePrepare() {
    }

    onShowUmpPrepare() {
    }
}

export default class LoadingMiddleLifecycleAdapter {
    static implementation: DefaultLoadingMiddleLifecycleAdapter = new DefaultLoadingMiddleLifecycleAdapter();

    static setImplementation(impl: DefaultLoadingMiddleLifecycleAdapter) {
        this.implementation = impl || new DefaultLoadingMiddleLifecycleAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
