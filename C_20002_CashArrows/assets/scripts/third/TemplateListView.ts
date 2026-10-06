import ListView, { AbsAdapter } from "./ListView";

const { ccclass } = cc._decorator;

class TemplateAdapter extends AbsAdapter {
    constructor(t: any) {
        super();
        this.setDataSet(t);
    }

    updateView(e: cc.Node, t: number, i: any) {
        e.getComponentInChildren(cc.Label).string = i;
    }

    onClickItem() { }
}

@ccclass
export default class TemplateListView extends cc.Component {
    listview: ListView = null;

    onLoad() {
        this.listview = this.node.getComponent(ListView);
        this.listview || (this.listview = this.node.getComponentInChildren(ListView));
    }

    start() {
        this.listview.setAdapter(new TemplateAdapter([ " 节奏春节 ", " 追逐人生 ", " 危险瑜伽 ", " testData3 ", " testData4 ", " testData5 ", " testData6 ", " testData7 ", " testData8 ", " testData9 ", " testData10 " ]));
    }
}
