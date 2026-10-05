const { ccclass, property, disallowMultiple, menu, executionOrder } = cc._decorator;

export const SelectedMode = cc.Enum({
    NONE: 0,
    TOGGLE: 1,
    SWITCH: 2,
});

@ccclass
@disallowMultiple()
@menu("自定义组件/List Item")
@executionOrder(-5001)
export default class ListItem extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: "",
    })
    icon: cc.Sprite = null;

    @property({
        type: cc.Node,
        tooltip: "",
    })
    title: cc.Node = null;

    @property({
        type: cc.Enum(SelectedMode),
        tooltip: "",
    })
    selectedMode: number = SelectedMode.NONE;

    @property({
        type: cc.Node,
        tooltip: "",
        visible(this: ListItem) {
            return this.selectedMode > SelectedMode.NONE;
        },
    })
    selectedFlag: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "",
        visible(this: ListItem) {
            return this.selectedMode == SelectedMode.SWITCH;
        },
    })
    selectedSpriteFrame: cc.SpriteFrame = null;

    @property({
        tooltip: "",
    })
    adaptiveSize = false;

    list: any = null;
    listId: number = null;

    private _unselectedSpriteFrame: cc.SpriteFrame = null;
    private _selected = false;
    private _eventReg = false;
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
        if (this.selectedMode == SelectedMode.SWITCH) {
            const sprite = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = sprite.spriteFrame;
        }
    }

    showAni(aniType: number, callback?: () => void, remove?: boolean): void {
        let tween: cc.Tween;
        switch (aniType) {
            case 0:
                tween = cc
                    .tween(this.node)
                    .to(0.2, { scale: 0.7 })
                    .by(0.3, { y: 2 * this.node.height });
                break;
            case 1:
                tween = cc
                    .tween(this.node)
                    .to(0.2, { scale: 0.7 })
                    .by(0.3, { x: 2 * this.node.width });
                break;
            case 2:
                tween = cc
                    .tween(this.node)
                    .to(0.2, { scale: 0.7 })
                    .by(0.3, { y: -2 * this.node.height });
                break;
            case 3:
                tween = cc
                    .tween(this.node)
                    .to(0.2, { scale: 0.7 })
                    .by(0.3, { x: -2 * this.node.width });
                break;
            default:
                tween = cc.tween(this.node).to(0.3, { scale: 0.1 });
        }
        if (callback || remove) {
            tween.call(() => {
                if (remove) {
                    this.list._delSingleItem(this.node);
                    for (let i = this.list.displayData.length - 1; i >= 0; i--) {
                        if (this.list.displayData[i].id == this.listId) {
                            this.list.displayData.splice(i, 1);
                            break;
                        }
                    }
                }
                callback();
            });
        }
        tween.start();
    }

    onDestroy(): void {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    createEvt(comp: cc.Component, handler: string, target: cc.Node = null): cc.Component.EventHandler {
        if (comp.isValid) {
            const compAny = comp as any;
            compAny.comName =
                compAny.comName || compAny.name.match(/\<(.*?)\>/g).pop().replace(/\<|\>/g, "");
            const evt = new cc.Component.EventHandler();
            evt.target = target || comp.node;
            evt.component = compAny.comName;
            evt.handler = handler;
            return evt;
        }
    }

    _onSizeChange(): void {
        this.list._onItemAdaptive(this.node);
    }

    onClickThis(): void {
        this.list.selectedId = this.listId;
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
}
