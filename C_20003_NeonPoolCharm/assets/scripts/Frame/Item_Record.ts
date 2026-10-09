const { ccclass, property } = cc._decorator;

@ccclass
export default class Item_Record extends cc.Component {

    @property(cc.RichText)
    rich: cc.RichText = null;

    setData(data: any) {
        let color = "<color=#F18321>";
        if ("tkey_209" == data.key) {
            color = "<color=#F18321>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.peopleCount + "</color>";
        } else if ("tkey_210" == data.key) {
            color = "<color=#C23E3E>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.account + "</color>&&value2==<color =#4480BE>" + data.peopleCount + "</color>";
        } else if ("tkey_211" == data.key) {
            color = "<color=#249A50>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.account + "</color>&&value2==<color =#4480BE>" + data.peopleCount + "</color>";
        }
        let index = this.rich.string.indexOf(":");
        if (-1 == index) {
            index = this.rich.string.indexOf(":");
        }
        this.rich.string = -1 != index ? color + this.rich.string.substring(0, index + 1) + "</color>" + this.rich.string.substring(index + 1, this.rich.string.length) : "" + this.rich.string;
    }
}
