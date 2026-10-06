import UserData from "./UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NoMacScript extends cc.Component {
    @property({
        type: cc.Label,
        tooltip: "mac文本"
    })
    macTxt: cc.Label = null;

    onLoad() {}

    onEnable() {
        this.showMacTxt();
    }

    start() {}

    showMacTxt() {
        null == UserData.getInstance().userID && (UserData.getInstance().userID = UserData.getUserId(10));
        console.log("id:" + UserData.getInstance().userID);
        this.macTxt.string = "id:" + UserData.getInstance().userID;
    }

    copyMacTxt() {
        const e = document.createElement("textarea");
        e.value = this.macTxt.string;
        e.style.position = "fixed";
        e.style.opacity = "0";
        document.body.appendChild(e);
        e.focus();
        e.select();
        try {
            document.execCommand("copy") ? console.log("复制成功") : console.error("复制失败");
        } catch (e) {
            console.error("无法复制文本: ", e);
        }
        document.body.removeChild(e);
    }
}
