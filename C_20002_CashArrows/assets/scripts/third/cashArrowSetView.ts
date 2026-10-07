import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import Tips from "./Tips";
import UIMgr from "./UIMgr";

const { ccclass } = cc._decorator;

interface FieldRow {
    labelNode: cc.Node | null;
    inputNode: cc.Node | null;
    bgNode: cc.Node | null;
    labelComp?: cc.Label | null;
    editBox?: cc.EditBox | null;
    inputLabel?: cc.Label | null;
    bgSprite?: cc.Sprite | null;
    field?: any;
}

@ccclass
export default class CashArrowSetView extends cc.Component {
    selectedOpt: any = null;
    channelData: any = null;
    channelList: any[] = [];
    selectedChannelIndex = 0;
    channelInputCache: { [key: string]: any } = {};
    channelCardNodes: cc.Node[] = [];
    baseChannelCardNodes: cc.Node[] = [];
    extraChannelCardNodes: cc.Node[] = [];
    channelCardTemplateNode: cc.Node | null = null;
    channelCardBaseSlots: { x: number; y: number }[] = [];
    channelCardStartX = 0;
    channelCardStartY = 0;
    channelCardColumnGap = 320;
    channelCardRowGap = 140;
    channelCardColumnCount = 2;
    channelSelectOverlayOffsetX = 0;
    channelSelectOverlayOffsetY = 0;
    channelCardImageVersion = 0;
    channelCardRemoteFrameCache: { [url: string]: cc.SpriteFrame } = {};
    baseFieldRows: FieldRow[] = [];
    extraFieldRows: FieldRow[] = [];
    activeFieldRows: FieldRow[] = [];
    currentFields: any[] = [];
    initialBindInfo: any = null;
    onValidated: ((info: any) => void) | null = null;
    onClose: (() => void) | null = null;
    isSubmitting = false;
    selectedChannelIconOffsetX = 0;
    selectedChannelIconOffsetY = 0;
    baseFieldRowCount = 0;

    private btnClose: cc.Node | null = null;
    private btnSubmit: cc.Node | null = null;
    private panelNode: cc.Node | null = null;
    private maskNode: cc.Node | null = null;
    private lblTitle: cc.Label | null = null;
    private lblSelectInfo: cc.Label | null = null;
    private lblInputAccount: cc.Label | null = null;
    private inputAccountNode: cc.Node | null = null;
    private lblInputUsername: cc.Label | null = null;
    private inputUsernameNode: cc.Node | null = null;
    private lblSubmitBtn: cc.Label | null = null;
    private bgInputAccountNode: cc.Node | null = null;
    private bgInputUsernameNode: cc.Node | null = null;
    private editAccount: cc.EditBox | null = null;
    private editUsername: cc.EditBox | null = null;
    private channelSelectOverlay: cc.Node | null = null;
    private channelSelectedIcon: cc.Node | null = null;
    private _basePanelHeight = 0;
    private _basePanelY = 0;
    private _basePanelAnchorY = 0.5;
    private _currentPanelShift = 0;
    private _panelWidget: cc.Widget | null = null;
    private baseLabelX = 0;
    private baseLabelY = 0;
    private baseInputX = 0;
    private baseInputY = 0;
    private baseBgX = 0;
    private baseBgY = 0;
    private rowGap = 153;
    private baseSubmitY = 0;

    onLoad(): void {
        this.bindNodes();
        this.bindEvents();
        this.bindLanguageEvent();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
        this.unbindEvents();
        this.clearExtraChannelCardNodes();
        this.clearExtraFieldRows();
        this.channelCardImageVersion += 1;
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshUI();
    }

    setEntryData(data: any): void {
        if (data) {
            this.selectedOpt = data.selectedOpt || null;
            this.channelData = data.channelData || null;
            this.initialBindInfo = data.initialBindInfo || null;
            this.onValidated = typeof data.onValidated === "function" ? data.onValidated : null;
            this.onClose = typeof data.onClose === "function" ? data.onClose : null;
            this.parseChannelData();
            this.seedInitialInputCache();
            this.refreshUI();
        }
    }

