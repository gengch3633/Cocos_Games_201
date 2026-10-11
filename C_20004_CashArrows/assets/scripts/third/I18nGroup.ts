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

    protected onLoad(): void {
        this.bindLanguageEvent();
        if (this.refreshOnLoad) {
            this.refreshChildren();
        }
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

    private refreshNodeI18n(node: cc.Node): void {
        const components = node.getComponents(cc.Component) || [];
        for (let i = 0; i < components.length; i++) {
            const component: any = components[i];
            if (component && component !== this) {
                if (component.refreshText && "function" == typeof component.refreshText) {
                    component.refreshText();
                }
                if (component.refreshSprite && "function" == typeof component.refreshSprite) {
                    component.refreshSprite();
                }
            }
        }
    }
}