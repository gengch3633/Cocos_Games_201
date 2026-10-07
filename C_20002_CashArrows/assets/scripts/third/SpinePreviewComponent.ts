declare const sp: any;

const { ccclass, property, menu, executeInEditMode, playOnFocus } = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
@menu("UI/Cocos/SpinePreviewComponent")
export class SpinePreviewComponent extends sp.Skeleton {
    @property()
    _isEditorPlay = true;

    @property({
        tooltip: "编辑器中自动播放动作\n勾选状态，在选中节点时，帧率60，否则只有必要时才重绘\n非勾选，不自动播放",
        type: cc.Boolean,
    })
    get isEditorPlay(): boolean {
        return this._isEditorPlay;
    }

    set isEditorPlay(value: boolean) {
        this._isEditorPlay = value;
        if (this._isEditorPlay) {
            const events = (this as any)._skeleton.data.events;
            let prefix = (this as any)._N$skeletonData._name + "事件集合：";
            let text = "[";
            for (let index = 0; index < events.length; index++) {
                const name = events[index].name;
                let stringValue = events[index].stringValue;
                if (stringValue === "") {
                    stringValue = '""';
                }
                if (index !== 0) {
                    text += ",";
                }
                text = text + name + ":" + stringValue;
            }
            text += "]";
            (window as any).Editor.info(prefix + text);
        }
    }

    @property()
    _isEditoAttach_csryw = false;

    @property({
        tooltip: "编辑器中生成挂点\n勾选状态，生成挂点 ATTACHED_NODE_TREE\n非勾选，不做操作",
        type: cc.Boolean,
    })
    get isEditorAttach(): boolean {
        return this._isEditoAttach_csryw;
    }

    set isEditorAttach(value: boolean) {
        this._isEditoAttach_csryw = value;
        if (this._isEditoAttach_csryw) {
            (this as any).attachUtil.generateAllAttachedNodes();
        }
    }

    update(dt: number): void {
        super.update(dt);
    }

    dumpSpineInfo(): void {
        const data = (this as any)._skeleton.data;
        const animations = data.animations;
        const events = data.events;
        const skins = data.skins;
        console.group("spine : 节点 " + this.name + " ,动画 <" + (this as any)._N$skeletonData._name + " >");
        let animText = "[";
        for (let index = 0; index < animations.length; index++) {
            if (index !== 0) {
                animText += ",";
            }
            animText += animations[index].name;
        }
        animText += "]";
        let eventText = "[";
        for (let index = 0; index < events.length; index++) {
            const name = events[index].name;
            let stringValue = events[index].stringValue;
            if (stringValue === "") {
                stringValue = '""';
            }
            if (index !== 0) {
                eventText += ",";
            }
            eventText = eventText + name + ":" + stringValue;
        }
        eventText += "]";
        let skinText = "[";
        for (let index = 0; index < skins.length; index++) {
            if (index !== 0) {
                skinText += ",";
            }
            skinText += skins[index].name;
        }
        skinText += "]";
        console.log("%c 动作集合： %c " + animText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 事件集合： %c " + eventText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 皮肤集合： %c " + skinText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.groupEnd();
    }
}

(window as any).SpinePreviewComponent = SpinePreviewComponent;
