const { ccclass, property, disallowMultiple, menu, executionOrder } = cc._decorator;

enum SelectedMode {
    NONE = 0,
    TOGGLE = 1,
    SWITCH = 2
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
    selectedMode = SelectedMode.NONE;

    @property({
        type: cc.Node,
        visible: function (this: ListItem) {
            return this.selectedMode > SelectedMode.NONE;
        }
    })
    selectedFlag: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        visible: function (this: ListItem) {
            return this.selectedMode == SelectedMode.SWITCH;
        }
    })
    selectedSpriteFrame: cc.SpriteFrame = null;

    @property({})
    adaptiveSize = false;

    _unselectedSpriteFrame: cc.SpriteFrame = null;
    _selected = false;
    _eventReg = false;
    _btnCom: cc.Button = null;
    list: any = null;
    listId: any = null;

    get selected() {
        return this._selected;
    }

    set selected(e: boolean) {
        this._selected = e;
        if (this.selectedFlag) switch (this.selectedMode) {
            case SelectedMode.TOGGLE:
                this.selectedFlag.active = e;
                break;
            case SelectedMode.SWITCH:
                var t = this.selectedFlag.getComponent(cc.Sprite);
                t && (t.spriteFrame = e ? this.selectedSpriteFrame : this._unselectedSpriteFrame);
        }
    }

    get btnCom() {
        this._btnCom || (this._btnCom = this.node.getComponent(cc.Button));
        return this._btnCom;
    }

    onLoad() {
        if (this.selectedMode == SelectedMode.SWITCH) {
            var e = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = e.spriteFrame;
        }
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    _registerEvent() {
        if (!this._eventReg) {
            this.btnCom && this.list.selectedMode > 0 && this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
            this.adaptiveSize && this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            this._eventReg = true;
        }
    }

    _onSizeChange() {
        this.list._onItemAdaptive(this.node);
    }

    createEvt(e: any, t: string, i?: cc.Node) {
        void 0 === i && (i = null);
        if (e.isValid) {
            e.comName = e.comName || e.name.match(/ \< (.*?) \> /g).pop().replace(/ \< | \> /g, "");
            var n = new cc.Component.EventHandler();
            n.target = i || e.node;
            n.component = e.comName;
            n.handler = t;
            return n;
        }
    }

    showAni(e: number, t?: () => void, i?: boolean) {
        var n: cc.Tween;
        var a = this;
        switch (e) {
            case 0:
                n = cc.tween(a.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    y: 2 * a.node.height
                });
                break;
            case 1:
                n = cc.tween(a.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    x: 2 * a.node.width
                });
                break;
            case 2:
                n = cc.tween(a.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    y: -2 * a.node.height
                });
                break;
            case 3:
                n = cc.tween(a.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    x: -2 * a.node.width
                });
                break;
            default:
                n = cc.tween(a.node).to(.3, {
                    scale: .1
                });
        }
        (t || i) && n.call(function () {
            if (i) {
                a.list._delSingleItem(a.node);
                for (var e = a.list.displayData.length - 1; e >= 0; e--) if (a.list.displayData[e].id == a.listId) {
                    a.list.displayData.splice(e, 1);
                    break;
                }
            }
            t();
        });
        n.start();
    }

    onClickThis() {
        this.list.selectedId = this.listId;
    }
}
