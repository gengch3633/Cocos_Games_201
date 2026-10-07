import ResKeeper from "./ResKeeper";
import ResLoader from "./ResLoader";
import Singleton from "./Singleton";

export default class ResMgr extends Singleton {
    resLoader = ResLoader.getInstance();

    get remoteUrl(): string {
        return this.resLoader.remoteUrl;
    }

    set remoteUrl(value: string) {
        this.resLoader.remoteUrl = value;
    }

    getBundle(bundleName?: string): Promise<cc.AssetManager.Bundle | null> {
        return this.resLoader.getBundle(bundleName);
    }

    loadRes(
        path: string,
        type: typeof cc.Asset,
        keeperNode: cc.Node | cc.Component | null = null,
        bundleName?: string,
        onProgress?: (finished: number, total: number) => void
    ): Promise<any> | undefined {
        const keeper = keeperNode ? this.getKeeper(keeperNode) : this.resLoader;
        return keeper?.loadRes(path, type, bundleName, onProgress);
    }

    setSpriteFrame(
        target: cc.Sprite | cc.Node,
        path: string,
        bundleName?: string,
        keeperNode: cc.Node | cc.Component | null = null
    ): Promise<void> | undefined {
        const keeper = keeperNode ? this.getKeeper(keeperNode) : this.getKeeper(target, true);
        return keeper?.setSpriteFrame(target, path, bundleName);
    }

    async setSkeleton(
        target: sp.Skeleton | cc.Node,
        path: string,
        bundleName?: string,
        animation?: string,
        keeperNode: cc.Node | cc.Component | null = null
    ): Promise<void> {
        const keeper = keeperNode ? this.getKeeper(keeperNode) : this.getKeeper(target, true);
        return keeper?.setSkeleton(target, path, bundleName, animation);
    }

    instantiate(prefab: cc.Prefab | cc.Node, parent?: cc.Node): cc.Node | null {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        if (parent?.isValid && node.parent !== parent) {
            node.parent = parent;
        }
        return node;
    }

    async instantiateByUrl(
        path: string,
        parent?: cc.Node,
        bundleName?: string,
        onProgress?: (finished: number, total: number) => void
    ): Promise<cc.Node | null> {
        const prefab = await this.resLoader.loadRes(path, cc.Prefab, bundleName, onProgress);
        return prefab ? this.instantiate(prefab, parent) : null;
    }

    getKeeper(target: cc.Node | cc.Component, createIfMissing = false): ResKeeper | null {
        if (!target || !target.isValid) {
            return null;
        }
        const keeper = target.getComponent(ResKeeper);
        if (keeper) {
            return keeper;
        }
        if (createIfMissing) {
            return target.addComponent(ResKeeper);
        }
        const node = target instanceof cc.Node ? target : target.node;
        return this.getKeeper(node.parent, createIfMissing);
    }
}
