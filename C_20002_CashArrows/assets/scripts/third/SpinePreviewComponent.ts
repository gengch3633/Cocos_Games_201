const { ccclass, property, menu, executeInEditMode, playOnFocus } = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
@menu("UI/Cocos/SpinePreviewComponent")
export class SpinePreviewComponent extends sp.Skeleton {
    @property
    _isEditorPlay = true;

    @property
    _isEditoAttach_csryw = false;

    @property({
        tooltip: "编辑器中自动播放动作\n勾选状态，在选中节点时，帧率60，否则只有必要时才重绘\n非勾选，不自动播放",
        type: cc.Boolean
    })
    get isEditorPlay() {
        return this._isEditorPlay;
    }

    set isEditorPlay(value: boolean) {
        this._isEditorPlay = value;
        if (this._isEditorPlay) {
            for (var events = this._skeleton.data.events, title = this._N$skeletonData._name + "事件集合：", text = "[", i = 0; i < events.length; i++) {
                var name = events[i].name,
                    stringValue = events[i].stringValue;
                "" == stringValue && (stringValue = '""');
                0 != i && (text += ",");
                text = text + name + ":" + stringValue;
            }
            text += "]";
            Editor.info(title + text);
        }
    }

    @property({
        tooltip: "编辑器中生成挂点\n勾选状态，生成挂点 ATTACHED_NODE_TREE\n非勾选，不做操作",
        type: cc.Boolean
    })
    get isEditorAttach() {
        return this._isEditoAttach_csryw;
    }

    set isEditorAttach(value: boolean) {
        this._isEditoAttach_csryw = value;
        this._isEditoAttach_csryw && this.attachUtil.generateAllAttachedNodes();
    }

    update(dt: number) {
        super.update(dt);
    }

    dumpSpineInfo() {
        var data = this._skeleton.data,
            animations = data.animations,
            events = data.events,
            skins = data.skins;
        console.group("spine : 节点 " + this.name + " ,动画 <" + this._N$skeletonData._name + " >");
        for (var animText = "[", i = 0; i < animations.length; i++) {
            0 != i && (animText += ",");
            animText += animations[i].name;
        }
        animText += "]";
        var eventText = "[";
        for (i = 0; i < events.length; i++) {
            var eventName = events[i].name,
                stringValue = events[i].stringValue;
            "" == stringValue && (stringValue = '""');
            0 != i && (eventText += ",");
            eventText = eventText + eventName + ":" + stringValue;
        }
        eventText += "]";
        var skinText = "[";
        for (i = 0; i < skins.length; i++) {
            0 != i && (skinText += ",");
            skinText += skins[i].name;
        }
        skinText += "]";
        console.log("%c 动作集合： %c " + animText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 事件集合： %c " + eventText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.log("%c 皮肤集合： %c " + skinText + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
        console.groupEnd();
    }
}

(window as any).SpinePreviewComponent = SpinePreviewComponent;