    parseChannelData(): void {
        this.channelList = [];
        const rawList = this.extractChannelList(this.channelData);
        for (let i = 0; i < rawList.length; i++) {
            const item = this.normalizeChannelItem(rawList[i]);
            if (item) {
                this.channelList.push(item);
            }
        }
        if (this.channelList.length <= 0 && !this.channelData) {
            this.channelList = this.buildDefaultChannels();
        } else if (this.channelList.length <= 0) {
            cc.warn("[cashArrowSetView] channel list is empty from api");
        }
        this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex || 0, this.channelList.length - 1));
    }

    extractChannelList(data: any): any[] {
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

    normalizeChannelItem(item: any): any | null {
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
            raw: item,
        };
    }

    normalizeNeedFields(item: any): any[] {
        const result: any[] = [];
        const needField = item.need_field;
        if (Array.isArray(needField) && needField.length > 0) {
            for (let i = 0; i < needField.length; i++) {
                const field = needField[i] || {};
                const key = field.field_value || field.key || field.name || "";
                if (key) {
                    result.push({
                        field_value: key,
                        field_desc: field.field_desc || field.desc || field.label || key,
                        fail_desc: field.fail_desc || field.field_desc || field.desc || key,
                        field_value_translate: field.field_value_translate || field.field_desc || key,
                    });
                }
            }
            if (result.length > 0) {
                return result;
            }
        }
        const fields = item.fields || item.required_fields || [];
        if (Array.isArray(fields) && fields.length > 0) {
            for (let j = 0; j < fields.length; j++) {
                const key = fields[j];
                if (key) {
                    result.push({ field_value: key, field_desc: key, fail_desc: key, field_value_translate: key });
                }
            }
            if (result.length > 0) {
                return result;
            }
        }
        return this.getDefaultNeedFields(item);
    }

    getDefaultNeedFields(item: any): any[] {
        const accountLabel = item.account_label || this.i18n("key_cash_set_input_account_placeholder", null, "Please enter your withdrawal account");
        const nameLabel = item.name_label || this.i18n("key_cash_set_input_username_placeholder", null, "Please enter your withdrawal username");
        return [
            { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
            { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" },
        ];
    }

    buildDefaultChannels(): any[] {
        const accountLabel = this.i18n("key_cash_set_input_account_placeholder", null, "Please enter your withdrawal account");
        const nameLabel = this.i18n("key_cash_set_input_username_placeholder", null, "Please enter your withdrawal username");
        const needField = [
            { field_value: "account", field_desc: accountLabel, fail_desc: accountLabel, field_value_translate: "account" },
            { field_value: "payee_name", field_desc: nameLabel, fail_desc: nameLabel, field_value_translate: "name" },
        ];
        return [
            { channel: "dana", sub_channel: "dana", show_channel: "DANA", account_type: "phone", need_field: needField },
            { channel: "ovo", sub_channel: "ovo", show_channel: "OVO", account_type: "phone", need_field: needField },
            { channel: "shopee", sub_channel: "shopee", show_channel: "Shopee", account_type: "phone", need_field: needField },
            { channel: "gopay", sub_channel: "gopay", show_channel: "gopay", account_type: "phone", need_field: needField },
        ];
    }

    bindNodes(): void {
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

    collectBaseChannelCardNodes(): cc.Node[] {
        const nodes: cc.Node[] = [];
        const root = this.panelNode || this.node;
        if (root) {
            for (let i = 0; i < root.childrenCount; i++) {
                const child = root.children[i];
                if (this.getChannelCardOrderIndex(child) >= 0) {
                    nodes.push(child);
                }
            }
        }
        if (nodes.length <= 0) {
            const names = ["btn_channel_0", "btn_channel_1", "btn_channel_2", "btn_channel_3"];
            for (let j = 0; j < names.length; j++) {
                const node = this.findNodeDeep(this.node, names[j]);
                if (node) {
                    nodes.push(node);
                }
            }
        }
        nodes.sort((a, b) => this.getChannelCardOrderIndex(a) - this.getChannelCardOrderIndex(b));
        return nodes;
    }

    getChannelCardOrderIndex(node: cc.Node): number {
        if (!node || !node.name) {
            return -1;
        }
        const match = /^btn_channel_(\d+)$/.exec(node.name);
        return match ? parseInt(match[1], 10) : -1;
    }

    captureChannelCardLayoutInfo(): void {
        this.channelCardBaseSlots = [];
        const cards = this.baseChannelCardNodes || [];
        if (cards.length <= 0) {
            this.channelCardColumnCount = 1;
            this.channelCardStartX = 0;
            this.channelCardStartY = 0;
            this.channelCardColumnGap = 320;
            this.channelCardRowGap = 140;
            return;
        }
        for (let i = 0; i < cards.length; i++) {
            this.channelCardBaseSlots.push({ x: cards[i].x, y: cards[i].y });
        }
        const first = cards[0];
        const second = cards.length > 1 ? cards[1] : cards[0];
        const third = cards.length > 2 ? cards[2] : null;
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

    getChannelCardSlot(index: number): { x: number; y: number } {
        if (index < this.channelCardBaseSlots.length) {
            return this.channelCardBaseSlots[index];
        }
        const columns = Math.max(1, this.channelCardColumnCount || 1);
        const col = index % columns;
        const row = Math.floor(index / columns);
        return {
            x: this.channelCardStartX + this.channelCardColumnGap * col,
            y: this.channelCardStartY - this.channelCardRowGap * row,
        };
    }

    cacheChannelCardDefaultSpriteFrame(node: cc.Node): void {
        if (node) {
            const sprite = node.getComponent(cc.Sprite);
            if (sprite && !(node as any)._cashArrowDefaultSpriteFrame) {
                (node as any)._cashArrowDefaultSpriteFrame = sprite.spriteFrame || null;
            }
        }
    }

    restoreChannelCardDefaultSprite(node: cc.Node): void {
        if (node) {
            const sprite = node.getComponent(cc.Sprite);
            if (sprite) {
                this.cacheChannelCardDefaultSpriteFrame(node);
                if ((node as any)._cashArrowDefaultSpriteFrame) {
                    sprite.spriteFrame = (node as any)._cashArrowDefaultSpriteFrame;
                }
            }
        }
    }

    ensureChannelCardNodeCount(count: number): void {
        const target = Math.max(0, count || 0);
        const parent = this.panelNode || this.node;
        if (!this.channelCardTemplateNode) {
            return;
        }
        while (this.channelCardNodes.length < target) {
            const index = this.channelCardNodes.length;
            const node = cc.instantiate(this.channelCardTemplateNode);
            node.name = "btn_channel_dynamic_" + index;
            parent.addChild(node);
            this.cacheChannelCardDefaultSpriteFrame(node);
            this.channelCardNodes.push(node);
            this.extraChannelCardNodes.push(node);
        }
    }

    clearExtraChannelCardNodes(): void {
        while (this.extraChannelCardNodes.length > 0) {
            const node = this.extraChannelCardNodes.pop();
            if (node) {
                node.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
                node.destroy();
            }
        }
        this.channelCardNodes = this.baseChannelCardNodes ? this.baseChannelCardNodes.slice() : [];
    }

    bindChannelCardEvents(): void {
        for (let i = 0; i < this.channelCardNodes.length; i++) {
            const node = this.channelCardNodes[i];
            if (node) {
                node.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
                node.on(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
            }
        }
    }

    unbindChannelCardEvents(): void {
        for (let i = 0; i < this.channelCardNodes.length; i++) {
            this.channelCardNodes[i]?.off(cc.Node.EventType.TOUCH_END, this.onClickChannelCard, this);
        }
    }

    applyChannelCardImage(node: cc.Node, channel: any, version: number): void {
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
                const sp = node.getComponent(cc.Sprite);
                if (sp) {
                    sp.spriteFrame = frame;
                }
            }
        });
    }

    loadRemoteChannelCardSpriteFrame(url: string, callback: (frame: cc.SpriteFrame | null) => void): void {
        if (!url) {
            callback(null);
            return;
        }
        cc.assetManager.loadRemote(url, (err, asset: any) => {
            if (cc.isValid(this) && this.channelCardRemoteFrameCache) {
                if (!err && asset) {
                    let frame: cc.SpriteFrame | null = null;
                    if (asset instanceof cc.SpriteFrame) {
                        frame = asset;
                    } else if (asset instanceof cc.Texture2D) {
                        frame = new cc.SpriteFrame(asset);
                    } else if (asset._texture instanceof cc.Texture2D) {
                        frame = new cc.SpriteFrame(asset._texture);
                    }
                    if (frame) {
                        this.channelCardRemoteFrameCache[url] = frame;
                        callback(frame);
                    } else {
                        callback(null);
                    }
                } else {
                    cc.warn("[cashArrowSetView] load channel_pic failed:", url, err);
                    callback(null);
                }
            }
        });
    }

    buildBaseFieldRows(): void {
        this.baseFieldRows = [];
        const rowA = this.setupFieldRowRefs({
            labelNode: this.lblInputAccount ? this.lblInputAccount.node : null,
            inputNode: this.inputAccountNode,
            bgNode: this.bgInputAccountNode,
        });
        const rowB = this.setupFieldRowRefs({
            labelNode: this.lblInputUsername ? this.lblInputUsername.node : null,
            inputNode: this.inputUsernameNode,
            bgNode: this.bgInputUsernameNode,
        });
        if (rowA) {
            this.baseFieldRows.push(rowA);
        }
        if (rowB) {
            this.baseFieldRows.push(rowB);
        }
        this.baseFieldRowCount = this.baseFieldRows.length;
        if (this.baseFieldRowCount <= 0) {
            return;
        }
        this.baseLabelX = this.baseFieldRows[0].labelNode ? this.baseFieldRows[0].labelNode!.x : 0;
        this.baseLabelY = this.baseFieldRows[0].labelNode ? this.baseFieldRows[0].labelNode!.y : 0;
        this.baseInputX = this.baseFieldRows[0].inputNode ? this.baseFieldRows[0].inputNode!.x : 0;
        this.baseInputY = this.baseFieldRows[0].inputNode ? this.baseFieldRows[0].inputNode!.y : 0;
        this.baseBgX = this.baseFieldRows[0].bgNode ? this.baseFieldRows[0].bgNode!.x : 0;
        this.baseBgY = this.baseFieldRows[0].bgNode ? this.baseFieldRows[0].bgNode!.y : this.baseInputY;
        if (this.baseFieldRowCount >= 2 && this.baseFieldRows[1].labelNode && this.baseFieldRows[0].labelNode) {
            const gap = Math.abs(this.baseFieldRows[1].labelNode!.y - this.baseFieldRows[0].labelNode!.y);
            if (gap > 1) {
                this.rowGap = gap;
            }
        }
    }

    setupFieldRowRefs(row: FieldRow): FieldRow | null {
        if (!row || !row.labelNode || !row.inputNode) {
            return null;
        }
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

    bindFieldRowInputEvents(row: FieldRow): void {
        if (row && row.bgNode && row.editBox) {
            (row.bgNode as any)._cashArrowBoundEditBox = row.editBox;
            row.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
            row.bgNode.on(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
        }
    }

    unbindFieldRowInputEvents(row: FieldRow): void {
        if (row && row.bgNode) {
            row.bgNode.off(cc.Node.EventType.TOUCH_END, this.onClickFieldBackground, this);
            (row.bgNode as any)._cashArrowBoundEditBox = null;
        }
    }

    createFieldRowFromTemplate(index: number): FieldRow | null {
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
        return this.setupFieldRowRefs({ labelNode, inputNode, bgNode });
    }

    bindEvents(): void {
        this.btnClose?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnSubmit?.on(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
        this.maskNode?.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.panelNode?.on(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
        this.panelNode?.on(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        this.bindChannelCardEvents();
    }

    unbindEvents(): void {
        this.btnClose?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnSubmit?.off(cc.Node.EventType.TOUCH_END, this.onClickSubmit, this);
        this.maskNode?.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.panelNode?.off(cc.Node.EventType.TOUCH_START, this.onTouchInsidePanel, this);
        this.panelNode?.off(cc.Node.EventType.TOUCH_END, this.onTouchInsidePanel, this);
        this.unbindChannelCardEvents();
    }

    onTouchInsidePanel(event: cc.Event.EventTouch): void {
        event?.stopPropagation?.();
    }

    onClickFieldBackground(event: cc.Event.EventTouch): void {
        event?.stopPropagation?.();
        const target = event?.currentTarget as cc.Node;
        const editBox = target && (target as any)._cashArrowBoundEditBox;
        if (editBox && typeof editBox.focus === "function") {
            editBox.focus();
        }
    }

    onClickChannelCard(event: cc.Event.EventTouch): void {
        const index = event?.currentTarget && (event.currentTarget as any)._channelCardIndex;
        if (typeof index === "number" && index >= 0 && index < this.channelList.length && index !== this.selectedChannelIndex) {
            this.saveCurrentInputCache();
            this.selectedChannelIndex = index;
            this.refreshUI();
        }
    }

    refreshChannelCards(): void {
        const count = this.channelList.length;
        this.ensureChannelCardNodeCount(count);
        this.bindChannelCardEvents();
        this.channelCardImageVersion += 1;
        const version = this.channelCardImageVersion;
        if (count <= 0) {
            for (let i = 0; i < this.channelCardNodes.length; i++) {
                if (this.channelCardNodes[i]) {
                    this.channelCardNodes[i].active = false;
                    this.restoreChannelCardDefaultSprite(this.channelCardNodes[i]);
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
        this.selectedChannelIndex = Math.max(0, Math.min(this.selectedChannelIndex, count - 1));
        const shift = this._currentPanelShift || 0;
        for (let j = 0; j < this.channelCardNodes.length; j++) {
            const card = this.channelCardNodes[j];
            if (!card) {
                continue;
            }
            const visible = j < count;
            card.active = visible;
            if (visible) {
                const slot = this.getChannelCardSlot(j);
                if (slot) {
                    card.x = slot.x;
                    card.y = slot.y + shift;
                }
                (card as any)._channelCardIndex = j;
                card.opacity = j === this.selectedChannelIndex ? 255 : 180;
                this.applyChannelCardImage(card, this.channelList[j], version);
            } else {
                (card as any)._channelCardIndex = -1;
                this.restoreChannelCardDefaultSprite(card);
            }
        }
        const selected = this.channelCardNodes[this.selectedChannelIndex];
        if (selected && this.channelSelectedIcon) {
            this.channelSelectedIcon.active = true;
            this.channelSelectedIcon.x = selected.x + this.selectedChannelIconOffsetX;
            this.channelSelectedIcon.y = selected.y + this.selectedChannelIconOffsetY;
            this.channelSelectedIcon.setSiblingIndex(this.channelSelectedIcon.parent!.childrenCount - 1);
        } else if (this.channelSelectedIcon) {
            this.channelSelectedIcon.active = false;
        }
        if (selected && this.channelSelectOverlay) {
            this.channelSelectOverlay.active = true;
            this.channelSelectOverlay.x = selected.x + this.channelSelectOverlayOffsetX;
            this.channelSelectOverlay.y = selected.y + this.channelSelectOverlayOffsetY;
            this.channelSelectOverlay.setSiblingIndex(this.channelSelectOverlay.parent!.childrenCount - 1);
            if (this.channelSelectedIcon && this.channelSelectedIcon.active) {
                this.channelSelectedIcon.setSiblingIndex(this.channelSelectOverlay.parent!.childrenCount - 1);
            }
        } else if (this.channelSelectOverlay) {
            this.channelSelectOverlay.active = false;
        }
    }

    seedInitialInputCache(): void {
        if (!this.initialBindInfo || this.channelList.length <= 0) {
            return;
        }
        for (let i = 0; i < this.channelList.length; i++) {
            const channel = this.channelList[i];
            if ((channel.channel || "") === (this.initialBindInfo.channel || "") &&
                (channel.sub_channel || "") === (this.initialBindInfo.sub_channel || "")) {
                const cache: any = {};
                const fields = channel.need_field || [];
                for (let j = 0; j < fields.length; j++) {
                    const field = fields[j];
                    if (field && field.field_value) {
                        const key = field.field_value;
                        let value = this.initialBindInfo[key];
                        if (value == null) {
                            if (key === "payee_name" || key === "name") {
                                value = this.initialBindInfo.payee_name || this.initialBindInfo.name || "";
                            } else if (key === "account") {
                                value = this.initialBindInfo.account || this.initialBindInfo.phone || this.initialBindInfo.email || "";
                            }
                        }
                        cache[key] = value == null ? "" : String(value);
                    }
                }
                this.channelInputCache[this.getChannelCacheKey(channel)] = cache;
                this.selectedChannelIndex = i;
                break;
            }
        }
    }

    getCurrentChannel(): any {
        return this.channelList[this.selectedChannelIndex] || null;
    }

    getChannelCacheKey(channel: any): string {
        return channel ? [channel.channel || "", channel.sub_channel || "", channel.show_channel || channel.name || ""].join("|") : "__default__";
    }

    saveCurrentInputCache(): void {
        const channel = this.getCurrentChannel();
        if (channel) {
            const data = this.collectCurrentInputData(false);
            if (data) {
                this.channelInputCache[this.getChannelCacheKey(channel)] = data;
            }
        }
    }

    saveInputCacheByData(channel: any, data: any): void {
        if (channel && data) {
            this.channelInputCache[this.getChannelCacheKey(channel)] = data;
        }
    }

    restoreInputCache(channel: any): void {
        const cache = this.channelInputCache[this.getChannelCacheKey(channel)] || {};
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            if (row && row.editBox && row.field) {
                const key = row.field.field_value;
                row.editBox.string = cache[key] || "";
            }
        }
    }

    clearExtraFieldRows(): void {
        while (this.extraFieldRows.length > 0) {
            const row = this.extraFieldRows.pop()!;
            this.unbindFieldRowInputEvents(row);
            row.labelNode?.destroy();
            row.inputNode?.destroy();
            row.bgNode?.destroy();
        }
    }

    ensureFieldRowCount(count: number): void {
        const target = Math.max(1, count || 0);
        while (this.baseFieldRows.length + this.extraFieldRows.length < target) {
            const index = this.baseFieldRows.length + this.extraFieldRows.length;
            const row = this.createFieldRowFromTemplate(index);
            if (!row) {
                break;
            }
            this.extraFieldRows.push(row);
        }
        while (this.baseFieldRows.length + this.extraFieldRows.length > target && this.extraFieldRows.length > 0) {
            const row = this.extraFieldRows.pop()!;
            this.unbindFieldRowInputEvents(row);
            row.labelNode?.destroy();
            row.inputNode?.destroy();
            row.bgNode?.destroy();
        }
        const allRows = this.baseFieldRows.concat(this.extraFieldRows);
        this.activeFieldRows = [];
        for (let i = 0; i < allRows.length; i++) {
            const visible = i < target;
            if (allRows[i].labelNode) {
                allRows[i].labelNode!.active = visible;
            }
            if (allRows[i].inputNode) {
                allRows[i].inputNode!.active = visible;
            }
            if (allRows[i].bgNode) {
                allRows[i].bgNode!.active = visible;
            }
            if (visible) {
                this.activeFieldRows.push(allRows[i]);
            }
        }
    }

    updateFieldRows(channel: any): void {
        this.ensureFieldRowCount(this.currentFields.length);
        this.adjustPanelForFieldCount(this.activeFieldRows.length);
        const shift = this._currentPanelShift || 0;
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            const field = this.currentFields[i];
            if (field) {
                row.field = field;
                if (row.labelNode) {
                    row.labelNode.x = this.baseLabelX;
                    row.labelNode.y = this.baseLabelY + shift - this.rowGap * i;
                }
                if (row.inputNode) {
                    row.inputNode.x = this.baseInputX;
                    row.inputNode.y = this.baseInputY + shift - this.rowGap * i;
                }
                if (row.bgNode) {
                    row.bgNode.x = this.baseBgX;
                    row.bgNode.y = this.baseBgY + shift - this.rowGap * i;
                }
                this.updateFieldRowDisplay(row, field, channel);
            }
        }
        const offset = this.rowGap * Math.max(0, this.activeFieldRows.length - this.baseFieldRowCount);
        if (this.btnSubmit) {
            this.btnSubmit.y = this.baseSubmitY + shift - offset;
        }
    }

    adjustPanelForFieldCount(count: number): void {
        if (!this.panelNode) {
            return;
        }
        const extraHeight = Math.max(0, count - this.baseFieldRowCount) * this.rowGap;
        const newHeight = this._basePanelHeight + extraHeight;
        const shift = extraHeight * (1 - this._basePanelAnchorY);
        const delta = shift - (this._currentPanelShift || 0);
        if (Math.abs(delta) < 0.01 && Math.abs(this.panelNode.height - newHeight) < 1) {
            return;
        }
        if (!this._panelWidget) {
            this._panelWidget = this.panelNode.getComponent(cc.Widget);
        }
        if (this._panelWidget && this._panelWidget.enabled) {
            this._panelWidget.enabled = false;
        }
        this.panelNode.height = newHeight;
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

    updateFieldRowDisplay(row: FieldRow, field: any, channel: any): void {
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

    resolveFieldLabel(field: any): string {
        return (field && (field.field_desc || field.field_value_translate || field.field_value)) || "";
    }

    applyFieldInputMode(editBox: cc.EditBox, field: any, channel: any): void {
        if (!editBox) {
            return;
        }
        const InputMode = cc.EditBox && cc.EditBox.InputMode ? cc.EditBox.InputMode : null;
        const fieldKey = field && field.field_value ? String(field.field_value).toLowerCase() : "";
        let accountType = channel && channel.account_type;
        if (Array.isArray(accountType)) {
            accountType = accountType[0];
        }
        accountType = (accountType || "").toString().toLowerCase();
        const isPhone = fieldKey.indexOf("phone") !== -1 || (fieldKey === "account" && accountType === "phone");
        const isEmail = fieldKey.indexOf("email") !== -1 || (fieldKey === "account" && accountType === "email");
        if (isPhone) {
            editBox.inputMode = InputMode && InputMode.PHONE_NUMBER !== undefined ? InputMode.PHONE_NUMBER : 3;
        } else if (isEmail) {
            editBox.inputMode = InputMode && InputMode.EMAIL_ADDR !== undefined ? InputMode.EMAIL_ADDR : 1;
        } else {
            editBox.inputMode = InputMode && InputMode.SINGLE_LINE !== undefined ? InputMode.SINGLE_LINE : 6;
        }
    }

    refreshUI(): void {
        this.refreshChannelCards();
        const channel = this.getCurrentChannel();
        if (channel) {
            if (this.lblTitle) {
                this.lblTitle.string = channel.title || this.i18n("key_cash_set_title", null, "Enter Account Details");
            }
            if (this.lblSelectInfo) {
                this.lblSelectInfo.string = this.i18n("key_cash_set_select_account_info", null, "Select account information");
            }
            if (this.lblSubmitBtn) {
                this.lblSubmitBtn.string = this.i18n("key_cash_set_submit_btn", null, "Submit");
            }
            this.currentFields = channel.need_field && channel.need_field.length > 0
                ? channel.need_field
                : this.getDefaultNeedFields(channel);
            this.updateFieldRows(channel);
            this.restoreInputCache(channel);
        }
    }

    collectCurrentInputData(validate: boolean): any | null {
        const result: any = {};
        for (let i = 0; i < this.activeFieldRows.length; i++) {
            const row = this.activeFieldRows[i];
            if (row && row.field && row.editBox) {
                const key = row.field.field_value;
                let value = (row.editBox.string || "").trim();
                if (validate && !value) {
                    this.showToast(this.resolveFieldLabel(row.field) || this.i18n("key_cash_set_required_fields", null, "Please complete required fields"));
                    return null;
                }
                result[key] = value;
            }
        }
        return result;
    }

    parseCheckInfo(res: any): any {
        if (!res || !res.data) {
            return {};
        }
        const checkInfo = res.data.check_info;
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

    isCheckPass(value: any): boolean {
        return value === true || value === 1 || value === "1" || value === "true";
    }

    findFirstFailedField(checkInfo: any): any | null {
        const fields = this.currentFields || [];
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            if (field && field.field_value && Object.prototype.hasOwnProperty.call(checkInfo, field.field_value) &&
                !this.isCheckPass(checkInfo[field.field_value])) {
                return field;
            }
        }
        return null;
    }

    onClickSubmit(): void {
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
        const payload = { channel: channel.channel || "", sub_channel: channel.sub_channel || "", info: inputData };
        const verify = LoadingHttpService.verifyWithdrawBindInfo;
        if (typeof verify !== "function") {
            this.isSubmitting = false;
            cc.warn("[cashArrowSetView] verifyWithdrawBindInfo is undefined");
            this.showToast(this.i18n("key_common_network_unavailable", null, "Network unavailable"));
            return;
        }
        const retry = () => {
            this.isSubmitting = false;
            this.onClickSubmit();
        };
        verify.call(
            LoadingHttpService,
            payload,
            Handler.create(this, (res: any) => {
                if (NetErrorPopupService.shouldPop(res)) {
                    cc.warn("[cashArrowSetView] verifyWithdrawBindInfo force-retry code=", res && res.code);
                    this.isSubmitting = false;
                    NetErrorPopupService.showAndRetry(retry);
                } else {
                    this.isSubmitting = false;
                    if (res && Number(res.code) === 1) {
                        const checkInfo = this.parseCheckInfo(res);
                        const failed = this.findFirstFailedField(checkInfo);
                        if (failed) {
                            this.showToast(failed.fail_desc || this.resolveFieldLabel(failed) || this.i18n("key_cash_set_validation_failed", null, "Validation failed"));
                        } else {
                            this.saveInputCacheByData(channel, inputData);
                            const bindInfo = this.buildBindInfo(channel, inputData);
                            this.onValidated?.(bindInfo);
                            UIMgr.getInstance().hide(this.node);
                        }
                    } else {
                        cc.warn("[cashArrowSetView] verify failed:", res && res.message);
                        this.showToast((res && res.message) || this.i18n("key_cash_set_validation_failed", null, "Validation failed"));
                    }
                }
            }),
            Handler.create(this, (err: any) => {
                if (NetErrorPopupService.shouldPop(err)) {
                    cc.warn("[cashArrowSetView] verifyWithdrawBindInfo 网络异常，弹重试窗 err=", err && err.message);
                    this.isSubmitting = false;
                    NetErrorPopupService.showAndRetry(retry);
                } else {
                    this.isSubmitting = false;
                    cc.warn("[cashArrowSetView] verify error:", err && err.message);
                    this.showToast((err && err.message) || this.i18n("key_common_network_error", null, "Network error"));
                }
            })
        );
    }

    buildBindInfo(channel: any, inputData: any): any {
        const info: any = {
            channel: channel.channel || "",
            sub_channel: channel.sub_channel || "",
            show_channel: channel.show_channel || "",
            need_field: channel.need_field || [],
            channel_pic: channel.channel_pic || "",
            tax_desc: channel.tax_desc || "",
        };
        for (const key in inputData) {
            if (Object.prototype.hasOwnProperty.call(inputData, key)) {
                info[key] = inputData[key];
            }
        }
        if (!info.payee_name && info.name) {
            info.payee_name = info.name;
        }
        if (!info.name && info.payee_name) {
            info.name = info.payee_name;
        }
        if (!info.account) {
            info.account = info.phone || info.email || "";
        }
        info._input_data = inputData;
        return info;
    }

    i18n(key: string, params: any, fallback: string): string {
        return LanguageService.t(key, params || [], fallback);
    }

    showToast(message: string): void {
        try {
            Tips.show(message);
        } catch (e) {
            cc.log("[cashArrowSetView] toast:", message);
        }
    }

    onClickClose(): void {
        this.onClose?.();
        UIMgr.getInstance().hide(this.node);
    }

    findNodeDeep(node: cc.Node | null, name: string): cc.Node | null {
        if (!node) {
            return null;
        }
        if (node.name === name) {
            return node;
        }
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findNodeDeep(node.children[i], name);
            if (found) {
                return found;
            }
        }
        return null;
    }

    findLabelDeep(node: cc.Node, name: string): cc.Label | null {
        const found = this.findNodeDeep(node, name);
        return found ? found.getComponent(cc.Label) : null;
    }
}
