export class LoadProgress {
    completedCount: number;
    totalCount: number;
    item: any;
    cb: (completed: number, total: number, item: any) => void;
}

export default class CocosHelper {
    static loadProgress: LoadProgress = new LoadProgress();
    static _loadingMap: Record<string, ((asset: any) => void)[]> = {};

    static addRef(asset: cc.Asset | cc.Asset[]): void {
        if (asset instanceof Array) {
            for (let i = 0; i < asset.length; i++) {
                asset[i].addRef();
            }
        } else {
            asset.addRef();
        }
    }

    static async runTweenSync(target: cc.Node, ...tweens: any[]): Promise<void> {
        return new Promise((resolve) => {
            let tween = cc.tween(target);
            for (let i = 0; i < tweens.length; i++) {
                tween = tween.then(tweens[i]);
            }
            tween
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    static async runActionSync(node: cc.Node, ...actions: cc.FiniteTimeAction[]): Promise<boolean | void> {
        if (!actions || actions.length <= 0) {
            return;
        }
        return new Promise((resolve) => {
            actions.push(
                cc.callFunc(() => {
                    resolve(true);
                })
            );
            node.runAction(cc.sequence(actions));
        });
    }

    static async runRepeatTweenSync(target: cc.Node, repeat: number, ...tweens: any[]): Promise<boolean> {
        return new Promise((resolve) => {
            let tween = cc.tween(target);
            for (let i = 0; i < tweens.length; i++) {
                tween = tween.then(tweens[i]);
            }
            if (repeat < 0) {
                cc.tween(target).repeatForever(tween).start();
            } else {
                cc.tween(target)
                    .repeat(repeat, tween)
                    .call(() => {
                        resolve(true);
                    })
                    .start();
            }
        });
    }

    static stopTween(target: cc.Node): void {
        cc.Tween.stopAllByTarget(target);
    }

    static releaseAsset(asset: cc.Asset | cc.Asset[]): void {
        CocosHelper.decRes(asset);
    }

    static _onProgress(completedCount: number, totalCount: number, item: any): void {
        CocosHelper.loadProgress.completedCount = completedCount;
        CocosHelper.loadProgress.totalCount = totalCount;
        CocosHelper.loadProgress.item = item;
        CocosHelper.loadProgress.cb && CocosHelper.loadProgress.cb(completedCount, totalCount, item);
    }

    static loadResThrowErrorSync(): null {
        return null;
    }

    static loadAssetFromBundleSync(bundleUrl: string, assetUrl: string): Promise<any> {
        const bundle = cc.assetManager.getBundle(bundleUrl);
        if (!bundle) {
            cc.error("加载bundle中的资源失败, 未找到bundle, bundleUrl:" + bundleUrl);
            return null;
        }
        return new Promise((resolve) => {
            bundle.load(assetUrl, (err, asset) => {
                if (err) {
                    cc.error("加载bundle中的资源失败, 未找到asset, url:" + assetUrl + ", err:" + err);
                    resolve(null);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    static decRes(asset: cc.Asset | cc.Asset[]): void {
        if (asset instanceof Array) {
            for (let i = 0; i < asset.length; i++) {
                asset[i].decRef();
            }
        } else {
            asset.decRef();
        }
    }

    static loadBundleSync(bundleUrl: string, options?: Record<string, any>): Promise<cc.AssetManager.Bundle> {
        return new Promise((resolve) => {
            cc.assetManager.loadBundle(bundleUrl, options, (err, bundle) => {
                if (err) {
                    resolve(bundle);
                } else {
                    cc.error("加载bundle失败, url: " + bundleUrl + ", err:" + err);
                    resolve(null);
                }
            });
        });
    }

    static async runAnimSync(node: cc.Node, clip?: number | string): Promise<void> {
        const animation = node.getComponent(cc.Animation);
        if (!animation) {
            return;
        }
        let clipAsset: cc.AnimationClip = null;
        if (clip != null) {
            const clips = animation.getClips();
            if (typeof clip === "number") {
                clipAsset = clips[clip];
            } else if (typeof clip === "string") {
                for (let i = 0; i < clips.length; i++) {
                    if (clips[i].name === clip) {
                        clipAsset = clips[i];
                        break;
                    }
                }
            }
        } else {
            clipAsset = animation.defaultClip;
        }
        if (clipAsset) {
            await CocosHelper.sleepSync(clipAsset.duration);
        }
    }

    static loadAssetSync(url: string): Promise<cc.Asset> {
        return new Promise((resolve) => {
            cc.resources.load(url, (err, asset) => {
                if (err) {
                    CocosHelper.addRef(asset);
                    resolve(asset);
                } else {
                    cc.error("加载asset失败, url:" + url + ", err: " + err);
                    resolve(null);
                }
            });
        });
    }

    static loadRes(url: string, type: typeof cc.Asset, callback: (asset: any) => void): void {
        if (CocosHelper._loadingMap[url]) {
            CocosHelper._loadingMap[url].push(callback);
        } else {
            CocosHelper._loadingMap[url] = [callback];
            CocosHelper.loadResSync(url, type).then((asset) => {
                const callbacks = CocosHelper._loadingMap[url];
                for (let i = 0; i < callbacks.length; i++) {
                    callbacks[i](asset);
                }
                CocosHelper._loadingMap[url] = null;
                delete CocosHelper._loadingMap[url];
            });
        }
    }

    static sleepSync(seconds: number): Promise<boolean> {
        return new Promise((resolve) => {
            cc.Canvas.instance.scheduleOnce(() => {
                resolve(true);
            }, seconds);
        });
    }

    static findChildInNode(name: string, node: cc.Node): cc.Node {
        if (node.name == name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const child = CocosHelper.findChildInNode(name, node.children[i]);
            if (child) {
                return child;
            }
        }
        return null;
    }

    static async callInNextTick(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 0);
        });
    }

    static loadResSync(url: string, type?: typeof cc.Asset, onProgress?: (completed: number, total: number, item: any) => void): Promise<any> {
        return new Promise((resolve) => {
            if (!onProgress) {
                onProgress = CocosHelper._onProgress;
            }
            cc.resources.load(url, type, onProgress, (err, asset) => {
                if (err) {
                    cc.error(url + " [资源加载] 错误 " + err);
                    resolve(null);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    static stopTweenByTag(tag: number): void {
        cc.Tween.stopAllByTag(tag);
    }

    static getComponentName(component: cc.Component): string {
        const match = component.name.match(/<.*>$/);
        return match && match.length > 0 ? match[0].slice(1, -1) : component.name;
    }

    static captureScreen(camera: cc.Camera, rect?: cc.Node | cc.Rect): Uint8Array {
        const texture = new cc.RenderTexture();
        const oldTarget = camera.targetTexture;
        let captureRect = cc.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
        if (rect) {
            captureRect = rect instanceof cc.Node ? rect.getBoundingBoxToWorld() : rect;
        }
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.game._renderContext.STENCIL_INDEX8);
        camera.targetTexture = texture;
        camera.render();
        camera.targetTexture = oldTarget;
        const buffer = new ArrayBuffer(captureRect.width * captureRect.height * 4);
        const pixels = new Uint8Array(buffer);
        texture.readPixels(pixels, captureRect.x, captureRect.y, captureRect.width, captureRect.height);
        return pixels;
    }
}
