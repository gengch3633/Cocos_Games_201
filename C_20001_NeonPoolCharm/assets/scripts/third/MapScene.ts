import * as utils from "./utils";

const { ccclass } = cc._decorator;

@ccclass
export default class MapScene extends cc.Component {
    clickMap(event: { x: number; y: number }): void {
        console.log("clickMap", event);
        const build = this.node.getChildByName("build");
        build.x = event.x;
        build.y = event.y;
    }

    saveSprite(): void {}

    onLoad(): void {
        const winSize = cc.winSize;
        console.log(winSize);
        this.node.height = winSize.height;
        const spriteFrame = this.node.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame;
        console.log("sFrame", spriteFrame);
        const button = this.node.getChildByName("button");
        button.on(
            "click",
            () => {
                console.log("click");
                const canvas = cc.find("Canvas");
                console.log("find ", canvas);
                const diamondNode = canvas.getChildByName("diamondNode");
                console.log("diamondNode", diamondNode);
                const spriteNode = this.node.getChildByName("sprite");
                console.log("spriteFrame name", spriteNode.getComponent(cc.Sprite).spriteFrame.name);
                console.log("sprite", spriteNode);
                console.log(
                    "sprite attr",
                    spriteNode.uuid,
                    spriteNode.name,
                    spriteNode.width,
                    spriteNode.height,
                    spriteNode.x,
                    spriteNode.y,
                    spriteNode.position,
                    spriteNode.scale,
                    spriteNode.scaleX,
                    spriteNode.scaleY,
                    spriteNode.anchorX,
                    spriteNode.anchorY
                );
                const data = {
                    uuid: spriteNode.uuid,
                    name: spriteNode.name,
                    width: spriteNode.width,
                    height: spriteNode.height,
                    x: spriteNode.x,
                    y: spriteNode.y,
                    position: spriteNode.position,
                    scale: spriteNode.scale,
                    scaleX: spriteNode.scaleX,
                    scaleY: spriteNode.scaleY,
                    anchorX: spriteNode.anchorX,
                    anchorY: spriteNode.anchorY,
                };
                let json = JSON.stringify(data);
                json = utils.formatJSON(json);
                if (cc.sys.isNative) {
                    cc.log("getWritablePath:" + jsb.fileUtils.getWritablePath());
                    cc.log(jsb.fileUtils.writeStringToFile(json, "C:\\Users\\sesame\\Desktop\\json\\data.json"));
                } else if (cc.sys.isBrowser) {
                    const blob = new Blob([json], { type: "application/json" });
                    const link = document.createElement("a");
                    link.download = "savetest";
                    link.innerHTML = "Download File";
                    if (window.webkitURL != null) {
                        link.href = window.webkitURL.createObjectURL(blob);
                    } else {
                        link.href = window.URL.createObjectURL(blob);
                        link.onclick = destroyClickedElement;
                        link.style.display = "none";
                        document.body.appendChild(link);
                    }
                }
                const spine = this.node
                    .getChildByName("container")
                    .getChildByName("spine2")
                    .getComponent(sp.Skeleton);
                console.log("spine1 Skeleton", spine, spine.skeletonData);
                console.log("spine1 Skeleton skeletonData", spine.skeletonData, spine.skeletonData.name);
            },
            this
        );
    }
}

declare function destroyClickedElement(event: Event): void;

declare global {
    interface Window {
        webkitURL?: typeof URL;
    }
}
