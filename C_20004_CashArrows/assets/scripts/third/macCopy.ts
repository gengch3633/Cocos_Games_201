import * as LanguageService from "./LanguageService";
import Tips from "./Tips";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

interface IClipboardOptions {
    data: string;
    success: () => void;
    fail: () => void;
}

interface IMiniGameSDK {
    setClipboardData(options: IClipboardOptions): void;
}

@ccclass
export default class macCopy extends cc.Component {

    public copyMacTxt(): void {
        const uid: string = "UID:" + UserData.getInstance().userID;
        const tt: IMiniGameSDK | undefined = (window as any).tt;
        const wx: IMiniGameSDK | undefined = (window as any).wx;

        if (tt) {
            tt.setClipboardData({
                data: uid,
                success: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        } else if (wx) {
            wx.setClipboardData({
                data: uid,
                success: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        } else {
            const textarea: HTMLTextAreaElement = document.createElement("textarea");
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

    public copyFun(): void {
        const tt: IMiniGameSDK | undefined = (window as any).tt;
        const wx: IMiniGameSDK | undefined = (window as any).wx;

        if (tt) {
            tt.setClipboardData({
                data: UserData.getInstance().userID,
                success: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        } else if (wx) {
            wx.setClipboardData({
                data: UserData.getInstance().userID,
                success: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: (): void => {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        }
    }
}