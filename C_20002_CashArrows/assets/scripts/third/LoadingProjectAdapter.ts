import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";

class DefaultLoadingProjectAdapter {
    applyOverrides(): void {
        applyLoadingAdapterOverrides();
    }
}

export default class LoadingProjectAdapter {
    static implementation: DefaultLoadingProjectAdapter = new DefaultLoadingProjectAdapter();

    static setImplementation(impl: DefaultLoadingProjectAdapter): void {
        this.implementation = impl || new DefaultLoadingProjectAdapter();
    }

    static getImplementation(): DefaultLoadingProjectAdapter {
        return this.implementation;
    }
}
