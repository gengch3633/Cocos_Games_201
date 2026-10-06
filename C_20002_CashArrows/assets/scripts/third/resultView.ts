import AudioMgr from "./AudioMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import Tips from "./Tips";
import UIMgr from "./UIMgr";
import GEMgr from "./GEMgr";
import { bundleName, gameEvent } from "./InterfaceMgr";
import { UIParams } from "./UIParams";
import UserData from "./UserData";
import LanguageService from "./LanguageService";
import BusinessAnalyticsService from "./BusinessAnalyticsService";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu(" 业务逻辑/ resultView ")
export default class resultView extends cc.Component {
    @property(sp.Skeleton)
    sp_result: sp.Skeleton = null;

    @property(cc.Node)
    node_nextani: cc.Node = null;

    @property(cc.Label)
    txt_curlevel: cc.Label = null;

    @property(cc.Label)
    txt_nextlevel: cc.Label = null;

    entryData: any = null;
    passRewardData: any = null;
    isLoadingPass = !1;
    isClaiming = !1;
    hasClaimed = !1;
    winLevel = 1;
    btnMain: cc.Node = null;
    btnOnly: cc.Node = null;
    lblOnly: cc.Label = null;
    lblReward: cc.Label = null;
    lblMain: cc.Label = null;
    lblTitle: cc.Label = null;
    nodeAdIcon: cc.Node = null;
    nodeRewardCard: cc.Node = null;
    nodeMoneyIcon: cc.Node = null;

    start() {
        this.entryData = UIParams.parse(this.node, 0, null) || this.entryData || {};
        this.entryData.level > 0 && (this.winLevel = this.entryData.level);
        this.winLevel = this.entryData.level > 0 ? this.entryData.level : UserData.getInstance().level;
        this.showAni();
        this.bindDynamicNodes();
        this.applySuccessStyle();
        this.refreshRewardTexts({
            baseReward: 500,
            adReward: 1e3,
            forceWatchAd: !1
        });
        GEMgr.trackEvent(" lvNode ", {
            level: this.winLevel,
            win: 1
        });
        cc.sys.isBrowser || GEMgr.ge.track(" userAction ", {
            action: " 游戏胜利 ",
            module: " 关卡 " + this.winLevel,
            isAD: 0
        }, new Date());
        this.loadPassReward();
    }

    setEntryData(e: any) {
        this.entryData = e || {};
        this.entryData.level > 0 && (this.winLevel = this.entryData.level);
        this.loadPassReward();
    }

    OnClickNext() {
        this.onClickMainClaim();
    }

    OnClickShare() {
        this.onClickOnlyClaim();
    }

    async onClickMainClaim() {
        if (this.isClaiming || this.hasClaimed) return;
        this.isClaiming = !0;
        this.refreshButtonsState();
        try {
            var t = this.passRewardData && this.passRewardData.forceWatchAd ? " pass_force " : " pass_active ";
            BusinessAnalyticsService.reportData(" ad_show ", {
                scene: t,
                level: this.winLevel
            });
        } catch (e) { }
        try {
            if (!await this.simulateWatchAd()) {
                Tips.show(this.i18n(" key_result_tip_watch_full "));
                return;
            }
            await this.onClaimSuccess();
        } catch (e) {
            Tips.show(this.i18n(" key_result_tip_ad_error "));
        } finally {
            this.isClaiming = !1;
            this.refreshButtonsState();
        }
    }

    async onClickOnlyClaim() {
        if (this.isClaiming || this.hasClaimed) return;
        await this.claimOnlyReward();
    }

    async claimOnlyReward() {
        this.isClaiming = !0;
        this.refreshButtonsState();
        try {
            await this.onClaimSuccess();
        } catch (e) {
            Tips.show(this.i18n(" key_result_tip_claim_error "));
        } finally {
            this.isClaiming = !1;
            this.refreshButtonsState();
        }
    }

