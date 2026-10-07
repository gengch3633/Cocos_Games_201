import { FrameData } from "./FrameData";
import { FrameSDK } from "./FrameSDK";
import i18 from "./i18";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GM extends cc.Component {
    static toutnum: number = 0;
    static isopen: boolean = false;

    @property(cc.Node)
    mGmNode: cc.Node = null;

    @property(cc.Node)
    btnDetails: cc.Node = null;

    @property(cc.Node)
    LangNode: cc.Node = null;

    @property(cc.Node)
    Toast: cc.Node = null;

    @property(cc.Node)
    bottomNode: cc.Node = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property([cc.Toggle])
    toggleList: cc.Toggle[] = [];

    lPass: string = "";

    @property(cc.Node)
    mPassNode: cc.Node = null;

    baseVersion: string = "1.0.0";
    coinType: string[] = [];
    baseType: number = -1;
    baseData: Record<number, number[]> = {
        6: [100, 1000, 10000, 100000],
        4: [1, 2, 3, 4],
        8: [1, 10, 50, 100],
        9: [100, 1000, 10000, 100000],
        10: [100, 1000, 10000, 100000]
    };

    onDisable(): void {
    }

    initLang(): void {
        this.LangNode.active = true;
        const mainNode = this.LangNode.getChildByName("mainNode");
        const template = cc.instantiate(mainNode.children[0]);
        mainNode.removeAllChildren();
        for (const country of FrameData.SDK_CONF.COUNTRY_LIST) {
            const item = cc.instantiate(template);
            item.getChildByName("Label").getComponent(cc.Label).string = country.country + " - " + country.language;
            item.getComponent(cc.Button).clickEvents[0].customEventData = country.language + "_" + country.country;
            mainNode.addChild(item);
        }
    }

    static open(callback?: () => void): void {
        if (FrameData.toolKey == "") {
            return;
        }
        this.toutnum++;
        if (this.toutnum >= 5 && !this.isopen) {
            this.isopen = true;
            FrameSDK.loadPrefab("Panel_GM", (prefab) => {
                cc.instantiate(prefab).parent = FrameSDK.Panel;
                this.isopen = false;
                if (callback) {
                    callback();
                }
            });
        }
    }

    onLoad(): void {
        this.LangNode.active = false;
        this.Toast.active = false;
        this.mPassNode.active = FrameData.toolKey != "";
        this.coinType = Object.keys(FrameData.saveData.credit);
        if (FrameData.toolKey == "") {
            this.node.destroy();
        }
    }

    closePage(): void {
        this.node.destroy();
    }

    setLang(_event: cc.Event, langData: string): void {
        FrameSDK.setLan(langData);
        this.LangNode.active = false;
        this.initBottomData();
    }

    onEnable(): void {
        this.lPass = "";
        this.toggleList[1].isChecked = FrameData.SDK_CONF.NO_VIDEO;
        this.toggleList[3].isChecked = FrameData.isTest;
    }

    clickGm(event: cc.Event): void {
        const target = event.target as cc.Node;
        switch (target.name) {
            case "0":
                break;
            case "1":
                FrameData.SDK_CONF.NO_VIDEO = target.getComponent(cc.Toggle).isChecked;
                break;
            case "2":
                break;
            case "3":
                FrameData.isTest = target.getComponent(cc.Toggle).isChecked;
                cc.director.emit("showTest");
                break;
            case "4":
                this.initLang();
                break;
            case "5":
                cc.sys.localStorage.clear();
                cc.assetManager.cacheManager.clearCache();
                cc.game.removeAll(cc.game.EVENT_SHOW);
                cc.game.removeAll(cc.game.EVENT_HIDE);
                cc.EventTarget.prototype.emit = function () { };
                if (cc.sys.isBrowser) {
                    location.reload();
                } else {
                    this.showToast("请手动重启游戏！");
                }
                break;
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
                this.initBtnDetail(parseInt(target.name));
                break;
        }
    }

    initBtnDetail(type: number): void {
        if (this.baseType != type) {
            this.btnDetails.active = true;
            if (this.btnDetails.active) {
                this.baseType = type;
                this.btnDetails.getChildByName("0").getComponentInChildren(cc.Label).string = "+" + this.baseData[type][0];
                this.btnDetails.getChildByName("1").getComponentInChildren(cc.Label).string = "+" + this.baseData[type][1];
                this.btnDetails.getChildByName("2").getComponentInChildren(cc.Label).string = "+" + this.baseData[type][2];
                this.btnDetails.getChildByName("3").getComponentInChildren(cc.Label).string = "+" + this.baseData[type][3];
            }
        } else {
            this.btnDetails.active = !this.btnDetails.active;
        }
    }

    showToast(msg: string): void {
        this.Toast.active = true;
        this.Toast.stopAllActions();
        this.Toast.position = cc.v3(0, 0);
        this.Toast.opacity = 255;
        this.Toast.getComponentInChildren(cc.Label).string = msg;
        this.Toast.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.spawn(cc.moveBy(0.1, cc.v2(0, 200)), cc.fadeOut(0.1)),
            cc.callFunc(() => {
                this.Toast.active = false;
            })
        ));
    }

    initBottomData(): void {
        this.bottomNode.getChildByName("1").getComponent(cc.Label).string = "GM_VERSION:NULL";
        this.bottomNode.getChildByName("2").getComponent(cc.Label).string = "VERSION:NULL";
        this.bottomNode.getChildByName("3").getComponent(cc.Label).string = "USER_ID:NULL";
        this.bottomNode.getChildByName("4").getComponent(cc.Label).string = "Country:" + FrameData.myCountry;
        this.bottomNode.getChildByName("5").getComponent(cc.Label).string = "Languge:" + i18.myLanguge;
        this.bottomNode.getChildByName("6").getComponent(cc.Label).string = "PG:NULL";
        this.bottomNode.getChildByName("7").getComponent(cc.Label).string = "Code:NULL";
        this.bottomNode.getChildByName("8").getComponent(cc.Label).string = "SDK_VERSION:NULL";
        this.bottomNode.getChildByName("9").getComponent(cc.Label).string = "Accumulated online time:NULL";
        this.bottomNode.getChildByName("10").getComponent(cc.Label).string = "Cumulative H5 duration:NULL";
        this.bottomNode.getChildByName("11").getComponent(cc.Label).string = "Cumulative login days:" + FrameData.saveData.loginDays;
        this.bottomNode.getChildByName("12").getComponent(cc.Label).string = "Cumulative video count:NULL";
        this.bottomNode.getChildByName("13").getComponent(cc.Label).string = "Total number of screen inserts:NULL";
    }

    addBaseData(event: cc.Event): void {
        const index = parseInt((event.target as cc.Node).name);
        if (index == 5) {
            this.baseData[this.baseType][index] = parseInt(this.editBox.string) ? parseInt(this.editBox.string) : 0;
        }
        switch (this.baseType) {
            case 6:
                for (let i = 0; i < this.coinType.length; i++) {
                    FrameData.saveData.credit[this.coinType[i]] += this.baseData[this.baseType][index];
                }
                this.showToast("ICON +" + this.baseData[this.baseType][index]);
                break;
            case 7:
                FrameData.saveData.loginDays += this.baseData[this.baseType][index];
                this.showToast("Line Day +" + this.baseData[this.baseType][index]);
                break;
            case 8:
                FrameData.saveData.CashVideoCount += this.baseData[this.baseType][index];
                cc.director.emit(FrameSDK.frameData.ListenKeys.VIDEO_SUC);
                this.showToast("AD NUM+" + this.baseData[this.baseType][index]);
                break;
        }
        this.initBottomData();
    }

    clickPass(_event: cc.Event, key: string): void {
        if (key == "OK") {
            this.lPass = "";
            this.showToast("Password error");
        } else {
            this.lPass += key;
            if (this.lPass == FrameData.toolKey) {
                this.mPassNode.active = false;
                this.initBottomData();
                this.btnDetails.active = false;
            }
        }
    }
}
