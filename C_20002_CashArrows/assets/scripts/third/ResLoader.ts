import Singleton from "./Singleton";

export default class ResLoader extends Singleton {
    remoteUrl = "";

    getBundle(bundleName?: string): Promise<cc.AssetManager.Bundle | null> {
        return new Promise((resolve) => {
            const bundle = bundleName ? cc.assetManager.getBundle(bundleName) : cc.assetManager.resources;
            if (bundle) {
                resolve(bundle);
                return;
            }
            const prefix = cc.sys.isBrowser || cc.sys.isNative ? "" : this.remoteUrl;
            cc.assetManager.loadBundle(
                prefix + bundleName,
                {
                    onProgress: () => {},
                    onFileProgress: () => {},
                },
                (err, loadedBundle) => {
                    if (err) {
                        console.log(err);
                    }
                    if (loadedBundle?.deps?.length > 0) {
                        let remaining = loadedBundle.deps.length;
                        loadedBundle.deps.forEach(async (dep) => {
                            await this.getBundle(dep);
                            if (--remaining === 0) {
                                resolve(loadedBundle);
                            }
                        });
                    } else {
                        resolve(loadedBundle);
                    }
                }
            );
        });
    }

    loadRes(
        path: string,
        type: typeof cc.Asset,
        bundleName?: string,
        onProgress?: (finished: number, total: number) => void
    ): Promise<any> {
        return new Promise((resolve) => {
            (bundleName ? this.getBundle(bundleName) : Promise.resolve(cc.resources)).then((bundle) => {
                if (!bundle) {
                    resolve(null);
                    return;
                }
                const asset = bundle.get(path, type);
                if (asset) {
                    resolve(asset);
                    return;
                }
                bundle.load(
                    path,
                    type,
                    (finished, total) => {
                        onProgress && onProgress(finished, total);
                    },
                    (err, res) => {
                        if (err) {
                            console.error(err);
                        }
                        resolve(res);
                    }
                );
            });
        });
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
        } else {
            skeleton = target?.getComponent(sp.Skeleton) ?? null;
        }
        if (skeleton?.isValid) {
            skeleton.skeletonData = skeletonData;
            skeleton.animation = animation;
        }
    }

    instantiate(prefab: cc.Prefab | cc.Node, parent?: cc.Node): cc.Node | null {
        const node = cc.instantiate(prefab);
        if (!node) {
            return null;
        }
        if (parent) {
            node.parent = parent;
        }
        return node;
    }

    async instantiateByUrl(path: string, parent?: cc.Node, bundleName?: string, onProgress?: (finished: number, total: number) => void): Promise<cc.Node | null> {
        const prefab = await this.loadRes(path, cc.Prefab, bundleName, onProgress);
        return prefab ? this.instantiate(prefab, parent) : null;
    }
}
