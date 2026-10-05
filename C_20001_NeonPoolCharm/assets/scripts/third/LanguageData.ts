const Polyglot = require("./polyglot.min");

interface I18nWindow {
    languages: Record<string, Record<string, string>>;
    curLang: string;
    init(lang: string): void;
    t(key: string, options?: Record<string, unknown>): string;
    inst: any;
    updateSceneRenderers(): void;
}

declare global {
    interface Window {
        i18n: I18nWindow;
    }
}

let polyglotInst: any = null;

function getLanguageData(lang: string): Record<string, string> {
    return window.i18n.languages[lang];
}

function loadPolyglot(phrases: Record<string, string>): void {
    if (phrases) {
        if (polyglotInst) {
            polyglotInst.replace(phrases);
        } else {
            polyglotInst = new Polyglot({
                phrases,
                allowMissing: true,
            });
        }
    }
}

window.i18n = {
    languages: {},
    curLang: "",
    init(lang: string): void {
        if (lang !== this.curLang) {
            const phrases = getLanguageData(lang) || {};
            this.curLang = lang;
            loadPolyglot(phrases);
            this.inst = polyglotInst;
        }
    },
    t(key: string, options?: Record<string, unknown>): string {
        let result = "";
        if (polyglotInst) {
            result = polyglotInst.t(key, options);
        }
        if (!result) {
            result = "";
        }
        return result;
    },
    inst: polyglotInst,
    updateSceneRenderers(): void {
        const sceneChildren = cc.director.getScene().children;
        const labels: cc.Component[] = [];
        for (let i = 0; i < sceneChildren.length; ++i) {
            const localizedLabels = sceneChildren[i].getComponentsInChildren("LocalizedLabel" as any);
            Array.prototype.push.apply(labels, localizedLabels);
        }
        for (let i = 0; i < labels.length; ++i) {
            const label = labels[i] as any;
            if (label.node.active) {
                label.updateLabel();
            }
        }
        const sprites: cc.Component[] = [];
        for (let i = 0; i < sceneChildren.length; ++i) {
            const localizedSprites = sceneChildren[i].getComponentsInChildren("LocalizedSprite" as any);
            Array.prototype.push.apply(sprites, localizedSprites);
        }
        for (let i = 0; i < sprites.length; ++i) {
            const sprite = sprites[i] as any;
            if (sprite.node.active) {
                sprite.updateSprite(this.curLang);
            }
        }
    },
};
