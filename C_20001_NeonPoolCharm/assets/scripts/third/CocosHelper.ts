export class LoadProgress {
    completedCount: number;
    totalCount: number;
    item: any;
    cb: (...args: any[]) => void;
}

export default class CocosHelper {
    static loadProgress = new LoadProgress();
    static _loadingMap: Record<string, any[]> = {};

    static addRef(asset: any | any[]): void {
        if (asset instanceof Array) {
            for (let i = 0; i < asset.length; i++) {
                asset[i].addRef();
            }
        } else {
            asset.addRef();
        }
    }

    static async runTweenSync(target: any, ...tweens: any[]): Promise<void> {
        return new Promise(function (resolve) {
            let tween = cc.tween(target);
            for (let i = 0; i < tweens.length; i++) {
                tween = tween.then(tweens[i]);
            }
            tween
                .call(function () {
                    resolve();
                })
                .start();
        });
    }

    static async runActionSync(node: cc.Node, ...actions: any[]): Promise<boolean> {
        if (!actions || actions.length <= 0) {
            return;
        }
        return new Promise(function (resolve) {
            actions.push(
                cc.callFunc(function () {
                    resolve(true);
                })
            );
            node.runAction(cc.sequence(actions));
        });
    }

    static async runRepeatTweenSync(target: any, repeat: number, ...tweens: any[]): Promise<boolean> {
        return new Promise(function (resolve) {
            let tween = cc.tween(target);
            for (let i = 0; i < tweens.length; i++) {
                tween = tween.then(tweens[i]);
            }
            if (repeat < 0) {
                cc.tween(target).repeatForever(tween).start();
            } else {
                cc.tween(target)
                    .repeat(repeat, tween)
                    .call(function () {
                        resolve(true);
                    })
                    .start();
            }
        });
    }

    static stopTween(target: any): void {
        cc.Tween.stopAllByTarget(target);
    }

    static releaseAsset(asset: any): void {
        this.decRes(asset);
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
        return new Promise(function (resolve) {
            bundle.load(assetUrl, function (err: any, asset: any) {
                if (err) {
                    cc.error("加载bundle中的资源失败, 未找到asset, url:" + assetUrl + ", err:" + err);
                    resolve(null);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    static decRes(asset: any | any[]): void {
        if (asset instanceof Array) {
            for (let i = 0; i < asset.length; i++) {
                asset[i].decRef();
            }
        } else {
            asset.decRef();
        }
    }

    static loadBundleSync(url: string, options?: any): Promise<any> {
        return new Promise(function (resolve) {
            cc.assetManager.loadBundle(url, options, function (err, bundle) {
                if (err) {
                    resolve(bundle);
                } else {
                    cc.error("加载bundle失败, url: " + url + ", err:" + err);
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
        let clipAsset = null;
        if (clip) {
            const clips = animation.getClips();
            if (typeof clip == "number") {
                clipAsset = clips[clip];
            } else if (typeof clip == "string") {
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
        if (!clipAsset) {
            return;
        }
        await CocosHelper.sleepSync(clipAsset.duration);
    }

    static loadAssetSync(url: string): Promise<any> {
        return new Promise(function (resolve) {
            cc.resources.load(url, function (err: any, asset: any) {
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
        if (this._loadingMap[url]) {
            this._loadingMap[url].push(callback);
        } else {
            this._loadingMap[url] = [callback];
            this.loadResSync(url, type).then(function (asset) {
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
        return new Promise(function (resolve) {
            cc.Canvas.instance.scheduleOnce(function () {
                resolve(true);
            }, seconds);
        });
    }

    static findChildInNode(name: string, node: cc.Node): cc.Node {
        if (node.name == name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const child = this.findChildInNode(name, node.children[i]);
            if (child) {
                return child;
            }
        }
        return null;
    }

    static async callInNextTick(): Promise<boolean> {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, 0);
        });
    }

    static loadResSync(url: string, type: typeof cc.Asset, onProgress?: (...args: any[]) => void): Promise<any> {
        return new Promise(function (resolve) {
            if (!onProgress) {
                onProgress = CocosHelper._onProgress;
            }
            cc.resources.load(url, type, onProgress, function (err, asset) {
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
        const renderTexture = new cc.RenderTexture();
        const originalTarget = camera.targetTexture;
        let captureRect = cc.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
        if (rect) {
            captureRect = rect instanceof cc.Node ? rect.getBoundingBoxToWorld() : rect;
        }
        renderTexture.initWithSize(
            cc.visibleRect.width,
            cc.visibleRect.height,
            (cc.game as any)._renderContext.STENCIL_INDEX8
        );
        camera.targetTexture = renderTexture;
        camera.render();
        camera.targetTexture = originalTarget;
        const buffer = new ArrayBuffer(captureRect.width * captureRect.height * 4);
        const pixels = new Uint8Array(buffer);
        renderTexture.readPixels(pixels, captureRect.x, captureRect.y, captureRect.width, captureRect.height);
        return pixels;
    }
}
