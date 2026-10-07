import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import { gameEvent } from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import PlayerDataStore from "./PlayerDataStore";
import Singleton from "./Singleton";
import UserData from "./UserData";

export default class UserInfoService extends Singleton {
    _lastFetchTs = 0;

    fetch(): void {
        const now = Date.now ? Date.now() : new Date().getTime();
        if (this._lastFetchTs && now - this._lastFetchTs < 500) {
            console.log("[UserInfoService] fetch throttled, elapsed=" + (now - this._lastFetchTs) + "ms");
            return;
        }
        this._lastFetchTs = now;
        try {
            LoadingHttpService.getUserInfo(
                Handler.create(null, (response: any) => {
                    if (response && response.data) {
                        this._applyToUserData(response.data);
                    } else {
                        console.error("[UserInfoService] fetch failed", response);
                    }
                }),
                Handler.create(null, (error: any) => {
                    console.error("[UserInfoService] fetch error", error);
                })
            );
        } catch (error) {
            console.error("[UserInfoService] fetch exception", error);
        }
    }

    _applyToUserData(data: any): void {
        if (!data) {
            return;
        }
        const userData = UserData.getInstance();
        const extractConf = data.conf?.cash_extract_conf || {};
        if (data.cash_balance !== undefined) {
            userData.cash_balance = data.cash_balance;
        }
        if (data.bubble_balance !== undefined) {
            userData.bubble_balance = data.bubble_balance;
        }
        if (data.hint_prop_count !== undefined) {
            userData.hint_prop_count = data.hint_prop_count;
            userData.num_tipscards = data.hint_prop_count;
        }
        if (data.guideline_prop_count !== undefined) {
            userData.guideline_prop_count = data.guideline_prop_count;
        }
        if (data.user_level !== undefined) {
            userData.user_level = data.user_level;
        }
        if (extractConf.money !== undefined) {
            userData.extract_money = extractConf.money;
        }
        if (extractConf.status !== undefined) {
            userData.bubble_status = extractConf.status;
        }
        if (extractConf.levels_passed_count !== undefined) {
            userData.levels_passed_count = extractConf.levels_passed_count;
        }
        if (extractConf.current_extract_levels_passed_count !== undefined) {
            userData.current_extract_levels_passed_count = extractConf.current_extract_levels_passed_count;
        }
        if (extractConf.levels_passed_limit !== undefined) {
            userData.levels_passed_limit = extractConf.levels_passed_limit;
        }
        if (extractConf.sign_in !== undefined) {
            userData.sign_in_days = extractConf.sign_in;
        }
        if (extractConf.sign_in_limit !== undefined) {
            userData.sign_in_limit = extractConf.sign_in_limit;
        }
        if (extractConf.level !== undefined) {
            userData.extract_user_level = extractConf.level;
        }
        if (extractConf.level_limit !== undefined) {
            userData.level_limit = extractConf.level_limit;
        }
        let taskPointNum: number | undefined;
        let ltvTaskPointNum: number | undefined;
        if (data.task_point_num !== undefined) {
            taskPointNum = Number(data.task_point_num) || 0;
            PlayerDataStore.task_point_num = taskPointNum;
        }
        if (data.ltv_task_point_num !== undefined) {
            ltvTaskPointNum = Number(data.ltv_task_point_num) || 0;
            PlayerDataStore.ltv_task_point_num = ltvTaskPointNum;
        }
        GlobalEventMgr.getInstance().emit(gameEvent.userInfoUpdated, {
            cash_balance: userData.cash_balance,
            bubble_balance: userData.bubble_balance,
            hint_prop_count: userData.hint_prop_count,
            guideline_prop_count: userData.guideline_prop_count,
            user_level: userData.user_level,
            extract_money: userData.extract_money,
            bubble_status: userData.bubble_status,
            levels_passed_count: userData.levels_passed_count,
            current_extract_levels_passed_count: userData.current_extract_levels_passed_count,
            levels_passed_limit: userData.levels_passed_limit,
            sign_in_days: userData.sign_in_days,
            sign_in_limit: userData.sign_in_limit,
            extract_user_level: userData.extract_user_level,
            level_limit: userData.level_limit,
            task_point_num: taskPointNum,
            ltv_task_point_num: ltvTaskPointNum,
        });
    }
}
