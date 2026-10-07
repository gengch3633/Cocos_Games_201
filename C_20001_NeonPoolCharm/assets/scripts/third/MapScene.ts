import utils from "./utils";

const { ccclass } = cc._decorator;

@ccclass
export default class MapScene extends cc.Component {
    clickMap(e: cc.Vec2): void {
        console.log("clickMap", e);
        const t = this.node.getChildByName("build");
        t.x = e.x;
        t.y = e.y;
    }

    saveSprite(): void {}

    onLoad(): void {
        const e = cc.winSize;
        console.log(e);
        this.node.height = e.height;
        const t = this.node.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame;
        console.log("sFrame", t);
        const o = this.node.getChildByName("button");
        const n = this;
        o.on("click", function () {
            console.log("click");
            const e = cc.find("Canvas");
            console.log("find ", e);
            const t = e.getChildByName("diamondNode");
            console.log("diamondNode", t);
            const o = n.node.getChildByName("sprite");
            console.log("spriteFrame name", o.getComponent(cc.Sprite).spriteFrame.name);
            console.log("sprite", o);
            console.log("sprite attr", o.uuid, o.name, o.width, o.height, o.x, o.y, o.position, o.scale, o.scaleX, o.scaleY, o.anchorX, o.anchorY);
            const i = {
                uuid: o.uuid,
                name: o.name,
                width: o.width,
                height: o.height,
                x: o.x,
                y: o.y,
                position: o.position,
                scale: o.scale,
                scaleX: o.scaleX,
                scaleY: o.scaleY,
                anchorX: o.anchorX,
                anchorY: o.anchorY,
            };
            let a = JSON.stringify(i);
            a = utils.formatJSON(a);
            if (cc.sys.isNative) {
                cc.log("getWritablePath:" + jsb.fileUtils.getWritablePath());
                cc.log(jsb.fileUtils.writeStringToFile(a, "C:\\Users\\sesame\\Desktop\\json\\data.json"));
            } else if (cc.sys.isBrowser) {
                const l = new Blob([a], {
                    type: "application/json",
                });
                const s = document.createElement("a");
                s.download = "savetest";
                s.innerHTML = "Download File";
                if (null != window.webkitURL) {
                    s.href = window.webkitURL.createObjectURL(l);
                } else {
                    s.href = window.URL.createObjectURL(l);
                    s.onclick = destroyClickedElement;
                    s.style.display = "none";
                    document.body.appendChild(s);
                }
            }
            const c = n.node.getChildByName("container").getChildByName("spine2").getComponent(sp.Skeleton);
            console.log("spine1 Skeleton", c, c.skeletonData);
            console.log("spine1 Skeleton skeletonData", c.skeletonData, c.skeletonData.name);
        }, this);
    }
}