    async simulateWatchAd() {
        return new Promise<boolean>((resolve) => {
            UIMgr.getInstance().showWatingUI();
            setTimeout(function () {
                UIMgr.getInstance().hideWatingUI();
                Tips.show(this.i18n(" key_result_tip_ad_done "));
                resolve(!0);
            }.bind(this), 900);
        });
    }

    async loadPassReward() {
        if (this.isLoadingPass || this.hasClaimed) return;
        this.isLoadingPass = !0;
        this.refreshButtonsState();
        try {
            var e = await this.requestPassReward();
            this.passRewardData = this.normalizePassRewardData(e);
            await this.refreshRewardTexts(this.passRewardData);
        } catch (e) {
            this.passRewardData = this.normalizePassRewardData(null);
            this.refreshRewardTexts(this.passRewardData);
            Tips.show(this.i18n(" key_result_tip_reward_load_fail "));
        } finally {
            this.isLoadingPass = !1;
            this.refreshButtonsState();
        }
    }

    async requestPassReward() {
        var e = this.entryData || {}, t = {
            level: this.winLevel
        };
        if ("function" != typeof e.requestPassReward) {
            return {
                reward_amount: this.safeNum(e.mockRewardAmount, 500),
                ad_reward_amount: this.safeNum(e.mockAdRewardAmount, 1e3),
                force_watch_ad: !!e.mockForceWatchAd,
                settlement_id: e.mockSettlementId || " "
            };
        }
        return await e.requestPassReward(t);
    }

    async requestWatchAdReward() {
        var e = this.entryData || {}, t = this.passRewardData || {}, i = {
            level: this.winLevel,
            settlement_id: t.settlementId || " ",
            reward_amount: t.adReward || 0
        };
        if ("function" != typeof e.requestWatchAdReward) return !0;
        var n = await e.requestWatchAdReward(i);
        return !!n || void 0 === n;
    }

    async requestClaimReward() {
        var e = this.entryData || {}, t = this.passRewardData || {}, i = {
            level: this.winLevel,
            settlement_id: t.settlementId || " ",
            reward_amount: t.baseReward || 0
        };
        if ("function" != typeof e.requestClaimReward) return !0;
        var n = await e.requestClaimReward(i);
        return !!n || void 0 === n;
    }

    async onClaimSuccess() {
        if (this.hasClaimed) return;
        this.hasClaimed = !0;
        UserData.getInstance().level = this.winLevel + 1;
        this.ShowNextAni();
    }

    normalizePassRewardData(e: any) {
        var t = this.unwrapData(e), i = this.safeNum(this.pickField(t, [" reward_amount ", " reward ", " base_reward ", " amount "]), 500), n = this.safeNum(this.pickField(t, [" ad_reward_amount ", " ad_reward ", " video_reward ", " double_reward "]), 2 * i), a = !!this.pickField(t, [" force_watch_ad ", " force_ad ", " must_watch_ad "]);
        return {
            settlementId: this.pickField(t, [" settlement_id ", " pass_id ", " reward_id "]) || " ",
            baseReward: i,
            adReward: Math.max(i, n),
            forceWatchAd: a
        };
    }

    unwrapData(e: any) {
        for (var t = e, i = 0; t && "object" == typeof t && i < 4 && void 0 !== t.data;) {
            t = t.data;
            i++;
        }
        return t || {};
    }

    pickField(e: any, t: string[]) {
        if (e) for (var i = 0; i < t.length; i++) {
            var n = t[i];
            if (void 0 !== e[n]) return e[n];
        }
    }

    safeNum(e: any, t: number) {
        var i = Number(e);
        return isNaN(i) ? t : Math.max(0, Math.floor(i));
    }

