import * as LoadingAdapterRegistry from "./LoadingAdapterRegistry";

const adapterOverrides: any = {};

export function initLoadingProjectAdapters(): void {
    LoadingAdapterRegistry.applyLoadingAdapterOverrides(adapterOverrides);
}