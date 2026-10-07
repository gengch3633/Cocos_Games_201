export default class CocosHelperUtil {
    static GetComponent(target: cc.Component | cc.Node, type: { prototype: cc.Component } | string): cc.Component {
        let component: cc.Component = null;
        const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
        if (node) {
            component = node.getComponent(type as any);
            if (!component) {
                component = node.getComponentInChildren(type as any);
            }
        }
        return component;
    }

    static GotoScene(sceneName: string, onLaunched?: () => void): boolean {
        let loaded = false;
        if (sceneName && CocosHelperUtil.GetCurSceneName() != sceneName) {
            cc.log("go to scene: " + sceneName);
            loaded = cc.director.loadScene(sceneName, onLaunched);
        }
        return loaded;
    }

    static GetLabelString(label: cc.Label): string {
        let text = "";
        if (label && label instanceof cc.Label) {
            text = label.string;
        }
        return text;
    }

    static ScaleTo(target: cc.Component | cc.Node, scale: number, duration: number, callback?: () => void): void {
        if (target) {
            const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
            if (node) {
                const action = cc.scaleTo(duration, scale);
                if (callback) {
                    node.runAction(
                        cc.sequence(
                            action,
                            cc.callFunc(() => {
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
            cc.director.preloadScene(sceneName, (error) => {
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

    static GetChildByName(target: cc.Component | cc.Node, name: string, recursive?: boolean): cc.Node {
        const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
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

    static SetOpaque(target: cc.Component | cc.Node, opacity: number): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.opacity = opacity;
            } else if ((target as cc.Node).opacity) {
                (target as cc.Node).opacity = opacity;
            }
        }
    }

    static GetRotation(target: cc.Component | cc.Node, rotation?: cc.Vec2): cc.Vec2 {
        if (!rotation) {
            rotation = cc.v2(0, 0);
        }
        if (target) {
            rotation = (target as cc.Component).node ? (target as cc.Component).node.getRotation() : (target as cc.Node).getRotation();
        }
        return rotation;
    }

    static DegreesToRadians(degrees: number): number {
        return cc.misc.degreesToRadians(degrees);
    }

    static Emit(): void {}

    static SetColor(target: cc.Node, color: cc.Color): void {
        if (target && color && target.color) {
            target.color = color;
        }
    }

    static SetButtonEnabled(target: cc.Node | cc.Button, enabled: boolean): void {
        if (target && target instanceof cc.Node) {
            target = target.getComponent(cc.Button);
        }
        if (target && target instanceof cc.Button) {
            enabled = !!enabled;
            target.enableAutoGrayEffect = true;
            target.interactable = enabled;
        }
    }

    static RadiansToDegrees(radians: number): number {
        return cc.misc.radiansToDegrees(radians);
    }

    static SetVisible(target: cc.Component | cc.Node, visible: boolean): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.opacity = visible ? 255 : 0;
            } else if ((target as cc.Node).opacity) {
                (target as cc.Node).opacity = visible ? 255 : 0;
            }
        }
    }

    static IsPausedGame(): boolean {
        return cc.game.isPaused();
    }

    static MoveTo(
        target: cc.Component | cc.Node,
        startPos: cc.Vec2,
        endPos: cc.Vec2,
        duration: number,
        callback?: () => void
    ): void {
        if (target) {
            const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
            if (node) {
                if (startPos) {
                    CocosHelperUtil.SetPos(node, startPos.x, startPos.y);
                }
                const action = cc.moveTo(duration, endPos);
                if (callback) {
                    node.runAction(
                        cc.sequence(
                            action,
                            cc.callFunc(() => {
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
        target: cc.Component | cc.Node,
        type: { prototype: cc.Component } | string,
        includeSelf?: boolean,
        recursive?: boolean
    ): cc.Component[] {
        let result: cc.Component[] = [];
        const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
        if (node) {
            if (includeSelf) {
                if (recursive) {
                    result = node.getComponentsInChildren(type as any);
                } else {
                    const selfComponent = node.getComponent(type as any);
                    if (selfComponent) {
                        result.push(selfComponent);
                    }
                    const children = node.children;
                    const count = children.length;
                    for (let i = 0; i < count; i++) {
                        const childComponent = children[i].getComponent(type as any);
                        if (childComponent) {
                            result.push(childComponent);
                        }
                    }
                }
            } else {
                const children = node.children;
                const count = children.length;
                if (recursive) {
                    for (let i = 0; i < count; i++) {
                        result = result.concat(children[i].getComponentsInChildren(type as any));
                    }
                } else {
                    for (let i = 0; i < count; i++) {
                        const childComponent = children[i].getComponent(type as any);
                        if (childComponent) {
                            result.push(childComponent);
                        }
                    }
                }
            }
        }
        return result;
    }

    static SetScaleY(target: cc.Component | cc.Node, scaleY: number): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.setScaleY(scaleY);
            } else {
                (target as cc.Node).setScaleY(scaleY);
            }
        }
    }

    static EventHandlerEmitWithReturn(handler: cc.Component.EventHandler, ...args: any[]): any {
        if (handler && handler instanceof cc.Component.EventHandler && handler.target) {
            const target = handler.target;
            if (!cc.isValid(target)) {
                return;
            }
            const component = target.getComponent(handler.component);
            if (!cc.isValid(component)) {
                return;
            }
            const fn = component[handler.handler];
            if (typeof fn != "function") {
                return;
            }
            let params = args || [];
            if (handler.customEventData != null && handler.customEventData !== "") {
                params = params.slice();
                params.push(handler.customEventData);
            }
            return fn.apply(component, params);
        }
    }

    static SetSize(target: cc.Component | cc.Node, width: number, height: number): void {
        if (target && width !== undefined && height !== undefined) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.setContentSize(width, height);
            } else {
                (target as cc.Node).setContentSize(width, height);
            }
        }
    }

    static GetCurSceneName(): string {
        return cc.director.getScene().name;
    }

    static PauseGame(): void {
        cc.game.pause();
    }

    static SetScale(target: cc.Component | cc.Node, scale: number): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.setScale(scale);
            } else {
                (target as cc.Node).setScale(scale);
            }
        }
    }

    static ChangeSpriteFrame(sprite: cc.Sprite, frame: cc.SpriteFrame): void {
        if (sprite instanceof cc.Sprite && frame instanceof cc.SpriteFrame) {
            sprite.spriteFrame = frame;
        }
    }

    static SetActive(target: cc.Component | cc.Node, active: boolean): void {
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

    static SetRotation(target: cc.Component | cc.Node, x: number, y: number): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.setRotation(x, y);
            } else {
                (target as cc.Node).setRotation(x, y);
            }
        }
    }

    static Instantiate(prefab: cc.Prefab, parent?: cc.Component | cc.Node, componentType?: { prototype: cc.Component } | string): cc.Node | cc.Component {
        let result: cc.Node | cc.Component = null;
        if (prefab) {
            const node = cc.instantiate(prefab);
            if (node) {
                result = componentType ? node.getComponent(componentType as any) ?? node.addComponent(componentType as any) : node;
                if (parent) {
                    if ((parent as cc.Component).node) {
                        (parent as cc.Component).node.addChild(node);
                    } else {
                        (parent as cc.Node).addChild(node);
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

    static StopAllActions(target: cc.Component | cc.Node): void {
        if (target) {
            const node: cc.Node = (target as cc.Component).node ? (target as cc.Component).node : (target as cc.Node);
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

    static SetPos(target: cc.Component | cc.Node, x: number, y: number): void {
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
            const getWorldRotation = (current: cc.Node): number => {
                let target = current;
                let rotation = target.rotation;
                do {
                    rotation += (target = target.parent).rotation;
                } while (target.pageView != null);
                return rotation % 360;
            };
            const rotation = getWorldRotation(node) - getWorldRotation(parent);
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

    static GetPos(target: cc.Component | cc.Node, position?: cc.Vec2): cc.Vec2 {
        if (!position) {
            position = cc.v2(0, 0);
        }
        if (target) {
            position = (target as cc.Component).node ? (target as cc.Component).node.getPosition() : (target as cc.Node).getPosition();
        }
        return position;
    }

    static IsPausedDirector(): boolean {
        return cc.director.isPaused();
    }

    static SetScaleX(target: cc.Component | cc.Node, scaleX: number): void {
        if (target) {
            if ((target as cc.Component).node) {
                (target as cc.Component).node.setScaleX(scaleX);
            } else {
                (target as cc.Node).setScaleX(scaleX);
            }
        }
    }

    static ResumeGame(): void {
        cc.game.resume();
    }
}
