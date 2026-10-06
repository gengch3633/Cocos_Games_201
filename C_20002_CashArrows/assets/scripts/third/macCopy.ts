import Tips from "./Tips";
import UserData from "./UserData";
import LanguageService from "./LanguageService";

const { ccclass } = cc._decorator;

@ccclass
export default class MacCopy extends cc.Component {
    copyMacTxt() {
        const e = "UID:" + UserData.getInstance().userID;
        if ((window as any).tt) {
            (window as any).tt.setClipboardData({
                data: e,
                success: function () {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: function () {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        } else if ((window as any).wx) {
            (window as any).wx.setClipboardData({
                data: e,
                success: function () {
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                },
                fail: function () {
                    Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                }
            });
        } else {
            const t = document.createElement("textarea");
            t.value = UserData.getInstance().userID;
            t.style.position = "fixed";
            t.style.opacity = "0";
            document.body.appendChild(t);
            t.focus();
            t.select();
            try {
                if (document.execCommand("copy")) {
                    console.log("复制成功");
                    Tips.show(LanguageService.t("key_tip_copy_success"));
                } else {
                    console.error("复制失败");
                    Tips.show(LanguageService.t("key_tip_copy_fail"));
                }
            } catch (e) {
                console.error("无法复制文本: ", e);
            }
            document.body.removeChild(t);
        }
    }

    copyFun() {
        (window as any).tt
            ? (window as any).tt.setClipboardData({
                  data: UserData.getInstance().userID,
                  success: function () {
                      Tips.show(LanguageService.t("key_tip_copy_success"));
                  },
                  fail: function () {
                      Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                  }
              })
            : (window as any).wx &&
              (window as any).wx.setClipboardData({
                  data: UserData.getInstance().userID,
                  success: function () {
                      Tips.show(LanguageService.t("key_tip_copy_success"));
                  },
                  fail: function () {
                      Tips.show(LanguageService.t("key_tip_copy_fail_manual"));
                  }
              });
    }
}
