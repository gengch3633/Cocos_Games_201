export class UiManager {
    static loadSpine(target, dir, name, callback?) {
        cc.resources.load(dir + "/" + name, sp.SkeletonData, function (err, skeletonData) {
            if (err) {
                cc.error(err);
            } else {
                const skeleton = target == null ? undefined : target.getComponent(sp.Skeleton);
                if (skeleton) {
                    skeleton.skeletonData = skeletonData;
                }
                if (callback != null) {
                    callback(skeletonData);
                }
            }
        });
    }

    static loaderPrefab(name) {
        return new Promise(function (resolve, reject) {
            cc.resources.load("prefabs/" + name, cc.Prefab, function (err, prefab) {
                if (err) {
                    console.error("loaderPrefab==", err);
                    reject("未找到资源");
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    static loadSpriteFrameInDeepPath(target, path) {
        return new Promise(function (resolve, reject) {
            cc.resources.load(path, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.error("loadSpriteFrameInDeepPath==", err);
                    reject("未找到资源");
                } else {
                    if (target && target.getComponent(cc.Sprite)) {
                        target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                    resolve(spriteFrame);
                }
            });
        });
    }

    static maksPos(labelNode, target) {
        if (labelNode) {
            if (labelNode.getComponent(cc.Label) && labelNode.getComponent(cc.Label)._forceUpdateRenderData) {
                labelNode.getComponent(cc.Label)._forceUpdateRenderData();
            }
            const width = labelNode.getContentSize().width;
            target.x = width / 2 - 3;
        }
    }

    static loaderView(parent, name, data, zIndex?, callback?) {
        if (undefined === zIndex) {
            zIndex = 0;
        }
        cc.resources.load("prefabs/" + name, cc.Prefab, function (err, prefab) {
            if (err) {
                cc.error(err);
            } else {
                const node = cc.instantiate(prefab);
                parent.addChild(node, zIndex);
                node.addComponent(name + "Ctrl");
                if (data) {
                    node.getComponent(name + "Ctrl").initData(data);
                }
                if (callback) {
                    callback(node);
                }
            }
        });
    }

    static loaderHead(url, target, size?) {
        if (undefined === size) {
            size = 100;
        }
        cc.assetManager.loadRemote(url, function (err, texture) {
            if (err) {
                console.log("头像加载失败", err);
            } else {
                target.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                target.scale = size / target.getContentSize().width;
            }
        });
    }

    static loadSpriteFrame(target, dir, name, callback?) {
        cc.resources.load("img/" + dir + "/" + name, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                cc.error(err);
                if (callback) {
                    callback(false);
                }
            } else {
                if (target && target.getComponent(cc.Sprite)) {
                    target.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                if (callback) {
                    callback(true);
                }
            }
        });
    }

    static addButtonListen(node, callback, target, data?, interval?, eventName?, transition?) {
        if (undefined === data) {
            data = null;
        }
        if (undefined === interval) {
            interval = 300;
        }
        if (undefined === eventName) {
            eventName = "click";
        }
        if (undefined === transition) {
            transition = cc.Button.Transition.SCALE;
        }
        if (node) {
            let button = node.getComponent(cc.Button);
            if (!button) {
                button = node.addComponent(cc.Button);
                button.transition = transition;
            }
            node.on("click", function () {
                if (callback) {
                    callback.bind(target)(data);
                    if (interval) {
                        button.interactable = false;
                        setTimeout(function () {
                            if (cc.isValid(button)) {
                                button.interactable = true;
                            }
                        }, interval);
                    }
                }
            }, target);
        }
    }

    static loaderViewAsync(parent, name, path, data, zIndex?, callback?) {
        if (undefined === zIndex) {
            zIndex = 0;
        }
        cc.resources.load("prefabs/" + path + "/" + name, cc.Prefab, function (err, prefab) {
            if (err) {
                cc.error(err);
            } else {
                const node = cc.instantiate(prefab);
                parent.addChild(node, zIndex);
                node.addComponent(name + "Ctrl");
                if (data) {
                    node.getComponent(name + "Ctrl").initData(data);
                }
                if (callback) {
                    callback(node);
                }
            }
        });
    }

    static loaderViewDeepPath(parent, name, path, data, zIndex?) {
        if (undefined === zIndex) {
            zIndex = 0;
        }
        return new Promise(function (resolve, reject) {
            cc.resources.load("prefabs/" + path + "/" + name, cc.Prefab, function (err, prefab) {
                if (err) {
                    console.error("loaderViewDeepPath==", err);
                    reject("未找到资源");
                } else {
                    const node = cc.instantiate(prefab);
                    parent.addChild(node, zIndex);
                    node.addComponent(name + "Ctrl");
                    if (data) {
                        node.getComponent(name + "Ctrl").initData(data);
                    }
                    resolve(prefab);
                }
            });
        });
    }

    static loaderPrefabInDeepPath(path) {
        return new Promise(function (resolve, reject) {
            cc.resources.load("" + path, cc.Prefab, function (err, prefab) {
                if (err) {
                    console.error("loaderPrefabInDeepPath==", err, path);
                    reject("未找到资源");
                } else {
                    resolve(prefab);
                }
            });
        });
    }
}
