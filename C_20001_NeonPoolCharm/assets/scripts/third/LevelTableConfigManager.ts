import ConfigDataSys from "./ConfigDataSys";
import GameServiceMgr from "./GameServiceMgr";
import PlayerDataSys from "./PlayerDataSys";

class LevelTableConfigManager {
    private _levelTableConfigDataMap = new Map<string, any>();
    private static _instance: LevelTableConfigManager = null;

    getLevelTableConfigByFileName(fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._levelTableConfigDataMap.has(fileName)) {
                resolve(this._levelTableConfigDataMap.get(fileName));
            } else {
                GameServiceMgr.GetGameLevelConfig(
                    fileName,
                    (data: any) => {
                        this._levelTableConfigDataMap.set(fileName, data);
                        resolve(data);
                    },
                    () => reject(null)
                );
            }
        });
    }

    static getInstance(): LevelTableConfigManager {
        if (!this._instance) {
            this._instance = new LevelTableConfigManager();
        }
        return this._instance;
    }

    getLevelTableConfigByLevelID(levelID: number): Promise<any> {
        const config = ConfigDataSys.level_configMap.get(PlayerDataSys.getConfigLevelID(levelID));
        return this.getLevelTableConfigByFileName(config.lv_file);
    }
}

export default LevelTableConfigManager.getInstance();
