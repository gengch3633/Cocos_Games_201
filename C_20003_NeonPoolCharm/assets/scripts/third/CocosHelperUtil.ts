export default class CocosHelperUtil {
    static GetComponent(target, component) {
        let result = null;
        const node = target.node ? target.node : target;
        if (node) {
            result = node.getComponent(component);
            if (!result) {
                result = node.getComponentInChildren(component);
            }
        }
        return result;
    }

    static GotoScene(sceneName, onLaunched) {
        let loaded = false;
        if (sceneName && CocosHelperUtil.GetCurSceneName() != sceneName) {
            cc.log("go to scene: " + sceneName);
            loaded = cc.director.loadScene(sceneName, onLaunched);
        }
        return loaded;
    }

    static GetLabelString(label) {
        let text = "";
        if (label && label instanceof cc.Label) {
            text = label.string;
        }
        return text;
    }

    static ScaleTo(target, scale, duration, callback) {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                const action = cc.scaleTo(duration, scale);
                if (callback) {
                    node.runAction(cc.sequence(action, cc.callFunc(function () {
                        callback();
                    }, this)));
                } else {
                    node.runAction(action);
                }
            }
        }
    }

    static PreloadScene(sceneName, callback) {
        if (sceneName) {
            cc.director.preloadScene(sceneName, function (err) {
                if (callback) {
                    callback(err);
                }
            });
        }
    }

    static SetText(label, text) {
        if (label && null != text) {
            text = "" + text;
            label.string = text;
        }
    }

    static GetChildByName(target, name, recursive) {
        const node = target.node ? target.node : target;
        let child = null;
        if (node && name) {
            child = node.getChildByName(name);
            if (recursive && !child) {
                const children = node.children;
                const count = node.childrenCount;
                for (let i = 0; i < count && !(child = CocosHelperUtil.GetChildByName(children[i], name, recursive)); ++i) {
                }
            }
        }
        return child;
    }

    static SetOpaque(target, opacity) {
        if (target) {
            if (target.node) {
                target.node.opacity = opacity;
            } else if (target.opacity) {
                target.opacity = opacity;
            }
        }
    }

    static GetRotation(target, out) {
        if (!out) {
            out = cc.v2(0, 0);
        }
        if (target) {
            out = target.node ? target.node.getRotation() : target.getRotation();
        }
        return out;
    }

    static DegreesToRadians(degrees) {
        return cc.misc.degreesToRadians(degrees);
    }

    static Emit() {
    }

    static SetColor(target, color) {
        if (target && color && target.color) {
            target.color = color;
        }
    }

    static SetButtonEnabled(button, enabled) {
        if (button && button instanceof cc.Node) {
            button = button.getComponent(cc.Button);
        }
        if (button && button instanceof cc.Button) {
            enabled = !!enabled;
            button.enableAutoGrayEffect = true;
            button.interactable = enabled;
        }
    }

    static RadiansToDegrees(radians) {
        return cc.misc.radiansToDegrees(radians);
    }

    static SetVisible(target, visible) {
        if (target) {
            if (target.node) {
                target.node.opacity = visible ? 255 : 0;
            } else if (target.opacity) {
                target.opacity = visible ? 255 : 0;
            }
        }
    }

    static IsPausedGame() {
        return cc.game.isPaused();
    }

    static MoveTo(target, from, to, duration, callback) {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                if (from) {
                    CocosHelperUtil.SetPos(node, from.x, from.y);
                }
                const action = cc.moveTo(duration, to);
                if (callback) {
                    node.runAction(cc.sequence(action, cc.callFunc(function () {
                        callback();
                    }, this)));
                } else {
                    node.runAction(action);
                }
            }
        }
    }

    static GetComponentsInChildren(target, component, includeSelf, recursive) {
        let result = [];
        const node = target.node ? target.node : target;
        if (node) {
            if (includeSelf) {
                if (recursive) {
                    result = node.getComponentsInChildren(component);
                } else {
                    let found = node.getComponent(component);
                    if (found) {
                        result.push(found);
                    }
                    const children = node.children;
                    const count = children.length;
                    for (let i = 0; i < count; i++) {
                        const child = children[i];
                        found = child.getComponent(component);
                        if (found) {
                            result.push(found);
                        }
                    }
                }
            } else {
                const children = node.children;
                const count = children.length;
                if (recursive) {
                    for (let i = 0; i < count; i++) {
                        const child = children[i];
                        result = result.concat(child.getComponentsInChildren(component));
                    }
                } else {
                    for (let i = 0; i < count; i++) {
                        const child = children[i];
                        const found = child.getComponent(component);
                        if (found) {
                            result.push(found);
                        }
                    }
                }
            }
        }
        return result;
    }

    static SetScaleY(target, scaleY) {
        if (target) {
            if (target.node) {
                target.node.setScaleY(scaleY);
            } else {
                target.setScaleY(scaleY);
            }
        }
    }

    static EventHandlerEmitWithReturn(handler, ...args) {
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
            if ("function" != typeof fn) {
                return;
            }
            let params = args || [];
            if (null != handler.customEventData && "" !== handler.customEventData) {
                params = params.slice();
                params.push(handler.customEventData);
            }
            return fn.apply(component, params);
        }
    }

    static SetSize(target, width, height) {
        if (target && undefined !== width && undefined !== height) {
            if (target.node) {
                target.node.setContentSize(width, height);
            } else {
                target.setContentSize(width, height);
            }
        }
    }

    static GetCurSceneName() {
        return cc.director.getScene().name;
    }

    static PauseGame() {
        cc.game.pause();
    }

    static SetScale(target, scale) {
        if (target) {
            if (target.node) {
                target.node.setScale(scale);
            } else {
                target.setScale(scale);
            }
        }
    }

    static ChangeSpriteFrame(sprite, spriteFrame) {
        if (sprite instanceof cc.Sprite && spriteFrame instanceof cc.SpriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    }

    static SetActive(target, active) {
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

    static ExitGame() {
        if (cc.sys.isBrowser) {
            window.history.back();
            window.close();
        } else {
            cc.game.end();
        }
    }

    static SetRotation(target, x, y) {
        if (target) {
            if (target.node) {
                target.node.setRotation(x, y);
            } else {
                target.setRotation(x, y);
            }
        }
    }

    static Instantiate(prefab, parent, component) {
        let result = null;
        if (prefab) {
            const node = cc.instantiate(prefab);
            if (node) {
                if (component) {
                    result = node.getComponent(component);
                    if (null == result) {
                        result = node.addComponent(component);
                    }
                } else {
                    result = node;
                }
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

    static PauseDirector() {
        cc.director.pause();
    }

    static GetSpriteFrameName(sprite) {
        let name = "";
        if (sprite && sprite instanceof cc.Sprite && sprite.spriteFrame) {
            name = sprite.spriteFrame.name;
        }
        return name;
    }

    static StopAllActions(target) {
        if (target) {
            const node = target.node ? target.node : target;
            if (node) {
                node.stopAllActions();
            }
        }
    }

    static SetEnable(target, enabled) {
        if (target) {
            enabled = !!enabled;
            if (target.enabled != enabled) {
                target.enabled = enabled;
            }
        }
    }

    static SetPos(target, x, y) {
        if (target) {
            if (target instanceof cc.Component) {
                target.node.setPosition(x, y);
            } else {
                target.setPosition(x, y);
            }
        }
    }

    static SetFrameRate(frameRate) {
        cc.game.setFrameRate(frameRate);
    }

    static ChangeParent(node, parent) {
        if (node.parent != parent) {
            const sumRotation = function (start) {
                let current = start;
                let rotation = current.rotation;
                do {
                    rotation += (current = current.parent).rotation;
                } while (null != current.pageView);
                return rotation % 360;
            };
            const delta = sumRotation(node) - sumRotation(parent);
            const world = node.convertToWorldSpaceAR(cc.v2(0, 0));
            const local = parent.convertToNodeSpaceAR(world);
            node.parent = parent;
            node.position = local;
            node.rotation = delta;
        }
    }

    static ResumeDirector() {
        cc.director.resume();
    }

    static SetPageViewEnable(pageView, enabled) {
        if (pageView) {
            if (enabled) {
                pageView.node.on(cc.Node.EventType.TOUCH_MOVE, pageView._onTouchMoved, pageView.node, true);
            } else {
                pageView.node.off(cc.Node.EventType.TOUCH_MOVE, pageView._onTouchMoved, pageView.node, true);
            }
        }
    }

    static GetPos(target, out) {
        if (!out) {
            out = cc.v2(0, 0);
        }
        if (target) {
            out = target.node ? target.node.getPosition() : target.getPosition();
        }
        return out;
    }

    static IsPausedDirector() {
        return cc.director.isPaused();
    }

    static SetScaleX(target, scaleX) {
        if (target) {
            if (target.node) {
                target.node.setScaleX(scaleX);
            } else {
                target.setScaleX(scaleX);
            }
        }
    }

    static ResumeGame() {
        cc.game.resume();
    }
}
