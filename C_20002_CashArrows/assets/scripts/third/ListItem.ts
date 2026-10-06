const { ccclass, property, disallowMultiple, menu, executionOrder } = cc._decorator;

interface ListHost {
    selectedMode: number;
    selectedId: number;
    displayData: Array<{ id: number }>;
    _onItemAdaptive(node: cc.Node): void;
    _delSingleItem(node: cc.Node): void;
}

export enum SelectedMode {
    NONE = 0,
    TOGGLE = 1,
    SWITCH = 2,
}

@ccclass
@disallowMultiple()
@menu("自定义组件/List Item")
@executionOrder(-5001)
export default class ListItem extends cc.Component {
    @property({ type: cc.Sprite })
    icon: cc.Sprite | null = null;

    @property({ type: cc.Node })
    title: cc.Node | null = null;

    @property({ type: cc.Enum(SelectedMode) })
    selectedMode = SelectedMode.NONE;

    @property({
        type: cc.Node,
        visible(this: ListItem) {
            return this.selectedMode > SelectedMode.NONE;
        },
    })
    selectedFlag: cc.Node | null = null;

    @property({
        type: cc.SpriteFrame,
        visible(this: ListItem) {
            return this.selectedMode === SelectedMode.SWITCH;
        },
    })
    selectedSpriteFrame: cc.SpriteFrame | null = null;

    @property({})
    adaptiveSize = false;

    _selected = false;
    _eventReg = false;
    _btnCom: cc.Button | null = null;
    _unselectedSpriteFrame: cc.SpriteFrame | null = null;

    list!: ListHost;
    listId = 0;
    comName = "";

    get selected(): boolean {
        return this._selected;
    }

    set selected(value: boolean) {
        this._selected = value;
        if (this.selectedFlag) {
            switch (this.selectedMode) {
                case SelectedMode.TOGGLE:
                    this.selectedFlag.active = value;
                    break;

                case SelectedMode.SWITCH: {
                    const sprite = this.selectedFlag.getComponent(cc.Sprite);
                    if (sprite) {
                        sprite.spriteFrame = value ? this.selectedSpriteFrame : this._unselectedSpriteFrame;
                    }
                    break;
                }
            }
        }
    }

    get btnCom(): cc.Button | null {
        if (!this._btnCom) {
            this._btnCom = this.node.getComponent(cc.Button);
        }
        return this._btnCom;
    }

    onLoad(): void {
        if (this.selectedMode === SelectedMode.SWITCH && this.selectedFlag) {
            const sprite = this.selectedFlag.getComponent(cc.Sprite);
            if (sprite) {
                this._unselectedSpriteFrame = sprite.spriteFrame;
            }
        }
    }

    onDestroy(): void {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    _registerEvent(): void {
        if (!this._eventReg) {
            if (this.btnCom && this.list.selectedMode > 0) {
                this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
            }
            if (this.adaptiveSize) {
                this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            }
            this._eventReg = true;
        }
    }

    _onSizeChange(): void {
        this.list._onItemAdaptive(this.node);
    }

    createEvt(component: ListItem, handler: string, target?: cc.Node | null): cc.Component.EventHandler {
        if (component.isValid) {
            component.comName = component.comName || component.name.match(/\<(.*?)\>/g)!.pop()!.replace(/\<|\>/g, "");
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target || component.node;
            eventHandler.component = component.comName;
            eventHandler.handler = handler;
            return eventHandler;
        }
        return new cc.Component.EventHandler();
    }

    showAni(direction: number, callback?: () => void, remove?: boolean): void {
        let tween: cc.Tween;
        switch (direction) {
            case 0:
                tween = cc.tween(this.node).to(0.2, { scale: 0.7 }).by(0.3, { y: 2 * this.node.height });
                break;

            case 1:
                tween = cc.tween(this.node).to(0.2, { scale: 0.7 }).by(0.3, { x: 2 * this.node.width });
                break;

            case 2:
                tween = cc.tween(this.node).to(0.2, { scale: 0.7 }).by(0.3, { y: -2 * this.node.height });
                break;

            case 3:
                tween = cc.tween(this.node).to(0.2, { scale: 0.7 }).by(0.3, { x: -2 * this.node.width });
                break;

            default:
                tween = cc.tween(this.node).to(0.3, { scale: 0.1 });
        }
        if (callback || remove) {
            tween.call(() => {
                if (remove) {
                    this.list._delSingleItem(this.node);
                    for (let i = this.list.displayData.length - 1; i >= 0; i--) {
                        if (this.list.displayData[i].id === this.listId) {
                            this.list.displayData.splice(i, 1);
                            break;
                        }
                    }
                }
                callback?.();
            });
        }
        tween.start();
    }

    onClickThis(): void {
        this.list.selectedId = this.listId;
    }
}
