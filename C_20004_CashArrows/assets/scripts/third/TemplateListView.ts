import ListView from "./ListView";

const { ccclass, property } = cc._decorator;

class Adapter extends ListView.AbsAdapter {
    public constructor(dataSet: string[]) {
        super();
        this.setDataSet(dataSet);
    }

    public updateView(cell: cc.Node, index: number, data: string): void {
        cell.getComponentInChildren(cc.Label).string = data;
    }

    public onClickItem(): void {
    }
}

@ccclass
export default class TemplateListView extends cc.Component {
    public listview: ListView = null;

    public onLoad(): void {
        this.listview = this.node.getComponent(ListView);
        if (!this.listview) {
            this.listview = this.node.getComponentInChildren(ListView);
        }
    }

    public start(): void {
        this.listview.setAdapter(new Adapter([
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
            "testData10"
        ]));
    }
}