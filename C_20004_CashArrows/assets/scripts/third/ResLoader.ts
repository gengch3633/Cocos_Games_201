import Singleton from "./Singleton";

const { ccclass } = cc._decorator;

@ccclass
export default class ResLoader extends Singleton {
    public remoteUrl: string = "";

    public async getBundle(bundleName?: string): Promise<cc.AssetManager.Bundle> {
        const bundle = bundleName ? cc.assetManager.getBundle(bundleName) : cc.assetManager.resources;
        if (bundle) {
            return bundle;
        }
        const remoteUrl = cc.sys.isBrowser || cc.sys.isNative ? "" : this.remoteUrl;
        return new Promise<cc.AssetManager.Bundle>((resolve) => {
            cc.assetManager.loadBundle(remoteUrl + bundleName, {
                onProgress: () => {},
                onFileProgress: () => {}
            }, async (err: Error, loadedBundle: cc.AssetManager.Bundle) => {
                if (err) {
                    console.log(err);
                }
                if (loadedBundle && loadedBundle.deps && loadedBundle.deps.length > 0) {
                    await Promise.all(loadedBundle.deps.map((dep) => this.getBundle(dep)));
                }
                resolve(loadedBundle);
            });
        });
    }

    public async loadRes<T extends cc.Asset>(
        url: string,
        type: { new (...args: any[]): T },
        bundleName?: string,
        onComplete?: (err: Error, asset: T) => void
    ): Promise<T> {
        const bundle = await (bundleName ? this.getBundle(bundleName) : Promise.resolve(cc.resources));
        if (!bundle) {
            return null;
        }
        const cached = bundle.get(url, type);
        if (cached) {
            return cached;
        }
        return new Promise<T>((resolve) => {
            bundle.load(url, type, (err: Error, asset: T) => {
                if (err) {
                    console.error(err);
                }
                onComplete && onComplete(err, asset);
                resolve(asset);
            });
        });
    }

    public async setSpriteFrame(target: cc.Node | cc.Sprite, url: string, bundleName?: string): Promise<void> {
        const spriteFrame = await this.loadRes(url, cc.SpriteFrame, bundleName);
        let sprite: cc.Sprite = null;
        if (target instanceof cc.Sprite) {
            sprite = target;
        } else if (target && target.isValid) {
            sprite = target.getComponent(cc.Sprite);
        }
        if (sprite && sprite.isValid) {
            sprite.spriteFrame = spriteFrame;
        }
    }

    public async setSkeleton(target: cc.Node | sp.Skeleton, url: string, bundleName?: string, animationName?: string): Promise<void> {
        const skeletonData = await this.loadRes(url, sp.SkeletonData, bundleName);
        let skeleton: sp.Skeleton = null;
        if (target instanceof sp.Skeleton) {
            skeleton = target;
        } else if (target) {
            skeleton = target.getComponent(sp.Skeleton);
        }
        if (skeleton && skeleton.isValid) {
            skeleton.skeletonData = skeletonData;
            skeleton.animation = animationName;
        }
    }

    public instantiate(prefab: cc.Prefab, parent?: cc.Node): cc.Node {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        if (parent) {
            node.parent = parent;
        }
        return node;
    }

    public async instantiateByUrl(
        url: string,
        parent?: cc.Node,
        bundleName?: string,
        onComplete?: (err: Error, prefab: cc.Prefab) => void
    ): Promise<cc.Node> {
        const prefab = await this.loadRes(url, cc.Prefab, bundleName, onComplete);
        return prefab ? this.instantiate(prefab, parent) : null;
    }
}