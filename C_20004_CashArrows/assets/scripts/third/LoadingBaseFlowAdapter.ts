export interface ILoadingFlow {
    onLoginReady(): void;
}

export class LoadingBaseFlow {
    public startFlow(flow: ILoadingFlow): void {
        flow.onLoginReady();
    }
}

export class LoadingBaseFlowAdapter {
    public static implementation: LoadingBaseFlow = new LoadingBaseFlow();

    public static setImplementation(implementation?: LoadingBaseFlow): void {
        LoadingBaseFlowAdapter.implementation = implementation || new LoadingBaseFlow();
    }

    public static getImplementation(): LoadingBaseFlow {
        return LoadingBaseFlowAdapter.implementation;
    }
}

export default LoadingBaseFlowAdapter;