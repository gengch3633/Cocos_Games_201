import Polyglot from "./polyglot.min";

let polyglot = null;

function loadLanguage(lang) {
    return (window as any).i18n.languages[lang];
}

function applyPhrases(phrases) {
    if (phrases) {
        if (polyglot) {
            polyglot.replace(phrases);
        } else {
            polyglot = new Polyglot({
                phrases: phrases,
                allowMissing: true
            });
        }
    }
}

(window as any).i18n = {
    languages: {},
    curLang: "",
    init: function (lang) {
        if (lang !== this.curLang) {
            const data = loadLanguage(lang) || {};
            this.curLang = lang;
            applyPhrases(data);
            this.inst = polyglot;
        }
    },
    t: function (key, params) {
        let text = "";
        if (polyglot) {
            text = polyglot.t(key, params);
        }
        if (!text) {
            text = "";
        }
        return text;
    },
    inst: polyglot,
    updateSceneRenderers: function () {
        const children = cc.director.getScene().children;
        const labels = [];
        for (let i = 0; i < children.length; ++i) {
            const comps = children[i].getComponentsInChildren("LocalizedLabel");
            Array.prototype.push.apply(labels, comps);
        }
        for (let i = 0; i < labels.length; ++i) {
            const label = labels[i];
            if (label.node.active) {
                label.updateLabel();
            }
        }
        const sprites = [];
        for (let i = 0; i < children.length; ++i) {
            const comps = children[i].getComponentsInChildren("LocalizedSprite");
            Array.prototype.push.apply(sprites, comps);
        }
        for (let i = 0; i < sprites.length; ++i) {
            const sprite = sprites[i];
            if (sprite.node.active) {
                sprite.updateSprite(this.curLang);
            }
        }
    }
};

export {};
