import pathlib
root = pathlib.Path(r"D:\work\github\Unity_Games\Cocos_Games_201\C_20002_CashArrows\assets\scripts\third")
files = [
    "AdAnalyticsService.js",
    "AdCallbackParser.js",
    "AdEventType.js",
    "AdLegacyBridge.js",
    "AdRequestService.js",
    "AdToolbox.js",
    "Adapt.js",
    "ButtonClick.js",
    "CatmullRomHelper.js",
    "Common.js",
    "ConfigDefine.js",
    "EncryptXOR.js",
    "GameHelper.js",
    "GameConfigStore.js",
    "GEMgr.js",
    "GlobalEventMgr.js",
    "Handler.js",
    "FMBaseUI.js",
    "BusinessAnalyticsService.js",
    "BusinessCommonConfig.js",
    "BusinessHttpQueueHooks.js",
    "BusinessRequestDescriptors.js",
]
out = []
for f in files:
    text = (root / f).read_text(encoding="utf-8")
    out.append("=" * 20 + " " + f)
    for i, line in enumerate(text.splitlines(), 1):
        if any(ord(ch) > 127 for ch in line):
            out.append(f"{i}: {line.encode('unicode_escape').decode()}")
pathlib.Path("_extract_strings_out.txt").write_text("\n".join(out), encoding="utf-8")
print("wrote", len(out), "lines")
