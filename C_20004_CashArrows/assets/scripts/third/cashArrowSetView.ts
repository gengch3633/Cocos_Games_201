import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import UIMgr from "./UIMgr";

const { ccclass, property } = cc._decorator;

declare const require: any;

interface ChannelField {
    field_value: string;
    field_desc: string;
    fail_desc: string;
    field_value_translate: string;
}

interface ChannelItem {
    channel: string;
    sub_channel: string;
    show_channel: string;
    account_type: string | string[];
    need_field: ChannelField[];
    channel_pic?: string;
    tax_desc?: string;
    raw?: any;
    title?: string;
    account_label?: string;
    name_label?: string;
    [key: string]: any;
}

interface ChannelCardSlot {
    x: number;
    y: number;
}

interface FieldRow {
    labelNode: cc.Node;
    inputNode: cc.Node;
    bgNode: cc.Node;
    labelComp?: cc.Label;
    editBox?: cc.EditBox;
    inputLabel?: cc.Label;
    bgSprite?: cc.Sprite;
    field?: ChannelField;
}

@ccclass
export default class cashArrowSetView extends cc.Component {

    private selectedOpt: any = null;
    private channelData: any = null;
    private channelList: ChannelItem[] = [];
    private selectedChannelIndex: number = 0;
    private channelInputCache: { [cacheKey: string]: { [field: string]: string } } = {};
    private channelCardNodes: cc.Node[] = [];
    private baseChannelCardNodes: cc.Node[] = [];
    private extraChannelCardNodes: cc.Node[] = [];
    private channelCardTemplateNode: cc.Node = null;
    private channelCardBaseSlots: ChannelCardSlot[] = [];
    private channelCardStartX: number = 0;
    private channelCardStartY: number = 0;
    private channelCardColumnGap: number = 320;
    private channelCardRowGap: number = 140;
    private channelCardColumnCount: number = 2;
    private channelSelectOverlayOffsetX: number = 0;
    private channelSelectOverlayOffsetY: number = 0;
    private channelCardImageVersion: number = 0;
    private channelCardRemoteFrameCache: { [url: string]: cc.SpriteFrame } = {};
    private baseFieldRows: FieldRow[] = [];
    private extraFieldRows: FieldRow[] = [];
    private activeFieldRows: FieldRow[] = [];
    private currentFields: ChannelField[] = [];
    private initialBindInfo: any = null;
    private onValidated: ((bindInfo: any) => void) | null = null;
    private onClose: (() => void) | null = null;
    private isSubmitting: boolean = false;
    private selectedChannelIconOffsetX: number = 0;
    private selectedChannelIconOffsetY: number = 0;
    private baseFieldRowCount: number = 0;
    private _basePanelHeight: number = 0;
    private _basePanelY: number = 0;
    private _basePanelAnchorY: number = 0.5;
    private _currentPanelShift: number = 0;
    private _panelWidget: cc.Widget = null;
    private baseLabelX: number = 0;
    private baseLabelY: number = 0;
    private baseInputX: number = 0;
    private baseInputY: number = 0;
    private baseBgX: number = 0;
    private baseBgY: number = 0;
    private rowGap: number = 153;
    private baseSubmitY: number = 0;

    private btnClose: cc.Node = null;
    private btnSubmit: cc.Node = null;
    private panelNode: cc.Node = null;
    private maskNode: cc.Node = null;
    private lblTitle: cc.Label = null;
    private lblSelectInfo: cc.Label = null;
    private lblInputAccount: cc.Label = null;
    private inputAccountNode: cc.Node = null;
    private lblInputUsername: cc.Label = null;
    private inputUsernameNode: cc.Node = null;
    private lblSubmitBtn: cc.Label = null;
    private bgInputAccountNode: cc.Node = null;
    private bgInputUsernameNode: cc.Node = null;
    private editAccount: cc.EditBox = null;
    private editUsername: cc.EditBox = null;
    private channelSelectOverlay: cc.Node = null;
    private channelSelectedIcon: cc.Node = null;

    public onLoad(): void {
        this.bindNodes();
        this.bindEvents();
        this.bindLanguageEvent();
    }

    public onDestroy(): void {
        this.unbindLanguageEvent();
        this.unbindEvents();
        this.clearExtraChannelCardNodes();
        this.clearExtraFieldRows();
        this.channelCardImageVersion += 1;
    }

    private bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private onLanguageChanged(): void {
        this.refreshUI();
    }

    public setEntryData(entryData: any): void {
        if (!entryData) {
            return;
        }
        this.selectedOpt = entryData.selectedOpt || null;
        this.channelData = entryData.channelData || null;
        this.initialBindInfo = entryData.initialBindInfo || null;
        this.onValidated = typeof entryData.onValidated === "function" ? entryData.onValidated : null;
        this.onClose = typeof entryData.onClose === "function" ? entryData.onClose : null;
        this.parseChannelData();
        this.seedInitialInputCache();
        this.refreshUI();
    }

