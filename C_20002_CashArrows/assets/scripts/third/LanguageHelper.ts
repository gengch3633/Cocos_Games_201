import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import SystemDataStore from "./SystemDataStore";

const SUPPORTED_LANGUAGES = [
    "CN", "BR", "PT", "ID", "US", "IN", "UK", "DE", "IT", "RU", "KR", "JP",
    "CA", "AU", "NZ", "FR", "MX", "AR", "ES", "PH", "MY", "TH", "SA", "EG",
    "ZA", "KE", "PK", "NG",
];

const FONT_MAP: { [key: string]: string } = {
    ID: "CommonFont",
    US: "CommonFont",
    BR: "CommonFont",
    PT: "CommonFont",
    UK: "in",
    CA: "in",
    AU: "in",
    MX: "in",
    PH: "in",
    RU: "in",
    DE: "in",
    IT: "in",
    FR: "in",
    IN: "in",
    TH: "th",
    ES: "in",
    AR: "in",
    MY: "in",
    ZA: "in",
    KE: "in",
    NG: "in",
    PK: "in",
    SA: "CommonFont",
    EG: "CommonFont",
    JP: "CommonFont",
};

class LanguageHelperImpl {
    languageType = BUSINESS_COMMON_CONFIG.defaultLanguage;
    languageFont: cc.Font | null = null;
    languageJson: any = null;
    languageDataMgr: any = null;

    init(language?: string, callback?: () => void): void {
        let type = language || BUSINESS_COMMON_CONFIG.defaultLanguage;
        if (!SUPPORTED_LANGUAGES.includes(type)) {
            type = BUSINESS_COMMON_CONFIG.defaultLanguage;
        }
        this.setType(type, callback);
    }

    setType(language: string, callback?: () => void): void {
        this.languageType = language;
        SystemDataStore.setLanguageType(language);
        try {
            cc.sys.localStorage.setItem("LANGUAGE", language);
        } catch (e) {
        }
        this.loadLang(language, () => {
            callback && callback();
        });
    }

    loadLang(language: string, callback?: () => void): void {
        if (this.languageDataMgr) {
            this.languageJson = this.languageDataMgr.getLanguageDataByType(language);
        }
        this.loadFont(language, callback);
    }

    loadFont(language: string, callback?: () => void): void {
        const fontPath = "BPR_font/BPR_" + (FONT_MAP[language] || "CommonFont");
        const done = () => {
            callback && callback();
        };
        const onLoaded = (err: Error | null, font?: cc.Font) => {
            if (err) {
                console.warn("[LanguageHelper] load font fail:", fontPath, err);
                done();
            } else {
                if (font) {
                    this.languageFont = font;
                }
                done();
            }
        };
        try {
            if (cc.resources && typeof cc.resources.load === "function") {
                cc.resources.load(fontPath, cc.Font, onLoaded);
                return;
            }
            const assetManager = cc.assetManager as any;
            const resourcesBundle = assetManager && assetManager._bundles && assetManager._bundles.get &&
                assetManager._bundles.get("resources");
            if (resourcesBundle && typeof resourcesBundle.load === "function") {
                resourcesBundle.load(fontPath, cc.Font, onLoaded);
                return;
            }
            console.warn("[LanguageHelper] resources bundle not ready, skip font load");
            done();
        } catch (e) {
            console.error("[LanguageHelper] loadFont exception:", e);
            done();
        }
    }

    setLanguageDataMgr(mgr: any): void {
        this.languageDataMgr = mgr;
    }

    getText(key: string, ...args: any[]): string {
        if (!this.languageJson) {
            return key;
        }
        let node = this.languageJson;
        const parts = key.split(".");
        while (parts.length) {
            node = node[parts.shift()!];
            if (node === undefined) {
                return key;
            }
        }
        if (typeof node === "string" && args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                node = node.replace("%{" + i + "}", args[i]);
            }
        }
        return node;
    }

    addMultilingualFont(root: cc.Node): void {
        if (root && root.children) {
            this.traverseNodes(root.children, (node) => {
                if (!node.getComponent("MultilingualFont") &&
                    (node.getComponent(cc.Label) || node.getComponent(cc.RichText))) {
                    node.addComponent("MultilingualFont");
                }
            });
        }
    }

    traverseNodes(children: cc.Node[], visitor: (node: cc.Node) => void): void {
        children.forEach((child) => {
            visitor(child);
            this.traverseNodes(child.children, visitor);
        });
    }
}

const LanguageHelper = new LanguageHelperImpl();

export default LanguageHelper;
