class LoadingBootstrapAdapterImpl {
    patchInstantiate(): void {}

    registerGlobalError(): void {}

    initPageManager(): void {}

    disableMultiTouch(): void {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    initLanguage(): void {}

    initSystem(): void {}

    bindPilot(): void {}

    startMiddleCountryForWeb(): void {}
}

export default class LoadingBootstrapAdapter {
    static implementation: LoadingBootstrapAdapterImpl = new LoadingBootstrapAdapterImpl();

    static setImplementation(impl?: LoadingBootstrapAdapterImpl): void {
        this.implementation = impl || new LoadingBootstrapAdapterImpl();
    }

    static getImplementation(): LoadingBootstrapAdapterImpl {
        return this.implementation;
    }
}
