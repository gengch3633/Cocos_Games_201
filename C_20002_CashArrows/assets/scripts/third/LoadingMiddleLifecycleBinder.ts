import LoadingMiddleLifecycleAdapter, { LoadingLifecycleHooks } from "./LoadingMiddleLifecycleAdapter";

export default class LoadingMiddleLifecycleBinder {
    bind(hooks: LoadingLifecycleHooks): void {
        LoadingMiddleLifecycleAdapter.getImplementation().bindLifecycleHooks(hooks);
    }
}
