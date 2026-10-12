class DefaultLoadingBootstrapAdapter {
    public patchInstantiate(): void {
    }

    public registerGlobalError(): void {
    }

    public initPageManager(): void {
    }

    public disableMultiTouch(): void {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    public initLanguage(): void {
    }

    public initSystem(): void {
    }

    public bindPilot(): void {
    }

    public startMiddleCountryForWeb(): void {
    }
}

export default class LoadingBootstrapAdapter {
    public static implementation: DefaultLoadingBootstrapAdapter = new DefaultLoadingBootstrapAdapter();

    public static setImplementation(impl: DefaultLoadingBootstrapAdapter): void {
        this.implementation = impl || new DefaultLoadingBootstrapAdapter();
    }

    public static getImplementation(): DefaultLoadingBootstrapAdapter {
        return this.implementation;
    }
}