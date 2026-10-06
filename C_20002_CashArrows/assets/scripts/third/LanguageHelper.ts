import { BUSINESS_COMMON_CONFIG } from "./BusinessCommonConfig";
import SystemDataStore from "./SystemDataStore";

const SUPPORTED_COUNTRIES = [
    "CN", "BR", "PT", "ID", "US", "IN", "UK", "DE", "IT", "RU", "KR", "JP", "CA", "AU", "NZ", "FR", "MX", "AR", "ES", "PH", "MY", "TH", "SA", "EG", "ZA", "KE", "PK", "NG",
];

const FONT_MAP: Record<string, string> = {
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

interface LanguageDataMgr {
    getLanguageDataByType(type: string): Record<string, unknown> | null;
}

const LanguageHelper = new (class {
    languageType = BUSINESS_COMMON_CONFIG.defaultLanguage;
    languageFont: cc.Font | null = null;
    languageJson: Record<string, unknown> | null = null;
    languageDataMgr: LanguageDataMgr | null = null;

    init(language?: string, callback?: () => void): void {
        let type = language || BUSINESS_COMMON_CONFIG.defaultLanguage;
        if (!SUPPORTED_COUNTRIES.includes(type)) {
            type = BUSINESS_COMMON_CONFIG.defaultLanguage;
        }
        this.setType(type, callback);
    }

    setType(type: string, callback?: () => void): void {
        this.languageType = type;
        SystemDataStore.setLanguageType(type);
        try {
            cc.sys.localStorage.setItem("LANGUAGE", type);
        } catch {
            // ignore
        }
        this.loadLang(type, callback);
    }

    loadLang(type: string, callback?: () => void): void {
        if (this.languageDataMgr) {
            this.languageJson = this.languageDataMgr.getLanguageDataByType(type);
        }
        this.loadFont(type, callback);
    }

    loadFont(type: string, callback?: () => void): void {
        const fontPath = "BPR_font/BPR_" + (FONT_MAP[type] || "CommonFont");
        const done = () => callback?.();

        const onLoaded = (error: Error | null, font?: cc.Font) => {
            if (error) {
                console.warn("[LanguageHelper] load font fail:", fontPath, error);
                done();
                return;
            }
            if (font) {
                this.languageFont = font;
            }
            done();
        };

        try {
            if (cc.resources && typeof cc.resources.load === "function") {
                cc.resources.load(fontPath, cc.Font, onLoaded);
                return;
            }
            const bundles = cc.assetManager as cc.AssetManager & { _bundles?: { get(name: string): cc.AssetManager.Bundle } };
            const resourcesBundle = bundles._bundles?.get?.("resources");
            if (resourcesBundle && typeof resourcesBundle.load === "function") {
                resourcesBundle.load(fontPath, cc.Font, onLoaded);
                return;
            }
            console.warn("[LanguageHelper] resources bundle not ready, skip font load");
            done();
        } catch (error) {
            console.error("[LanguageHelper] loadFont exception:", error);
            done();
        }
    }

    setLanguageDataMgr(mgr: LanguageDataMgr): void {
        this.languageDataMgr = mgr;
    }

    getText(key: string, ...args: unknown[]): string {
        if (!this.languageJson) {
            return key;
        }
        let current: unknown = this.languageJson;
        const parts = key.split(".");
        while (parts.length) {
            current = (current as Record<string, unknown>)[parts.shift()!];
            if (current === undefined) {
                return key;
            }
        }
        if (typeof current === "string" && args.length > 0) {
            let text = current;
            for (let i = 0; i < args.length; i++) {
                text = text.replace("%{" + i + "}", String(args[i]));
            }
            return text;
        }
        return String(current);
    }

    addMultilingualFont(root: cc.Node): void {
        if (!root || !root.children) {
            return;
        }
        this.traverseNodes(root.children, (node) => {
            if (!node.getComponent("MultilingualFont") && (node.getComponent(cc.Label) || node.getComponent(cc.RichText))) {
                node.addComponent("MultilingualFont");
            }
        });
    }

    traverseNodes(nodes: cc.Node[], callback: (node: cc.Node) => void): void {
        nodes.forEach((node) => {
            callback(node);
            this.traverseNodes(node.children, callback);
        });
    }
})();

export default LanguageHelper;