    private parseChannelData(): void {
        this.channelList = [];
        const rawList = this.extractChannelList(this.channelData);
        for (let i = 0; i < rawList.length; i++) {
            const channel = this.normalizeChannelItem(rawList[i]);
            if (channel) {
                this.channelList.push(channel);
            }
        }
        if (this.channelList.length <= 0 && !this.channelData) {
            this.channelList = this.buildDefaultChannels();
        } else if (this.channelList.length <= 0) {
            cc.warn("[cashArrowSetView] channel list is empty from api");
        }
        this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex || 0, this.channelList.length - 1));
    }

    private extractChannelList(data: any): any[] {
        if (!data) {
            return [];
        }
        if (Array.isArray(data)) {
            return data.filter(Boolean);
        }
        let list = data.channel_list || data.c_l || data.channels || data.list || [];
        if (Array.isArray(list)) {
            return list.filter(Boolean);
        }
        if (data.data) {
            const inner = data.data;
            list = inner.channel_list || inner.c_l || inner.channels || inner.list || [];
            if (Array.isArray(list)) {
                return list.filter(Boolean);
            }
        }
        return [];
    }

    private normalizeChannelItem(item: any): ChannelItem | null {
        if (!item) {
            return null;
        }
        let pic = item.channel_pic || item.channel_icon || item.icon || "";
        if (Array.isArray(pic)) {
            pic = pic[0] || "";
        }
        pic = pic ? String(pic).trim() : "";
        const needField = this.normalizeNeedFields(item);
        return {
            channel: item.channel || "",
            sub_channel: item.sub_channel || "",
            show_channel: item.show_channel || item.name || "",
            channel_pic: pic,
            tax_desc: item.tax_desc || "",
            account_type: item.account_type || "",
            need_field: needField,
            raw: item
        };
    }

    private normalizeNeedFields(item: any): ChannelField[] {
        const fields: ChannelField[] = [];
        const needField = item.need_field;
        if (Array.isArray(needField) && needField.length > 0) {
            for (let i = 0; i < needField.length; i++) {
                const entry = needField[i] || {};
                const value = entry.field_value || entry.key || entry.name || "";
                if (value) {
                    fields.push({
                        field_value: value,
                        field_desc: entry.field_desc || entry.desc || entry.label || value,
                        fail_desc: entry.fail_desc || entry.field_desc || entry.desc || value,
                        field_value_translate: entry.field_value_translate || entry.field_desc || value
                    });
                }
            }
            if (fields.length > 0) {
                return fields;
            }
        }
        const simpleFields = item.fields || item.required_fields || [];
        if (Array.isArray(simpleFields) && simpleFields.length > 0) {
            for (let i = 0; i < simpleFields.length; i++) {
                const value = simpleFields[i];
                if (value) {
                    fields.push({
                        field_value: value,
                        field_desc: value,
                        fail_desc: value,
                        field_value_translate: value
                    });
                }
            }
            if (fields.length > 0) {
                return fields;
            }
        }
        return this.getDefaultNeedFields(item);
    }

    private getDefaultNeedFields(item: any): ChannelField[] {
        const accountLabel = item.account_label || this.i18n("key_cash_set_input_account_placeholder", null, "Please enter your withdrawal account");
        const nameLabel = item.name_label || this.i18n("key_cash_set_input_username_placeholder", null, "Please enter your withdrawal username");
        return [
            {
                field_value: "account",
                field_desc: accountLabel,
                fail_desc: accountLabel,
                field_value_translate: "account"
            },
            {
                field_value: "payee_name",
                field_desc: nameLabel,
                fail_desc: nameLabel,
                field_value_translate: "name"
            }
        ];
    }

    private buildDefaultChannels(): ChannelItem[] {
        const accountLabel = this.i18n("key_cash_set_input_account_placeholder", null, "Please enter your withdrawal account");
        const nameLabel = this.i18n("key_cash_set_input_username_placeholder", null, "Please enter your withdrawal username");
        return [
            {
                channel: "dana",
                sub_channel: "dana",
                show_channel: "DANA",
                account_type: "phone",
                need_field: [
                    { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
                    { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" }
                ]
            },
            {
                channel: "ovo",
                sub_channel: "ovo",
                show_channel: "OVO",
                account_type: "phone",
                need_field: [
                    { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
                    { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" }
                ]
            },
            {
                channel: "shopee",
                sub_channel: "shopee",
                show_channel: "Shopee",
                account_type: "phone",
                need_field: [
                    { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
                    { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" }
                ]
            },
            {
                channel: "gopay",
                sub_channel: "gopay",
                show_channel: "gopay",
                account_type: "phone",
                need_field: [
                    { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
                    { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" }
                ]
            }
        ];
    }

    private bindNodes(): void {
        this.btnClose = this.findNodeDeep(this.node, "btn_close");
        this.btnSubmit = this.findNodeDeep(this.node, "btn_submit");
        this.panelNode = this.findNodeDeep(this.node, "block_panel") || this.findNodeDeep(this.node, "panel");
        this.maskNode = this.findNodeDeep(this.node, "mask");
        this.lblTitle = this.findLabelDeep(this.node, "txt_enter_account_details");
        this.lblSelectInfo = this.findLabelDeep(this.node, "txt_select_account_info");
        this.lblInputAccount = this.findLabelDeep(this.node, "txt_input_account");
        this.inputAccountNode = this.findNodeDeep(this.node, "txt_account_value");
        this.lblInputUsername = this.findLabelDeep(this.node, "txt_input_username");
        this.inputUsernameNode = this.findNodeDeep(this.node, "txt_username_value");
        this.lblSubmitBtn = this.findLabelDeep(this.node, "txt_withdraw_btn");
        this.bgInputAccountNode = this.findNodeDeep(this.node, "img_input_account_bg");
        this.bgInputUsernameNode = this.findNodeDeep(this.node, "img_input_username_bg");
        this.editAccount = this.inputAccountNode ? this.inputAccountNode.getComponent(cc.EditBox) : null;
        this.editUsername = this.inputUsernameNode ? this.inputUsernameNode.getComponent(cc.EditBox) : null;
        this.channelSelectOverlay = this.findNodeDeep(this.node, "img_channel_select_overlay");
        this.channelSelectedIcon = this.findNodeDeep(this.node, "icon_channel_selected");

        this.baseChannelCardNodes = this.collectBaseChannelCardNodes();
        this.channelCardNodes = this.baseChannelCardNodes.slice();
        this.channelCardTemplateNode = this.baseChannelCardNodes[0] || null;
        this.extraChannelCardNodes = [];
        this.captureChannelCardLayoutInfo();

        for (let i = 0; i < this.channelCardNodes.length; i++) {
            this.cacheChannelCardDefaultSpriteFrame(this.channelCardNodes[i]);
        }

        if (this.channelSelectOverlay) {
            this.channelSelectOverlay.active = false;
        }

        if (this.channelCardNodes.length > 0) {
            if (this.channelSelectedIcon) {
                this.selectedChannelIconOffsetX = this.channelSelectedIcon.x - this.channelCardNodes[0].x;
                this.selectedChannelIconOffsetY = this.channelSelectedIcon.y - this.channelCardNodes[0].y;
            }
            if (this.channelSelectOverlay) {
                this.channelSelectOverlayOffsetX = this.channelSelectOverlay.x - this.channelCardNodes[0].x;
                this.channelSelectOverlayOffsetY = this.channelSelectOverlay.y - this.channelCardNodes[0].y;
            }
        }

        this.baseSubmitY = this.btnSubmit ? this.btnSubmit.y : 0;
        this._basePanelHeight = this.panelNode ? this.panelNode.height : 0;
        this._basePanelY = this.panelNode ? this.panelNode.y : 0;
        this._basePanelAnchorY = this.panelNode && this.panelNode.anchorY != null ? this.panelNode.anchorY : 0.5;
        this._currentPanelShift = 0;
        this.buildBaseFieldRows();
    }

    private collectBaseChannelCardNodes(): cc.Node[] {
        const nodes: cc.Node[] = [];
        const parent = this.panelNode || this.node;
        if (parent) {
            for (let i = 0; i < parent.childrenCount; i++) {
                const child = parent.children[i];
                if (this.getChannelCardOrderIndex(child) >= 0) {
                    nodes.push(child);
                }
            }
        }
        if (nodes.length <= 0) {
            const fallbackNames = ["btn_channel_0", "btn_channel_1", "btn_channel_2", "btn_channel_3"];
            for (let i = 0; i < fallbackNames.length; i++) {
                const node = this.findNodeDeep(this.node, fallbackNames[i]);
                if (node) {
                    nodes.push(node);
                }
            }
        }
        nodes.sort((a, b) => this.getChannelCardOrderIndex(a) - this.getChannelCardOrderIndex(b));
        return nodes;
    }

    private getChannelCardOrderIndex(node: cc.Node): number {
        if (!node || !node.name) {
            return -1;
        }
        const matchResult = /^btn_channel_(\d+)$/.exec(node.name);
        return matchResult ? parseInt(matchResult[1], 10) : -1;
    }

    private captureChannelCardLayoutInfo(): void {
        this.channelCardBaseSlots = [];
        const baseNodes = this.baseChannelCardNodes || [];
        if (baseNodes.length <= 0) {
            this.channelCardColumnCount = 1;
            this.channelCardStartX = 0;
            this.channelCardStartY = 0;
            this.channelCardColumnGap = 320;
            this.channelCardRowGap = 140;
            return;
        }
        for (let i = 0; i < baseNodes.length; i++) {
            this.channelCardBaseSlots.push({ x: baseNodes[i].x, y: baseNodes[i].y });
        }
        const first = baseNodes[0];
        const second = baseNodes.length > 1 ? baseNodes[1] : baseNodes[0];
        const third = baseNodes.length > 2 ? baseNodes[2] : null;
        this.channelCardColumnCount = 2;
        this.channelCardStartX = Math.min(first.x, second.x);
        this.channelCardStartY = Math.max(first.y, second.y);
        this.channelCardColumnGap = Math.abs(second.x - first.x);
        this.channelCardRowGap = third ? Math.abs(first.y - third.y) : first.height + 20;
        if (this.channelCardColumnGap <= 1) {
            this.channelCardColumnGap = first.width + 20;
        }
        if (this.channelCardRowGap <= 1) {
            this.channelCardRowGap = first.height + 20;
        }
    }

    private getChannelCardSlot(index: number): ChannelCardSlot {
        if (index < this.channelCardBaseSlots.length) {
            return this.channelCardBaseSlots[index];
        }
        const columnCount = Math.max(1, this.channelCardColumnCount || 1);
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        return {
            x: this.channelCardStartX + this.channelCardColumnGap * column,
            y: this.channelCardStartY - this.channelCardRowGap * row
        };
    }

    private cacheChannelCardDefaultSpriteFrame(node: cc.Node): void {
        if (!node) {
            return;
        }
        const sprite = node.getComponent(cc.Sprite);
        if (sprite && !(node as any)._cashArrowDefaultSpriteFrame) {
            (node as any)._cashArrowDefaultSpriteFrame = sprite.spriteFrame || null;
        }
    }

    private restoreChannelCardDefaultSprite(node: cc.Node): void {
        if (!node) {
            return;
        }
        const sprite = node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }
        this.cacheChannelCardDefaultSpriteFrame(node);
        if ((node as any)._cashArrowDefaultSpriteFrame) {
            sprite.spriteFrame = (node as any)._cashArrowDefaultSpriteFrame;
        }
    }

    private ensureChannelCardNodeCount(count: number): void {
        const targetCount = Math.max(0, count || 0);
        if (!this.channelCardTemplateNode) {
            return;
        }
        const parent = this.panelNode || this.node;
        while (this.channelCardNodes.length < targetCount) {
            const index = this.channelCardNodes.length;
            const node = cc.instantiate(this.channelCardTemplateNode);
            node.name = "btn_channel_dynamic_" + index;
            parent.addChild(node);
            this.cacheChannelCardDefaultSpriteFrame(node);
            this.channelCardNodes.push(node);
            this.extraChannelCardNodes.push(node);
        }
    }

    private clearExtraChannelCardNodes(): void {
        while (this.extraChannelCardNodes.length > 0) {
            const node = this.extraChannelCardNodes.pop();
            if (node) {
                node.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
                node.destroy();
            }
        }
        this.channelCardNodes = this.baseChannelCardNodes ? this.baseChannelCardNodes.slice() : [];
    }

    private bindChannelCardEvents(): void {
        for (let i = 0; i < this.channelCardNodes.length; i++) {
            const node = this.channelCardNodes[i];
            if (!node) {
                continue;
            }
            node.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
            node.on(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
        }
    }

    private unbindChannelCardEvents(): void {
        for (let i = 0; i < this.channelCardNodes.length; i++) {
            const node = this.channelCardNodes[i];
            if (node) {
                node.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
            }
        }
    }

    private applyChannelCardImage(node: cc.Node, channel: ChannelItem, version: number): void {
        if (!node) {
            return;
        }
        const sprite = node.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }
        this.restoreChannelCardDefaultSprite(node);
        const url = channel && channel.channel_pic ? String(channel.channel_pic).trim() : "";
        if (!url) {
            return;
        }
        if (this.channelCardRemoteFrameCache[url]) {
            sprite.spriteFrame = this.channelCardRemoteFrameCache[url];
            return;
        }
        this.loadRemoteChannelCardSpriteFrame(url, (frame) => {
            if (frame && version === this.channelCardImageVersion && node.isValid) {
                const cardSprite = node.getComponent(cc.Sprite);
                if (cardSprite) {
                    cardSprite.spriteFrame = frame;
                }
            }
        });
    }

    private loadRemoteChannelCardSpriteFrame(url: string, callback: (frame: cc.SpriteFrame | null) => void): void {
        if (!url) {
            if (callback) {
                callback(null);
            }
            return;
        }
        cc.assetManager.loadRemote(url, (err: Error | null, asset: any) => {
            if (!cc.isValid(this) || !this.channelCardRemoteFrameCache) {
                return;
            }
            if (!err && asset) {
                let frame: cc.SpriteFrame = null;
                if (asset instanceof cc.SpriteFrame) {
                    frame = asset;
                } else if (asset instanceof cc.Texture2D) {
                    frame = new cc.SpriteFrame(asset);
                } else if (asset._texture instanceof cc.Texture2D) {
                    frame = new cc.SpriteFrame(asset._texture);
                }
                if (frame) {
                    this.channelCardRemoteFrameCache[url] = frame;
                    if (callback) {
                        callback(frame);
                    }
                } else if (callback) {
                    callback(null);
                }
            } else {
                cc.warn("[cashArrowSetView] load channel_pic failed:", url, err);
                if (callback) {
                    callback(null);
                }
            }
        });
    }

    private buildBaseFieldRows(): void {
        this.baseFieldRows = [];
        const accountRow = this.setupFieldRowRefs({
            labelNode: this.lblInputAccount ? this.lblInputAccount.node : null,
            inputNode: this.inputAccountNode,
            bgNode: this.bgInputAccountNode
        });
        const usernameRow = this.setupFieldRowRefs({
            labelNode: this.lblInputUsername ? this.lblInputUsername.node : null,
            inputNode: this.inputUsernameNode,
            bgNode: this.bgInputUsernameNode
        });
        if (accountRow) {
            this.baseFieldRows.push(accountRow);
        }
        if (usernameRow) {
            this.baseFieldRows.push(usernameRow);
        }
        this.baseFieldRowCount = this.baseFieldRows.length;
        if (this.baseFieldRowCount <= 0) {
            return;
        }
        const firstRow = this.baseFieldRows[0];
        this.baseLabelX = firstRow.labelNode ? firstRow.labelNode.x : 0;
        this.baseLabelY = firstRow.labelNode ? firstRow.labelNode.y : 0;
        this.baseInputX = firstRow.inputNode ? firstRow.inputNode.x : 0;
        this.baseInputY = firstRow.inputNode ? firstRow.inputNode.y : 0;
        this.baseBgX = firstRow.bgNode ? firstRow.bgNode.x : 0;
        this.baseBgY = firstRow.bgNode ? firstRow.bgNode.y : this.baseInputY;
        if (this.baseFieldRowCount >= 2 && this.baseFieldRows[1].labelNode && firstRow.labelNode) {
            const gap = Math.abs(this.baseFieldRows[1].labelNode.y - firstRow.labelNode.y);
            if (gap > 1) {
                this.rowGap = gap;
            }
        }
    }

    private setupFieldRowRefs(setup: { labelNode: cc.Node; inputNode: cc.Node; bgNode: cc.Node }): FieldRow | null {
        if (!setup || !setup.labelNode || !setup.inputNode) {
            return null;
        }
        const row: FieldRow = {
            labelNode: setup.labelNode,
            inputNode: setup.inputNode,
            bgNode: setup.bgNode
        };
        row.labelComp = row.labelNode.getComponent(cc.Label);
        row.editBox = row.inputNode.getComponent(cc.EditBox);
        row.inputLabel = row.inputNode.getComponent(cc.Label);
        row.bgSprite = row.bgNode ? row.bgNode.getComponent(cc.Sprite) : null;
        if (!row.editBox || !row.labelComp || !row.inputLabel) {
            return null;
        }
        if (row.bgSprite) {
            row.editBox.background = row.bgSprite;
        }
        this.bindFieldRowInputEvents(row);
        return row;
    }

    private bindFieldRowInputEvents(row: FieldRow): void {
        if (!row || !row.bgNode || !row.editBox) {
            return;
        }
        (row.bgNode as any)._cashArrowBoundEditBox = row.editBox;
        row.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
        row.bgNode.on(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
    }

    private unbindFieldRowInputEvents(row: FieldRow): void {
        if (!row || !row.bgNode) {
            return;
        }
        row.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
        (row.bgNode as any)._cashArrowBoundEditBox = null;
    }

    private createFieldRowFromTemplate(index: number): FieldRow | null {
        const template = this.baseFieldRows[this.baseFieldRows.length - 1] || this.baseFieldRows[0];
        if (!template) {
            return null;
        }
        const parent = this.panelNode || this.node;
        const labelNode = template.labelNode ? cc.instantiate(template.labelNode) : null;
        const inputNode = template.inputNode ? cc.instantiate(template.inputNode) : null;
        const bgNode = template.bgNode ? cc.instantiate(template.bgNode) : null;
        if (bgNode) {
            bgNode.name = "img_dynamic_input_bg_" + index;
            parent.addChild(bgNode);
            bgNode.setSiblingIndex(0);
        }
        if (labelNode) {
            labelNode.name = "txt_dynamic_input_label_" + index;
            parent.addChild(labelNode);
        }
        if (inputNode) {
            inputNode.name = "txt_dynamic_input_value_" + index;
            parent.addChild(inputNode);
        }
        return this.setupFieldRowRefs({ labelNode: labelNode, inputNode: inputNode, bgNode: bgNode });
    }

    private bindEvents(): void {
        if (this.btnClose) {
            this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.btnSubmit) {
            this.btnSubmit.on(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
        }
        if (this.maskNode) {
            this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.panelNode) {
            this.panelNode.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
            this.panelNode.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        }
        this.bindChannelCardEvents();
    }

    private unbindEvents(): void {
        if (this.btnClose) {
            this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.btnSubmit) {
            this.btnSubmit.off(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
        }
        if (this.maskNode) {
            this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        }
        if (this.panelNode) {
            this.panelNode.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
            this.panelNode.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        }
        this.unbindChannelCardEvents();
    }

    private onTouchInsidePanel(event: cc.Event.EventTouch): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
    }

    private onClickFieldBackground(event: cc.Event.EventTouch): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }
        const target = event && event.currentTarget;
        const editBox = target && (target as any)._cashArrowBoundEditBox;
        if (editBox && typeof editBox.focus === "function") {
            editBox.focus();
        }
    }

    private onClickChannelCard(event: cc.Event.EventTouch): void {
        const target = event && event.currentTarget;
        const index = target && (target as any)._channelCardIndex;
        if (typeof index !== "number" || index < 0 || index >= this.channelList.length || index === this.selectedChannelIndex) {
            return;
        }
        this.saveCurrentInputCache();
        this.selectedChannelIndex = index;
        this.refreshUI();
    }

    private refreshChannelCards(): void {
        const channelCount = this.channelList.length;
        this.ensureChannelCardNodeCount(channelCount);
        this.bindChannelCardEvents();
        this.channelCardImageVersion += 1;
        const version = this.channelCardImageVersion;

        if (channelCount <= 0) {
            for (let i = 0; i < this.channelCardNodes.length; i++) {
                const node = this.channelCardNodes[i];
                if (node) {
                    node.active = false;
                    this.restoreChannelCardDefaultSprite(node);
                }
            }
            if (this.channelSelectOverlay) {
                this.channelSelectOverlay.active = false;
            }
            if (this.channelSelectedIcon) {
                this.channelSelectedIcon.active = false;
            }
            return;
        }

        this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex, channelCount - 1));
        const panelShift = this._currentPanelShift || 0;

        for (let i = 0; i < this.channelCardNodes.length; i++) {
            const node = this.channelCardNodes[i];
            if (!node) {
                continue;
            }
            const visible = i < channelCount;
            node.active = visible;
            if (visible) {
                const slot = this.getChannelCardSlot(i);
                if (slot) {
                    node.x = slot.x;
                    node.y = slot.y + panelShift;
                }
                (node as any)._channelCardIndex = i;
                node.opacity = i === this.selectedChannelIndex ? 255 : 180;
                this.applyChannelCardImage(node, this.channelList[i], version);
            } else {
                (node as any)._channelCardIndex = -1;
                this.restoreChannelCardDefaultSprite(node);
            }
        }

        const selectedNode = this.channelCardNodes[this.selectedChannelIndex];
        if (selectedNode && this.channelSelectedIcon) {
            this.channelSelectedIcon.active = true;
            this.channelSelectedIcon.x = selectedNode.x + this.selectedChannelIconOffsetX;
            this.channelSelectedIcon.y = selectedNode.y + this.selectedChannelIconOffsetY;
            this.channelSelectedIcon.setSiblingIndex(this.channelSelectedIcon.parent.childrenCount - 1);
        } else if (this.channelSelectedIcon) {
            this.channelSelectedIcon.active = false;
        }

        if (selectedNode && this.channelSelectOverlay) {
            this.channelSelectOverlay.active = true;
            this.channelSelectOverlay.x = selectedNode.x + this.channelSelectOverlayOffsetX;
            this.channelSelectOverlay.y = selectedNode.y + this.channelSelectOverlayOffsetY;
            this.channelSelectOverlay.setSiblingIndex(this.channelSelectOverlay.parent.childrenCount - 1);
            if (this.channelSelectedIcon && this.channelSelectedIcon.active) {
                this.channelSelectedIcon.setSiblingIndex(this.channelSelectOverlay.parent.childrenCount - 1);
            }
        } else if (this.channelSelectOverlay) {
            this.channelSelectOverlay.active = false;
        }
    }

    private seedInitialInputCache(): void {
        if (!this.initialBindInfo || this.channelList.length <= 0) {
            return;
        }
        for (let i = 0; i < this.channelList.length; i++) {
            const channel = this.channelList[i];
            if ((channel.channel || "") !== (this.initialBindInfo.channel || "") ||
                (channel.sub_channel || "") !== (this.initialBindInfo.sub_channel || "")) {
                continue;
            }
            const cache: { [field: string]: string } = {};
            const needFields = channel.need_field || [];
            for (let j = 0; j < needFields.length; j++) {
                const field = needFields[j];
                if (!field || !field.field_value) {
                    continue;
                }
                const fieldValue = field.field_value;
                let value = this.initialBindInfo[fieldValue];
                if (value == null) {
                    if (fieldValue === "payee_name" || fieldValue === "name") {
                        value = this.initialBindInfo.payee_name || this.initialBindInfo.name || "";
                    } else if (fieldValue === "account") {
                        value = this.initialBindInfo.account || this.initialBindInfo.phone || this.initialBindInfo.email || "";
                    }
                }
                cache[fieldValue] = value == null ? "" : String(value);
            }
            this.channelInputCache[this.getChannelCacheKey(channel)] = cache;
            this.selectedChannelIndex = i;
            break;
        }
    }

    private getCurrentChannel(): ChannelItem | null {
        return this.channelList[this.selectedChannelIndex] || null;
    }

    private getChannelCacheKey(channel: ChannelItem): string {
        return channel
            ? [channel.channel || "", channel.sub_channel || "", channel.show_channel || channel.name || ""].join("|")
            : "__default__";
    }

    private saveCurrentInputCache(): void {
        const channel = this.getCurrentChannel();
        if (!channel) {
            return;
        }
        const data = this.collectCurrentInputData(false);
        if (data) {
            this.channelInputCache[this.getChannelCacheKey(channel)] = data;
        }
    }

    private saveInputCacheByData(channel: ChannelItem, data: { [field: string]: string }): void {
        if (!channel || !data) {
            return;
        }
        this.channelInputCache[this.getChannelCacheKey(channel)] = data;
    }

    private restoreInputCache(channel: ChannelItem): void {
        const cache = this.channelInputCache[this.getChannelCacheKey(channel)] || {};
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            if (row && row.editBox && row.field) {
                const key = row.field.field_value;
                row.editBox.string = cache[key] || "";
            }
        }
    }

    private clearExtraFieldRows(): void {
        while (this.extraFieldRows.length > 0) {
            const row = this.extraFieldRows.pop();
            this.unbindFieldRowInputEvents(row);
            if (row.labelNode) {
                row.labelNode.destroy();
            }
            if (row.inputNode) {
                row.inputNode.destroy();
            }
            if (row.bgNode) {
                row.bgNode.destroy();
            }
        }
    }

    private ensureFieldRowCount(count: number): void {
        const targetCount = Math.max(1, count || 0);
        while (this.baseFieldRows.length + this.extraFieldRows.length < targetCount) {
            const index = this.baseFieldRows.length + this.extraFieldRows.length;
            const row = this.createFieldRowFromTemplate(index);
            if (!row) {
                break;
            }
            this.extraFieldRows.push(row);
        }
        while (this.baseFieldRows.length + this.extraFieldRows.length > targetCount && this.extraFieldRows.length > 0) {
            const row = this.extraFieldRows.pop();
            this.unbindFieldRowInputEvents(row);
            if (row.labelNode) {
                row.labelNode.destroy();
            }
            if (row.inputNode) {
                row.inputNode.destroy();
            }
            if (row.bgNode) {
                row.bgNode.destroy();
            }
        }
        const allRows = this.baseFieldRows.concat(this.extraFieldRows);
        this.activeFieldRows = [];
        for (let i = 0; i < allRows.length; i++) {
            const visible = i < targetCount;
            const row = allRows[i];
            if (row.labelNode) {
                row.labelNode.active = visible;
            }
            if (row.inputNode) {
                row.inputNode.active = visible;
            }
            if (row.bgNode) {
                row.bgNode.active = visible;
            }
            if (visible) {
                this.activeFieldRows.push(row);
            }
        }
    }

    private updateFieldRows(channel: ChannelItem): void {
        this.ensureFieldRowCount(this.currentFields.length);
        this.adjustPanelForFieldCount(this.activeFieldRows.length);
        const panelShift = this._currentPanelShift || 0;
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            const field = this.currentFields[i];
            if (!field) {
                continue;
            }
            row.field = field;
            if (row.labelNode) {
                row.labelNode.x = this.baseLabelX;
                row.labelNode.y = this.baseLabelY + panelShift - this.rowGap * i;
            }
            if (row.inputNode) {
                row.inputNode.x = this.baseInputX;
                row.inputNode.y = this.baseInputY + panelShift - this.rowGap * i;
            }
            if (row.bgNode) {
                row.bgNode.x = this.baseBgX;
                row.bgNode.y = this.baseBgY + panelShift - this.rowGap * i;
            }
            this.updateFieldRowDisplay(row, field, channel);
        }
        const extraGap = this.rowGap * Math.max(0, this.activeFieldRows.length - this.baseFieldRowCount);
        if (this.btnSubmit) {
            this.btnSubmit.y = this.baseSubmitY + panelShift - extraGap;
        }
    }

    private adjustPanelForFieldCount(count: number): void {
        if (!this.panelNode) {
            return;
        }
        const extraHeight = Math.max(0, count - this.baseFieldRowCount) * this.rowGap;
        const targetHeight = this._basePanelHeight + extraHeight;
        const shift = extraHeight * (1 - this._basePanelAnchorY);
        const delta = shift - (this._currentPanelShift || 0);
        if (Math.abs(delta) < 0.01 && Math.abs(this.panelNode.height - targetHeight) < 1) {
            return;
        }
        if (!this._panelWidget) {
            this._panelWidget = this.panelNode.getComponent(cc.Widget);
        }
        if (this._panelWidget && this._panelWidget.enabled) {
            this._panelWidget.enabled = false;
        }
        this.panelNode.height = targetHeight;
        this.panelNode.y = this._basePanelY - shift;
        if (Math.abs(delta) > 0.01) {
            for (let i = 0; i < this.panelNode.childrenCount; i++) {
                const child = this.panelNode.children[i];
                if (child && child.isValid) {
                    child.y += delta;
                }
            }
        }
        this._currentPanelShift = shift;
    }

    private updateFieldRowDisplay(row: FieldRow, field: ChannelField, channel: ChannelItem): void {
        if (!row || !field) {
            return;
        }
        const label = this.resolveFieldLabel(field);
        if (row.labelComp) {
            row.labelComp.string = label;
        }
        if (row.editBox) {
            row.editBox.placeholder = label;
            this.applyFieldInputMode(row.editBox, field, channel);
        }
    }

    private resolveFieldLabel(field: ChannelField): string {
        return (field && (field.field_desc || field.field_value_translate || field.field_value)) || "";
    }

    private applyFieldInputMode(editBox: cc.EditBox, field: ChannelField, channel: ChannelItem): void {
        if (!editBox) {
            return;
        }
        const editBoxClass: any = cc.EditBox;
        const inputMode: any = editBoxClass && editBoxClass.InputMode ? editBoxClass.InputMode : null;
        const fieldValue = field && field.field_value ? String(field.field_value).toLowerCase() : "";
        let accountType = channel && channel.account_type;
        if (Array.isArray(accountType)) {
            accountType = accountType[0];
        }
        accountType = (accountType || "").toString().toLowerCase();
        const isPhone = fieldValue.indexOf("phone") !== -1 || (fieldValue === "account" && accountType === "phone");
        const isEmail = fieldValue.indexOf("email") !== -1 || (fieldValue === "account" && accountType === "email");
        if (isPhone) {
            editBox.inputMode = inputMode && inputMode.PHONE_NUMBER !== undefined ? inputMode.PHONE_NUMBER : 3;
        } else if (isEmail) {
            editBox.inputMode = inputMode && inputMode.EMAIL_ADDR !== undefined ? inputMode.EMAIL_ADDR : 1;
        } else {
            editBox.inputMode = inputMode && inputMode.SINGLE_LINE !== undefined ? inputMode.SINGLE_LINE : 6;
        }
    }

    private refreshUI(): void {
        this.refreshChannelCards();
        const channel = this.getCurrentChannel();
        if (!channel) {
            return;
        }
        if (this.lblTitle) {
            this.lblTitle.string = channel.title || this.i18n("key_cash_set_title", null, "Enter Account Details");
        }
        if (this.lblSelectInfo) {
            this.lblSelectInfo.string = this.i18n("key_cash_set_select_account_info", null, "Select account information");
        }
        if (this.lblSubmitBtn) {
            this.lblSubmitBtn.string = this.i18n("key_cash_set_submit_btn", null, "Submit");
        }
        this.currentFields = channel.need_field && channel.need_field.length > 0 ? channel.need_field : this.getDefaultNeedFields(channel);
        this.updateFieldRows(channel);
        this.restoreInputCache(channel);
    }

    private collectCurrentInputData(validate: boolean): { [field: string]: string } | null {
        const data: { [field: string]: string } = {};
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            if (!row || !row.field || !row.editBox) {
                continue;
            }
            const key = row.field.field_value;
            const value = (row.editBox.string || "").trim();
            if (validate && !value) {
                this.showToast(this.resolveFieldLabel(row.field) || this.i18n("key_cash_set_required_fields", null, "Please complete required fields"));
                return null;
            }
            data[key] = value;
        }
        return data;
    }

    private parseCheckInfo(response: any): any {
        if (!response || !response.data) {
            return {};
        }
        const checkInfo = response.data.check_info;
        if (!checkInfo) {
            return {};
        }
        if (typeof checkInfo === "string") {
            try {
                return JSON.parse(checkInfo);
            } catch (err) {
                cc.warn("[cashArrowSetView] parse check_info failed", err);
                return {};
            }
        }
        return typeof checkInfo === "object" ? checkInfo : {};
    }

    private isCheckPass(value: any): boolean {
        return value === true || value === 1 || value === "1" || value === "true";
    }

    private findFirstFailedField(checkInfo: any): ChannelField | null {
        const fields = this.currentFields || [];
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (field && field.field_value &&
                Object.prototype.hasOwnProperty.call(checkInfo, field.field_value) &&
                !this.isCheckPass(checkInfo[field.field_value])) {
                return field;
            }
        }
        return null;
    }

    private onClickSubmit(): void {
        if (this.isSubmitting) {
            return;
        }
        const channel = this.getCurrentChannel();
        if (!channel) {
            return;
        }
        const inputData = this.collectCurrentInputData(true);
        if (!inputData) {
            return;
        }
        this.isSubmitting = true;
        const requestData = {
            channel: channel.channel || "",
            sub_channel: channel.sub_channel || "",
            info: inputData
        };
        const verifyFunc = LoadingHttpService.verifyWithdrawBindInfo;
        if (typeof verifyFunc !== "function") {
            this.isSubmitting = false;
            cc.warn("[cashArrowSetView] verifyWithdrawBindInfo is undefined");
            this.showToast(this.i18n("key_common_network_unavailable", null, "Network unavailable"));
            return;
        }
        const netErrorPopupService = NetErrorPopupService;
        const retry = () => {
            this.isSubmitting = false;
            this.onClickSubmit();
        };
        verifyFunc.call(
            LoadingHttpService,
            requestData,
            Handler.create(this, (response: any) => {
                if (netErrorPopupService && netErrorPopupService.shouldPop(response)) {
                    cc.warn("[cashArrowSetView] verifyWithdrawBindInfo force-retry code=", response && response.code);
                    this.isSubmitting = false;
                    netErrorPopupService.showAndRetry(retry);
                } else {
                    this.isSubmitting = false;
                    if (response && Number(response.code) === 1) {
                        const checkInfo = this.parseCheckInfo(response);
                        const failedField = this.findFirstFailedField(checkInfo);
                        if (failedField) {
                            this.showToast(failedField.fail_desc || this.resolveFieldLabel(failedField) ||
                                this.i18n("key_cash_set_validation_failed", null, "Validation failed"));
                        } else {
                            this.saveInputCacheByData(channel, inputData);
                            const bindInfo = this.buildBindInfo(channel, inputData);
                            if (this.onValidated) {
                                this.onValidated(bindInfo);
                            }
                            UIMgr.getInstance().hide(this.node);
                        }
                    } else {
                        cc.warn("[cashArrowSetView] verify failed:", response && response.message);
                        this.showToast((response && response.message) ||
                            this.i18n("key_cash_set_validation_failed", null, "Validation failed"));
                    }
                }
            }),
            Handler.create(this, (err: any) => {
                if (netErrorPopupService && netErrorPopupService.shouldPop(err)) {
                    cc.warn("[cashArrowSetView] verifyWithdrawBindInfo 网络异常，弹重试窗 err=", err && err.message);
                    this.isSubmitting = false;
                    netErrorPopupService.showAndRetry(retry);
                } else {
                    this.isSubmitting = false;
                    cc.warn("[cashArrowSetView] verify error:", err && err.message);
                    this.showToast((err && err.message) ||
                        this.i18n("key_common_network_error", null, "Network error"));
                }
            })
        );
    }

    private buildBindInfo(channel: ChannelItem, inputData: { [field: string]: string }): any {
        const bindInfo: any = {
            channel: channel.channel || "",
            sub_channel: channel.sub_channel || "",
            show_channel: channel.show_channel || "",
            need_field: channel.need_field || [],
            channel_pic: channel.channel_pic || "",
            tax_desc: channel.tax_desc || ""
        };
        for (const key in inputData) {
            if (Object.prototype.hasOwnProperty.call(inputData, key)) {
                bindInfo[key] = inputData[key];
            }
        }
        if (!bindInfo.payee_name && bindInfo.name) {
            bindInfo.payee_name = bindInfo.name;
        }
        if (!bindInfo.name && bindInfo.payee_name) {
            bindInfo.name = bindInfo.payee_name;
        }
        if (!bindInfo.account) {
            bindInfo.account = bindInfo.phone || bindInfo.email || "";
        }
        bindInfo._input_data = inputData;
        return bindInfo;
    }

    private i18n(key: string, params: any, fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    private showToast(content: string): void {
        try {
            const Tips: any = require("Tips");
            if (Tips.default) {
                Tips.default.show(content);
            } else if (Tips.show) {
                Tips.show(content);
            }
        } catch (err) {
            cc.log("[cashArrowSetView] toast:", content);
        }
    }

    private onClickClose(): void {
        if (this.onClose) {
            this.onClose();
        }
        UIMgr.getInstance().hide(this.node);
    }

    private findNodeDeep(root: cc.Node, name: string): cc.Node | null {
        if (!root) {
            return null;
        }
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.childrenCount; i++) {
            const found = this.findNodeDeep(root.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    private findLabelDeep(root: cc.Node, name: string): cc.Label | null {
        const node = this.findNodeDeep(root, name);
        return (node && node.getComponent(cc.Label)) || null;
    }
}