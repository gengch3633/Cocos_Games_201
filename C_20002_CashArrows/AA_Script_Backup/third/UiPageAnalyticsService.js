let e = require;
let t = module;
let i = exports;
"use strict";
cc._RF.push(t, "9bb4dujMelEgbJc2L7Pg5nt", "UiPageAnalyticsService");
Object.defineProperty(i, "__esModule", {
  value: ! 0
}
);
var n = e("UIMgr.js"),
a = e("BusinessAnalyticsService.js"),
o = "[UiPageAnalyticsService]",
r = {
  "prefab/ui/homeUI": "home_page",
  "prefab/gameView": "game_page",
  "prefab/cashArrowReviveView": "revive_page",
  "prefab/withMoodView_v2": "withdraw_page",
  "prefab/arrowTaskPopup": "task_page",
  "prefab/cashArrowSetView": "withdraw_set_page",
  "prefab/cashArrowSettingView": "withdraw_setting_page",
  "prefab/cashArrowCheckView": "withdraw_check_page",
  "prefab/arrowSettleRewardView": "settle_reward_page",
  "prefab/cashArrowFailView": "fail_page"
}
,
s = ! 1,
l = [];
function c() {
  return Date.now();
}
function u(e, t) {
  if(e&& "string" == typeof e) for(var i = Object.keys(r), n = 0;
  n < i.length;
  n++) {
    var a = i[n];
    if(e === a|| e.indexOf(a) >= 0) return r[a];
  }
  return t&& t.isValid&& t.name? t.name: e|| "unknown";
}
function d(e, t) {
  try {
    var i = a&& (a.default|| a);
    i&& "function" == typeof i.reportData&& i.reportData(e, t);
  } catch(t) {
    console.warn(o+ " report error", e, t);
  }
}
function h(e, t) {
  if(e&& !(e.lastResumeTs <= 0)) {
    e.accumulatedMs+= Math.max(0, t- e.lastResumeTs);
    e.lastResumeTs = 0;
  }
}
function p(e, t) {
  e&& (e.lastResumeTs = t);
}
function _(e) {
  for(var t = l.length- 1;
  t >= 0;
  t--) if(l[t].key === e) return t;
  return- 1;
}
function f(e, t) {
  var i = c();
  if(!(_(e) >= 0)) {
    l.length > 0&& h(l[l.length- 1], i);
    l.push({
      key: e, actPage: t, lastResumeTs: i, accumulatedMs: 0
    }
);
    d("b_entry_game_page", {
      act_page: t
    }
);
  }
}
function g(e, t) {
  var i = c(),
  n = _(e);
  if(n < 0) d("b_leave_game_page", {
    act_page: t|| e|| "unknown", duration: 0
  }
);
  else {
    var a = l[n],
    o = n === l.length- 1;
    o&& h(a, i);
    l.splice(n, 1);
    d("b_leave_game_page", {
      act_page: a.actPage, duration: a.accumulatedMs
    }
);
    o&& l.length > 0&& p(l[l.length- 1], i);
  }
}
function m(e, t) {
  e&& f(e, u(e, t));
}
function y(e, t) {
  e&& g(e, u(e, t));
}
var v = {
  init: function() {
    if(! s) {
      var e = n&& (n.default|| n);
      if(e&& e.getInstance) {
        var t = e.getInstance(),
        i = e.EventType;
        if(t&& i) {
          s = ! 0;
          t.on(i.SHOW, function(e, t) {
            try {
              m(e, t);
            } catch(t) {
              console.warn(o+ " onUiShow error", e, t);
            }
          }
);
          t.on(i.HIDE, function(e, t) {
            try {
              y(e, t);
            } catch(t) {
              console.warn(o+ " onUiHide error", e, t);
            }
          }
);
          console.log(o+ " inited");
        } else console.warn(o+ " init skipped: UIMgr instance or EventType missing");
      } else console.warn(o+ " init skipped: UIMgr unavailable");
    }
  }
,
  trackEnter: function(e) {
    e&& f(e, e);
  }
,
  trackLeave: function(e) {
    e&& g(e, e);
  }
,
  _debugSnapshot: function() {
    return l.map(function(e) {
      return {
        key: e.key, actPage: e.actPage, isRunning: e.lastResumeTs > 0, accumulatedMs: e.accumulatedMs
      }
;
    }
);
  }
}
;
i.default = v;
t.exports = v;
t.exports.default = v;
cc._RF.pop();
