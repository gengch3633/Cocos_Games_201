import ResLoader from "./ResLoader";

const { ccclass } = cc._decorator;

@ccclass
export default class ResKeeper extends cc.Component {
    private caches: Set<cc.Asset> = new Set();

    protected onLoad(): void {
        this.bindSelfAsset();
    }

    public get selfAsset(): cc.Asset | null {
        const prefab = (this.node as any)._prefab;
        return prefab ? prefab.asset : null;
    }

    public bindSelfAsset(): void {
        this.addAsset(this.selfAsset);
    }

    public removeSelfAsset(): void {
        this.caches.delete(this.selfAsset);
    }

    public addAsset(asset: cc.Asset | null): void {
        if (!asset || !this.isValid || this.caches.has(asset)) {
            return;
        }
        asset.addRef();
        this.caches.add(asset);
    }

    public getBundle(name: string): cc.AssetManager.Bundle | null {
        return ResLoader.getInstance().getBundle(name);
    }

    public async loadRes(
        url: string,
        type: typeof cc.Asset,
        progressCallback?: (finished: number, total: number, item: any) => void,
        options?: any
    ): Promise<cc.Asset> {
        const asset = await ResLoader.getInstance().loadRes(url, type, progressCallback, options);
        if (asset) {
            this.addAsset(asset);
        }
        return asset;
    }

    public async setSpriteFrame(
        target: cc.Sprite | cc.Node,
        url: string,
        progressCallback?: (finished: number, total: number, item: any) => void
    ): Promise<void> {
        const spriteFrame = await this.loadRes(url, cc.SpriteFrame, progressCallback);
        let sprite: cc.Sprite | null = null;
        if (target instanceof cc.Sprite) {
            sprite = target;
        } else if (target.isValid) {
            sprite = target.getComponent(cc.Sprite);
        }
        if (sprite && sprite.isValid) {
            sprite.spriteFrame = spriteFrame as cc.SpriteFrame;
        }
    }

    public async setSkeleton(
        target: sp.Skeleton | cc.Node,
        url: string,
        progressCallback?: (finished: number, total: number, item: any) => void,
        animationName?: string
    ): Promise<void> {
        const skeletonData = await this.loadRes(url, sp.SkeletonData, progressCallback);
        let skeleton: sp.Skeleton | null = null;
        if (target instanceof sp.Skeleton) {
            skeleton = target;
        } else if (target.isValid) {
            skeleton = target.getComponent(sp.Skeleton);
        }
        if (skeleton && skeleton.isValid) {
            skeleton.skeletonData = skeletonData as sp.SkeletonData;
            if (animationName) {
                skeleton.animation = animationName;
            }
        }
    }

    public removeAsset(asset: cc.Asset | null): cc.Asset | null {
        if (asset && this.caches.delete(asset)) {
            asset.decRef();
            return asset;
        }
        return asset;
    }

    public releaseAll(removeSelf: boolean = true): void {
        this.caches.forEach((asset) => {
            this.removeAsset(asset);
        });
    }

    public clearAll(): void {
        this.caches.clear();
    }

    public instantiate(prefab: cc.Prefab, parent?: cc.Node): cc.Node | null {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        this.addAsset(prefab);
        if (parent) {
            node.parent = parent;
        }
        return node;
    }

    public async instantiateByUrl(
        url: string,
        parent?: cc.Node,
        progressCallback?: (finished: number, total: number, item: any) => void,
        options?: any
    ): Promise<cc.Node | null> {
        const prefab = await this.loadRes(url, cc.Prefab, progressCallback, options);
        if (prefab) {
            return this.instantiate(prefab as cc.Prefab, parent);
        }
        return null;
    }

    protected onDestroy(): void {
        this.releaseAll();
    }
}