import ResKeeper from "./ResKeeper";
import ResLoader from "./ResLoader";
import Singleton from "./Singleton";

export default class ResMgr extends Singleton {
    resLoader: ResLoader = ResLoader.getInstance();

    get remoteUrl(): string {
        return this.resLoader.remoteUrl;
    }

    set remoteUrl(value: string) {
        this.resLoader.remoteUrl = value;
    }

    getBundle(bundleName: string): Promise<cc.AssetManager.Bundle> {
        return this.resLoader.getBundle(bundleName);
    }

    loadRes<T extends cc.Asset>(
        path: string,
        type: typeof cc.Asset,
        keeperNode: cc.Node = null,
        bundleName?: string,
        onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void
    ): Promise<T> {
        const loader = keeperNode ? this.getKeeper(keeperNode) : this.resLoader;
        return loader?.loadRes(path, type, bundleName, onProgress);
    }

    setSpriteFrame(
        target: cc.Sprite | cc.Node,
        path: string,
        bundleName?: string,
        keeperNode: cc.Node = null
    ): Promise<void> {
        const keeper = keeperNode ? this.getKeeper(keeperNode) : this.getKeeper(target, true);
        return keeper?.setSpriteFrame(target, path, bundleName);
    }

    async setSkeleton(
        target: sp.Skeleton | cc.Node,
        path: string,
        bundleName?: string,
        animation?: string,
        keeperNode: cc.Node = null
    ): Promise<void> {
        const keeper = keeperNode ? this.getKeeper(keeperNode) : this.getKeeper(target, true);
        return keeper?.setSkeleton(target, path, bundleName, animation);
    }

    instantiate(prefab: cc.Prefab | cc.Node, parent?: cc.Node): cc.Node {
        const node = cc.instantiate(prefab);
        if (node) {
            if (parent?.isValid && node.parent !== parent) {
                node.parent = parent;
            }
            return node;
        }
        return null;
    }

    async instantiateByUrl(
        path: string,
        parent?: cc.Node,
        bundleName?: string,
        onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void
    ): Promise<cc.Node> {
        const prefab = await this.resLoader.loadRes(path, cc.Prefab, bundleName, onProgress);
        return prefab ? this.instantiate(prefab, parent) : null;
    }

    getKeeper(node: cc.Node | cc.Component, createIfMissing: boolean = false): ResKeeper {
        if (!node || !(node as cc.Node).isValid) {
            return null;
        }
        const targetNode = node instanceof cc.Node ? node : node.node;
        let keeper = targetNode.getComponent(ResKeeper);
        if (keeper) {
            return keeper;
        }
        if (createIfMissing) {
            return targetNode.addComponent(ResKeeper);
        }
        return this.getKeeper(targetNode.parent, createIfMissing);
    }
}
