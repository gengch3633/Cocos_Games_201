import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

export default class LoadingMiddleLifecycleBinder {
    bind(host: any) {
        LoadingMiddleLifecycleAdapter.getImplementation().bindLifecycleHooks(host);
    }
}
