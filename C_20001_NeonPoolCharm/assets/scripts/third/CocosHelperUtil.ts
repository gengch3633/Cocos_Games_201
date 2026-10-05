export default class CocosHelperUtil {
    static GetComponent(target: any, type: any): any {
        let comp = null;
        const node = target.node ? target.node : target;
        if (node) {
            comp = node.getComponent(type);
            if (!comp) {
                comp = node.getComponentInChildren(type);
            }
        }
        return comp;
    }

    static GotoScene(sceneName: string, onLaunched?: () => void): boolean {
        let loaded = false;
        if (sceneName && CocosHelperUtil.GetCurSceneName() != sceneName) {
            cc.log("go to scene: " + sceneName);
            loaded = cc.director.loadScene(sceneName, onLaunched);
        }
        return loaded;
    }

    static GetLabelString(label: any): string {
        let text = "";
        if (label && label instanceof cc.Label) {
            text = label.string;
        }
        return text;
    }

    static ScaleTo(target: any, scale: number, duration: number, callback?: () => void): void {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                const action = cc.scaleTo(duration, scale);
                if (callback) {
                    node.runAction(
                        cc.sequence(
                            action,
                            cc.callFunc(function () {
                                callback();
                            }, this)
                        )
                    );
                } else {
                    node.runAction(action);
                }
            }
        }
    }

    static PreloadScene(sceneName: string, callback?: (error?: Error) => void): void {
        if (sceneName) {
            cc.director.preloadScene(sceneName, function (error) {
                callback && callback(error);
            });
        }
    }

    static SetText(label: cc.Label, text: any): void {
        if (label && text != null) {
            text = "" + text;
            label.string = text;
        }
    }

    static GetChildByName(target: any, name: string, recursive?: boolean): cc.Node {
        const node = target.node ? target.node : target;
        let child: cc.Node = null;
        if (node && name) {
            child = node.getChildByName(name);
            if (recursive && !child) {
                const children = node.children;
                const count = node.childrenCount;
                for (let i = 0; i < count && !(child = CocosHelperUtil.GetChildByName(children[i], name, recursive)); ++i);
            }
        }
        return child;
    }

    static SetOpaque(target: any, opacity: number): void {
        if (target) {
            if (target.node) {
                target.node.opacity = opacity;
            } else if (target.opacity) {
                target.opacity = opacity;
            }
        }
    }

    static GetRotation(target: any, result?: cc.Vec2): cc.Vec2 {
        if (!result) {
            result = cc.v2(0, 0);
        }
        if (target) {
            result = target.node ? target.node.getRotation() : target.getRotation();
        }
        return result;
    }

    static DegreesToRadians(degrees: number): number {
        return cc.misc.degreesToRadians(degrees);
    }

    static Emit(): void {}

    static SetColor(target: any, color: cc.Color): void {
        if (target && color && target.color) {
            target.color = color;
        }
    }

    static SetButtonEnabled(button: cc.Node | cc.Button, enabled: any): void {
        if (button && button instanceof cc.Node) {
            button = button.getComponent(cc.Button);
        }
        if (button && button instanceof cc.Button) {
            enabled = !!enabled;
            button.enableAutoGrayEffect = true;
            button.interactable = enabled;
        }
    }

    static RadiansToDegrees(radians: number): number {
        return cc.misc.radiansToDegrees(radians);
    }

    static SetVisible(target: any, visible: boolean): void {
        if (target) {
            if (target.node) {
                target.node.opacity = visible ? 255 : 0;
            } else if (target.opacity) {
                target.opacity = visible ? 255 : 0;
            }
        }
    }

    static IsPausedGame(): boolean {
        return cc.game.isPaused();
    }

    static MoveTo(
        target: any,
        fromPos: cc.Vec2,
        toPos: cc.Vec2,
        duration: number,
        callback?: () => void
    ): void {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                if (fromPos) {
                    CocosHelperUtil.SetPos(node, fromPos.x, fromPos.y);
                }
                const action = cc.moveTo(duration, toPos);
                if (callback) {
                    node.runAction(
                        cc.sequence(
                            action,
                            cc.callFunc(function () {
                                callback();
                            }, this)
                        )
                    );
                } else {
                    node.runAction(action);
                }
            }
        }
    }

    static GetComponentsInChildren(
        target: any,
        type: any,
        includeSelf?: boolean,
        deep?: boolean
    ): any[] {
        let result: any[] = [];
        const node = target.node ? target.node : target;
        if (node) {
            if (includeSelf) {
                if (deep) {
                    result = node.getComponentsInChildren(type);
                } else {
                    let comp = node.getComponent(type);
                    if (comp) {
                        result.push(comp);
                    }
                    const children = node.children;
                    const count = children.length;
                    for (let i = 0; i < count; i++) {
                        comp = children[i].getComponent(type);
                        if (comp) {
                            result.push(comp);
                        }
                    }
                }
            } else {
                const children = node.children;
                const count = children.length;
                if (deep) {
                    for (let i = 0; i < count; i++) {
                        result = result.concat(children[i].getComponentsInChildren(type));
                    }
                } else {
                    for (let i = 0; i < count; i++) {
                        const comp = children[i].getComponent(type);
                        if (comp) {
                            result.push(comp);
                        }
                    }
                }
            }
        }
        return result;
    }

    static SetScaleY(target: any, scaleY: number): void {
        if (target) {
            if (target.node) {
                target.node.setScaleY(scaleY);
            } else {
                target.setScaleY(scaleY);
            }
        }
    }

    static EventHandlerEmitWithReturn(handler: cc.Component.EventHandler, ...args: any[]): any {
        if (handler && handler instanceof cc.Component.EventHandler && handler.target) {
            const target = handler.target;
            if (!cc.isValid(target)) {
                return;
            }
            const comp = target.getComponent(handler.component);
            if (!cc.isValid(comp)) {
                return;
            }
            const method = comp[handler.handler];
            if (typeof method != "function") {
                return;
            }
            let params = args || [];
            if (handler.customEventData != null && handler.customEventData !== "") {
                params = params.slice();
                params.push(handler.customEventData);
            }
            return method.apply(comp, params);
        }
    }

    static SetSize(target: any, width: number, height: number): void {
        if (target && width !== undefined && height !== undefined) {
            if (target.node) {
                target.node.setContentSize(width, height);
            } else {
                target.setContentSize(width, height);
            }
        }
    }

    static GetCurSceneName(): string {
        return cc.director.getScene().name;
    }

    static PauseGame(): void {
        cc.game.pause();
    }

    static SetScale(target: any, scale: number): void {
        if (target) {
            if (target.node) {
                target.node.setScale(scale);
            } else {
                target.setScale(scale);
            }
        }
    }

    static ChangeSpriteFrame(sprite: cc.Sprite, frame: cc.SpriteFrame): void {
        if (sprite instanceof cc.Sprite && frame instanceof cc.SpriteFrame) {
            sprite.spriteFrame = frame;
        }
    }

    static SetActive(target: any, active: boolean): void {
        if (target) {
            active = !!active;
            if (target instanceof cc.Component) {
                if (target.isValid && target.node && target.node.active != active) {
                    target.node.active = active;
                }
            } else if (target.isValid && target.active != active) {
                target.active = active;
            }
        }
    }

    static ExitGame(): void {
        if (cc.sys.isBrowser) {
            window.history.back();
            window.close();
        } else {
            cc.game.end();
        }
    }

    static SetRotation(target: any, x: number, y: number): void {
        if (target) {
            if (target.node) {
                target.node.setRotation(x, y);
            } else {
                target.setRotation(x, y);
            }
        }
    }

    static Instantiate(prefab: cc.Prefab, parent?: any, componentType?: any): any {
        let result = null;
        if (prefab) {
            const node = cc.instantiate(prefab);
            if (node) {
                result = componentType
                    ? (result = node.getComponent(componentType)) != null
                        ? result
                        : node.addComponent(componentType)
                    : node;
                if (parent) {
                    if (parent.node) {
                        parent.node.addChild(node);
                    } else {
                        parent.addChild(node);
                    }
                }
            }
        }
        return result;
    }

    static PauseDirector(): void {
        cc.director.pause();
    }

    static GetSpriteFrameName(sprite: cc.Sprite): string {
        let name = "";
        if (sprite && sprite instanceof cc.Sprite && sprite.spriteFrame) {
            name = sprite.spriteFrame.name;
        }
        return name;
    }

    static StopAllActions(target: any): void {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                node.stopAllActions();
            }
        }
    }

    static SetEnable(component: cc.Component, enabled: boolean): void {
        if (component) {
            enabled = !!enabled;
            if (component.enabled != enabled) {
                component.enabled = enabled;
            }
        }
    }

    static SetPos(target: any, x: number, y: number): void {
        if (target) {
            if (target instanceof cc.Component) {
                target.node.setPosition(x, y);
            } else {
                target.setPosition(x, y);
            }
        }
    }

    static SetFrameRate(rate: number): void {
        cc.game.setFrameRate(rate);
    }

    static ChangeParent(node: cc.Node, parent: cc.Node): void {
        if (node.parent != parent) {
            const getRotation = function (n: cc.Node): number {
                let current = n;
                let rotation = current.rotation;
                do {
                    rotation += (current = current.parent).rotation;
                } while (current.pageView != null);
                return rotation % 360;
            };
            const rotation = getRotation(node) - getRotation(parent);
            const worldPos = node.convertToWorldSpaceAR(cc.v2(0, 0));
            const localPos = parent.convertToNodeSpaceAR(worldPos);
            node.parent = parent;
            node.position = localPos;
            node.rotation = rotation;
        }
    }

    static ResumeDirector(): void {
        cc.director.resume();
    }

    static SetPageViewEnable(pageView: cc.PageView, enabled: boolean): void {
        if (pageView) {
            if (enabled) {
                pageView.node.on(cc.Node.EventType.TOUCH_MOVE, pageView._onTouchMoved, pageView.node, true);
            } else {
                pageView.node.off(cc.Node.EventType.TOUCH_MOVE, pageView._onTouchMoved, pageView.node, true);
            }
        }
    }

    static GetPos(target: any, result?: cc.Vec2): cc.Vec2 {
        if (!result) {
            result = cc.v2(0, 0);
        }
        if (target) {
            result = target.node ? target.node.getPosition() : target.getPosition();
        }
        return result;
    }

    static IsPausedDirector(): boolean {
        return cc.director.isPaused();
    }

    static SetScaleX(target: any, scaleX: number): void {
        if (target) {
            if (target.node) {
                target.node.setScaleX(scaleX);
            } else {
                target.setScaleX(scaleX);
            }
        }
    }

    static ResumeGame(): void {
        cc.game.resume();
    }
}
