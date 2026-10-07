import BusinessAnalyticsService from "./BusinessAnalyticsService";
import LoadingBootstrapAdapter from "./LoadingBootstrapAdapter";

export interface LoadingBootstrapServiceDeps {
    setLoadingActive: (active: boolean) => void;
    startLoadingTicker: () => void;
    preloadAssets: () => void;
}

export default class LoadingBootstrapService {
    deps: LoadingBootstrapServiceDeps;

    constructor(deps: LoadingBootstrapServiceDeps) {
        this.deps = deps;
    }

    run(): void {
        const adapter = LoadingBootstrapAdapter.getImplementation();
        adapter.patchInstantiate();
        BusinessAnalyticsService.reportData("u_loading_page_show");
        adapter.registerGlobalError();
        adapter.initPageManager();
        adapter.disableMultiTouch();
        this.deps.setLoadingActive(true);
        this.deps.startLoadingTicker();
        this.deps.preloadAssets();
        adapter.initLanguage();
        adapter.initSystem();
        adapter.bindPilot();
        BusinessAnalyticsService.reportData("page_loading_onLoad");
        adapter.startMiddleCountryForWeb();
    }
}
