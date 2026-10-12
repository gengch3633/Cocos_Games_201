import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService.js";
import RTLFontService from "./RTLFontService.js";

const { ccclass, property, executeInEditMode } = cc._decorator;

const LANG_FONT_MAP: { [lang: string]: string } = {
    "bn-BD": "bn"
};

@ccclass
@executeInEditMode
export default class I18nLabel extends cc.Component {

    @property({
        tooltip: "i18n key, e.g. key_withdraw_page_title"
    })
    public i18nKey: string = "";

    @property({
        tooltip: "fallback text when key missing"
    })
    public fallback: string = "";

    @property({
        tooltip: 'params as JSON array or split with |, e.g. ["A","B"] or A|B'
    })
    public paramsText: string = "";

    @property({
        tooltip: "editor preview language: zh-CN / en-US / id-ID / pt-BR / es-ES / bn-BD, empty means current language"
    })
    public previewLanguage: string = "";

    @property(cc.Label)
    public targetLabel: cc.Label = null;

    @property(cc.RichText)
    public targetRichText: cc.RichText = null;

    private _originalFont?: cc.Font | null;
    private _originalUseSystemFont: boolean = false;
    private _customFontApplied: boolean = false;

    protected onLoad(): void {
        if (!this.targetLabel) {
            this.targetLabel = this.node.getComponent(cc.Label);
        }
        if (!this.targetRichText) {
            this.targetRichText = this.node.getComponent(cc.RichText);
        }
        this.bindLanguageEvent();
        this.refreshText();
    }

    protected onEnable(): void {
        this.refreshText();
    }

    protected onValidate(): void {
        this.refreshText();
    }

    protected onDestroy(): void {
        this.unbindLanguageEvent();
    }

    private bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    private onLanguageChanged(): void {
        this.refreshText();
    }

    public setI18nKey(key: string, params?: string[], fallback?: string): void {
        this.i18nKey = key || "";
        if (fallback !== undefined) {
            this.fallback = fallback || "";
        }
        if (Array.isArray(params)) {
            this.paramsText = JSON.stringify(params);
        }
        this.refreshText();
    }

    public refreshText(): void {
        const key = String(this.i18nKey || "").trim();
        if (!key) {
            return;
        }
        const params = this.parseParams(this.paramsText);
        const lang = this.getPreviewLanguage() || LanguageService.getCurrentLanguage();
        const text = LanguageService.tWithLanguage(lang, key, params, this.fallback || key);
        if (this.targetLabel) {
            this.targetLabel.string = text;
        }
        if (this.targetRichText) {
            this.targetRichText.string = text;
        }
        this.applyNonLatinFont(LANG_FONT_MAP[lang]);
    }

    private applyNonLatinFont(fontKey: string): void {
        if (!this.targetLabel) {
            return;
        }
        if (this._originalFont === undefined) {
            this._originalFont = this.targetLabel.font || null;
            this._originalUseSystemFont = !!this.targetLabel.useSystemFont;
        }
        if (fontKey) {
            const font = RTLFontService.getFont(fontKey);
            if (font) {
                this.targetLabel.useSystemFont = false;
                this.targetLabel.font = font;
                this._customFontApplied = true;
            } else if (!RTLFontService.isFailed(fontKey)) {
                RTLFontService.ensureFont(fontKey, (loadedFont: cc.Font) => {
                    if (!loadedFont || !this.isValid || !this.targetLabel) {
                        return;
                    }
                    const lang = this.getPreviewLanguage() || LanguageService.getCurrentLanguage();
                    if (LANG_FONT_MAP[lang] === fontKey) {
                        this.targetLabel.useSystemFont = false;
                        this.targetLabel.font = loadedFont;
                        this._customFontApplied = true;
                    }
                });
            }
        } else if (this._customFontApplied) {
            this.targetLabel.useSystemFont = this._originalUseSystemFont;
            this.targetLabel.font = (this._originalFont || null) as cc.Font;
            this._customFontApplied = false;
        }
    }

    private getPreviewLanguage(): string {
        if (!cc.engine || !(cc.engine as any).isEditor) {
            return "";
        }
        const lang = String(this.previewLanguage || "").trim();
        return lang && LanguageService.hasLanguage(lang) ? lang : "";
    }

    private parseParams(text: string): string[] {
        const raw = String(text || "").trim();
        if (!raw) {
            return [];
        }
        if (raw.charAt(0) === "[") {
            try {
                const parsed = JSON.parse(raw) as any;
                return parsed && parsed.push ? parsed : [];
            } catch (err) {
                cc.warn("[I18nLabel] paramsText JSON parse failed:", raw);
            }
        }
        const parts = raw.split("|");
        const result: string[] = [];
        for (let i = 0; i < parts.length; i++) {
            result.push(String(parts[i] || "").trim());
        }
        return result;
    }
}