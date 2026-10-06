// @ts-nocheck
import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";
import { createLoadingProjectAdapterOverrides } from "./loading-project-adapter-core";
import { buildStandardDeps } from "./loading-standard-deps";

function applyOverrides(deps) {
    applyLoadingAdapterOverrides(createLoadingProjectAdapterOverrides(deps));
}

export function initProjectLoadingAdapters() {
    applyOverrides(buildStandardDeps());
}

export function initProjectLoadingAdaptersWithDeps(deps) {
    applyOverrides(deps);
}

export function initProjectLoadingAdaptersWithOverrides(overrides) {
    applyOverrides(Object.assign({}, buildStandardDeps(), overrides));
}
