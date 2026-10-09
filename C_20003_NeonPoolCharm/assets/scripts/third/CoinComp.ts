import DB from "./DB";

const { ccclass } = cc._decorator;

@ccclass
export default class CoinComp extends cc.Component {
    updateV() {
        cc.find("label_coin", this.node).getComponent(cc.Label).string = DB.userInfo.coin;
        console.log("DB.userInfo.coin", DB.userInfo.coin);
    }

    onLoad() {
        this.updateV();
    }
}
