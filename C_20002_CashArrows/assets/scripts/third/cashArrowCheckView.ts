import UIMgr from "./UIMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import Tips from "./Tips";

const { ccclass } = cc._decorator;

const s = [{
    field_value: " account ",
    field_value_translate: " account ",
    field_desc: " account ",
    fail_desc: " account "
}, {
    field_value: " payee_name ",
    field_value_translate: " name ",
    field_desc: " name ",
    fail_desc: " name "
}];

@ccclass
export default class cashArrowCheckView extends cc.Component {
    selectedOpt: any = null;
    channelData: any = null;
    bindInfo: any = null;
    onRevise: ((info: any) => void) | null = null;
    onWithdraw: ((info: any, opt: any, done: () => void) => boolean | void) | null = null;
    onClose: (() => void) | null = null;
    isSubmitting = !1;
    channelPreviewLoadVersion = 0;
    channelPreviewFrameCache: any = {};
    fieldDisplayRows: cc.Node[] = [];
    fieldValueRows: cc.Node[] = [];
    extraFieldRows: cc.Node[] = [];
    btnClose: cc.Node = null;
    btnWithdraw: cc.Node = null;
    btnRevise: cc.Node = null;
    panelNode: cc.Node = null;
    infoNode: cc.Node = null;
    maskNode: cc.Node = null;
    lblTitle: cc.Label = null;
    lblWithdrawBtn: cc.Label = null;
    fieldLabelTemplateA: cc.Node = null;
    fieldLabelTemplateB: cc.Node = null;
    fieldValueNodeA: cc.Node = null;
    fieldValueNodeB: cc.Node = null;
    channelPreviewNode: cc.Node = null;
    channelPreviewSprite: cc.Sprite = null;
    defaultChannelPreviewFrame: cc.SpriteFrame = null;
    baseRowCount = 0;
    fieldTitleRowGap = -116;
    fieldValueOffset = -60;

    onLoad() {
        this.selectedOpt = null;
        this.channelData = null;
        this.bindInfo = null;
        this.onRevise = null;
        this.onWithdraw = null;
        this.onClose = null;
        this.isSubmitting = !1;
        this.channelPreviewLoadVersion = 0;
        this.channelPreviewFrameCache = {};
        this.fieldDisplayRows = [];
        this.fieldValueRows = [];
        this.extraFieldRows = [];
        this.bindNodes();
        this.bindEvents();
        this.bindLanguageEvent();
    }

