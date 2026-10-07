import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

export default class LoadingMiddleLifecycleBinder {
    bind(context: any): void {
        LoadingMiddleLifecycleAdapter.getImplementation().bindLifecycleHooks(context);
    }
}
