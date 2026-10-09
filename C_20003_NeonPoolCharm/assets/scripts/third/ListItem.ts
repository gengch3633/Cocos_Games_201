const { ccclass, property, disallowMultiple, menu, executionOrder } = cc._decorator;

const SelectedType = cc.Enum({
    NONE: 0,
    TOGGLE: 1,
    SWITCH: 2
});

@ccclass
@disallowMultiple()
@menu("自定义组件/List Item")
@executionOrder(-5001)
export default class ListItem extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: ""
    })
    icon = null;

    @property({
        type: cc.Node,
        tooltip: ""
    })
    title = null;

    @property({
        type: cc.Enum(SelectedType),
        tooltip: ""
    })
    selectedMode = SelectedType.NONE;

    @property({
        type: cc.Node,
        tooltip: "",
        visible: function () {
            return this.selectedMode > SelectedType.NONE;
        }
    })
    selectedFlag = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "",
        visible: function () {
            return this.selectedMode == SelectedType.SWITCH;
        }
    })
    selectedSpriteFrame = null;

    _unselectedSpriteFrame = null;

    @property({
        tooltip: ""
    })
    adaptiveSize = false;

    _selected = false;
    _eventReg = false;
    listId = null;
    _btnCom;
    list;
    comName;

    get selected() {
        return this._selected;
    }

    set selected(e) {
        this._selected = e;
        if (this.selectedFlag) switch (this.selectedMode) {
            case SelectedType.TOGGLE:
                this.selectedFlag.active = e;
                break;
            case SelectedType.SWITCH:
                var t = this.selectedFlag.getComponent(cc.Sprite);
                t && (t.spriteFrame = e ? this.selectedSpriteFrame : this._unselectedSpriteFrame);
        }
    }

    get btnCom() {
        this._btnCom || (this._btnCom = this.node.getComponent(cc.Button));
        return this._btnCom;
    }

    onLoad() {
        if (this.selectedMode == SelectedType.SWITCH) {
            var e = this.selectedFlag.getComponent(cc.Sprite);
            this._unselectedSpriteFrame = e.spriteFrame;
        }
    }

    showAni(e, t, o) {
        var n,
            i = this;
        switch (e) {
            case 0:
                n = cc.tween(i.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    y: 2 * i.node.height
                });
                break;
            case 1:
                n = cc.tween(i.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    x: 2 * i.node.width
                });
                break;
            case 2:
                n = cc.tween(i.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    y: -2 * i.node.height
                });
                break;
            case 3:
                n = cc.tween(i.node).to(.2, {
                    scale: .7
                }).by(.3, {
                    x: -2 * i.node.width
                });
                break;
            default:
                n = cc.tween(i.node).to(.3, {
                    scale: .1
                });
        }
        (t || o) && n.call(function () {
            if (o) {
                i.list._delSingleItem(i.node);
                for (var e = i.list.displayData.length - 1; e >= 0; e--) if (i.list.displayData[e].id == i.listId) {
                    i.list.displayData.splice(e, 1);
                    break;
                }
            }
            t();
        });
        n.start();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    }

    createEvt(e, t, o) {
        if (o === undefined) o = null;
        if (e.isValid) {
            e.comName = e.comName || e.name.match(/<(.*?)>/g).pop().replace(/\<|>/g, "");
            var n = new cc.Component.EventHandler();
            n.target = o || e.node;
            n.component = e.comName;
            n.handler = t;
            return n;
        }
    }

    _onSizeChange() {
        this.list._onItemAdaptive(this.node);
    }

    onClickThis() {
        this.list.selectedId = this.listId;
    }

    _registerEvent() {
        if (!this._eventReg) {
            this.btnCom && this.list.selectedMode > 0 && this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
            this.adaptiveSize && this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
            this._eventReg = true;
        }
    }
}
