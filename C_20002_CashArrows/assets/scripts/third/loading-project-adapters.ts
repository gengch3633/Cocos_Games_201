import { createLoadingProjectAdapterOverrides } from "./loading-project-adapter-core";
import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";
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
    applyOverrides({ ...buildStandardDeps(), ...overrides });
}
