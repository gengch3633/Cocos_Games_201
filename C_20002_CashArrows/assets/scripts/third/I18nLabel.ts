import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import RTLFontService from "./RTLFontService";

const { ccclass, property, executeInEditMode } = cc._decorator;

const NON_LATIN_FONT_MAP: { [key: string]: string } = {
    "bn-BD": "bn",
};

@ccclass
@executeInEditMode
export default class I18nLabel extends cc.Component {
    @property({ tooltip: "i18n key, e.g. key_withdraw_page_title" })
    i18nKey = "";

    @property({ tooltip: "fallback text when key missing" })
    fallback = "";

    @property({ tooltip: 'params as JSON array or split with |, e.g. ["A","B"] or A|B' })
    paramsText = "";

    @property({ tooltip: "editor preview language: zh-CN / en-US / id-ID / pt-BR / es-ES / bn-BD, empty means current language" })
    previewLanguage = "";

    @property({ type: cc.Label })
    targetLabel: cc.Label | null = null;

    @property({ type: cc.RichText })
    targetRichText: cc.RichText | null = null;

    _originalFont: cc.Font | null = null;
    _originalUseSystemFont = false;
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
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
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
        const language = this.getPreviewLanguage() || LanguageService.getCurrentLanguage();
        const text = LanguageService.tWithLanguage(language, key, params, this.fallback || key);
        if (this.targetLabel) {
            this.targetLabel.string = text;
        }
        if (this.targetRichText) {
            this.targetRichText.string = text;
        }
        this.applyNonLatinFont(NON_LATIN_FONT_MAP[language]);
    }

    applyNonLatinFont(fontKey?: string): void {
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
                RTLFontService.ensureFont(fontKey, (loadedFont) => {
                    if (loadedFont && this.isValid && this.targetLabel) {
                        const language = this.getPreviewLanguage() || LanguageService.getCurrentLanguage();
                        if (NON_LATIN_FONT_MAP[language] === fontKey) {
                            this.targetLabel.useSystemFont = false;
                            this.targetLabel.font = loadedFont;
                            this._customFontApplied = true;
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
        if (!cc.engine || !(cc.engine as any).isEditor) {
            return "";
        }
        const language = String(this.previewLanguage || "").trim();
        return language && LanguageService.hasLanguage(language) ? language : "";
    }

    parseParams(text: string): string[] {
        const trimmed = String(text || "").trim();
        if (!trimmed) {
            return [];
        }
        if (trimmed.charAt(0) === "[") {
            try {
                const parsed = JSON.parse(trimmed);
                return parsed && parsed.push ? parsed : [];
            } catch (e) {
                cc.warn("[I18nLabel] paramsText JSON parse failed:", trimmed);
            }
        }
        const parts = trimmed.split("|");
        const result: string[] = [];
        for (let i = 0; i < parts.length; i++) {
            result.push(String(parts[i] || "").trim());
        }
        return result;
    }
}
