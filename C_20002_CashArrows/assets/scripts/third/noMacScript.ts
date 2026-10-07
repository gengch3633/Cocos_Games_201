import UserData from "./UserData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NoMacScript extends cc.Component {
    @property({ type: cc.Label, tooltip: "mac文本" })
    macTxt: cc.Label | null = null;

    onLoad(): void {
    }

    onEnable(): void {
        this.showMacTxt();
    }

    start(): void {
    }

    showMacTxt(): void {
        if (UserData.getInstance().userID == null) {
            UserData.getInstance().userID = UserData.getUserId(10);
        }
        console.log("id:" + UserData.getInstance().userID);
        if (this.macTxt) {
            this.macTxt.string = "id:" + UserData.getInstance().userID;
        }
    }

    copyMacTxt(): void {
        const textarea = document.createElement("textarea");
        textarea.value = this.macTxt ? this.macTxt.string : "";
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            if (document.execCommand("copy")) {
                console.log("复制成功");
            } else {
                console.error("复制失败");
            }
        } catch (err) {
            console.error("无法复制文本: ", err);
        }
        document.body.removeChild(textarea);
    }
}