    onDestroy() {
        this.unbindLanguageEvent();
        this.unbindEvents();
        this.clearExtraFieldRows();
        this.channelPreviewLoadVersion += 1;
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged() {
        this.refreshUI();
    }

    setEntryData(e: any) {
        if (e) {
            this.selectedOpt = e.selectedOpt || null;
            this.channelData = e.channelData || null;
            this.bindInfo = e.bindInfo || null;
            !this.bindInfo && Array.isArray(e.txBindInfo) && e.txBindInfo.length > 0 && (this.bindInfo = e.txBindInfo[0]);
            this.onRevise = " function " == typeof e.onRevise ? e.onRevise : null;
            this.onWithdraw = " function " == typeof e.onWithdraw ? e.onWithdraw : null;
            this.onClose = " function " == typeof e.onClose ? e.onClose : null;
            this.refreshUI();
        }
    }

    bindNodes() {
        this.btnClose = this.findNodeDeep(this.node, " btn_close ");
        this.btnWithdraw = this.findNodeDeep(this.node, " btn_withdraw ");
        this.btnRevise = this.findNodeDeep(this.node, " btn_revise ");
        this.panelNode = this.findNodeDeep(this.node, " block_panel ") || this.findNodeDeep(this.node, " panel ");
        this.infoNode = this.findNodeDeep(this.node, " info ");
        this.maskNode = this.findNodeDeep(this.node, " mask ");
        this.lblTitle = this.findLabelDeep(this.node, " txt_enter_account_details ");
        this.lblWithdrawBtn = this.findLabelDeep(this.node, " txt_withdraw_btn ");
        this.fieldLabelTemplateA = this.findNodeDeep(this.node, " txt_input_account ");
        this.fieldLabelTemplateB = this.findNodeDeep(this.node, " txt_input_username ");
        this.fieldValueNodeA = this.findNodeDeep(this.node, " txt_account_value ");
        this.fieldValueNodeB = this.findNodeDeep(this.node, " txt_username_value ");
        this.channelPreviewNode = this.findNodeDeep(this.node, " img_channel_preview ") || this.btnRevise;
        this.channelPreviewSprite = this.channelPreviewNode ? this.channelPreviewNode.getComponent(cc.Sprite) : null;
        this.defaultChannelPreviewFrame = this.channelPreviewSprite ? this.channelPreviewSprite.spriteFrame : null;
        this.fieldDisplayRows = [];
        this.fieldValueRows = [];
        this.fieldLabelTemplateA && this.fieldDisplayRows.push(this.fieldLabelTemplateA);
        this.fieldValueNodeA && this.fieldValueRows.push(this.fieldValueNodeA);
        this.fieldLabelTemplateB && this.fieldDisplayRows.push(this.fieldLabelTemplateB);
        this.fieldValueNodeB && this.fieldValueRows.push(this.fieldValueNodeB);
        this.baseRowCount = this.fieldDisplayRows.length;
        this.fieldTitleRowGap = this.fieldLabelTemplateB && this.fieldLabelTemplateA ? this.fieldLabelTemplateB.y - this.fieldLabelTemplateA.y : -116;
        this.fieldValueOffset = this.fieldValueNodeA && this.fieldLabelTemplateA ? this.fieldValueNodeA.y - this.fieldLabelTemplateA.y : -60;
    }

    clearExtraFieldRows() {
        for (; this.extraFieldRows.length > 0;) {
            var e = this.extraFieldRows.pop();
            e && e.destroy();
        }
    }

    bindEvents() {
        this.btnClose && this.btnClose.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnWithdraw && this.btnWithdraw.on(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
        this.btnRevise && this.btnRevise.on(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
        this.maskNode && this.maskNode.on(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    unbindEvents() {
        this.btnClose && this.btnClose.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
        this.btnWithdraw && this.btnWithdraw.off(cc.Node.EventType.TOUCH_END, this.onClickWithdraw, this);
        this.btnRevise && this.btnRevise.off(cc.Node.EventType.TOUCH_END, this.onClickRevise, this);
        this.maskNode && this.maskNode.off(cc.Node.EventType.TOUCH_END, this.onClickClose, this);
    }

    refreshUI() {
        var e = this.bindInfo;
        if (e) {
            this.lblTitle && (this.lblTitle.string = this.i18n(" key_cash_check_title ", null, " Confirm Withdrawal Information "));
            this.lblWithdrawBtn && (this.lblWithdrawBtn.string = this.i18n(" key_cash_check_withdraw_btn ", null, " 提现 "));
            this.btnRevise && (this.btnRevise.active = !!this.onRevise);
            this.refreshFieldDisplay(e);
            this.refreshChannelPreview(e);
        }
    }

    refreshFieldDisplay(e: any) {
        var t = this.resolveDisplayFields(e);
        this.ensureDisplayRows(t.length);
        for (var i = 0; i < this.fieldDisplayRows.length; i++) {
            var n = this.fieldDisplayRows[i], a = this.fieldValueRows[i];
            if (n) {
                var o = i < t.length;
                n.active = o;
                a && (a.active = o);
                if (o) {
                    var r = t[i], s = n.getComponent(cc.Label);
                    if (s) {
                        var l = this.resolveFieldDisplayTitle(r), c = this.resolveFieldValue(e, r.field_value), u = a ? a.getComponent(cc.Label) : null;
                        if (u) {
                            s.string = l;
                            u.string = c;
                        } else s.string = l + ": " + c;
                    }
                }
            }
        }
    }

    resolveFieldDisplayTitle(e: any) {
        var t = e && (e.field_value_translate || e.field_desc || e.field_value) || " ", i = String(t || " ").toLowerCase();
        return " account " === i ? this.i18n(" key_cash_field_account ", null, " Account ") : " name " === i || " payee_name " === i ? this.i18n(" key_cash_field_name ", null, " Name ") : t;
    }

    resolveDisplayFields(e: any) {
        if (!e) return s;
        var t = e.need_field;
        if (Array.isArray(t) && t.length > 0) return t;
        for (var i = this.extractChannelList(this.channelData), n = 0; n < i.length; n++) {
            var a = i[n] || {};
            if ((a.channel || " ") === (e.channel || " ") && (a.sub_channel || " ") === (e.sub_channel || " ") && Array.isArray(a.need_field) && a.need_field.length > 0) return a.need_field;
        }
        return s;
    }

    extractChannelList(e: any) {
        if (!e) return [];
        if (Array.isArray(e)) return e.filter(Boolean);
        var t = e.channel_list || e.c_l || e.channels || e.list || [];
        if (Array.isArray(t)) return t.filter(Boolean);
        if (e.data) {
            var i = e.data;
            t = i.channel_list || i.c_l || i.channels || i.list || [];
            if (Array.isArray(t)) return t.filter(Boolean);
        }
        return [];
    }

    refreshChannelPreview(e: any) {
        if (this.channelPreviewSprite) {
            this.channelPreviewLoadVersion += 1;
            var t = this.channelPreviewLoadVersion;
            this.channelPreviewSprite.spriteFrame = this.defaultChannelPreviewFrame || null;
            var i = this.resolveChannelPreviewUrl(e);
            if (i) {
                var n = this;
                this.loadRemoteChannelPreviewSpriteFrame(i, function (e) {
                    e && t === n.channelPreviewLoadVersion && n.channelPreviewSprite && n.channelPreviewSprite.isValid && (n.channelPreviewSprite.spriteFrame = e);
                });
            }
        }
    }

    resolveChannelPreviewUrl(e: any) {
        var t = e && e.channel_pic ? String(e.channel_pic).trim() : " ";
        if (t) return t;
        for (var i = this.extractChannelList(this.channelData), n = 0; n < i.length; n++) {
            var a = i[n] || {};
            if ((a.channel || " ") === (e && e.channel || " ") && (a.sub_channel || " ") === (e && e.sub_channel || " ")) {
                var o = a.channel_pic ? String(a.channel_pic).trim() : " ";
                if (o) return o;
            }
        }
        return " ";
    }

    loadRemoteChannelPreviewSpriteFrame(e: string, t: (frame: cc.SpriteFrame | null) => void) {
        if (e) if (this.channelPreviewFrameCache[e]) t && t(this.channelPreviewFrameCache[e]); else {
            var i = this;
            cc.assetManager.loadRemote(e, function (n, a) {
                if (cc.isValid(i) && i.channelPreviewFrameCache) if (!n && a) {
                    var o: cc.SpriteFrame = null;
                    a instanceof cc.SpriteFrame ? o = a : a instanceof cc.Texture2D ? o = new cc.SpriteFrame(a) : (a as any)._texture instanceof cc.Texture2D && (o = new cc.SpriteFrame((a as any)._texture));
                    if (o) {
                        i.channelPreviewFrameCache[e] = o;
                        t && t(o);
                    } else t && t(null);
                } else {
                    cc.warn("[cashArrowCheckView] load channel preview failed: ", e, n);
                    t && t(null);
                }
            });
        } else t && t(null);
    }

    ensureDisplayRows(e: number) {
        for (var t = Math.max(1, e || 0); this.fieldDisplayRows.length < t;) {
            var i = this.fieldLabelTemplateB || this.fieldLabelTemplateA, n = this.fieldValueNodeB || this.fieldValueNodeA;
            if (!i || !n || !this.infoNode) break;
            var a = this.fieldDisplayRows.length, o = this.fieldDisplayRows[a - 1] || this.fieldLabelTemplateB || this.fieldLabelTemplateA, r = cc.instantiate(i), s = cc.instantiate(n);
            r.name = " txt_dynamic_confirm_field_title_ " + a;
            s.name = " txt_dynamic_confirm_field_value_ " + a;
            o && (r.y = o.y + this.fieldTitleRowGap);
            s.y = r.y + this.fieldValueOffset;
            this.infoNode.addChild(r);
            this.infoNode.addChild(s);
            this.fieldDisplayRows.push(r);
            this.fieldValueRows.push(s);
            this.extraFieldRows.push(r);
            this.extraFieldRows.push(s);
        }
    }

    resolveFieldValue(e: any, t: string) {
        if (!e || !t) return " ";
        var i = e[t];
        return null != i && " " !== i ? " account " === t ? this.maskAccount(String(i)) : String(i) : " name " === t || " payee_name " === t ? e.payee_name || e.name || " " : " account " === t ? this.maskAccount(e.account || e.phone || e.email || " ") : " ";
    }

    resolveRawFieldValue(e: any, t: string) {
        if (!e || !t) return " ";
        var i = e[t];
        return null != i && " " !== i ? String(i) : " name " === t || " payee_name " === t ? e.payee_name || e.name || " " : " account " === t && (e.account || e.phone || e.email) || " ";
    }

    maskAccount(e: string) {
        if (!e) return " ";
        if ((e = String(e)).length <= 4) return e;
        for (var t = e.substring(0, 2), i = e.substring(e.length - 2), n = " ", a = 0; a < e.length - 4; a++) n += "* ";
        return t + n + i;
    }

    onClickRevise() {
        if (this.bindInfo && this.onRevise) {
            this.onRevise(this.bindInfo);
            UIMgr.getInstance().hide(this.node);
        }
    }

    onClickWithdraw() {
        if (!this.isSubmitting) if (this.selectedOpt) {
            var e = this.bindInfo;
            if (e) if (this.onWithdraw) {
                this.isSubmitting = !0;
                UIMgr.getInstance().hide(this.node);
                var t = this;
                try {
                    !1 === this.onWithdraw(e, this.selectedOpt, function () {
                        t.isSubmitting = !1;
                    }) && (this.isSubmitting = !1);
                } catch (e) {
                    this.isSubmitting = !1;
                    cc.warn("[cashArrowCheckView] onWithdraw error: ", e && (e as any).message);
                    this.showToast(this.i18n(" key_common_network_error ", null, " Network error "));
                }
            } else cc.warn("[cashArrowCheckView] onWithdraw callback missing "); else cc.warn("[cashArrowCheckView] no bind info ");
        } else cc.warn("[cashArrowCheckView] no selectedOpt ");
    }

    i18n(e: string, t: any, i: string) {
        return LanguageService.t(e, t || [], i);
    }

    showToast(t: string) {
        try {
            Tips.show(t);
        } catch (e) {
            cc.log("[cashArrowCheckView] toast: ", t);
        }
    }

    onClickClose() {
        this.onClose && this.onClose();
        UIMgr.getInstance().hide(this.node);
    }

    findNodeDeep(e: cc.Node, t: string) {
        if (!e) return null;
        if (e.name === t) return e;
        for (var i = 0; i < e.childrenCount; i++) {
            var n = this.findNodeDeep(e.children[i], t);
            if (n) return n;
        }
        return null;
    }

    findLabelDeep(e: cc.Node, t: string) {
        var i = this.findNodeDeep(e, t);
        return i && i.getComponent(cc.Label) || null;
    }
}
