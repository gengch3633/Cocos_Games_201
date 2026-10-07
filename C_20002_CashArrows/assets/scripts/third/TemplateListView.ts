import ListView, { AbsAdapter } from "./ListView";

const { ccclass } = cc._decorator;

class TemplateAdapter extends AbsAdapter {
    constructor(data: any[]) {
        super();
        this.setDataSet(data);
    }

    updateView(node: cc.Node, _index: number, data: any): void {
        node.getComponentInChildren(cc.Label)!.string = data;
    }

    onClickItem(): void {
    }
}

@ccclass
export default class TemplateListView extends cc.Component {
    listview: ListView | null = null;

    onLoad(): void {
        this.listview = this.node.getComponent(ListView);
        if (!this.listview) {
            this.listview = this.node.getComponentInChildren(ListView);
        }
    }

    start(): void {
        this.listview!.setAdapter(new TemplateAdapter([
            "节奏春节",
            "追逐人生",
            "危险瑜伽",
            "testData3",
            "testData4",
            "testData5",
            "testData6",
            "testData7",
            "testData8",
            "testData9",
            "testData10",
        ]));
    }
}
