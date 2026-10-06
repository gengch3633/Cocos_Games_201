import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";

const { ccclass, property } = cc._decorator;

interface RefreshableComponent extends cc.Component {
    refreshText?(): void;
    refreshSprite?(): void;
}

@ccclass
export default class I18nGroup extends cc.Component {
    @property
    refreshOnLoad = true;

    @property({
        tooltip: "set true to trigger all i18n children refresh on language changed",
    })
    refreshOnLanguageChanged = false;

    @property
    includeInactive = false;

    @property
    recursive = true;

    onLoad(): void {
        this.bindLanguageEvent();
        if (this.refreshOnLoad) {
            this.refreshChildren();
        }
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
        if (this.refreshOnLanguageChanged) {
            this.refreshChildren();
        }
    }

    refreshChildren(): void {
        this.refreshNode(this.node);
    }

    refreshNode(node: cc.Node): void {
        if (!node || !node.isValid) {
            return;
        }
        if (node !== this.node && !this.includeInactive && !node.active) {
            return;
        }
        this.refreshNodeI18n(node);
        if (this.recursive) {
            for (let i = 0; i < node.childrenCount; i++) {
                this.refreshNode(node.children[i]);
            }
        }
    }

    refreshNodeI18n(node: cc.Node): void {
        const components = node.getComponents(cc.Component) || [];
        for (let i = 0; i < components.length; i++) {
            const component = components[i] as RefreshableComponent;
            if (component && component !== this) {
                if (component.refreshText && typeof component.refreshText === "function") {
                    component.refreshText();
                }
                if (component.refreshSprite && typeof component.refreshSprite === "function") {
                    component.refreshSprite();
                }
            }
        }
    }
}
