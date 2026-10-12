import AdManager from "./AdManager";
import AudioMgr from "./AudioMgr";
import BarrageDataService from "./BarrageDataService";
import BusinessAnalyticsService from "./BusinessAnalyticsService";
import * as ConfigDefine from "./ConfigDefine";
import "./MultiPlatform";
import ConfigMgr from "./ConfigMgr";
import CountryAssetService from "./CountryAssetService";
import FlyRewardAnimMgr from "./FlyRewardAnimMgr";
import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LanguageService from "./LanguageService";
import LoadingHttpService from "./LoadingHttpService";
import NetErrorPopupService from "./NetErrorPopupService";
import NewbieGuideFlow from "./NewbieGuideFlow";
import NodePoolMgr from "./NodePoolMgr";
import NumberUtils from "./NumberUtils";
import PlayerDataStore from "./PlayerDataStore";
import Random from "./Random";
import ResMgr from "./ResMgr";
import UIDefine from "./UIDefine";
import UIMgr from "./UIMgr";
import UserData from "./UserData";
import UserInfoService from "./UserInfoService";
import arrowSettleRewardView from "./arrowSettleRewardView";
import arrowTaskPopupView from "./arrowTaskPopupView";
import game from "./game";
import withMoodView from "./withMoodView";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("业务逻辑/gameView")
export default class gameView extends cc.Component {
    @property
    public showTime: boolean = true;

    @property(cc.Node)
    public node_tishi: cc.Node = null;

    @property(cc.Node)
    public node_checksize: cc.Node = null;

    @property(cc.Node)
    public node_mask: cc.Node = null;

    @property(cc.Node)
    public layer_top: cc.Node = null;

    @property(cc.Node)
    public layer_mid: cc.Node = null;

    @property(cc.Node)
    public layer_bottom: cc.Node = null;

    @property(cc.Sprite)
    public img_life: cc.Sprite = null;

    @property(cc.Label)
    public txt_levelnum: cc.Label = null;

    @property(cc.Label)
    public txt_time: cc.Label = null;

    @property(cc.Label)
    public txt_lastnum: cc.Label = null;

    @property(cc.Node)
    public node_blue: cc.Node = null;

    @property(cc.Node)
    public node_red: cc.Node = null;

    @property(cc.Node)
    public node_yichu: cc.Node = null;

    @property(cc.Node)
    public node_diaozhuan: cc.Node = null;

    @property(cc.Slider)
    public slider: cc.Slider = null;

    @property(cc.Sprite)
    public sp_slderbg: cc.Sprite = null;

    @property(cc.Node)
    public node_fuzhuad: cc.Node = null;

    @property(cc.Node)
    public node_fuzhustate: cc.Node = null;

    @property(cc.Node)
    public node_hardsp: cc.Node = null;

    @property(cc.Node)
    public node_topBalanceNav: cc.Node = null;

    @property(cc.Node)
    public node_balanceContainer: cc.Node = null;

    @property(cc.Node)
    public node_withdrawBtn: cc.Node = null;

    @property(cc.Node)
    public node_bubbleContainer: cc.Node = null;

    @property(cc.Label)
    public lbl_balanceText: cc.Label = null;

    @property(cc.RichText)
    public rich_bubbleText: cc.RichText = null;

    @property(cc.Node)
    public node_bigBarragePanel: cc.Node = null;

    @property(cc.RichText)
    public rich_bigBarrageText: cc.RichText = null;

    public node_taskRedPoint: cc.Node = null;
    public node_rewardNum: cc.Node = null;
    public lbl_rewardNumText: cc.Label = null;
    public node_rewardNumIcon: cc.Node = null;
    public sp_rewardNumIcon: cc.Sprite = null;
    public node_fuzhuad_txt: cc.Node = null;
    public node_game: cc.Node = null;

    public forceDisableCountdown: boolean = true;
    public num_life: number = 3;
    public num_total_snake: number = 0;
    public num_current_snake: number = 0;
    public data_levelinfo: any = null;
    public num_normalScale: number = 0;
    public bool_isStop: boolean = true;
    public num_gametime: number = 0;
    public snake_errorID: number[] = [];
    public bool_cantouchAd: boolean = true;
    public bool_hasFuzhuline: boolean = false;
    public num_fuzhulineClearLimit: number = 10;
    public num_fuzhulineRemainClear: number = 0;
    public taskPointNum: number = 0;
    public ltvTaskPointNum: number = 0;
    public rewardNumShowDuration: number = 2;
    public rewardNumFlyDelay: number = 1.5;
    public rewardNumFadeInDuration: number = 0.3;
    public rewardNumFadeOutDuration: number = 0.35;
    public _onUserInfoUpdatedHandler: any = null;
    public _onArrowRewardClaimedHandler: any = null;
    public _pendingTopBalanceAfterFly: number = null;
    public _hasPendingTopBalanceAfterFly: boolean = false;
    public _rewardNumFlyAmount: number = 0;
    public bool_isRestart: boolean = false;
    public num_rellyLevel: number = 0;
    public _eliminateCounter: number = 0;
    public _totalEliminated: number = 0;
    public _mistakeCount: number = 0;
    public _retryCount: number = 0;
    public _hintUsedCount: number = 0;
    public _reviveCount: number = 0;
    public _levelStartTs: number = 0;
    public _barragesPaused: boolean = false;
    public dsj: number = 0;
    public bool_countdownStarted: boolean = false;
    public lbl_withdrawText: cc.Label = null;
    public lbl_txtLevel: cc.Label = null;
    public _pendingSettleData: any = null;
    public _flyMoneyIconFrame: cc.SpriteFrame = null;
    public _level2ZoomGuideDismissed: boolean = false;

    public node_bubbleContainerLabel: any = null;
    public lbl_balanceTextNode: cc.Node = null;

    public topBarrageRows: any[] = [];
    public topBarrageData: any[] = [];
    public topBarrageMinDuration: number = 8;
    public topBarrageMaxDuration: number = 11;
    public topBarrageStayDuration: number = 4;
    public topBarrageScrollDuration: number = 0.4;
    public _topBarrageNextItem: cc.Node = null;
    public _topBarrageNextIcon: cc.Node = null;
    public _topBarrageNextLabel: cc.RichText = null;
    public _topBarrageCurItem: cc.Node = null;
    public _topBarrageCurIcon: cc.Node = null;
    public _topBarrageCurLabel: cc.RichText = null;
    public _topBarrageArrowFrames: cc.SpriteFrame[] = [];
    public _topBarrageArrowReqVersion: number = 0;
    public topBarrageGap: number = 12;
    public topBarrageFontSize: number = 21;
    public topBarrageLineHeight: number = 25;
    public topBarrageNormalColor: string = "#2A438A";
    public topBarrageHighlightColor: string = "#FF3C3C";
    public topMoneyArrowImageName: string = "money_arrow_icon";
    public topMoneyArrowReqVersion: number = 0;
    public bigTopBarrageShown: boolean = false;
    public bigTopBarrageMinDelay: number = 15;
    public bigTopBarrageMaxDelay: number = 25;
    public bigTopBarrageStayDuration: number = 3;
    public bigTopBarrageSlideDuration: number = 0.35;
    public bigTopBarrageHiddenOffset: number = 220;
    public bigTopBarrageBaseY: number = 0;
    public data_topBalanceMock: any = null;
    public currentBigBarrageData: any = null;
    public i18nGroup: any = null;
    public i18nBubbleLabelComp: any = null;
    public topBubbleBaseFontSize: number = 20;
    public topBubbleBaseLineHeight: number = 24;
    public topBubbleMinFontSize: number = 16;
    public topBubbleMaxFontSize: number = 24;
    public topBubbleMaxLines: number = 2;
    public topBubbleMinScale: number = 0.9;
    public topBubbleFitPaddingRatio: number = 0.9;
    public topBubbleFitWidth: number = 308;
    public topBubbleFitHeight: number = 44;
    public designReviewResolution: string = "750x1334";
    public enableLegacyTopWidgetRuntimeOverride: boolean = false;
    public enableTopBubbleAutoFit: boolean = false;
    public enableTopBarrageDynamicLayout: boolean = true;
    public enableBigTopBarrageSlideY: boolean = true;
    public enableTopBottomFadeAnimation: boolean = true;
    public enableRuntimeWidgetRealign: boolean = true;
    public enableTopBindingFallbackAutoAssign: boolean = false;
    public enableBottomRuntimeLayoutLock: boolean = false;
    public bottomRuntimeLockY: number = -628;
    public enableTopRuntimeLayoutLock: boolean = false;
    public topRuntimeLockY: number = 555.45;
    public lifeHeartNodes: cc.Node[] = null;
    public lifeHeartFullFrame: cc.SpriteFrame = null;
    public lifeHeartEmptyFrame: cc.SpriteFrame = null;
    public _sfVb: cc.SpriteFrame = null;
    public _sfOff: cc.SpriteFrame = null;
    public newbieGuideBannerPlaying: boolean = false;
    public newbieGuidePendingLevelPassSettleClose: boolean = false;
    public node_step3GuideTip: cc.Node = null;
    public lbl_step3GuideTip: cc.Label = null;
    public node_step7GuideBanner: cc.Node = null;
    public node_step7GuideBannerBg: cc.Node = null;
    public node_step7GuideBannerDim: cc.Node = null;
    public lbl_step7GuideTextBack: cc.Label = null;
    public lbl_step7GuideTextFront: cc.Label = null;
    public lbl_guideLevel1Tip: cc.Label = null;
    public lbl_guideLevel2Tip: cc.Label = null;

