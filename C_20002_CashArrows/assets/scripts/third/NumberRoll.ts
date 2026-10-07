import NumberUtils from "./NumberUtils";

const { ccclass, property, requireComponent, menu } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
@menu(" UI/ Cocos/ NumberRoll ")
export default class NumberRoll extends cc.Component {
    _lab: cc.Label = null;

    @property({
        tooltip: " 动画时长 "
    })
    duration: number = 0.2;

    @property({
        tooltip: " 是否为整型 "
    })
    isInteger: boolean = true;

    @property({
        tooltip: " 单位 "
    })
    unit: string = " ";

    _value: number = null;
    _curValue: number = 0;

    get lab(): cc.Label {
        if (!this._lab) {
            this._lab = this.getComponent(cc.Label);
        }
        return this._lab;
    }

    get value(): number {
        return this._value;
    }

    set value(nextValue: number) {
        if (nextValue != this._value) {
            if (this.isInteger && Math.abs(nextValue - this._value) <= 1) {
                this.curValue = nextValue;
            } else {
                this._value = nextValue;
                cc.Tween.stopAllByTarget(this);
                cc.tween(this).to(this.duration, {
                    curValue: nextValue
                }).start();
            }
        }
    }

    change(nextValue: number): Promise<void> {
        return new Promise((resolve) => {
            if (nextValue == this._value) {
                resolve();
                return;
            }
            if (this.isInteger && Math.abs(nextValue - this._value) <= 1) {
                this.curValue = nextValue;
                resolve();
            } else {
                this._value = nextValue;
                cc.Tween.stopAllByTarget(this);
                cc.tween(this).to(this.duration, {
                    curValue: nextValue
                }).call(() => {
                    resolve();
                }).start();
            }
        });
    }

    set(nextValue: number): void {
        cc.Tween.stopAllByTarget(this);
        this.curValue = nextValue;
    }

    get curValue(): number {
        return this._curValue;
    }

    set curValue(nextValue: number) {
        nextValue = this.isInteger ? Math.floor(nextValue) : NumberUtils.decimalPlaces(nextValue) > 2 ? Number(nextValue.toFixed(2)) : nextValue;
        this._curValue = nextValue;
        this.lab.string = this.curValue + this.unit;
    }
}
