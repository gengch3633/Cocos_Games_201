import ResLoader from "./ResLoader";

const { ccclass } = cc._decorator;

@ccclass
export default class ResKeeper extends cc.Component {
    caches = new Set<cc.Asset>();

    onLoad(): void {
        this.bindSelfAsset();
    }

    get selfAsset(): cc.Asset | undefined {
        return (this.node as any)._prefab?.asset;
    }

    bindSelfAsset(): void {
        this.addAsset(this.selfAsset);
    }

    removeSelfAsset(): void {
        this.caches.delete(this.selfAsset!);
    }

    addAsset(asset: cc.Asset | null | undefined): cc.Asset | null | undefined {
        if (!asset || !this.isValid || this.caches.has(asset)) {
            return asset;
        }
        asset.addRef();
        this.caches.add(asset);
        return asset;
    }

    getBundle(bundleName?: string): Promise<cc.AssetManager.Bundle | null> {
        return ResLoader.getInstance().getBundle(bundleName);
    }

    async loadRes(
        path: string,
        type: typeof cc.Asset,
        bundleName?: string,
        onProgress?: (finished: number, total: number) => void
    ): Promise<any> {
        const asset = await ResLoader.getInstance().loadRes(path, type, bundleName, onProgress);
        if (asset) {
            this.addAsset(asset);
        }
        return asset;
    }

    async setSpriteFrame(target: cc.Sprite | cc.Node, path: string, bundleName?: string): Promise<void> {
        const spriteFrame = await this.loadRes(path, cc.SpriteFrame, bundleName);
        let sprite: cc.Sprite | null = null;
        if (target instanceof cc.Sprite) {
            sprite = target;
        } else if (target?.isValid) {
            sprite = target.getComponent(cc.Sprite);
        }
        if (sprite?.isValid) {
            sprite.spriteFrame = spriteFrame;
        }
    }

    async setSkeleton(
        target: sp.Skeleton | cc.Node,
        path: string,
        bundleName?: string,
        animation?: string
    ): Promise<void> {
        const skeletonData = await this.loadRes(path, sp.SkeletonData, bundleName);
        let skeleton: sp.Skeleton | null = null;
        if (target instanceof sp.Skeleton) {
            skeleton = target;
        } else if (target?.isValid) {
            skeleton = target.getComponent(sp.Skeleton);
        }
        if (skeleton?.isValid) {
            skeleton.skeletonData = skeletonData;
            if (animation) {
                skeleton.animation = animation;
            }
        }
    }

    removeAsset(asset: cc.Asset | null | undefined): cc.Asset | null | undefined {
        if (asset && this.caches.delete(asset)) {
            asset.decRef();
        }
        return asset;
    }

    releaseAll(skipSelf = true): void {
        void skipSelf;
        this.caches.forEach((asset) => {
            this.removeAsset(asset);
        });
    }

    clearAll(): void {
        this.caches.clear();
    }

    instantiate(prefab: cc.Prefab | cc.Node, parent?: cc.Node): cc.Node | null {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        if (prefab instanceof cc.Prefab) {
            this.addAsset(prefab);
        }
        if (parent) {
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
        const prefab = await this.loadRes(path, cc.Prefab, bundleName, onProgress);
        return prefab ? this.instantiate(prefab, parent) : null;
    }

    onDestroy(): void {
        this.releaseAll();
    }
}
