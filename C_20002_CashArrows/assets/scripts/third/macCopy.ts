import LanguageService from "./LanguageService";
import Tips from "./Tips";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

declare global {
    interface Window {
        tt?: any;
        wx?: any;
    }
}

@ccclass
export default class MacCopy extends cc.Component {
    copyMacTxt(): void {
        const text = "UID:" + UserData.getInstance().userID;
        if (window.tt) {
            window.tt.setClipboardData({
                data: text,
                success: () => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: () => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                },
            });
        } else if (window.wx) {
            window.wx.setClipboardData({
                data: text,
                success: () => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: () => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                },
            });
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = UserData.getInstance().userID;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                if (document.execCommand("copy")) {
                    console.log("复制成功");
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                } else {
                    console.error("复制失败");
                    Tips.show(LanguageService.t("key_tip_copy_fail"));
                }
            } catch (err) {
                console.error("无法复制文本: ", err);
            }
            document.body.removeChild(textarea);
        }
    }

    copyFun(): void {
        if (window.tt) {
            window.tt.setClipboardData({
                data: UserData.getInstance().userID,
                success: () => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: () => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                },
            });
        } else if (window.wx) {
            window.wx.setClipboardData({
                data: UserData.getInstance().userID,
                success: () => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: () => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                },
            });
        }
    }
}
