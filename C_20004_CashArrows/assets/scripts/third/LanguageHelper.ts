import BusinessCommonConfig from "./BusinessCommonConfig";
import SystemDataStore from "./SystemDataStore";

const SUPPORTED_LANGUAGES: string[] = [
	"CN", "BR", "PT", "ID", "US", "IN", "UK", "DE", "IT", "RU",
	"KR", "JP", "CA", "AU", "NZ", "FR", "MX", "AR", "ES", "PH",
	"MY", "TH", "SA", "EG", "ZA", "KE", "PK", "NG"
];

const LANGUAGE_FONT_MAP: { [key: string]: string } = {
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
	JP: "CommonFont"
};

interface ILanguageDataManager {
	getLanguageDataByType(type: string): any;
}

class LanguageHelper {
	public languageType: string;
	public languageFont: cc.Font | null;
	public languageJson: any;
	public languageDataMgr: ILanguageDataManager | null;

	public constructor() {
		this.languageType = BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage;
		this.languageFont = null;
		this.languageJson = null;
		this.languageDataMgr = null;
	}

	public init(type?: string, callback?: () => void): void {
		type = type || BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage;
		if (SUPPORTED_LANGUAGES.indexOf(type) < 0) {
			type = BusinessCommonConfig.BUSINESS_COMMON_CONFIG.defaultLanguage;
		}
		this.setType(type, callback);
	}

	public setType(type: string, callback?: () => void): void {
		this.languageType = type;
		SystemDataStore.setLanguageType(type);
		try {
			cc.sys.localStorage.setItem("LANGUAGE", type);
		} catch (e) {
		}
		this.loadLang(type, (): void => {
			if (callback) callback();
		});
	}

	public loadLang(type: string, callback?: () => void): void {
		if (this.languageDataMgr) {
			this.languageJson = this.languageDataMgr.getLanguageDataByType(type);
		}
		this.loadFont(type, callback);
	}

	public loadFont(type: string, callback?: () => void): void {
		const path: string = "BPR_font/BPR_" + (LANGUAGE_FONT_MAP[type] || "CommonFont");
		const finish = (): void => {
			if (callback) callback();
		};
		const onLoaded = (err: Error | null, font: cc.Font): void => {
			if (err) {
				console.warn("[LanguageHelper] load font fail:", path, err);
				finish();
			} else {
				if (font) this.languageFont = font;
				finish();
			}
		};
		try {
			if (cc.resources && typeof cc.resources.load === "function") {
				cc.resources.load(path, cc.Font, onLoaded);
				return;
			}
			const assetManager: any = cc.assetManager;
			const bundles: any = assetManager && assetManager._bundles;
			const resourcesBundle: any = bundles && bundles.get && bundles.get("resources");
			if (resourcesBundle && typeof resourcesBundle.load === "function") {
				resourcesBundle.load(path, cc.Font, onLoaded);
				return;
			}
			console.warn("[LanguageHelper] resources bundle not ready, skip font load");
			finish();
		} catch (e) {
			console.error("[LanguageHelper] loadFont exception:", e);
			finish();
		}
	}

	public setLanguageDataMgr(mgr: ILanguageDataManager | null): void {
		this.languageDataMgr = mgr;
	}

	public getText(key: string, ...args: any[]): string {
		if (!this.languageJson) return key;
		let value: any = this.languageJson;
		const segments: string[] = key.split(".");
		while (segments.length > 0) {
			const segment: string = segments.shift() as string;
			value = value[segment];
			if (value === undefined) return key;
		}
		if (typeof value === "string" && args.length > 0) {
			for (let i: number = 0; i < args.length; i++) {
				value = value.replace("%{" + i + "}", args[i]);
			}
		}
		return value;
	}

	public addMultilingualFont(node: cc.Node): void {
		if (!node || !node.children) return;
		this.traverseNodes(node.children, (child: cc.Node): void => {
			if (child.getComponent("MultilingualFont")) return;
			if (!child.getComponent(cc.Label) && !child.getComponent(cc.RichText)) return;
			child.addComponent("MultilingualFont");
		});
	}

	public traverseNodes(nodes: cc.Node[], callback: (node: cc.Node) => void): void {
		nodes.forEach((node: cc.Node): void => {
			callback(node);
			this.traverseNodes(node.children, callback);
		});
	}
}

export default new LanguageHelper();