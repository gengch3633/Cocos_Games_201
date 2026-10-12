import LoadingMiddleLifecycleAdapter from "./LoadingMiddleLifecycleAdapter";

export default class LoadingMiddleLifecycleBinder {
    public bind(hooks: any): void {
        LoadingMiddleLifecycleAdapter.getImplementation().bindLifecycleHooks(hooks);
    }
}