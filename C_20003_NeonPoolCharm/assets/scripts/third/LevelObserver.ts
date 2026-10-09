export default class LevelObserver {

    _levelInfos = [];
    _logging = false;

    static _instance: LevelObserver = null;

    static get instance() {
        return this._instance != null ? this._instance : this._instance = new LevelObserver();
    }

    get logging() {
        return this._logging;
    }

    _captureScreen(name, callback) {
        if (cc.director.getScene()) {
            const scene = cc.director.getScene();
            let node = scene.getChildByName("__render_texture__");
            if (!node) {
                node = new cc.Node("__render_texture__");
                node.setPosition(.5 * cc.visibleRect.width, .5 * cc.visibleRect.height);
                node.setParent(scene);
            }
            let camera = node.getComponent(cc.Camera);
            if (!camera) {
                camera = node.addComponent(cc.Camera);
                camera.cullingMask = 487;
                const texture = new cc.RenderTexture();
                const renderContext = (cc.game as any)._renderContext;
                texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, renderContext.STENCIL_INDEX8);
                camera.targetTexture = texture;
            }
            const dir = jsb.fileUtils.getWritablePath() + "levels";
            if (!jsb.fileUtils.isDirectoryExist(dir)) {
                jsb.fileUtils.createDirectory(dir);
            }
            const path = dir + "/" + name + ".png";
            setTimeout(function () {
                scene.scaleY = -1;
                camera.render();
                scene.scaleY = 1;
                const pixels = camera.targetTexture.readPixels();
                jsb.saveImageData(pixels, cc.visibleRect.width, cc.visibleRect.height, path);
                console.log("save in: " + path);
                if (null != callback) {
                    callback();
                }
            }, 500);
        } else if (null != callback) {
            callback();
        }
    }

    _save(clearAfter) {
        if (this._levelInfos.length > 0) {
            const lines = [];
            lines.push("ID\t关卡\t配置名\t台球总数\t球桌ID");
            this._levelInfos.forEach(function (info) {
                const cols = [];
                cols.push("" + info.turn);
                cols.push("" + info.levelID);
                cols.push("" + info.configName);
                cols.push("" + info.ballsNumber);
                cols.push("" + info.tableID);
                lines.push(cols.join("\t"));
            });
            console.log(lines.join("\n"));
        }
        if (clearAfter) {
            this.clear();
        }
    }

    startLog(turn, levelID, configName, tableID, ballsNumber) {
        if (turn > 0) {
            this._logging = false;
            if (1 === turn) {
                this._save(true);
            }
        } else {
            this._logging = true;
            this._levelInfos.push({
                turn: turn,
                levelID: levelID,
                configName: configName,
                tableID: tableID,
                ballsNumber: ballsNumber
            });
        }
    }

    clear() {
        this._levelInfos.length = 0;
    }

    endLog(callback) {
        const self = this;
        if (this._logging) {
            setTimeout(function () {
                const last = self._levelInfos[self._levelInfos.length - 1];
                const levelID = last == null ? undefined : last.levelID;
                const name = levelID != null ? levelID : "unknown" + Date.now();
                return self._captureScreen("" + name, callback);
            }, .3);
        }
    }
}
