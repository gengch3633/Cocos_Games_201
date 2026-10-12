import GlobalEventMgr from "./GlobalEventMgr";
import Handler from "./Handler";
import InterfaceMgr from "./InterfaceMgr";
import LoadingHttpService from "./LoadingHttpService";
import PlayerDataStore from "./PlayerDataStore";
import Singleton from "./Singleton";
import UserData from "./UserData";

const { ccclass } = cc._decorator;

@ccclass
export default class UserInfoService extends Singleton {

    private _lastFetchTs: number = 0;

    public fetch(): void {
        const now: number = Date.now ? Date.now() : new Date().getTime();
        if (this._lastFetchTs && now - this._lastFetchTs < 500) {
            console.log("[UserInfoService] fetch throttled, elapsed=" + (now - this._lastFetchTs) + "ms");
        } else {
            this._lastFetchTs = now;
            try {
                LoadingHttpService.getUserInfo(
                    Handler.create(null, (res: any) => {
                        if (res && res.data) {
                            this._applyToUserData(res.data);
                        } else {
                            console.error("[UserInfoService] fetch failed", res);
                        }
                    }),
                    Handler.create(null, (err: any) => {
                        console.error("[UserInfoService] fetch error", err);
                    })
                );
            } catch (e) {
                console.error("[UserInfoService] fetch exception", e);
            }
        }
    }

    private _applyToUserData(data: any): void {
        if (!data) {
            return;
        }

        const userData = UserData.getInstance();
        const conf: any = (data.conf && data.conf.cash_extract_conf) || {};

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
        if (conf.money !== undefined) {
            userData.extract_money = conf.money;
        }
        if (conf.status !== undefined) {
            userData.bubble_status = conf.status;
        }
        if (conf.levels_passed_count !== undefined) {
            userData.levels_passed_count = conf.levels_passed_count;
        }
        if (conf.current_extract_levels_passed_count !== undefined) {
            userData.current_extract_levels_passed_count = conf.current_extract_levels_passed_count;
        }
        if (conf.levels_passed_limit !== undefined) {
            userData.levels_passed_limit = conf.levels_passed_limit;
        }
        if (conf.sign_in !== undefined) {
            userData.sign_in_days = conf.sign_in;
        }
        if (conf.sign_in_limit !== undefined) {
            userData.sign_in_limit = conf.sign_in_limit;
        }
        if (conf.level !== undefined) {
            userData.extract_user_level = conf.level;
        }
        if (conf.level_limit !== undefined) {
            userData.level_limit = conf.level_limit;
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

        GlobalEventMgr.getInstance().emit(InterfaceMgr.gameEvent.userInfoUpdated, {
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
            ltv_task_point_num: ltvTaskPointNum
        });
    }
}