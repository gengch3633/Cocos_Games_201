declare const i18n: any;

const { ccclass, executeInEditMode, menu, property } = cc._decorator;

@ccclass
@executeInEditMode()
@menu("i18n/LocalizedLabel")
export default class LocalizedLabel extends cc.Component {
    @property
    _dataID = "";

    label = null;

    editBox = null;

    richText = null;

    @property({})
    get dataID() {
        return this._dataID;
    }

    set dataID(e) {
        if (this._dataID !== e) {
            this._dataID = e;
            this.updateLabel();
        }
    }

    updateLabel() {
        if (this.label || this.editBox || this.richText) {
            const e = i18n.t(this.dataID);
            if (e) {
                this.label && (this.label.string = e);
                this.editBox && (this.editBox.placeholder = e);
                this.richText && (this.richText.string = e);
            }
        } else cc.error("Failed to update localized label, label or editbox component is invalid!");
    }

    fetchRender() {
        const e = this.getComponent(cc.Label);
        e && (this.label = e);
        const t = this.getComponent(cc.EditBox);
        t && (this.editBox = t);
        const o = this.getComponent(cc.RichText);
        o && (this.richText = o);
        this.updateLabel();
    }

    onLoad() {
        i18n.inst || i18n.init();
        this.fetchRender();
    }
}
