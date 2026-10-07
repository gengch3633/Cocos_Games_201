const Polyglot = require("./polyglot.min");

let polyglotInst: any = null;

function getLanguageData(lang: string): any {
    return (window as any).i18n.languages[lang];
}

function initPolyglot(phrases: any): void {
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

(window as any).i18n = {
    languages: {},
    curLang: "",
    init(lang: string): void {
        if (lang !== this.curLang) {
            const phrases = getLanguageData(lang) || {};
            this.curLang = lang;
            initPolyglot(phrases);
            this.inst = polyglotInst;
        }
    },
    t(key: string, options?: any): string {
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
        const labels: any[] = [];
        for (let i = 0; i < sceneChildren.length; ++i) {
            const components = sceneChildren[i].getComponentsInChildren("LocalizedLabel");
            Array.prototype.push.apply(labels, components);
        }
        for (let i = 0; i < labels.length; ++i) {
            const label = labels[i];
            if (label.node.active) {
                label.updateLabel();
            }
        }
        const sprites: any[] = [];
        for (let i = 0; i < sceneChildren.length; ++i) {
            const components = sceneChildren[i].getComponentsInChildren("LocalizedSprite");
            Array.prototype.push.apply(sprites, components);
        }
        for (let i = 0; i < sprites.length; ++i) {
            const sprite = sprites[i];
            if (sprite.node.active) {
                sprite.updateSprite(this.curLang);
            }
        }
    },
};
