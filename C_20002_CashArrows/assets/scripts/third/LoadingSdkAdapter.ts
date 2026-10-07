class DefaultLoadingSdkAdapter {
    initSdk(): void {
    }

    initSdkForWeb(): void {
    }
}

export default class LoadingSdkAdapter {
    static implementation: DefaultLoadingSdkAdapter = new DefaultLoadingSdkAdapter();

    static setImplementation(impl: DefaultLoadingSdkAdapter): void {
        this.implementation = impl || new DefaultLoadingSdkAdapter();
    }

    static getImplementation(): DefaultLoadingSdkAdapter {
        return this.implementation;
    }
}
