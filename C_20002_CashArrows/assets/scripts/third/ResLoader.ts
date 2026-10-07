import Singleton from "./Singleton";

export default class ResLoader extends Singleton {
    remoteUrl: string = "";

    getBundle(bundleName?: string): Promise<cc.AssetManager.Bundle> {
        return new Promise((resolve) => {
            const bundle = bundleName ? cc.assetManager.getBundle(bundleName) : cc.assetManager.resources;
            if (bundle) {
                resolve(bundle);
            } else {
                const remotePrefix = (cc.sys.isBrowser || cc.sys.isNative) ? "" : this.remoteUrl;
                cc.assetManager.loadBundle(remotePrefix + bundleName, {
                    onProgress: () => {},
                    onFileProgress: () => {}
                }, (err, loadedBundle) => {
                    if (err) {
                        console.log(err);
                    }
                    if (loadedBundle?.deps?.length > 0) {
                        let remaining = loadedBundle.deps.length;
                        loadedBundle.deps.forEach((dep) => {
                            this.getBundle(dep).then(() => {
                                remaining--;
                                if (remaining === 0) {
                                    resolve(loadedBundle);
                                }
                            });
                        });
                    } else {
                        resolve(loadedBundle);
                    }
                });
            }
        });
    }

    async loadRes<T extends cc.Asset>(
        path: string,
        type: typeof cc.Asset,
        bundleName?: string,
        onProgress?: (finished: number, total: number, item: cc.AssetManager.RequestItem) => void
    ): Promise<T> {
        const bundle = bundleName ? await this.getBundle(bundleName) : cc.resources;
        if (!bundle) {
            return null;
        }
        const cached = bundle.get(path, type);
        if (cached) {
            return cached as T;
        }
        return new Promise((resolve) => {
            bundle.load(path, type, (finished, total, item) => {
                onProgress && onProgress(finished, total, item);
            }, (err, asset) => {
                if (err) {
                    console.error(err);
                }
                resolve(asset as T);
            });
        });
    }

    async setSpriteFrame(target: cc.Sprite | cc.Node, path: string, bundleName?: string): Promise<void> {
        const spriteFrame = await this.loadRes(path, cc.SpriteFrame, bundleName);
        let sprite: cc.Sprite = null;
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
        let skeleton: sp.Skeleton = null;
        if (target instanceof sp.Skeleton) {
            skeleton = target;
        } else {
            skeleton = target?.getComponent(sp.Skeleton);
        }
        if (skeleton?.isValid) {
            skeleton.skeletonData = skeletonData;
            skeleton.animation = animation;
        }
    }

    instantiate(prefab: cc.Prefab | cc.Node, parent?: cc.Node): cc.Node {
        const node = cc.instantiate(prefab);
        if (node) {
            if (parent) {
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
        const prefab = await this.loadRes(path, cc.Prefab, bundleName, onProgress);
        return prefab ? this.instantiate(prefab, parent) : null;
    }
}
