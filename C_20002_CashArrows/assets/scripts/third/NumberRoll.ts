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
    duration: number = .2;
    @property({
        tooltip: " 是否为整型 "
    })
    isInteger: boolean = !0;
    @property({
        tooltip: " 单位 "
    })
    unit: string = " ";
    _value: any = null;
    _curValue: number = 0;

    get lab() {
        this._lab || (this._lab = this.getComponent(cc.Label));
        return this._lab;
    }

    get value() {
        return this._value;
    }

    set value(e: number) {
        if (e != this._value) if (this.isInteger && Math.abs(e - this._value) <= 1) this.curValue = e; else {
            this._value = e;
            cc.Tween.stopAllByTarget(this);
            cc.tween(this).to(this.duration, {
                curValue: e
            }).start();
        }
    }

    change(e: number) {
        var t = this;
        return new Promise<void>(function (i) {
            if (e == t._value) return i();
            if (t.isInteger && Math.abs(e - t._value) <= 1) {
                t.curValue = e;
                i();
            } else {
                t._value = e;
                cc.Tween.stopAllByTarget(t);
                cc.tween(t).to(t.duration, {
                    curValue: e
                }).call(function () {
                    i();
                }).start();
            }
        });
    }

    set(e: number) {
        cc.Tween.stopAllByTarget(this);
        this.curValue = e;
    }

    get curValue() {
        return this._curValue;
    }

    set curValue(e: number) {
        e = this.isInteger ? Math.floor(e) : NumberUtils.decimalPlaces(e) > 2 ? Number(e.toFixed(2)) : e;
        this._curValue = e;
        this.lab.string = this.curValue + this.unit;
    }
}
