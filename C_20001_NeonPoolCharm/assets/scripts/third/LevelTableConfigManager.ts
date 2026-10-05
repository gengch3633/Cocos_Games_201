import ConfigDataSys from "./ConfigDataSys";
import PlayerDataSys from "./PlayerDataSys";
import GameServiceMgr from "./GameServiceMgr";

class LevelTableConfigManager {
    private static _instance: LevelTableConfigManager = null;

    private _levelTableConfigDataMap = new Map<string, unknown>();

    getLevelTableConfigByFileName(fileName: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if (this._levelTableConfigDataMap.has(fileName)) {
                resolve(this._levelTableConfigDataMap.get(fileName));
            } else {
                GameServiceMgr.GetGameLevelConfig(
                    fileName,
                    (data: unknown) => {
                        this._levelTableConfigDataMap.set(fileName, data);
                        resolve(data);
                    },
                    () => reject(null)
                );
            }
        });
    }

    static getInstance(): LevelTableConfigManager {
        if (!LevelTableConfigManager._instance) {
            LevelTableConfigManager._instance = new LevelTableConfigManager();
        }
        return LevelTableConfigManager._instance;
    }

    getLevelTableConfigByLevelID(levelID: number): Promise<unknown> {
        const levelConfig = ConfigDataSys.level_configMap.get(PlayerDataSys.getConfigLevelID(levelID));
        return this.getLevelTableConfigByFileName(levelConfig.lv_file);
    }
}

export default LevelTableConfigManager.getInstance();
