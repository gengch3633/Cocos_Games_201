class DefaultLoadingBootstrapAdapter {
    patchInstantiate(): void {
    }

    registerGlobalError(): void {
    }

    initPageManager(): void {
    }

    disableMultiTouch(): void {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    initLanguage(): void {
    }

    initSystem(): void {
    }

    bindPilot(): void {
    }

    startMiddleCountryForWeb(): void {
    }
}

export default class LoadingBootstrapAdapter {
    static implementation: DefaultLoadingBootstrapAdapter = new DefaultLoadingBootstrapAdapter();

    static setImplementation(impl: DefaultLoadingBootstrapAdapter): void {
        this.implementation = impl || new DefaultLoadingBootstrapAdapter();
    }

    static getImplementation(): DefaultLoadingBootstrapAdapter {
        return this.implementation;
    }
}
