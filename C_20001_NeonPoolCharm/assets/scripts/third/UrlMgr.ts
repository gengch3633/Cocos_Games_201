import { RequestType } from "./RequestType";
import SystemDataSys from "./SystemDataSys";

class UrlMgr {
    private static _instance: UrlMgr = null;

    _urlMap = new Map<string, string>();
    requestUrl: Record<string, { uri: string; enqueue: boolean }> = {
        [RequestType.GetSystemConfig]: { uri: "config", enqueue: true },
        [RequestType.AutoLogin]: { uri: "login/auto_submit", enqueue: true },
        [RequestType.TouristLogin]: { uri: "login/tourists_submit", enqueue: true },
        [RequestType.WeChatLogin]: { uri: "login/wechat_submit", enqueue: true },
        [RequestType.BindWeChat]: { uri: "login/tourists_bind_wechat", enqueue: true },
        [RequestType.UserInfo]: { uri: "behaviors/info", enqueue: true },
        [RequestType.Logoff]: { uri: "login/user_cancel", enqueue: true },
        [RequestType.AgreementReport]: { uri: "agreement_report", enqueue: false },
        [RequestType.shuMengReport]: { uri: "shumeng_report", enqueue: false },
        [RequestType.Report]: { uri: "main/ad_report", enqueue: true },
        [RequestType.ExtractInfo]: { uri: "extract/extract_info", enqueue: true },
        [RequestType.ExtractCash]: { uri: "cash/cn/extract_cash", enqueue: true },
        [RequestType.ExtractGold]: { uri: "cash/cn/extract_gold", enqueue: true },
        [RequestType.ExtractRecord]: { uri: "cash/cn/records", enqueue: true },
        [RequestType.GuideGift]: { uri: "game/guide_gift", enqueue: true },
        [RequestType.CheckCashInfo]: { uri: "extract/bind_tx", enqueue: true },
        [RequestType.CheckExtract]: { uri: "extract/check_extract", enqueue: true },
        [RequestType.TaskList]: { uri: "tasks/tasks_list", enqueue: true },
        [RequestType.CommitTask]: { uri: "tasks/commit_task", enqueue: true },
        [RequestType.RemoveCard]: { uri: "game/remove_card", enqueue: true },
        [RequestType.LevelStatistics]: { uri: "game/level_statistics", enqueue: true },
        [RequestType.UpdateLevel]: { uri: "game/update_level", enqueue: true },
        [RequestType.RefreshLevel]: { uri: "game/refresh_level", enqueue: true },
        [RequestType.UseProps]: { uri: "game/use_props", enqueue: true },
        [RequestType.ReceiveGift]: { uri: "tasks/receive_gift", enqueue: true },
        [RequestType.Relive]: { uri: "game/relive", enqueue: true },
        [RequestType.GetBillboard]: { uri: "game/get_billboard", enqueue: true },
        [RequestType.Offline]: { uri: "main/offline", enqueue: true },
        [RequestType.FreeDiamond]: { uri: "tasks/free_diamond", enqueue: true },
        [RequestType.DiamondList]: { uri: "iap/charge_list", enqueue: true },
        [RequestType.UseDiamond]: { uri: "game/exchange_props", enqueue: true },
        [RequestType.CreateOrder]: { uri: "iap/create_order", enqueue: true },
        [RequestType.VerifyOrder]: { uri: "iap/order_verify", enqueue: true },
        [RequestType.CheckOrderStatus]: { uri: "iap/order_status", enqueue: true },
        [RequestType.RePairOrder]: { uri: "iap/repair_order", enqueue: true },
        [RequestType.PayerMaxCreateOrder]: { uri: "iap2/create_order", enqueue: true },
        [RequestType.PayerMaxCheckOrderStatus]: { uri: "iap2/order_status", enqueue: true },
        [RequestType.SubmitLevel]: { uri: "game/submit_level", enqueue: true },
        [RequestType.SubmitGuideLevel]: { uri: "game/submit_guide", enqueue: true },
        [RequestType.SignIn]: { uri: "game/sign_in", enqueue: true },
        [RequestType.GetClub]: { uri: "game/get_club", enqueue: true },
        [RequestType.ExchangeClub]: { uri: "game/exchange_club", enqueue: true },
        [RequestType.ChangeClub]: { uri: "game/change_club", enqueue: true },
        [RequestType.HeadName]: { uri: "behaviors/scroll_msg", enqueue: true },
        [RequestType.ReportAD]: { uri: "game/report_ad", enqueue: true },
        [RequestType.ClubGold]: { uri: "game/club_gold", enqueue: true },
        [RequestType.UseClubProp]: { uri: "game/user_prop", enqueue: true },
        [RequestType.ChouJiang]: { uri: "game/luck_draw", enqueue: true },
        [RequestType.GetLevelConfig]: { uri: "game/lc", enqueue: true },
        [RequestType.Regional]: { uri: "regional_validation", enqueue: false },
        [RequestType.GmChangeLevel]: { uri: "gm/change_level", enqueue: true },
        [RequestType.GMRestSign]: { uri: "gm/reset_sign", enqueue: true },
        [RequestType.GMChangeCash]: { uri: "gm/change_cash", enqueue: true },
        [RequestType.GMGetClubShard]: { uri: "gm/add_club_shard", enqueue: true },
        [RequestType.GMGetCpmRecord]: { uri: "gm/cpm_record", enqueue: true },
        [RequestType.GMAddSignInCount]: { uri: "gm/sing_in_day", enqueue: true },
        [RequestType.GmAddDiamond]: { uri: "gm/add_diamond", enqueue: true },
        [RequestType.GmToLevel]: { uri: "gm/to_level", enqueue: true },
    };

    static getInstance(): UrlMgr {
        return UrlMgr._instance ? UrlMgr._instance : (UrlMgr._instance = new UrlMgr());
    }

    getUrl(type: string): string {
        let url = this._urlMap.get(type);
        if (url == null) {
            url = SystemDataSys.get_request_url() + this.getUri(type);
            this._urlMap.set(type, url);
        }
        return url;
    }

    needEnqueue(type: string): boolean {
        return !!this.requestUrl[type] && this.requestUrl[type].enqueue;
    }

    getUri(type: string): string {
        return this.requestUrl[type] ? this.requestUrl[type].uri : "";
    }

    getConfmeUrl(type: string): string {
        return SystemDataSys.getConfmeBaseUrl() + this.getUri(type);
    }
}

export default UrlMgr;
