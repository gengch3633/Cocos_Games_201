import NumberUtils from "./NumberUtils";

const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
@menu("UI/Cocos/NumberRoll")
export default class NumberRoll extends cc.Component {
    private _lab: cc.Label = null;

    @property({
        tooltip: "动画时长"
    })
    public duration: number = 0.2;

    @property({
        tooltip: "是否为整型"
    })
    public isInteger: boolean = true;

    @property({
        tooltip: "单位"
    })
    public unit: string = "";

    private _value: number = null;

    private _curValue: number = 0;

    public get lab(): cc.Label {
        if (!this._lab) {
            this._lab = this.getComponent(cc.Label);
        }
        return this._lab;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        if (value == this._value) {
            return;
        }
        if (this.isInteger && Math.abs(value - this._value) <= 1) {
            this.curValue = value;
        } else {
            this._value = value;
            cc.Tween.stopAllByTarget(this);
            cc.tween(this).to(this.duration, {
                curValue: value
            }).start();
        }
    }

    public async change(value: number): Promise<void> {
        if (value == this._value) {
            return;
        }
        if (this.isInteger && Math.abs(value - this._value) <= 1) {
            this.curValue = value;
            return;
        }
        this._value = value;
        cc.Tween.stopAllByTarget(this);
        await new Promise<void>((resolve) => {
            cc.tween(this).to(this.duration, {
                curValue: value
            }).call(() => {
                resolve();
            }).start();
        });
    }

    public set(value: number): void {
        cc.Tween.stopAllByTarget(this);
        this.curValue = value;
    }

    public get curValue(): number {
        return this._curValue;
    }

    public set curValue(value: number) {
        value = this.isInteger
            ? Math.floor(value)
            : NumberUtils.decimalPlaces(value) > 2
                ? Number(value.toFixed(2))
                : value;
        this._curValue = value;
        this.lab.string = this.curValue + this.unit;
    }
}