    public start(): void {
        const self = this;
        if (this.forceDisableCountdown) {
            this.showTime = false;
            this.num_gametime = 0;
            this.bool_countdownStarted = false;
        }
        this.getNewbieGuideFlow().bootstrap();
        this.preload();
        this.ensureRuntimeNodeRefs();
        this.setGuideOverlayActive("guide_1", false);
        this.setStep3GuideTipActive(false);
        this.setStep7GuideBannerActive(false);
        this.refreshGuideLevelTipsI18n();
        this.initTaskEntryRedPoint();
        this.initRewardNumDisplay();
        this.initTopBalanceBubbleNav();
        this._initFlyMoneyIconFrame();
        this.initFuzhulineConfig();
        this.initTishiBtnstate();
        this.EventAdd();
        this.num_rellyLevel = this.getRellyLevel();
        this._resetLevelBehaviorStats();
        UIMgr.getInstance().showWatingUI();
        this.InitNodepool().then(() => {
            if (!self.isViewAlive()) return;
            const arrowLevel = PlayerDataStore.arrow_level;
            console.log("[LevelVerify] start: 即将加载 level_" + self.num_rellyLevel + ".json | 显示第" + ((arrowLevel && arrowLevel.arrow_level_id) || "?") + "关 | level_index=" + ((arrowLevel && arrowLevel.level_index) || "未配置") + " | arrow_count(服务器)=" + ((arrowLevel && arrowLevel.arrow_count) || "?"));
            ConfigMgr.getInstance().loadLevelData("level_" + self.num_rellyLevel, false).then(() => {
                if (!self.isViewAlive()) return;
                self.data_levelinfo = ConfigMgr.getInstance().getLevelById(self.num_rellyLevel);
                self._eliminateCounter = 0;
                const localArrowCount = self.data_levelinfo && self.data_levelinfo.Arrows ? self.data_levelinfo.Arrows.length : "加载失败";
                console.log("[LevelVerify] start 加载完成: level_" + self.num_rellyLevel + ".json | 本地实际箭头数=" + localArrowCount + " | 服务器下发 arrow_count=" + (PlayerDataStore.arrow_level.arrow_count || "?") + (String(localArrowCount) !== String(PlayerDataStore.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配，请检查 level_index 是否正确" : " ✅ 箭头数匹配"));
                console.log("[ArrowLevel] start: 关卡=" + self.num_rellyLevel + " big_reward_trigger=" + self._getBigRewardTriggerCount() + " tail_clearance=" + (PlayerDataStore.arrow_level.tail_clearance || 5) + " arrow_count=" + PlayerDataStore.arrow_level.arrow_count + " eliminate_reward=" + PlayerDataStore.arrow_level.eliminate_reward + " life_count=" + PlayerDataStore.arrow_level.life_count);
                self.ShowGame();
                self.fontAni();
            });
        });
    }

    public applyBottomRuntimeLayoutLock(): void {
    }

    public applyTopRuntimeLayoutLock(): void {
    }

    public applyBigBarrageVisualClamp(): void {
    }

    public ensureLifeHeartNodes(): boolean {
        if (this.lifeHeartNodes && this.lifeHeartNodes.length === 3) return true;
        const bgLife = this.findChildByNameDeep(this.node, "bg_life");
        if (!bgLife) return false;
        const heart1 = bgLife.getChildByName("heart_1") || bgLife.getChildByName("img_life");
        const heart2 = bgLife.getChildByName("heart_2");
        const heart3 = bgLife.getChildByName("heart_3");
        if (!heart1 || !heart2 || !heart3) return false;
        this.lifeHeartNodes = [heart1, heart2, heart3];
        const sp1 = heart1.getComponent(cc.Sprite);
        const sp3 = heart3.getComponent(cc.Sprite);
        this.lifeHeartFullFrame = (sp1 && sp1.spriteFrame) || null;
        this.lifeHeartEmptyFrame = (sp3 && sp3.spriteFrame) || null;
        return true;
    }

    public refreshLifeHearts(): void {
        if (!this.ensureLifeHeartNodes()) return;
        for (let i = 0; i < this.lifeHeartNodes.length; i++) {
            const node = this.lifeHeartNodes[i];
            if (!node || !node.isValid) continue;
            const sprite = node.getComponent(cc.Sprite);
            if (!sprite) continue;
            if (i < this.num_life) {
                if (this.lifeHeartFullFrame) sprite.spriteFrame = this.lifeHeartFullFrame;
            } else if (this.lifeHeartEmptyFrame) {
                sprite.spriteFrame = this.lifeHeartEmptyFrame;
            }
        }
    }

    public initTopBalanceBubbleNav(): void {
        const prefabAsset = this.node && (this.node as any)._prefab && (this.node as any)._prefab.asset;
        console.log("[top_nav] runtime prefab", {
            hasPrefabAsset: !!prefabAsset,
            uuid: (prefabAsset && prefabAsset._uuid) || "",
            name: (prefabAsset && prefabAsset.name) || ""
        });
        this.hideLegacyTopWidgets();
        if (this.bindTopBalanceNodesFromPrefab()) {
            this.i18nGroup = this.node.getComponent("I18nGroup");
            if (!this.i18nGroup) {
                this.i18nGroup = this.node.addComponent("I18nGroup");
                if (this.i18nGroup) this.i18nGroup.refreshOnLanguageChanged = true;
            }
            this.ensureTopBubbleI18nLabel();
            this.initTopBalanceMockData();
            this.refreshTopBalanceUI();
            this.bindTopBalanceOpenEvent();
            this.startTopBalanceMockUpdate();
            this.initTopBarrage();
            this.refreshTopMoneyArrowIcons();
            this.loadTopBarrageArrowImages();
            this.initBigTopBarrageTrigger();
        } else {
            console.warn("[top_nav] 绑定失败");
        }
    }

    public _initFlyMoneyIconFrame(): void {
        const self = this;
        const primaryPath = CountryAssetService.getPathByImageName("money_arrow_icon");
        ResMgr.getInstance().loadRes(primaryPath, cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
            if (frame) {
                self._flyMoneyIconFrame = frame;
                return;
            }
            const fallbackPath = CountryAssetService.getPathByImageName("money_arrow_icon", "ID");
            if (fallbackPath && fallbackPath !== primaryPath) {
                ResMgr.getInstance().loadRes(fallbackPath, cc.SpriteFrame, self, "game").then((fallbackFrame: cc.SpriteFrame) => {
                    if (fallbackFrame) self._flyMoneyIconFrame = fallbackFrame;
                });
            }
        });
    }

    public _getBalanceIconNode(): cc.Node {
        if (!this.node_balanceContainer || !this.node_balanceContainer.isValid) return null;
        const icon = this.findChildByNameDeep(this.node_balanceContainer, "icon");
        return icon && icon.isValid ? icon : this.node_balanceContainer;
    }

    public playFlyMoneyAnim(count: number, rewardAmount: number, onComplete?: Function): void {
        const parent = this.node;
        if (!parent || !parent.isValid || !this._flyMoneyIconFrame) {
            if (onComplete) onComplete();
            return;
        }
        const targetIcon = this._getBalanceIconNode();
        if (!targetIcon) {
            if (onComplete) onComplete();
            return;
        }
        const worldPos = FlyRewardAnimMgr.getWorldPos(targetIcon);
        if (!worldPos) {
            if (onComplete) onComplete();
            return;
        }
        const localPos = parent.convertToNodeSpaceAR(worldPos);
        const rewardText = rewardAmount ? FlyRewardAnimMgr.formatRewardText(rewardAmount) : "";
        FlyRewardAnimMgr.playFlyAnim({
            iconFrame: this._flyMoneyIconFrame,
            startPos: cc.v2(0, 0),
            endPos: localPos,
            parentNode: parent,
            count: count || 5,
            startScale: 0.15,
            endScale: 0.5,
            targetIconNode: targetIcon,
            rewardText: rewardText,
            onAllArrived: onComplete,
            sfx: "audio/coin_collect",
            sfxBundle: InterfaceMgr.bundleName.game
        });
    }

    public initFuzhulineConfig(): void {
        let limit = 10;
        try {
            const store: any = PlayerDataStore;
            const fromServer = Number((store && store.guideline_eliminate_num) || 0);
            if (fromServer > 0) {
                limit = fromServer;
                console.log("[fuzhuline] clear limit from userinfo guideline_eliminate_num =", limit);
            } else {
                const constant: any = ConfigMgr.getInstance().getOne(ConfigDefine.ConstantConfig) || {};
                const fromConfig = Number(constant.fuzhuline_clear_limit || constant.fuzhuxian_clear_limit || constant.help_line_clear_limit || constant.help_line_limit || 0);
                if (fromConfig > 0) limit = Math.floor(fromConfig);
                console.log("[fuzhuline] clear limit from ConstantConfig =", limit);
            }
        } catch (e) {
            console.warn("[fuzhuline] read config failed, use default", e);
        }
        this.num_fuzhulineClearLimit = Math.max(1, limit);
        console.log("[fuzhuline] final clear limit =", this.num_fuzhulineClearLimit);
    }

    public findChildNodeByName(node: cc.Node, name: string): cc.Node {
        if (!node || !name) return null;
        if (node.name === name) return node;
        const children = node.children || [];
        for (let i = 0; i < children.length; i++) {
            const found = this.findChildNodeByName(children[i], name);
            if (found) return found;
        }
        return null;
    }

    public resolveGuideNodeByName(name: string): cc.Node {
        if (!this.node || !name) return null;
        let candidates = [name];
        if (name === "guide_level1" || name === "guide_level_1" || name === "guide_Level_1") {
            candidates = ["guide_level1", "guide_level_1", "guide_Level_1"];
        } else if (name === "guide_level2" || name === "guide_level_2" || name === "guide_Level_2") {
            candidates = ["guide_level2", "guide_level_2", "guide_Level_2"];
        }
        for (let i = 0; i < candidates.length; i++) {
            const node = this.findChildByNameDeep(this.node, candidates[i]);
            if (node) return node;
        }
        return null;
    }

    public resolveGuideTipLabel(name: string): cc.Label {
        const guideNode = this.resolveGuideNodeByName(name);
        if (!guideNode) return null;
        let labelNode = guideNode.getChildByName("文本2");
        if (!labelNode) labelNode = this.findChildByNameDeep(guideNode, "文本2");
        return labelNode ? labelNode.getComponent(cc.Label) : null;
    }

    public ensureRuntimeNodeRefs(): void {
        if (!this.node_checksize || !this.node_checksize.isValid) {
            this.node_checksize = cc.find("sizeCheck", this.node) || this.findChildNodeByName(this.node, "sizeCheck");
        }
        if (!this.node_mask || !this.node_mask.isValid) {
            this.node_mask = cc.find("sizeCheck/mask", this.node) || this.findChildNodeByName(this.node, "mask");
        }
        if (!this.node_tishi || !this.node_tishi.isValid) {
            this.node_tishi = cc.find("bottom/btn_tip", this.node) || this.findChildNodeByName(this.node, "btn_tip");
        }
        if (!this.node_taskRedPoint || !this.node_taskRedPoint.isValid) {
            this.node_taskRedPoint = cc.find("top/task_red", this.node) || this.findChildNodeByName(this.node, "task_red");
        }
        if (!this.node_step3GuideTip || !this.node_step3GuideTip.isValid) {
            this.node_step3GuideTip = this.findChildByNameDeep(this.node, "guide_step3_tip");
        }
        if (!cc.isValid(this.lbl_step3GuideTip) && this.node_step3GuideTip && this.node_step3GuideTip.isValid) {
            this.lbl_step3GuideTip = this.node_step3GuideTip.getComponent(cc.Label);
        }
        if (!this.node_step7GuideBanner || !this.node_step7GuideBanner.isValid) {
            this.node_step7GuideBanner = this.findChildByNameDeep(this.node, "guide_step7_banner");
        }
        if (!this.node_step7GuideBannerBg || !this.node_step7GuideBannerBg.isValid) {
            this.node_step7GuideBannerBg = this.findChildByNameDeep(this.node, "guide_step7_bg");
        }
        if (!this.node_step7GuideBannerDim || !this.node_step7GuideBannerDim.isValid) {
            this.node_step7GuideBannerDim = this.findChildByNameDeep(this.node, "guide_step7_dim");
        }
        if (!cc.isValid(this.lbl_step7GuideTextBack)) {
            const back = this.findChildByNameDeep(this.node, "guide_step7_text_back");
            this.lbl_step7GuideTextBack = back ? back.getComponent(cc.Label) : null;
        }
        if (!cc.isValid(this.lbl_step7GuideTextFront)) {
            const front = this.findChildByNameDeep(this.node, "guide_step7_text_front");
            this.lbl_step7GuideTextFront = front ? front.getComponent(cc.Label) : null;
        }
        if (!cc.isValid(this.lbl_txtLevel)) {
            const levelNode = this.findChildByNameDeep(this.node, "txt_level");
            this.lbl_txtLevel = levelNode ? levelNode.getComponent(cc.Label) : null;
        }
        if (!cc.isValid(this.lbl_withdrawText)) {
            const withdrawNode = this.findChildByNameDeep(this.node, "withdraw_text");
            this.lbl_withdrawText = withdrawNode ? withdrawNode.getComponent(cc.Label) : null;
        }
        if (!cc.isValid(this.lbl_guideLevel1Tip)) {
            this.lbl_guideLevel1Tip = this.resolveGuideTipLabel("guide_level1");
        }
        if (!cc.isValid(this.lbl_guideLevel2Tip)) {
            this.lbl_guideLevel2Tip = this.resolveGuideTipLabel("guide_level2");
        }
        if (!this.txt_lastnum) {
            const lastnum = this.findChildNodeByName(this.node, "txt_lastnum");
            if (lastnum) this.txt_lastnum = lastnum.getComponent(cc.Label);
        }
        if (!this.node_rewardNum || !this.node_rewardNum.isValid) {
            this.node_rewardNum = cc.find("reward_num", this.node) || this.findChildNodeByName(this.node, "reward_num");
        }
        if (!cc.isValid(this.lbl_rewardNumText) && this.node_rewardNum && this.node_rewardNum.isValid) {
            const labelNode = cc.find("lbl_text", this.node_rewardNum) || this.findChildNodeByName(this.node_rewardNum, "lbl_text");
            this.lbl_rewardNumText = labelNode ? labelNode.getComponent(cc.Label) : null;
        }
        if ((!this.node_rewardNumIcon || !this.node_rewardNumIcon.isValid) && this.node_rewardNum && this.node_rewardNum.isValid) {
            this.node_rewardNumIcon = cc.find("icon", this.node_rewardNum) || this.findChildNodeByName(this.node_rewardNum, "icon");
        }
        if (!cc.isValid(this.sp_rewardNumIcon) && this.node_rewardNumIcon && this.node_rewardNumIcon.isValid) {
            this.sp_rewardNumIcon = this.node_rewardNumIcon.getComponent(cc.Sprite);
        }
    }

    public setGuideNodeActive(name: string, active: boolean): void {
        this.ensureRuntimeNodeRefs();
        if (!this.node_checksize) return;
        let node = this.node_checksize.getChildByName(name);
        if (!node && (name === "guide_level1" || name === "guide_level_1" || name === "guide_Level_1")) {
            node = this.node_checksize.getChildByName("guide_level1") || this.node_checksize.getChildByName("guide_level_1") || this.node_checksize.getChildByName("guide_Level_1");
        }
        if (!node && (name === "guide_level2" || name === "guide_level_2" || name === "guide_Level_2")) {
            node = this.node_checksize.getChildByName("guide_level2") || this.node_checksize.getChildByName("guide_level_2") || this.node_checksize.getChildByName("guide_Level_2");
        }
        if (!node) node = this.resolveGuideNodeByName(name);
        if (node) node.active = active;
    }

    public setGuideOverlayActive(name: string, active: boolean): void {
        const node = this.findChildByNameDeep(this.node, name);
        if (node) node.active = !!active;
    }

    public isViewAlive(): boolean {
        return !!(this && cc.isValid(this) && this.node && cc.isValid(this.node));
    }

    public bindTopBalanceOpenEvent(): void {
        if (!this.node_balanceContainer) return;
        this.node_balanceContainer.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
        this.node_balanceContainer.on(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
        if (this.node_withdrawBtn) {
            this.node_withdrawBtn.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
            this.node_withdrawBtn.on(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
        }
    }

    public openWithMoodView(): void {
        const flow = this.getNewbieGuideFlow();
        if (flow && this.advanceNewbieGuideStep(flow.STEP_TOP_BALANCE)) {
            this.setGuideOverlayActive("guide_1", false);
            this.setStep3GuideTipActive(false);
        }
        this.bool_isStop = true;
        const self = this;
        UIMgr.getInstance().show(UIDefine.withMoodView).then((viewNode: cc.Node) => {
            if (!self.isViewAlive() || !viewNode || !viewNode.isValid) return;
            const cls: any = withMoodView;
            let comp = viewNode.getComponent(cls);
            if (!comp) comp = viewNode.addComponent(cls);
            if (comp && comp.setEntryData) {
                comp.setEntryData({
                    cash_balance: (self.data_topBalanceMock && self.data_topBalanceMock.cash_balance) || 0,
                    user_level: (self.data_topBalanceMock && self.data_topBalanceMock.user_level) || 1
                });
            }
        });
    }

    public hideLegacyTopWidgets(): void {
        const top = this.layer_top || this.findChildByNameDeep(this.node, "top");
        if (!top) return;
        const timeNode = top.getChildByName("time");
        if (timeNode) timeNode.active = this.isCountdownEnabled();
        if (this.enableLegacyTopWidgetRuntimeOverride) {
            const sideBtn = top.getChildByName("btn_cebian");
            if (sideBtn) sideBtn.active = false;
            const addDesktop = top.getChildByName("btn_adddesktop");
            if (addDesktop) addDesktop.active = false;
        }
    }

    public isCountdownEnabled(): boolean {
        return !this.forceDisableCountdown && !!this.showTime;
    }

    public applyCountdownUIState(): void {
        const enabled = this.isCountdownEnabled();
        if (this.txt_time && this.txt_time.node) this.txt_time.node.active = enabled;
        const top = this.layer_top || this.findChildByNameDeep(this.node, "top");
        if (!top) return;
        const timeNode = top.getChildByName("time") || this.findChildByNameDeep(top, "time");
        if (timeNode) timeNode.active = enabled;
    }

    public bindTopBalanceNodesFromPrefab(): boolean {
        const missing: string[] = [];
        const fallbackUsed: string[] = [];
        const warnOnly: string[] = [];
        const autoAssign = !!this.enableTopBindingFallbackAutoAssign;
        const topNode = this.layer_top || this.findChildByNameDeep(this.node, "top");
        const topBalance = this.findChildByNameLike(this.node, "top_balance");
        const navLeft = this.findChildByNameLike(this.node, "nav_left");
        const navRight = this.findChildByNameLike(this.node, "nav_right");
        const moneyNode = this.findChildByNameLike(this.node, "money_text") || this.findChildByNameLike(this.node, "txt_balance") || this.findChildByNameLike(this.node, "money");
        const popNode = this.findChildByNameLike(this.node, "pop_text") || this.findChildByNameLike(this.node, "txt_bubble") || this.findChildByNameLike(this.node, "pop");
        const bigPanel = this.findChildByNameDeep(this.node, "big_barrage_panel");
        const bigLabel = this.findChildByNameDeep(this.node, "big_barrage_label");

        if (!this.node_topBalanceNav && topBalance) {
            if (autoAssign) {
                this.node_topBalanceNav = topBalance;
                fallbackUsed.push("node_topBalanceNav<=top_balance_nav");
            } else {
                warnOnly.push("node_topBalanceNav<=top_balance_nav");
            }
        }
        if (!this.node_balanceContainer && navLeft) {
            if (autoAssign) {
                this.node_balanceContainer = navLeft;
                fallbackUsed.push("node_balanceContainer<=nav_left_bg");
            } else {
                warnOnly.push("node_balanceContainer<=nav_left_bg");
            }
        }
        if (!this.node_withdrawBtn) {
            const withdraw = this.findChildByNameDeep(this.node, "withdraw_btn");
            if (withdraw) {
                this.node_withdrawBtn = withdraw;
                fallbackUsed.push("node_withdrawBtn<=withdraw_btn");
            }
        }
        if (!this.node_bubbleContainer && navRight) {
            if (autoAssign) {
                this.node_bubbleContainer = navRight;
                fallbackUsed.push("node_bubbleContainer<=nav_right_bg");
            } else {
                warnOnly.push("node_bubbleContainer<=nav_right_bg");
            }
        }
        if (!this.lbl_balanceText && moneyNode) {
            if (autoAssign) {
                this.lbl_balanceText = moneyNode.getComponent(cc.Label);
                if (this.lbl_balanceText) fallbackUsed.push("lbl_balanceText<=money_text");
            } else {
                warnOnly.push("lbl_balanceText<=money_text");
            }
        }
        if (!this.rich_bubbleText && popNode) {
            if (autoAssign) {
                this.rich_bubbleText = popNode.getComponent(cc.RichText);
                if (this.rich_bubbleText) fallbackUsed.push("rich_bubbleText<=pop_text");
            } else {
                warnOnly.push("rich_bubbleText<=pop_text");
            }
        }
        if (!this.node_bigBarragePanel && bigPanel) {
            if (autoAssign) {
                this.node_bigBarragePanel = bigPanel;
                fallbackUsed.push("node_bigBarragePanel<=big_barrage_panel");
            } else {
                warnOnly.push("node_bigBarragePanel<=big_barrage_panel");
            }
        }
        if (!this.rich_bigBarrageText && bigLabel) {
            if (autoAssign) {
                this.rich_bigBarrageText = bigLabel.getComponent(cc.RichText);
                if (this.rich_bigBarrageText) fallbackUsed.push("rich_bigBarrageText<=big_barrage_label");
            } else {
                warnOnly.push("rich_bigBarrageText<=big_barrage_label");
            }
        }

        const topChildren = topNode ? topNode.children.map((c) => c.name).join(",") : "";
        console.log("[top_nav] inspector refs", {
            layerTopRef: !!this.layer_top,
            topNavRef: !!this.node_topBalanceNav,
            leftRef: !!this.node_balanceContainer,
            rightRef: !!this.node_bubbleContainer,
            moneyRef: !!this.lbl_balanceText,
            popRef: !!this.rich_bubbleText
        });
        console.log("[top_nav] top node check", {
            topFound: !!topNode,
            topChildren: topChildren,
            topNavByChildName: !!(topNode && topNode.getChildByName("top_balance_nav"))
        });

        if (!this.node_topBalanceNav) missing.push("node_topBalanceNav(cc.Node) -> top_balance_nav");
        if (!this.node_balanceContainer) missing.push("node_balanceContainer(cc.Node) -> nav_left_bg");
        if (!this.node_bubbleContainer) missing.push("node_bubbleContainer(cc.Node) -> nav_right_bg");
        if (!this.lbl_balanceText) missing.push("lbl_balanceText(cc.Label) -> money_text");
        if (!this.rich_bubbleText) missing.push("rich_bubbleText(cc.RichText) -> pop_text");
        if (!this.node_bigBarragePanel) missing.push("node_bigBarragePanel(cc.Node) -> big_barrage_panel");
        if (!this.rich_bigBarrageText) missing.push("rich_bigBarrageText(cc.RichText) -> big_barrage_label");

        if (missing.length > 0) console.warn("[top_nav] 缺少预制体绑定:", missing.join(" | "));
        console.log("[top_nav] locate", {
            topNode: !!this.layer_top,
            navRoot: !!this.node_topBalanceNav,
            leftNode: !!this.node_balanceContainer,
            rightNode: !!this.node_bubbleContainer,
            moneyNode: !!this.lbl_balanceText,
            popNode: !!this.rich_bubbleText,
            moneyLabel: !!this.lbl_balanceText,
            popRich: !!this.rich_bubbleText,
            bigPanel: !!this.node_bigBarragePanel,
            bigText: !!this.rich_bigBarrageText,
            fallbackCount: fallbackUsed.length,
            fallbackMode: autoAssign ? "auto-assign" : "warn-only"
        });
        if (fallbackUsed.length > 0) console.warn("[top_nav] 使用 fallback 自动绑定:", fallbackUsed.join(" | "));
        if (warnOnly.length > 0) console.warn("[top_nav] fallback仅告警(未自动赋值):", warnOnly.join(" | "));
        return missing.length === 0;
    }

    public initTopBarrage(): void {
        this.topBarrageRows = this.collectTopBarrageRows();
        if (!this.topBarrageRows || this.topBarrageRows.length <= 0) return;
        this._initVerticalBarrage();
        this.loadTopBarrageData();
    }

    public _initVerticalBarrage(): void {
        const row = this.topBarrageRows[0];
        if (!row) return;
        this._topBarrageCurItem = row.item;
        this._topBarrageCurIcon = row.icon;
        this._topBarrageCurLabel = row.label;
        row.item.y = 0;
        const nextItem = row.nextItem && row.nextItem.isValid ? row.nextItem : this.findChildByNameDeep(row.track, "barrage_item_next");
        if (nextItem) {
            this._topBarrageNextItem = nextItem;
            this._topBarrageNextItem.y = -(row.track.height || nextItem.height || 54);
            this._topBarrageNextIcon = row.nextIcon && row.nextIcon.isValid ? row.nextIcon : nextItem.children[0] || null;
            const nextLabelNode = row.nextLabelNode && row.nextLabelNode.isValid ? row.nextLabelNode : nextItem.children[1] || null;
            this._topBarrageNextLabel = row.nextLabel && row.nextLabel.node && row.nextLabel.node.isValid ? row.nextLabel : (nextLabelNode ? this.ensureTopBarrageRichText(nextLabelNode) : null);
        } else {
            const clone = cc.instantiate(row.item);
            clone.name = "barrage_item_next";
            clone.parent = row.track;
            clone.y = -row.track.height;
            this._topBarrageNextItem = clone;
            this._topBarrageNextIcon = clone.children[0] || null;
            const cloneLabelNode = clone.children[1] || null;
            this._topBarrageNextLabel = cloneLabelNode ? this.ensureTopBarrageRichText(cloneLabelNode) : null;
        }
    }

    public initBigTopBarrageTrigger(): void {
        if (!this.node_bigBarragePanel || this.bigTopBarrageShown) return;
        this.bigTopBarrageBaseY = this.node_bigBarragePanel.y;
        this.node_bigBarragePanel.y = this.enableBigTopBarrageSlideY ? this.getBigTopBarrageHiddenY() : this.bigTopBarrageBaseY;
        this.node_bigBarragePanel.active = false;
        if (this.rich_bigBarrageText && this.rich_bigBarrageText.node) {
            this.rich_bigBarrageText.node.active = true;
        }
        const minDelay = Math.max(1, this.bigTopBarrageMinDelay || 15);
        const delay = minDelay + (Math.max(minDelay, this.bigTopBarrageMaxDelay || 25) - minDelay) * Math.random();
        this.scheduleOnce(this.tryPlayBigTopBarrage, delay);
    }

    public tryPlayBigTopBarrage(): void {
        if (this.bigTopBarrageShown || !this.node_bigBarragePanel || !this.rich_bigBarrageText) return;
        const data = BarrageDataService.takeOne();
        if (data) this.playBigTopBarrage(data);
    }

    public pickRandomTopBarrageItem(list: any[]): any {
        if (!list || list.length <= 0) return null;
        return list[Math.floor(Math.random() * list.length)] || list[0];
    }

    public playBigTopBarrage(data: any): void {
        if (!this.node_bigBarragePanel || !this.rich_bigBarrageText || !data) return;
        this.currentBigBarrageData = data;
        this.bigTopBarrageShown = true;
        this.node_bigBarragePanel.stopAllActions();
        this.node_bigBarragePanel.active = true;
        this.node_bigBarragePanel.opacity = 0;
        const shownY = this.bigTopBarrageBaseY || this.node_bigBarragePanel.y || 0;
        const hiddenY = this.enableBigTopBarrageSlideY ? this.getBigTopBarrageHiddenY() : shownY;
        this.node_bigBarragePanel.y = hiddenY;
        this.rich_bigBarrageText.node.active = true;
        this.rich_bigBarrageText.string = this.getBigTopBarrageRichText(data);
        this.applyRandomArrowIcon(this.findChildByNameDeep(this.node_bigBarragePanel, "icon_barrage"));
        this.refreshTopBarrageLabelLayout(this.rich_bigBarrageText);

        const show = cc.spawn(
            cc.moveTo(this.bigTopBarrageSlideDuration, this.node_bigBarragePanel.x, shownY).easing(cc.easeSineOut()),
            cc.fadeTo(this.bigTopBarrageSlideDuration, 255)
        );
        const stay = cc.delayTime(this.bigTopBarrageStayDuration || 3);
        const hide = cc.spawn(
            cc.moveTo(this.bigTopBarrageSlideDuration, this.node_bigBarragePanel.x, hiddenY).easing(cc.easeSineIn()),
            cc.fadeTo(this.bigTopBarrageSlideDuration, 0)
        );
        const finish = cc.callFunc(() => {
            this.node_bigBarragePanel.active = false;
            this.node_bigBarragePanel.y = hiddenY;
        }, this);
        this.node_bigBarragePanel.runAction(cc.sequence(show, stay, hide, finish));
    }

    public getBigTopBarrageHiddenY(): number {
        if (!this.node_bigBarragePanel) return this.bigTopBarrageBaseY || 0;
        const height = this.node_bigBarragePanel.height || 0;
        const offset = this.bigTopBarrageHiddenOffset || 220;
        return (this.bigTopBarrageBaseY || 0) + height + offset;
    }

    public collectTopBarrageRows(): any[] {
        const rows: any[] = [];
        for (let i = 0; i < 1; i++) {
            const track = this.findChildByNameDeep(this.node, "barrage_track_" + i);
            let item = this.findChildByNameDeep(this.node, "barrage_item_" + i);
            let icon = this.findChildByNameDeep(this.node, "icon_barrage_" + i);
            let labelNode = this.findChildByNameDeep(this.node, "lbl_barrage_" + i);
            const nextItem = track ? this.findChildByNameDeep(track, "barrage_item_next") : null;
            let nextIcon = nextItem ? this.findChildByNameDeep(nextItem, "icon_barrage_next") : null;
            if (!nextIcon) nextIcon = (nextItem && nextItem.children[0]) || null;
            let nextLabelNode = nextItem ? this.findChildByNameDeep(nextItem, "lbl_barrage_next") : null;
            if (!nextLabelNode) nextLabelNode = (nextItem && nextItem.children[1]) || null;

            if (track && !item && (icon || labelNode)) {
                console.warn("[top_barrage] prefab missing barrage_item_" + i + ", fallback create runtime node");
                item = new cc.Node("barrage_item_" + i);
                item.parent = track;
                item.setContentSize(track.getContentSize());
                item.setPosition(0, 0);
                if (icon) icon.parent = item;
                if (labelNode) labelNode.parent = item;
            }

            const label = this.ensureTopBarrageRichText(labelNode);
            const nextLabel = this.ensureTopBarrageRichText(nextLabelNode);

            if (track && (!nextItem || !nextIcon || !nextLabel)) {
                console.warn("[top_barrage] prefab missing next item structure, fallback clone at runtime");
            }

            if (track && item && icon && label) {
                rows.push({
                    rowIndex: i,
                    track: track,
                    item: item,
                    icon: icon,
                    label: label,
                    nextItem: nextItem,
                    nextIcon: nextIcon,
                    nextLabelNode: nextLabelNode,
                    nextLabel: nextLabel,
                    playIndex: i,
                    currentPlainText: ""
                });
            }
        }
        return rows;
    }

    public collectTopMoneyArrowIconNodes(): cc.Node[] {
        const nodes: cc.Node[] = [];
        const push = (node: cc.Node) => {
            if (!node || !node.isValid) return;
            if (nodes.indexOf(node) >= 0) return;
            nodes.push(node);
        };
        if (this.node_balanceContainer && this.node_balanceContainer.isValid) {
            push(this.findChildByNameDeep(this.node_balanceContainer, "icon"));
        }
        if (this.node_rewardNumIcon && this.node_rewardNumIcon.isValid) {
            push(this.node_rewardNumIcon);
        }
        push(this.findChildByNameDeep(this.node, "icon_barrage"));
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            const row = this.topBarrageRows[i];
            if (row && row.rowIndex === 0) continue;
            if (row && row.icon) push(row.icon);
        }
        return nodes;
    }

    public refreshTopMoneyArrowIcons(): void {
        const self = this;
        const iconNodes = this.collectTopMoneyArrowIconNodes();
        if (!iconNodes || iconNodes.length <= 0) return;
        const imageName = this.topMoneyArrowImageName || "money_arrow_icon";
        const reqVersion = ++this.topMoneyArrowReqVersion;
        const primaryPath = CountryAssetService.getPathByImageName(imageName);
        const fallbackPath = CountryAssetService.getPathByImageName(imageName, "ID");

        const applyFrame = (frame: cc.SpriteFrame) => {
            if (reqVersion !== self.topMoneyArrowReqVersion || !frame) return;
            for (let i = 0; i < iconNodes.length; i++) {
                const node = iconNodes[i];
                if (!node || !node.isValid) continue;
                const sprite = node.getComponent(cc.Sprite);
                if (sprite) sprite.spriteFrame = frame;
            }
        };

        ResMgr.getInstance().loadRes(primaryPath, cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
            if (frame) {
                applyFrame(frame);
            } else if (fallbackPath && fallbackPath !== primaryPath) {
                ResMgr.getInstance().loadRes(fallbackPath, cc.SpriteFrame, self, "game").then((fallbackFrame: cc.SpriteFrame) => {
                    if (fallbackFrame) {
                        applyFrame(fallbackFrame);
                    } else {
                        cc.warn("[gameView] load money_arrow_icon fallback failed:", fallbackPath);
                    }
                });
            } else {
                cc.warn("[gameView] load money_arrow_icon failed:", primaryPath);
            }
        });
    }

    public ensureTopBarrageRichText(node: cc.Node): cc.RichText {
        if (!node) return null;
        const label = node.getComponent(cc.Label);
        let richText = node.getComponent(cc.RichText);
        if (label) label.enabled = false;
        if (richText) {
            if (!richText.lineHeight) richText.lineHeight = this.topBarrageLineHeight;
            if (!richText.fontSize) richText.fontSize = this.topBarrageFontSize;
        } else {
            richText = node.addComponent(cc.RichText);
            richText.maxWidth = 0;
            richText.lineHeight = this.topBarrageLineHeight;
            richText.fontSize = this.topBarrageFontSize;
        }
        if (!richText.string) richText.string = "";
        return richText;
    }

    public loadTopBarrageData(): void {
        BarrageDataService.ensureStarted();
        this.startTopBarrageRows();
    }

    public startTopBarrageRows(): void {
        if (this._barragesPaused) return;
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            this.playTopBarrageByRow(i);
        }
    }

    public stopTopBarrageRows(): void {
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            const row = this.topBarrageRows[i];
            if (row && row.item) row.item.stopAllActions();
            if (row && row._retryTimer) {
                clearTimeout(row._retryTimer);
                row._retryTimer = null;
            }
        }
        if (this._topBarrageCurItem) this._topBarrageCurItem.stopAllActions();
        if (this._topBarrageNextItem) this._topBarrageNextItem.stopAllActions();
    }

