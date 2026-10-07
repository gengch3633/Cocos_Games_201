let e = require;
let t = module;
"use strict";
cc._RF.push(t, "35c6cMWPPdPgJ5Lej4Zj4kW", "I18nGroup");
var i = e("GlobalEventMgr"),
n = e(InterfaceMgr "
} ].js), a = cc.Class({
extends: cc.Component,
properties: {
refreshOnLoad: {
default: !0
},
refreshOnLanguageChanged: {
default: !1,
tooltip: " set true to trigger all i18n children refresh on language changed "
},
includeInactive: {
default: !1
},
recursive: {
default: !0
}
},
onLoad: function() {
this.bindLanguageEvent();
this.refreshOnLoad && this.refreshChildren();
},
onDestroy: function() {
this.unbindLanguageEvent();
},
bindLanguageEvent: function() {
i.default.getInstance().on(n.gameEvent.languageChanged, this.onLanguageChanged, this);
},
unbindLanguageEvent: function() {
i.default.getInstance().off(n.gameEvent.languageChanged, this.onLanguageChanged, this);
},
onLanguageChanged: function() {
this.refreshOnLanguageChanged && this.refreshChildren();
},
refreshChildren: function() {
this.refreshNode(this.node);
},
refreshNode: function(e) {
if (e && e.isValid && (e === this.node || this.includeInactive || e.active)) {
this.refreshNodeI18n(e);
if (this.recursive) for (var t = 0; t < e.childrenCount; t++) this.refreshNode(e.children[t]);
}
},
refreshNodeI18n: function(e) {
for (var t = e.getComponents(cc.Component) || [], i = 0; i < t.length; i++) {
var n = t[i];
if (n && n !== this) {
n.refreshText && " function " == typeof n.refreshText && n.refreshText();
n.refreshSprite && " function " == typeof n.refreshSprite && n.refreshSprite();
}
}
}
});
t.exports = a;
t.exports.default = a;
cc._RF.pop();
