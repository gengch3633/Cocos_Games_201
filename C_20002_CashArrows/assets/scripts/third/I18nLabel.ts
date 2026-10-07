import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLFontService from "./RTLFontService";

const { ccclass, property, executeInEditMode } = cc._decorator;

const LOCALE_TO_FONT: { [key: string]: string } = {
    "bn-BD": "bn"
};

@ccclass
@executeInEditMode
export default class I18nLabel extends cc.Component {
    @property({ tooltip: "i18n key, e.g. key_withdraw_page_title" })
    i18nKey: string = "";

    @property({ tooltip: "fallback text when key missing" })
    fallback: string = "";

    @property({
        tooltip: 'params as JSON array or split with |, e.g. ["A","B"] or A|B'
    })
    paramsText: string = "";

    @property({
        tooltip: "editor preview language: zh-CN / en-US / id-ID / pt-BR / es-ES / bn-BD, empty means current language"
    })
    previewLanguage: string = "";

    @property({ type: cc.Label })
    targetLabel: cc.Label = null;

    @property({ type: cc.RichText })
    targetRichText: cc.RichText = null;

    _originalFont?: cc.Font;
    _originalUseSystemFont?: boolean;
    _customFontApplied = false;

    onLoad(): void {
        if (!this.targetLabel) {
            this.targetLabel = this.node.getComponent(cc.Label);
        }
        if (!this.targetRichText) {
            this.targetRichText = this.node.getComponent(cc.RichText);
        }
        this.bindLanguageEvent();
        this.refreshText();
    }

    onEnable(): void {
        this.refreshText();
    }

    onValidate(): void {
        this.refreshText();
    }

    onDestroy(): void {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged(): void {
        this.refreshText();
    }

    setI18nKey(key: string, params?: any[], fallback?: string): void {
        this.i18nKey = key || "";
        if (fallback !== undefined) {
            this.fallback = fallback || "";
        }
        if (params && params.push) {
            this.paramsText = JSON.stringify(params);
        }
        this.refreshText();
    }

    refreshText(): void {
        const key = String(this.i18nKey || "").trim();
        if (!key) {
            return;
        }
        const params = this.parseParams(this.paramsText);
        const locale = this.getPreviewLanguage() || LanguageService.getCurrentLanguage();
        const text = LanguageService.tWithLanguage(locale, key, params, this.fallback || key);
        if (this.targetLabel) {
            this.targetLabel.string = text;
        }
        if (this.targetRichText) {
            this.targetRichText.string = text;
        }
        this.applyNonLatinFont(LOCALE_TO_FONT[locale]);
    }

    applyNonLatinFont(fontLocale?: string): void {
        if (!this.targetLabel) {
            return;
        }
        if (this._originalFont === undefined && this._originalUseSystemFont === undefined) {
            this._originalFont = this.targetLabel.font || null;
            this._originalUseSystemFont = !!this.targetLabel.useSystemFont;
        }
        if (fontLocale) {
            const font = RTLFontService.getFont(fontLocale);
            if (font) {
                this.targetLabel.useSystemFont = false;
                this.targetLabel.font = font;
                this._customFontApplied = true;
            } else if (!RTLFontService.isFailed(fontLocale)) {
                const self = this;
                RTLFontService.ensureFont(fontLocale, (loadedFont) => {
                    if (loadedFont && self.isValid && self.targetLabel) {
                        const currentLocale = self.getPreviewLanguage() || LanguageService.getCurrentLanguage();
                        if (LOCALE_TO_FONT[currentLocale] === fontLocale) {
                            self.targetLabel.useSystemFont = false;
                            self.targetLabel.font = loadedFont;
                            self._customFontApplied = true;
                        }
                    }
                });
            }
        } else if (this._customFontApplied) {
            this.targetLabel.useSystemFont = this._originalUseSystemFont;
            this.targetLabel.font = this._originalFont;
            this._customFontApplied = false;
        }
    }

    getPreviewLanguage(): string {
        if (!cc.engine || !cc.engine.isEditor) {
            return "";
        }
        const preview = String(this.previewLanguage || "").trim();
        return preview && LanguageService.hasLanguage(preview) ? preview : "";
    }

    parseParams(text: string): any[] {
        const raw = String(text || "").trim();
        if (!raw) {
            return [];
        }
        if (raw.charAt(0) === "[") {
            try {
                const parsed = JSON.parse(raw);
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
