const { ccclass, property, disallowMultiple, menu, executionOrder } = cc._decorator;

enum SelectedMode {
    NONE = 0,
    TOGGLE = 1,
    SWITCH = 2
}

@ccclass
@disallowMultiple
@menu("自定义组件/List Item")
@executionOrder(-5001)
export default class ListItem extends cc.Component {

    @property(cc.Sprite)
    public icon: cc.Sprite = null;

    @property(cc.Node)
    public title: cc.Node = null;

    @property({ type: cc.Enum(SelectedMode) })
    public selectedMode: SelectedMode = SelectedMode.NONE;

    @property({
        type: cc.Node,
        visible(this: ListItem) {
            return this.selectedMode > SelectedMode.NONE;
        }
    })
    public selectedFlag: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        visible(this: ListItem) {
            return this.selectedMode === SelectedMode.SWITCH;
        }
    })
    public selectedSpriteFrame: cc.SpriteFrame = null;

    @property
    public adaptiveSize: boolean = false;

    public list: any = null;

    public listId: any = null;

    private _unselectedSpriteFrame: cc.SpriteFrame = null;

    private _selected: boolean = false;

    private _eventReg: boolean = false;

    private _btnCom: cc.Button = null;

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
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

    public get btnCom(): cc.Button {
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

    public _registerEvent(): void {
        if (this._eventReg) {
            return;
        }
        if (this.btnCom && this.list.selectedMode > 0) {
            this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
        }
        if (this.adaptiveSize) {
            this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
        }
        this._eventReg = true;
    }

    public createEvt(comp: cc.Component, handler: string, target: cc.Node = null): cc.Component.EventHandler {
        if (!comp.isValid) {
            return null;
        }
        const component = comp as cc.Component & { comName?: string };
        const matched = comp.name.match(/\<(.*?)\>/g);
        component.comName = component.comName || (matched ? matched.pop().replace(/\<|>/g, "") : "");
        const evt = new cc.Component.EventHandler();
        evt.target = target || comp.node;
        evt.component = component.comName;
        evt.handler = handler;
        return evt;
    }

    public showAni(direction: number, callback?: () => void, removeItem: boolean = false): void {
        let tween = cc.tween(this.node);
        switch (direction) {
            case 0:
                tween = tween.to(0.2, { scale: 0.7 }).by(0.3, { y: 2 * this.node.height });
                break;
            case 1:
                tween = tween.to(0.2, { scale: 0.7 }).by(0.3, { x: 2 * this.node.width });
                break;
            case 2:
                tween = tween.to(0.2, { scale: 0.7 }).by(0.3, { y: -2 * this.node.height });
                break;
            case 3:
                tween = tween.to(0.2, { scale: 0.7 }).by(0.3, { x: -2 * this.node.width });
                break;
            default:
                tween = tween.to(0.3, { scale: 0.1 });
                break;
        }
        if (callback || removeItem) {
            tween.call(() => {
                if (removeItem) {
                    this.list._delSingleItem(this.node);
                    for (let i = this.list.displayData.length - 1; i >= 0; i--) {
                        if (this.list.displayData[i].id == this.listId) {
                            this.list.displayData.splice(i, 1);
                            break;
                        }
                    }
                }
                if (callback) {
                    callback();
                }
            });
        }
        tween.start();
    }

    public onClickThis(): void {
        this.list.selectedId = this.listId;
    }

    private _onSizeChange(): void {
        this.list._onItemAdaptive(this.node);
    }
}