declare const Editor: any;

const { ccclass, property, menu, executeInEditMode, playOnFocus } = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
@menu("UI/Cocos/SpinePreviewComponent")
export default class SpinePreviewComponent extends sp.Skeleton {
    @property
    private _isEditorPlay: boolean = true;

    @property
    private _isEditorAttach: boolean = false;

    @property({
        tooltip: "编辑器中自动播放动作\n勾选状态，在选中节点时，帧率60，否则只有必要时才重绘\n非勾选，不自动播放",
        type: cc.Boolean
    })
    get isEditorPlay(): boolean {
        return this._isEditorPlay;
    }
    set isEditorPlay(value: boolean) {
        this._isEditorPlay = value;
        if (this._isEditorPlay) {
            const events = (this as any)._skeleton.data.events;
            let str = (this as any)._skeletonData._name + "事件集合：";
            let eventStr = "[";
            for (let i = 0; i < events.length; i++) {
                const eventName = events[i].name;
                let stringValue = events[i].stringValue;
                if (stringValue == "") {
                    stringValue = '""';
                }
                if (i != 0) {
                    eventStr += ",";
                }
                eventStr = eventStr + eventName + ":" + stringValue;
            }
            eventStr += "]";
            Editor.info(str + eventStr);
        }
    }

    @property({
        tooltip: "编辑器中生成挂点\n勾选状态，生成挂点 ATTACHED_NODE_TREE\n非勾选，不做操作",
        type: cc.Boolean
    })
    get isEditorAttach(): boolean {
        return this._isEditorAttach;
    }
    set isEditorAttach(value: boolean) {
        this._isEditorAttach = value;
        if (this._isEditorAttach) {
            this.attachUtil.generateAllAttachedNodes();
        }
    }

    update(dt: number) {
        super.update(dt);
    }

    dumpSpineInfo() {
        const data = (this as any)._skeleton.data;
        const animations = data.animations;
        const events = data.events;
        const skins = data.skins;
        console.group("spine : 节点 " + this.name + " ,动画 <" + (this as any)._skeletonData._name + " >");
        let animStr = "[";
        for (let i = 0; i < animations.length; i++) {
            if (i != 0) {
                animStr += ",";
            }
            animStr += animations[i].name;
        }
        animStr += "]";

        let eventStr = "[";
        for (let i = 0; i < events.length; i++) {
            const eventName = events[i].name;
            let stringValue = events[i].stringValue;
            if (stringValue == "") {
                stringValue = '""';
            }
            if (i != 0) {
                eventStr += ",";
            }
            eventStr = eventStr + eventName + ":" + stringValue;
        }
        eventStr += "]";

        let skinStr = "[";
        for (let i = 0; i < skins.length; i++) {
            if (i != 0) {
                skinStr += ",";
            }
            skinStr += skins[i].name;
        }
        skinStr += "]";

        console.log("%c 动作集合： %c " + animStr + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 事件集合： %c " + eventStr + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 皮肤集合： %c " + skinStr + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.groupEnd();
    }
}