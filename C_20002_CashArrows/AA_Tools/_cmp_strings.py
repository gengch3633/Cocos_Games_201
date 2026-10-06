import pathlib

base = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third")

def strings(text):
    out = []
    i = 0
    n = len(text)
    while i < n:
        if text[i] == '"':
            j = i + 1
            buf = []
            while j < n:
                c = text[j]
                if c == "\\":
                    if j + 1 < n:
                        buf.append(text[j:j + 2])
                        j += 2
                        continue
                if c == '"':
                    out.append("".join(buf))
                    i = j + 1
                    break
                if c == "\n":
                    buf.append("\n")
                    j += 1
                    continue
                buf.append(c)
                j += 1
            else:
                i += 1
        else:
            i += 1
    return out

pairs = [
    ("FlyRewardAnimMgr.js", "FlyRewardAnimMgr.ts"),
    ("GlobalErrorHandler.js", "GlobalErrorHandler.ts"),
    ("GuideMaskNode.js", "GuideMaskNode.ts"),
    ("HotUpdateManager.js", "HotUpdateManager.ts"),
    ("I18nGroup.js", "I18nGroup.ts"),
    ("I18nSprite.js", "I18nSprite.ts"),
]
module_names = {
    "FlyRewardAnimMgr", "GlobalErrorHandler", "GuideMaskNode",
    "HotUpdateManager", "I18nGroup", "I18nSprite", "use strict", "__esModule",
}
out_lines = []
for a, b in pairs:
    ja = (base / a).read_text(encoding="utf-8")
    tb = (base / b).read_text(encoding="utf-8")
    js = strings(ja)
    ts = strings(tb)
    def short(items):
        kept = []
        for s in items:
            if "\n" in s and s.count("\n") > 1:
                continue
            if len(s) > 180:
                continue
            if s in module_names:
                continue
            if s.endswith(".js") or s.endswith(".js\""):
                continue
            kept.append(s)
        return kept
    js_s = short(js)
    ts_s = short(ts)
    missing = []
    for s in js_s:
        norm = s.replace("\n", "\\n")
        if s not in ts_s and norm not in ts_s:
            missing.append(s)
    out_lines.append("==== %s short-missing %d" % (a, len(missing)))
    for m in missing:
        out_lines.append(" MISSING " + repr(m))
    extra = []
    for s in ts_s:
        if s not in js_s and s.replace("\\n", "\n") not in js_s:
            extra.append(s)
    out_lines.append("---- extra in ts %d" % len(extra))
    for m in extra:
        out_lines.append(" EXTRA " + repr(m))

# method presence
need = {
    "GuideMaskNode.ts": ["find2", "showSingle2", "handDropTween", "handSingleTween", "createMaskNode", "updateMask", "clearTarget", "removeTarget", "addTarget", "findTarget", "guideType", "handTarget", "hide"],
    "HotUpdateManager.ts": ["getInstance", "_initManifestStr", "_initManifest", "getVersion", "getBaseVersion", "checkCb", "updateCb", "retry", "hotUpdate", "checkGrayUpdate", "getGrayVersion", "downloadFailedAssets", "versionCompareHandle", "ERROR_NO_LOCAL_MANIFEST", "ERROR_DOWNLOAD_MANIFEST", "ERROR_PARSE_MANIFEST", "ALREADY_UP_TO_DATE", "ERROR_DECOMPRESS", "UPDATE_PROGRESSION", "UPDATE_FINISHED", "UPDATE_FAILED", "ERROR_UPDATING", "NEW_VERSION_FOUND"],
    "FlyRewardAnimMgr.ts": ["_getIconNode", "_putIconNode", "_getLabelNode", "_putLabelNode", "playFlyAnim", "playIconPop", "playFloatText", "getWorldPos", "formatRewardText", "bezierTo"],
    "I18nGroup.ts": ["refreshOnLoad", "refreshOnLanguageChanged", "includeInactive", "recursive", "bindLanguageEvent", "unbindLanguageEvent", "refreshChildren", "refreshNodeI18n", "refreshText", "refreshSprite"],
    "I18nSprite.ts": ["i18nKey", "fallbackPath", "bundleName", "targetSprite", "setI18nKey", "getSpritePath", "refreshSprite", "_requestVersion"],
    "GlobalErrorHandler.ts": ["globalErrorRegister", "__errorHandler", "unhandledrejection", "apk_verions", "feishuWebhookUrl", "BUSINESS_COMMON_CONFIG"],
}
for name, keys in need.items():
    text = (base / name).read_text(encoding="utf-8")
    miss = [k for k in keys if k not in text]
    out_lines.append("KEYS %s %s" % (name, miss or "ok"))

path = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\_cmp_out.txt")
path.write_text("\n".join(out_lines), encoding="utf-8")
print("wrote", len(out_lines))
