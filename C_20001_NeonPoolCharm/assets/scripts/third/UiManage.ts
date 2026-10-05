export class UiManager {
    static loadSpine(
        node: cc.Node,
        folder: string,
        name: string,
        callback?: (data: sp.SkeletonData) => void
    ): void {
        cc.resources.load(`${folder}/${name}`, sp.SkeletonData, (err, skeletonData: sp.SkeletonData) => {
            if (err) {
                cc.error(err);
            } else {
                const skeleton = node?.getComponent(sp.Skeleton);
                if (skeleton) {
                    skeleton.skeletonData = skeletonData;
                }
                callback?.(skeletonData);
            }
        });
    }

    static loaderPrefab(name: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(`prefabs/${name}`, cc.Prefab, (err, prefab: cc.Prefab) => {
                if (err) {
                    console.error("loaderPrefab==", err);
                    reject("未找到资源");
                } else {
                    resolve(prefab);
                }
            });
        });
    }

    static loadSpriteFrameInDeepPath(node: cc.Node, path: string): Promise<cc.SpriteFrame> {
        return new Promise((resolve, reject) => {
            cc.resources.load(path, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                if (err) {
                    console.error("loadSpriteFrameInDeepPath==", err);
                    reject("未找到资源");
                } else {
                    if (node?.getComponent(cc.Sprite)) {
                        node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    }
                    resolve(spriteFrame);
                }
            });
        });
    }

    static maksPos(node: cc.Node, position: cc.Vec2): void {
        if (node) {
            const label = node.getComponent(cc.Label);
            if (label?._forceUpdateRenderData) {
                label._forceUpdateRenderData();
            }
            const width = node.getContentSize().width;
            position.x = width / 2 - 3;
        }
    }

    static loaderView(
        parent: cc.Node,
        name: string,
        data?: unknown,
        zIndex: number = 0,
        callback?: (node: cc.Node) => void
    ): void {
        cc.resources.load(`prefabs/${name}`, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (err) {
                cc.error(err);
            } else {
                const node = cc.instantiate(prefab);
                parent.addChild(node, zIndex);
                node.addComponent(`${name}Ctrl`);
                if (data) {
                    node.getComponent(`${name}Ctrl`).initData(data);
                }
                callback?.(node);
            }
        });
    }

    static loaderHead(url: string, node: cc.Node, size: number = 100): void {
        cc.assetManager.loadRemote(url, (err, texture: cc.Texture2D) => {
            if (err) {
                console.log("头像加载失败", err);
            } else {
                node.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                node.scale = size / node.getContentSize().width;
            }
        });
    }

    static loadSpriteFrame(
        node: cc.Node,
        folder: string,
        name: string,
        callback?: (success: boolean) => void
    ): void {
        cc.resources.load(`img/${folder}/${name}`, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
            if (err) {
                cc.error(err);
                callback?.(false);
            } else {
                if (node?.getComponent(cc.Sprite)) {
                    node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                callback?.(true);
            }
        });
    }

    static addButtonListen(
        node: cc.Node,
        handler: Function,
        target: unknown,
        arg: unknown = null,
        cooldown: number = 300,
        eventName: string = "click",
        transition: number = cc.Button.Transition.SCALE
    ): void {
        if (node) {
            let button = node.getComponent(cc.Button);
            if (!button) {
                button = node.addComponent(cc.Button);
                button.transition = transition;
            }
            node.on(eventName, () => {
                if (handler) {
                    handler.bind(target)(arg);
                    if (cooldown) {
                        button.interactable = false;
                        setTimeout(() => {
                            cc.isValid(button) && (button.interactable = true);
                        }, cooldown);
                    }
                }
            }, target);
        }
    }

    static loaderViewAsync(
        parent: cc.Node,
        name: string,
        folder: string,
        data?: unknown,
        zIndex: number = 0,
        callback?: (node: cc.Node) => void
    ): void {
        cc.resources.load(`prefabs/${folder}/${name}`, cc.Prefab, (err, prefab: cc.Prefab) => {
            if (err) {
                cc.error(err);
            } else {
                const node = cc.instantiate(prefab);
                parent.addChild(node, zIndex);
                node.addComponent(`${name}Ctrl`);
                if (data) {
                    node.getComponent(`${name}Ctrl`).initData(data);
                }
                callback?.(node);
            }
        });
    }

    static loaderViewDeepPath(
        parent: cc.Node,
        name: string,
        folder: string,
        data?: unknown,
        zIndex: number = 0
    ): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(`prefabs/${folder}/${name}`, cc.Prefab, (err, prefab: cc.Prefab) => {
                if (err) {
                    console.error("loaderViewDeepPath==", err);
                    reject("未找到资源");
                } else {
                    const node = cc.instantiate(prefab);
                    parent.addChild(node, zIndex);
                    node.addComponent(`${name}Ctrl`);
                    if (data) {
                        node.getComponent(`${name}Ctrl`).initData(data);
                    }
                    resolve(prefab);
                }
            });
        });
    }

    static loaderPrefabInDeepPath(path: string): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            cc.resources.load(`${path}`, cc.Prefab, (err, prefab: cc.Prefab) => {
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
