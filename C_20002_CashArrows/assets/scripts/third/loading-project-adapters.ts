import { applyLoadingAdapterOverrides } from "./LoadingAdapterRegistry";
import { createLoadingProjectAdapterOverrides } from "./loading-project-adapter-core";
import { buildStandardDeps } from "./loading-standard-deps";

function r(e) {
applyLoadingAdapterOverrides(createLoadingProjectAdapterOverrides(e));
}
export function initProjectLoadingAdapters() {
r(buildStandardDeps());
};
export function initProjectLoadingAdaptersWithDeps(e) {
r(e);
};
export function initProjectLoadingAdaptersWithOverrides(e) {
r(__assign(__assign({}, buildStandardDeps()), e));
};
