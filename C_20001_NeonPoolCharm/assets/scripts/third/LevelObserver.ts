interface LevelInfoEntry {
    turn: number;
    levelID: string;
    configName: string;
    tableID: unknown;
    ballsNumber: number;
}

export default class LevelObserver {
    private static _instance: LevelObserver = null;

    private _levelInfos: LevelInfoEntry[] = [];
    private _logging = false;

    static get instance(): LevelObserver {
        return LevelObserver._instance ?? (LevelObserver._instance = new LevelObserver());
    }

    get logging(): boolean {
        return this._logging;
    }

    private _captureScreen(filename: string, callback?: () => void): void {
        const scene = cc.director.getScene();
        if (scene) {
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
                const gl = cc.game["_renderContext"];
                texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
                camera.targetTexture = texture;
            }
            const dir = jsb.fileUtils.getWritablePath() + "levels";
            if (!jsb.fileUtils.isDirectoryExist(dir)) {
                jsb.fileUtils.createDirectory(dir);
            }
            const path = dir + "/" + filename + ".png";
            setTimeout(() => {
                scene.scaleY = -1;
                camera.render();
                scene.scaleY = 1;
                const pixels = camera.targetTexture.readPixels();
                jsb.saveImageData(pixels, cc.visibleRect.width, cc.visibleRect.height, path);
                console.log("save in: " + path);
                callback?.();
            }, 500);
        } else {
            callback?.();
        }
    }

    private _save(clearAfter: boolean): void {
        if (this._levelInfos.length > 0) {
            const lines: string[] = [];
            lines.push("ID\t关卡\t配置名\t台球总数\t球桌ID");
            this._levelInfos.forEach((info) => {
                const row = [
                    "" + info.turn,
                    "" + info.levelID,
                    "" + info.configName,
                    "" + info.ballsNumber,
                    "" + info.tableID,
                ];
                lines.push(row.join("\t"));
            });
            console.log(lines.join("\n"));
        }
        if (clearAfter) {
            this.clear();
        }
    }

    startLog(
        turn: number,
        levelID: string,
        configName: string,
        tableID: unknown,
        ballsNumber: number
    ): void {
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
                const last = this._levelInfos[this._levelInfos.length - 1];
                const levelID = last?.levelID ?? "unknown" + Date.now();
                this._captureScreen("" + levelID, callback);
            }, 0.3);
        }
    }
}
