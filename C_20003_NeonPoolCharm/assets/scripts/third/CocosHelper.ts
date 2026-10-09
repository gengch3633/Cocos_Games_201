export class LoadProgress {
    completedCount;
    totalCount;
    item;
    cb;
}

export default class CocosHelper {
    public static loadProgress = new LoadProgress();
    public static _loadingMap = {};

    public static addRef(asset) {
        if (asset instanceof Array) {
            for (let i = 0, list = asset; i < list.length; i++) {
                list[i].addRef();
            }
        } else {
            asset.addRef();
        }
    }

    public static async runTweenSync(target, ...actions): Promise<void> {
        return new Promise(function (resolve) {
            let tween = cc.tween(target);
            for (let i = 0, list = actions; i < list.length; i++) {
                const action = list[i];
                tween = tween.then(action);
            }
            tween.call(function () {
                resolve();
            }).start();
        });
    }

    public static async runActionSync(node, ...actions): Promise<boolean> {
        if (!actions || actions.length <= 0) {
            return undefined;
        }
        return new Promise(function (resolve) {
            actions.push(cc.callFunc(function () {
                resolve(true);
            }));
            node.runAction(cc.sequence(actions));
        });
    }

    public static async runRepeatTweenSync(target, times, ...actions): Promise<boolean> {
        return new Promise(function (resolve) {
            let tween = cc.tween(target);
            for (let i = 0, list = actions; i < list.length; i++) {
                const action = list[i];
                tween = tween.then(action);
            }
            if (times < 0) {
                cc.tween(target).repeatForever(tween).start();
            } else {
                cc.tween(target).repeat(times, tween).call(function () {
                    resolve(true);
                }).start();
            }
        });
    }

    public static stopTween(target) {
        cc.Tween.stopAllByTarget(target);
    }

    public static releaseAsset(asset) {
        this.decRes(asset);
    }

    public static _onProgress(completedCount, totalCount, item) {
        CocosHelper.loadProgress.completedCount = completedCount;
        CocosHelper.loadProgress.totalCount = totalCount;
        CocosHelper.loadProgress.item = item;
        if (CocosHelper.loadProgress.cb) {
            CocosHelper.loadProgress.cb(completedCount, totalCount, item);
        }
    }

    public static loadResThrowErrorSync() {
        return null;
    }

    public static loadAssetFromBundleSync(bundleUrl, url) {
        const bundle = cc.assetManager.getBundle(bundleUrl);
        if (!bundle) {
            cc.error("加载bundle中的资源失败, 未找到bundle, bundleUrl:" + bundleUrl);
            return null;
        }
        return new Promise(function (resolve) {
            bundle.load(url, function (err, asset) {
                if (err) {
                    cc.error("加载bundle中的资源失败, 未找到asset, url:" + url + ", err:" + err);
                    resolve(null);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    public static decRes(asset) {
        if (asset instanceof Array) {
            for (let i = 0, list = asset; i < list.length; i++) {
                list[i].decRef();
            }
        } else {
            asset.decRef();
        }
    }

    public static loadBundleSync(bundleUrl, options) {
        return new Promise(function (resolve) {
            cc.assetManager.loadBundle(bundleUrl, options, function (err, bundle) {
                if (err) {
                    resolve(bundle);
                } else {
                    cc.error("加载bundle失败, url: " + bundleUrl + ", err:" + err);
                    resolve(null);
                }
            });
        });
    }

    public static async runAnimSync(node, clip): Promise<void> {
        const animation = node.getComponent(cc.Animation);
        if (!animation) {
            return;
        }
        let clipAsset = null;
        if (clip) {
            const clips = animation.getClips();
            if ("number" == typeof clip) {
                clipAsset = clips[clip];
            } else if ("string" == typeof clip) {
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

    public static loadAssetSync(url) {
        const self = this;
        return new Promise(function (resolve) {
            cc.resources.load(url, function (err, asset) {
                if (err) {
                    self.addRef(asset);
                    resolve(asset);
                } else {
                    cc.error("加载asset失败, url:" + url + ", err: " + err);
                    resolve(null);
                }
            });
        });
    }

    public static loadRes(url, type, callback) {
        const self = this;
        if (this._loadingMap[url]) {
            this._loadingMap[url].push(callback);
        } else {
            this._loadingMap[url] = [callback];
            this.loadResSync(url, type).then(function (asset) {
                const callbacks = self._loadingMap[url];
                for (let i = 0; i < callbacks.length; i++) {
                    (0, callbacks[i])(asset);
                }
                self._loadingMap[url] = null;
                delete self._loadingMap[url];
            });
        }
    }

    public static sleepSync(delay) {
        return new Promise(function (resolve) {
            cc.Canvas.instance.scheduleOnce(function () {
                resolve(true);
            }, delay);
        });
    }

    public static findChildInNode(name, node) {
        if (node.name == name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findChildInNode(name, node.children[i]);
            if (found) {
                return found;
            }
        }
        return null;
    }

    public static async callInNextTick(): Promise<boolean> {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(true);
            }, 0);
        });
    }

    public static loadResSync(url, type, onProgress) {
        const self = this;
        return new Promise(function (resolve) {
            if (!onProgress) {
                onProgress = self._onProgress;
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

    public static stopTweenByTag(tag) {
        cc.Tween.stopAllByTag(tag);
    }

    public static getComponentName(component) {
        const matched = component.name.match(/<.*>$/);
        return matched && matched.length > 0 ? matched[0].slice(1, -1) : component.name;
    }

    public static captureScreen(camera, rectOrNode) {
        const texture = new cc.RenderTexture();
        const targetTexture = camera.targetTexture;
        let rect = cc.rect(0, 0, cc.visibleRect.width, cc.visibleRect.height);
        if (rectOrNode) {
            rect = rectOrNode instanceof cc.Node ? rectOrNode.getBoundingBoxToWorld() : rectOrNode;
        }
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.game._renderContext.STENCIL_INDEX8);
        camera.targetTexture = texture;
        camera.render();
        camera.targetTexture = targetTexture;
        const buffer = new ArrayBuffer(rect.width * rect.height * 4);
        const pixels = new Uint8Array(buffer);
        texture.readPixels(pixels, rect.x, rect.y, rect.width, rect.height);
        return pixels;
    }
}
