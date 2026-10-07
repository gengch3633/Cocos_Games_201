interface LevelInfo {
    turn: number;
    levelID: number;
    configName: string;
    tableID: number;
    ballsNumber: number;
}

class LevelObserver {
    private _levelInfos: LevelInfo[] = [];
    private _logging = false;
    private static _instance: LevelObserver = null;

    static get instance(): LevelObserver {
        return this._instance != null ? this._instance : (this._instance = new LevelObserver());
    }

    get logging(): boolean {
        return this._logging;
    }

    private _captureScreen(name: string, callback?: () => void): void {
        if (cc.director.getScene()) {
            const scene = cc.director.getScene();
            let renderNode = scene.getChildByName("__render_texture__");
            if (!renderNode) {
                renderNode = new cc.Node("__render_texture__");
                renderNode.setPosition(0.5 * cc.visibleRect.width, 0.5 * cc.visibleRect.height);
                renderNode.setParent(scene);
            }
            let camera = renderNode.getComponent(cc.Camera);
            if (!camera) {
                camera = renderNode.addComponent(cc.Camera);
                camera.cullingMask = 487;
                const texture = new cc.RenderTexture();
                const gl = (cc.game as any)._renderContext;
                texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
                camera.targetTexture = texture;
            }
            const dir = (jsb as any).fileUtils.getWritablePath() + "levels";
            if (!(jsb as any).fileUtils.isDirectoryExist(dir)) {
                (jsb as any).fileUtils.createDirectory(dir);
            }
            const filePath = dir + "/" + name + ".png";
            setTimeout(() => {
                scene.scaleY = -1;
                camera.render();
                scene.scaleY = 1;
                const pixels = camera.targetTexture.readPixels();
                (jsb as any).saveImageData(pixels, cc.visibleRect.width, cc.visibleRect.height, filePath);
                console.log("save in: " + filePath);
                callback?.();
            }, 500);
        } else {
            callback?.();
        }
    }

    private _save(clear: boolean): void {
        if (this._levelInfos.length > 0) {
            const rows: string[] = [];
            rows.push("ID\t关卡\t配置名\t台球总数\t球桌ID");
            this._levelInfos.forEach((info) => {
                const cols: string[] = [];
                cols.push("" + info.turn);
                cols.push("" + info.levelID);
                cols.push("" + info.configName);
                cols.push("" + info.ballsNumber);
                cols.push("" + info.tableID);
                rows.push(cols.join("\t"));
            });
            console.log(rows.join("\n"));
        }
        if (clear) {
            this.clear();
        }
    }

    startLog(turn: number, levelID: number, configName: string, tableID: number, ballsNumber: number): void {
        if (turn > 0) {
            this._logging = false;
            if (turn === 1) {
                this._save(true);
            }
        } else {
            this._logging = true;
            this._levelInfos.push({
                turn,
                levelID,
                configName,
                tableID,
                ballsNumber,
            });
        }
    }

    clear(): void {
        this._levelInfos.length = 0;
    }

    endLog(callback?: () => void): void {
        if (this._logging) {
            setTimeout(() => {
                const lastInfo = this._levelInfos[this._levelInfos.length - 1];
                const levelID = lastInfo?.levelID;
                const name = levelID != null ? "" + levelID : "unknown" + Date.now();
                this._captureScreen(name, callback);
            }, 0.3);
        }
    }
}

export default LevelObserver;