    public playTopBarrageByRow(index: number): void {
        if (this._barragesPaused) return;
        const self = this;
        const row = this.topBarrageRows[index];
        if (!row || !row.track) return;
        const curItem = this._topBarrageCurItem;
        const curLabel = this._topBarrageCurLabel;
        if (!curItem || !curLabel) return;

        curItem.stopAllActions();
        if (this._topBarrageNextItem) this._topBarrageNextItem.stopAllActions();
        if (row._retryTimer) {
            clearTimeout(row._retryTimer);
            row._retryTimer = null;
        }

        const data = BarrageDataService.takeOne();
        if (data) {
            row.currentPlainText = this.getTopBarragePlainText(data);
            curLabel.string = this.getTopBarrageRichText(data);
            if (this.enableTopBarrageDynamicLayout) this.refreshTopBarrageLabelLayout(curLabel);
            this._alignBarrageIconToLabel(this._topBarrageCurIcon, curLabel, row.currentPlainText);
            curItem.x = 0;
            curItem.y = 0;
            this._scheduleNextBarrageScroll(index);
        } else {
            row.currentPlainText = this.i18n("key_common_barrage_empty");
            curLabel.string = "<color=" + this.topBarrageNormalColor + ">" + this.i18n("key_common_barrage_empty") + "</color>";
            if (this.enableTopBarrageDynamicLayout) this.refreshTopBarrageLabelLayout(curLabel);
            this._alignBarrageIconToLabel(this._topBarrageCurIcon, curLabel, row.currentPlainText);
            curItem.x = 0;
            curItem.y = 0;
            row._retryTimer = setTimeout(() => {
                row._retryTimer = null;
                self.playTopBarrageByRow(index);
            }, 2000);
        }
    }

    public _scheduleNextBarrageScroll(index: number): void {
        if (this._barragesPaused) return;
        const self = this;
        if (!this.topBarrageRows[index]) return;
        const curItem = this._topBarrageCurItem;
        if (!curItem) return;
        const stay = this.topBarrageStayDuration || 4;
        curItem.runAction(cc.sequence(cc.delayTime(stay), cc.callFunc(() => {
            self._doBarrageScrollUp(index);
        })));
    }

    public _doBarrageScrollUp(index: number): void {
        if (this._barragesPaused) return;
        const self = this;
        const row = this.topBarrageRows[index];
        if (!row || !row.track) return;
        const curItem = this._topBarrageCurItem;
        const nextItem = this._topBarrageNextItem;
        const nextLabel = this._topBarrageNextLabel;
        if (!curItem || !nextItem || !nextLabel) {
            this.playTopBarrageByRow(index);
            return;
        }

        const data = BarrageDataService.takeOne();
        const emptyText = this.i18n("key_common_barrage_empty");
        const plainText = data ? this.getTopBarragePlainText(data) : emptyText;
        nextLabel.string = data ? this.getTopBarrageRichText(data) : "<color=" + this.topBarrageNormalColor + ">" + emptyText + "</color>";
        this.applyRandomArrowIcon(this._topBarrageNextIcon);
        if (this.enableTopBarrageDynamicLayout) this.refreshTopBarrageLabelLayout(nextLabel);
        this._alignBarrageIconToLabel(this._topBarrageNextIcon, nextLabel, plainText);

        const trackHeight = row.track.height || 34;
        const duration = this.topBarrageScrollDuration || 0.4;
        nextItem.x = 0;
        nextItem.y = -trackHeight;
        curItem.stopAllActions();
        nextItem.stopAllActions();

        const moveCur = cc.moveBy(duration, 0, trackHeight).easing(cc.easeSineInOut());
        const moveNext = cc.moveBy(duration, 0, trackHeight).easing(cc.easeSineInOut());
        const swap = cc.callFunc(() => {
            const oldCurItem = self._topBarrageCurItem;
            const oldCurIcon = self._topBarrageCurIcon;
            const oldCurLabel = self._topBarrageCurLabel;
            self._topBarrageCurItem = self._topBarrageNextItem;
            self._topBarrageCurIcon = self._topBarrageNextIcon;
            self._topBarrageCurLabel = self._topBarrageNextLabel;
            self._topBarrageNextItem = oldCurItem;
            self._topBarrageNextIcon = oldCurIcon;
            self._topBarrageNextLabel = oldCurLabel;
            self._topBarrageCurItem.y = 0;
            self._topBarrageNextItem.y = -trackHeight;
            self._scheduleNextBarrageScroll(index);
        });

        nextItem.runAction(moveNext);
        curItem.runAction(cc.sequence(moveCur, swap));
    }

    public getTopBarrageDuration(): number {
        let min = this.topBarrageMinDuration || 8;
        let max = this.topBarrageMaxDuration || 11;
        if (max < min) {
            const tmp = min;
            min = max;
            max = tmp;
        }
        return min + (max - min) * Math.random();
    }

    public layoutTopBarrageRow(row: any): void {
        if (!row || !row.item || !row.icon || !row.label) return;
        const iconWidth = row.icon.width || 0;
        const labelWidth = this.getTopBarrageLabelWidth(row);
        const totalWidth = iconWidth + this.topBarrageGap + labelWidth;
        row.item.width = totalWidth;
        row.icon.x = -totalWidth / 2 + iconWidth / 2;
        row.label.node.x = row.icon.x + iconWidth / 2 + this.topBarrageGap + labelWidth / 2;
    }

    public _alignBarrageIconToLabel(iconNode: cc.Node, label: cc.RichText, plainText: string): void {
        if (!iconNode || !iconNode.isValid || !label || !label.node || !label.node.isValid) return;
        const iconWidth = iconNode.width || 0;
        const labelNode = label.node;
        let labelWidth = labelNode.width || 0;
        if (labelWidth <= 0 && plainText) {
            labelWidth = Math.ceil(0.58 * (this.topBarrageFontSize || 22) * String(plainText).length);
        }
        if (labelWidth <= 0) return;
        const gap = this.topBarrageGap || 0;
        iconNode.x = labelNode.x - labelWidth / 2 - gap - iconWidth / 2;
    }

    public getTopBarragePlainText(data: any): string {
        if (!data) return "";
        const name = data.name || this.i18n("key_common_user_default");
        const amountText = data.amount !== undefined ? this.getBarrageCurrencyText("RP", data.amount) : "";
        if (!amountText && data.text) return data.text;
        return this.i18n("key_game_top_barrage_plain", [name, amountText]);
    }

    public getTopBarrageRichText(data: any): string {
        const normalColor = this.topBarrageNormalColor;
        const highlightColor = this.topBarrageHighlightColor;
        if (!data) return "<color=" + normalColor + ">" + this.i18n("key_common_barrage_empty") + "</color>";
        const name = data.name || this.i18n("key_common_user_default");
        const amountText = data.amount !== undefined ? this.getBarrageCurrencyText("RP", data.amount) : "";
        if (!amountText && data.text) return "<color=" + normalColor + ">" + data.text + "</color>";

        const parts = this.i18n("key_game_top_barrage_plain", ["", ""]).split("");
        if (parts.length < 2) {
            return "<color=" + normalColor + ">" + this.i18n("key_game_top_barrage_plain", [name, amountText]) + "</color>";
        }
        const tail = parts[1].split("");
        let result = "<color=" + normalColor + ">" + parts[0] + name + tail[0] + "</color><color=" + highlightColor + ">" + amountText + "</color>";
        if (tail[1]) result += "<color=" + normalColor + ">" + tail[1] + "</color>";
        return result;
    }

    public getBigTopBarrageRichText(data: any): string {
        if (!data) return "<color=#FFFFFF>" + this.i18n("key_common_barrage_empty") + "</color>";
        const name = data.name || this.i18n("key_common_user_default");
        const amountText = data.amount !== undefined ? this.getBarrageCurrencyText("RP", data.amount) : "";
        if (!amountText && data.text) return "<color=#FFFFFF>" + data.text + "</color>";

        const parts = this.i18n("key_barrage_success_plain", ["", ""]).split("");
        if (parts.length < 2) {
            return "<color=#FFFFFF>" + this.i18n("key_barrage_success_plain", [name, amountText]) + "</color>";
        }
        const tail = parts[1].split("");
        let result = "<color=#FFFFFF>" + parts[0] + name + tail[0] + "</color><color=#FF0000>" + amountText + "</color>";
        if (tail[1]) result += "<color=#FFFFFF>" + tail[1] + "</color>";
        return result;
    }

    public loadTopBarrageArrowImages(): void {
        const self = this;
        const reqVersion = ++this._topBarrageArrowReqVersion;
        const names = ["with_arrow_1", "with_arrow_2", "with_arrow_3", "with_arrow_4"];
        const paths = names.map((n) => CountryAssetService.getPathByImageName(n));
        const frames: cc.SpriteFrame[] = new Array(names.length);
        let remain = names.length;

        const onOneFinished = () => {
            remain--;
            if (remain > 0) return;
            if (reqVersion !== self._topBarrageArrowReqVersion) return;
            self._topBarrageArrowFrames = frames.filter((f) => !!f);
            if (self._topBarrageArrowFrames.length) {
                self.applyRandomArrowIcon(self._topBarrageCurIcon);
                self.applyRandomArrowIcon(self._topBarrageNextIcon);
                self.applyRandomArrowIcon(self.node_bigBarragePanel && self.findChildByNameDeep(self.node_bigBarragePanel, "icon_barrage"));
            } else {
                cc.warn("[gameView] with_arrow images all failed to load");
            }
        };

        paths.forEach((path, idx) => {
            ResMgr.getInstance().loadRes(path, cc.SpriteFrame, self, "game").then((frame: cc.SpriteFrame) => {
                frames[idx] = frame || null;
                onOneFinished();
            });
        });
    }

    public applyRandomArrowIcon(iconNode: cc.Node): void {
        const frames = this._topBarrageArrowFrames;
        if (!frames || !frames.length || !iconNode || !iconNode.isValid) return;
        const sprite = iconNode.getComponent(cc.Sprite);
        if (sprite) sprite.spriteFrame = frames[Math.floor(Math.random() * frames.length)];
    }

    public refreshTopBarrageLabelLayout(label: cc.RichText): void {
        if (!this.enableTopBarrageDynamicLayout || !label) return;
        const richText: any = label;
        if (richText._forceUpdateRenderData) richText._forceUpdateRenderData(true);
        if (richText.node && richText.node.getContentSize) {
            richText.node.setContentSize(richText.node.getContentSize());
        }
    }

    public getTopBarrageLabelWidth(row: any): number {
        if (!row || !row.label || !row.label.node) return 0;
        const width = row.label.node.width || 0;
        if (width > 0) return width;
        if (row.currentPlainText) {
            const estimated = Math.ceil(0.58 * this.topBarrageFontSize * row.currentPlainText.length);
            if (estimated > 0) return estimated;
        }
        const fallback = ((row.track && row.track.width) || 0) - ((row.icon && row.icon.width) || 0) - this.topBarrageGap - 8;
        return fallback > 80 ? fallback : 80;
    }

