import LoadingBootstrapAdapter from "./LoadingBootstrapAdapter";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

export default class LoadingBootstrapService {
    deps: any;

    constructor(deps: any) {
        this.deps = deps;
    }

    run() {
        var impl = LoadingBootstrapAdapter.getImplementation();
        impl.patchInstantiate();
        BusinessAnalyticsService.reportData(" u_loading_page_show ");
        impl.registerGlobalError();
        impl.initPageManager();
        impl.disableMultiTouch();
        this.deps.setLoadingActive(true);
        this.deps.startLoadingTicker();
        this.deps.preloadAssets();
        impl.initLanguage();
        impl.initSystem();
        impl.bindPilot();
        BusinessAnalyticsService.reportData(" page_loading_onLoad ");
        impl.startMiddleCountryForWeb();
    }
}
