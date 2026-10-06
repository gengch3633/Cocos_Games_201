class DefaultLoadingBootstrapAdapter {
    patchInstantiate() {
    }

    registerGlobalError() {
    }

    initPageManager() {
    }

    disableMultiTouch() {
        cc.macro.ENABLE_MULTI_TOUCH = false;
    }

    initLanguage() {
    }

    initSystem() {
    }

    bindPilot() {
    }

    startMiddleCountryForWeb() {
    }
}

export default class LoadingBootstrapAdapter {
    static implementation: DefaultLoadingBootstrapAdapter = new DefaultLoadingBootstrapAdapter();

    static setImplementation(impl: DefaultLoadingBootstrapAdapter) {
        this.implementation = impl || new DefaultLoadingBootstrapAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