    bindDynamicNodes() {
        var e = this.node.getChildByName(" bg ");
        if (e) {
            this.btnMain = e.getChildByName(" btn_nextlevel ");
            this.btnOnly = e.getChildByName(" btn_share ");
            this.nodeRewardCard = e.getChildByName(" reward_card ");
            var t = e.getChildByName(" title ");
            this.lblTitle = t ? t.getComponent(cc.Label) : null;
            this.lblTitle && (this.lblTitle.string = this.i18n(" key_result_title_congrats "));
            if (!this.nodeRewardCard) {
                this.nodeRewardCard = new cc.Node(" reward_card ");
                this.nodeRewardCard.parent = e;
                this.nodeRewardCard.setPosition(0, 45);
                this.nodeRewardCard.setContentSize(260, 290);
                this.nodeRewardCard.addComponent(cc.Sprite);
            }
            this.nodeMoneyIcon = this.nodeRewardCard.getChildByName(" money_icon ");
            if (!this.nodeMoneyIcon) {
                this.nodeMoneyIcon = new cc.Node(" money_icon ");
                this.nodeMoneyIcon.parent = this.nodeRewardCard;
                this.nodeMoneyIcon.setPosition(0, 40);
                this.nodeMoneyIcon.addComponent(cc.Sprite);
            }
            var i = this.nodeRewardCard.getChildByName(" reward_amount ");
            if (i) this.lblReward = i.getComponent(cc.Label) || i.addComponent(cc.Label); else {
                (i = new cc.Node(" reward_amount ")).parent = this.nodeRewardCard;
                i.setPosition(0, -78);
                this.lblReward = i.addComponent(cc.Label);
                this.lblReward.fontSize = 52;
                this.lblReward.lineHeight = 58;
                this.lblReward.enableBold = !0;
            }
            if (this.btnMain) {
                var n = this.btnMain.getChildByName(" lbl_main ");
                if (!n) {
                    (n = new cc.Node(" lbl_main ")).parent = this.btnMain;
                    n.setPosition(50, 0);
                }
                this.lblMain = n.getComponent(cc.Label) || n.addComponent(cc.Label);
                this.lblMain.string = this.i18n(" key_result_main_claim ");
                this.lblMain.fontSize = 36;
                this.lblMain.lineHeight = 40;
                this.lblMain.enableBold = !0;
                this.lblMain.node.color = new cc.Color(172, 65, 58);
                this.nodeAdIcon = this.btnMain.getChildByName(" ad_icon ");
                if (!this.nodeAdIcon) {
                    this.nodeAdIcon = new cc.Node(" ad_icon ");
                    this.nodeAdIcon.parent = this.btnMain;
                    this.nodeAdIcon.setPosition(-150, 0);
                    this.nodeAdIcon.addComponent(cc.Sprite);
                }
            }
            if (this.btnOnly) {
                var a = this.btnOnly.getComponent(cc.Sprite);
                a && (a.enabled = !1);
                var o = this.btnOnly.getChildByName(" lbl_only_claim ");
                o || ((o = new cc.Node(" lbl_only_claim ")).parent = this.btnOnly);
                o.setPosition(0, 0);
                this.lblOnly = o.getComponent(cc.Label) || o.addComponent(cc.Label);
                this.lblOnly.fontSize = 28;
                this.lblOnly.lineHeight = 32;
                this.lblOnly.string = " ";
                this.lblOnly.node.color = new cc.Color(238, 226, 205);
            }
        }
    }

