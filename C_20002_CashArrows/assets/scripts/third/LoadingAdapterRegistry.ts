import LoadingAgreementAdapter from "./LoadingAgreementAdapter";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";
import LoadingBootstrapAdapter from "./LoadingBootstrapAdapter";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";
import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";
import LoadingSdkAdapter from "./LoadingSdkAdapter";

export function applyLoadingAdapterOverrides(overrides: any = {}) {
    overrides.sdk && LoadingSdkAdapter.setImplementation(overrides.sdk);
    overrides.sceneProgress && LoadingSceneProgressAdapter.setImplementation(overrides.sceneProgress);
    overrides.bootstrap && LoadingBootstrapAdapter.setImplementation(overrides.bootstrap);
    overrides.agreement && LoadingAgreementAdapter.setImplementation(overrides.agreement);
    overrides.lifecycle && LoadingMiddleLifecycleAdapter.setImplementation(overrides.lifecycle);
    overrides.baseFlow && LoadingBaseFlowAdapter.setImplementation(overrides.baseFlow);
    overrides.hotUpdate && LoadingHotUpdateAdapter.setImplementation(overrides.hotUpdate);
}
