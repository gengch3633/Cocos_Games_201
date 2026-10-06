import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";

const defaultOverrides = {};

export function initLoadingProjectAdapters(): void {
    applyLoadingAdapterOverrides(defaultOverrides);
}
