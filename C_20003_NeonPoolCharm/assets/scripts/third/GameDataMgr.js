let e = require;let t = module;let o = exports;
    "use strict";

    cc._RF.push(t, "ad326a4cCFN95Y46UHVAxKy", "GameDataMgr");
    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    o.failReason = o.WebUrlType = o.AD_TYPE = o.EffectEnum = void 0;
    var n = e("PlayerDataSys.js"),
      i = e("SystemDataSys.js"),
      a = e("EngineUtil.js"),
      r = e("UiManage.js");
    o.EffectEnum = cc.Enum({
      cash: 0,
      gold: 1
    });
    o.AD_TYPE = {
      lucky_box: "lucky_box",
      relive: "relive"
    };
    o.WebUrlType = {
      USER_TYPE: "USER_TYPE",
      PRIVACY_TYPE: "PRIVACY_TYPE",
      USER_QUERY: "USER_QUERY"
    };
    o.failReason = cc.Enum({
      account_error: 2,
      account_abnormal: 3,
      merchat_exception: 4,
      system_error: 5,
      unknown_error: 9
    });
    var l = function () {
      function e() {
        this.taskItem = null;
        this.taskItemPool = new cc.NodePool();
        this.rankItem = null;
        this.rankItemPool = new cc.NodePool();
        this.withdrawItem = null;
        this.withdrawItemPool = new cc.NodePool();
        this.rollingItem = null;
        this.rollingItemPool = new cc.NodePool();
        this.Level = null;
        this.LevelPool = new cc.NodePool();
        this.kali = null;
        this.kaliPool = new cc.NodePool();
        this.propeffect = null;
        this.propeffectPool = new cc.NodePool();
        this.board_try_times = [];
        this.board_frequency = [];
        this.get_free_diamond_flag = !1;
        this.open_billboard_flag = !1;
        this.into_extract_flag = !1;
        this.click_add_slot = !1;
        this.card_slot_number = 0;
        this.charge_list = [];
        this.subsidy_remove_reward = 0;
        this.remove_reward = 0;
        this.level_1 = [];
        this.level_2 = [];
        this.level_3 = [];
        this.level_4_1 = [];
        this.level_4_2 = [];
        this.level_config = [];
        this.extract_info_can = [];
        this.lucky_box_current_count = 0;
        this.lucky_box_daily_max_count = 0;
        this.lucky_box_diamond = 0;
        this.level_map = [];
        this.LevelArr = [];
        this.Trough_map = [];
        this.Shift_map = [];
        this.averageWithdrawCash = 0;
        this.averageChallengeTimes = 0;
        this.todayPassNum = 0;
        this.sroll_msg_list = [];
        this.level_4_1_num = 0;
        this.level_4_2_num = 0;
        this.removedata = null;
        this.removedata2 = null;
        this.attempt_count = null;
      }
      e.prototype.getExtractState = function (e) {
        for (var t = 0; t < this.extract_info_can.length; t++) {
          var o = this.extract_info_can[t];
          if (o.level == e) return o.status;
        }
        return 0;
      };
      e.prototype.initPropEffectPool = function (e, t) {
        void 0 === t && (t = 3);
        if (e) {
          this.propeffect = e;
          if (this.propeffectPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.propeffectPool.put(n);
          }
        }
      };
      e._getInstance = function () {
        this._instance || (e._instance = new e());
        return e._instance;
      };
      e.prototype.setpropeffectPool = function (e) {
        this.propeffectPool.put(e);
      };
      e.prototype.is_reviewer = function () {
        return i.default.reviewing;
      };
      e.prototype.setAverageChallengeTimes = function () {
        this.attempt_count > 400 && (this.attempt_count = 400);
        var e = this.board_try_times[this.attempt_count - 1];
        if (e) {
          var t = e.average_tryTimes_max,
            o = e.average_tryTimes_min;
          e.tryTimes_show, e.tryTimes_show_rate, e.try_times;
          this.averageChallengeTimes = Number(a.default.random(o, t));
        }
      };
      e.prototype.clear = function () {};
      e.prototype.getkaliPool = function () {
        return this.kaliPool.size() > 0 ? this.kaliPool.get() : cc.instantiate(this.kali);
      };
      e.prototype.getWithdrawItem = function () {
        return this.withdrawItemPool.size() > 0 ? this.withdrawItemPool.get() : cc.instantiate(this.withdrawItem);
      };
      e.prototype.getSubsidyRemoveReward = function () {
        var e = this.subsidy_remove_reward;
        this.reward_10times.reward_10times_recharge_flag && (e *= 10);
        return e;
      };
      e.prototype.init = function (e) {
        e && this.initGameConfig(e);
      };
      e.prototype.setLevelPool = function (e) {
        this.LevelPool.put(e);
      };
      e.prototype.initWithdrawItemPool = function (e, t) {
        void 0 === t && (t = 60);
        if (e) {
          this.withdrawItem = e;
          if (this.withdrawItemPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.withdrawItemPool.put(n);
          }
        }
      };
      e.prototype.getNoticeTimeData = function () {
        for (var e = new Date().getHours(), t = 3; t < this.board_frequency.length; t++) {
          var o = this.board_frequency[t],
            n = (o.id, o.level_rule, o.show_duration, o.show_duration_rate, o.time_rule_max),
            i = o.time_rule_min;
          if (e < n && e >= i) return this.board_frequency[t];
        }
      };
      e.prototype.getTodayPassNum = function () {
        return this.todayPassNum;
      };
      e.prototype.addAverageChallengeTimes = function (e) {
        var t = (this.averageChallengeTimes * (this.todayPassNum - 1) + e) / this.todayPassNum,
          o = Math.floor(100 * t) / 100;
        this.averageChallengeTimes = o;
      };
      e.prototype.setAverageWithdrawCash = function () {
        var e = a.default.random(130, 180),
          t = a.default.random(7e4, 11e4);
        this.averageWithdrawCash = this.averageChallengeTimes * (e + t);
      };
      e.prototype.setRemoveData = function (e) {
        this.removedata = e;
      };
      e.prototype.setkaliPool = function (e) {
        this.kaliPool.put(e);
      };
      e.prototype.getAverageChallengeTimes = function () {
        var e = n.default.user_level;
        return 1 == e || 2 == e ? 1 : 3 == e ? Math.floor(5 * Math.random() + 11) / 10 : 4 == e ? this.averageChallengeTimes : void 0;
      };
      e.prototype.getpropeffectPool = function () {
        return this.propeffectPool.size() > 0 ? this.propeffectPool.get() : cc.instantiate(this.propeffect);
      };
      e.prototype.initkaliPool = function (e, t) {
        void 0 === t && (t = 3);
        if (e) {
          this.kali = e;
          if (this.kaliPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.kaliPool.put(n);
          }
        }
      };
      e.prototype.getRemoveReward = function () {
        var e = this.remove_reward;
        this.reward_10times.reward_10times_recharge_flag && (e *= 10);
        return e;
      };
      e.prototype.getRankItem = function () {
        return this.rankItemPool.size() > 0 ? this.rankItemPool.get() : cc.instantiate(this.rankItem);
      };
      e.prototype.setrollingPool = function (e) {
        this.rollingItemPool.put(e);
      };
      e.prototype.initGameConfig = function (e) {
        if (e) {
          var t = e.extract_info_can,
            o = e.level_1,
            n = e.level_2,
            i = e.level_3,
            a = e.level_4_1,
            r = e.level_4_2,
            l = e.level_config_double,
            s = e.lucky_box_current_count,
            c = e.lucky_box_daily_max_count,
            u = e.lucky_box_diamond,
            p = e.props_status,
            d = (e.offline_data, e.level_statistics, e.board_try_times),
            _ = e.board_frequency,
            f = (e.diamond_recharge, e.task_counts),
            h = e.get_free_diamond_flag,
            g = e.open_billboard_flag,
            y = e.into_extract_flag,
            v = e.click_add_slot,
            m = e.card_slot_number,
            b = e.charge_list,
            C = e.reward_10times;
          e.is_reviewer;
          this.extract_info_can = t;
          this.level_1 = o;
          this.level_2 = n;
          this.level_3 = i;
          this.level_4_1 = a;
          this.level_4_2 = r;
          this.level_4_1_num = 1;
          this.level_4_2_num = 1;
          this.level_config = l;
          this.lucky_box_current_count = s;
          this.lucky_box_daily_max_count = c;
          this.lucky_box_diamond = u;
          this.props_status = p;
          this.board_try_times = d;
          this.board_frequency = _;
          this.today = "today";
          this.task_counts = f;
          this.attempt_count = 0;
          this.get_free_diamond_flag = h;
          this.open_billboard_flag = g;
          this.into_extract_flag = y;
          this.click_add_slot = v;
          this.card_slot_number = m;
          this.charge_list = b;
          this.reward_10times = C;
          var P = cc.sys.localStorage.getItem("offline_data");
          JSON.parse(P);
        }
      };
      e.prototype.initRankItemPool = function (e, t) {
        void 0 === t && (t = 60);
        if (e) {
          this.rankItem = e;
          if (this.rankItemPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.rankItemPool.put(n);
          }
        }
      };
      e.prototype.initrollingItemPool = function (e, t) {
        void 0 === t && (t = 20);
        if (e) {
          this.rollingItem = e;
          if (this.rollingItemPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.rollingItemPool.put(n);
          }
        }
      };
      e.prototype.setTodayPassNum = function (e) {
        this.todayPassNum = e;
      };
      e.prototype.setLevelMap = function (e) {
        switch (e) {
          case 1:
            this.level_map = this.level_1;
            break;
          case 2:
            this.level_map = this.level_2;
            break;
          case 3:
            this.level_map = this.level_3;
            break;
          case 4:
            this.level_map = this.level_4_1.concat(this.level_4_2);
        }
      };
      e.prototype.getTaskItem = function () {
        return this.taskItemPool.size() > 0 ? this.taskItemPool.get() : cc.instantiate(this.taskItem);
      };
      e.prototype.initTaskItemPool = function (e, t) {
        void 0 === t && (t = 60);
        if (e) {
          this.taskItem = e;
          if (this.taskItemPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.taskItemPool.put(n);
          }
        }
      };
      e.prototype.addTodayPassNum = function (e) {
        this.todayPassNum += e;
      };
      e.prototype.getAverageWithdrawCash = function () {
        var e = n.default.user_level;
        return 1 == e ? 20 : 2 == e ? 300 : 3 == e ? Number(a.default.random(880, 1150)) : 4 == e ? this.averageWithdrawCash : void 0;
      };
      e.prototype.getLevelPool = function () {
        return this.LevelPool.size() > 0 ? this.LevelPool.get() : cc.instantiate(this.Level);
      };
      e.prototype.initLevelPool = function (e, t) {
        void 0 === t && (t = 3);
        if (e) {
          this.Level = e;
          if (this.LevelPool.size() >= t) return;
          for (var o = 0; o < t; o++) {
            var n = cc.instantiate(e);
            this.LevelPool.put(n);
          }
        }
      };
      e.prototype.getrollingItem = function () {
        return this.rollingItemPool.size() > 0 ? this.rollingItemPool.get() : cc.instantiate(this.rollingItem);
      };
      e.prototype.setCardSpriteFrame = function (e, t) {
        cc.isValid(e) && r.UiManager.loadSpriteFrame(e, "card", "card_" + t);
      };
      e.prototype.getLevelCardArray = function () {};
      e.prototype.setRemoveData2 = function (e) {
        this.removedata2 = e;
      };
      e.prototype.getNoticeData = function () {
        this.attempt_count > 400 && (this.attempt_count = 400);
        var e = this.board_try_times[this.attempt_count - 1];
        null == e && (e = this.board_try_times[this.board_try_times.length - 1]);
        return e;
      };
      e.prototype.addAverageWithdrawCash = function (e) {
        this.averageWithdrawCash = Math.floor((this.averageWithdrawCash * (this.todayPassNum - 1) + e) / this.todayPassNum);
      };
      return e;
    }();
    o.default = l._getInstance();
    cc._RF.pop();
