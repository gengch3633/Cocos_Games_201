export interface ILoadingSdkAdapter {
    reportData(): void;
    getCurrentCountry(): string;
}

class LoadingSdkAdapterImpl implements ILoadingSdkAdapter {
    public reportData(): void {
    }

    public getCurrentCountry(): string {
        return "";
    }
}

export default class LoadingSdkAdapter {
    private static implementation: ILoadingSdkAdapter = new LoadingSdkAdapterImpl();

    public static setImplementation(impl?: ILoadingSdkAdapter | null): void {
        this.implementation = impl || new LoadingSdkAdapterImpl();
    }

    public static getImplementation(): ILoadingSdkAdapter {
        return this.implementation;
    }
}