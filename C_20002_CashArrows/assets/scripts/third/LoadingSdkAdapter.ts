class LoadingSdkAdapterImpl {
    reportData(_event?: string, _data?: any): void {}

    getCurrentCountry(): string {
        return "";
    }
}

export default class LoadingSdkAdapter {
    static implementation: LoadingSdkAdapterImpl = new LoadingSdkAdapterImpl();

    static setImplementation(impl?: LoadingSdkAdapterImpl): void {
        this.implementation = impl || new LoadingSdkAdapterImpl();
    }

    static getImplementation(): LoadingSdkAdapterImpl {
        return this.implementation;
    }
}
