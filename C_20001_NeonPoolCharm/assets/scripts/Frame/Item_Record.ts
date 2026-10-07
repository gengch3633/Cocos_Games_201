const { ccclass, property } = cc._decorator;

@ccclass
export default class Item_Record extends cc.Component {
    @property(cc.RichText)
    rich: cc.RichText = null;

    setData(data: { key: string; peopleCount?: number; account?: string }): void {
        let colorPrefix = "<color=#F18321>";
        if (data.key == "tkey_209") {
            colorPrefix = "<color=#F18321>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.peopleCount + "</color>";
        } else if (data.key == "tkey_210") {
            colorPrefix = "<color=#C23E3E>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.account + "</color>&&value2==<color =#4480BE>" + data.peopleCount + "</color>";
        } else if (data.key == "tkey_211") {
            colorPrefix = "<color=#249A50>";
            this.rich.string = data.key + "??&value1==<color =#4480BE>" + data.account + "</color>&&value2==<color =#4480BE>" + data.peopleCount + "</color>";
        }
        let colonIndex = this.rich.string.indexOf(":");
        if (colonIndex == -1) {
            colonIndex = this.rich.string.indexOf(":");
        }
        this.rich.string = colonIndex != -1
            ? colorPrefix + this.rich.string.substring(0, colonIndex + 1) + "</color>" + this.rich.string.substring(colonIndex + 1, this.rich.string.length)
            : "" + this.rich.string;
    }
}
