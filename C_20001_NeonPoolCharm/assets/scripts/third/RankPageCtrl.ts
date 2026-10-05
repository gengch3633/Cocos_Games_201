import BasePageCtrl, { AnimType } from "./BasePageCtrl";
import ScrollViewCtrl from "./ScrollViewCtrl";
import EngineUtil from "./EngineUtil";
import { UiManager } from "./UiManage";
import GameDataMgr from "./GameDataMgr";
import RankPage from "./RankPage";
import RankItemCtrl from "./RankItemCtrl";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("UI/pages/RankPageCtrl")
export default class RankPageCtrl extends BasePageCtrl {
    ui: RankPage = null;
    achData: any[] = [];
    billboard: any = null;

    _init(e?: any): void {
        if (e) {
            this.billboard = e.billboard;
            this.refreshView(e);
        }
    }

    refreshView(e?: any): void {
        this.recovery();
        if (e) {
            for (const key in e.billboard) {
                this.achData.push(e.billboard[key]);
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
            for (let i = 0; i < this.billboard.length; i++) {
                const data = this.billboard[i];
                const item = GameDataMgr.getRankItem();
                item.parent = this.ui.content;
                if (!item.getComponent(RankItemCtrl)) {
                    item.addComponent(RankItemCtrl);
                }
                item.getComponent(RankItemCtrl).initData(data);
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
        this._start_pos = EngineUtil.convertNodePosition(
            this.node,
            cc.find("Canvas/MainUiNew/topNode/btn_rank")
        );
    }

    recovery(): void {
        this.achData.length = 0;
    }

    start(): void {}

    static prefabUrl = "RankPage";
    static className = "RankPageCtrl";
}
