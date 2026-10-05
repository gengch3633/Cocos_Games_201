let e = require;
let t = module;
let o = exports;
"use strict";
cc._RF.push(t, "f52cfh9Y0VOFat4v/oFw/9g", "UrlMgr");
Object.defineProperty(o, "__esModule", {
  value: ! 0
}
);
var n = e(SystemDataSys "
  }].js),
      i = e(" RequestType.js "),
      a = function () {
        function e() {
          this._urlMap = new Map();
          this.requestUrl = ((e = {})[i.RequestType.GetSystemConfig] = {
            uri: " config ",
            enqueue: !0
          }, e[i.RequestType.AutoLogin] = {
            uri: " login/ auto_submit ",
            enqueue: !0
          }, e[i.RequestType.TouristLogin] = {
            uri: " login/ tourists_submit ",
            enqueue: !0
          }, e[i.RequestType.WeChatLogin] = {
            uri: " login/ wechat_submit ",
            enqueue: !0
          }, e[i.RequestType.BindWeChat] = {
            uri: " login/ tourists_bind_wechat ",
            enqueue: !0
          }, e[i.RequestType.UserInfo] = {
            uri: " behaviors/ info ",
            enqueue: !0
          }, e[i.RequestType.Logoff] = {
            uri: " login/ user_cancel ",
            enqueue: !0
          }, e[i.RequestType.AgreementReport] = {
            uri: " agreement_report ",
            enqueue: !1
          }, e[i.RequestType.shuMengReport] = {
            uri: " shumeng_report ",
            enqueue: !1
          }, e[i.RequestType.Report] = {
            uri: " main/ ad_report ",
            enqueue: !0
          }, e[i.RequestType.ExtractInfo] = {
            uri: " extract/ extract_info ",
            enqueue: !0
          }, e[i.RequestType.ExtractCash] = {
            uri: " cash/ cn/ extract_cash ",
            enqueue: !0
          }, e[i.RequestType.ExtractGold] = {
            uri: " cash/ cn/ extract_gold ",
            enqueue: !0
          }, e[i.RequestType.ExtractRecord] = {
            uri: " cash/ cn/ records ",
            enqueue: !0
          }, e[i.RequestType.GuideGift] = {
            uri: " game/ guide_gift ",
            enqueue: !0
          }, e[i.RequestType.CheckCashInfo] = {
            uri: " extract/ bind_tx ",
            enqueue: !0
          }, e[i.RequestType.CheckExtract] = {
            uri: " extract/ check_extract ",
            enqueue: !0
          }, e[i.RequestType.TaskList] = {
            uri: " tasks/ tasks_list ",
            enqueue: !0
          }, e[i.RequestType.CommitTask] = {
            uri: " tasks/ commit_task ",
            enqueue: !0
          }, e[i.RequestType.RemoveCard] = {
            uri: " game/ remove_card ",
            enqueue: !0
          }, e[i.RequestType.LevelStatistics] = {
            uri: " game/ level_statistics ",
            enqueue: !0
          }, e[i.RequestType.UpdateLevel] = {
            uri: " game/ update_level ",
            enqueue: !0
          }, e[i.RequestType.RefreshLevel] = {
            uri: " game/ refresh_level ",
            enqueue: !0
          }, e[i.RequestType.UseProps] = {
            uri: " game/ use_props ",
            enqueue: !0
          }, e[i.RequestType.ReceiveGift] = {
            uri: " tasks/ receive_gift ",
            enqueue: !0
          }, e[i.RequestType.Relive] = {
            uri: " game/ relive ",
            enqueue: !0
          }, e[i.RequestType.GetBillboard] = {
            uri: " game/ get_billboard ",
            enqueue: !0
          }, e[i.RequestType.Offline] = {
            uri: " main/ offline ",
            enqueue: !0
          }, e[i.RequestType.FreeDiamond] = {
            uri: " tasks/ free_diamond ",
            enqueue: !0
          }, e[i.RequestType.DiamondList] = {
            uri: " iap/ charge_list ",
            enqueue: !0
          }, e[i.RequestType.UseDiamond] = {
            uri: " game/ exchange_props ",
            enqueue: !0
          }, e[i.RequestType.CreateOrder] = {
            uri: " iap/ create_order ",
            enqueue: !0
          }, e[i.RequestType.VerifyOrder] = {
            uri: " iap/ order_verify ",
            enqueue: !0
          }, e[i.RequestType.CheckOrderStatus] = {
            uri: " iap/ order_status ",
            enqueue: !0
          }, e[i.RequestType.RePairOrder] = {
            uri: " iap/ repair_order ",
            enqueue: !0
          }, e[i.RequestType.PayerMaxCreateOrder] = {
            uri: " iap2/ create_order ",
            enqueue: !0
          }, e[i.RequestType.PayerMaxCheckOrderStatus] = {
            uri: " iap2/ order_status ",
            enqueue: !0
          }, e[i.RequestType.SubmitLevel] = {
            uri: " game/ submit_level ",
            enqueue: !0
          }, e[i.RequestType.SubmitGuideLevel] = {
            uri: " game/ submit_guide ",
            enqueue: !0
          }, e[i.RequestType.SignIn] = {
            uri: " game/ sign_in ",
            enqueue: !0
          }, e[i.RequestType.GetClub] = {
            uri: " game/ get_club ",
            enqueue: !0
          }, e[i.RequestType.ExchangeClub] = {
            uri: " game/ exchange_club ",
            enqueue: !0
          }, e[i.RequestType.ChangeClub] = {
            uri: " game/ change_club ",
            enqueue: !0
          }, e[i.RequestType.HeadName] = {
            uri: " behaviors/ scroll_msg ",
            enqueue: !0
          }, e[i.RequestType.ReportAD] = {
            uri: " game/ report_ad ",
            enqueue: !0
          }, e[i.RequestType.ClubGold] = {
            uri: " game/ club_gold ",
            enqueue: !0
          }, e[i.RequestType.UseClubProp] = {
            uri: " game/ user_prop ",
            enqueue: !0
          }, e[i.RequestType.ChouJiang] = {
            uri: " game/ luck_draw ",
            enqueue: !0
          }, e[i.RequestType.GetLevelConfig] = {
            uri: " game/ lc ",
            enqueue: !0
          }, e[i.RequestType.Regional] = {
            uri: " regional_validation ",
            enqueue: !1
          }, e[i.RequestType.GmChangeLevel] = {
            uri: " gm/ change_level ",
            enqueue: !0
          }, e[i.RequestType.GMRestSign] = {
            uri: " gm/ reset_sign ",
            enqueue: !0
          }, e[i.RequestType.GMChangeCash] = {
            uri: " gm/ change_cash ",
            enqueue: !0
          }, e[i.RequestType.GMGetClubShard] = {
            uri: " gm/ add_club_shard ",
            enqueue: !0
          }, e[i.RequestType.GMGetCpmRecord] = {
            uri: " gm/ cpm_record ",
            enqueue: !0
          }, e[i.RequestType.GMAddSignInCount] = {
            uri: " gm/ sing_in_day ",
            enqueue: !0
          }, e[i.RequestType.GmAddDiamond] = {
            uri: " gm/ add_diamond ",
            enqueue: !0
          }, e[i.RequestType.GmToLevel] = {
            uri: " gm/ to_level ",
            enqueue: !0
          }, e);
          var e;
        }
        e.getInstance = function () {
          return e._instance ? e._instance : e._instance = new e();
        };
        e.prototype.getUrl = function (e) {
          var t = this._urlMap.get(e);
          if (null == t) {
            t = n.default.get_request_url() + this.getUri(e);
            this._urlMap.set(e, t);
          }
          return t;
        };
        e.prototype.needEnqueue = function (e) {
          return !!this.requestUrl[e] && this.requestUrl[e].enqueue;
        };
        e.prototype.getUri = function (e) {
          return this.requestUrl[e] ? this.requestUrl[e].uri : " ";
        };
        e.prototype.getConfmeUrl = function (e) {
          return n.default.getConfmeBaseUrl() + this.getUri(e);
        };
        return e;
      }();
    o.default = a;
    cc._RF.pop();
