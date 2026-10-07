import NumberUtils from "./NumberUtils";

const { ccclass, menu, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
@menu("UI/Cocos/NumberRoll")
export default class NumberRoll extends cc.Component {
    _lab: cc.Label | null = null;

    @property({
        tooltip: "动画时长",
    })
    duration = 0.2;

    @property({
        tooltip: "是否为整型",
    })
    isInteger = true;

    @property({
        tooltip: "单位",
    })
    unit = "";

    _value: number | null = null;
    _curValue = 0;

    get lab(): cc.Label | null {
        if (!this._lab) {
            this._lab = this.getComponent(cc.Label);
        }
        return this._lab;
    }

    get value(): number | null {
        return this._value;
    }

    set value(val: number | null) {
        if (val != this._value) {
            if (this.isInteger && Math.abs((val as number) - (this._value as number)) <= 1) {
                this.curValue = val as number;
            } else {
                this._value = val;
                cc.Tween.stopAllByTarget(this);
                cc.tween(this).to(this.duration, {
                    curValue: val,
                }).start();
            }
        }
    }

    change(val: number): Promise<void> {
        return new Promise((resolve) => {
            if (val == this._value) {
                resolve();
                return;
            }
            if (this.isInteger && Math.abs(val - (this._value as number)) <= 1) {
                this.curValue = val;
                resolve();
            } else {
                this._value = val;
                cc.Tween.stopAllByTarget(this);
                cc.tween(this).to(this.duration, {
                    curValue: val,
                }).call(() => {
                    resolve();
                }).start();
            }
        });
    }

    set(val: number): void {
        cc.Tween.stopAllByTarget(this);
        this.curValue = val;
    }

    get curValue(): number {
        return this._curValue;
    }

    set curValue(val: number) {
        val = this.isInteger ? Math.floor(val) : NumberUtils.decimalPlaces(val) > 2 ? Number(val.toFixed(2)) : val;
        this._curValue = val;
        if (this.lab) {
            this.lab.string = this.curValue + this.unit;
        }
    }
}
