const { ccclass, property, menu, executeInEditMode, playOnFocus } = cc._decorator;

declare const Editor: {
    info: (msg: string) => void;
};

@ccclass
@executeInEditMode
@playOnFocus
@menu("UI/Cocos/SpinePreviewComponent")
export class SpinePreviewComponent extends sp.Skeleton {
    @property
    _isEditorPlay: boolean = true;

    @property
    _isEditoAttach_csryw: boolean = false;

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
            const events = this._skeleton.data.events;
            let msg = this._N$skeletonData._name + "事件集合：[";
            for (let i = 0; i < events.length; i++) {
                const name = events[i].name;
                let stringValue = events[i].stringValue;
                if (stringValue === "") {
                    stringValue = '""';
                }
                if (i !== 0) {
                    msg += ",";
                }
                msg += name + ":" + stringValue;
            }
            msg += "]";
            Editor.info(msg);
        }
    }

    @property({
        tooltip: "编辑器中生成挂点\n勾选状态，生成挂点 ATTACHED_NODE_TREE\n非勾选，不做操作",
        type: cc.Boolean
    })
    get isEditorAttach(): boolean {
        return this._isEditoAttach_csryw;
    }

    set isEditorAttach(value: boolean) {
        this._isEditoAttach_csryw = value;
        if (this._isEditoAttach_csryw) {
            this.attachUtil.generateAllAttachedNodes();
        }
    }

    update(dt: number): void {
        super.update(dt);
    }

    dumpSpineInfo(): void {
        const data = this._skeleton.data;
        const animations = data.animations;
        const events = data.events;
        const skins = data.skins;
        console.group("spine : 节点" + this.name + " ,动画<" + this._N$skeletonData._name + ">");
        let animStr = "[";
        for (let i = 0; i < animations.length; i++) {
            if (i !== 0) {
                animStr += ",";
            }
            animStr += animations[i].name;
        }
        animStr += "]";
        let eventStr = "[";
        for (let i = 0; i < events.length; i++) {
            const name = events[i].name;
            let stringValue = events[i].stringValue;
            if (stringValue === "") {
                stringValue = '""';
            }
            if (i !== 0) {
                eventStr += ",";
            }
            eventStr += name + ":" + stringValue;
        }
        eventStr += "]";
        let skinStr = "[";
        for (let i = 0; i < skins.length; i++) {
            if (i !== 0) {
                skinStr += ",";
            }
            skinStr += skins[i].name;
        }
        skinStr += "]";
        console.log(
            "%c 动作集合： %c " + animStr + " ",
            "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;",
            "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;"
        );
        console.log(
            "%c 事件集合： %c " + eventStr + " ",
            "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;",
            "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;"
        );
        console.log(
            "%c 皮肤集合： %c " + skinStr + " ",
            "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;",
            "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;"
        );
        console.groupEnd();
    }
}

(window as any).SpinePreviewComponent = SpinePreviewComponent;
