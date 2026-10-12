import * as LoadingAdapterRegistry from "./LoadingAdapterRegistry";
import * as LoadingProjectAdapterCore from "./loading-project-adapter-core";
import * as LoadingStandardDeps from "./loading-standard-deps";

function applyOverrides(deps: any): void {
    LoadingAdapterRegistry.applyLoadingAdapterOverrides(LoadingProjectAdapterCore.createLoadingProjectAdapterOverrides(deps));
}

export function initProjectLoadingAdapters(): void {
    applyOverrides(LoadingStandardDeps.buildStandardDeps());
}

export function initProjectLoadingAdaptersWithDeps(deps: any): void {
    applyOverrides(deps);
}

export function initProjectLoadingAdaptersWithOverrides(overrides: any): void {
    applyOverrides(Object.assign({}, LoadingStandardDeps.buildStandardDeps(), overrides));
}