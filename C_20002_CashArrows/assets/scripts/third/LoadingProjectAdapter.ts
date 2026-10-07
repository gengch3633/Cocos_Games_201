import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";

const overrides = {};

export function initLoadingProjectAdapters(): void {
    applyLoadingAdapterOverrides(overrides);
}
