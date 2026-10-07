const { ccclass, property, menu, disallowMultiple, executionOrder } = cc._decorator;

enum SelectedMode {
    NONE = 0,
    TOGGLE = 1,
    SWITCH = 2,
}

@ccclass
@disallowMultiple()
@menu("自定义组件/List Item")
@executionOrder(-5001)
export default class ListItem extends cc.Component {
    @property({
        type: cc.Sprite
    })
    icon: cc.Sprite = null;

    @property({
        type: cc.Node
    })
    title: cc.Node = null;

    @property({
        type: cc.Enum(SelectedMode)
    })
    selectedMode: SelectedMode = SelectedMode.NONE;

    @property({
        type: cc.Node,
        visible(this: ListItem) {
            return this.selectedMode > SelectedMode.NONE;
        }
    })
    selectedFlag: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        visible(this: ListItem) {
            return this.selectedMode === SelectedMode.SWITCH;
        }
    })
    selectedSpriteFrame: cc.SpriteFrame = null;

    @property
    adaptiveSize: boolean = false;

    list: any = null;
    listId: number = 0;

    private _unselectedSpriteFrame: cc.SpriteFrame = null;
    private _selected: boolean = false;
    private _eventReg: boolean = false;
    private _btnCom: cc.Button = null;

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

    get btnCom(): cc.Button {
        if (!this._btnCom) {
            this._btnCom = this.node.getComponent(cc.Button);
        }
        return this._btnCom;
    }

    onLoad(): void {
        if (this.selectedMode === SelectedMode.SWITCH) {
            const sprite = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = sprite.spriteFrame;
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

    createEvt(component: any, handler: string, target: cc.Node = null): cc.Component.EventHandler {
        if (component.isValid) {
            component.comName = component.comName || component.name.match(/\<(.*?)\>/g).pop().replace(/\<|\>/g, "");
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.target = target || component.node;
            eventHandler.component = component.comName;
            eventHandler.handler = handler;
            return eventHandler;
        }
        return null;
    }

    showAni(aniType: number, callback?: () => void, removeItem?: boolean): void {
        let tween: cc.Tween;
        switch (aniType) {
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
                break;
        }
        if (callback || removeItem) {
            tween.call(() => {
                if (removeItem) {
                    this.list._delSingleItem(this.node);
                    for (let index = this.list.displayData.length - 1; index >= 0; index--) {
                        if (this.list.displayData[index].id === this.listId) {
                            this.list.displayData.splice(index, 1);
                            break;
                        }
                    }
                }
                callback && callback();
            });
        }
        tween.start();
    }

    onClickThis(): void {
        this.list.selectedId = this.listId;
    }
}
