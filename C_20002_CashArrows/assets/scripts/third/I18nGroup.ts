import GlobalEventMgr from "./GlobalEventMgr";
import { gameEvent } from "./InterfaceMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class I18nGroup extends cc.Component {
    @property
    refreshOnLoad: boolean = true;

    @property({
        tooltip: " set true to trigger all i18n children refresh on language changed "
    })
    refreshOnLanguageChanged: boolean = false;

    @property
    includeInactive: boolean = false;

    @property
    recursive: boolean = true;

    onLoad() {
        this.bindLanguageEvent();
        this.refreshOnLoad && this.refreshChildren();
    }

    onDestroy() {
        this.unbindLanguageEvent();
    }

    bindLanguageEvent() {
        GlobalEventMgr.getInstance().on(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    unbindLanguageEvent() {
        GlobalEventMgr.getInstance().off(gameEvent.languageChanged, this.onLanguageChanged, this);
    }

    onLanguageChanged() {
        this.refreshOnLanguageChanged && this.refreshChildren();
    }

    refreshChildren() {
        this.refreshNode(this.node);
    }

    refreshNode(e: any) {
        if (e && e.isValid && (e === this.node || this.includeInactive || e.active)) {
            this.refreshNodeI18n(e);
            if (this.recursive) for (var t = 0; t < e.childrenCount; t++) this.refreshNode(e.children[t]);
        }
    }

    refreshNodeI18n(e: any) {
        for (var t = e.getComponents(cc.Component) || [], i = 0; i < t.length; i++) {
            var n = t[i];
            if (n && n !== this) {
                n.refreshText && " function " == typeof n.refreshText && n.refreshText();
                n.refreshSprite && " function " == typeof n.refreshSprite && n.refreshSprite();
            }
        }
    }
}
