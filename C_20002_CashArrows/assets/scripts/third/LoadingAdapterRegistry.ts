import LoadingAgreementAdapter from "./LoadingAgreementAdapter";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";
import LoadingBootstrapAdapter from "./LoadingBootstrapAdapter";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";
import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";
import LoadingSdkAdapter from "./LoadingSdkAdapter";

export function applyLoadingAdapterOverrides(overrides: any = {}): void {
    if (overrides.sdk) {
        LoadingSdkAdapter.setImplementation(overrides.sdk);
    }
    if (overrides.sceneProgress) {
        LoadingSceneProgressAdapter.setImplementation(overrides.sceneProgress);
    }
    if (overrides.bootstrap) {
        LoadingBootstrapAdapter.setImplementation(overrides.bootstrap);
    }
    if (overrides.agreement) {
        LoadingAgreementAdapter.setImplementation(overrides.agreement);
    }
    if (overrides.lifecycle) {
        LoadingMiddleLifecycleAdapter.setImplementation(overrides.lifecycle);
    }
    if (overrides.baseFlow) {
        LoadingBaseFlowAdapter.setImplementation(overrides.baseFlow);
    }
    if (overrides.hotUpdate) {
        LoadingHotUpdateAdapter.setImplementation(overrides.hotUpdate);
    }
}
