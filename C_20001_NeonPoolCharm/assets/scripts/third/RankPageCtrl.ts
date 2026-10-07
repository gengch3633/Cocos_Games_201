import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import EngineUtil from "./EngineUtil";
import GameDataMgr from "./GameDataMgr";
import RankItemCtrl from "./RankItemCtrl";
import RankPage from "./RankPage";
import ScrollViewCtrl from "./ScrollViewCtrl";
import { UiManager } from "./UiManage";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/RankPageCtrl")
export default class RankPageCtrl extends BasePageCtrl {
    ui: RankPage = null;
    achData: any[] = [];
    billboard: any = null;

    static prefabUrl = "RankPage";
    static className = "RankPageCtrl";

    _init(e: { billboard?: any }): void {
        if (e) {
            const t = e.billboard;
            this.billboard = t;
            this.refreshView(e);
        }
    }

    refreshView(e: { billboard?: any }): void {
        this.recovery();
        if (e) {
            for (const t in e.billboard) {
                this.achData.push(e.billboard[t]);
            }
            this.initList();
        }
    }

    initList(): void {
        this.ui.content.removeAllChildren();
        this.ui.ScrollView.getComponent(ScrollViewCtrl).init(this.achData);
        this.ui.ScrollView.getComponent(ScrollViewCtrl).scrollToItem(0);
    }

    initUI(): void {
        this.ui.content.removeAllChildren();
        this.ui.ScrollView.getComponent(cc.ScrollView).scrollToTop();
        if (this.billboard) {
            for (let e = 0; e < this.billboard.length; e++) {
                const t = this.billboard[e];
                const o = GameDataMgr.getRankItem();
                o.parent = this.ui.content;
                o.getComponent(RankItemCtrl) || o.addComponent(RankItemCtrl);
                o.getComponent(RankItemCtrl).initData(t);
            }
        }
    }

    onUILoad(): void {
        this.ui = this.node.addComponent(RankPage);
    }

    addButtonListen(): void {
        UiManager.addButtonListen(this.ui.pop_close, this.clickClose, this);
    }

    clickClose(): void {
        this.hide();
    }

    onLoad(): void {
        this.onUILoad();
        this._animType = AnimType.POINTSCALE;
        this._touchControl = false;
        this._hasPeneLock = true;
        this._hasBlack = true;
        this._hasTouchLock = false;
        super.onLoad();
        this.addButtonListen();
        const t = EngineUtil.convertNodePosition(this.node, cc.find("Canvas/MainUiNew/topNode/btn_rank"));
        this._start_pos = t;
    }

    recovery(): void {
        this.achData.length = 0;
    }

    start(): void {
    }
}