    applySuccessStyle() {
        var e = this.node.getChildByName(" bg ");
        if (e) {
            var t = e.getComponent(cc.Sprite);
            t && cc.assetManager.getBundle(bundleName.ui, function (e, i) {
                !e && i && i.load(" texture/ success/ success_bg ", cc.SpriteFrame, function (e, i) {
                    !e && i && t && t.isValid && (t.spriteFrame = i);
                });
            });
            var i = e.getChildByName(" nextlevel ");
            i && (i.active = !1);
            if (this.btnMain) {
                var n = this.btnMain.getComponent(cc.Sprite);
                n && cc.assetManager.getBundle(bundleName.ui, function (e, t) {
                    !e && t && t.load(" texture/ success/ dialog_get_btn ", cc.SpriteFrame, function (e, t) {
                        !e && t && n && n.isValid && (n.spriteFrame = t);
                    });
                });
                this.nodeAdIcon && cc.assetManager.getBundle(bundleName.ui, function (e, t) {
                    !e && t && t.load(" texture/ success/ dialog_ad_icon ", cc.SpriteFrame, function (e, t) {
                        var i;
                        !e && t && (null === (i = this.nodeAdIcon) || void 0 === i ? void 0 : i.isValid) && (this.nodeAdIcon.getComponent(cc.Sprite).spriteFrame = t);
                    }.bind(this));
                }.bind(this));
            }
            if (this.nodeRewardCard) {
                var a = this.nodeRewardCard.getComponent(cc.Sprite);
                a && cc.assetManager.getBundle(bundleName.ui, function (e, t) {
                    !e && t && t.load(" texture/ success/ dialog_money_bg ", cc.SpriteFrame, function (e, t) {
                        !e && t && a && a.isValid && (a.spriteFrame = t);
                    });
                });
            }
        }
    }

    refreshRewardTexts(e: any) {
        if (this.lblReward) {
            this.lblReward.string = this.i18n(" key_result_reward_prefix ", [this.getCurrencyText(" RP ", e.adReward || 0)]);
            this.lblReward.node.color = new cc.Color(241, 221, 141);
        }
        if (this.lblOnly) {
            var t = this.i18n(" key_result_only_claim ", [this.getCurrencyText(" RP ", e.baseReward || 0)]);
            e.forceWatchAd && (t += this.i18n(" key_result_watch_ad_suffix "));
            this.lblOnly.string = t;
        }
    }

    refreshButtonsState() {
        var e = !this.isLoadingPass && !this.isClaiming && !this.hasClaimed;
        if (this.btnMain) {
            var t = this.btnMain.getComponent(cc.Button);
            t && (t.interactable = e);
        }
        if (this.btnOnly) {
            var i = this.btnOnly.getComponent(cc.Button);
            i && (i.interactable = e);
        }
    }

    formatMoney(e: number) {
        return Math.max(0, Math.floor(e || 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    getCurrencyText(e: any, t?: any) {
        var i = void 0 !== t ? t : e;
        return LanguageService.formatCurrency(i);
    }

    i18n(e: string, t?: any, i?: string) {
        return LanguageService.t(e, t, i);
    }

    showAni() {
        var e = this, t = this.node.getChildByName(" bg ");
        if (t) {
            t.y += 2e3;
            t.opacity = 0;
            cc.tween(t).by(.3, {
                y: -2100
            }).by(.3, {
                y: 100
            }, {
                easing: " backOut "
            }).union().delay(.1).call(function () {
                AudioMgr.getInstance().playEffect(" audio/ level_complete ", bundleName.ui);
                var i = t.getChildByName(" lizi "), n = t.getChildByName(" lizi2 ");
                i && (i.active = !0);
                n && (n.active = !0);
                if (e.sp_result && e.sp_result.node) {
                    e.sp_result.node.active = !0;
                    e.sp_result.setAnimation(0, " win ", !1);
                    e.sp_result.addAnimation(0, " winidle ", !0);
                }
            }).start();
            cc.tween(t).delay(.15).to(.2, {
                opacity: 255
            }).start();
        }
    }

    ShowNextAni() {
        var e = this;
        if (this.node_nextani && this.txt_curlevel && this.txt_nextlevel) {
            this.node_nextani.active = !0;
            this.txt_curlevel.string = this.winLevel + " ";
            this.txt_nextlevel.string = this.winLevel + 1 + " ";
            cc.tween(this.txt_curlevel.node).by(.5, {
                opacity: -255,
                y: -60
            }).start();
            cc.tween(this.txt_nextlevel.node).by(.5, {
                opacity: 255,
                y: -60
            }).delay(1).call(function () {
                GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
                UIMgr.getInstance().hide(e.node);
            }).start();
        } else {
            GlobalEventMgr.getInstance().emit(gameEvent.gameNext);
            UIMgr.getInstance().hide(this.node);
        }
    }
}
