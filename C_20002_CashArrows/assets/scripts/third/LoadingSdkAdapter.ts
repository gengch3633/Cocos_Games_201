class DefaultLoadingSdkAdapter {
    reportData() {
    }

    getCurrentCountry() {
        return "";
    }
}

export default class LoadingSdkAdapter {
    static implementation: DefaultLoadingSdkAdapter = new DefaultLoadingSdkAdapter();

    static setImplementation(impl: DefaultLoadingSdkAdapter) {
        this.implementation = impl || new DefaultLoadingSdkAdapter();
    }

    static getImplementation() {
        return this.implementation;
    }
}
