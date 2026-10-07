import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";
import { createLoadingProjectAdapterOverrides } from "./loading-project-adapter-core";
import { buildStandardDeps } from "./loading-standard-deps";

function applyOverrides(deps: any): void {
    applyLoadingAdapterOverrides(createLoadingProjectAdapterOverrides(deps));
}

export function initProjectLoadingAdapters(): void {
    applyOverrides(buildStandardDeps());
}

export function initProjectLoadingAdaptersWithDeps(deps: any): void {
    applyOverrides(deps);
}

export function initProjectLoadingAdaptersWithOverrides(overrides: any): void {
    applyOverrides(Object.assign({}, buildStandardDeps(), overrides));
}
