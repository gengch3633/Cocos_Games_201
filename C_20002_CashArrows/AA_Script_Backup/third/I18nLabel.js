let e = require;
let t = module;
"use strict";
cc._RF.push(t, "babbbYixnxEDqnCwfXEfhoz", "I18nLabel");
var i = e("GlobalEventMgr"),
n = e("InterfaceMgr"),
a = e("LanguageService.js"),
o = e("RTLFontService.js"),
r = {
  "bn-BD": "bn"
}
,
s = cc.Class({
  extends: cc.Component, editor: {
    executeInEditMode: ! 0
  }
, properties: {
    i18nKey: {
      default: "", tooltip: "i18n key, e.g. key_withdraw_page_title"
    }
, fallback: {
      default: "", tooltip: "fallback text when key missing"
    }
, paramsText: {
      default: "", tooltip: 'params as JSON array or split with |, e.g. ["A","B"] or A|B'
    }
, previewLanguage: {
      default: "", tooltip: "editor preview language: zh-CN / en-US / id-ID / pt-BR / es-ES / bn-BD, empty means current language"
    }
, targetLabel: {
      default: null, type: cc.Label
    }
, targetRichText: {
      default: null, type: cc.RichText
    }
  }
, onLoad: function() {
    this.targetLabel|| (this.targetLabel = this.node.getComponent(cc.Label));
    this.targetRichText|| (this.targetRichText = this.node.getComponent(cc.RichText));
    this.bindLanguageEvent();
    this.refreshText();
  }
, onEnable: function() {
    this.refreshText();
  }
, onValidate: function() {
    this.refreshText();
  }
, onDestroy: function() {
    this.unbindLanguageEvent();
  }
, bindLanguageEvent: function() {
    i.default.getInstance().on(n.gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, unbindLanguageEvent: function() {
    i.default.getInstance().off(n.gameEvent.languageChanged, this.onLanguageChanged, this);
  }
, onLanguageChanged: function() {
    this.refreshText();
  }
, setI18nKey: function(e, t, i) {
    this.i18nKey = e|| "";
    void 0 !== i&& (this.fallback = i|| "");
    t&& t.push&& (this.paramsText = JSON.stringify(t));
    this.refreshText();
  }
, refreshText: function() {
    var e = String(this.i18nKey|| "").trim();
    if(e) {
      var t = this.parseParams(this.paramsText), i = this.getPreviewLanguage()|| a.getCurrentLanguage(), n = a.tWithLanguage(i, e, t, this.fallback|| e);
      this.targetLabel&& (this.targetLabel.string = n);
      this.targetRichText&& (this.targetRichText.string = n);
      this.applyNonLatinFont(r[i]);
    }
  }
, applyNonLatinFont: function(e) {
    if(this.targetLabel) {
      if(void 0 === this._originalFont) {
        this._originalFont = this.targetLabel.font|| null;
        this._originalUseSystemFont = ! ! this.targetLabel.useSystemFont;
      }
      if(e) {
        var t = o.getFont(e);
        if(t) {
          this.targetLabel.useSystemFont = ! 1;
          this.targetLabel.font = t;
          this._customFontApplied = ! 0;
        } else if(! o.isFailed(e)) {
          var i = this;
          o.ensureFont(e, function(t) {
            if(t&& i.isValid&& i.targetLabel) {
              var n = i.getPreviewLanguage()|| a.getCurrentLanguage();
              if(r[n] === e) {
                i.targetLabel.useSystemFont = ! 1;
                i.targetLabel.font = t;
                i._customFontApplied = ! 0;
              }
            }
          }
);
        }
      } else if(this._customFontApplied) {
        this.targetLabel.useSystemFont = this._originalUseSystemFont;
        this.targetLabel.font = this._originalFont;
        this._customFontApplied = ! 1;
      }
    }
  }
, getPreviewLanguage: function() {
    if(! cc.engine|| ! cc.engine.isEditor) return "";
    var e = String(this.previewLanguage|| "").trim();
    return e&& a.hasLanguage(e)? e: "";
  }
, parseParams: function(e) {
    var t = String(e|| "").trim();
    if(! t) return[];
    if("[" === t.charAt(0)) try {
      var i = JSON.parse(t);
      return i&& i.push? i:[];
    } catch(e) {
      cc.warn("[I18nLabel] paramsText JSON parse failed:", t);
    }
    for(var n = t.split("|"), a = [], o = 0;
    o < n.length;
    o++) a.push(String(n[o]|| "").trim());
    return a;
  }
}
);
t.exports = s;
t.exports.default = s;
cc._RF.pop();
