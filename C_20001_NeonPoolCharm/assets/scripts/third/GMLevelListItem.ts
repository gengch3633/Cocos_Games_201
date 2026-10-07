import { UiManager } from "./UiManage";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu("UI/pages/items/GMLevelListItem")
export default class GMLevelListItem extends cc.Component {
    @property(cc.Label)
    item_name_label: cc.Label = null;

    _label: string = null;
    onClickCB: (item: GMLevelListItem) => void = null;

    setLabel(e: string): void {
        this._label = e;
        if (this.item_name_label) {
            this.item_name_label.string = e;
        }
    }

    onClick(): void {
        if (this.onClickCB) {
            this.onClickCB(this);
        }
    }

    onLoad(): void {
        UiManager.addButtonListen(this.node, this.onClick, this);
    }

    onEnable(): void {
        if (this.item_name_label && this._label) {
            this.item_name_label.string = this._label;
        }
    }
}
