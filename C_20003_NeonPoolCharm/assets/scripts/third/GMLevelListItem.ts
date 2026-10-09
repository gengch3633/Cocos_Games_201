import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/GMLevelListItem")
export default class GMLevelListItem extends cc.Component {

    @property(cc.Label)
    item_name_label: cc.Label = null;

    _label = null;
    onClickCB: (item: GMLevelListItem) => void = null;

    setLabel(text) {
        this._label = text;
        if (this.item_name_label) {
            this.item_name_label.string = text;
        }
    }

    onClick() {
        if (this.onClickCB) {
            this.onClickCB(this);
        }
    }

    onLoad() {
        UiManager.addButtonListen(this.node, this.onClick, this);
    }

    onEnable() {
        if (this.item_name_label && this._label) {
            this.item_name_label.string = this._label;
        }
    }
}
