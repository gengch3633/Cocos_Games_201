import GlobalEventMgr from "./GlobalEventMgr";
import InterfaceMgr from "./InterfaceMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nGroup extends cc.Component {

    @property
    public refreshOnLoad: boolean = true;

    @property({ tooltip: "set true to trigger all i18n children refresh on language changed" })
    public refreshOnLanguageChanged: boolean = false;

    @property
    public includeInactive: boolean = false;

    @property
    public recursive: boolean = true;

    public onLoad(): void {
        this.bindLanguageEvent();
        if (this.refreshOnLoad) {
            this.refreshChildren();
        }
    }

    public onDestroy(): void {
        this.unbindLanguageEvent();
    }

    public bindLanguageEvent(): void {
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    public unbindLanguageEvent(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    public onLanguageChanged(): void {
        if (this.refreshOnLanguageChanged) {
            this.refreshChildren();
        }
    }

    public refreshChildren(): void {
        this.refreshNode(this.node);
    }

    public refreshNode(node: cc.Node): void {
        if (node && node.isValid && (node === this.node || this.includeInactive || node.active)) {
            this.refreshNodeI18n(node);
            if (this.recursive) {
                for (let i = 0; i < node.childrenCount; i++) {
                    this.refreshNode(node.children[i]);
                }
            }
        }
    }

    public refreshNodeI18n(node: cc.Node): void {
        const components: cc.Component[] = node.getComponents(cc.Component) || [];
        for (let i = 0; i < components.length; i++) {
            const comp = components[i] as any;
            if (comp && comp !== this) {
                if (comp.refreshText && typeof comp.refreshText === "function") {
                    comp.refreshText();
                }
                if (comp.refreshSprite && typeof comp.refreshSprite === "function") {
                    comp.refreshSprite();
                }
            }
        }
    }
}