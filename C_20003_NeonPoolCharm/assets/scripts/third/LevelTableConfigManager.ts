import ConfigDataSys from "./ConfigDataSys";
import GameServiceMgr from "./GameServiceMgr";
import PlayerDataSys from "./PlayerDataSys";

class LevelTableConfigManager {

    _levelTableConfigDataMap = new Map();

    static _instance: LevelTableConfigManager = null;

    getLevelTableConfigByFileName(fileName) {
        const self = this;
        return new Promise(function (resolve, reject) {
            if (self._levelTableConfigDataMap.has(fileName)) {
                resolve(self._levelTableConfigDataMap.get(fileName));
            } else {
                GameServiceMgr.GetGameLevelConfig(fileName, function (data) {
                    self._levelTableConfigDataMap.set(fileName, data);
                    resolve(data);
                }, function () {
                    return reject(null);
                });
            }
        });
    }

    static getInstance() {
        this._instance || (LevelTableConfigManager._instance = new LevelTableConfigManager());
        return LevelTableConfigManager._instance;
    }

    getLevelTableConfigByLevelID(levelID) {
        const config = ConfigDataSys.level_configMap.get(PlayerDataSys.getConfigLevelID(levelID));
        return this.getLevelTableConfigByFileName(config.lv_file);
    }
}

export default LevelTableConfigManager.getInstance();
