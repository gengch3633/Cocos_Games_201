import LoadingAgreementAdapter from "./LoadingAgreementAdapter";
import LoadingBaseFlowAdapter from "./LoadingBaseFlowAdapter";
import LoadingBootstrapAdapter from "./LoadingBootstrapAdapter";
import LoadingHotUpdateAdapter from "./LoadingHotUpdateAdapter";
import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";
import LoadingSceneProgressAdapter from "./LoadingSceneProgressAdapter";
import LoadingSdkAdapter from "./LoadingSdkAdapter";

export interface LoadingAdapterOverrides {
    sdk?: Parameters<typeof LoadingSdkAdapter.setImplementation>[0];
    sceneProgress?: Parameters<typeof LoadingSceneProgressAdapter.setImplementation>[0];
    bootstrap?: Parameters<typeof LoadingBootstrapAdapter.setImplementation>[0];
    agreement?: Parameters<typeof LoadingAgreementAdapter.setImplementation>[0];
    lifecycle?: Parameters<typeof LoadingMiddleLifecycleAdapter.setImplementation>[0];
    baseFlow?: Parameters<typeof LoadingBaseFlowAdapter.setImplementation>[0];
    hotUpdate?: Parameters<typeof LoadingHotUpdateAdapter.setImplementation>[0];
}

export function applyLoadingAdapterOverrides(overrides: LoadingAdapterOverrides = {}): void {
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