    public findChildByNameDeep(node: cc.Node, name: string): cc.Node {
        if (!node) return null;
        if (node.name === name) return node;
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findChildByNameDeep(node.children[i], name);
            if (found) return found;
        }
        return null;
    }

    public findChildByNameLike(node: cc.Node, keyword: string): cc.Node {
        if (!node || !keyword) return null;
        const lower = keyword.toLowerCase();
        if (node.name && node.name.toLowerCase().indexOf(lower) >= 0) return node;
        for (let i = 0; i < node.childrenCount; i++) {
            const found = this.findChildByNameLike(node.children[i], keyword);
            if (found) return found;
        }
        return null;
    }

    public normalizeTaskPointNum(value: any): number {
        const num = Number(value);
        if (!isFinite(num) || num < 0) return 0;
        return Math.floor(num);
    }

    public updateTaskPointNum(taskPoint: any, ltvTaskPoint: any): void {
        this.taskPointNum = this.normalizeTaskPointNum(taskPoint);
        this.ltvTaskPointNum = this.normalizeTaskPointNum(ltvTaskPoint);
        PlayerDataStore.task_point_num = this.taskPointNum;
        PlayerDataStore.ltv_task_point_num = this.ltvTaskPointNum;
        this.refreshTaskEntryRedPoint();
    }

    public refreshTaskEntryRedPoint(): void {
        this.ensureRuntimeNodeRefs();
        if (this.node_taskRedPoint && this.node_taskRedPoint.isValid) {
            this.node_taskRedPoint.active = this.taskPointNum > 0 || this.ltvTaskPointNum > 0;
        }
    }

    public initTaskEntryRedPoint(): void {
        this.taskPointNum = this.normalizeTaskPointNum(PlayerDataStore.task_point_num);
        this.ltvTaskPointNum = this.normalizeTaskPointNum(PlayerDataStore.ltv_task_point_num);
        this.refreshTaskEntryRedPoint();
    }

    public initRewardNumDisplay(): void {
        this.ensureRuntimeNodeRefs();
        console.log("[reward_num] init node=" + !!this.node_rewardNum + " label=" + !!this.lbl_rewardNumText);
        this.hideRewardNumDisplay();
    }

    public onArrowRewardClaimed(data: any): void {
        try {
            console.log("[reward_num] onArrowRewardClaimed data=" + JSON.stringify(data || {}) + " hasParse=" + (this && typeof this.parseRewardNumValue));
            const parsed = this.parseRewardNumValue(data && data.reward_amount);
            console.log("[reward_num] onArrowRewardClaimed parsed=" + parsed);
            if (parsed === null || parsed <= 0) {
                console.warn("[reward_num] onArrowRewardClaimed: reward_amount 无效或<=0 skip, parsed=" + parsed);
                return;
            }
            this.showRewardNumDisplay(parsed);
        } catch (e) {
            console.error("[reward_num] onArrowRewardClaimed exception", e);
        }
    }

    public parseRewardNumValue(value: any): number {
        if (value === null || value === undefined) return null;
        let source = value;
        if (typeof source === "string") {
            source = source.replace(/,/g, "").trim();
            if (!source.length) return null;
        }
        const num = Number(source);
        return isFinite(num) ? Math.max(0, Math.floor(num)) : null;
    }

    public canDelayTopBalanceUpdateForFly(rewardAmount: number): boolean {
        if (!(rewardAmount > 0)) return false;
        this.ensureRuntimeNodeRefs();
        return !!(this.node && this.node.isValid && this.node_rewardNum && this.node_rewardNum.isValid && this.node_rewardNumIcon && this.node_rewardNumIcon.isValid && this._getBalanceIconNode() && ((this.sp_rewardNumIcon && this.sp_rewardNumIcon.spriteFrame) || this._flyMoneyIconFrame));
    }

    public queueTopBalanceAfterFly(cashBalance: any): boolean {
        if (!this.data_topBalanceMock) return false;
        const num = Number(cashBalance);
        if (!isFinite(num)) return false;
        this._pendingTopBalanceAfterFly = Math.max(0, num);
        this._hasPendingTopBalanceAfterFly = true;
        this.unschedule(this.flushPendingTopBalanceAfterFly);
        const delay = Math.max(0, this.rewardNumFlyDelay || 2.5) + 2;
        this.scheduleOnce(this.flushPendingTopBalanceAfterFly, delay);
        return true;
    }

    public clearPendingTopBalanceAfterFly(): void {
        this._pendingTopBalanceAfterFly = null;
        this._hasPendingTopBalanceAfterFly = false;
        this.unschedule(this.flushPendingTopBalanceAfterFly);
    }

    public flushPendingTopBalanceAfterFly(): void {
        if (!this._hasPendingTopBalanceAfterFly) return;
        const value = Number(this._pendingTopBalanceAfterFly);
        this.clearPendingTopBalanceAfterFly();
        if (isFinite(value)) {
            this.updateTopBalance(value);
            this.refreshTopBalanceUI();
        }
    }

    public showRewardNumDisplay(rewardAmount: any): void {
        this.ensureRuntimeNodeRefs();
        if (!this.node_rewardNum || !this.node_rewardNum.isValid) {
            console.warn("[reward_num] showRewardNumDisplay: reward_num 节点不存在");
            return;
        }
        let amount = Number(rewardAmount);
        if (!isFinite(amount) || amount < 0) amount = 0;
        if (amount <= 0) {
            console.warn("[reward_num] showRewardNumDisplay: 金额<=0 skip, rewardAmount=" + rewardAmount);
            this._rewardNumFlyAmount = 0;
            this.unschedule(this.playRewardNumRedPacketFlyAnim);
            this.hideRewardNumDisplay();
            return;
        }

        this._rewardNumFlyAmount = Math.floor(amount);
        let text = "";
        if (cc.isValid(this.lbl_rewardNumText)) {
            text = "+" + this.getCurrencyText("RP", this._rewardNumFlyAmount);
            this.lbl_rewardNumText.string = text;
        } else {
            console.warn("[reward_num] showRewardNumDisplay: lbl_text 组件不存在");
        }
        console.log("[reward_num] show amount=" + rewardAmount + " text=" + text + " activeBefore=" + this.node_rewardNum.active);
        if (this.node_rewardNum.parent && this.node_rewardNum.parent.isValid) {
            this.node_rewardNum.setSiblingIndex(this.node_rewardNum.parent.childrenCount - 1);
        }
        cc.Tween.stopAllByTarget(this.node_rewardNum);
        this.node_rewardNum.active = true;
        const fadeIn = Math.max(0, this.rewardNumFadeInDuration || 0);
        this.node_rewardNum.opacity = fadeIn > 0 ? 0 : 255;
        if (fadeIn > 0) {
            cc.tween(this.node_rewardNum).to(fadeIn, { opacity: 255 }, { easing: "sineOut" }).start();
        }
        const flyDelay = Math.max(0, this.rewardNumFlyDelay || 2.5);
        console.log("[reward_num] show done active=" + this.node_rewardNum.active + " sibling=" + this.node_rewardNum.getSiblingIndex());
        console.log("[NewbieGuide] showRewardNumDisplay: 调度飞钱动画 delay=" + flyDelay + "s step=" + this.getNewbieGuideStep());
        this.unschedule(this.playRewardNumRedPacketFlyAnim);
        this.scheduleOnce(this.playRewardNumRedPacketFlyAnim, flyDelay);
        this.unschedule(this.hideRewardNumDisplay);
        this.scheduleOnce(this.hideRewardNumDisplay, Math.max(0, this.rewardNumShowDuration || 3));
    }

    public playRewardNumRedPacketFlyAnim(): void {
        this.ensureRuntimeNodeRefs();
        const self = this;
        const parent = this.node;
        const finish = (reason: string) => {
            console.log("[NewbieGuide] finishFly: reason=" + (reason || "flyAnimComplete"));
            self.flushPendingTopBalanceAfterFly();
            self.tryAdvanceStep3AfterRewardFly();
        };

        if (!parent || !parent.isValid) {
            finish("parentNode无效");
            return;
        }
        if (!this.node_rewardNum || !this.node_rewardNum.isValid || !this.node_rewardNum.active) {
            console.log("[NewbieGuide] playFlyAnim跳过: rewardNum=" + !!this.node_rewardNum + " valid=" + !!(this.node_rewardNum && this.node_rewardNum.isValid) + " active=" + !!(this.node_rewardNum && this.node_rewardNum.active));
            finish("rewardNum无效或隐藏");
            return;
        }
        if (!this.node_rewardNumIcon || !this.node_rewardNumIcon.isValid) {
            finish("rewardNumIcon无效");
            return;
        }
        const targetIcon = this._getBalanceIconNode();
        if (!targetIcon) {
            finish("balanceIcon无效");
            return;
        }
        const startWorld = FlyRewardAnimMgr.getWorldPos(this.node_rewardNumIcon);
        const endWorld = FlyRewardAnimMgr.getWorldPos(targetIcon);
        if (!startWorld || !endWorld) {
            finish("worldPos无效");
            return;
        }
        const iconFrame = this._flyMoneyIconFrame || (this.sp_rewardNumIcon && this.sp_rewardNumIcon.spriteFrame);
        if (!iconFrame) {
            finish("iconFrame无效");
            return;
        }
        let rewardText = "";
        if (this._rewardNumFlyAmount > 0) rewardText = FlyRewardAnimMgr.formatRewardText(this._rewardNumFlyAmount);
        FlyRewardAnimMgr.playFlyAnim({
            iconFrame: iconFrame,
            startPos: parent.convertToNodeSpaceAR(startWorld),
            endPos: parent.convertToNodeSpaceAR(endWorld),
            parentNode: parent,
            count: 10,
            launchInterval: 0.1,
            startScale: 1,
            endScale: 0.5,
            targetIconNode: targetIcon,
            rewardText: rewardText,
            onAllArrived: () => {
                self._rewardNumFlyAmount = 0;
                finish("flyAnimComplete");
            },
            sfx: "audio/coin_collect",
            sfxBundle: InterfaceMgr.bundleName.game
        });
    }

    public hideRewardNumDisplay(): void {
        this.unschedule(this.playRewardNumRedPacketFlyAnim);
        if (!this.node_rewardNum || !this.node_rewardNum.isValid) return;
        if (this.node_rewardNum.active) console.log("[reward_num] hide");
        cc.Tween.stopAllByTarget(this.node_rewardNum);
        const fadeOut = Math.max(0, this.rewardNumFadeOutDuration || 0);
        if (fadeOut <= 0 || !this.node_rewardNum.active) {
            this.node_rewardNum.opacity = 0;
            this.node_rewardNum.active = false;
            return;
        }
        const node = this.node_rewardNum;
        cc.tween(node).to(fadeOut, { opacity: 0 }, { easing: "sineOut" }).call(() => {
            if (node && node.isValid) node.active = false;
        }).start();
    }

    public onUserInfoUpdated(data: any): void {
        let rewardAmount: number = null;
        try {
            rewardAmount = this.parseRewardNumValue(data && data.cash_reward);
            if (rewardAmount !== null && rewardAmount > 0) {
                console.log("[reward_num] onUserInfoUpdated cash_reward=" + rewardAmount);
                this.showRewardNumDisplay(rewardAmount);
            } else if (rewardAmount === 0) {
                console.log("[reward_num] onUserInfoUpdated cash_reward=0 skip fly anim");
            }
        } catch (e) {
            console.error("[reward_num] onUserInfoUpdated exception", e);
        }

        if (!data || (data.task_point_num === undefined && data.ltv_task_point_num === undefined)) {
            this.refreshTaskEntryRedPoint();
        } else {
            const taskPoint = data.task_point_num !== undefined ? data.task_point_num : this.taskPointNum;
            const ltvTaskPoint = data.ltv_task_point_num !== undefined ? data.ltv_task_point_num : this.ltvTaskPointNum;
            this.updateTaskPointNum(taskPoint, ltvTaskPoint);
        }

        if (data && this.data_topBalanceMock) {
            const shouldDelay = data.cash_balance !== undefined && this.canDelayTopBalanceUpdateForFly(rewardAmount) && this.queueTopBalanceAfterFly(data.cash_balance);
            if (!shouldDelay) {
                this.clearPendingTopBalanceAfterFly();
                if (data.cash_balance !== undefined) {
                    this.updateTopBalance(Number(data.cash_balance));
                }
            }
            if (data.bubble_balance !== undefined) this.data_topBalanceMock.bubble_balance = data.bubble_balance;
            if (data.user_level !== undefined) this.data_topBalanceMock.user_level = data.user_level;
            if (data.extract_money !== undefined) this.data_topBalanceMock.money = data.extract_money;
            if (data.bubble_status !== undefined) this.data_topBalanceMock.bubble_status = data.bubble_status;
            if (data.levels_passed_count !== undefined) this.data_topBalanceMock.levels_passed_count = data.levels_passed_count;
            if (data.current_extract_levels_passed_count !== undefined) this.data_topBalanceMock.current_extract_levels_passed_count = data.current_extract_levels_passed_count;
            if (data.levels_passed_limit !== undefined) this.data_topBalanceMock.levels_passed_limit = data.levels_passed_limit;
            if (data.sign_in_days !== undefined) this.data_topBalanceMock.sign_in_days = data.sign_in_days;
            if (data.sign_in_limit !== undefined) this.data_topBalanceMock.sign_in_limit = data.sign_in_limit;
            if (data.extract_user_level !== undefined) this.data_topBalanceMock.user_level = data.extract_user_level;
            if (data.level_limit !== undefined) this.data_topBalanceMock.level_limit = data.level_limit;
            this.refreshTopBalanceUI();
            this.initTishiBtnstate();
            this.initFuzhuBtnstate();
        }
    }

    public pauseBarrage(): void {
        if (this._barragesPaused) return;
        console.log("[barrage] pause");
        this._barragesPaused = true;
        this.stopTopBarrageRows();
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            const row = this.topBarrageRows[i];
            if (!row || !row.track) continue;
            row.track.stopAllActions();
            const track = row.track;
            cc.tween(track).to(0.3, { opacity: 0 }).call(() => {
                track.active = false;
            }).start();
        }
        if (this.node_bigBarragePanel) {
            const panel = this.node_bigBarragePanel;
            panel.stopAllActions();
            cc.tween(panel).to(0.3, { opacity: 0 }).call(() => {
                panel.active = false;
            }).start();
        }
    }

    public resumeBarrage(): void {
        if (!this._barragesPaused) return;
        console.log("[barrage] resume");
        this._barragesPaused = false;
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            const row = this.topBarrageRows[i];
            if (!row || !row.track) continue;
            row.track.active = true;
            row.track.opacity = 0;
            cc.tween(row.track).delay(0.5).to(0.5, { opacity: 255 }).start();
        }
        this.startTopBarrageRows();
    }

    public onSettleRewardOpen(): void {
        this.pauseBarrage();
    }

    public onSettleRewardClose(): void {
        this.resumeBarrage();
        const self = this;
        const flow = this.getNewbieGuideFlow();
        const step = this.getNewbieGuideStep();
        console.log("[NewbieGuide] onSettleRewardClose: currentStep=" + step + " STEP_SETTLE=" + (flow && flow.STEP_SETTLE_LEVEL1));
        if (flow && this.isNewbieGuideStep(flow.STEP_SETTLE_LEVEL1)) {
            console.log("[NewbieGuide] onSettleRewardClose: 步骤=2，启动4s兜底定时器");
            this.scheduleOnce(() => {
                if (!self.isViewAlive()) return;
                const currentFlow = self.getNewbieGuideFlow();
                const currentStep = self.getNewbieGuideStep();
                console.log("[NewbieGuide] onSettleRewardClose 兜底触发: currentStep=" + currentStep + " STEP_SETTLE=" + (currentFlow && currentFlow.STEP_SETTLE_LEVEL1));
                if (currentFlow && self.isNewbieGuideStep(currentFlow.STEP_SETTLE_LEVEL1)) {
                    console.log("[NewbieGuide] onSettleRewardClose: 兜底推进引导 step2→step3");
                    self.newbieGuidePendingLevelPassSettleClose = false;
                    self.advanceNewbieGuideStep(currentFlow.STEP_SETTLE_LEVEL1);
                    self.refreshNewbieGuideState();
                } else {
                    console.log("[NewbieGuide] onSettleRewardClose 兜底: 步骤已推进到" + currentStep + "，跳过");
                }
            }, 4);
        }
        this.refreshNewbieGuideState();
    }

    public tryAdvanceStep3AfterRewardFly(): boolean {
        const flow = this.getNewbieGuideFlow();
        const step = this.getNewbieGuideStep();
        console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: 进入 currentStep=" + step + " flow=" + !!flow);
        if (!flow) return false;
        if (!this.isNewbieGuideStep(flow.STEP_SETTLE_LEVEL1)) {
            console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: 跳过，当前步骤=" + step + " 不是STEP_SETTLE_LEVEL1=" + flow.STEP_SETTLE_LEVEL1);
            return false;
        }
        this.newbieGuidePendingLevelPassSettleClose = false;
        const advanced = this.advanceNewbieGuideStep(flow.STEP_SETTLE_LEVEL1);
        console.log("[NewbieGuide] tryAdvanceStep3AfterRewardFly: advanceResult=" + advanced + " newStep=" + this.getNewbieGuideStep());
        this.refreshNewbieGuideState();
        return true;
    }

    public initTopBalanceMockData(): void {
        const userData = UserData.getInstance();
        this.data_topBalanceMock = {
            cash_balance: userData.cash_balance || 0,
            money: userData.extract_money || 0,
            bubble_status: userData.bubble_status || 0,
            levels_passed_count: userData.levels_passed_count || 0,
            current_extract_levels_passed_count: userData.current_extract_levels_passed_count || 0,
            levels_passed_limit: userData.levels_passed_limit || 0,
            sign_in_days: userData.sign_in_days || 0,
            sign_in_limit: userData.sign_in_limit || 7,
            user_level: userData.extract_user_level || 0,
            level_limit: userData.level_limit || 29,
            bubble_balance: userData.bubble_balance || 0
        };
    }

    public startTopBalanceMockUpdate(): void {
    }

    public mockTopBalanceTick(): void {
    }

    public updateTopBalance(cashBalance: number): void {
        if (!this.data_topBalanceMock) return;
        this.data_topBalanceMock.cash_balance = Math.max(0, cashBalance);
    }

    public refreshTopBalanceUI(): void {
        if (this.lbl_balanceText) {
            this.lbl_balanceText.string = this.getCurrencyText("RP", this.data_topBalanceMock.cash_balance);
        }
        const payload = this.getTopBubbleI18nPayload();
        if (this.node_bubbleContainer) this.node_bubbleContainer.active = true;
        if (this.rich_bubbleText && this.rich_bubbleText.node) this.rich_bubbleText.node.active = true;
        this.applyTopBubbleI18n(payload);
    }

    public ensureTopBubbleI18nLabel(): void {
        if (!this.rich_bubbleText || !this.rich_bubbleText.node) return;
        let label: any = this.rich_bubbleText.node.getComponent("I18nLabel");
        if (!label) label = this.rich_bubbleText.node.addComponent("I18nLabel");
        if (label) {
            label.targetRichText = this.rich_bubbleText;
            label.targetLabel = null;
            this.i18nBubbleLabelComp = label;
            this.initTopBubbleAutoFitConfig();
        }
    }

    public initTopBubbleAutoFitConfig(): void {
        if (!this.rich_bubbleText) return;
        this.topBubbleBaseFontSize = Math.max(1, this.rich_bubbleText.fontSize || this.topBubbleBaseFontSize || 20);
        this.topBubbleBaseLineHeight = Math.max(1, this.rich_bubbleText.lineHeight || this.topBubbleBaseLineHeight || this.topBubbleBaseFontSize);
    }

    public scheduleTopBubbleAutoFit(): void {
        if (!this.enableTopBubbleAutoFit) return;
        if (!this.rich_bubbleText || !this.rich_bubbleText.node) {
            console.log("[top_bubble_fit] skip schedule: rich text missing");
            return;
        }
        console.log("[top_bubble_fit] schedule", {
            text: this.rich_bubbleText.string,
            fontSize: this.rich_bubbleText.fontSize,
            lineHeight: this.rich_bubbleText.lineHeight
        });
        this.unschedule(this.fitTopBubbleRichText);
        this.unschedule(this.fitTopBubbleRichTextDeferred);
        this.scheduleOnce(this.fitTopBubbleRichText, 0);
        this.scheduleOnce(this.fitTopBubbleRichTextDeferred, 0.05);
    }

    public fitTopBubbleRichTextDeferred(): void {
        if (!this.enableTopBubbleAutoFit) return;
        this.fitTopBubbleRichText();
    }

    public getTopBubbleRenderedSize(): cc.Size {
        if (!this.rich_bubbleText) return cc.size(0, 0);
        const richText: any = this.rich_bubbleText;
        const children = richText.node ? richText.node.children : null;
        if (children && children.length > 0) {
            let minX = Number.POSITIVE_INFINITY;
            let minY = Number.POSITIVE_INFINITY;
            let maxX = Number.NEGATIVE_INFINITY;
            let maxY = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child) continue;
                const box = child.getBoundingBox();
                minX = Math.min(minX, box.x);
                minY = Math.min(minY, box.y);
                maxX = Math.max(maxX, box.x + box.width);
                maxY = Math.max(maxY, box.y + box.height);
            }
            if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
                return cc.size(Math.max(0, maxX - minX), Math.max(0, maxY - minY));
            }
        }
        if (richText._labelWidth > 0 && richText._labelHeight > 0) {
            return cc.size(richText._labelWidth, richText._labelHeight);
        }
        const segments = richText._labelSegments;
        if (!segments || segments.length <= 0) return richText.node.getContentSize();
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            if (!segment || !segment.node) continue;
            const box = segment.node.getBoundingBoxToWorld();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        }
        if (isFinite(minX) && isFinite(minY) && isFinite(maxX) && isFinite(maxY)) {
            return cc.size(Math.max(0, maxX - minX), Math.max(0, maxY - minY));
        }
        return richText.node.getContentSize();
    }

    public getTopBubbleContainerSize(): cc.Size {
        if (this.topBubbleFitWidth > 0 && this.topBubbleFitHeight > 0) {
            return cc.size(this.topBubbleFitWidth, this.topBubbleFitHeight);
        }
        if (!this.rich_bubbleText || !this.rich_bubbleText.node) return cc.size(0, 0);
        const node = this.rich_bubbleText.node;
        const contentSize = node.getContentSize();
        const parent = node.parent;
        const widget = node.getComponent(cc.Widget);
        if (parent && widget) {
            const parentSize = parent.getContentSize();
            const left = Math.max(0, widget.left || 0);
            const right = Math.max(0, widget.right || 0);
            const top = Math.max(0, widget.top || 0);
            const bottom = Math.max(0, widget.bottom || 0);
            const width = Math.max(1, parentSize.width - left - right);
            const height = Math.max(1, parentSize.height - top - bottom);
            return cc.size(width, height);
        }
        return contentSize;
    }

    public fitTopBubbleRichText(): void {
        if (!this.enableTopBubbleAutoFit) return;
        if (!this.rich_bubbleText || !this.rich_bubbleText.node) {
            console.log("[top_bubble_fit] skip fit: rich text missing");
            return;
        }
        const richText: any = this.rich_bubbleText;
        const container = this.getTopBubbleContainerSize();
        let baseFont = Math.max(1, this.topBubbleBaseFontSize || richText.fontSize || 20);
        baseFont = Math.min(baseFont, Math.max(1, this.topBubbleMaxFontSize || 30));
        const baseLineHeight = Math.max(1, this.topBubbleBaseLineHeight || richText.lineHeight || baseFont);
        const minFont = Math.min(baseFont, Math.max(8, this.topBubbleMinFontSize || 14));
        const maxLines = Math.max(1, this.topBubbleMaxLines || 2);
        const paddingRatio = this.topBubbleFitPaddingRatio || 0.9;
        const maxAllowedWidth = container.width * paddingRatio + 1;
        const maxAllowedHeight = Math.min(container.height * paddingRatio + 1, baseLineHeight * maxLines + 1);

        if (richText.node) richText.node.setScale(1, 1);
        richText.fontSize = baseFont;
        richText.lineHeight = baseLineHeight;
        if (richText._updateRichText) richText._updateRichText();

        const preRendered = this.getTopBubbleRenderedSize();
        let fitRatio = 1;
        if (preRendered.width > 0 && preRendered.height > 0) {
            fitRatio = Math.min(1, maxAllowedWidth / preRendered.width, maxAllowedHeight / preRendered.height);
        }
        let targetFont = baseFont;
        if (fitRatio < 1) targetFont = Math.max(minFont, Math.floor(baseFont * fitRatio));
        richText.fontSize = targetFont;
        richText.lineHeight = Math.max(1, Math.round(baseLineHeight * targetFont / baseFont));
        if (richText._updateRichText) richText._updateRichText();

        const rendered = this.getTopBubbleRenderedSize();
        let finalScale = 1;
        if (rendered.width > 0 && rendered.height > 0) {
            finalScale = Math.min(1, maxAllowedWidth / rendered.width, maxAllowedHeight / rendered.height);
            finalScale = Math.max(this.topBubbleMinScale || 0.55, finalScale);
        }
        if (richText.node) richText.node.setScale(finalScale, finalScale);

        console.log("[top_bubble_fit] result", {
            text: richText.string,
            containerW: container.width,
            containerH: container.height,
            preRenderedW: preRendered.width,
            preRenderedH: preRendered.height,
            fitRatio: fitRatio,
            renderedW: rendered.width,
            renderedH: rendered.height,
            fitPaddingRatio: paddingRatio,
            maxAllowedW: maxAllowedWidth,
            maxAllowedH: maxAllowedHeight,
            maxLines: maxLines,
            baseFont: baseFont,
            minFont: minFont,
            targetFont: targetFont,
            finalFont: richText.fontSize,
            finalLineHeight: richText.lineHeight,
            finalScale: finalScale,
            effectiveFont: Math.round(richText.fontSize * finalScale * 100) / 100
        });
    }

    public applyTopBubbleI18n(payload: any): void {
        if (!this.rich_bubbleText || !payload) {
            console.log("[top_bubble_fit] skip apply: payload or rich text missing", {
                hasRichText: !!this.rich_bubbleText,
                hasPayload: !!payload
            });
            return;
        }
        console.log("[top_bubble_fit] apply", {
            key: payload.key,
            params: payload.params || []
        });
        if (this.i18nBubbleLabelComp && this.i18nBubbleLabelComp.setI18nKey) {
            this.i18nBubbleLabelComp.setI18nKey(payload.key, payload.params || []);
            if (this.enableTopBubbleAutoFit) this.scheduleTopBubbleAutoFit();
        } else {
            this.rich_bubbleText.string = this.i18n(payload.key, payload.params || []);
            if (this.enableTopBubbleAutoFit) this.scheduleTopBubbleAutoFit();
        }
    }

    public advanceTopBubbleStatus(): void {
        const mock = this.data_topBalanceMock;
        if (!mock) return;
        const oldStatus = mock.bubble_status;
        for (let i = 0; i < 8; i++) {
            let changed = false;
            if (mock.bubble_status === 0) {
                if (mock.cash_balance >= mock.money) {
                    mock.bubble_status = 1;
                    changed = true;
                }
            } else if (mock.bubble_status === 1) {
                if (mock.levels_passed_limit > 0 && (mock.current_extract_levels_passed_count || 0) >= mock.levels_passed_limit) {
                    mock.bubble_status = 2;
                    changed = true;
                }
            } else if (mock.bubble_status === 2) {
                if (mock.sign_in_days >= mock.sign_in_limit) {
                    mock.bubble_status = 3;
                    changed = true;
                }
            } else if (mock.bubble_status === 3 && mock.user_level >= mock.level_limit) {
                mock.bubble_status = 4;
                changed = true;
            }
            if (!changed) break;
        }
        if (mock.bubble_status !== oldStatus) {
            try {
                const userData: any = UserData.getInstance();
                if (userData) userData.bubble_status = mock.bubble_status;
            } catch (e) {
                console.warn("[top_bubble] sync UserData.bubble_status failed", e);
            }
        }
    }

    public getTopBubbleI18nPayload(): any {
        const mock = this.data_topBalanceMock;
        if (!mock) {
            return { key: "key_common_barrage_empty", params: [] };
        }
        this.advanceTopBubbleStatus();

        if (mock.bubble_status === 0) {
            const need = Math.max(0, mock.money - mock.cash_balance);
            return {
                key: "key_pop_desc_cash_need",
                params: [this.wrapBubbleNum(this.getCurrencyText("RP", need)), "<color=#00C853>" + this.getCurrencyText("RP", mock.money) + "</color>"]
            };
        }
        if (mock.bubble_status === 1) {
            const need = Math.max(0, (mock.levels_passed_limit || 0) - (mock.current_extract_levels_passed_count || 0));
            return {
                key: need > 0 ? "key_pop_desc_ad_need" : "key_pop_desc_ad_done",
                params: need > 0 ? [this.wrapBubbleNum(need)] : []
            };
        }
        if (mock.bubble_status === 2) {
            const need = Math.max(0, mock.sign_in_limit - mock.sign_in_days);
            return {
                key: need > 0 ? "key_pop_desc_sign_need" : "key_pop_desc_sign_done",
                params: need > 0 ? [this.wrapBubbleNum(need)] : []
            };
        }
        if (mock.bubble_status === 3) {
            const need = Math.max(0, mock.level_limit - mock.user_level);
            return {
                key: need > 0 ? "key_pop_desc_level_need" : "key_pop_desc_level_done",
                params: need > 0 ? [this.wrapBubbleNum(need)] : []
            };
        }
        return { key: "key_pop_desc_ready", params: [] };
    }

    public formatTopBalance(value: number): string {
        return Math.max(0, Math.floor(value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public getCurrencyText(type: string, value?: number): string {
        const amount = value !== undefined ? value : (type as any);
        return LanguageService.formatCurrency(amount);
    }

    public getBarrageCurrencyText(type: string, value?: number): string {
        const amount = value !== undefined ? value : (type as any);
        return LanguageService.formatCurrencyBarrage(amount);
    }

    public i18n(key: string, params?: any[], fallback?: string): string {
        return LanguageService.t(key, params, fallback);
    }

    public _refreshArrowLevelLabel(): void {
        this.ensureRuntimeNodeRefs();
        if (!cc.isValid(this.lbl_txtLevel)) return;
        let arrowLevelId = PlayerDataStore.arrow_level && PlayerDataStore.arrow_level.arrow_level_id;
        if (!arrowLevelId) arrowLevelId = Number(PlayerDataStore.current_arrow_level_id || 0);
        this.lbl_txtLevel.string = LanguageService.t("key_common_level_label", [arrowLevelId || 0]);
    }

    public _refreshWithdrawTextLabel(): void {
        this.ensureRuntimeNodeRefs();
        if (cc.isValid(this.lbl_withdrawText)) {
            this.lbl_withdrawText.string = LanguageService.t("key_withdraw_page_title");
        }
    }

    public getNewbieGuideFlow(): any {
        return NewbieGuideFlow;
    }

    public getNewbieGuideStep(): number {
        const flow = this.getNewbieGuideFlow();
        return flow && typeof flow.getStep === "function" ? Number(flow.getStep() || 0) : 0;
    }

    public isNewbieGuideStep(step: any): boolean {
        return this.getNewbieGuideStep() === Number(step || 0);
    }

    public advanceNewbieGuideStep(step: any): boolean {
        const flow = this.getNewbieGuideFlow();
        if (!flow || typeof flow.advanceIfCurrent !== "function") return false;
        return !!flow.advanceIfCurrent(step);
    }

    public isNewbieSettleReward(data: any): boolean {
        if (!data) return false;
        let value = data.is_new;
        if (value === undefined) value = data.isNew;
        const normalized = typeof value === "string" ? value.trim().toLowerCase() : value;
        return value === true || normalized === "true" || normalized === "1" || Number(value || 0) === 1;
    }

    public refreshStep3GuideTipText(): void {
        this.ensureRuntimeNodeRefs();
        if (!this.lbl_step3GuideTip) return;
        this.lbl_step3GuideTip.string = this.i18n("key_newbie_guide_step3", [], "查看余额，点击提现");
    }

    public setStep3GuideTipActive(active: boolean): void {
        this.ensureRuntimeNodeRefs();
        if (!this.node_step3GuideTip || !this.node_step3GuideTip.isValid) return;
        if (active) this.refreshStep3GuideTipText();
        this.node_step3GuideTip.active = !!active;
    }

    public refreshGuideLevelTipsI18n(): void {
        this.ensureRuntimeNodeRefs();
        if (this.lbl_guideLevel1Tip) {
            this.lbl_guideLevel1Tip.string = this.i18n("key_newbie_guide_step1", [], "点击消除箭头");
        }
        if (this.lbl_guideLevel2Tip) {
            this.lbl_guideLevel2Tip.string = this.i18n("key_newbie_guide_step8", [], "手指外拨进行缩放");
        }
    }

    public refreshStep7GuideBannerText(text?: string): void {
        this.ensureRuntimeNodeRefs();
        let content = text;
        if (typeof content !== "string") {
            content = this.i18n("key_newbie_guide_step7_banner", [], "过关即可获得现金奖励，过关越多奖励越多");
        }
        content = String(content || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        if (!content) return;
        if (this.lbl_step7GuideTextBack) this.lbl_step7GuideTextBack.string = content;
        if (this.lbl_step7GuideTextFront) this.lbl_step7GuideTextFront.string = content;
    }

    public setStep7GuideBannerActive(active: boolean): void {
        this.ensureRuntimeNodeRefs();
        if (!this.node_step7GuideBanner || !this.node_step7GuideBanner.isValid) return;
        if (active) {
            this.refreshStep7GuideBannerText();
            this.node_step7GuideBanner.opacity = 255;
        } else {
            this.node_step7GuideBanner.stopAllActions();
            if (this.node_step7GuideBannerBg) {
                if (cc.Tween && cc.Tween.stopAllByTarget) cc.Tween.stopAllByTarget(this.node_step7GuideBannerBg);
                this.node_step7GuideBannerBg.x = 0;
            }
            if (this.node_step7GuideBannerDim) {
                if (cc.Tween && cc.Tween.stopAllByTarget) cc.Tween.stopAllByTarget(this.node_step7GuideBannerDim);
                this.node_step7GuideBannerDim.opacity = 0;
            }
        }
        this.node_step7GuideBanner.active = !!active;
    }

    public playNewbieGuideBanner(text: string, onFinish?: Function): void {
        this.ensureRuntimeNodeRefs();
        const banner = this.node_step7GuideBanner;
        if (!banner || !banner.isValid) {
            if (onFinish) onFinish();
            return;
        }
        this.bigTopBarrageShown = true;
        const bg = this.node_step7GuideBannerBg;
        const dim = this.node_step7GuideBannerDim;
        banner.stopAllActions();
        if (bg && cc.Tween && cc.Tween.stopAllByTarget) cc.Tween.stopAllByTarget(bg);
        if (dim && cc.Tween && cc.Tween.stopAllByTarget) cc.Tween.stopAllByTarget(dim);
        if (dim) dim.opacity = 0;
        banner.active = true;
        banner.opacity = 255;
        this.refreshStep7GuideBannerText(text);

        const fadeTime = Math.max(0.2, this.bigTopBarrageSlideDuration || 0.35);
        const slideTime = Math.max(0.45, (this.bigTopBarrageSlideDuration || 0.35) * 1.6);
        const stayTime = this.bigTopBarrageStayDuration || 3;
        const offset = (banner.width || 750) + (bg ? bg.width : 720) / 2;

        if (bg) {
            bg.x = -offset;
            cc.tween(bg)
                .to(slideTime, { x: 0 }, { easing: "backOut" })
                .delay(stayTime)
                .to(slideTime, { x: offset }, { easing: "backIn" })
                .call(() => {
                    banner.active = false;
                    bg.x = 0;
                    if (dim) dim.opacity = 0;
                    if (onFinish) onFinish();
                })
                .start();
        } else {
            banner.opacity = 0;
            cc.tween(banner)
                .to(fadeTime, { opacity: 255 })
                .delay(stayTime)
                .to(fadeTime, { opacity: 0 })
                .call(() => {
                    banner.active = false;
                    banner.opacity = 255;
                    if (onFinish) onFinish();
                })
                .start();
        }
    }

    public tryShowStep7NewbieBanner(): void {
        const flow = this.getNewbieGuideFlow();
        if (!flow || !this.isNewbieGuideStep(flow.STEP_HOME_BANNER) || this.newbieGuideBannerPlaying) return;
        this.newbieGuideBannerPlaying = true;
        const text = this.i18n("key_newbie_guide_step7_banner", [], "过关即可获得现金奖励，过关越多奖励越多");
        const self = this;
        this.playNewbieGuideBanner(text, () => {
            self.newbieGuideBannerPlaying = false;
            self.advanceNewbieGuideStep(flow.STEP_HOME_BANNER);
            if (!self._level2ZoomGuideDismissed && Number(UserData.getInstance().level || 1) === 2) {
                self.setGuideNodeActive("guide_level2", true);
            }
        });
    }

    public refreshNewbieGuideState(): void {
        const flow = this.getNewbieGuideFlow();
        if (!flow || (flow.isDone && flow.isDone())) {
            this.setGuideOverlayActive("guide_1", false);
            this.setStep3GuideTipActive(false);
            this.setStep7GuideBannerActive(false);
            return;
        }
        const step = this.getNewbieGuideStep();
        console.log("[NewbieGuide] refreshNewbieGuideState: step=" + step + " STEP_TOP_BALANCE=" + flow.STEP_TOP_BALANCE);
        if (step === flow.STEP_TOP_BALANCE) {
            const guideNode = this.findChildByNameDeep(this.node, "guide_1");
            console.log("[NewbieGuide] step3展示: guide_1节点=" + !!guideNode + " node_step3GuideTip=" + !!(this.node_step3GuideTip && this.node_step3GuideTip.isValid));
            this.setGuideOverlayActive("guide_1", true);
            this.setStep3GuideTipActive(true);
        } else {
            this.setGuideOverlayActive("guide_1", false);
            this.setStep3GuideTipActive(false);
        }
        if (step === flow.STEP_HOME_BANNER) {
            this.tryShowStep7NewbieBanner();
        } else if (!this.newbieGuideBannerPlaying) {
            this.setStep7GuideBannerActive(false);
        }
    }

    public wrapBubbleNum(value: any): string {
        return "<color=#E61A4C>" + value + "</color>";
    }

    public _consumeProp(propType: number, onSuccess?: Function): void {
        const self = this;
        const userData = UserData.getInstance();
        console.log("[prop] _consumeProp: prop_type=" + propType + " hint=" + userData.hint_prop_count + " guideline=" + userData.guideline_prop_count);
        try {
            LoadingHttpService.consumeArrowProp({ prop_type: propType }, Handler.create(null, (res: any) => {
                if (res && res.data) {
                    const currentUserData = UserData.getInstance();
                    if (res.data.hint_prop_count !== undefined) {
                        currentUserData.hint_prop_count = res.data.hint_prop_count;
                        currentUserData.num_tipscards = res.data.hint_prop_count;
                    }
                    if (res.data.guideline_prop_count !== undefined) {
                        currentUserData.guideline_prop_count = res.data.guideline_prop_count;
                    }
                    console.log("[prop] _consumeProp success: prop_type=" + propType + " hint=" + currentUserData.hint_prop_count + " guideline=" + currentUserData.guideline_prop_count);
                    self.initTishiBtnstate();
                    if (onSuccess) onSuccess();
                } else {
                    console.error("[consumeProp] failed", res);
                }
            }), Handler.create(null, (err: any) => {
                console.error("[consumeProp] error", err);
            }));
        } catch (e) {
            console.error("[consumeProp] exception", e);
        }
    }

    public _claimPropVideoReward(videoType: number | string, onSuccess?: Function): void {
        const self = this;
        console.log("[prop] _claimPropVideoReward: video_type=" + videoType);
        let requestType: number | string = videoType;
        if (videoType === 2 || videoType === "2") {
            requestType = "hint_prop";
        } else if (videoType === 3 || videoType === "3") {
            requestType = "guideline_prop";
        }
        console.log("[prop] _claimPropVideoReward: video_type=" + videoType + " request_video_type=" + requestType);
        try {
            LoadingHttpService.claimArrowAdReward({ video_type: requestType }, Handler.create(null, (res: any) => {
                if (res && res.data) {
                    const userData = UserData.getInstance();
                    if (res.data.hint_prop_count !== undefined) {
                        userData.hint_prop_count = res.data.hint_prop_count;
                        userData.num_tipscards = res.data.hint_prop_count;
                    }
                    if (res.data.guideline_prop_count !== undefined) {
                        userData.guideline_prop_count = res.data.guideline_prop_count;
                    }
                    console.log("[prop] _claimPropVideoReward success: video_type=" + requestType + " hint=" + userData.hint_prop_count + " guideline=" + userData.guideline_prop_count);
                    self.initTishiBtnstate();
                    self.initFuzhuBtnstate();
                }
                if (onSuccess) onSuccess();
            }), Handler.create(null, (err: any) => {
                console.error("[claimPropVideoReward] error", err);
                if (onSuccess) onSuccess();
            }));
        } catch (e) {
            console.error("[claimPropVideoReward] exception", e);
            if (onSuccess) onSuccess();
        }
    }

    public getTopBubbleText(): string {
        const payload = this.getTopBubbleI18nPayload();
        return this.i18n(payload.key, payload.params || []);
    }

    public InitNodepool(): Promise<void> {
        const self = this;
        return new Promise<void>((resolve, reject) => {
            const bundle = cc.assetManager.getBundle(InterfaceMgr.bundleName.game);
            const tasks: Promise<void>[] = [];

            const itemTask = new Promise<void>((res, rej) => {
                bundle.load("prefab/item", (err: Error, asset: cc.Prefab) => {
                    if (err) {
                        console.error("加载 prefab/item 失败:", err);
                        rej(err);
                    } else {
                        NodePoolMgr.getInstance().pool_snake.setCloneAsset(asset, self.layer_mid);
                        NodePoolMgr.getInstance().pool_snake.setInitSize(100);
                        res();
                    }
                });
            });
            tasks.push(itemTask);

            const mapTask = new Promise<void>((res, rej) => {
                bundle.load("prefab/item_map", (err: Error, asset: cc.Prefab) => {
                    if (err) {
                        console.error("加载 prefab/item_map 失败:", err);
                        rej(err);
                    } else {
                        NodePoolMgr.getInstance().pool_map.setCloneAsset(asset, self.layer_mid);
                        NodePoolMgr.getInstance().pool_map.setInitSize(100);
                        res();
                    }
                });
            });
            tasks.push(mapTask);

            Promise.all(tasks).then(() => {
                console.log("对象池已初始化完成");
                resolve();
            }).catch((err) => reject(err));
        });
    }

    public Init(): void {
        console.log("初始化游戏");
        if (this.txt_levelnum) {
            this.txt_levelnum.useSystemFont = true;
            this.txt_levelnum.font = null;
            this.txt_levelnum.fontFamily = "Arial";
            this.txt_levelnum.fontSize = 16;
            this.txt_levelnum.lineHeight = 20;
            this.txt_levelnum.string = LanguageService.t("key_common_level_label", [UserData.getInstance().level]);
        }
        this._refreshArrowLevelLabel();
        this._refreshWithdrawTextLabel();
        this.num_life = PlayerDataStore.arrow_level.life_count || 3;
        this.refreshLifeHearts();
        this.applyCountdownUIState();

        if (this.isCountdownEnabled()) {
            const levelTime = PlayerDataStore.arrow_level.time_limit || 0;
            if (levelTime > 0) {
                this.num_gametime = levelTime;
            } else {
                const config: any = ConfigMgr.getInstance().getById(ConfigDefine.GametimeConfig, this.num_rellyLevel);
                this.num_gametime = config && config.leveltime ? config.leveltime : 525;
            }
            this.txt_time.string = NumberUtils.formatSeconds(this.num_gametime);
        } else {
            this.num_gametime = 0;
            this.txt_time.string = this.txt_time.string || "08:45";
        }

        if (!this.txt_lastnum) {
            const lastnumNode = this.findChildNodeByName(this.node, "txt_lastnum");
            if (lastnumNode) this.txt_lastnum = lastnumNode.getComponent(cc.Label);
        }
        if (this.txt_lastnum) {
            const arrowCount = PlayerDataStore.arrow_level.arrow_count || 0;
            this.txt_lastnum.string = this._formatLastnum(arrowCount, arrowCount);
        }

        this.slider.progress = 0;
        this.sp_slderbg.node.width = 52;
        this.bool_cantouchAd = true;
        this.bool_isStop = false;
        this.dsj = 0;
        this.bool_countdownStarted = false;
        if (!this._sfVb || !this._sfOff) this._cacheSpriteFrames();
        if (!this.bool_isRestart) {
            this.bool_hasFuzhuline = false;
            this.initFuzhuBtnstate();
        }
        this.snake_errorID = [];
        this.bool_cantouchAd = true;
        this.bool_hasFuzhuline = false;
        this.addMouseWheelSupport();
    }

    public ShowGame(): void {
        const self = this;
        this.ensureRuntimeNodeRefs();
        const colorMode = UserData.getInstance().colorMode;
        const bg = this.node.getChildByName("bg");
        if (bg) bg.color = colorMode ? cc.color(18, 18, 30) : cc.color(255, 255, 255);

        const level = UserData.getInstance().level;
        BusinessAnalyticsService.reportData("level_node", {
            level: level,
            enter_game: 1
        });
        BusinessAnalyticsService.reportData("user_action", {
            action: "enter_game",
            module: "level_" + level,
            is_ad: 0
        });

        this.closeGuide();
        this.showGuide();
        this.refreshNewbieGuideState();

        if (this.enableRuntimeWidgetRealign && this.node_checksize && this.node_checksize.getComponent(cc.Widget)) {
            this.node_checksize.getComponent(cc.Widget).updateAlignment();
        }
        if (!this.node_mask) {
            this.node_mask = this.node_checksize && this.node_checksize.getChildByName("mask");
        }
        if (this.enableRuntimeWidgetRealign && this.node_mask && this.node_mask.getComponent(cc.Widget)) {
            this.node_mask.getComponent(cc.Widget).updateAlignment();
        }

        const rect = {
            w: (this.node_checksize ? this.node_checksize.width : this.node.width) - 100,
            h: (this.node_checksize ? this.node_checksize.height : this.node.height) - 100
        };

        if (this.node_game) this.node_game.destroy();
        console.log("ShowGame", "ShowGame1");

        ResMgr.getInstance().loadRes("prefab/game", cc.Prefab, null, InterfaceMgr.bundleName.game).then((prefab: cc.Prefab) => {
            if (!self.isViewAlive()) return;
            console.log("ShowGame", "ShowGame" + prefab);
            UIMgr.getInstance().hideWatingUI();
            self.Init();
            self.node_game = cc.instantiate(prefab);
            if (self.node_mask) {
                self.node_mask.addChild(self.node_game);
            } else {
                self.node.addChild(self.node_game);
            }
            (self.node_game.getComponent(game as any) as any).levelInfo = self.data_levelinfo;
            const gridSize = {
                width: 50 * self.data_levelinfo.XSize,
                hight: 50 * self.data_levelinfo.YSize
            };
            self.adjustGameNodeToRect(self.node_game, rect, gridSize);
            self.node_game.width = 5000;
            self.node_game.height = 5000;
            self.showStartAni();
            self.resumeBarrage();
        });
    }

    public adjustGameNodeToRect(node: cc.Node, rect: { w: number, h: number }, gridSize: { width: number, hight: number }): void {
        const rectRatio = rect.w / rect.h;
        let scale = 1;
        scale = gridSize.width / gridSize.hight > rectRatio ? rect.w / gridSize.width : rect.h / gridSize.hight;
        node.x = 0;
        node.y = 0;
        if (scale > 1) scale = 1;
        node.scale = scale;
        this.num_normalScale = scale;
        const gameComp: any = node.getComponent(game as any);
        if (gameComp) gameComp.num_minScale = scale;
    }

    public EventAdd(): void {
        if (!this._onUserInfoUpdatedHandler) this._onUserInfoUpdatedHandler = this.onUserInfoUpdated.bind(this);
        if (!this._onArrowRewardClaimedHandler) this._onArrowRewardClaimedHandler = this.onArrowRewardClaimed.bind(this);

        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameFail, this.showLife, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifySnakeNum, this.showSnakenum, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifySnakeNumChange, this.chnageSnakeNum, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameNext, this.showNext, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameAdFuhuo, this.showFuhuo, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameRestart, this.showRestart, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.notifySnakeTouch, this.closeAdState, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gameScaleChange, this.gameScalechange, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.closeSet, this.clsoeSetHandle, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.gettipsCard, this.initTishiBtnstate, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.snakeTouchSnake, this.ShowError, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.fuzhulineState, this.changeFuzhuBtnState, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.jumpLevel, this.jumpLevel, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.settleRewardOpen, this.onSettleRewardOpen, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.settleRewardClose, this.onSettleRewardClose, this);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.levelFailReport, this._reportLevelFail, this);

        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
        GlobalEventMgr.getInstance().on(InterfaceMgr.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
    }

    public EventRemove(): void {
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameFail, this.showLife, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifySnakeNum, this.showSnakenum, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifySnakeNumChange, this.chnageSnakeNum, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameNext, this.showNext, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameAdFuhuo, this.showFuhuo, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameRestart, this.showRestart, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.notifySnakeTouch, this.closeAdState, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gameScaleChange, this.gameScalechange, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.closeSet, this.clsoeSetHandle, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.gettipsCard, this.initTishiBtnstate, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.snakeTouchSnake, this.ShowError, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.fuzhulineState, this.changeFuzhuBtnState, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.jumpLevel, this.jumpLevel, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.languageChanged, this.onLanguageChanged, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.settleRewardOpen, this.onSettleRewardOpen, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.settleRewardClose, this.onSettleRewardClose, this);
        GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.levelFailReport, this._reportLevelFail, this);
        if (this._onUserInfoUpdatedHandler) {
            GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.userInfoUpdated, this._onUserInfoUpdatedHandler);
        }
        if (this._onArrowRewardClaimedHandler) {
            GlobalEventMgr.getInstance().off(InterfaceMgr.gameEvent.arrowRewardClaimed, this._onArrowRewardClaimedHandler);
        }
    }

    public onLanguageChanged(): void {
        if (this.i18nGroup && this.i18nGroup.refreshChildren) this.i18nGroup.refreshChildren();
        this.refreshTopBalanceUI();
        this._initFlyMoneyIconFrame();
        this.refreshTopMoneyArrowIcons();
        this.loadTopBarrageArrowImages();
        for (let i = 0; i < this.topBarrageRows.length; i++) {
            this.playTopBarrageByRow(i);
        }
        this.refreshBigTopBarrageLanguage();
        this.refreshGuideLevelTipsI18n();
        if (this.node_step3GuideTip && this.node_step3GuideTip.active) this.refreshStep3GuideTipText();
        if (this.node_step7GuideBanner && this.node_step7GuideBanner.active) this.refreshStep7GuideBannerText();
        this._refreshArrowLevelLabel();
        this._refreshWithdrawTextLabel();
    }

    public refreshBigTopBarrageLanguage(): void {
        if (!this.node_bigBarragePanel || !this.node_bigBarragePanel.active) return;
        if (!this.rich_bigBarrageText || !this.currentBigBarrageData) return;
        this.rich_bigBarrageText.string = this.getBigTopBarrageRichText(this.currentBigBarrageData);
        this.refreshTopBarrageLabelLayout(this.rich_bigBarrageText);
    }

    public gameScalechange(data: any): void {
        this.slider.progress = data.scale - this.num_normalScale;
        this.sp_slderbg.node.width = 358 * this.slider.progress + 52;
        this.closeGuide2();
    }

    public showLife(...args: any[]): void {
        if (this.snake_errorID.indexOf(args[0]) === -1) {
            this.snake_errorID.push(args[0]);
            this.num_life--;
            this._mistakeCount = (this._mistakeCount || 0) + 1;
            console.log("[ArrowStats] 失误 mistake_count=" + this._mistakeCount + " 剩余life=" + this.num_life);
            if (this.num_life <= 0) {
                this.num_life = 0;
                this.bool_isStop = true;
                UIMgr.getInstance().show(UIDefine.cashArrowReviveView);
            }
            this.refreshLifeHearts();
        }
    }

    public showSnakenum(...args: any[]): void {
        this.num_current_snake = args[0];
        this.num_total_snake = args[1];
        if (this.txt_lastnum) {
            this.txt_lastnum.string = this._formatLastnum(this.num_current_snake, this.num_total_snake);
        }
    }

    public chnageSnakeNum(snakeNum?: number): void {
        if (this.bool_isStop) this.bool_isStop = false;
        if (this.isCountdownEnabled() && !this.bool_countdownStarted) this.bool_countdownStarted = true;

        this.num_current_snake = snakeNum || this.num_current_snake - 1;
        if (this.num_current_snake < this.num_total_snake) {
            this.setGuideNodeActive("guide_level1", false);
            const flow = this.getNewbieGuideFlow();
            if (flow) this.advanceNewbieGuideStep(flow.STEP_ENTRY_LEVEL1);
        }

        this._eliminateCounter = (this._eliminateCounter || 0) + 1;
        this._totalEliminated = (this._totalEliminated || 0) + 1;

        if (this.txt_lastnum) {
            const arrowCount = PlayerDataStore.arrow_level.arrow_count || 0;
            const remain = Math.max(0, arrowCount - this._totalEliminated);
            this.txt_lastnum.string = this._formatLastnum(remain, arrowCount);
        }

        this.consumeFuzhulineCount();

        const eliminateReward = PlayerDataStore.arrow_level.eliminate_reward || 0;
        if (eliminateReward > 0 && this.data_topBalanceMock) {
            const self = this;
            this.playFlyMoneyAnim(5, eliminateReward, () => {
                const newBalance = (self.data_topBalanceMock.cash_balance || 0) + eliminateReward;
                self.updateTopBalance(newBalance);
                PlayerDataStore.cash_balance = newBalance;
                self.refreshTopBalanceUI();
            });
        }

        const triggerCount = this._getBigRewardTriggerCount();
        const tailClearance = Number(PlayerDataStore.arrow_level.tail_clearance || 5);
        const remainSnake = this.num_current_snake || 0;
        console.log("[ArrowLevel] 消除计数 _eliminateCounter=" + this._eliminateCounter + "/" + triggerCount + " remain=" + remainSnake + " tail_clearance=" + tailClearance);

        if (triggerCount > 0 && this._eliminateCounter >= triggerCount) {
            const eliminateCount = this._eliminateCounter;
            this._eliminateCounter = 0;
            if (this.num_current_snake <= 0) {
                console.log("[ArrowLevel] 最后箭头达消除阈值但已通关，跳过消除结算，由通关结算处理");
            } else if (remainSnake <= tailClearance) {
                console.log("[ArrowLevel] 剩余箭头(" + remainSnake + ")<=tail_clearance(" + tailClearance + ")，跳过中途结算，等待过关弹窗");
            } else {
                const self = this;
                self.bool_isStop = true;
                self.pauseBarrage();
                console.log("[ArrowLevel] 触发消除结算 eliminate_count=" + eliminateCount);
                this._settleArrowReward(false, eliminateCount, (res: any) => {
                    console.log("[ArrowLevel] 中途结算返回: " + JSON.stringify((res && res.data) || null));
                    if (res && res.data) {
                        const arrowLevel = res.data.arrow_level || {};
                        const bigRewardTrigger = res.data.big_reward_trigger != null ? res.data.big_reward_trigger : arrowLevel.big_reward_trigger;
                        const tailClear = res.data.tail_clearance != null ? res.data.tail_clearance : arrowLevel.tail_clearance;
                        console.log("[ArrowLevel] 接口返回 big_reward_trigger=" + bigRewardTrigger + " tail_clearance=" + tailClear + " 当前值 big_reward_trigger=" + PlayerDataStore.arrow_level.big_reward_trigger + " tail_clearance=" + PlayerDataStore.arrow_level.tail_clearance);
                        if (bigRewardTrigger != null) PlayerDataStore.arrow_level.big_reward_trigger = Number(bigRewardTrigger);
                        if (tailClear != null) PlayerDataStore.arrow_level.tail_clearance = Number(tailClear);
                        console.log("[ArrowLevel] 更新后 big_reward_trigger=" + PlayerDataStore.arrow_level.big_reward_trigger + " tail_clearance=" + PlayerDataStore.arrow_level.tail_clearance);
                    }
                    UIMgr.getInstance().show(UIDefine.arrowSettleRewardView, {
                        settleData: (res && res.data) || {},
                        isLevelPassed: false,
                        onClose: () => {
                            console.log("[ArrowLevel] 消除结算弹窗关闭，恢复游戏");
                            self.bool_isStop = false;
                        }
                    });
                });
            }
        }

        this.checkWin();
    }

    public _formatLastnum(current: any, total: any): string {
        let length = String(total).length;
        if (length < 2) length = 2;
        let currentText = String(current);
        while (currentText.length < length) currentText = "0" + currentText;
        let totalText = String(total);
        while (totalText.length < length) totalText = "0" + totalText;
        console.log("gameview------", currentText + " / " + totalText);
        return currentText + "/" + totalText;
    }

    public consumeFuzhulineCount(): void {
        if (!this.bool_hasFuzhuline) return;
        const gameComp: any = this.node_game && this.node_game.getComponent(game as any);
        if (!gameComp || !gameComp.bool_fuzhulineisOpen) return;
        if (this.num_fuzhulineRemainClear <= 0) {
            this.disableFuzhulineByLimit();
        } else {
            this.num_fuzhulineRemainClear -= 1;
            console.log("[fuzhuline] consume remain =", this.num_fuzhulineRemainClear);
            if (this.num_fuzhulineRemainClear <= 0) this.disableFuzhulineByLimit();
        }
    }

    public disableFuzhulineByLimit(): void {
        this.bool_hasFuzhuline = false;
        this.num_fuzhulineRemainClear = 0;
        this.initFuzhuBtnstate();
        this.forceCloseFuzhuline();
        console.log("[fuzhuline] expired, hide after clear limit reached");
    }

    public forceCloseFuzhuline(): void {
        const gameComp: any = this.node_game && this.node_game.getComponent(game as any);
        if (gameComp && gameComp.CloseFuzhuxian) gameComp.CloseFuzhuxian();
    }

    public checkWin(): void {
        if (this.num_current_snake > 0) return;

        this.bool_isStop = true;
        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameWin);

        const halfX = Math.floor(this.data_levelinfo.XSize / 2);
        const halfY = Math.floor(this.data_levelinfo.YSize / 2);
        const delay = 0.6000000000000001 + 0.05 * (Math.max(halfX, halfY) + 5);
        this.pauseBarrage();

        if (this.enableTopBottomFadeAnimation) {
            cc.tween(this.layer_bottom).to(0.5, { opacity: 0 }).start();
            cc.tween(this.layer_top).to(0.5, { opacity: 0 }).start();
        }

        const self = this;
        self._pendingSettleData = null;
        let rewardReady = false;
        let timeoutReady = false;
        let popupShown = false;
        let popupNode: cc.Node = null;

        const buildEntryData = () => {
            return {
                settleData: self._pendingSettleData || {},
                isLevelPassed: true,
                winLevel: UserData.getInstance().level
            };
        };

        const fillPopupData = () => {
            if (!popupShown || !rewardReady || !popupNode || !popupNode.isValid) return;
            try {
                const comp: any = popupNode.getComponent(arrowSettleRewardView as any);
                if (comp && comp.setEntryData) comp.setEntryData(buildEntryData());
                const flow = self.getNewbieGuideFlow();
                if (flow && self.isNewbieGuideStep(flow.STEP_SETTLE_LEVEL1) && self.isNewbieSettleReward(self._pendingSettleData)) {
                    self.newbieGuidePendingLevelPassSettleClose = true;
                }
                console.log("[ArrowLevel] checkWin: 回填结算弹窗 switch_reward=" + ((self._pendingSettleData && self._pendingSettleData.switch_reward) || 0));
            } catch (e) {
                console.warn("[ArrowLevel] checkWin: 回填结算弹窗失败", e);
            }
        };

        const tryShowPopup = () => {
            if (popupShown || !rewardReady || !timeoutReady) return;
            popupShown = true;
            const flow = self.getNewbieGuideFlow();
            self.newbieGuidePendingLevelPassSettleClose = !!(flow && self.isNewbieGuideStep(flow.STEP_SETTLE_LEVEL1) && self.isNewbieSettleReward(self._pendingSettleData));
            UIMgr.getInstance().show(UIDefine.arrowSettleRewardView, buildEntryData()).then((node: cc.Node) => {
                popupNode = node;
                fillPopupData();
            });
        };

        const eliminateCount = Number(this._eliminateCounter || 0);
        console.log("[ArrowLevel] checkWin: 通关 level=" + this.num_rellyLevel + " 触发通关结算 eliminate_count=" + eliminateCount);
        this._settleArrowReward(true, eliminateCount, (res: any) => {
            self._pendingSettleData = (res && res.data) || {};
            rewardReady = true;
            tryShowPopup();
            fillPopupData();
        });

        this.scheduleOnce(() => {
            timeoutReady = true;
            tryShowPopup();
        }, delay);

        this.scheduleOnce(() => {
            if (popupShown) return;
            console.warn("[ArrowLevel] checkWin: 结算回包超时，使用已有数据兜底展示弹窗");
            rewardReady = true;
            timeoutReady = true;
            tryShowPopup();
        }, delay + 2);
    }

    public SliderValueChanged(slider: cc.Slider): void {
        const targetScale = this.num_normalScale + slider.progress;
        const ratio = targetScale / this.node_game.scale;
        this.node_game.x = this.node_game.x * ratio;
        this.node_game.y = this.node_game.y * ratio;
        this.node_game.scale = targetScale;
        this.sp_slderbg.node.width = 358 * this.slider.progress + 52;
        this.closeGuide2();
    }

    public _shouldSkipRewardVideoForDebug(adType: string): boolean {
        if (adType !== "提示" && adType !== "辅助线") return false;
        if (cc && cc.sys && cc.sys.isNative && cc.sys.os !== cc.sys.OS_ANDROID && cc.sys.os !== cc.sys.OS_IOS) return true;
        try {
            return (cc && cc.sys && cc.sys.localStorage ? cc.sys.localStorage.getItem("arrow_debug_skip_reward_video") : "") === "1";
        } catch (e) {
            return false;
        }
    }

    public playRewardVideoByAdManager(adType: string, onSuccess?: Function, onFail?: Function, blockTouch?: boolean): void {
        const self = this;
        if (this._shouldSkipRewardVideoForDebug(adType)) {
            console.log("[gameView] playRewardVideoByAdManager: debug skip ad_type=" + adType);
            if (onSuccess) onSuccess();
            return;
        }
        const adMgr: any = AdManager && (AdManager as any).getInstance ? (AdManager as any).getInstance() : null;
        if (!adMgr || typeof adMgr.playNormalVideoAd !== "function") {
            if (onSuccess) onSuccess();
            return;
        }
        if (blockTouch) this.bool_cantouchAd = false;
        this.bool_isStop = true;
        const done = (success: boolean) => {
            self.bool_isStop = false;
            if (blockTouch) self.bool_cantouchAd = true;
            if (success) {
                if (onSuccess) onSuccess();
            } else {
                if (onFail) onFail();
            }
        };
        try {
            adMgr.playNormalVideoAd({
                ad_type: adType || "reward_video",
                force_video: false
            }, (res: any) => {
                const success = !res || res.compensationQualifyMark === undefined || !!res.compensationQualifyMark;
                done(success);
            }, () => {
                done(false);
            }, "激励视频播放失败,请重试");
        } catch (e) {
            console.error("[gameView] playNormalVideoAd failed", e);
            done(false);
        }
    }

    public OnClickTips(): void {
        const self = this;
        console.log("[hint_prop] OnClickTips: num_tipscards=" + UserData.getInstance().num_tipscards);
        if (UserData.getInstance().num_tipscards > 0) {
            self.node_game.scale = self.num_normalScale;
            self._consumeProp(1, () => {
                self._hintUsedCount = (self._hintUsedCount || 0) + 1;
                console.log("[ArrowStats] 使用提示 hint_used=" + self._hintUsedCount);
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameAdTips);
            });
        } else {
            console.log("[hint_prop] OnClickTips: no prop, play ad");
            this.playRewardVideoByAdManager("提示", () => {
                self._claimPropVideoReward(2, () => {
                    self.initTishiBtnstate();
                    console.log("[hint_prop] OnClickTips: ad reward claimed, wait next click to consume prop");
                });
            });
        }
    }

    public OnClickChange(): void {
        this.bool_isStop = true;
        UIMgr.getInstance().show(UIDefine.cashArrowSettingView);
    }

    public OnClickYichu(): void {
        if (!this.bool_cantouchAd) return;
        this.playRewardVideoByAdManager("移除", () => {
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameAdYichu);
        }, null, true);
    }

    public OnClickFuzhuline(): void {
        const self = this;
        const userData = UserData.getInstance();
        console.log("[guideline_prop] OnClickFuzhuline: hasFuzhuline=" + this.bool_hasFuzhuline + " guideline_count=" + userData.guideline_prop_count + " remain=" + this.num_fuzhulineRemainClear);
        if (this.bool_hasFuzhuline) {
            console.log("[guideline_prop] OnClickFuzhuline: already active, toggle");
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameAdFuzhuxian);
        } else if (UserData.getInstance().guideline_prop_count > 0) {
            console.log("[guideline_prop] OnClickFuzhuline: consume prop");
            self._consumeProp(2, () => {
                self.bool_hasFuzhuline = true;
                self.num_fuzhulineRemainClear = self.num_fuzhulineClearLimit;
                self.initFuzhuBtnstate();
                GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameAdFuzhuxian);
            });
        } else {
            console.log("[guideline_prop] OnClickFuzhuline: no prop, play ad");
            this.playRewardVideoByAdManager("辅助线", () => {
                self._claimPropVideoReward(3, () => {
                    self.initFuzhuBtnstate();
                    console.log("[guideline_prop] OnClickFuzhuline: ad reward claimed, wait next click to consume prop");
                });
            });
        }
    }

    public showRestart(): void {
        const self = this;
        this.bool_isRestart = true;
        this._resetAttemptBehaviorStats();
        this.node_game.destroy();
        UIMgr.getInstance().showWatingUI();
        const hadFuzhuline = this.bool_hasFuzhuline;
        const remainClear = this.num_fuzhulineRemainClear;
        const level = UserData.getInstance().level;
        BusinessAnalyticsService.reportData("level_node", { level: level, restart: 1 });
        BusinessAnalyticsService.reportData("user_action", { action: "restart_game", module: "level_" + level, is_ad: 0 });

        ConfigMgr.getInstance().loadLevelData("level_" + this.num_rellyLevel, false).then(() => {
            if (!self.isViewAlive()) return;
            self.data_levelinfo = ConfigMgr.getInstance().getLevelById(self.num_rellyLevel);
            self._eliminateCounter = 0;
            self._totalEliminated = 0;
            const arrowCount = self.data_levelinfo && self.data_levelinfo.Arrows ? self.data_levelinfo.Arrows.length : "加载失败";
            console.log("[LevelVerify] showRestart 加载完成: level_" + self.num_rellyLevel + ".json | 本地实际箭头数=" + arrowCount);
            console.log("[ArrowLevel] showRestart: 重新开始 level=" + self.num_rellyLevel + " 计数器重置 big_reward_trigger=" + self._getBigRewardTriggerCount());
            self.ShowGame();
            self.num_fuzhulineRemainClear = hadFuzhuline ? Math.max(0, remainClear) : 0;
            self.initFuzhuBtnstate();
            console.log("当前状态:", hadFuzhuline, "remain:", self.num_fuzhulineRemainClear);
        });
    }

    public showNext(): void {
        const self = this;
        this.node_game.destroy();
        UIMgr.getInstance().showWatingUI();
        this.num_rellyLevel = this.getRellyLevel();
        this._resetLevelBehaviorStats();
        const arrowLevel = PlayerDataStore.arrow_level;
        console.log("[LevelVerify] showNext: 即将加载 level_" + this.num_rellyLevel + ".json | 显示第" + ((arrowLevel && arrowLevel.arrow_level_id) || "?") + "关 | level_index=" + ((arrowLevel && arrowLevel.level_index) || "未配置"));
        ConfigMgr.getInstance().loadLevelData("level_" + this.num_rellyLevel, false).then(() => {
            if (!self.isViewAlive()) return;
            self.data_levelinfo = ConfigMgr.getInstance().getLevelById(self.num_rellyLevel);
            self._eliminateCounter = 0;
            self._totalEliminated = 0;
            const localCount = self.data_levelinfo && self.data_levelinfo.Arrows ? self.data_levelinfo.Arrows.length : "加载失败";
            console.log("[LevelVerify] showNext 加载完成: level_" + self.num_rellyLevel + ".json | 本地实际箭头数=" + localCount + " | 服务器 arrow_count=" + (PlayerDataStore.arrow_level.arrow_count || "?") + (String(localCount) !== String(PlayerDataStore.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配" : " ✅ 匹配"));
            console.log("[ArrowLevel] showNext: 关卡加载完成 level=" + self.num_rellyLevel + " big_reward_trigger=" + self._getBigRewardTriggerCount());
            self.ShowGame();
        });
    }

    public showFuhuo(): void {
        this.bool_isStop = false;
        this.num_life = PlayerDataStore.arrow_level.life_count || 3;
        this._reviveCount = (this._reviveCount || 0) + 1;
        console.log("[ArrowStats] 复活 revive_count=" + this._reviveCount);
        this.refreshLifeHearts();
    }

    public OnClickSet(): void {
        const self = this;
        UIMgr.getInstance().show(UIDefine.arrowTaskPopupView).then((viewNode: cc.Node) => {
            if (!self.isViewAlive() || !viewNode || !viewNode.isValid) return;
            const cls: any = arrowTaskPopupView;
            let comp = viewNode.getComponent(cls);
            if (!comp) comp = viewNode.addComponent(cls);
        });
    }

    public closeAdState(): void {
        this.bool_cantouchAd = true;
    }

    public fontAni(): void {
    }

    public showGuide(): void {
        const flow = this.getNewbieGuideFlow();
        const isDone = flow && flow.isDone && flow.isDone();
        const arrowLevelId = PlayerDataStore.arrow_level && Number(PlayerDataStore.arrow_level.arrow_level_id || 0);
        if (UserData.getInstance().level === 1 && arrowLevelId <= 1 && !isDone) {
            this.setGuideNodeActive("guide_level1", true);
        } else if (UserData.getInstance().level === 2) {
            if (this._level2ZoomGuideDismissed) {
                this.setGuideNodeActive("guide_level2", false);
            } else {
                this.setGuideNodeActive("guide_level2", true);
            }
        }
    }

    public closeGuide(): void {
        this.setGuideNodeActive("guide_level2", false);
    }

    public closeGuide2(): void {
        this._level2ZoomGuideDismissed = true;
        this.setGuideNodeActive("guide_level2", false);
    }

    public clsoeSetHandle(): void {
        this.bool_isStop = false;
        this.refreshNewbieGuideState();
    }

    public _cacheSpriteFrames(): void {
        this.ensureRuntimeNodeRefs();
        const vbNode = this.node_tishi && this.node_tishi.getChildByName("vb");
        if (vbNode) {
            const sprite = vbNode.getComponent(cc.Sprite);
            if (sprite && sprite.spriteFrame) this._sfVb = sprite.spriteFrame;
        }
        ResMgr.getInstance().loadRes("texture/gameing/off", cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
            if (frame) this._sfOff = frame;
        });
    }

    public _applyFuzhuSprite(active: boolean): void {
        if (!this.node_fuzhuad) return;
        const sprite = this.node_fuzhuad.getComponent(cc.Sprite);
        const propCount = UserData.getInstance().guideline_prop_count || 0;
        if (sprite) {
            const frame = active || propCount > 0 ? this._sfVb : this._sfOff;
            if (frame) sprite.spriteFrame = frame;
        }
        this.node_fuzhuad.active = true;
        if (this.node_fuzhustate) {
            this.node_fuzhustate.active = active;
            const stateSprite = this.node_fuzhustate.getComponent(cc.Sprite);
            if (stateSprite) stateSprite.enabled = !active;
        }
    }

    public initFuzhuBtnstate(): void {
        const self = this;
        if (!this.node_fuzhuad) return;
        if (!this._sfOff) {
            ResMgr.getInstance().loadRes("texture/gameing/off", cc.SpriteFrame, this, "game").then((frame: cc.SpriteFrame) => {
                if (frame) {
                    self._sfOff = frame;
                    self.initFuzhuBtnstate();
                }
            });
            return;
        }

        const nodeFuzhu = this.node_fuzhuad;
        const sprite = nodeFuzhu.getComponent(cc.Sprite);
        const propCount = UserData.getInstance().guideline_prop_count || 0;
        let numNode = nodeFuzhu.getChildByName("txt_fuzhunum");
        if (!numNode) {
            numNode = new cc.Node("txt_fuzhunum");
            const label = numNode.addComponent(cc.Label);
            label.fontSize = 18;
            label.lineHeight = 20;
            numNode.setPosition(0, 0);
            nodeFuzhu.addChild(numNode);
        }
        const numLabel = numNode.getComponent(cc.Label);
        nodeFuzhu.active = true;
        if (propCount > 0) {
            if (sprite && this._sfVb) sprite.spriteFrame = this._sfVb;
            if (numLabel) numLabel.string = propCount.toString();
            numNode.active = true;
            numNode.color = cc.color(255, 255, 255);
        } else {
            if (sprite && this._sfOff) sprite.spriteFrame = this._sfOff;
            if (numLabel) numLabel.string = "";
            numNode.active = false;
        }
        if (this.node_fuzhustate) this.node_fuzhustate.active = false;
    }

    public initTishiBtnstate(): void {
        if (!this.node_tishi || !this.node_tishi.isValid) {
            this.node_tishi = cc.find("bottom/btn_tip", this.node) || cc.find("btn_tip", this.node);
        }
        if (!this.node_tishi) {
            console.warn("[tips] node_tishi not found");
            return;
        }
        const bg = this.node_tishi.getChildByName("tipscardBG");
        const vb = this.node_tishi.getChildByName("vb");
        if (!bg || !vb) {
            console.warn("[tips] tipscardBG or vb missing");
            return;
        }
        const numNode = bg.getChildByName("txt_tipscardnum");
        const numLabel = numNode && numNode.getComponent(cc.Label);
        if (!numLabel) {
            console.warn("[tips] txt_tipscardnum label missing");
            return;
        }
        vb.active = true;
        const vbSprite = vb.getComponent(cc.Sprite);
        const bgSprite = bg.getComponent(cc.Sprite);
        if (UserData.getInstance().num_tipscards > 0) {
            bg.active = true;
            if (bgSprite) bgSprite.enabled = false;
            numLabel.string = UserData.getInstance().num_tipscards.toString();
            numNode.color = cc.color(255, 255, 255);
            if (vbSprite && this._sfVb) vbSprite.spriteFrame = this._sfVb;
        } else {
            bg.active = false;
            if (vbSprite && this._sfOff) vbSprite.spriteFrame = this._sfOff;
        }
    }

    public update(dt: number): void {
        if (!this.isCountdownEnabled() || this.bool_isStop || !this.bool_countdownStarted) return;
        this.dsj += dt;
        if (this.dsj <= 1) return;
        this.dsj = 0;
        this.num_gametime -= 1;
        this.txt_time.string = NumberUtils.formatSeconds(this.num_gametime);
        if (this.num_gametime <= 0) {
            this.bool_isStop = true;
            this.num_gametime = 0;
            this.txt_time.string = NumberUtils.formatSeconds(this.num_gametime);
            UIMgr.getInstance().show(UIDefine.cashArrowFailView);
        }
    }

    public ShowError(): void {
        const self = this;
        if (this.bool_isStop) this.bool_isStop = false;
        this.node_red.active = true;
        this.node_red.opacity = 0;
        cc.tween(this.node_red)
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 0 })
            .union()
            .repeat(2)
            .call(() => {
                self.node_red.active = false;
            })
            .start();
    }

    public changeFuzhuBtnState(): void {
        this.initFuzhuBtnstate();
    }

    public addMouseWheelSupport(): void {
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    public onMouseWheel(event: cc.Event.EventMouse): void {
        const scrollY = event.getScrollY();
        console.log("滚轮滚动增量:", scrollY);
        const factor = 1 + (scrollY > 0 ? 0.1 : -0.1);
        const targetScale = this.node_game.scale * factor;
        const gameComp: any = this.node_game.getComponent(game as any);
        const minScale = gameComp.num_minScale;
        const maxScale = gameComp.num_minScale + 1;
        const clampedScale = Math.min(Math.max(targetScale, minScale), maxScale);
        const ratio = clampedScale / this.node_game.scale;
        this.node_game.x = this.node_game.x * ratio;
        this.node_game.y = this.node_game.y * ratio;
        if (clampedScale !== this.node_game.scale) {
            this.node_game.scale = clampedScale;
            GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.gameScaleChange, {
                scale: this.node_game.scale
            });
        }
        event.stopPropagation();
    }

    public jumpLevel(): void {
        const self = this;
        this.node_game.destroy();
        UIMgr.getInstance().showWatingUI();
        this.num_rellyLevel = this.getRellyLevel();
        this._resetLevelBehaviorStats();
        const arrowLevel = PlayerDataStore.arrow_level;
        console.log("[LevelVerify] jumpLevel: 即将加载 level_" + this.num_rellyLevel + ".json | 显示第" + ((arrowLevel && arrowLevel.arrow_level_id) || "?") + "关 | level_index=" + ((arrowLevel && arrowLevel.level_index) || "未配置"));
        ConfigMgr.getInstance().loadLevelData("level_" + this.num_rellyLevel, false).then(() => {
            if (!self.isViewAlive()) return;
            self.data_levelinfo = ConfigMgr.getInstance().getLevelById(self.num_rellyLevel);
            self._eliminateCounter = 0;
            self._totalEliminated = 0;
            const localCount = self.data_levelinfo && self.data_levelinfo.Arrows ? self.data_levelinfo.Arrows.length : "加载失败";
            console.log("[LevelVerify] jumpLevel 加载完成: level_" + self.num_rellyLevel + ".json | 本地实际箭头数=" + localCount + " | 服务器 arrow_count=" + (PlayerDataStore.arrow_level.arrow_count || "?") + (String(localCount) !== String(PlayerDataStore.arrow_level.arrow_count) ? " ⚠️ 箭头数不匹配" : " ✅ 匹配"));
            console.log("[ArrowLevel] jumpLevel: 关卡加载完成 level=" + self.num_rellyLevel + " 计数器重置 big_reward_trigger=" + self._getBigRewardTriggerCount());
            self.ShowGame();
        });
    }

    public onDestroy(): void {
        this.EventRemove();
        this.stopTopBarrageRows();
        if (this.node_balanceContainer) {
            this.node_balanceContainer.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
        }
        if (this.node_withdrawBtn) {
            this.node_withdrawBtn.off(cc.Node.EventType.TOUCH_END, this.openWithMoodView, this);
        }
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        this.unscheduleAllCallbacks();
        if (this.node) cc.Tween.stopAllByTarget(this.node);
        if (this.layer_top) cc.Tween.stopAllByTarget(this.layer_top);
        if (this.layer_bottom) cc.Tween.stopAllByTarget(this.layer_bottom);
        if (this.img_life && this.img_life.node) cc.Tween.stopAllByTarget(this.img_life.node);
        if (this.node_red) cc.Tween.stopAllByTarget(this.node_red);
        if (this.node_diaozhuan) cc.Tween.stopAllByTarget(this.node_diaozhuan);
        if (this.node_yichu) cc.Tween.stopAllByTarget(this.node_yichu);
    }

    public showStartAni(): void {
        if (!this.enableTopBottomFadeAnimation) return;
        this.layer_top.opacity = 0;
        this.layer_bottom.opacity = 0;
        cc.tween(this.layer_bottom).delay(0.5).to(1, { opacity: 255 }).start();
        cc.tween(this.layer_top).delay(0.5).to(1, { opacity: 255 }).start();
    }

    public _getBigRewardTriggerCount(): number {
        const arrowLevel = PlayerDataStore.arrow_level || {};
        const count = Number(arrowLevel.big_reward_trigger || 0);
        return count > 0 ? count : 0;
    }

    public _resetLevelBehaviorStats(): void {
        this._mistakeCount = 0;
        this._retryCount = 0;
        this._hintUsedCount = 0;
        this._reviveCount = 0;
        this._levelStartTs = Date.now();
        console.log("[ArrowStats] 新关卡，重置行为统计 level=" + this.num_rellyLevel);
    }

    public _resetAttemptBehaviorStats(): void {
        this._retryCount = (this._retryCount || 0) + 1;
        this._mistakeCount = 0;
        this._reviveCount = 0;
        this._hintUsedCount = 0;
        this._levelStartTs = Date.now();
        console.log("[ArrowStats] 重开本关，retry_count=" + this._retryCount);
    }

    public _buildBehaviorStatsFields(): any {
        const arrowLevel = PlayerDataStore.arrow_level || {};
        const arrowLevelId = arrowLevel.arrow_level_id;
        const levelIndex = arrowLevel.level_index || this.num_rellyLevel || 0;
        const mistakeCount = Number(this._mistakeCount || 0);
        const reviveCount = Number(this._reviveCount || 0);
        const durationSec = this._levelStartTs ? Math.max(0, Math.round((Date.now() - this._levelStartTs) / 1000)) : 0;
        return {
            arrow_level_id: arrowLevelId || this.num_rellyLevel,
            level_index: Number(levelIndex) || 0,
            arrow_count: Number(arrowLevel.arrow_count || 0),
            mistake_count: mistakeCount,
            life_used: mistakeCount,
            retry_count: Number(this._retryCount || 0),
            hint_used: Number(this._hintUsedCount || 0),
            revive_count: reviveCount,
            duration_sec: durationSec
        };
    }

    public _reportLevelFail(): void {
        const stats: any = this._buildBehaviorStatsFields();
        stats.level_passed = 0;
        stats.settle_type = "FAIL";
        stats.level_fail = 1;
        stats.clean_win = 0;
        try {
            BusinessAnalyticsService.reportData("arrow_settle_behavior", stats);
        } catch (e) {
            console.warn("[ArrowStats] [埋点] arrow_settle_behavior(FAIL) 上报失败", e);
        }
        console.log("[ArrowLevel] [失败上报] arrowRewardSettle req=" + JSON.stringify(stats));
        LoadingHttpService.arrowRewardSettle(stats, Handler.create(null, (res: any) => {
            console.log("[ArrowLevel] [失败上报] 返回: " + JSON.stringify((res && res.data) || null));
        }), Handler.create(null, (err: any) => {
            console.warn("[ArrowLevel] [失败上报] 请求失败", err);
        }));
    }

    public _settleArrowReward(levelPassed: boolean, eliminateCountOrCallback?: any, callbackArg?: any): void {
        let eliminateCount = 0;
        let callback = callbackArg;
        if (typeof eliminateCountOrCallback === "function") {
            callback = eliminateCountOrCallback;
        } else {
            eliminateCount = Number(eliminateCountOrCallback || 0);
        }

        const self = this;
        const gameComp: any = game;
        const stats: any = this._buildBehaviorStatsFields();

        if (levelPassed) {
            stats.level_passed = 1;
            const count = eliminateCount > 0 ? eliminateCount : Number(this._eliminateCounter || 0);
            if (count > 0) stats.eliminate_count = count;
        } else {
            stats.level_passed = 0;
            let count = eliminateCount > 0 ? eliminateCount : this._getBigRewardTriggerCount();
            if (count <= 0) count = Number((PlayerDataStore.arrow_level && PlayerDataStore.arrow_level.arrow_count) || 0);
            stats.eliminate_count = count;
        }

        const settleType = levelPassed ? "PASS" : "ELIMINATE";
        stats.settle_type = settleType;
        stats.clean_win = levelPassed && stats.life_used === 0 && stats.revive_count === 0 ? 1 : 0;

        try {
            BusinessAnalyticsService.reportData("arrow_settle_behavior", {
                settle_type: stats.settle_type,
                arrow_level_id: stats.arrow_level_id,
                level_index: stats.level_index,
                arrow_count: stats.arrow_count,
                level_passed: stats.level_passed,
                eliminate_count: stats.eliminate_count || 0,
                clean_win: stats.clean_win,
                mistake_count: stats.mistake_count,
                life_used: stats.life_used,
                retry_count: stats.retry_count,
                hint_used: stats.hint_used,
                revive_count: stats.revive_count,
                duration_sec: stats.duration_sec
            });
            console.log("[ArrowStats] [埋点] arrow_settle_behavior=" + JSON.stringify(stats));
        } catch (e) {
            console.warn("[ArrowStats] [埋点] arrow_settle_behavior 上报失败", e);
        }

        const netErrorSvc: any = NetErrorPopupService;
        const retry = () => {
            self._settleArrowReward(levelPassed, eliminateCountOrCallback, callbackArg);
        };

        console.log("[ArrowLevel] _settleArrowReward: 发起结算 type=" + settleType + " req=" + JSON.stringify(stats));
        console.log("[ArrowLevel] [结算接口][请求] arrowRewardSettle type=" + settleType + " req=" + JSON.stringify(stats));

        LoadingHttpService.arrowRewardSettle(stats, Handler.create(null, (res: any) => {
            if (netErrorSvc && netErrorSvc.shouldPop(res)) {
                console.warn("[ArrowLevel] _settleArrowReward force-retry code=" + (res && res.code));
                netErrorSvc.showAndRetry(retry);
                return;
            }
            console.log("[ArrowLevel] [结算接口][返回] arrowRewardSettle type=" + settleType + " req=" + JSON.stringify(stats) + " res=" + JSON.stringify((res && res.data) || null));
            if (res && res.data) {
                const arrowLevelId = res.data.arrow_level && Number(res.data.arrow_level.arrow_level_id || 0);
                if (res.data.cash_balance !== undefined) {
                    PlayerDataStore.cash_balance = Number(res.data.cash_balance);
                    self.updateTopBalance(Number(res.data.cash_balance));
                    self.refreshTopBalanceUI();
                }
                if (levelPassed && res.data.arrow_level && arrowLevelId > 0) {
                    PlayerDataStore.updateArrowLevel(res.data.arrow_level);
                    const levelIndex = res.data.arrow_level.level_index != null ? res.data.arrow_level.level_index : res.data.arrow_level.arrow_level_index;
                    console.log("[LevelVerify] 结算成功，服务端下发下一关: level_id=" + arrowLevelId + " level_index=" + (levelIndex || "未配置") + " arrow_count=" + (res.data.arrow_level.arrow_count || "?") + (levelIndex ? " → 下一关将加载 level_" + levelIndex + ".json" : " ⚠️ 无 level_index，将用 level_id=" + arrowLevelId + " 作为文件索引（旧兼容）"));
                    self._refreshArrowLevelLabel();
                } else if (res.data.arrow_level && arrowLevelId <= 0) {
                    console.warn("[ArrowLevel] _settleArrowReward: 忽略无效 arrow_level 数据 " + JSON.stringify(res.data.arrow_level));
                }
                console.log("[ArrowLevel] _settleArrowReward: 结算成功 switch_reward=" + (res.data.switch_reward || 0) + " cash_balance=" + (res.data.cash_balance || 0) + " show_force_video=" + (res.data.show_force_video || false) + " next_arrow_level_id=" + (arrowLevelId > 0 ? arrowLevelId : "N/A"));
            }
            if (callback) callback(res);
            if (levelPassed) self._refreshUserInfoAfterLevelPass();
            void gameComp;
        }), Handler.create(null, (err: any) => {
            console.warn("[ArrowLevel] [结算接口][返回] arrowRewardSettle type=" + settleType + " FAIL req=" + JSON.stringify(stats) + " err=" + JSON.stringify(err));
            console.warn("[ArrowLevel] _settleArrowReward: 结算请求失败 err=" + JSON.stringify(err));
            const message = err && err.message ? String(err.message) : "";
            const isDuplicate = levelPassed && (message.indexOf("重复通关") >= 0 || message.toLowerCase().indexOf("duplicate") >= 0);
            if (!isDuplicate && netErrorSvc && netErrorSvc.shouldPop(err)) {
                console.warn("[ArrowLevel] _settleArrowReward 网络异常，弹重试窗");
                netErrorSvc.showAndRetry(retry);
                return;
            }
            if (isDuplicate) {
                const localLevel = Number(UserData.getInstance().level || 1);
                const currentArrowLevelId = PlayerDataStore.arrow_level && Number(PlayerDataStore.arrow_level.arrow_level_id || 0);
                const nextLevel = Math.max(localLevel, (currentArrowLevelId || self.num_rellyLevel || 0) + 1);
                try {
                    const source = PlayerDataStore.arrow_level || {};
                    const cloned: any = {};
                    for (const key in source) cloned[key] = source[key];
                    cloned.arrow_level_id = nextLevel;
                    cloned.level_index = nextLevel;
                    if (PlayerDataStore.updateArrowLevel) {
                        PlayerDataStore.updateArrowLevel(cloned);
                    } else {
                        PlayerDataStore.arrow_level = cloned;
                    }
                    console.warn("[ArrowLevel] _settleArrowReward: 命中重复通关兜底，强制推进 arrow_level_id=" + nextLevel + " level_index=" + nextLevel);
                } catch (e) {
                    console.warn("[ArrowLevel] _settleArrowReward: 重复通关兜底失败", e);
                }
            }
            if (callback) callback(null);
        }));
    }

    public _refreshUserInfoAfterLevelPass(): void {
        try {
            const svc: any = UserInfoService;
            if (!svc || typeof svc.getInstance !== "function") return;
            const instance = svc.getInstance();
            if (instance && typeof instance.fetch === "function") instance.fetch();
        } catch (e) {
            console.warn("[ArrowLevel] _refreshUserInfoAfterLevelPass error", e);
        }
    }

    public getRellyLevel2(): number {
        if (UserData.getInstance().level > ConfigMgr.getInstance().getAll(ConfigDefine.GametimeConfig).length) {
            return Random.range(19, ConfigMgr.getInstance().getAll(ConfigDefine.GametimeConfig).length);
        }
        return UserData.getInstance().level;
    }

    public getRellyLevel(): number {
        const arrowLevel = PlayerDataStore.arrow_level;
        console.log("[LevelVerify] getRellyLevel 入参 arrow_level=" + JSON.stringify({
            arrow_level_id: arrowLevel && arrowLevel.arrow_level_id,
            level_index: arrowLevel && arrowLevel.level_index,
            arrow_count: arrowLevel && arrowLevel.arrow_count
        }));

        const levelIndex = arrowLevel && arrowLevel.level_index;
        if (levelIndex && levelIndex > 0) {
            console.log("[LevelVerify] getRellyLevel → 使用 level_index=" + levelIndex + " (显示第" + (arrowLevel.arrow_level_id || "?") + "关，加载 level_" + levelIndex + ".json)");
            return levelIndex;
        }

        const arrowLevelId = arrowLevel && arrowLevel.arrow_level_id;
        if (arrowLevelId && arrowLevelId > 0) {
            console.warn("[LevelVerify] getRellyLevel → level_index 未配置，降级使用 arrow_level_id=" + arrowLevelId + " 加载 level_" + arrowLevelId + ".json（旧兼容模式）");
            return arrowLevelId;
        }

        const totalLevels = ConfigMgr.getInstance().getAll(ConfigDefine.GametimeConfig).length;
        console.log(totalLevels);
        if (UserData.getInstance().level > totalLevels) {
            let randomLevel: number;
            const recentLevels: number[] = UserData.getInstance().recentRandomLevels || [];
            const unusedLevels: number[] = [];
            for (let l = 19; l <= totalLevels; l++) {
                if (!recentLevels.includes(l)) unusedLevels.push(l);
            }
            randomLevel = Random.range(19, totalLevels);
            recentLevels.unshift(randomLevel);
            if (recentLevels.length > 7) recentLevels.pop();
            UserData.getInstance().recentRandomLevels = recentLevels;
            console.log("[ArrowLevel] getRellyLevel: 服务端无配置，使用随机关卡=" + (randomLevel || 25));
            return randomLevel || 25;
        }
        console.log("[ArrowLevel] getRellyLevel: 服务端无配置，使用本地 level=" + UserData.getInstance().level);
        return UserData.getInstance().level;
    }

    public preload(): void {
        cc.assetManager.loadBundle(InterfaceMgr.bundleName.ui, (err: Error, bundle: cc.AssetManager.Bundle) => {
            if (err) {
                console.error("UI资源包加载失败:", err);
                return;
            }
            bundle.preloadDir("audio", (error: Error, assets: any[]) => {
                if (error) console.error("音频资源预加载失败:", error);
                else console.log("成功预加载 " + assets.length + " 个音频资源");
            });
            bundle.preloadDir("prefab", (error: Error, assets: any[]) => {
                if (error) console.error("预制体资源预加载失败:", error);
                else console.log("成功预加载 " + assets.length + " 个预制体资源");
            });
            bundle.preloadDir("spine", (error: Error, assets: any[]) => {
                if (error) console.error("Spine资源预加载失败:", error);
                else console.log("成功预加载 " + assets.length + " 个Spine资源");
            });
            bundle.preloadDir("texture", (error: Error, assets: any[]) => {
                if (error) console.error("纹理资源预加载失败:", error);
                else console.log("成功预加载 " + assets.length + " 个纹理资源");
            });
        });
    }

    public showHard(): void {
        const self = this;
        AudioMgr.getInstance().playEffect("audio/difficulty_warning", InterfaceMgr.bundleName.game);
        this.node_hardsp.active = true;
        this.node_red.active = true;
        this.node_red.opacity = 0;
        cc.tween(this.node_red)
            .to(0.2, { opacity: 255 })
            .to(0.2, { opacity: 0 })
            .union()
            .repeat(8)
            .call(() => {
                self.node_red.active = false;
            })
            .start();
        this.scheduleOnce(() => {
            self.node_hardsp.active = false;
        }, 3);
    }

    public onGuideClick(): void {
        const flow = this.getNewbieGuideFlow();
        if (flow && this.isNewbieGuideStep(flow.STEP_TOP_BALANCE)) {
            this.openWithMoodView();
        } else {
            console.log("[Guide] clicked>>>>>>>>>>>>");
        }
    }
}